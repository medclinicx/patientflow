import React from 'react';
import { ClinicConfig, RegistrationType } from '../../types';
import { 
  UserPlus, 
  RefreshCw, 
  CalendarCheck, 
  Clock, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface Step1WelcomeProps {
  clinic: ClinicConfig;
  registrationType: RegistrationType;
  onSelectRegistrationType: (type: RegistrationType) => void;
  onNext: () => void;
  voiceMuted: boolean;
  onToggleVoiceMute: () => void;
  language: 'en' | 'es';
  appointmentRefInput: string;
  onAppointmentRefChange: (val: string) => void;
}

export const Step1Welcome: React.FC<Step1WelcomeProps> = ({
  clinic,
  registrationType,
  onSelectRegistrationType,
  onNext,
  voiceMuted,
  onToggleVoiceMute,
  language,
  appointmentRefInput,
  onAppointmentRefChange,
}) => {
  const isEs = language === 'es';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Clinic Header Banner */}
      <div className="bg-[#0066FF] rounded-3xl p-6 sm:p-8 text-white shadow-card relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 transform skew-x-12 pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white">
            <Sparkles className="w-3.5 h-3.5 text-blue-200" />
            <span>{clinic.name} • Official Digital Intake</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {isEs 
              ? 'Bienvenido a su Registro Médico Digital' 
              : 'Welcome to Your Digital Patient Registration'}
          </h1>

          <p className="text-sm sm:text-base text-blue-50 leading-relaxed">
            {clinic.customWelcomeMessage || (isEs 
              ? 'Complete su información antes de su visita para agilizar su ingreso y minimizar el tiempo en la sala de espera.' 
              : 'Complete your intake in advance to minimize waiting room time and ensure your clinical records are accurate.')}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-blue-100">
            <span className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-lg">
              <Clock className="w-4 h-4 text-blue-200" />
              {isEs ? 'Tiempo estimado: 4-6 minutos' : 'Estimated time: 4-6 minutes'}
            </span>
            <span className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-blue-200" />
              {isEs ? 'Protegido por HIPAA' : 'HIPAA Protected & Encrypted'}
            </span>
          </div>
        </div>
      </div>

      {/* Select Registration Type */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {isEs ? '1. Seleccione el Tipo de Registro' : '1. Select Your Registration Purpose'}
          </h2>
          <p className="text-xs text-slate-500">
            {isEs ? 'Elija la opción que mejor describa su visita de hoy' : 'Choose the intake path that applies to you'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Option A: New Patient */}
          <div
            onClick={() => onSelectRegistrationType('new_patient')}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
              registrationType === 'new_patient'
                ? 'border-brand-600 bg-brand-50/50 shadow-md ring-2 ring-brand-600/20'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
            role="button"
            tabIndex={0}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 rounded-xl ${
                registrationType === 'new_patient' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                <UserPlus className="w-5 h-5" />
              </div>
              {registrationType === 'new_patient' && (
                <CheckCircle2 className="w-5 h-5 text-brand-600" />
              )}
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">
              {isEs ? 'Nuevo Paciente' : 'New Patient Registration'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isEs 
                ? 'Primera vez en nuestra clínica. Crearemos su nuevo expediente médico.' 
                : 'First visit to our clinic. Create a comprehensive new patient medical record.'}
            </p>
          </div>

          {/* Option B: Existing Patient Update */}
          <div
            onClick={() => onSelectRegistrationType('existing_update')}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
              registrationType === 'existing_update'
                ? 'border-brand-600 bg-brand-50/50 shadow-md ring-2 ring-brand-600/20'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
            role="button"
            tabIndex={0}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 rounded-xl ${
                registrationType === 'existing_update' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                <RefreshCw className="w-5 h-5" />
              </div>
              {registrationType === 'existing_update' && (
                <CheckCircle2 className="w-5 h-5 text-brand-600" />
              )}
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">
              {isEs ? 'Actualizar Información' : 'Existing Patient Update'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isEs 
                ? 'Ya es paciente. Actualice su seguro, dirección de domicilio o teléfono.' 
                : 'Returning patient updating insurance, new address, or contact details.'}
            </p>
          </div>

          {/* Option C: Appointment Check-In */}
          <div
            onClick={() => onSelectRegistrationType('appointment_linked')}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
              registrationType === 'appointment_linked'
                ? 'border-brand-600 bg-brand-50/50 shadow-md ring-2 ring-brand-600/20'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
            role="button"
            tabIndex={0}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 rounded-xl ${
                registrationType === 'appointment_linked' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                <CalendarCheck className="w-5 h-5" />
              </div>
              {registrationType === 'appointment_linked' && (
                <CheckCircle2 className="w-5 h-5 text-brand-600" />
              )}
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">
              {isEs ? 'Cita Programada' : 'Scheduled Appointment'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isEs 
                ? 'Check-in rápido vinculado a su cita programada por el personal.' 
                : 'Express check-in linked directly to an existing appointment reference.'}
            </p>
          </div>
        </div>

        {/* If appointment linked, show reference code input */}
        {registrationType === 'appointment_linked' && (
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-xs space-y-2">
            <label className="block font-semibold text-slate-800">
              {isEs ? 'Código de Referencia de Cita (opcional)' : 'Appointment Confirmation or Reference # (Optional)'}
            </label>
            <input
              type="text"
              placeholder="e.g. APPT-89421"
              value={appointmentRefInput}
              onChange={(e) => onAppointmentRefChange(e.target.value)}
              className="w-full sm:w-72 bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <p className="text-[11px] text-slate-500">
              {isEs ? 'Si recibió un SMS de recordatorio, puede ingresar el código aquí.' : 'Check your SMS or confirmation email if provided by the clinic.'}
            </p>
          </div>
        )}
      </div>

      {/* Voice Assistant Opt-In Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${voiceMuted ? 'bg-slate-100 text-slate-500' : 'bg-brand-100 text-brand-600'}`}>
            {voiceMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6 animate-pulse" />}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">
              {isEs ? 'Asistente de Voz Inteligente' : 'Intelligent Voice Assistance'}
            </h4>
            <p className="text-xs text-slate-500 max-w-md">
              {isEs 
                ? 'El asistente de voz lee las instrucciones en voz alta, explica los campos requeridos y le guía paso a paso. Puede silenciarlo en cualquier momento.'
                : 'PatientFlow AI can read instructions aloud, guide you to missing fields, and explain questions. You can toggle audio on or off anytime.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleVoiceMute}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 shrink-0 ${
            voiceMuted 
              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
              : 'bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100'
          }`}
        >
          {voiceMuted ? (
            <>
              <Volume2 className="w-4 h-4 text-brand-600" />
              <span>{isEs ? 'Activar Voz' : 'Enable Voice'}</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>{isEs ? 'Voz Activada (Silenciar)' : 'Voice Enabled (Mute)'}</span>
            </>
          )}
        </button>
      </div>

      {/* Start Button */}
      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group text-sm"
        >
          <span>{isEs ? 'Comenzar Registro' : 'Begin Registration'}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
