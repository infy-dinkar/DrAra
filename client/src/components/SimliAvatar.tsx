'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { SimliClient } from 'simli-client';
import { Play, AlertCircle, RefreshCcw } from 'lucide-react';

interface SimliAvatarProps {
  onClientReady: (client: any) => void;
  isTalking: boolean;
}

export default function SimliAvatar({ onClientReady, isTalking }: SimliAvatarProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const clientRef = useRef<any>(null);
  const [status, setStatus] = useState('Initializing');
  const [isReady, setIsReady] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [needsInteraction, setNeedsInteraction] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startAvatar = useCallback(async () => {
    if (isReady) return;
    
    // Reset state for a fresh start
    setIsConnecting(true);
    setError(null);
    setNeedsInteraction(false);
    setStatus('Contacting Server...');

    try {
      if (!videoRef.current || !audioRef.current) {
         throw new Error('Video/Audio refs not ready');
      }

      console.log('Fetching session token...');
      const response = await fetch('/api/simli/token', { method: 'POST' });
      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to authenticate with health-node');
      }

      console.log('Session token received. Initializing client...');
      setStatus('Starting WebRTC...');

      // Cleanup existing client
      if (clientRef.current) {
        try { clientRef.current.stop(); } catch (e) {}
        clientRef.current = null;
      }

      const simliClient = new SimliClient(
        data.sessionToken,
        videoRef.current,
        audioRef.current,
        data.iceServers || [],
        1, // Lvl.SILENT
        'livekit'
      );

      clientRef.current = simliClient;

      simliClient.on('start', () => {
        console.log('Simli Connected!');
        setStatus('Ready');
        setIsReady(true);
        setIsConnecting(false);
        onClientReady(simliClient);
      });

      simliClient.on('stop', () => {
        console.log('Simli Stopped');
        setIsReady(false);
        setIsConnecting(false);
        setStatus('Disconnected');
      });

      simliClient.on('error', (err: any) => {
        console.error('Simli SDK Internal Error:', err);
        setError(`SDK Error: ${JSON.stringify(err)}`);
        setIsReady(false);
        setIsConnecting(false);
        setStatus('Failed');
      });

      // Actually try to start
      await simliClient.start();
      
    } catch (err: any) {
      console.error('Simli Startup Error:', err);
      setStatus('Failed');
      setError(err.message || 'Unknown Startup Error');
      setIsConnecting(false);
      
      if (err.message.includes('interaction') || err.message.includes('play()')) {
        setNeedsInteraction(true);
      }
    }
  }, [isReady, onClientReady]);

  useEffect(() => {
    const timer = setTimeout(() => {
        startAvatar();
    }, 2000);
    
    return () => {
      clearTimeout(timer);
      if (clientRef.current) {
        try { clientRef.current.stop(); } catch (e) {}
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-[#050506] rounded-[2.5rem] overflow-hidden group flex items-center justify-center">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        width="1280"
        height="720"
        className={`w-full h-full object-contain transition-opacity duration-1000 ${isReady ? 'opacity-100' : 'opacity-0'}`}
      />
      <audio ref={audioRef} autoPlay />
      
      {/* HUD: Status Overlay */}
      {!isReady && !needsInteraction && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050506]/90 backdrop-blur-md z-20 px-6 text-center">
             {!error ? (
                <>
                   <div className="w-12 h-12 rounded-full border-2 border-white/5 border-t-indigo-500 animate-spin mb-6" />
                   <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.4em] mb-1">{status}</p>
                </>
             ) : (
                <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                    <AlertCircle className="w-10 h-10 text-red-500 mb-6 opacity-30" />
                    <p className="text-[12px] font-bold text-red-500/80 uppercase tracking-widest mb-3">System Failure</p>
                    <p className="text-[10px] text-white/40 max-w-[240px] mb-8 font-medium bg-white/5 p-4 rounded-2xl border border-white/10">{error}</p>
                    <button 
                      onClick={() => { setError(null); startAvatar(); }}
                      className="flex items-center gap-3 px-8 py-3 bg-indigo-600/10 hover:bg-indigo-600/20 rounded-full border border-indigo-500/20 text-[10px] text-indigo-400 uppercase tracking-widest font-bold transition-all hover:scale-105 active:scale-95"
                    >
                      <RefreshCcw className="w-4 h-4" /> Reset Context
                    </button>
                </div>
             )}
        </div>
      )}

      {/* Manual Interaction Overlay */}
      {needsInteraction && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-3xl z-30">
            <button
              onClick={startAvatar}
              className="group relative bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-full font-bold shadow-2xl transition-all flex items-center gap-4 border border-white/10"
            >
              <Play fill="white" className="w-5 h-5 shadow-inner" />
              <span className="text-base tracking-wide uppercase">Connect Avatar</span>
            </button>
            <p className="text-[10px] text-white/20 mt-6 uppercase tracking-[0.2em]">Click to grant system permissions</p>
        </div>
      )}

      {/* Live Label */}
      {isReady && (
        <div className="absolute top-6 right-6 z-10 flex gap-2">
          <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
            <span className="text-[9px] text-white/80 font-bold uppercase tracking-widest">Dr. Aara</span>
          </div>
        </div>
      )}

      {/* Visual Feedback */}
      {isTalking && isReady && (
        <div className="absolute bottom-8 right-8 flex items-end gap-1.5 z-10">
          <div className="w-1.5 h-6 bg-indigo-500/50 animate-bounce delay-75 rounded-full" />
          <div className="w-1.5 h-10 bg-indigo-500 animate-bounce delay-100 rounded-full shadow-[0_0_10px_#6366f1]" />
          <div className="w-1.5 h-6 bg-indigo-500/50 animate-bounce delay-150 rounded-full" />
        </div>
      )}
    </div>
  );
}
