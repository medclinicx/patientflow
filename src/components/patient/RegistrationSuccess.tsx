import React from 'react';
import { PatientRegistration, ClinicConfig } from '../../types';
import { 
  CheckCircle2, 
  Printer, 
  Download, 
  Calendar, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  FileText,
  Clock,
  ArrowRight
} from 'lucide-react';

interface RegistrationSuccessProps {
  registration: PatientRegistration;
  clinic: ClinicConfig;
  onReset: () => void;
  onViewStatus: () => void;
  language: 'en' | 'es';
}

export const RegistrationSuccess: React.FC<RegistrationSuccessProps> = ({
  registration,
  clinic,
  onReset,
  onViewStatus,
  language,
}) => {
  const isEs = language === 'es';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
      {/* Success Hero Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 text-center shadow-card relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50">
          <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
        </div>

        <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          {isEs ? 'Registro Recibido con Éxito' : 'Intake Successfully Submitted'}
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 mb-2">
          {isEs ? '¡Gracias por Completar su Registro!' : 'Thank You, ' + registration.demographics.firstName + '!'}
        </h1>

        <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
          Your digital registration packet has been transmitted directly to the intake queue at <strong>{clinic.name}</strong>.
        </p>

        {/* Confirmation Number Box */}
        <div className="my-6 max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Unique Intake Confirmation ID
            </span>
            <span className="text-xl font-extrabold font-mono text-brand-700 tracking-wider">
              {registration.id}
            </span>
          </div>

          <span className="bg-brand-50 text-brand-700 text-xs font-semibold px-2.5 py-1 rounded-lg border border-brand-200">
            Status: Submitted
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={handlePrint}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Registration Summary</span>
          </button>

          <button
            type="button"
            onClick={onViewStatus}
            className="bg-brand-50 hover:bg-brand-100 text-brand-700 font-semibold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 border border-brand-200 transition"
          >
            <Clock className="w-4 h-4" />
            <span>Check Intake Status</span>
          </button>
        </div>
      </div>

      {/* What to Expect Next Checklist */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-subtle space-y-4">
        <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-brand-600" />
          <span>What to Bring & Next Steps</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs">1</span>
            <h4 className="font-bold text-slate-900">Valid Photo ID</h4>
            <p className="text-slate-500 text-[11.5px] leading-relaxed">
              Please present your driver's license, state ID, or passport upon arrival at the clinic reception desk.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center text-xs">2</span>
            <h4 className="font-bold text-slate-900">Insurance Card (Physical)</h4>
            <p className="text-slate-500 text-[11.5px] leading-relaxed">
              Have your physical insurance card ready so front desk personnel can scan and cross-verify your copay terms.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">3</span>
            <h4 className="font-bold text-slate-900">Medication List</h4>
            <p className="text-slate-500 text-[11.5px] leading-relaxed">
              Bring a current list of all prescriptions, vitamins, or supplements you are taking for your nurse intake.
            </p>
          </div>
        </div>

        <div className="bg-brand-50 border border-brand-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-brand-950">
          <div className="flex items-center gap-2.5">
            <Phone className="w-4 h-4 text-brand-600 shrink-0" />
            <span>Need to reschedule or update details? Call <strong>{clinic.phone}</strong> or email <strong>{clinic.email}</strong></span>
          </div>

          <button
            type="button"
            onClick={onReset}
            className="text-xs font-bold text-brand-700 hover:text-brand-900 underline shrink-0"
          >
            Start New Registration
          </button>
        </div>
      </div>
    </div>
  );
};
