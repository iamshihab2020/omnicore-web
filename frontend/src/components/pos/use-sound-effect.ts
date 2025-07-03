// Hook to play sound effects in the browser

// Properly extend the Window interface using declaration merging
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

export const useSoundEffect = () => {
  const playAddToCartSound = () => {
    // Only execute in browser environment
    if (typeof window === "undefined") return;

    try {
      // Create an AudioContext with proper type handling
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContextClass();

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
      ); // Fade out      // Play the sound
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.2);

      // Clean up resources after sound finishes playing
      setTimeout(() => {
        gainNode.disconnect();
        oscillator.disconnect();
      }, 300); // Slightly longer than the sound duration
    } catch (error: unknown) {
      // More robust error handling
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error playing sound:", errorMessage);
    }
  };

  // Add a different sound effect for checkout
  const playCheckoutSound = () => {
    if (typeof window === "undefined") return;

    try {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContextClass();

      // Create a more complex sound for checkout
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Configure for a "cash register" type sound
      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        600,
        audioContext.currentTime + 0.1
      );
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
      oscillator.frequency.exponentialRampToValueAtTime(
        400,
        audioContext.currentTime + 0.3
      );

      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.3
      );

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.3);

      setTimeout(() => {
        gainNode.disconnect();
        oscillator.disconnect();
      }, 400);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error playing checkout sound:", errorMessage);
    }
  };

  return { playAddToCartSound, playCheckoutSound };
};
