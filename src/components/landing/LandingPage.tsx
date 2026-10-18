import React from 'react';
import { 
  Mic, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  Clock, 
  Sliders, 
  FileCheck2, 
  Smartphone,
  TrendingDown,
  Volume2,
  Lock,
  Award,
  Sparkles
} from 'lucide-react';
import { ClinicConfig } from '../../types';

interface LandingPageProps {
  onStartRegistration: () => void;
  onGoToStaffDashboard: () => void;
  onGoToFormBuilder: () => void;
  clinic: ClinicConfig;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartRegistration,
  onGoToStaffDashboard,
  onGoToFormBuilder,
  clinic,
}) => {
  return (
    <div className="space-y-20 pb-16 animate-fadeIn">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-14 text-center max-w-4xl mx-auto px-4 space-y-6">
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
          Patient Registration, <br className="hidden sm:inline" />
          <span className="text-[#0066FF]">
            Made Effortless.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Smarter Intake. Fewer Errors. Better Patient Experiences. An intelligent, voice-guided patient registration platform built for modern U.S. clinics, health systems, and specialty practices.
        </p>

        {/* Action CTAs */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onStartRegistration}
            className="w-full sm:w-auto bg-[#0066FF] hover:bg-[#0052CC] text-white font-extrabold px-8 py-4 rounded-2xl shadow-elevated hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm group"
          >
            <span>Start Patient Intake Experience</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            type="button"
            onClick={onGoToStaffDashboard}
            className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-800 font-bold px-6 py-4 rounded-2xl border border-slate-300 shadow-subtle hover:border-slate-400 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <Building2 className="w-4 h-4 text-[#0066FF]" />
            <span>Open Clinic Staff Queue</span>
          </button>
        </div>

        {/* Trust Badges */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-[#0066FF]" /> End-to-End HIPAA Aligned
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#0066FF]" /> Multi-Tenant Partitioning
          </span>
          <span className="flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-[#0066FF]" /> Integrated Voice Guidance
          </span>
          <span className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#0066FF]" /> WCAG 2.1 AA Accessible
          </span>
        </div>
      </section>

      {/* Measurable ROI Metric Grid */}
      <section className="w-full">
        <div className="bg-[#0B132B] text-white rounded-3xl p-8 sm:p-12 shadow-card grid grid-cols-1 sm:grid-cols-3 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
          <div className="space-y-2 pt-4 sm:pt-0">
            <span className="text-4xl sm:text-5xl font-black text-[#00C8FF]">
              -81%
            </span>
            <h3 className="font-bold text-sm text-slate-200">Registration Errors</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Real-time format validation and AI card recognition eliminate illegible handwriting and incomplete fields.
            </p>
          </div>

          <div className="space-y-2 pt-6 sm:pt-0">
            <span className="text-4xl sm:text-5xl font-black text-[#38BDF8]">
              4.1 min
            </span>
            <h3 className="font-bold text-sm text-slate-200">Average Completion</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Dynamic conditional questions ensure patients answer only what is relevant to their visit and payer.
            </p>
          </div>

          <div className="space-y-2 pt-6 sm:pt-0">
            <span className="text-4xl sm:text-5xl font-black text-[#BAE6FD]">
              94.2%
            </span>
            <h3 className="font-bold text-sm text-slate-200">Completion Rate</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Guided voice assistance and save-and-resume links dramatically reduce mobile form abandonment.
            </p>
          </div>
        </div>
      </section>

      {/* Core Differentiating Features */}
      <section className="w-full space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0066FF] bg-[#EBF8FE] px-3 py-1 rounded-full border border-blue-200">
            Signature Capabilities
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Engineered for Real-World Healthcare Intake
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Not a generic form builder. PatientFlow is built specifically for U.S. clinical workflows, privacy requirements, and patient accessibility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1: Voice Guidance */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-subtle space-y-4 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF8FE] text-[#0066FF] flex items-center justify-center">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">
              AI Voice Registration Assistant
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Actively speaks instructions aloud, identifies skipped required fields, and answers "What belongs here?" in plain English and Spanish. Full screen-reader and mute controls.
            </p>
            <span className="text-[11px] font-semibold text-[#0066FF] bg-[#EBF8FE] px-2.5 py-1 rounded-lg inline-block border border-blue-100">
              100% Client-Side Privacy
            </span>
          </div>

          {/* Feature 2: Smart Insurance & OCR Review */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-subtle space-y-4 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF8FE] text-[#0066FF] flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">
              Insurance Card Data Extraction
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Patients upload photos of card front and back. Simulated intelligent extraction presents candidate values for patient review—never silently overwriting entered data.
            </p>
            <span className="text-[11px] font-semibold text-[#0066FF] bg-[#EBF8FE] px-2.5 py-1 rounded-lg inline-block border border-blue-100">
              Explicit Human Verification
            </span>
          </div>

          {/* Feature 3: Correction Request Workflow */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-subtle space-y-4 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF8FE] text-[#0066FF] flex items-center justify-center">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">
              Staff Triage & Correction Loop
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Front-office personnel can flag specific illegible cards or incomplete IDs with one click. Patients receive a targeted update link to fix only the flagged fields.
            </p>
            <span className="text-[11px] font-semibold text-[#0066FF] bg-[#EBF8FE] px-2.5 py-1 rounded-lg inline-block border border-blue-100">
              Zero Form Repetition
            </span>
          </div>
        </div>
      </section>

      {/* Clinic Form Builder Banner */}
      <section className="w-full">
        <div className="bg-[#EBF8FE] border border-blue-200 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold text-[#0066FF] uppercase tracking-wider">
              For Practice Administrators
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              Customize Intake Forms For Your Specialty Clinic
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Enable or disable insurance sections, customize welcome messages, mark fields mandatory, and track legal consent policy versions.
            </p>
          </div>

          <button
            type="button"
            onClick={onGoToFormBuilder}
            className="bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold px-6 py-3 rounded-xl text-xs shadow-md transition flex items-center gap-2 shrink-0"
          >
            <Sliders className="w-4 h-4" />
            <span>Open Clinic Form Builder</span>
          </button>
        </div>
      </section>
    </div>
  );
};
