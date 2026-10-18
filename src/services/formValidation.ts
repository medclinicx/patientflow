// Form validation and voice explanations

export interface FieldHelp {
  fieldId: string;
  label: string;
  helpEn: string;
  helpEs: string;
  example: string;
}

export const FIELD_EXPLANATIONS: Record<string, FieldHelp> = {
  firstName: {
    fieldId: 'firstName',
    label: 'Legal First Name',
    helpEn: 'Please enter your legal first name exactly as it appears on your government-issued ID or insurance card.',
    helpEs: 'Por favor ingrese su primer nombre legal tal como aparece en su identificación oficial o tarjeta de seguro.',
    example: 'Eleanor',
  },
  lastName: {
    fieldId: 'lastName',
    label: 'Legal Last Name',
    helpEn: 'Please enter your legal last name or family surname.',
    helpEs: 'Por favor ingrese su apellido legal o nombre de familia.',
    example: 'Vance',
  },
  dateOfBirth: {
    fieldId: 'dateOfBirth',
    label: 'Date of Birth',
    helpEn: 'Enter your date of birth. This helps verify your health records securely.',
    helpEs: 'Ingrese su fecha de nacimiento para verificar sus registros médicos.',
    example: 'MM/DD/YYYY',
  },
  phone: {
    fieldId: 'phone',
    label: 'Phone Number',
    helpEn: 'Enter your primary 10-digit mobile or home telephone number for appointment reminders.',
    helpEs: 'Ingrese su número de teléfono principal de 10 dígitos para recordatorios.',
    example: '(555) 349-2048',
  },
  email: {
    fieldId: 'email',
    label: 'Email Address',
    helpEn: 'Your email is used to securely send intake confirmations, telehealth links, and clinic notices.',
    helpEs: 'Su correo electrónico se utiliza para enviarle confirmaciones y avisos de la clínica.',
    example: 'name@example.com',
  },
  addressLine1: {
    fieldId: 'addressLine1',
    label: 'Street Address',
    helpEn: 'Enter your primary residential street address, including building number and street name.',
    helpEs: 'Ingrese su dirección residencial principal, incluyendo número y calle.',
    example: '742 Evergreen Terrace',
  },
  zipCode: {
    fieldId: 'zipCode',
    label: 'ZIP Code',
    helpEn: 'Enter your 5-digit United States postal code.',
    helpEs: 'Ingrese su código postal de 5 dígitos de Estados Unidos.',
    example: '62704',
  },
  emergencyName: {
    fieldId: 'emergencyName',
    label: 'Emergency Contact Name',
    helpEn: 'Provide the full name of someone we can contact in case of an immediate medical emergency.',
    helpEs: 'Proporcione el nombre completo de una persona de contacto en caso de emergencia médica.',
    example: 'Thomas Vance',
  },
  emergencyPhone: {
    fieldId: 'emergencyPhone',
    label: 'Emergency Phone',
    helpEn: 'Enter a direct phone number where your emergency contact can be reached right away.',
    helpEs: 'Ingrese un número de teléfono directo para su contacto de emergencia.',
    example: '(555) 349-2049',
  },
  insuranceProvider: {
    fieldId: 'insuranceProvider',
    label: 'Insurance Provider Name',
    helpEn: 'Enter the company name of your health insurance, such as Blue Cross Blue Shield, Aetna, or UnitedHealthcare.',
    helpEs: 'Ingrese el nombre de su aseguradora médica, por ejemplo Blue Cross o Aetna.',
    example: 'Blue Cross Blue Shield',
  },
  insuranceMemberId: {
    fieldId: 'insuranceMemberId',
    label: 'Member or Subscriber ID',
    helpEn: 'Look on the front of your insurance card for your unique Member ID or Subscriber Number. Include any letter prefixes.',
    helpEs: 'Busque en el frente de su tarjeta de seguro su número de miembro o suscriptor.',
    example: 'XOF849204918',
  },
  signature: {
    fieldId: 'signature',
    label: 'Electronic Signature',
    helpEn: 'Use your mouse, trackpad, or finger on mobile screens to sign inside the signature box.',
    helpEs: 'Utilice su ratón, panel táctil o dedo para firmar dentro del cuadro.',
    example: 'Draw signature with mouse or finger',
  },
};

