// AI Voice Registration Assistant Service

// Define interface for SpeechRecognition window compatibility
interface IWindow extends Window {
  webkitSpeechRecognition?: any;
  SpeechRecognition?: any;
}

export type VoiceStatus = 'idle' | 'speaking' | 'listening' | 'paused' | 'disabled';

export interface VoiceEventHandlers {
  onStatusChange?: (status: VoiceStatus) => void;
  onTranscript?: (text: string, isUser: boolean) => void;
  onError?: (error: string) => void;
  onCommand?: (command: string, args?: string) => void;
}

export class VoiceAssistantService {
  private static instance: VoiceAssistantService | null = null;
  private synthesis: SpeechSynthesis | null = null;
  private recognition: any = null;
  private status: VoiceStatus = 'idle';
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private handlers: VoiceEventHandlers = {};
  private language: string = 'en-US';
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;
  private lastSpokenText: string = '';

  private constructor() {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        this.synthesis = window.speechSynthesis;
      }

      const win = window as IWindow;
      const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          this.recognition = new SpeechRecognition();
          this.recognition.continuous = false;
          this.recognition.interimResults = false;
          this.recognition.lang = this.language;

          this.recognition.onstart = () => {
            this.setStatus('listening');
          };

          this.recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            if (this.handlers.onTranscript) {
              this.handlers.onTranscript(transcript, true);
            }
            this.handleRecognizedCommand(transcript);
          };

          this.recognition.onerror = (event: any) => {
            // Handled gracefully
            if (event.error !== 'no-speech') {
              if (this.handlers.onError) {
                this.handlers.onError(`Voice recognition: ${event.error}`);
              }
            }
            this.setStatus('idle');
          };

          this.recognition.onend = () => {
            if (this.status === 'listening') {
              this.setStatus('idle');
            }
          };
        } catch {
          this.recognition = null;
        }
      }
    }
  }

  static getInstance(): VoiceAssistantService {
    if (!this.instance) {
      this.instance = new VoiceAssistantService();
    }
    return this.instance;
  }

  setHandlers(handlers: VoiceEventHandlers) {
    this.handlers = handlers;
  }

  setLanguage(lang: 'en' | 'es') {
    this.language = lang === 'es' ? 'es-US' : 'en-US';
    if (this.recognition) {
      this.recognition.lang = this.language;
    }
  }

  getStatus(): VoiceStatus {
    return this.status;
  }

  isSupported(): { synthesis: boolean; recognition: boolean } {
    return {
      synthesis: !!this.synthesis,
      recognition: !!this.recognition,
    };
  }

  private setStatus(newStatus: VoiceStatus) {
    this.status = newStatus;
    if (this.handlers.onStatusChange) {
      this.handlers.onStatusChange(newStatus);
    }
  }

  // Soft accessibility chime
  private playChime(pitch: number = 520, duration: number = 0.12) {
    try {
      if (typeof window !== 'undefined') {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          if (!this.audioCtx) this.audioCtx = new AudioCtx();
          if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
          }
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(pitch, this.audioCtx.currentTime);
          gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start();
          osc.stop(this.audioCtx.currentTime + duration);
        }
      }
    } catch {
      // AudioCtx silently handled
    }
  }

  speak(text: string, onEndCallback?: () => void) {
    if (this.isMuted || !this.synthesis) {
      if (onEndCallback) onEndCallback();
      return;
    }

    this.lastSpokenText = text;
    this.stopSpeaking();
    this.playChime(640, 0.08);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.language;
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    // Pick a natural voice if available
    const voices = this.synthesis.getVoices();
    const naturalVoice = voices.find(v => 
      v.lang.startsWith(this.language.slice(0, 2)) && 
      (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Premium'))
    ) || voices.find(v => v.lang.startsWith(this.language.slice(0, 2)));

    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onstart = () => {
      this.setStatus('speaking');
      if (this.handlers.onTranscript) {
        this.handlers.onTranscript(text, false);
      }
    };

    utterance.onend = () => {
      this.setStatus('idle');
      this.currentUtterance = null;
      if (onEndCallback) onEndCallback();
    };

    utterance.onerror = () => {
      this.setStatus('idle');
      this.currentUtterance = null;
    };

    this.currentUtterance = utterance;
    this.synthesis.speak(utterance);
  }

  repeat() {
    if (this.lastSpokenText) {
      this.speak(this.lastSpokenText);
    }
  }

  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
    this.currentUtterance = null;
    if (this.status === 'speaking') {
      this.setStatus('idle');
    }
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopSpeaking();
      this.setStatus('disabled');
    } else {
      this.setStatus('idle');
    }
    return this.isMuted;
  }

  isCurrentlyMuted(): boolean {
    return this.isMuted;
  }

  startListening() {
    if (!this.recognition || this.isMuted) {
      if (this.handlers.onError) {
        this.handlers.onError('Voice recognition is not available or voice is muted.');
      }
      return;
    }

    this.stopSpeaking();
    this.playChime(440, 0.1);
    try {
      this.recognition.start();
    } catch {
      // recognition may already be active
    }
  }

  stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // ignored
      }
    }
    this.setStatus('idle');
  }

  private handleRecognizedCommand(text: string) {
    const clean = text.toLowerCase().trim();

    if (clean.includes('repeat') || clean.includes('say again') || clean.includes('repetir')) {
      this.repeat();
      return;
    }

    if (clean.includes('next') || clean.includes('continue') || clean.includes('siguiente')) {
      if (this.handlers.onCommand) this.handlers.onCommand('next');
      return;
    }

    if (clean.includes('back') || clean.includes('previous') || clean.includes('anterior')) {
      if (this.handlers.onCommand) this.handlers.onCommand('back');
      return;
    }

    if (clean.includes('help') || clean.includes('what is this') || clean.includes('ayuda')) {
      if (this.handlers.onCommand) this.handlers.onCommand('help');
      return;
    }

    if (clean.includes('mute') || clean.includes('silence') || clean.includes('silencio')) {
      this.toggleMute();
      return;
    }

    // Default: pass speech to parent for smart matching
    if (this.handlers.onCommand) {
      this.handlers.onCommand('speech_input', text);
    }
  }
}
