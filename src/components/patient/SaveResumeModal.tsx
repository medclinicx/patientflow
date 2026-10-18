import React, { useState } from 'react';
import { Bookmark, Copy, CheckCircle2, X, KeyRound, AlertCircle, ArrowRight } from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { PatientRegistration } from '../../types';

interface SaveResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: Partial<PatientRegistration>;
  onResumeSuccess: (resumedData: Partial<PatientRegistration>) => void;
}

export const SaveResumeModal: React.FC<SaveResumeModalProps> = ({
  isOpen,
  onClose,
  currentData,
  onResumeSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'save' | 'resume'>('save');
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [resumeCodeInput, setResumeCodeInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleGenerateSaveCode = () => {
    // Generate clean alphanumeric 6-digit access code
    const code = `PF-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    StorageService.saveDraftSession(code, currentData);
    setGeneratedCode(code);
    setCopied(false);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleResume = () => {
    setErrorMessage('');
    if (!resumeCodeInput.trim()) {
      setErrorMessage('Please enter your 6-digit save code');
      return;
    }

    const data = StorageService.resumeDraftSession(resumeCodeInput.trim());
    if (!data) {
      setErrorMessage('Invalid or expired continuation code. Please check the code and try again.');
      return;
    }

    onResumeSuccess(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => { setActiveTab('save'); setErrorMessage(''); }}
            className={`pb-3 text-xs font-bold transition border-b-2 flex-1 flex items-center justify-center gap-1.5 ${
              activeTab === 'save' 
                ? 'border-brand-600 text-brand-600' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Save Progress</span>
          </button>
          <button
            onClick={() => { setActiveTab('resume'); setErrorMessage(''); }}
            className={`pb-3 text-xs font-bold transition border-b-2 flex-1 flex items-center justify-center gap-1.5 ${
              activeTab === 'resume' 
                ? 'border-brand-600 text-brand-600' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Resume Saved Session</span>
          </button>
        </div>

        {activeTab === 'save' ? (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Save & Resume Later</h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                We'll generate an encrypted, expiring continuation code so you can safely finish your registration from any device without losing your entered data.
              </p>
            </div>

            {generatedCode ? (
              <div className="bg-brand-50 border border-brand-200 rounded-2xl p-4 text-center space-y-3">
                <span className="text-[11px] font-semibold text-brand-700 block">
                  Your Secure Continuation Code:
                </span>
                <div className="text-xl font-mono font-extrabold text-slate-900 tracking-wider">
                  {generatedCode}
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="bg-white hover:bg-slate-50 text-brand-700 font-bold px-4 py-2 rounded-xl text-xs border border-brand-300 shadow-2xs inline-flex items-center gap-1.5 transition"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Code Copied!' : 'Copy Code'}</span>
                </button>
                <p className="text-[10px] text-slate-500">
                  Valid for 7 days. Never share this code with unauthorized persons.
                </p>
              </div>
            ) : (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleGenerateSaveCode}
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-2"
                >
                  <Bookmark className="w-4 h-4" />
                  <span>Generate Continuation Code</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Resume Unfinished Registration</h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Enter your continuation code below to restore your saved answers.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                Enter Continuation Code
              </label>
              <input
                type="text"
                placeholder="e.g. PF-ABCD-1234"
                value={resumeCodeInput}
                onChange={(e) => setResumeCodeInput(e.target.value.toUpperCase())}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleResume}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-2"
            >
              <span>Restore Registration</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
