class AudioManager {
  private keypressAudio: HTMLAudioElement | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.keypressAudio = new Audio('/press_down.mp3');
      this.keypressAudio.volume = 0.2;
    }
  }

  playKeypressSound(): void {
    if (this.keypressAudio) {
      this.keypressAudio.currentTime = 0;
      this.keypressAudio.play().catch((error) => {
        console.error('Failed to play keypress sound:', error);
      });
    }
  }

  speakText(text: string): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      speechSynthesis.speak(utterance);
    }
  }

  stopSpeaking(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  }

  replayText(text: string): void {
    this.stopSpeaking();
    setTimeout(() => this.speakText(text), 100);
  }
}

export const audioManager = new AudioManager();