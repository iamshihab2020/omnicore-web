// Hook to play sound effects in the browser
export const useSoundEffect = () => {
  const playAddToCartSound = () => {
    // Only execute in browser environment
    if (typeof window === "undefined") return;

    try {
      // Create an AudioContext
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      // Create an oscillator for a quick "pop" sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      // Connect the oscillator to the gain node and the gain node to the destination
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Configure the oscillator
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // Higher pitch
      oscillator.frequency.exponentialRampToValueAtTime(
        400,
        audioContext.currentTime + 0.2
      ); // Lower pitch

      // Configure the gain node for volume fade-out
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); // Start at 10% volume
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.2
      ); // Fade out

      // Play the sound
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  return { playAddToCartSound };
};