// Formats phone numbers as (XXX) XXX-XXXX
export function formatPhoneNumber(value: string): string {
  if (!value) return '';
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 3) {
    return digits;
  }
  if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

// Validation rules
export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

export function validatePhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 10;
}

export function validateZip(zip: string): boolean {
  return /^\d{5}(-\d{4})?$/.test(zip.trim());
}

export function validateDateOfBirth(dob: string): { valid: boolean; message?: string } {
  if (!dob) return { valid: false, message: 'Date of birth is required' };
  const date = new Date(dob);
  const now = new Date();
  
  if (isNaN(date.getTime())) {
    return { valid: false, message: 'Invalid calendar date' };
  }
  if (date > now) {
    return { valid: false, message: 'Date of birth cannot be in the future' };
  }
  
  const age = (now.getTime() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
  if (age > 125) {
    return { valid: false, message: 'Please verify the year of birth' };
  }
  
  return { valid: true };
}

export interface StepValidationResult {
  isValid: boolean;
  errorField?: string;
  errorMessage?: string;
}

export function validateStep(
  step: number,
  registration: import('../types').PatientRegistration,
  clinic: import('../types').ClinicConfig,
  language: 'en' | 'es' = 'en'
): StepValidationResult {
  const isEs = language === 'es';

  if (step === 1) {
    if (!registration.registrationType) {
      return {
        isValid: false,
        errorField: 'registrationType',
        errorMessage: isEs ? 'Por favor seleccione un tipo de registro.' : 'Please select a registration type.',
      };
    }
    return { isValid: true };
  }

  if (step === 2) {
    const d = registration.demographics;
    if (!d.firstName || !d.firstName.trim()) {
      return {
        isValid: false,
        errorField: 'firstName',
        errorMessage: isEs ? 'El primer nombre legal es obligatorio.' : 'Legal first name is required.',
      };
    }
    if (clinic.requiredFields.middleName && (!d.middleName || !d.middleName.trim())) {
      return {
        isValid: false,
        errorField: 'middleName',
        errorMessage: isEs ? 'El segundo nombre es obligatorio.' : 'Middle name is required.',
      };
    }
    if (!d.lastName || !d.lastName.trim()) {
      return {
        isValid: false,
        errorField: 'lastName',
        errorMessage: isEs ? 'El apellido legal es obligatorio.' : 'Legal last name is required.',
      };
    }
    if (!d.dateOfBirth || !d.dateOfBirth.trim()) {
      return {
        isValid: false,
        errorField: 'dateOfBirth',
        errorMessage: isEs ? 'La fecha de nacimiento es obligatoria.' : 'Date of birth is required.',
      };
    }
    const dobCheck = validateDateOfBirth(d.dateOfBirth);
    if (!dobCheck.valid) {
      return {
        isValid: false,
        errorField: 'dateOfBirth',
        errorMessage: dobCheck.message || (isEs ? 'Fecha de nacimiento inválida.' : 'Invalid date of birth.'),
      };
    }
    if (!d.phone || !d.phone.trim()) {
      return {
        isValid: false,
        errorField: 'phone',
        errorMessage: isEs ? 'El número de teléfono es obligatorio.' : 'Phone number is required.',
      };
    }
    if (!validatePhone(d.phone)) {
      return {
        isValid: false,
        errorField: 'phone',
        errorMessage: isEs ? 'Por favor ingrese un número de teléfono válido de 10 dígitos.' : 'Please enter a valid 10-digit phone number.',
      };
    }
    if (!d.email || !d.email.trim()) {
      return {
        isValid: false,
        errorField: 'email',
        errorMessage: isEs ? 'El correo electrónico es obligatorio.' : 'Email address is required.',
      };
    }
    if (!validateEmail(d.email)) {
      return {
        isValid: false,
        errorField: 'email',
        errorMessage: isEs ? 'Por favor ingrese un correo electrónico válido.' : 'Please enter a valid email address.',
      };
    }
    if (!d.addressLine1 || !d.addressLine1.trim()) {
      return {
        isValid: false,
        errorField: 'addressLine1',
        errorMessage: isEs ? 'La dirección residencial es obligatoria.' : 'Street address is required.',
      };
    }
    if (!d.city || !d.city.trim()) {
      return {
        isValid: false,
        errorField: 'city',
        errorMessage: isEs ? 'La ciudad es obligatoria.' : 'City is required.',
      };
    }
    if (!d.state || !d.state.trim()) {
      return {
        isValid: false,
        errorField: 'state',
        errorMessage: isEs ? 'El estado es obligatorio.' : 'State is required.',
      };
    }
    if (!d.zipCode || !d.zipCode.trim()) {
      return {
        isValid: false,
        errorField: 'zipCode',
        errorMessage: isEs ? 'El código postal es obligatorio.' : 'ZIP code is required.',
      };
    }
    if (!validateZip(d.zipCode)) {
      return {
        isValid: false,
        errorField: 'zipCode',
        errorMessage: isEs ? 'Por favor ingrese un código postal válido de 5 dígitos.' : 'Please enter a valid 5-digit ZIP code.',
      };
    }
    return { isValid: true };
  }

  if (step === 3) {
    const ec = registration.emergencyContact;
    if (!ec.fullName || !ec.fullName.trim()) {
      return {
        isValid: false,
        errorField: 'emergencyName',
        errorMessage: isEs ? 'El nombre completo del contacto es obligatorio.' : 'Emergency contact name is required.',
      };
    }
    if (!ec.relationship || !ec.relationship.trim()) {
      return {
        isValid: false,
        errorField: 'emergencyRelationship',
        errorMessage: isEs ? 'La relación con el contacto es obligatoria.' : 'Emergency contact relationship is required.',
      };
    }
    if (!ec.primaryPhone || !ec.primaryPhone.trim()) {
      return {
        isValid: false,
        errorField: 'emergencyPhone',
        errorMessage: isEs ? 'El teléfono del contacto de emergencia es obligatorio.' : 'Emergency contact primary phone is required.',
      };
    }
    if (!validatePhone(ec.primaryPhone)) {
      return {
        isValid: false,
        errorField: 'emergencyPhone',
        errorMessage: isEs ? 'Ingrese un número de teléfono de 10 dígitos.' : 'Please enter a valid 10-digit emergency contact phone number.',
      };
    }
    if (clinic.requiredFields.emergencySecondaryPhone && (!ec.secondaryPhone || !ec.secondaryPhone.trim())) {
      return {
        isValid: false,
        errorField: 'emergencySecondaryPhone',
        errorMessage: isEs ? 'El teléfono secundario es obligatorio.' : 'Secondary emergency phone is required.',
      };
    }
    return { isValid: true };
  }

  if (step === 4) {
    const ins = registration.insurance;
    if (!ins.isSelfPay) {
      if (!ins.providerName || !ins.providerName.trim()) {
        return {
          isValid: false,
          errorField: 'insuranceProvider',
          errorMessage: isEs ? 'El nombre de la aseguradora es obligatorio.' : 'Insurance provider name is required.',
        };
      }
      if (!ins.memberId || !ins.memberId.trim()) {
        return {
          isValid: false,
          errorField: 'insuranceMemberId',
          errorMessage: isEs ? 'El número de identificación del miembro es obligatorio.' : 'Insurance Member ID is required.',
        };
      }
      if (clinic.requiredFields.insuranceCardUpload && !ins.cardFrontUrl) {
        return {
          isValid: false,
          errorField: 'cardFrontUrl',
          errorMessage: isEs ? 'Debe cargar una foto frontal de su tarjeta de seguro.' : 'Insurance card front photo is required.',
        };
      }
      if (!ins.subscriberIsPatient) {
        if (!ins.subscriberName || !ins.subscriberName.trim()) {
          return {
            isValid: false,
            errorField: 'subscriberName',
            errorMessage: isEs ? 'El nombre del suscriptor es obligatorio.' : 'Subscriber full legal name is required.',
          };
        }
        if (!ins.subscriberDob || !ins.subscriberDob.trim()) {
          return {
            isValid: false,
            errorField: 'subscriberDob',
            errorMessage: isEs ? 'La fecha de nacimiento del suscriptor es obligatoria.' : 'Subscriber date of birth is required.',
          };
        }
        if (!ins.subscriberRelationship || !ins.subscriberRelationship.trim()) {
          return {
            isValid: false,
            errorField: 'subscriberRelationship',
            errorMessage: isEs ? 'La relación con el suscriptor es obligatoria.' : 'Relationship to subscriber is required.',
          };
        }
      }
    }
    return { isValid: true };
  }

  if (step === 5) {
    const appt = registration.appointment;
    if (appt.hasUrgentSymptoms) {
      return {
        isValid: false,
        errorField: 'hasUrgentSymptoms',
        errorMessage: isEs ? 'Alerta médica: Llame inmediatamente al 911 o acuda a una sala de emergencias.' : 'Emergency triage alert: Please seek immediate emergency medical care or call 911.',
      };
    }
    if (!appt.department || !appt.department.trim()) {
      return {
        isValid: false,
        errorField: 'department',
        errorMessage: isEs ? 'Seleccione un departamento clínico.' : 'Clinical department is required.',
      };
    }
    if (!appt.visitReason || !appt.visitReason.trim()) {
      return {
        isValid: false,
        errorField: 'visitReason',
        errorMessage: isEs ? 'El motivo de su visita es obligatorio.' : 'Reason for visit is required.',
      };
    }
    if (clinic.requiredFields.appointmentDate && (!appt.appointmentDate || !appt.appointmentDate.trim())) {
      return {
        isValid: false,
        errorField: 'appointmentDate',
        errorMessage: isEs ? 'La fecha de consulta es obligatoria.' : 'Appointment date is required.',
      };
    }
    return { isValid: true };
  }

  if (step === 6) {
    const c = registration.consent;
    if (!c.hipaaAcknowledged) {
      return {
        isValid: false,
        errorField: 'hipaaConsent',
        errorMessage: isEs ? 'Debe aceptar las prácticas de privacidad de HIPAA.' : 'HIPAA Notice of Privacy Practices acknowledgment is required.',
      };
    }
    if (!c.treatmentConsent) {
      return {
        isValid: false,
        errorField: 'treatmentConsent',
        errorMessage: isEs ? 'Debe otorgar consentimiento para la atención médica.' : 'General consent for outpatient medical care is required.',
      };
    }
    if (!c.communicationConsent) {
      return {
        isValid: false,
        errorField: 'commConsent',
        errorMessage: isEs ? 'Debe autorizar las comunicaciones de la clínica.' : 'Direct appointment communication authorization is required.',
      };
    }
    if (!c.signerName || !c.signerName.trim()) {
      return {
        isValid: false,
        errorField: 'signerName',
        errorMessage: isEs ? 'El nombre legal del firmante es obligatorio.' : 'Signer full legal name is required.',
      };
    }
    if (!c.signatureDataUrl || !c.signatureDataUrl.trim()) {
      return {
        isValid: false,
        errorField: 'signature',
        errorMessage: isEs ? 'Debe dibujar su firma electrónica antes de continuar.' : 'Electronic signature is required.',
      };
    }
    return { isValid: true };
  }

  return { isValid: true };
}

