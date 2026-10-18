import { PatientRegistration, ClinicConfig, AuditLogEntry, UserRole } from '../types';

export const INITIAL_CLINICS: ClinicConfig[] = [
  {
    id: 'metro-health',
    name: 'MetroHealth Medical Center',
    slug: 'metro-health',
    tagline: 'Comprehensive patient-centered care for your whole family',
    phone: '(555) 234-5678',
    email: 'intake@metrohealthny.org',
    primaryColor: '#0284c7',
    activeSections: {
      demographics: true,
      emergencyContact: true,
      insurance: true,
      appointment: true,
      consent: true,
    },
    requiredFields: {
      middleName: false,
      preferredName: false,
      addressLine2: false,
      emergencySecondaryPhone: false,
      insuranceGroupNumber: false,
      insuranceCardUpload: true,
      appointmentDate: true,
    },
    customWelcomeMessage: 'Welcome to MetroHealth! Completing your digital registration in advance helps us minimize your waiting room time and protect your health data.',
    consentDocumentVersion: 'v2026.1-HIPAA',
    supportedLanguages: [
      { code: 'en', label: 'English' },
      { code: 'es', label: 'Español' },
    ],
  },
  {
    id: 'pacific-coast',
    name: 'Pacific Coast Family Practice',
    slug: 'pacific-coast',
    tagline: 'Compassionate neighborhood medicine along the bay',
    phone: '(555) 876-5432',
    email: 'reception@pacificfamily.com',
    primaryColor: '#0d9488',
    activeSections: {
      demographics: true,
      emergencyContact: true,
      insurance: true,
      appointment: true,
      consent: true,
    },
    requiredFields: {
      middleName: false,
      preferredName: false,
      addressLine2: false,
      emergencySecondaryPhone: false,
      insuranceGroupNumber: false,
      insuranceCardUpload: false,
      appointmentDate: false,
    },
    customWelcomeMessage: 'Thank you for choosing Pacific Coast Family Practice. Please fill out your intake information below.',
    consentDocumentVersion: 'v2025.4-HIPAA',
    supportedLanguages: [
      { code: 'en', label: 'English' },
      { code: 'es', label: 'Español' },
    ],
  },
  {
    id: 'beacon-ortho',
    name: 'Beacon Orthopedic & Sports Medicine',
    slug: 'beacon-ortho',
    tagline: 'Specialized joint, spine, and athletic rehabilitation',
    phone: '(555) 432-1098',
    email: 'intake@beaconortho.com',
    primaryColor: '#4f46e5',
    activeSections: {
      demographics: true,
      emergencyContact: true,
      insurance: true,
      appointment: true,
      consent: true,
    },
    requiredFields: {
      middleName: false,
      preferredName: false,
      addressLine2: false,
      emergencySecondaryPhone: true,
      insuranceGroupNumber: true,
      insuranceCardUpload: true,
      appointmentDate: true,
    },
    customWelcomeMessage: 'Welcome to Beacon Orthopedics. Prior to your evaluation, please provide your insurance and injury background.',
    consentDocumentVersion: 'v2026.2-ORTHO',
    supportedLanguages: [
      { code: 'en', label: 'English' },
    ],
  },
];

