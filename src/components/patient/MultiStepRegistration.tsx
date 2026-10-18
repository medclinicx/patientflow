import React, { useState, useEffect } from 'react';
import { 
  PatientRegistration, 
  ClinicConfig, 
  RegistrationType 
} from '../../types';
import { StorageService } from '../../services/storageService';
import { VoiceAssistantService, VoiceStatus } from '../../services/voiceAssistant';
import { FIELD_EXPLANATIONS, validateStep } from '../../services/formValidation';

import { Step1Welcome } from './Step1Welcome';
import { Step2Demographics } from './Step2Demographics';
import { Step3EmergencyContact } from './Step3EmergencyContact';
import { Step4Insurance } from './Step4Insurance';
import { Step5Appointment } from './Step5Appointment';
import { Step6Consents } from './Step6Consents';
import { Step7ReviewSubmit } from './Step7ReviewSubmit';
import { RegistrationSuccess } from './RegistrationSuccess';
import { SaveResumeModal } from './SaveResumeModal';
import { VoiceAssistantBar } from '../common/VoiceAssistantBar';

import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  AlertCircle, 
  Save, 
  Clock, 
  Volume2, 
  VolumeX,
  FileEdit
} from 'lucide-react';

interface MultiStepRegistrationProps {
  clinic: ClinicConfig;
  initialRegistration?: PatientRegistration | null;
  language: 'en' | 'es';
  onViewStatus: () => void;
  voiceMuted: boolean;
  onToggleVoiceMute: () => void;
}

const STEP_TITLES = [
  'Welcome',
  'Demographics',
  'Emergency Contact',
  'Insurance',
  'Visit Details',
  'Consents & Signature',
  'Review & Submit',
];

