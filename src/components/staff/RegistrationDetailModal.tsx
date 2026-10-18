import React, { useState } from 'react';
import { PatientRegistration, RegistrationStatus, UserRole } from '../../types';
import { StorageService } from '../../services/storageService';
import { CorrectionRequestModal } from './CorrectionRequestModal';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  CreditCard, 
  User, 
  PhoneCall, 
  FileText, 
  Printer, 
  Send, 
  History,
  MessageSquare
} from 'lucide-react';

interface RegistrationDetailModalProps {
  registration: PatientRegistration | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  currentRole: UserRole;
}

export const RegistrationDetailModal: React.FC<RegistrationDetailModalProps> = ({
  registration,
  isOpen,
  onClose,
  onUpdate,
  currentRole,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'audit' | 'notes'>('details');
  const [correctionModalOpen, setCorrectionModalOpen] = useState(false);
  const [newStaffNote, setNewStaffNote] = useState('');

  if (!isOpen || !registration) return null;

  const { demographics, emergencyContact, insurance, appointment, consent } = registration;

  const handleStatusChange = (newStatus: RegistrationStatus, note?: string) => {
    StorageService.updateRegistrationStatus(
      registration.id,
      newStatus,
      currentRole === 'clinic_admin' ? 'Clinic Administrator' : 'Front-Office Staff',
      currentRole,
      note
    );
    onUpdate();
  };

  const handleAddNote = () => {
    if (!newStaffNote.trim()) return;
    StorageService.updateRegistrationStatus(
      registration.id,
      registration.status,
      'Front-Office Staff',
      currentRole,
      newStaffNote.trim()
    );
    setNewStaffNote('');
    onUpdate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden relative">
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">
                  {demographics.firstName} {demographics.lastName}
                </h3>
                <span className="font-mono text-xs text-brand-700 bg-brand-50 px-2 py-0.5 rounded font-bold border border-brand-200">
                  {registration.id}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {registration.clinicName} • Submitted: {new Date(registration.submittedAt || registration.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition"
              title="Print Patient Intake Packet"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 bg-white border-b border-slate-200 flex items-center gap-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 border-b-2 transition ${
              activeTab === 'details'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Intake Details & Cards
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`py-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'notes'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Staff Notes ({registration.staffNotes?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`py-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'audit'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit Trail ({registration.auditLogs?.length || 0})</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {activeTab === 'details' && (
            <div className="space-y-5">
              {/* Status and Action Ribbon */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-semibold">Current Intake Status:</span>
                  <span className={`px-2.5 py-1 rounded-full font-bold text-xs ${
                    registration.status === 'complete'
                      ? 'bg-emerald-100 text-emerald-800'
                      : registration.status === 'needs_correction'
                      ? 'bg-amber-100 text-amber-800'
                      : registration.status === 'under_review'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-200 text-slate-800'
                  }`}>
                    {registration.status.toUpperCase().replace('_', ' ')}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {registration.status !== 'under_review' && registration.status !== 'complete' && (
                    <button
                      onClick={() => handleStatusChange('under_review', 'Staff initiated review')}
                      className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-xl font-bold border border-blue-200 transition"
                    >
                      Mark Under Review
                    </button>
                  )}

                  <button
                    onClick={() => setCorrectionModalOpen(true)}
                    className="bg-amber-50 text-amber-700 hover:bg-amber-100 px-3 py-1.5 rounded-xl font-bold border border-amber-200 transition"
                  >
                    Request Correction...
                  </button>

                  {registration.status !== 'complete' && (
                    <button
                      onClick={() => handleStatusChange('complete', 'Intake reviewed and approved')}
                      className="bg-emerald-600 text-white hover:bg-emerald-700 px-4 py-1.5 rounded-xl font-bold shadow-sm transition flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve & Complete</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Patient Demographics */}
              <div className="border border-slate-200 rounded-2xl p-4 space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-4 h-4 text-brand-600" />
                  <span>Demographics & Contact Information</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[11px]">DOB:</span>
                    <span className="font-semibold text-slate-800">{demographics.dateOfBirth}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Phone:</span>
                    <span className="font-semibold text-slate-800">{demographics.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Email:</span>
                    <span className="font-semibold text-slate-800">{demographics.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Language:</span>
                    <span className="font-semibold text-slate-800">{demographics.preferredLanguage}</span>
                  </div>
                  <div className="sm:col-span-3">
                    <span className="text-slate-400 block text-[11px]">Home Address:</span>
                    <span className="font-semibold text-slate-800">
                      {demographics.addressLine1} {demographics.addressLine2 ? `(${demographics.addressLine2})` : ''}, {demographics.city}, {demographics.state} {demographics.zipCode}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Pref. Contact:</span>
                    <span className="font-semibold text-slate-800 uppercase">{demographics.preferredContact}</span>
                  </div>
                </div>
              </div>

              {/* Insurance Details & Card Images */}
              <div className="border border-slate-200 rounded-2xl p-4 space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-brand-600" />
                  <span>Insurance Details & Uploaded Cards</span>
                </h4>

                {insurance.isSelfPay ? (
                  <p className="text-slate-500 italic">Self-Pay patient. No insurance provided.</p>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Payer Name:</span>
                        <span className="font-bold text-slate-800">{insurance.providerName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Member ID:</span>
                        <span className="font-mono font-bold text-slate-900">{insurance.memberId}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Group #:</span>
                        <span className="font-mono text-slate-800">{insurance.groupNumber || 'None'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Subscriber:</span>
                        <span className="font-semibold text-slate-800">
                          {insurance.subscriberIsPatient ? 'Patient is subscriber' : insurance.subscriberName}
                        </span>
                      </div>
                    </div>

                    {/* Card Previews */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-slate-500 font-semibold block mb-1">Insurance Card Front:</span>
                        {insurance.cardFrontUrl ? (
                          <img 
                            src={insurance.cardFrontUrl} 
                            alt="Insurance Front" 
                            className="h-32 object-contain rounded-lg border border-slate-200 bg-slate-50"
                          />
                        ) : (
                          <div className="h-28 rounded-lg border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400">
                            No front image uploaded
                          </div>
                        )}
                      </div>

                      <div>
                        <span className="text-slate-500 font-semibold block mb-1">Insurance Card Back:</span>
                        {insurance.cardBackUrl ? (
                          <img 
                            src={insurance.cardBackUrl} 
                            alt="Insurance Back" 
                            className="h-32 object-contain rounded-lg border border-slate-200 bg-slate-50"
                          />
                        ) : (
                          <div className="h-28 rounded-lg border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400">
                            No back image uploaded
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Consents & Signature */}
              <div className="border border-slate-200 rounded-2xl p-4 space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Consents & Electronic Signature</span>
                </h4>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-slate-700">Notice of Privacy Practices: <strong>Acknowledged</strong></p>
                    <p className="text-slate-700">Consent to Medical Evaluation: <strong>Granted</strong></p>
                    <p className="text-slate-700">Direct Patient Communications: <strong>Authorized</strong></p>
                    <p className="text-slate-400 text-[11px]">
                      Signer: {consent.signerName} ({new Date(consent.signedAt || registration.createdAt).toLocaleString()})
                    </p>
                  </div>

                  {consent.signatureDataUrl && (
                    <div className="p-2 border border-slate-200 rounded-xl bg-slate-50">
                      <img 
                        src={consent.signatureDataUrl} 
                        alt="Patient Signature" 
                        className="h-14 object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Staff Notes Tab */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="font-bold text-slate-800">Add Internal Staff Note</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newStaffNote}
                    onChange={(e) => setNewStaffNote(e.target.value)}
                    placeholder="e.g. Called patient to confirm insurance carrier prefix..."
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddNote}
                    className="bg-brand-600 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 hover:bg-brand-700 transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post Note</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Previous Staff Notes:</h4>
                {registration.staffNotes && registration.staffNotes.length > 0 ? (
                  registration.staffNotes.map((note, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-700">
                      {note}
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 italic">No notes recorded yet.</p>
                )}
              </div>
            </div>
          )}

          {/* Immutable Audit Trail Tab */}
          {activeTab === 'audit' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
                Immutable Access & Modification Logs (HIPAA Security Rule § 164.312(b))
              </h4>
              <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 bg-white">
                {registration.auditLogs && registration.auditLogs.length > 0 ? (
                  registration.auditLogs.map((log) => (
                    <div key={log.id} className="p-3 text-xs flex items-start justify-between gap-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{log.action}</span>
                          <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-mono">
                            {log.actorRole}
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11.5px]">{log.details}</p>
                        <p className="text-slate-400 text-[10px]">Actor: {log.actor}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="p-4 text-slate-400">No logs found.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Correction Request Modal */}
      <CorrectionRequestModal
        isOpen={correctionModalOpen}
        onClose={() => setCorrectionModalOpen(false)}
        registration={registration}
        onSuccess={() => {
          onUpdate();
        }}
      />
    </div>
  );
};
