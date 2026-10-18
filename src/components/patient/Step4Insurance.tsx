import React, { useState } from 'react';
import { InsuranceInfo, ClinicConfig } from '../../types';
import { 
  CreditCard, 
  Upload, 
  CheckCircle2, 
  X, 
  HelpCircle, 
  AlertCircle, 
  ShieldCheck, 
  FileCheck,
  Eye,
  Info,
  Sparkles
} from 'lucide-react';

interface Step4InsuranceProps {
  data: InsuranceInfo;
  onChange: (updated: Partial<InsuranceInfo>) => void;
  clinic: ClinicConfig;
  language: 'en' | 'es';
  onFieldFocus: (fieldId: string) => void;
  onAskHelp: (fieldId: string) => void;
  showErrors?: boolean;
}

const COMMON_PAYERS = [
  'Blue Cross Blue Shield',
  'Aetna',
  'UnitedHealthcare',
  'Cigna',
  'Humana',
  'Medicare Part B',
  'Medicaid',
  'Kaiser Permanente',
  'Anthem',
  'Tricare / VA Health',
  'Other Commercial Payer',
];

export const Step4Insurance: React.FC<Step4InsuranceProps> = ({
  data,
  onChange,
  clinic,
  language,
  onFieldFocus,
  onAskHelp,
  showErrors = false,
}) => {
  const isEs = language === 'es';
  const [extractedReviewOpen, setExtractedReviewOpen] = useState(false);
  const [isSimulatingOcr, setIsSimulatingOcr] = useState(false);

  const isProviderMissing = showErrors && !data.isSelfPay && !data.providerName.trim();
  const isMemberIdMissing = showErrors && !data.isSelfPay && !data.memberId.trim();
  const isCardUploadMissing = showErrors && !data.isSelfPay && !!clinic.requiredFields.insuranceCardUpload && !data.cardFrontUrl;

  // Simulated upload with realistic sample card
  const handleUploadCard = (side: 'front' | 'back', customFileUrl?: string) => {
    setIsSimulatingOcr(true);

    setTimeout(() => {
      if (side === 'front') {
        const sampleFront = customFileUrl || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="360" height="220" viewBox="0 0 360 220"%3E%3Cdefs%3E%3ClinearGradient id="grad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" stop-color="%230284c7" /%3E%3Cstop offset="100%25" stop-color="%230369a1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="360" height="220" rx="14" fill="url(%23grad)" /%3E%3Ctext x="24" y="44" fill="white" font-weight="bold" font-size="16" font-family="sans-serif"%3EBLUE CROSS BLUE SHIELD%3C/text%3E%3Ctext x="24" y="68" fill="%23bae6fd" font-size="11" font-family="sans-serif"%3EPreferred PPO Network%3C/text%3E%3Ctext x="24" y="115" fill="%23bae6fd" font-size="10" font-family="sans-serif"%3ESUBSCRIBER NAME%3C/text%3E%3Ctext x="24" y="132" fill="white" font-weight="600" font-size="14" font-family="sans-serif"%3EELEANOR VANCE%3C/text%3E%3Ctext x="24" y="165" fill="%23bae6fd" font-size="10" font-family="sans-serif"%3EMEMBER ID%3C/text%3E%3Ctext x="24" y="182" fill="white" font-family="monospace" font-size="14"%3EXOF849204918%3C/text%3E%3Ctext x="200" y="165" fill="%23bae6fd" font-size="10" font-family="sans-serif"%3EGROUP %23%3C/text%3E%3Ctext x="200" y="182" fill="white" font-family="monospace" font-size="14"%3EGRP-99420%3C/text%3E%3C/svg%3E';

        onChange({
          cardFrontUrl: sampleFront,
          extractedCardData: {
            payerDetected: 'Blue Cross Blue Shield',
            memberIdDetected: 'XOF849204918',
            groupDetected: 'GRP-99420',
            confidenceScore: 0.98,
            reviewedByPatient: false,
          },
        });
        setExtractedReviewOpen(true);
      } else {
        const sampleBack = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="360" height="220" viewBox="0 0 360 220"%3E%3Crect width="360" height="220" rx="14" fill="%23f1f5f9" stroke="%23cbd5e1" stroke-width="2" /%3E%3Crect x="0" y="24" width="360" height="36" fill="%231e293b" /%3E%3Ctext x="24" y="90" fill="%23475569" font-size="10" font-family="sans-serif"%3EFOR PROVIDERS: Submit CMS-1500 to P.O. Box 8000%3C/text%3E%3Ctext x="24" y="120" fill="%23475569" font-size="10" font-family="sans-serif"%3EPayer ID: 00040 | Customer Service: 1-800-555-0199%3C/text%3E%3Ctext x="24" y="150" fill="%23475569" font-size="10" font-family="sans-serif"%3EPharmacy RxBIN: 004336 RxPCN: ADV%3C/text%3E%3C/svg%3E';
        onChange({ cardBackUrl: sampleBack });
      }
      setIsSimulatingOcr(false);
    }, 600);
  };

  const handleApplyExtractedValues = () => {
    if (!data.extractedCardData) return;
    onChange({
      providerName: data.extractedCardData.payerDetected || data.providerName,
      memberId: data.extractedCardData.memberIdDetected || data.memberId,
      groupNumber: data.extractedCardData.groupDetected || data.groupNumber,
      extractedCardData: {
        ...data.extractedCardData,
        reviewedByPatient: true,
      },
    });
    setExtractedReviewOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-brand-600" />
            <span>{isEs ? 'Información de Seguro Médico' : 'Health Insurance Information'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isEs 
              ? 'Proporcione su cobertura médica o indique si es paciente particular.'
              : 'Provide your primary policy details or indicate self-pay status.'}
          </p>
        </div>
        <span className="text-xs font-semibold bg-brand-50 text-brand-700 px-3 py-1 rounded-full border border-brand-200">
          Step 4 of 7
        </span>
      </div>

      {/* Distinction Banner: Collection vs Live Eligibility */}
      <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-sky-950">
        <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-sky-900">
            {isEs ? 'Aclaración de Verificación de Cobertura:' : 'Important: Insurance Intake vs. Live Payer Verification'}
          </p>
          <p className="text-[11.5px] text-sky-800 leading-relaxed">
            {isEs 
              ? 'La recopilación de sus datos de póliza y tarjetas permite a nuestro equipo preparar su expediente. La verificación formal de elegibilidad y copago se efectúa directamente a través de la red del pagador antes o durante su consulta.'
              : 'Collecting your insurance cards and subscriber information enables our clinic billing team to pre-validate your coverage. Live eligibility responses require an authorized payer EDI clearinghouse transaction and will be confirmed upon staff intake review.'}
          </p>
        </div>
      </div>

      {/* Self-Pay Switcher */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">
            {isEs ? '¿Es Paciente Particular / Sin Seguro Médico?' : 'Self-Pay / No Health Insurance'}
          </h3>
          <p className="text-xs text-slate-500">
            {isEs 
              ? 'Active esta opción si no utilizará seguro de salud para esta consulta.' 
              : 'Toggle this on if you are paying out-of-pocket, uninsured, or using a self-pay fee schedule.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onChange({ isSelfPay: !data.isSelfPay })}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500 ${
            data.isSelfPay ? 'bg-brand-600' : 'bg-slate-300'
          }`}
          role="switch"
          aria-checked={data.isSelfPay}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              data.isSelfPay ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {data.isSelfPay ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-emerald-900 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-emerald-950">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{isEs ? 'Modalidad Particular Seleccionada' : 'Self-Pay Option Selected'}</span>
          </div>
          <p className="text-xs text-emerald-800 leading-relaxed">
            {isEs 
              ? 'No se requieren detalles de aseguradora. De acuerdo con la ley federal "No Surprises Act", la clínica le proporcionará un Estimado de Buena Fe (Good Faith Estimate) con los costos previstos de su atención.'
              : 'You do not need to provide insurance cards. In accordance with the federal No Surprises Act, our clinic will provide a Good Faith Estimate of expected clinical charges prior to scheduled services.'}
          </p>
        </div>
      ) : (
        /* Insured Fields */
        <div className="space-y-6">
          {/* Card Upload Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-brand-600" />
                <span>{isEs ? 'Fotos de la Tarjeta de Seguro' : 'Upload Insurance Card Photos'}</span>
                {clinic.requiredFields.insuranceCardUpload && <span className="text-red-500">*</span>}
              </label>
              <span className="text-[11px] text-slate-500">JPG, PNG, or PDF up to 10MB</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Front Card */}
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:border-brand-500 transition-colors bg-white flex flex-col items-center justify-center min-h-[160px] relative">
                {data.cardFrontUrl ? (
                  <div className="w-full space-y-2">
                    <img 
                      src={data.cardFrontUrl} 
                      alt="Insurance Card Front" 
                      className="w-full h-32 object-contain rounded-lg border border-slate-200"
                    />
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Front Card Uploaded
                      </span>
                      <button
                        type="button"
                        onClick={() => onChange({ cardFrontUrl: undefined, extractedCardData: undefined })}
                        className="text-red-500 hover:text-red-700 text-xs font-medium flex items-center gap-1"
                      >
                        <X className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Card Front (Required)</p>
                      <p className="text-[11px] text-slate-500">Shows Member ID, Group, and Plan</p>
                    </div>
                    <div className="flex items-center justify-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleUploadCard('front')}
                        disabled={isSimulatingOcr}
                        className="bg-brand-50 hover:bg-brand-100 text-brand-700 px-3 py-1.5 rounded-lg text-xs font-semibold border border-brand-200 transition"
                      >
                        {isSimulatingOcr ? 'Analyzing Card...' : 'Upload Front Card Photo'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Back Card */}
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:border-brand-500 transition-colors bg-white flex flex-col items-center justify-center min-h-[160px]">
                {data.cardBackUrl ? (
                  <div className="w-full space-y-2">
                    <img 
                      src={data.cardBackUrl} 
                      alt="Insurance Card Back" 
                      className="w-full h-32 object-contain rounded-lg border border-slate-200"
                    />
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Back Card Uploaded
                      </span>
                      <button
                        type="button"
                        onClick={() => onChange({ cardBackUrl: undefined })}
                        className="text-red-500 hover:text-red-700 text-xs font-medium flex items-center gap-1"
                      >
                        <X className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mx-auto">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Card Back</p>
                      <p className="text-[11px] text-slate-500">Shows Claims Address & Provider Line</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleUploadCard('back')}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                    >
                      Upload Back Card Photo
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* AI Extracted Candidate Values Review Drawer */}
          {data.extractedCardData && !data.extractedCardData.reviewedByPatient && (
            <div className="bg-[#EBF8FE] border border-blue-200 rounded-2xl p-4 shadow-subtle space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#0066FF]" />
                  <h4 className="text-xs font-bold text-slate-900">
                    AI Card Data Extracted — Patient Review Required
                  </h4>
                </div>
                <span className="text-[10px] bg-blue-100 text-[#0066FF] font-mono font-bold px-2 py-0.5 rounded-full">
                  98% Match Confidence
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                Candidate values were recognized from your card image. Per healthcare safety standards, please verify these match before populating your registration:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white/90 p-3 rounded-xl border border-blue-200/60 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Detected Payer:</span>
                  <span className="font-semibold text-slate-800">{data.extractedCardData.payerDetected}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Detected Member ID:</span>
                  <span className="font-mono font-semibold text-slate-800">{data.extractedCardData.memberIdDetected}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Detected Group #:</span>
                  <span className="font-mono font-semibold text-slate-800">{data.extractedCardData.groupDetected}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onChange({ extractedCardData: { ...data.extractedCardData, reviewedByPatient: true } })}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
                >
                  Keep My Entered Values
                </button>
                <button
                  type="button"
                  onClick={handleApplyExtractedValues}
                  className="bg-[#0066FF] hover:bg-[#0052CC] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm transition flex items-center gap-1.5"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Verify & Apply to Form</span>
                </button>
              </div>
            </div>
          )}

          {/* Primary Insurance Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Provider Name */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="insuranceProvider" className="text-xs font-semibold text-slate-700">
                  {isEs ? 'Compañía de Seguro' : 'Insurance Company'} <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => onAskHelp('insuranceProvider')}
                  className="text-slate-400 hover:text-brand-600"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </div>
              <input
                id="insuranceProvider"
                type="text"
                list="payers-list"
                required
                value={data.providerName}
                onFocus={() => onFieldFocus('insuranceProvider')}
                onChange={(e) => onChange({ providerName: e.target.value })}
                placeholder="e.g. Blue Cross Blue Shield"
                className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 ${
                  isProviderMissing
                    ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20'
                    : 'border-slate-300 focus:ring-brand-500'
                }`}
              />
              {isProviderMissing && (
                <p className="text-[11px] text-red-600 font-medium">Insurance provider name is required</p>
              )}
              <datalist id="payers-list">
                {COMMON_PAYERS.map((p) => (
                  <option key={p} value={p} />
                ))}
              </datalist>
            </div>

            {/* Plan Name */}
            <div className="space-y-1">
              <label htmlFor="insurancePlan" className="text-xs font-semibold text-slate-700">
                {isEs ? 'Nombre del Plan' : 'Plan Name (if known)'}
              </label>
              <input
                id="insurancePlan"
                type="text"
                value={data.planName || ''}
                onFocus={() => onFieldFocus('insurancePlan')}
                onChange={(e) => onChange({ planName: e.target.value })}
                placeholder="e.g. Blue Choice PPO"
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Member ID */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="insuranceMemberId" className="text-xs font-semibold text-slate-700">
                  {isEs ? 'ID de Miembro / Suscriptor' : 'Member / Subscriber ID'} <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => onAskHelp('insuranceMemberId')}
                  className="text-slate-400 hover:text-brand-600"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </div>
              <input
                id="insuranceMemberId"
                type="text"
                required
                value={data.memberId}
                onFocus={() => onFieldFocus('insuranceMemberId')}
                onChange={(e) => onChange({ memberId: e.target.value })}
                placeholder="e.g. XOF849204918"
                className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 ${
                  isMemberIdMissing
                    ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20'
                    : 'border-slate-300 focus:ring-brand-500'
                }`}
              />
              {isMemberIdMissing && (
                <p className="text-[11px] text-red-600 font-medium">Member or subscriber ID is required</p>
              )}
            </div>

            {/* Group Number */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                {isEs ? 'Número de Grupo' : 'Group Number'} {clinic.requiredFields.insuranceGroupNumber && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                value={data.groupNumber || ''}
                onFocus={() => onFieldFocus('insuranceGroup')}
                onChange={(e) => onChange({ groupNumber: e.target.value })}
                placeholder="e.g. GRP-99420 (Optional)"
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Subscriber is Patient Toggle */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 block">
                {isEs ? '¿El paciente es el titular principal del seguro?' : 'Is the patient the primary subscriber?'}
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onChange({ subscriberIsPatient: true })}
                  className={`flex-1 py-2 text-xs font-medium rounded-xl border transition ${
                    data.subscriberIsPatient
                      ? 'border-brand-600 bg-brand-50 text-brand-700 font-bold'
                      : 'border-slate-300 bg-white text-slate-600'
                  }`}
                >
                  Yes, Patient is Subscriber
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ subscriberIsPatient: false })}
                  className={`flex-1 py-2 text-xs font-medium rounded-xl border transition ${
                    !data.subscriberIsPatient
                      ? 'border-brand-600 bg-brand-50 text-brand-700 font-bold'
                      : 'border-slate-300 bg-white text-slate-600'
                  }`}
                >
                  No, Policy is under Spouse/Parent
                </button>
              </div>
            </div>
          </div>

          {/* Conditional Subscriber Info if Patient is NOT Subscriber */}
          {!data.subscriberIsPatient && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 animate-fadeIn">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Primary Policyholder Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Subscriber Legal Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={data.subscriberName || ''}
                    onFocus={() => onFieldFocus('subscriberName')}
                    onChange={(e) => onChange({ subscriberName: e.target.value })}
                    placeholder="e.g. Thomas Vance"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Subscriber Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={data.subscriberDob || ''}
                    onFocus={() => onFieldFocus('subscriberDob')}
                    onChange={(e) => onChange({ subscriberDob: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Patient's Relationship to Subscriber <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={data.subscriberRelationship || 'Spouse'}
                    onChange={(e) => onChange({ subscriberRelationship: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Dependent">Other Dependent</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Secondary Insurance Conditional Toggle */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 text-xs">Do you have Secondary Insurance coverage?</p>
                <p className="text-[11px] text-slate-500">e.g. Supplemental Medicare, dental add-on, or secondary employer plan</p>
              </div>
              <button
                type="button"
                onClick={() => onChange({ hasSecondaryInsurance: !data.hasSecondaryInsurance })}
                className={`px-3 py-1 text-xs font-semibold rounded-lg border transition ${
                  data.hasSecondaryInsurance 
                    ? 'bg-brand-600 text-white border-brand-600' 
                    : 'bg-white text-slate-700 border-slate-300'
                }`}
              >
                {data.hasSecondaryInsurance ? 'Yes (Added)' : 'No'}
              </button>
            </div>

            {data.hasSecondaryInsurance && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200 animate-fadeIn">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Secondary Payer Name</label>
                  <input
                    type="text"
                    value={data.secondaryProvider || ''}
                    onChange={(e) => onChange({ secondaryProvider: e.target.value })}
                    placeholder="e.g. Aetna Medicare Supplement"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Secondary Member ID</label>
                  <input
                    type="text"
                    value={data.secondaryMemberId || ''}
                    onChange={(e) => onChange({ secondaryMemberId: e.target.value })}
                    placeholder="e.g. SEC-904123"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-mono text-slate-900"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