export const INITIAL_REGISTRATIONS: PatientRegistration[] = [
  {
    id: 'PF-2026-9041',
    clinicId: 'metro-health',
    clinicName: 'MetroHealth Medical Center',
    registrationType: 'new_patient',
    status: 'submitted',
    demographics: {
      firstName: 'Eleanor',
      middleName: 'Rose',
      lastName: 'Vance',
      preferredName: 'Ellie',
      dateOfBirth: '1989-06-14',
      phone: '(555) 349-2048',
      email: 'eleanor.vance@example.com',
      addressLine1: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62704',
      preferredContact: 'email',
      preferredLanguage: 'English',
    },
    emergencyContact: {
      fullName: 'Thomas Vance',
      relationship: 'Spouse',
      primaryPhone: '(555) 349-2049',
      authorizedForMedicalDecisions: true,
    },
    insurance: {
      isSelfPay: false,
      providerName: 'Blue Cross Blue Shield of Illinois',
      planName: 'Blue Choice Preferred PPO',
      memberId: 'XOF849204918',
      groupNumber: 'GRP-99420',
      subscriberIsPatient: true,
      hasSecondaryInsurance: false,
      cardFrontUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="180" viewBox="0 0 300 180"%3E%3Crect width="300" height="180" rx="10" fill="%230284c7"/%3E%3Ctext x="20" y="40" fill="white" font-weight="bold" font-family="sans-serif"%3EBLUE CROSS BLUE SHIELD%3C/text%3E%3Ctext x="20" y="80" fill="%23e0f2fe" font-size="12" font-family="sans-serif"%3EMember: Eleanor Vance%3C/text%3E%3Ctext x="20" y="105" fill="%23e0f2fe" font-size="12" font-family="sans-serif"%3EID: XOF849204918%3C/text%3E%3Ctext x="20" y="130" fill="%23e0f2fe" font-size="12" font-family="sans-serif"%3EGroup: GRP-99420%3C/text%3E%3C/svg%3E',
      extractedCardData: {
        payerDetected: 'Blue Cross Blue Shield',
        memberIdDetected: 'XOF849204918',
        groupDetected: 'GRP-99420',
        confidenceScore: 0.98,
        reviewedByPatient: true,
      },
    },
    appointment: {
      visitReason: 'Annual preventative wellness checkup and routine blood pressure screening.',
      department: 'Family Medicine & Primary Care',
      visitType: 'in_person',
      appointmentDate: '2026-10-24',
      hasUrgentSymptoms: false,
    },
    consent: {
      hipaaAcknowledged: true,
      treatmentConsent: true,
      communicationConsent: true,
      optionalMarketingConsent: false,
      signatureDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      signerName: 'Eleanor Vance',
      signedAt: '2026-10-17T14:32:00Z',
      documentVersion: 'v2026.1-HIPAA',
    },
    createdAt: '2026-10-17T14:18:00Z',
    updatedAt: '2026-10-17T14:32:00Z',
    submittedAt: '2026-10-17T14:32:00Z',
    completionTimeSeconds: 260,
    staffNotes: ['New patient packet complete. Card front uploaded and matched.'],
    auditLogs: [
      {
        id: 'log-1',
        timestamp: '2026-10-17T14:18:00Z',
        actor: 'Patient (Eleanor Vance)',
        actorRole: 'patient',
        action: 'REGISTRATION_STARTED',
        details: 'Patient began registration flow via secure portal link',
      },
      {
        id: 'log-2',
        timestamp: '2026-10-17T14:32:00Z',
        actor: 'Patient (Eleanor Vance)',
        actorRole: 'patient',
        action: 'REGISTRATION_SUBMITTED',
        details: 'All required sections completed, signed, and submitted for review',
      },
    ],
  },
  {
    id: 'PF-2026-8812',
    clinicId: 'metro-health',
    clinicName: 'MetroHealth Medical Center',
    registrationType: 'existing_update',
    status: 'needs_correction',
    demographics: {
      firstName: 'Marcus',
      lastName: 'Chen',
      dateOfBirth: '1975-11-23',
      phone: '(555) 812-4910',
      email: 'm.chen75@example.com',
      addressLine1: '1204 Pine Street',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701',
      preferredContact: 'sms',
      preferredLanguage: 'English',
    },
    emergencyContact: {
      fullName: 'David Chen',
      relationship: 'Brother',
      primaryPhone: '(555) 812-4911',
      authorizedForMedicalDecisions: true,
    },
    insurance: {
      isSelfPay: false,
      providerName: 'UnitedHealthcare',
      planName: 'Choice Plus',
      memberId: '902184', // Incomplete ID
      subscriberIsPatient: false,
      subscriberName: 'Linda Chen',
      subscriberDob: '1977-03-12',
      subscriberRelationship: 'Spouse',
      hasSecondaryInsurance: false,
    },
    appointment: {
      visitReason: 'Follow-up for chronic knee discomfort and prescription renewal.',
      department: 'Orthopedics',
      visitType: 'in_person',
      appointmentDate: '2026-10-21',
      hasUrgentSymptoms: false,
    },
    consent: {
      hipaaAcknowledged: true,
      treatmentConsent: true,
      communicationConsent: true,
      optionalMarketingConsent: false,
      signatureDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      signerName: 'Marcus Chen',
      signedAt: '2026-10-16T11:15:00Z',
      documentVersion: 'v2026.1-HIPAA',
    },
    createdAt: '2026-10-16T11:00:00Z',
    updatedAt: '2026-10-16T16:00:00Z',
    submittedAt: '2026-10-16T11:15:00Z',
    completionTimeSeconds: 320,
    correctionRequest: {
      requestedAt: '2026-10-16T15:45:00Z',
      requestedBy: 'Sarah Jenkins (Front Desk Lead)',
      fields: ['insurance.memberId', 'insurance.cardFrontUrl'],
      notes: 'The insurance Member ID entered appears incomplete (only 6 digits, UnitedHealthcare usually requires 9-11 digits). Please also upload a clear photo of your insurance card front to help us verify eligibility.',
      resolved: false,
    },
    staffNotes: ['Flagged Member ID for correction by patient.'],
    auditLogs: [
      {
        id: 'log-10',
        timestamp: '2026-10-16T11:15:00Z',
        actor: 'Patient (Marcus Chen)',
        actorRole: 'patient',
        action: 'REGISTRATION_SUBMITTED',
        details: 'Registration submitted',
      },
      {
        id: 'log-11',
        timestamp: '2026-10-16T15:45:00Z',
        actor: 'Sarah Jenkins (Front Desk)',
        actorRole: 'staff',
        action: 'CORRECTION_REQUESTED',
        details: 'Requested patient correction on: insurance.memberId, insurance.cardFrontUrl',
      },
    ],
  },
  {
    id: 'PF-2026-7734',
    clinicId: 'metro-health',
    clinicName: 'MetroHealth Medical Center',
    registrationType: 'appointment_linked',
    status: 'complete',
    demographics: {
      firstName: 'Sofia',
      lastName: 'Rodriguez',
      dateOfBirth: '1995-04-03',
      phone: '(555) 670-3490',
      email: 'sofia.rodriguez@example.com',
      addressLine1: '450 Alameda Blvd Apt 3B',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62702',
      preferredContact: 'phone',
      preferredLanguage: 'Spanish',
    },
    emergencyContact: {
      fullName: 'Maria Rodriguez',
      relationship: 'Mother',
      primaryPhone: '(555) 670-3491',
    },
    insurance: {
      isSelfPay: true,
      providerName: 'Self-Pay / Uninsured',
      memberId: 'N/A',
      subscriberIsPatient: true,
      hasSecondaryInsurance: false,
    },
    appointment: {
      visitReason: 'Consultation for recurring migraines and light sensitivity.',
      department: 'Neurology',
      visitType: 'telehealth',
      appointmentDate: '2026-10-19',
      hasUrgentSymptoms: false,
    },
    consent: {
      hipaaAcknowledged: true,
      treatmentConsent: true,
      communicationConsent: true,
      optionalMarketingConsent: false,
      signatureDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      signerName: 'Sofia Rodriguez',
      signedAt: '2026-10-15T09:20:00Z',
      documentVersion: 'v2026.1-HIPAA',
    },
    createdAt: '2026-10-15T09:10:00Z',
    updatedAt: '2026-10-15T11:00:00Z',
    submittedAt: '2026-10-15T09:20:00Z',
    completedAt: '2026-10-15T11:00:00Z',
    completionTimeSeconds: 210,
    staffNotes: ['Verified self-pay fee schedule explained to patient. Intake cleared for neurology appointment.'],
    auditLogs: [
      {
        id: 'log-20',
        timestamp: '2026-10-15T09:20:00Z',
        actor: 'Patient (Sofia Rodriguez)',
        actorRole: 'patient',
        action: 'REGISTRATION_SUBMITTED',
        details: 'Submitted with self-pay selection',
      },
      {
        id: 'log-21',
        timestamp: '2026-10-15T11:00:00Z',
        actor: 'Dr. Michael Hayes (Clinic Admin)',
        actorRole: 'clinic_admin',
        action: 'REGISTRATION_APPROVED',
        details: 'Reviewed and finalized registration intake status to COMPLETE',
      },
    ],
  },
  {
    id: 'PF-2026-6502',
    clinicId: 'pacific-coast',
    clinicName: 'Pacific Coast Family Practice',
    registrationType: 'new_patient',
    status: 'under_review',
    demographics: {
      firstName: 'James',
      lastName: 'Wilson',
      dateOfBirth: '1962-08-30',
      phone: '(555) 777-1234',
      email: 'j.wilson@example.com',
      addressLine1: '89 Mission Bay Blvd',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94158',
      preferredContact: 'email',
      preferredLanguage: 'English',
    },
    emergencyContact: {
      fullName: 'Patricia Wilson',
      relationship: 'Spouse',
      primaryPhone: '(555) 777-1235',
    },
    insurance: {
      isSelfPay: false,
      providerName: 'Kaiser Permanente Northern California',
      memberId: 'KP-99401823',
      subscriberIsPatient: true,
      hasSecondaryInsurance: false,
    },
    appointment: {
      visitReason: 'Establish care for adult hypertension and diabetes management.',
      department: 'Internal Medicine',
      visitType: 'in_person',
      appointmentDate: '2026-10-25',
      hasUrgentSymptoms: false,
    },
    consent: {
      hipaaAcknowledged: true,
      treatmentConsent: true,
      communicationConsent: true,
      optionalMarketingConsent: false,
      signatureDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      signerName: 'James Wilson',
      signedAt: '2026-10-17T16:00:00Z',
      documentVersion: 'v2025.4-HIPAA',
    },
    createdAt: '2026-10-17T15:45:00Z',
    updatedAt: '2026-10-17T16:15:00Z',
    submittedAt: '2026-10-17T16:00:00Z',
    completionTimeSeconds: 290,
    staffNotes: ['Under review by Nurse Triage.'],
    auditLogs: [
      {
        id: 'log-30',
        timestamp: '2026-10-17T16:00:00Z',
        actor: 'Patient (James Wilson)',
        actorRole: 'patient',
        action: 'REGISTRATION_SUBMITTED',
        details: 'Submitted intake',
      },
    ],
  },
];

