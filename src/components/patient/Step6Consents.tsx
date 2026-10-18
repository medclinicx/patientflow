import React from 'react';
import { ConsentRecord, ClinicConfig } from '../../types';
import { SignaturePad } from '../common/SignaturePad';
import { 
  FileCheck2, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from 'lucide-react';

interface Step6ConsentsProps {
  data: ConsentRecord;
  onChange: (updated: Partial<ConsentRecord>) => void;
  clinic: ClinicConfig;
  patientName: string;
  language: 'en' | 'es';
  onFieldFocus: (fieldId: string) => void;
  showErrors?: boolean;
}

export const Step6Consents: React.FC<Step6ConsentsProps> = ({
  data,
  onChange,
  clinic,
  patientName,
  language,
  onFieldFocus,
  showErrors = false,
}) => {
  const isEs = language === 'es';

  const isHipaaMissing = showErrors && !data.hipaaAcknowledged;
  const isTreatmentMissing = showErrors && !data.treatmentConsent;
  const isCommMissing = showErrors && !data.communicationConsent;
  const isSignerMissing = showErrors && !data.signerName.trim();
  const isSignatureMissing = showErrors && !data.signatureDataUrl.trim();

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-brand-600" />
            <span>{isEs ? 'Consentimientos y Reconocimientos Clínicos' : 'Consent & Policy Acknowledgments'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isEs 
              ? 'Revise las políticas de la clínica y firme electrónicamente para autorizar la atención médica.'
              : 'Please review clinic policies, patient rights disclosures, and provide your electronic signature.'}
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold bg-brand-50 text-brand-700 px-3 py-1 rounded-full border border-brand-200 block">
            Step 6 of 7
          </span>
          <span className="text-[10px] text-slate-400 font-mono mt-1 block">
            Policy Ver: {clinic.consentDocumentVersion}
          </span>
        </div>
      </div>

      {/* Mandatory Acknowledgment 1: HIPAA Notice of Privacy Practices */}
      <div className={`bg-white border rounded-2xl p-5 shadow-subtle space-y-3 transition ${
        isHipaaMissing ? 'border-red-500 ring-2 ring-red-100 bg-red-50/10' : 'border-slate-200'
      }`}>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>1. HIPAA Notice of Privacy Practices (NPP)</span>
              <span className="text-red-500">*</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              I acknowledge that I have received, reviewed, or was offered a copy of {clinic.name}'s Notice of Privacy Practices. I understand how my protected health information (PHI) may be used and disclosed for treatment, payment, and healthcare operations, and how I may access this information under federal HIPAA regulations (45 CFR § 164.520).
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
          <input
            id="hipaaConsent"
            type="checkbox"
            required
            checked={data.hipaaAcknowledged}
            onChange={(e) => onChange({ hipaaAcknowledged: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
          />
          <label htmlFor="hipaaConsent" className={`text-xs font-semibold cursor-pointer ${
            isHipaaMissing ? 'text-red-700' : 'text-slate-800'
          }`}>
            I acknowledge receipt and understanding of the Notice of Privacy Practices <span className="text-red-500">*</span>
          </label>
        </div>
        {isHipaaMissing && (
          <p className="text-[11px] text-red-600 font-medium flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Please acknowledge the HIPAA Privacy Practices before continuing
          </p>
        )}
      </div>

      {/* Mandatory Acknowledgment 2: Consent to Outpatient Medical Care */}
      <div className={`bg-white border rounded-2xl p-5 shadow-subtle space-y-3 transition ${
        isTreatmentMissing ? 'border-red-500 ring-2 ring-red-100 bg-red-50/10' : 'border-slate-200'
      }`}>
        <div className="space-y-1">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-600" />
            <span>2. General Consent for Medical Evaluation and Treatment</span>
            <span className="text-red-500">*</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            I voluntary request and authorize healthcare providers, clinical associates, and licensed staff of {clinic.name} to perform outpatient examinations, diagnostic testing, routine laboratory analyses, and medical evaluations necessary for my care. I understand that I retain the right to discuss treatment alternatives and risks with my physician prior to any specialized procedure.
          </p>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
          <input
            id="treatmentConsent"
            type="checkbox"
            required
            checked={data.treatmentConsent}
            onChange={(e) => onChange({ treatmentConsent: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
          />
          <label htmlFor="treatmentConsent" className={`text-xs font-semibold cursor-pointer ${
            isTreatmentMissing ? 'text-red-700' : 'text-slate-800'
          }`}>
            I consent to outpatient medical care and clinical examination <span className="text-red-500">*</span>
          </label>
        </div>
        {isTreatmentMissing && (
          <p className="text-[11px] text-red-600 font-medium flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Consent for outpatient medical care is required
          </p>
        )}
      </div>

      {/* Mandatory Acknowledgment 3: Direct Appointment Communications */}
      <div className={`bg-white border rounded-2xl p-5 shadow-subtle space-y-3 transition ${
        isCommMissing ? 'border-red-500 ring-2 ring-red-100 bg-red-50/10' : 'border-slate-200'
      }`}>
        <div className="space-y-1">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-teal-600" />
            <span>3. Appointment & Direct Clinical Communications</span>
            <span className="text-red-500">*</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            I consent to receive essential appointment confirmations, rescheduling alerts, and intake instructions via automated SMS text messaging, telephone calls, or secure email to the contact points provided in my registration.
          </p>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
          <input
            id="commConsent"
            type="checkbox"
            required
            checked={data.communicationConsent}
            onChange={(e) => onChange({ communicationConsent: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
          />
          <label htmlFor="commConsent" className={`text-xs font-semibold cursor-pointer ${
            isCommMissing ? 'text-red-700' : 'text-slate-800'
          }`}>
            I authorize clinical appointment notifications via phone, SMS, and email <span className="text-red-500">*</span>
          </label>
        </div>
        {isCommMissing && (
          <p className="text-[11px] text-red-600 font-medium flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Direct communication authorization is required
          </p>
        )}
      </div>

      {/* UNBUNDLED Optional Checkbox: Marketing / Wellness Bulletins */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
        <div className="flex items-start gap-2.5">
          <input
            id="marketingConsent"
            type="checkbox"
            checked={data.optionalMarketingConsent}
            onChange={(e) => onChange({ optionalMarketingConsent: e.target.checked })}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
          />
          <label htmlFor="marketingConsent" className="text-xs text-slate-700 cursor-pointer">
            <span className="font-semibold block text-slate-900">
              Optional: Community Wellness News & Preventative Health Updates
            </span>
            <span className="text-slate-500 block text-[11px] leading-relaxed">
              (Completely optional — not required for registration). Check here if you wish to receive occasional health tips, seasonal flu clinic announcements, and wellness newsletters from {clinic.name}. You may unsubscribe at any time.
            </span>
          </label>
        </div>
      </div>

      {/* Electronic Signature Block */}
      <div className={`bg-white border rounded-2xl p-5 shadow-subtle space-y-4 transition ${
        isSignatureMissing || isSignerMissing ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-200'
      }`}>
        <h3 className="font-bold text-sm text-slate-900">
          Electronic Signature & Signer Attestation
        </h3>

        <div className="space-y-1">
          <label htmlFor="signerName" className="text-xs font-semibold text-slate-700">
            Signer Full Legal Name <span className="text-red-500">*</span>
          </label>
          <input
            id="signerName"
            type="text"
            required
            value={data.signerName}
            onFocus={() => onFieldFocus('signature')}
            onChange={(e) => onChange({ signerName: e.target.value })}
            placeholder={patientName || 'Legal Full Name'}
            className={`w-full sm:w-80 bg-white border rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 ${
              isSignerMissing
                ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20'
                : 'border-slate-300 focus:ring-brand-500'
            }`}
          />
          {isSignerMissing && (
            <p className="text-[11px] text-red-600 font-medium">Signer legal name is required</p>
          )}
        </div>

        <SignaturePad
          signerName={data.signerName || patientName}
          initialSignature={data.signatureDataUrl}
          onSignatureChange={(sigUrl) => onChange({ signatureDataUrl: sigUrl, signedAt: new Date().toISOString() })}
        />
        {isSignatureMissing && (
          <p className="text-[11px] text-red-600 font-medium flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Electronic signature is required
          </p>
        )}

        <p className="text-[11px] text-slate-500 leading-relaxed">
          By drawing your electronic signature above and completing submission, you attest that you are the patient or legally authorized representative, that all information provided is accurate to the best of your knowledge, and that this electronic signature holds the full legal weight of a handwritten signature under the U.S. Federal ESIGN Act (15 U.S.C. § 7001).
        </p>
      </div>
    </div>
  );
};
