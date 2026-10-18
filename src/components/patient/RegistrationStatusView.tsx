import React, { useState } from 'react';
import { StorageService } from '../../services/storageService';
import { PatientRegistration, ClinicConfig } from '../../types';
import { 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileEdit, 
  Phone, 
  ArrowRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';

interface RegistrationStatusViewProps {
  clinic: ClinicConfig;
  onOpenCorrection?: (registration: PatientRegistration) => void;
  onNewRegistration?: () => void;
}

export const RegistrationStatusView: React.FC<RegistrationStatusViewProps> = ({
  clinic,
  onOpenCorrection,
  onNewRegistration,
}) => {
  const [lookupId, setLookupId] = useState('');
  const [result, setResult] = useState<PatientRegistration | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupId.trim()) return;

    // Strict Tenant Isolation: only query within active clinic tenant!
    const found = StorageService.getRegistrationById(lookupId.trim().toUpperCase(), clinic.id);
    setResult(found);
    setHasSearched(true);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn pb-16">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Check Registration Intake Status
        </h1>
        <p className="text-xs text-slate-500">
          Enter your confirmation number to check the live status of your intake at {clinic.name}.
        </p>
      </div>

      {/* Lookup Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-4">
        <form onSubmit={handleLookup} className="space-y-3">
          <label className="text-xs font-semibold text-slate-700 block">
            Intake Confirmation Number (e.g. PF-2026-9041)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              required
              placeholder="e.g. PF-2026-9041 or PF-2026-8812"
              value={lookupId}
              onChange={(e) => setLookupId(e.target.value.toUpperCase())}
              className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="submit"
              className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-sm transition flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>Lookup</span>
            </button>
          </div>
        </form>

        {/* Quick Demo Sample Helper Links */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Try sample IDs:</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setLookupId('PF-2026-9041'); }}
              className="text-brand-600 font-mono hover:underline"
            >
              PF-2026-9041 (Submitted)
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => { setLookupId('PF-2026-8812'); }}
              className="text-amber-700 font-mono hover:underline font-bold"
            >
              PF-2026-8812 (Needs Correction)
            </button>
          </div>
        </div>
      </div>

      {/* Lookup Result Display */}
      {hasSearched && (
        result ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-subtle space-y-5 animate-fadeIn">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Patient Intake Record
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {result.demographics.firstName} {result.demographics.lastName}
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  ID: {result.id} • {clinic.name}
                </p>
              </div>

              <span className={`px-3 py-1 rounded-full font-bold text-xs ${
                result.status === 'complete'
                  ? 'bg-emerald-100 text-emerald-800'
                  : result.status === 'needs_correction'
                  ? 'bg-amber-100 text-amber-800 animate-pulse'
                  : result.status === 'under_review'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-slate-100 text-slate-700'
              }`}>
                Status: {result.status.toUpperCase().replace('_', ' ')}
              </span>
            </div>

            {/* If Needs Correction, display targeted action */}
            {result.status === 'needs_correction' && result.correctionRequest && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 space-y-3">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <span>Action Needed: Clinic Staff Requested an Update</span>
                </div>
                <p className="text-amber-800 leading-relaxed text-[11.5px]">
                  <strong>Message from staff:</strong> "{result.correctionRequest.notes}"
                </p>
                <div className="pt-1 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-amber-700">
                    Flagged: {result.correctionRequest.fields.join(', ')}
                  </span>
                  {onOpenCorrection && (
                    <button
                      type="button"
                      onClick={() => onOpenCorrection(result)}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition flex items-center gap-1.5"
                    >
                      <FileEdit className="w-3.5 h-3.5" />
                      <span>Update These Fields Now</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Status explanation */}
            <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Registration Purpose:</span>
                <span className="font-semibold text-slate-800 capitalize">{result.registrationType.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span>Department / Specialty:</span>
                <span className="font-semibold text-slate-800">{result.appointment.department}</span>
              </div>
              <div className="flex justify-between">
                <span>Target Appointment:</span>
                <span className="font-semibold text-slate-800">{result.appointment.appointmentDate || 'Routine scheduling'}</span>
              </div>
              <div className="flex justify-between">
                <span>Submitted At:</span>
                <span className="font-semibold text-slate-800">
                  {new Date(result.submittedAt || result.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 text-xs text-slate-600 flex items-center gap-3">
              <Phone className="w-4 h-4 text-brand-600 shrink-0" />
              <span>For appointment rescheduling or questions, contact reception at <strong>{clinic.phone}</strong></span>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center text-xs text-slate-500 space-y-3">
            <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
            <p className="font-bold text-slate-800 text-sm">No Matching Registration Found</p>
            <p className="max-w-md mx-auto text-slate-500">
              We could not find an active intake record with ID "{lookupId}" under <strong>{clinic.name}</strong>. If you registered under another clinic provider, please switch clinics using the tenant selector in the top bar.
            </p>
          </div>
        )
      )}
    </div>
  );
};
