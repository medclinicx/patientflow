import React from 'react';
import { EmergencyContact, ClinicConfig } from '../../types';
import { formatPhoneNumber, validatePhone } from '../../services/formValidation';
import { PhoneCall, ShieldAlert, HelpCircle, UserCheck } from 'lucide-react';

interface Step3EmergencyContactProps {
  data: EmergencyContact;
  onChange: (updated: Partial<EmergencyContact>) => void;
  clinic: ClinicConfig;
  language: 'en' | 'es';
  onFieldFocus: (fieldId: string) => void;
  onAskHelp: (fieldId: string) => void;
  showErrors?: boolean;
}

const RELATIONSHIPS = [
  'Spouse',
  'Partner',
  'Parent',
  'Child (Adult)',
  'Sibling',
  'Legal Guardian',
  'Caregiver',
  'Friend',
  'Other',
];

export const Step3EmergencyContact: React.FC<Step3EmergencyContactProps> = ({
  data,
  onChange,
  clinic,
  language,
  onFieldFocus,
  onAskHelp,
  showErrors = false,
}) => {
  const isEs = language === 'es';
  const isPrimaryPhoneValid = data.primaryPhone ? validatePhone(data.primaryPhone) : true;

  const isNameMissing = showErrors && !data.fullName.trim();
  const isRelationshipMissing = showErrors && !data.relationship.trim();
  const isPrimaryPhoneMissing = showErrors && (!data.primaryPhone.trim() || !isPrimaryPhoneValid);
  const isSecondaryPhoneMissing = showErrors && !!clinic.requiredFields.emergencySecondaryPhone && (!data.secondaryPhone || !data.secondaryPhone.trim());

  const handlePhoneChange = (val: string, field: 'primaryPhone' | 'secondaryPhone') => {
    onChange({ [field]: formatPhoneNumber(val) });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-brand-600" />
            <span>{isEs ? 'Contacto de Emergencia' : 'Emergency Contact Information'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isEs 
              ? 'Persona a quien contactar de inmediato en caso de una urgencia médica durante su visita.'
              : 'Individual authorized to be contacted immediately if you experience an acute health emergency.'}
          </p>
        </div>
        <span className="text-xs font-semibold bg-brand-50 text-brand-700 px-3 py-1 rounded-full border border-brand-200">
          Step 3 of 7
        </span>
      </div>

      {/* Legal boundary explainer alert */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold">
            {isEs ? 'Aviso Legal de Contacto de Emergencia:' : 'Healthcare Representative Disclosure:'}
          </p>
          <p className="text-[11.5px] text-amber-800 leading-relaxed">
            {isEs 
              ? 'Nombrar un contacto de emergencia no otorga a esta persona autorización legal para tomar decisiones médicas o acceder a su historial confidencial, a menos que se presente un Poder Notarial Médico formal (MPOA).'
              : 'Providing an emergency contact allows the clinic to reach this individual in urgent medical situations. This does not automatically grant this person legal power of attorney or access to your confidential medical records without a signed Release of Information.'}
          </p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Contact Full Name */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label htmlFor="emergencyName" className="text-xs font-semibold text-slate-700">
              {isEs ? 'Nombre Completo del Contacto' : 'Emergency Contact Full Name'} <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => onAskHelp('emergencyName')}
              className="text-slate-400 hover:text-brand-600"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>
          <input
            id="emergencyName"
            type="text"
            required
            value={data.fullName}
            onFocus={() => onFieldFocus('emergencyName')}
            onChange={(e) => onChange({ fullName: e.target.value })}
            placeholder="e.g. Thomas Vance"
            className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 ${
              isNameMissing
                ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20'
                : 'border-slate-300 focus:ring-brand-500'
            }`}
          />
          {isNameMissing && (
            <p className="text-[11px] text-red-600 font-medium">Emergency contact name is required</p>
          )}
        </div>

        {/* Relationship */}
        <div className="space-y-1">
          <label htmlFor="emergencyRelationship" className="text-xs font-semibold text-slate-700">
            {isEs ? 'Relación con el Paciente' : 'Relationship to Patient'} <span className="text-red-500">*</span>
          </label>
          <select
            id="emergencyRelationship"
            value={data.relationship}
            onFocus={() => onFieldFocus('emergencyRelationship')}
            onChange={(e) => onChange({ relationship: e.target.value })}
            className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 ${
              isRelationshipMissing
                ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20'
                : 'border-slate-300 focus:ring-brand-500'
            }`}
          >
            <option value="">Select Relationship</option>
            {RELATIONSHIPS.map((rel) => (
              <option key={rel} value={rel}>{rel}</option>
            ))}
          </select>
          {isRelationshipMissing && (
            <p className="text-[11px] text-red-600 font-medium">Relationship is required</p>
          )}
        </div>

        {/* Primary Phone */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label htmlFor="emergencyPhone" className="text-xs font-semibold text-slate-700">
              {isEs ? 'Teléfono Principal' : 'Primary Emergency Phone'} <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => onAskHelp('emergencyPhone')}
              className="text-slate-400 hover:text-brand-600"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>
          <input
            id="emergencyPhone"
            type="tel"
            required
            value={data.primaryPhone}
            onFocus={() => onFieldFocus('emergencyPhone')}
            onChange={(e) => handlePhoneChange(e.target.value, 'primaryPhone')}
            placeholder="(555) 000-0000"
            className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 ${
              isPrimaryPhoneMissing
                ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20'
                : data.primaryPhone && !isPrimaryPhoneValid
                ? 'border-amber-400 focus:ring-amber-500'
                : 'border-slate-300 focus:ring-brand-500'
            }`}
          />
          {isPrimaryPhoneMissing && (
            <p className="text-[11px] text-red-600 font-medium">Valid 10-digit emergency phone number is required</p>
          )}
          {!isPrimaryPhoneMissing && data.primaryPhone && !isPrimaryPhoneValid && (
            <p className="text-[11px] text-amber-600">Enter a 10-digit telephone number</p>
          )}
        </div>

        {/* Secondary Phone */}
        <div className="space-y-1">
          <label htmlFor="emergencySecondaryPhone" className="text-xs font-semibold text-slate-700">
            {isEs ? 'Teléfono Secundario / Trabajo' : 'Secondary or Work Phone'} {clinic.requiredFields.emergencySecondaryPhone && <span className="text-red-500">*</span>}
          </label>
          <input
            id="emergencySecondaryPhone"
            type="tel"
            value={data.secondaryPhone || ''}
            onFocus={() => onFieldFocus('emergencySecondaryPhone')}
            onChange={(e) => handlePhoneChange(e.target.value, 'secondaryPhone')}
            placeholder="(555) 000-0000 (Optional)"
            className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 ${
              isSecondaryPhoneMissing
                ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20'
                : 'border-slate-300 focus:ring-brand-500'
            }`}
          />
          {isSecondaryPhoneMissing && (
            <p className="text-[11px] text-red-600 font-medium">Secondary phone number is required</p>
          )}
        </div>
      </div>

      {/* Decision Authorization Optional Toggle */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3">
        <input
          id="authorizedForMedicalDecisions"
          type="checkbox"
          checked={!!data.authorizedForMedicalDecisions}
          onChange={(e) => onChange({ authorizedForMedicalDecisions: e.target.checked })}
          className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
        />
        <label htmlFor="authorizedForMedicalDecisions" className="text-xs text-slate-700 cursor-pointer space-y-0.5">
          <span className="font-semibold block text-slate-900">
            {isEs ? 'Contacto Autorizado para Informar Estado Clínico' : 'Authorized to Receive Clinical Status Updates'}
          </span>
          <span className="text-slate-500 block text-[11px]">
            {isEs 
              ? 'Autorizo a la clínica a comunicar mi estado de salud o ubicación a este contacto si no puedo responder.'
              : 'I authorize clinic medical staff to share my immediate general condition or room location with this contact if I am incapacitated.'}
          </span>
        </label>
      </div>
    </div>
  );
};
