import React, { useState } from 'react';
import { PatientRegistration } from '../../types';
import { StorageService } from '../../services/storageService';
import { AlertCircle, Send, X, CheckSquare, Square } from 'lucide-react';

interface CorrectionRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  registration: PatientRegistration;
  onSuccess: () => void;
  staffName?: string;
}

const AVAILABLE_FIELDS = [
  { id: 'insurance.memberId', label: 'Insurance Member / Subscriber ID' },
  { id: 'insurance.cardFrontUrl', label: 'Insurance Card Front Photo' },
  { id: 'insurance.cardBackUrl', label: 'Insurance Card Back Photo' },
  { id: 'demographics.dateOfBirth', label: 'Date of Birth' },
  { id: 'demographics.addressLine1', label: 'Residential Address / Unit #' },
  { id: 'demographics.phone', label: 'Primary Contact Phone Number' },
  { id: 'emergencyContact.primaryPhone', label: 'Emergency Contact Phone' },
  { id: 'consent.signatureDataUrl', label: 'Electronic Signature' },
];

export const CorrectionRequestModal: React.FC<CorrectionRequestModalProps> = ({
  isOpen,
  onClose,
  registration,
  onSuccess,
  staffName = 'Front-Desk Specialist',
}) => {
  const [selectedFields, setSelectedFields] = useState<string[]>(['insurance.memberId']);
  const [staffNotes, setStaffNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const toggleField = (fieldId: string) => {
    if (selectedFields.includes(fieldId)) {
      setSelectedFields(selectedFields.filter(f => f !== fieldId));
    } else {
      setSelectedFields([...selectedFields, fieldId]);
    }
  };

  const handleSendCorrectionRequest = () => {
    if (selectedFields.length === 0) {
      alert('Please select at least one field requiring patient correction.');
      return;
    }
    if (!staffNotes.trim()) {
      alert('Please enter helpful instructions explaining what needs correction.');
      return;
    }

    setIsSubmitting(true);
    StorageService.requestCorrection(
      registration.id,
      selectedFields,
      staffNotes.trim(),
      staffName
    );

    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess();
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Request Patient Correction
            </h3>
            <p className="text-xs text-slate-500">
              Registration #{registration.id} • {registration.demographics.firstName} {registration.demographics.lastName}
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Select which specific fields require correction. The patient will be notified via their secure portal and guided to fix only these highlighted items without having to re-enter unaffected data.
        </p>

        {/* Checkbox List */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
            Select Flagged Fields:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
            {AVAILABLE_FIELDS.map((f) => {
              const isChecked = selectedFields.includes(f.id);
              return (
                <div
                  key={f.id}
                  onClick={() => toggleField(f.id)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center gap-2 transition ${
                    isChecked
                      ? 'border-amber-400 bg-amber-50 text-amber-950 font-semibold'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-amber-600 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <span>{f.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Staff Note / Explanation */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 block">
            Correction Explanation for Patient: <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            value={staffNotes}
            onChange={(e) => setStaffNotes(e.target.value)}
            placeholder="e.g. The subscriber member ID entered was missing the 3-letter prefix (XOF). Please also upload a sharper photo of your insurance card front."
            className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSendCorrectionRequest}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-sm transition flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Correction Request</span>
          </button>
        </div>
      </div>
    </div>
  );
};
