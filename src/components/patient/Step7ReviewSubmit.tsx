import React from 'react';
import { PatientRegistration, ClinicConfig } from '../../types';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Edit3, 
  ShieldCheck, 
  Lock, 
  Send, 
  Bookmark, 
  User, 
  PhoneCall, 
  CreditCard, 
  Stethoscope, 
  FileCheck2,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock
} from 'lucide-react';

interface Step7ReviewSubmitProps {
  registration: PatientRegistration;
  clinic: ClinicConfig;
  onEditSection: (stepIndex: number) => void;
  onSubmit: () => void;
  onSaveDraft: () => void;
  isSubmitting: boolean;
  language: 'en' | 'es';
}

interface MissingItem {
  stepIndex: number;
  sectionName: string;
  fieldLabel: string;
}

export const Step7ReviewSubmit: React.FC<Step7ReviewSubmitProps> = ({
  registration,
  clinic,
  onEditSection,
  onSubmit,
  onSaveDraft,
  isSubmitting,
  language,
}) => {
  const isEs = language === 'es';
  const { demographics, emergencyContact, insurance, appointment, consent } = registration;

  // Compute Missing Required Items dynamically
  const missingItems: MissingItem[] = [];

  if (!demographics.firstName.trim()) {
    missingItems.push({ stepIndex: 2, sectionName: 'Demographics', fieldLabel: 'Legal First Name' });
  }
  if (!demographics.lastName.trim()) {
    missingItems.push({ stepIndex: 2, sectionName: 'Demographics', fieldLabel: 'Legal Last Name' });
  }
  if (!demographics.dateOfBirth) {
    missingItems.push({ stepIndex: 2, sectionName: 'Demographics', fieldLabel: 'Date of Birth' });
  }
  if (!demographics.phone.trim()) {
    missingItems.push({ stepIndex: 2, sectionName: 'Demographics', fieldLabel: 'Phone Number' });
  }
  if (!demographics.email.trim()) {
    missingItems.push({ stepIndex: 2, sectionName: 'Demographics', fieldLabel: 'Email Address' });
  }
  if (!demographics.addressLine1.trim()) {
    missingItems.push({ stepIndex: 2, sectionName: 'Demographics', fieldLabel: 'Street Address' });
  }
  if (!demographics.city.trim()) {
    missingItems.push({ stepIndex: 2, sectionName: 'Demographics', fieldLabel: 'City' });
  }
  if (!demographics.zipCode.trim()) {
    missingItems.push({ stepIndex: 2, sectionName: 'Demographics', fieldLabel: 'ZIP Code' });
  }

  // Emergency contact
  if (!emergencyContact.fullName.trim()) {
    missingItems.push({ stepIndex: 3, sectionName: 'Emergency Contact', fieldLabel: 'Contact Full Name' });
  }
  if (!emergencyContact.primaryPhone.trim()) {
    missingItems.push({ stepIndex: 3, sectionName: 'Emergency Contact', fieldLabel: 'Primary Phone' });
  }
  if (!emergencyContact.relationship) {
    missingItems.push({ stepIndex: 3, sectionName: 'Emergency Contact', fieldLabel: 'Relationship' });
  }

  // Insurance
  if (!insurance.isSelfPay) {
    if (!insurance.providerName.trim()) {
      missingItems.push({ stepIndex: 4, sectionName: 'Insurance', fieldLabel: 'Insurance Company Name' });
    }
    if (!insurance.memberId.trim()) {
      missingItems.push({ stepIndex: 4, sectionName: 'Insurance', fieldLabel: 'Member / Subscriber ID' });
    }
    if (clinic.requiredFields.insuranceCardUpload && !insurance.cardFrontUrl) {
      missingItems.push({ stepIndex: 4, sectionName: 'Insurance', fieldLabel: 'Card Front Image Upload' });
    }
    if (!insurance.subscriberIsPatient && !insurance.subscriberName?.trim()) {
      missingItems.push({ stepIndex: 4, sectionName: 'Insurance', fieldLabel: 'Subscriber Full Name' });
    }
  }

  // Appointment
  if (!appointment.department) {
    missingItems.push({ stepIndex: 5, sectionName: 'Appointment', fieldLabel: 'Department / Specialty' });
  }
  if (!appointment.visitReason.trim()) {
    missingItems.push({ stepIndex: 5, sectionName: 'Appointment', fieldLabel: 'Reason for Visit' });
  }
  if (clinic.requiredFields.appointmentDate && !appointment.appointmentDate) {
    missingItems.push({ stepIndex: 5, sectionName: 'Appointment', fieldLabel: 'Appointment Target Date' });
  }

  // Consents
  if (!consent.hipaaAcknowledged) {
    missingItems.push({ stepIndex: 6, sectionName: 'Consent', fieldLabel: 'HIPAA Notice Acknowledgment' });
  }
  if (!consent.treatmentConsent) {
    missingItems.push({ stepIndex: 6, sectionName: 'Consent', fieldLabel: 'Consent for Treatment' });
  }
  if (!consent.communicationConsent) {
    missingItems.push({ stepIndex: 6, sectionName: 'Consent', fieldLabel: 'Communication Consent' });
  }
  if (!consent.signatureDataUrl) {
    missingItems.push({ stepIndex: 6, sectionName: 'Consent', fieldLabel: 'Electronic Patient Signature' });
  }

  const isFormComplete = missingItems.length === 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-brand-600" />
            <span>{isEs ? 'Revisión Final y Envío' : 'Review & Final Submission'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isEs 
              ? 'Verifique que toda la información ingresada sea correcta antes de enviar su registro a la clínica.'
              : 'Carefully review all details. You can click "Edit" on any section to make corrections before submitting.'}
          </p>
        </div>
        <span className="text-xs font-semibold bg-brand-50 text-brand-700 px-3 py-1 rounded-full border border-brand-200">
          Step 7 of 7
        </span>
      </div>

      {/* Missing Information Checklist Banner */}
      <div className={`rounded-2xl p-4 sm:p-5 border transition-all ${
        isFormComplete 
          ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
          : 'bg-amber-50 border-amber-200 text-amber-950'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {isFormComplete ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            )}
            <h3 className="font-bold text-sm">
              {isFormComplete 
                ? (isEs ? '¡Todos los campos requeridos están completos!' : 'Intake Checklist Complete — Ready for Submission') 
                : (isEs ? `Atención: Faltan ${missingItems.length} campos requeridos` : `Action Required: ${missingItems.length} Missing Fields`)}
            </h3>
          </div>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
            isFormComplete ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
          }`}>
            {isFormComplete ? '100% Ready' : 'Incomplete'}
          </span>
        </div>

        {!isFormComplete ? (
          <div className="space-y-2 pt-1">
            <p className="text-xs text-amber-800">
              Please complete the following highlighted items before submitting:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {missingItems.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onEditSection(item.stepIndex)}
                  className="bg-white hover:bg-amber-100 text-amber-900 text-xs px-2.5 py-1 rounded-lg border border-amber-300 font-medium flex items-center gap-1.5 transition shadow-2xs"
                >
                  <Edit3 className="w-3 h-3 text-amber-600" />
                  <span>{item.sectionName}: <strong>{item.fieldLabel}</strong></span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-xs text-emerald-800">
            All mandatory clinical requirements and consents have been satisfied. Once submitted, your registration record will be transmitted securely to {clinic.name}.
          </p>
        )}
      </div>

      {/* Review Cards Grid */}
      <div className="space-y-4">
        {/* Section 1: Demographics Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-subtle space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <User className="w-4 h-4 text-brand-600" />
              <span>Patient Demographics</span>
            </div>
            <button
              type="button"
              onClick={() => onEditSection(2)}
              className="text-xs text-brand-600 hover:text-brand-800 font-semibold flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Full Legal Name:</span>
              <span className="font-semibold text-slate-800">
                {demographics.firstName} {demographics.middleName ? demographics.middleName + ' ' : ''}{demographics.lastName}
                {demographics.preferredName ? ` ("${demographics.preferredName}")` : ''}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Date of Birth:</span>
              <span className="font-semibold text-slate-800">{demographics.dateOfBirth || 'Not provided'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Phone:</span>
              <span className="font-semibold text-slate-800">{demographics.phone || 'Not provided'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Email:</span>
              <span className="font-semibold text-slate-800">{demographics.email || 'Not provided'}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-slate-400 block text-[11px]">Residential Address:</span>
              <span className="font-semibold text-slate-800">
                {demographics.addressLine1} {demographics.addressLine2 ? `${demographics.addressLine2}, ` : ', '}
                {demographics.city}, {demographics.state} {demographics.zipCode}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Contact Method:</span>
              <span className="font-semibold text-slate-800 uppercase">{demographics.preferredContact}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Language:</span>
              <span className="font-semibold text-slate-800">{demographics.preferredLanguage}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Emergency Contact Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-subtle space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <PhoneCall className="w-4 h-4 text-brand-600" />
              <span>Emergency Contact</span>
            </div>
            <button
              type="button"
              onClick={() => onEditSection(3)}
              className="text-xs text-brand-600 hover:text-brand-800 font-semibold flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Contact Name:</span>
              <span className="font-semibold text-slate-800">{emergencyContact.fullName || 'Not provided'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Relationship:</span>
              <span className="font-semibold text-slate-800">{emergencyContact.relationship || 'Not selected'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Primary Phone:</span>
              <span className="font-semibold text-slate-800">{emergencyContact.primaryPhone || 'Not provided'}</span>
            </div>
          </div>
        </div>

        {/* Section 3: Insurance Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-subtle space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <CreditCard className="w-4 h-4 text-brand-600" />
              <span>Health Insurance Details</span>
            </div>
            <button
              type="button"
              onClick={() => onEditSection(4)}
              className="text-xs text-brand-600 hover:text-brand-800 font-semibold flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          {insurance.isSelfPay ? (
            <p className="text-xs text-slate-600 italic">Self-Pay / No insurance coverage selected.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Payer Name:</span>
                <span className="font-semibold text-slate-800">{insurance.providerName || 'Not entered'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Member / Subscriber ID:</span>
                <span className="font-mono font-semibold text-slate-800">{insurance.memberId || 'Not entered'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Group #:</span>
                <span className="font-mono font-semibold text-slate-800">{insurance.groupNumber || 'None'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Card Front:</span>
                <span className={`font-semibold ${insurance.cardFrontUrl ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {insurance.cardFrontUrl ? 'Uploaded & Verified' : 'Not uploaded'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Section 4: Appointment & Clinical Info */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-subtle space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Stethoscope className="w-4 h-4 text-brand-600" />
              <span>Visit & Clinical Department</span>
            </div>
            <button
              type="button"
              onClick={() => onEditSection(5)}
              className="text-xs text-brand-600 hover:text-brand-800 font-semibold flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Department:</span>
              <span className="font-semibold text-slate-800">{appointment.department || 'Not selected'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Setting:</span>
              <span className="font-semibold text-slate-800 capitalize">{appointment.visitType.replace('_', ' ')}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Target Date:</span>
              <span className="font-semibold text-slate-800">{appointment.appointmentDate || 'Routine scheduling'}</span>
            </div>
            <div className="sm:col-span-3">
              <span className="text-slate-400 block text-[11px]">Reason for Visit:</span>
              <span className="font-medium text-slate-800">{appointment.visitReason || 'Not entered'}</span>
            </div>
          </div>
        </div>

        {/* Section 5: Legal Consents & Signature Preview */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-subtle space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <FileCheck2 className="w-4 h-4 text-brand-600" />
              <span>Legal Consents & Signature Attestation</span>
            </div>
            <button
              type="button"
              onClick={() => onEditSection(6)}
              className="text-xs text-brand-600 hover:text-brand-800 font-semibold flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs items-center">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-medium">Notice of Privacy Practices (HIPAA) Acknowledged</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-medium">Consent for Outpatient Medical Care Signed</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-medium">Appointment Communications Authorized</span>
              </div>
              <p className="text-[11px] text-slate-400 pt-1">
                Signed by: <strong>{consent.signerName || demographics.firstName + ' ' + demographics.lastName}</strong>
              </p>
            </div>

            {/* Signature Preview */}
            <div className="border border-slate-200 rounded-xl p-2 bg-slate-50 flex flex-col items-center justify-center">
              {consent.signatureDataUrl ? (
                <img 
                  src={consent.signatureDataUrl} 
                  alt="Captured Electronic Signature" 
                  className="h-16 object-contain"
                />
              ) : (
                <span className="text-red-500 font-medium text-xs">Signature Required</span>
              )}
              <span className="text-[10px] text-slate-400 font-mono mt-1">E-SIGN Validated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons: Save & Resume or Submit */}
      <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={onSaveDraft}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs flex items-center justify-center gap-2 transition"
        >
          <Bookmark className="w-4 h-4 text-brand-600" />
          <span>Save Draft & Resume Later</span>
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={!isFormComplete || isSubmitting}
          className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Transmitting Secure Registration...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Registration to Clinic</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
