import React from 'react';
import { AppointmentVisitInfo, ClinicConfig } from '../../types';
import { 
  CalendarDays, 
  Stethoscope, 
  AlertTriangle, 
  Video, 
  Building, 
  HelpCircle,
  Clock
} from 'lucide-react';

interface Step5AppointmentProps {
  data: AppointmentVisitInfo;
  onChange: (updated: Partial<AppointmentVisitInfo>) => void;
  clinic: ClinicConfig;
  language: 'en' | 'es';
  onFieldFocus: (fieldId: string) => void;
  onAskHelp: (fieldId: string) => void;
  showErrors?: boolean;
}

const DEPARTMENTS = [
  'Family Medicine & Primary Care',
  'Internal Medicine',
  'Cardiology & Vascular',
  'Orthopedics & Sports Medicine',
  'Pediatrics',
  'Neurology & Spine',
  'Dermatology',
  'Ear, Nose & Throat (ENT)',
  'Women’s Health & OB/GYN',
  'Dental & Oral Health',
  'Behavioral Health & Counseling',
];

const RED_FLAG_SYMPTOMS = [
  'Sudden severe chest pain or pressure',
  'Difficulty breathing or sudden severe shortness of breath',
  'Sudden numbness or paralysis in face, arm, or leg',
  'Sudden severe headache ("worst headache of life")',
  'Uncontrolled or active heavy bleeding',
];