const CLINICS_STORAGE_KEY = 'patientflow_clinics_v1';
const REGISTRATIONS_STORAGE_KEY = 'patientflow_registrations_v1';
const CURRENT_CLINIC_KEY = 'patientflow_current_clinic_id';
const ACTIVE_ROLE_KEY = 'patientflow_active_role';
const SAVED_SESSIONS_KEY = 'patientflow_saved_sessions_v1';

export class StorageService {
  // Clinics
  static getClinics(): ClinicConfig[] {
    const raw = localStorage.getItem(CLINICS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CLINICS_STORAGE_KEY, JSON.stringify(INITIAL_CLINICS));
      return INITIAL_CLINICS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_CLINICS;
    }
  }

  static getClinic(clinicId: string): ClinicConfig {
    const clinics = this.getClinics();
    return clinics.find(c => c.id === clinicId) || clinics[0];
  }

  static updateClinic(clinic: ClinicConfig): void {
    const clinics = this.getClinics();
    const idx = clinics.findIndex(c => c.id === clinic.id);
    if (idx !== -1) {
      clinics[idx] = clinic;
    } else {
      clinics.push(clinic);
    }
    localStorage.setItem(CLINICS_STORAGE_KEY, JSON.stringify(clinics));
  }

  static getCurrentClinicId(): string {
    return localStorage.getItem(CURRENT_CLINIC_KEY) || 'metro-health';
  }

  static setCurrentClinicId(id: string): void {
    localStorage.setItem(CURRENT_CLINIC_KEY, id);
  }

  // Active Role
  static getActiveRole(): UserRole {
    const role = localStorage.getItem(ACTIVE_ROLE_KEY) as UserRole;
    return role || 'patient';
  }

  static setActiveRole(role: UserRole): void {
    localStorage.setItem(ACTIVE_ROLE_KEY, role);
  }

  // Registrations with Tenant Isolation
  static getRegistrations(clinicId?: string): PatientRegistration[] {
    const raw = localStorage.getItem(REGISTRATIONS_STORAGE_KEY);
    let list: PatientRegistration[] = [];
    if (!raw) {
      list = INITIAL_REGISTRATIONS;
      localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(list));
    } else {
      try {
        list = JSON.parse(raw);
      } catch {
        list = INITIAL_REGISTRATIONS;
      }
    }

    if (clinicId) {
      return list.filter(r => r.clinicId === clinicId);
    }
    return list;
  }

  static getRegistrationById(id: string, clinicId?: string): PatientRegistration | null {
    const list = this.getRegistrations();
    const reg = list.find(r => r.id === id);
    if (!reg) return null;

    // Strict Tenant Isolation: if clinicId provided, must match unless platform_admin
    if (clinicId && reg.clinicId !== clinicId) {
      return null;
    }
    return reg;
  }

  static saveRegistration(registration: PatientRegistration, actor: string = 'System', actorRole: UserRole = 'patient'): void {
    const list = this.getRegistrations();
    const now = new Date().toISOString();
    registration.updatedAt = now;

    // Add audit log
    const auditEntry: AuditLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: now,
      actor,
      actorRole,
      action: registration.status === 'submitted' ? 'SUBMITTED' : 'UPDATED',
      details: `Record updated to status [${registration.status}] by ${actor}`,
    };

    registration.auditLogs = [...(registration.auditLogs || []), auditEntry];

    const idx = list.findIndex(r => r.id === registration.id);
    if (idx !== -1) {
      list[idx] = registration;
    } else {
      list.unshift(registration);
    }

    localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(list));
  }

  static updateRegistrationStatus(
    id: string,
    status: PatientRegistration['status'],
    actor: string,
    actorRole: UserRole,
    staffNote?: string
  ): boolean {
    const list = this.getRegistrations();
    const idx = list.findIndex(r => r.id === id);
    if (idx === -1) return false;

    const reg = list[idx];
    const oldStatus = reg.status;
    reg.status = status;
    reg.updatedAt = new Date().toISOString();

    if (status === 'complete') {
      reg.completedAt = new Date().toISOString();
    }

    if (staffNote) {
      reg.staffNotes = [...(reg.staffNotes || []), `[${new Date().toLocaleDateString()}] ${staffNote}`];
    }

    reg.auditLogs.push({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor,
      actorRole,
      action: `STATUS_CHANGE_${status.toUpperCase()}`,
      details: `Status changed from ${oldStatus} to ${status}. Note: ${staffNote || 'None'}`,
    });

    list[idx] = reg;
    localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(list));
    return true;
  }

  static requestCorrection(
    id: string,
    fields: string[],
    notes: string,
    staffName: string
  ): boolean {
    const list = this.getRegistrations();
    const idx = list.findIndex(r => r.id === id);
    if (idx === -1) return false;

    const reg = list[idx];
    reg.status = 'needs_correction';
    reg.updatedAt = new Date().toISOString();
    reg.correctionRequest = {
      requestedAt: new Date().toISOString(),
      requestedBy: staffName,
      fields,
      notes,
      resolved: false,
    };

    reg.auditLogs.push({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: staffName,
      actorRole: 'staff',
      action: 'CORRECTION_REQUESTED',
      details: `Requested updates on: ${fields.join(', ')}. Staff note: ${notes}`,
    });

    list[idx] = reg;
    localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(list));
    return true;
  }

  // Save & Resume token handling
  static saveDraftSession(code: string, draftData: Partial<PatientRegistration>): void {
    const raw = localStorage.getItem(SAVED_SESSIONS_KEY) || '{}';
    let sessions: Record<string, { data: Partial<PatientRegistration>; expiresAt: number }> = {};
    try {
      sessions = JSON.parse(raw);
    } catch {
      sessions = {};
    }

    // Expire after 7 days
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
    sessions[code.trim().toUpperCase()] = { data: draftData, expiresAt };
    localStorage.setItem(SAVED_SESSIONS_KEY, JSON.stringify(sessions));
  }

  static resumeDraftSession(code: string): Partial<PatientRegistration> | null {
    const raw = localStorage.getItem(SAVED_SESSIONS_KEY) || '{}';
    try {
      const sessions = JSON.parse(raw);
      const session = sessions[code.trim().toUpperCase()];
      if (!session) return null;
      if (Date.now() > session.expiresAt) {
        // Expired
        return null;
      }
      return session.data;
    } catch {
      return null;
    }
  }

  static resetToDefault(): void {
    localStorage.setItem(CLINICS_STORAGE_KEY, JSON.stringify(INITIAL_CLINICS));
    localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(INITIAL_REGISTRATIONS));
  }
}