export const MultiStepRegistration: React.FC<MultiStepRegistrationProps> = ({
  clinic,
  initialRegistration,
  language,
  onViewStatus,
  voiceMuted,
  onToggleVoiceMute,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [activeField, setActiveField] = useState<string>('firstName');
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>('idle');
  const [voiceTranscript, setVoiceTranscript] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [appointmentRefInput, setAppointmentRefInput] = useState('');
  const [stepError, setStepError] = useState<string | null>(null);
  const [showValidationErrors, setShowValidationErrors] = useState<boolean>(false);

  // Main Registration State
  const [regData, setRegData] = useState<PatientRegistration>(() => {
    if (initialRegistration) return initialRegistration;
    return {
      id: `PF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      clinicId: clinic.id,
      clinicName: clinic.name,
      registrationType: 'new_patient',
      status: 'in_progress',
      demographics: {
        firstName: '',
        middleName: '',
        lastName: '',
        preferredName: '',
        dateOfBirth: '',
        phone: '',
        email: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: 'IL',
        zipCode: '',
        preferredContact: 'email',
        preferredLanguage: language === 'es' ? 'Spanish' : 'English',
      },
      emergencyContact: {
        fullName: '',
        relationship: 'Spouse',
        primaryPhone: '',
        secondaryPhone: '',
        authorizedForMedicalDecisions: true,
      },
      insurance: {
        isSelfPay: false,
        providerName: '',
        planName: '',
        memberId: '',
        groupNumber: '',
        subscriberIsPatient: true,
        hasSecondaryInsurance: false,
      },
      appointment: {
        visitReason: '',
        department: 'Family Medicine & Primary Care',
        visitType: 'in_person',
        appointmentDate: '',
        hasUrgentSymptoms: false,
      },
      consent: {
        hipaaAcknowledged: false,
        treatmentConsent: false,
        communicationConsent: false,
        optionalMarketingConsent: false,
        signatureDataUrl: '',
        signerName: '',
        signedAt: '',
        documentVersion: clinic.consentDocumentVersion,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      auditLogs: [],
    };
  });

  const voiceService = VoiceAssistantService.getInstance();

  // Initialize Voice Assistant Listeners
  useEffect(() => {
    voiceService.setLanguage(language);
    voiceService.setHandlers({
      onStatusChange: (status) => setVoiceStatus(status),
      onTranscript: (text, isUser) => {
        setVoiceTranscript(text);
      },
      onCommand: (command) => {
        if (command === 'next') handleNextStep();
        if (command === 'back') handlePrevStep();
        if (command === 'help') handleExplainField(activeField);
      },
    });

    // Provide welcoming audio intro on first load if not muted
    if (!voiceMuted) {
      const greeting = language === 'es'
        ? `Bienvenido a ${clinic.name}. Le guiaré paso a paso por su registro digital.`
        : `Welcome to ${clinic.name}. I will guide you through your digital registration. You can pause or mute my voice at any time.`;
      voiceService.speak(greeting);
    }

    return () => {
      voiceService.stopSpeaking();
    };
  }, [language, clinic.id]);

  // Handle Step change announcements
  const announceStep = (stepNumber: number) => {
    if (voiceMuted) return;
    const announcementsEn: Record<number, string> = {
      1: `Step 1: Welcome. Please select whether you are a new patient or updating existing details.`,
      2: `Step 2: Patient Demographics. Please enter your legal first and last name, date of birth, and contact information.`,
      3: `Step 3: Emergency Contact. Please provide the contact information for a trusted individual in case of a medical emergency.`,
      4: `Step 4: Health Insurance. Please indicate if you are self-paying, or provide your insurance carrier and member ID. You can also upload photos of your card.`,
      5: `Step 5: Visit Details. Please choose your specialty department and briefly state the reason for your visit.`,
      6: `Step 6: Consents and Acknowledgments. Review our privacy policies and draw your electronic signature.`,
      7: `Step 7: Final Review. Please review each section carefully before submitting your completed packet.`,
    };

    const text = announcementsEn[stepNumber] || `Step ${stepNumber}`;
    voiceService.speak(text);
  };

  const handleNextStep = () => {
    // Validate current step before proceeding
    const result = validateStep(currentStep, regData, clinic, language);
    if (!result.isValid) {
      setStepError(result.errorMessage || 'Please fill in the required field.');
      setShowValidationErrors(true);

      // Voice agent speaks: "Please fill in the required field."
      const alertMsg = "Please fill in the required field.";
      setVoiceTranscript(alertMsg);
      voiceService.speak(alertMsg);

      if (result.errorField) {
        const fieldName = result.errorField;
        setActiveField(fieldName);
        setTimeout(() => {
          const el = document.getElementById(fieldName) || 
                     document.querySelector(`[name="${fieldName}"]`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            (el as HTMLElement).focus();
          }
        }, 50);
      }
      return;
    }

    setStepError(null);
    setShowValidationErrors(false);

    if (currentStep < 7) {
      const next = currentStep + 1;
      setCurrentStep(next);
      announceStep(next);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setStepError(null);
      setShowValidationErrors(false);
      const prev = currentStep - 1;
      setCurrentStep(prev);
      announceStep(prev);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFieldFocus = (fieldId: string) => {
    setActiveField(fieldId);
  };

  const handleExplainField = (fieldId: string) => {
    const help = FIELD_EXPLANATIONS[fieldId];
    if (help) {
      const text = language === 'es' ? help.helpEs : help.helpEn;
      voiceService.speak(text);
    } else {
      voiceService.speak(`This field is required for your intake records. Please enter accurate information.`);
    }
  };

  // Final Submission
  const handleSubmitRegistration = () => {
    setIsSubmitting(true);
    voiceService.speak(`Submitting your registration packet to ${clinic.name}. Please wait a moment.`);

    setTimeout(() => {
      const completed: PatientRegistration = {
        ...regData,
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        completionTimeSeconds: 240,
      };

      StorageService.saveRegistration(
        completed,
        `${completed.demographics.firstName} ${completed.demographics.lastName}`,
        'patient'
      );

      setRegData(completed);
      setIsSubmitting(false);
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (!voiceMuted) {
        voiceService.speak(`Your registration is complete! Your confirmation number is ${completed.id}. Thank you.`);
      }
    }, 1200);
  };

  if (isSuccess) {
    return (
      <RegistrationSuccess
        registration={regData}
        clinic={clinic}
        onReset={() => {
          setIsSuccess(false);
          setCurrentStep(1);
        }}
        onViewStatus={onViewStatus}
        language={language}
      />
    );
  }

  return (
    <div className="w-full space-y-4 sm:space-y-6 pb-40 sm:pb-28">
      {/* Staff Correction Request Alert Banner if in correction mode */}
      {regData.status === 'needs_correction' && regData.correctionRequest && (
        <div className="bg-amber-500 text-white rounded-2xl p-4 sm:p-5 shadow-elevated flex items-start gap-3.5 animate-fadeIn">
          <FileEdit className="w-6 h-6 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
              Action Required: Clinic Requested Correction
            </span>
            <p className="font-bold text-sm">
              Note from {regData.correctionRequest.requestedBy}:
            </p>
            <p className="text-xs text-amber-50 leading-relaxed">
              "{regData.correctionRequest.notes}"
            </p>
            <p className="text-[11px] text-amber-100 font-mono pt-1">
              Flagged Fields: {regData.correctionRequest.fields.join(', ')}
            </p>
          </div>
        </div>
      )}

      {/* Step Progress Stepper Bar — Desktop View */}
      <div className="hidden md:block bg-white border border-slate-200 rounded-2xl p-4 shadow-subtle overflow-x-auto">
        <div className="flex items-center justify-between min-w-[620px]">
          {STEP_TITLES.map((title, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;

            return (
              <React.Fragment key={title}>
                <div
                  onClick={() => {
                    if (stepNum <= currentStep) {
                      setStepError(null);
                      setShowValidationErrors(false);
                      setCurrentStep(stepNum);
                      announceStep(stepNum);
                    } else {
                      // Validate all steps from currentStep up to stepNum - 1
                      for (let s = currentStep; s < stepNum; s++) {
                        const check = validateStep(s, regData, clinic, language);
                        if (!check.isValid) {
                          setStepError(check.errorMessage || 'Please fill in the required field.');
                          setShowValidationErrors(true);
                          const alertMsg = "Please fill in the required field.";
                          setVoiceTranscript(alertMsg);
                          voiceService.speak(alertMsg);
                          if (check.errorField) {
                            const fieldName = check.errorField;
                            setActiveField(fieldName);
                            setTimeout(() => {
                              const el = document.getElementById(fieldName) || 
                                         document.querySelector(`[name="${fieldName}"]`);
                              if (el) {
                                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                (el as HTMLElement).focus();
                              }
                            }, 50);
                          }
                          return;
                        }
                      }
                      setStepError(null);
                      setShowValidationErrors(false);
                      setCurrentStep(stepNum);
                      announceStep(stepNum);
                    }
                  }}
                  className={`flex items-center gap-2 cursor-pointer transition ${
                    isCurrent 
                      ? 'text-[#0066FF] font-bold' 
                      : isCompleted 
                      ? 'text-slate-700 hover:text-slate-900' 
                      : 'text-slate-400'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-[#0066FF] text-white shadow-sm ring-4 ring-blue-100'
                      : isCompleted
                      ? 'bg-[#0066FF] text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {isCompleted ? <Check className="w-4 h-4 stroke-[2.5]" /> : stepNum}
                  </div>
                  <span className="text-xs whitespace-nowrap">{title}</span>
                </div>

                {stepNum < STEP_TITLES.length && (
                  <div className={`flex-1 h-0.5 mx-2 ${
                    stepNum < currentStep ? 'bg-[#0066FF]' : 'bg-slate-200'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step Progress Stepper Bar — Mobile Compact View */}
      <div className="md:hidden bg-white border border-slate-200 rounded-2xl p-3.5 shadow-subtle space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span className="bg-[#0066FF] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
              Step {currentStep} of {STEP_TITLES.length}
            </span>
            <span className="font-bold text-xs text-slate-900 truncate">
              {STEP_TITLES[currentStep - 1]}
            </span>
          </div>
          <span className="text-[11px] font-bold text-[#0066FF] shrink-0">
            {Math.round(((currentStep - 1) / (STEP_TITLES.length - 1)) * 100)}%
          </span>
        </div>

        {/* Smooth Mobile Progress Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-[#0066FF] h-full transition-all duration-300 rounded-full"
            style={{ width: `${Math.max(10, Math.round(((currentStep - 1) / (STEP_TITLES.length - 1)) * 100))}%` }}
          />
        </div>

        {/* Compact Horizontal Quick Step Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5 pb-0.5">
          {STEP_TITLES.map((title, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;

            return (
              <button
                key={title}
                type="button"
                onClick={() => {
                  if (stepNum <= currentStep) {
                    setStepError(null);
                    setShowValidationErrors(false);
                    setCurrentStep(stepNum);
                    announceStep(stepNum);
                  } else {
                    for (let s = currentStep; s < stepNum; s++) {
                      const check = validateStep(s, regData, clinic, language);
                      if (!check.isValid) {
                        setStepError(check.errorMessage || 'Please fill in the required field.');
                        setShowValidationErrors(true);
                        const alertMsg = "Please fill in the required field.";
                        setVoiceTranscript(alertMsg);
                        voiceService.speak(alertMsg);
                        if (check.errorField) {
                          const fieldName = check.errorField;
                          setActiveField(fieldName);
                          setTimeout(() => {
                            const el = document.getElementById(fieldName) || 
                                       document.querySelector(`[name="${fieldName}"]`);
                            if (el) {
                              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              (el as HTMLElement).focus();
                            }
                          }, 50);
                        }
                        return;
                      }
                    }
                    setStepError(null);
                    setShowValidationErrors(false);
                    setCurrentStep(stepNum);
                    announceStep(stepNum);
                  }
                }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 transition flex items-center gap-1 ${
                  isCurrent
                    ? 'bg-[#0066FF] text-white shadow-xs'
                    : isCompleted
                    ? 'bg-blue-50 text-[#0066FF] hover:bg-blue-100'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : stepNum}
                <span>{title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Active Form View Card */}
      <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-card">
        {currentStep === 1 && (
          <Step1Welcome
            clinic={clinic}
            registrationType={regData.registrationType}
            onSelectRegistrationType={(type: RegistrationType) => setRegData({ ...regData, registrationType: type })}
            onNext={handleNextStep}
            voiceMuted={voiceMuted}
            onToggleVoiceMute={onToggleVoiceMute}
            language={language}
            appointmentRefInput={appointmentRefInput}
            onAppointmentRefChange={setAppointmentRefInput}
          />
        )}

        {currentStep === 2 && (
          <Step2Demographics
            data={regData.demographics}
            onChange={(updated) => setRegData({ ...regData, demographics: { ...regData.demographics, ...updated } })}
            clinic={clinic}
            language={language}
            onFieldFocus={handleFieldFocus}
            onAskHelp={handleExplainField}
            showErrors={showValidationErrors}
          />
        )}

        {currentStep === 3 && (
          <Step3EmergencyContact
            data={regData.emergencyContact}
            onChange={(updated) => setRegData({ ...regData, emergencyContact: { ...regData.emergencyContact, ...updated } })}
            clinic={clinic}
            language={language}
            onFieldFocus={handleFieldFocus}
            onAskHelp={handleExplainField}
            showErrors={showValidationErrors}
          />
        )}

        {currentStep === 4 && (
          <Step4Insurance
            data={regData.insurance}
            onChange={(updated) => setRegData({ ...regData, insurance: { ...regData.insurance, ...updated } })}
            clinic={clinic}
            language={language}
            onFieldFocus={handleFieldFocus}
            onAskHelp={handleExplainField}
            showErrors={showValidationErrors}
          />
        )}

        {currentStep === 5 && (
          <Step5Appointment
            data={regData.appointment}
            onChange={(updated) => setRegData({ ...regData, appointment: { ...regData.appointment, ...updated } })}
            clinic={clinic}
            language={language}
            onFieldFocus={handleFieldFocus}
            onAskHelp={handleExplainField}
            showErrors={showValidationErrors}
          />
        )}

        {currentStep === 6 && (
          <Step6Consents
            data={regData.consent}
            onChange={(updated) => setRegData({ ...regData, consent: { ...regData.consent, ...updated } })}
            clinic={clinic}
            patientName={`${regData.demographics.firstName} ${regData.demographics.lastName}`.trim()}
            language={language}
            onFieldFocus={handleFieldFocus}
            showErrors={showValidationErrors}
          />
        )}

        {currentStep === 7 && (
          <Step7ReviewSubmit
            registration={regData}
            clinic={clinic}
            onEditSection={(stepIndex) => {
              setCurrentStep(stepIndex);
              announceStep(stepIndex);
            }}
            onSubmit={handleSubmitRegistration}
            onSaveDraft={() => setSaveModalOpen(true)}
            isSubmitting={isSubmitting}
            language={language}
          />
        )}

        {/* Step Validation Error Banner */}
        {stepError && currentStep > 1 && currentStep < 7 && (
          <div className="mt-6 mb-2 p-3.5 sm:p-4 bg-red-50 border-2 border-red-200 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-red-900 animate-fadeIn">
            <div className="flex items-start sm:items-center gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-red-100 flex items-center justify-center shrink-0 text-red-600 mt-0.5 sm:mt-0">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-xs text-red-950">Required Field Missing</p>
                <p className="text-xs text-red-800 break-words">{stepError}</p>
              </div>
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold bg-red-200/80 text-red-900 px-2.5 py-1 rounded-lg shrink-0 self-start sm:self-auto">
              Action Required
            </span>
          </div>
        )}

        {/* Global Navigation Footer Buttons (For steps 2 through 6) */}
        {currentStep > 1 && currentStep < 7 && (
          <div className="pt-5 sm:pt-6 border-t border-slate-200 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-3.5 sm:px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs min-h-[42px] flex items-center gap-1.5 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setSaveModalOpen(true)}
                className="px-2.5 sm:px-3 py-2.5 sm:py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 items-center gap-1.5 transition rounded-xl border border-slate-200 sm:border-transparent min-h-[42px] sm:min-h-0 flex"
                title="Save Draft & Resume Later"
              >
                <Save className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden xs:inline sm:inline">Save Draft</span>
              </button>

              <button
                type="button"
                onClick={handleNextStep}
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-5 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-sm transition min-h-[42px] flex items-center justify-center gap-1.5"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating AI Voice Assistant Bar */}
      <VoiceAssistantBar
        status={voiceStatus}
        currentMessage={voiceTranscript}
        isMuted={voiceMuted}
        onToggleMute={onToggleVoiceMute}
        onRepeat={() => voiceService.repeat()}
        onAskHelp={() => handleExplainField(activeField)}
        onNextStep={handleNextStep}
        onStartListening={() => voiceService.startListening()}
        onStopListening={() => voiceService.stopListening()}
        activeFieldName={FIELD_EXPLANATIONS[activeField]?.label || activeField}
        language={language}
      />

      {/* Save & Resume Modal */}
      <SaveResumeModal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        currentData={regData}
        onResumeSuccess={(resumed) => {
          setRegData({ ...regData, ...resumed } as PatientRegistration);
        }}
      />
    </div>
  );
};