export const Step5Appointment: React.FC<Step5AppointmentProps> = ({
  data,
  onChange,
  clinic,
  language,
  onFieldFocus,
  onAskHelp,
  showErrors = false,
}) => {
  const isEs = language === 'es';

  const isDepartmentMissing = showErrors && !data.department.trim();
  const isVisitReasonMissing = showErrors && !data.visitReason.trim();
  const isDateMissing = showErrors && !!clinic.requiredFields.appointmentDate && (!data.appointmentDate || !data.appointmentDate.trim());

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-brand-600" />
            <span>{isEs ? 'Información de la Consulta y Motivo de Visita' : 'Appointment & Visit Information'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isEs 
              ? 'Indique el motivo principal de su consulta para asignar el especialista y tiempo adecuado.'
              : 'Tell us why you are seeking care today so your provider can prepare your medical chart.'}
          </p>
        </div>
        <span className="text-xs font-semibold bg-brand-50 text-brand-700 px-3 py-1 rounded-full border border-brand-200">
          Step 5 of 7
        </span>
      </div>

      {/* Emergency Triage Red Flag Warning */}
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 sm:p-5 text-red-950 space-y-3">
        <div className="flex items-center gap-2 font-bold text-sm text-red-900">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{isEs ? 'Evaluación de Seguridad / Urgencia Médica' : 'Safety Check: Urgent Symptom Triage'}</span>
        </div>
        <p className="text-xs text-red-800 leading-relaxed">
          {isEs 
            ? '¿Está experimentando alguno de los siguientes síntomas en este momento?' 
            : 'Are you currently experiencing any of the following emergent symptoms?'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {RED_FLAG_SYMPTOMS.map((symptom, idx) => (
            <div key={idx} className="flex items-center gap-2 text-red-900 bg-white/70 px-3 py-1.5 rounded-lg border border-red-200">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
              <span>{symptom}</span>
            </div>
          ))}
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-red-200 text-xs">
          <label className="flex items-center gap-2 cursor-pointer font-semibold text-red-950">
            <input
              type="checkbox"
              checked={data.hasUrgentSymptoms}
              onChange={(e) => onChange({ hasUrgentSymptoms: e.target.checked })}
              className="h-4 w-4 text-red-600 rounded border-red-300 focus:ring-red-500"
            />
            <span>I am currently experiencing one or more of these urgent symptoms</span>
          </label>
        </div>

        {data.hasUrgentSymptoms && (
          <div className="bg-red-600 text-white p-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-bounce">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>
              DO NOT CONTINUE REGISTRATION. Please immediately call 911 or proceed to the nearest emergency department for acute medical care!
            </span>
          </div>
        )}
      </div>

      {/* Main Visit Form */}
      <div className="space-y-4">
        {/* Department / Specialty */}
        {/* Department / Specialty */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="department" className="text-xs font-semibold text-slate-700">
              {isEs ? 'Departamento / Especialidad' : 'Clinical Department / Specialty'} <span className="text-red-500">*</span>
            </label>
            <select
              id="department"
              value={data.department}
              onFocus={() => onFieldFocus('department')}
              onChange={(e) => onChange({ department: e.target.value })}
              className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 ${
                isDepartmentMissing
                  ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20'
                  : 'border-slate-300 focus:ring-brand-500'
              }`}
            >
              <option value="">Select Department</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {isDepartmentMissing && (
              <p className="text-[11px] text-red-600 font-medium">Please select a clinical department</p>
            )}
          </div>

          {/* Visit Date */}
          <div className="space-y-1">
            <label htmlFor="appointmentDate" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <CalendarDays className="w-3.5 h-3.5 text-brand-600" />
              <span>{isEs ? 'Fecha de Consulta Programada' : 'Appointment / Target Date'}</span> {clinic.requiredFields.appointmentDate && <span className="text-red-500">*</span>}
            </label>
            <input
              id="appointmentDate"
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={data.appointmentDate || ''}
              onFocus={() => onFieldFocus('appointmentDate')}
              onChange={(e) => onChange({ appointmentDate: e.target.value })}
              className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 ${
                isDateMissing
                  ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20'
                  : 'border-slate-300 focus:ring-brand-500'
              }`}
            />
            {isDateMissing && (
              <p className="text-[11px] text-red-600 font-medium">Appointment date is required</p>
            )}
          </div>
        </div>

        {/* Visit Type Buttons */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 block">
            {isEs ? 'Modalidad de Consulta' : 'Visit Setting / Modality'} <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              onClick={() => onChange({ visitType: 'in_person' })}
              className={`p-3.5 rounded-xl border-2 cursor-pointer flex items-center gap-3 transition ${
                data.visitType === 'in_person'
                  ? 'border-brand-600 bg-brand-50/60 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className={`p-2 rounded-lg ${data.visitType === 'in_person' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                <Building className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-xs text-slate-900">In-Person Clinic Visit</p>
                <p className="text-[11px] text-slate-500">Visit our medical office facility</p>
              </div>
            </div>

            <div
              onClick={() => onChange({ visitType: 'telehealth' })}
              className={`p-3.5 rounded-xl border-2 cursor-pointer flex items-center gap-3 transition ${
                data.visitType === 'telehealth'
                  ? 'border-brand-600 bg-brand-50/60 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className={`p-2 rounded-lg ${data.visitType === 'telehealth' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                <Video className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-xs text-slate-900">Telehealth Video Visit</p>
                <p className="text-[11px] text-slate-500">Secure HIPAA video consultation</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reason for Visit / Chief Complaint */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label htmlFor="visitReason" className="text-xs font-semibold text-slate-700">
              {isEs ? 'Motivo de Consulta / Síntomas' : 'Reason for Visit / Primary Concern'} <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400">Brief clinical summary</span>
          </div>
          <textarea
            id="visitReason"
            rows={3}
            required
            value={data.visitReason}
            onFocus={() => onFieldFocus('visitReason')}
            onChange={(e) => onChange({ visitReason: e.target.value })}
            placeholder="e.g. Annual wellness checkup, persistent cough for 1 week, prescription refills, or orthopedic knee evaluation..."
            className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 ${
              isVisitReasonMissing
                ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20'
                : 'border-slate-300 focus:ring-brand-500'
            }`}
          />
          {isVisitReasonMissing && (
            <p className="text-[11px] text-red-600 font-medium">Please provide a reason for your visit</p>
          )}
        </div>
      </div>
    </div>
  );
};
