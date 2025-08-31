// Performance optimization utilities for AssistConnect

// Debounce function for input handling
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function for frequent events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Audio context optimization
export class AudioManager {
  private static instance: AudioManager;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  async getAudioContext(): Promise<AudioContext> {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
    
    return this.audioContext;
  }

  async createAnalyser(): Promise<AnalyserNode> {
    if (!this.analyser) {
      const context = await this.getAudioContext();
      this.analyser = context.createAnalyser();
      this.analyser.fftSize = 256;
    }
    return this.analyser;
  }

  cleanup(): void {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.analyser = null;
  }
}

// Speech synthesis optimization
export class SpeechManager {
  private static instance: SpeechManager;
  private utteranceQueue: SpeechSynthesisUtterance[] = [];
  private isProcessing = false;

  static getInstance(): SpeechManager {
    if (!SpeechManager.instance) {
      SpeechManager.instance = new SpeechManager();
    }
    return SpeechManager.instance;
  }

  speak(text: string, options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
    voice?: SpeechSynthesisVoice;
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      
      if (options) {
        if (options.rate) utterance.rate = options.rate;
        if (options.pitch) utterance.pitch = options.pitch;
        if (options.volume) utterance.volume = options.volume;
        if (options.voice) utterance.voice = options.voice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(event);

      this.utteranceQueue.push(utterance);
      this.processQueue();
    });
  }

  private processQueue(): void {
    if (this.isProcessing || this.utteranceQueue.length === 0) return;

    this.isProcessing = true;
    const utterance = this.utteranceQueue.shift()!;
    
    utterance.onend = () => {
      this.isProcessing = false;
      this.processQueue();
    };

    speechSynthesis.speak(utterance);
  }

  stop(): void {
    speechSynthesis.cancel();
    this.utteranceQueue = [];
    this.isProcessing = false;
  }
}

// Local storage optimization
export class StorageManager {
  private static readonly PREFIX = 'assistconnect_';

  static set(key: string, value: any): void {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(this.PREFIX + key, serialized);
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  static get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(this.PREFIX + key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error('Failed to read from localStorage:', error);
      return defaultValue || null;
    }
  }

  static remove(key: string): void {
    localStorage.removeItem(this.PREFIX + key);
  }

  static clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }
}

// Memory management for media streams
export class MediaManager {
  private static activeStreams: MediaStream[] = [];

  static addStream(stream: MediaStream): void {
    this.activeStreams.push(stream);
  }

  static removeStream(stream: MediaStream): void {
    const index = this.activeStreams.indexOf(stream);
    if (index > -1) {
      this.activeStreams.splice(index, 1);
    }
    
    // Stop all tracks
    stream.getTracks().forEach(track => track.stop());
  }

  static cleanup(): void {
    this.activeStreams.forEach(stream => {
      stream.getTracks().forEach(track => track.stop());
    });
    this.activeStreams = [];
  }
}

// Accessibility helpers
export const AccessibilityUtils = {
  // Announce to screen readers
  announce: (message: string): void => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },

  // Focus management
  trapFocus: (element: HTMLElement): (() => void) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  }
};

export default {
  debounce,
  throttle,
  AudioManager,
  SpeechManager,
  StorageManager,
  MediaManager,
  AccessibilityUtils
};