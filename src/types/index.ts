export type UserRole = 'patient' | 'staff' | 'clinic_admin' | 'platform_admin';

export type RegistrationStatus = 
  | 'draft'
  | 'in_progress'
  | 'submitted'
  | 'under_review'
  | 'needs_correction'
  | 'complete';

export type RegistrationType = 'new_patient' | 'existing_update' | 'appointment_linked';

export interface PatientDemographics {
  firstName: string;
  middleName?: string;
  lastName: string;
  preferredName?: string;
  dateOfBirth: string; // YYYY-MM-DD
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  preferredContact: 'phone' | 'email' | 'sms';
  preferredLanguage: string;
}

export interface EmergencyContact {
  fullName: string;
  relationship: string;
  primaryPhone: string;
  secondaryPhone?: string;
  authorizedForMedicalDecisions?: boolean;
}

export interface InsuranceInfo {
  isSelfPay: boolean;
  providerName: string;
  planName?: string;
  memberId: string;
  groupNumber?: string;
  subscriberIsPatient: boolean;
  subscriberName?: string;
  subscriberDob?: string;
  subscriberRelationship?: string;
  hasSecondaryInsurance: boolean;
  secondaryProvider?: string;
  secondaryMemberId?: string;
  cardFrontUrl?: string;
  cardBackUrl?: string;
  extractedCardData?: {
    payerDetected?: string;
    memberIdDetected?: string;
    groupDetected?: string;
    confidenceScore?: number;
    reviewedByPatient?: boolean;
  };
}

export interface AppointmentVisitInfo {
  visitReason: string;
  department: string;
  visitType: 'in_person' | 'telehealth';
  appointmentDate?: string;
  appointmentRef?: string;
  hasUrgentSymptoms: boolean;
  symptomsDescription?: string;
}

export interface ConsentRecord {
  hipaaAcknowledged: boolean;
  treatmentConsent: boolean;
  communicationConsent: boolean;
  optionalMarketingConsent: boolean;
  signatureDataUrl: string; // base64 canvas image
  signerName: string;
  signedAt: string; // ISO string
  documentVersion: string;
}

export interface PatientRegistration {
  id: string; // confirmation number e.g. PF-2026-8812
  clinicId: string;
  clinicName: string;
  registrationType: RegistrationType;
  status: RegistrationStatus;
  demographics: PatientDemographics;
  emergencyContact: EmergencyContact;
  insurance: InsuranceInfo;
  appointment: AppointmentVisitInfo;
  consent: ConsentRecord;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  completedAt?: string;
  completionTimeSeconds?: number;
  correctionRequest?: {
    requestedAt: string;
    requestedBy: string;
    fields: string[]; // e.g. ['insurance.memberId', 'demographics.addressLine1']
    notes: string;
    resolved: boolean;
  };
  staffNotes?: string[];
  auditLogs: AuditLogEntry[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: UserRole;
  action: string;
  details: string;
}

export interface ClinicConfig {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  phone: string;
  email: string;
  primaryColor: string;
  logoUrl?: string;
  activeSections: {
    demographics: boolean;
    emergencyContact: boolean;
    insurance: boolean;
    appointment: boolean;
    consent: boolean;
  };
  requiredFields: {
    middleName: boolean;
    preferredName: boolean;
    addressLine2: boolean;
    emergencySecondaryPhone: boolean;
    insuranceGroupNumber: boolean;
    insuranceCardUpload: boolean;
    appointmentDate: boolean;
  };
  customWelcomeMessage?: string;
  consentDocumentVersion: string;
  supportedLanguages: Array<{ code: string; label: string }>;
}

export interface VoiceState {
  enabled: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  currentMessage: string;
  currentField?: string;
  transcriptHistory: Array<{ sender: 'assistant' | 'user'; text: string; timestamp: string }>;
  volume: number; // 0 to 1
  rate: number; // 0.8 to 1.2
}
