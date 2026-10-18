import React from 'react';
import { ShieldCheck, Lock, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-16 border-t border-slate-800">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-white">
              <span className="font-heading font-black text-2xl tracking-tight select-none">
                <span className="text-[#0066FF]">Patient</span>
                <span className="text-white">Flow</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Patient Registration, Made Effortless. An intelligent, voice-guided digital intake platform built for modern U.S. healthcare providers, clinics, and health systems.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-400 bg-blue-950/60 px-2 py-1 rounded border border-blue-800/40">
                <Lock className="w-3 h-3" /> 256-Bit Encrypted
              </span>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-400 bg-blue-950/60 px-2 py-1 rounded border border-blue-800/40">
                <ShieldCheck className="w-3 h-3" /> Tenant Isolated
              </span>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-400 bg-blue-950/60 px-2 py-1 rounded border border-blue-800/40">
                <Award className="w-3 h-3" /> WCAG 2.1 AA Compliant
              </span>
            </div>
          </div>

          {/* Healthcare Links */}
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">Patient Resources</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li><a href="#hipaa" className="hover:text-white transition">Notice of Privacy Practices</a></li>
              <li><a href="#patient-rights" className="hover:text-white transition">Patient Bill of Rights</a></li>
              <li><a href="#accessibility" className="hover:text-white transition">Accessibility Statement</a></li>
              <li><a href="#nondiscrimination" className="hover:text-white transition">Non-Discrimination Policy</a></li>
            </ul>
          </div>

          {/* Security & Verification Disclaimer */}
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">System Disclosures</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Submitting digital intake forms does not guarantee appointment confirmation or live payer eligibility verification until explicitly reviewed and processed by clinic billing personnel.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3 text-center sm:text-left">
          <p>© {new Date().getFullYear()} PatientFlow Inc. All rights reserved. Designed for U.S. Healthcare Providers.</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 text-slate-400 text-[11px]">
            <span>HIPAA Security Rules Aligned</span>
            <span>•</span>
            <span>SOC 2 Type II Certified Controls</span>
            <span>•</span>
            <span>Version 2.4.0-prod</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
