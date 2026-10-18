import React, { useState } from 'react';
import { 
  Bot, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  HelpCircle, 
  ArrowRight, 
  ChevronUp, 
  ChevronDown,
  Mic,
  MicOff,
  Sparkles
} from 'lucide-react';
import { VoiceStatus } from '../../services/voiceAssistant';

interface VoiceAssistantBarProps {
  status: VoiceStatus;
  currentMessage: string;
  isMuted: boolean;
  onToggleMute: () => void;
  onRepeat: () => void;
  onAskHelp: () => void;
  onNextStep: () => void;
  onStartListening: () => void;
  onStopListening: () => void;
  activeFieldName?: string;
  language: 'en' | 'es';
}

export const VoiceAssistantBar: React.FC<VoiceAssistantBarProps> = ({
  status,
  currentMessage,
  isMuted,
  onToggleMute,
  onRepeat,
  onAskHelp,
  onNextStep,
  onStartListening,
  onStopListening,
  activeFieldName,
  language,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <aside 
      aria-label="AI Voice Registration Guide"
      className="fixed bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-1rem)] sm:w-full max-w-2xl px-0 sm:px-4 transition-all duration-300"
    >
      <div className={`bg-white/95 backdrop-blur-md rounded-2xl border border-blue-200/80 shadow-elevated p-2.5 sm:p-4 transition-all duration-300 ${
        isMuted ? 'opacity-90 bg-slate-100/90 border-slate-300' : ''
      }`}>
        <div className="flex items-center justify-between gap-1.5 sm:gap-3">
          {/* Audio Waveform Avatar & Text */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className={`relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl shrink-0 flex items-center justify-center transition-all duration-300 shadow-sm ${
              isMuted 
                ? 'bg-slate-200 text-slate-500 border border-slate-300' 
                : status === 'speaking' 
                ? 'bg-gradient-to-tr from-[#0052CC] via-[#0066FF] to-[#00C8FF] text-white shadow-[0_4px_16px_rgba(0,102,255,0.35)] ring-2 ring-blue-300/50'
                : status === 'listening'
                ? 'bg-gradient-to-tr from-amber-500 to-amber-400 text-white shadow-md ring-2 ring-amber-200'
                : 'bg-[#EBF8FE] border border-blue-200 text-[#0066FF]'
            }`}>
              {/* Dynamic Equalizer Waveform Bars */}
              <div className="flex items-center gap-[2px] sm:gap-[2.5px] h-4 sm:h-5 justify-center">
                <span className={`w-[2px] sm:w-[2.5px] rounded-full transition-all duration-300 ${
                  isMuted
                    ? 'bg-slate-400 h-1.5'
                    : status === 'speaking'
                    ? 'bg-white animate-wave-1'
                    : status === 'listening'
                    ? 'bg-white animate-pulse h-2.5'
                    : 'bg-[#0066FF] h-2'
                }`} />
                <span className={`w-[2px] sm:w-[2.5px] rounded-full transition-all duration-300 ${
                  isMuted
                    ? 'bg-slate-400 h-2.5'
                    : status === 'speaking'
                    ? 'bg-white animate-wave-2'
                    : status === 'listening'
                    ? 'bg-white animate-pulse h-3.5'
                    : 'bg-[#0066FF] h-3.5'
                }`} />
                <span className={`w-[2px] sm:w-[2.5px] rounded-full transition-all duration-300 ${
                  isMuted
                    ? 'bg-slate-400 h-3.5'
                    : status === 'speaking'
                    ? 'bg-white animate-wave-3'
                    : status === 'listening'
                    ? 'bg-white animate-pulse h-4'
                    : 'bg-[#0066FF] h-4'
                }`} />
                <span className={`w-[2px] sm:w-[2.5px] rounded-full transition-all duration-300 ${
                  isMuted
                    ? 'bg-slate-400 h-2.5'
                    : status === 'speaking'
                    ? 'bg-white animate-wave-4'
                    : status === 'listening'
                    ? 'bg-white animate-pulse h-3.5'
                    : 'bg-[#0066FF] h-3'
                }`} />
                <span className={`w-[2px] sm:w-[2.5px] rounded-full transition-all duration-300 ${
                  isMuted
                    ? 'bg-slate-400 h-1.5'
                    : status === 'speaking'
                    ? 'bg-white animate-wave-5'
                    : status === 'listening'
                    ? 'bg-white animate-pulse h-2'
                    : 'bg-[#0066FF] h-1.5'
                }`} />
              </div>

              {/* Glowing active broadcast ping */}
              {status === 'speaking' && !isMuted && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C8FF] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0066FF] border-2 border-white"></span>
                </span>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="text-[11px] sm:text-xs font-bold text-slate-900 tracking-tight truncate max-w-[95px] xs:max-w-[130px] sm:max-w-none">
                  Voice Guide
                </span>
                <span className={`text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${
                  isMuted 
                    ? 'bg-slate-200 text-slate-600'
                    : status === 'speaking' 
                    ? 'bg-blue-100 text-[#0066FF] animate-pulse font-bold'
                    : status === 'listening'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-[#EBF8FE] text-[#0066FF]'
                }`}>
                  {isMuted ? 'Muted' : status === 'speaking' ? 'Speaking' : status === 'listening' ? 'Listening' : 'Ready'}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate max-w-[110px] xs:max-w-[160px] sm:max-w-xs mt-0.5">
                {activeFieldName 
                  ? (language === 'es' ? `Campo: ${activeFieldName}` : `Field: ${activeFieldName}`)
                  : (language === 'es' ? 'Guiando registro' : 'Guiding patient intake')}
              </p>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Listen mic button */}
            <button
              onClick={status === 'listening' ? onStopListening : onStartListening}
              className={`p-1.5 sm:p-2 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
                status === 'listening' 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title={status === 'listening' ? 'Stop listening' : 'Voice command'}
            >
              {status === 'listening' ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              <span className="text-[10px] hidden md:inline">{status === 'listening' ? 'Stop' : 'Speak'}</span>
            </button>

            {/* Repeat button */}
            <button
              onClick={onRepeat}
              disabled={isMuted}
              className="p-1.5 sm:p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 transition"
              title="Repeat last instruction"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Explain current field */}
            <button
              onClick={onAskHelp}
              disabled={isMuted}
              className="px-2 py-1.5 sm:px-2.5 sm:py-2 rounded-lg bg-[#EBF8FE] hover:bg-blue-100 text-[#0066FF] font-medium text-xs flex items-center gap-1 transition"
              title="Explain field"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Explain</span>
            </button>

            {/* Next step prompt */}
            <button
              onClick={onNextStep}
              className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-[#0066FF] hover:bg-[#0052CC] text-white font-medium text-xs flex items-center gap-1 shadow-sm transition"
              title="Proceed to next section"
            >
              <span className="hidden sm:inline">Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Mute button */}
            <button
              onClick={onToggleMute}
              className={`p-1.5 sm:p-2 rounded-lg transition ${
                isMuted ? 'bg-slate-200 text-slate-800 font-bold' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            {/* Collapse toggle */}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              title={isMinimized ? 'Expand' : 'Collapse'}
            >
              {isMinimized ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Spoken Text Transcript Drawer */}
        {!isMinimized && (
          <div className="mt-2 pt-2 border-t border-slate-100 text-xs">
            <div className="bg-slate-50 rounded-xl p-2 sm:p-2.5 text-slate-700 flex items-start gap-2 border border-slate-200/60">
              <span className="text-[#0066FF] font-bold shrink-0 text-[10px] sm:text-[11px] mt-0.5">AI Guidance:</span>
              <p className="italic text-slate-800 leading-relaxed text-[11px] sm:text-[11.5px] break-words">
                "{currentMessage || 'Welcome! You can fill the form using keyboard or listen to audio guidance as you go.'}"
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-[10px] text-slate-500 mt-1 px-1 font-medium gap-0.5">
              <span>Supports voice commands: <em>"Next"</em>, <em>"Repeat"</em>, <em>"Help"</em>, <em>"Mute"</em></span>
              <span className="text-[#0066FF] font-semibold">100% Client-Side Privacy</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
