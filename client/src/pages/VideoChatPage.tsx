import { useState, useRef, useEffect } from 'react';
import SimliAvatar from '../components/SimliAvatar';
import { Send, Sparkles, ArrowLeft, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { decodeAndResample } from '../utils/audio';
import { Link } from 'react-router-dom';

export default function VideoChatPage() {
  const [text, setText] = useState('');
  const [simliClient, setSimliClient] = useState<any>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAvatarReady, setIsAvatarReady] = useState(false);

  const handleSpeak = async () => {
    if (!text || !simliClient || isSpeaking) return;

    const currentText = text;
    setText('');
    setIsSpeaking(true);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: currentText }),
      });

      if (!response.ok) throw new Error('Failed to generate speech');

      const mp3ArrayBuffer = await response.arrayBuffer();
      const pcmUint8Array = await decodeAndResample(mp3ArrayBuffer);

      // Send to Simli
      simliClient.sendAudioData(pcmUint8Array);

      // Estimate finish
      const durationMs = (pcmUint8Array.length / 32000) * 1000;
      setTimeout(() => {
        setIsSpeaking(false);
      }, durationMs + 500);

    } catch (error) {
      console.error('Speech error:', error);
      setIsSpeaking(false);
    }
  };

  return (
    <main className="h-screen w-screen bg-[#050506] text-white flex flex-col items-center justify-between relative overflow-hidden font-sans border-4 border-white/5">
      {/* Immersive Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_15%,_#4f46e5_0%,_transparent_55%)] opacity-15 pointer-events-none" />
      <div className="absolute inset-0 bg-grid-white/[0.015] pointer-events-none" />
      
      {/* Static Header */}
      <header className="w-full flex justify-between items-center px-10 h-20 shrink-0 z-40">
        <Link to="/dashboard" className="flex items-center gap-3 text-white/50 hover:text-white transition-all bg-white/5 px-5 py-2 rounded-full border border-white/10 backdrop-blur-xl group hover:border-white/20 hover:bg-white/10">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-1">Exit</span>
        </Link>
        <div className="flex gap-4">
           <div className="bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-xl flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] font-bold text-white/70 uppercase tracking-widest">Connected</span>
           </div>
           <button className="p-2.5 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
              <Maximize2 className="w-4 h-4 text-white/40 hover:text-white" />
           </button>
        </div>
      </header>

      {/* Main Experience Space - Fills All Availabel Space without scroll */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex-1 w-full relative flex flex-col items-center justify-center px-10 py-4 min-h-0"
      >
        <div className="absolute inset-0 bg-indigo-500/5 rounded-[4rem] blur-[120px] pointer-events-none animate-pulse-slow lg:mx-40" />
        
        {/* Avatar Container - Compact 350x350 Square */}
        <div className="w-[350px] h-[350px] aspect-square relative bg-black/60 rounded-[2.5rem] border border-white/10 overflow-hidden shadow-[0_0_100px_-20px_rgba(79,70,229,0.2)] ring-1 ring-white/10 group backdrop-blur-3xl mb-8 shrink-0">
           <SimliAvatar 
              onClientReady={(client) => {
                setSimliClient(client);
                setIsAvatarReady(true);
              }} 
              isTalking={isSpeaking} 
            />
        </div>

        {/* Floating Control Dock - Compact 350px Width */}
        <div className="w-[350px] relative group shrink-0 mb-6">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-blue-500/20 to-purple-500/20 rounded-[2.5rem] blur opacity-40 group-focus-within:opacity-100 transition duration-700" />
            
            <div className="relative bg-[#0A0A0B]/90 border border-white/10 rounded-[2.5rem] p-3.5 backdrop-blur-3xl shadow-2xl flex items-center gap-4">
               <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Ask Me..."
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSpeak())}
                  className="flex-1 bg-transparent border-none py-2 text-[15px] text-white/90 focus:outline-none transition-all resize-none placeholder:text-gray-800 h-12 translate-y-1.5 font-medium overflow-hidden"
               />
               
               <button
                  onClick={handleSpeak}
                  disabled={!text || !isAvatarReady || isSpeaking}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white w-11 h-11 rounded-full transition-all flex items-center justify-center active:scale-90 shrink-0 border border-white/10 group/btn"
               >
                  {isSpeaking ? (
                    <div className="flex gap-1 px-1 scale-80">
                      <div className="w-1.5 h-1.5 bg-white/40 animate-bounce delay-75 rounded-full" />
                      <div className="w-1.5 h-1.5 bg-white animate-bounce delay-100 rounded-full" />
                      <div className="w-1.5 h-1.5 bg-white/40 animate-bounce delay-150 rounded-full" />
                    </div>
                  ) : (
                    <Send className="w-4.5 h-4.5 transition-transform" />
                  )}
               </button>
            </div>
         </div>
      </motion.div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.2; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s infinite ease-in-out;
        }
        .bg-grid-white {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='white'%3E%3Cpath d='M0 .5H31.5V32'/%3E%3C/svg%3E");
        }
      `}</style>
    </main>
  );
}
