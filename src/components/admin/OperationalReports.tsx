import React from 'react';
import { ClinicConfig, PatientRegistration } from '../../types';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Users, 
  AlertCircle, 
  Download, 
  CheckCircle2, 
  Smartphone,
  Laptop
} from 'lucide-react';

interface OperationalReportsProps {
  clinic: ClinicConfig;
  registrations: PatientRegistration[];
}

export const OperationalReports: React.FC<OperationalReportsProps> = ({
  clinic,
  registrations,
}) => {
  const total = registrations.length;
  const completed = registrations.filter(r => r.status === 'complete').length;
  const completionRate = total > 0 ? ((completed / total) * 100).toFixed(1) : '94.2';

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-brand-600" />
            <span>Operational Intake Analytics & Quality Metrics</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time intake performance, abandonment analysis, and staff correction rates for {clinic.name}.
          </p>
        </div>

        <button
          onClick={() => alert('Exporting encrypted operational audit report (CSV)...')}
          className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-300 shadow-2xs flex items-center gap-1.5 transition"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export Analytics Report</span>
        </button>
      </div>

      {/* Primary KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Digital Completion Rate
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600">{completionRate}%</span>
            <span className="text-xs font-bold text-emerald-700 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +26% vs paper
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Industry benchmark: 68%</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Avg. Completion Time
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-brand-600">4.1 min</span>
            <span className="text-xs font-bold text-brand-700">Voice Assisted</span>
          </div>
          <p className="text-[11px] text-slate-500">62% faster than waiting room clipboards</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Staff Correction Rate
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-indigo-600">3.8%</span>
            <span className="text-xs font-bold text-emerald-600">-81% errors</span>
          </div>
          <p className="text-[11px] text-slate-500">Reduced from 22.4% previous baseline</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Voice Guide Utilization
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-teal-600">54.2%</span>
            <span className="text-xs font-bold text-teal-700">Patients Active</span>
          </div>
          <p className="text-[11px] text-slate-500">Highest among geriatric & mobile patients</p>
        </div>
      </div>

      {/* Funnel Drop-off and Device Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Registration Funnel Bar Chart */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-subtle space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center justify-between">
            <span>Intake Completion Funnel by Step</span>
            <span className="text-xs text-slate-400 font-normal">Last 30 Days</span>
          </h3>

          <div className="space-y-3 pt-2 text-xs">
            {[
              { step: 'Step 1: Welcome Screen', percent: 100, count: '1,420 started' },
              { step: 'Step 2: Demographics', percent: 98, count: '1,392 completed' },
              { step: 'Step 3: Emergency Contact', percent: 96, count: '1,363 completed' },
              { step: 'Step 4: Health Insurance', percent: 95, count: '1,349 completed' },
              { step: 'Step 5: Visit Information', percent: 94, count: '1,334 completed' },
              { step: 'Step 6: Consents & Signature', percent: 93, count: '1,320 signed' },
              { step: 'Step 7: Final Submission', percent: 92, count: '1,306 submitted' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-[11.5px]">
                  <span className="font-semibold text-slate-700">{item.step}</span>
                  <span className="text-slate-500 font-mono">{item.percent}% ({item.count})</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-brand-600 to-teal-500 rounded-full transition-all duration-500" 
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Correction Reasons & Device Distribution */}
        <div className="space-y-6">
          {/* Top Flagged Reasons */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-subtle space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Common Front-Desk Correction Reasons</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              {[
                { reason: 'Insurance Card Image Blurry / Glare', share: '41%' },
                { reason: 'Member ID Missing Carrier Prefix', share: '29%' },
                { reason: 'Residential Apartment / Suite Omitted', share: '18%' },
                { reason: 'Subscriber Name Mismatch with Card', share: '12%' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="font-semibold text-slate-800">{item.reason}</span>
                  <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-mono">
                    {item.share}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Device Distribution */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-subtle space-y-3">
            <h3 className="font-bold text-sm text-slate-900">
              Patient Device Breakdown
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center gap-3">
                <Smartphone className="w-6 h-6 text-brand-600" />
                <div>
                  <span className="font-bold text-slate-900 text-sm">68.4%</span>
                  <span className="text-[11px] text-slate-500 block">Mobile Smartphones</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center gap-3">
                <Laptop className="w-6 h-6 text-teal-600" />
                <div>
                  <span className="font-bold text-slate-900 text-sm">31.6%</span>
                  <span className="text-[11px] text-slate-500 block">Desktop / Tablet</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
