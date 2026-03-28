export async function decodeAndResample(arrayBuffer: ArrayBuffer, targetSampleRate = 16000, speed = 1.2) {
  const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
  const audioContext = new AudioContextClass();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  // Adjusted duration for higher playback speed
  const adjustedDuration = audioBuffer.duration / speed;
  
  const offlineContext = new OfflineAudioContext(
    1, // mono
    Math.ceil(adjustedDuration * targetSampleRate),
    targetSampleRate
  );

  const source = offlineContext.createBufferSource();
  source.buffer = audioBuffer;
  source.playbackRate.value = speed; // Set custom speed
  source.connect(offlineContext.destination);
  source.start();

  const resampledBuffer = await offlineContext.startRendering();
  const pcmData = resampledBuffer.getChannelData(0);

  // Convert Float32Array to Int16Array
  const int16Data = new Int16Array(pcmData.length);
  for (let i = 0; i < pcmData.length; i++) {
    const s = Math.max(-1, Math.min(1, pcmData[i]));
    int16Data[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }

  // Convert Int16Array to Uint8Array (Little Endian bytes)
  return new Uint8Array(int16Data.buffer);
}
