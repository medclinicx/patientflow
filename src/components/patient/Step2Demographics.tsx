import React from 'react';
import { PatientDemographics, ClinicConfig } from '../../types';
import { 
  formatPhoneNumber, 
  validateEmail, 
  validatePhone, 
  validateZip, 
  validateDateOfBirth 
} from '../../services/formValidation';
import { 
  User, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle,
  Sparkles
} from 'lucide-react';

interface Step2DemographicsProps {
  data: PatientDemographics;
  onChange: (updated: Partial<PatientDemographics>) => void;
  clinic: ClinicConfig;
  language: 'en' | 'es';
  onFieldFocus: (fieldId: string) => void;
  onAskHelp: (fieldId: string) => void;
  showErrors?: boolean;
}

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC'
];

export const Step2Demographics: React.FC<Step2DemographicsProps> = ({
  data,
  onChange,
  clinic,
  language,
  onFieldFocus,
  onAskHelp,
  showErrors = false,
}) => {
  const isEs = language === 'es';

  // Validation checks
  const isEmailValid = data.email ? validateEmail(data.email) : true;
  const isPhoneValid = data.phone ? validatePhone(data.phone) : true;
  const isZipValid = data.zipCode ? validateZip(data.zipCode) : true;
  const dobCheck = data.dateOfBirth ? validateDateOfBirth(data.dateOfBirth) : { valid: true };

  const isFirstNameMissing = showErrors && !data.firstName.trim();
  const isLastNameMissing = showErrors && !data.lastName.trim();
  const isMiddleNameMissing = showErrors && !!clinic.requiredFields.middleName && (!data.middleName || !data.middleName.trim());
  const isDobMissing = showErrors && (!data.dateOfBirth.trim() || !dobCheck.valid);
  const isPhoneMissing = showErrors && (!data.phone.trim() || !isPhoneValid);
  const isEmailMissing = showErrors && (!data.email.trim() || !isEmailValid);
  const isAddressMissing = showErrors && !data.addressLine1.trim();
  const isCityMissing = showErrors && !data.city.trim();
  const isStateMissing = showErrors && !data.state.trim();
  const isZipMissing = showErrors && (!data.zipCode.trim() || !isZipValid);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    onChange({ phone: formatted });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Step Heading */}
      <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-brand-600" />
            <span>{isEs ? 'Información Demográfica del Paciente' : 'Patient Demographics & Contact'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isEs 
              ? 'Por favor ingrese sus datos legales tal como figuran en su identificación oficial.'
              : 'Please enter your legal name and contact details as shown on your government ID or insurance card.'}
          </p>
        </div>
        <span className="text-xs font-semibold bg-brand-50 text-brand-700 px-3 py-1 rounded-full border border-brand-200">
          Step 2 of 7
        </span>
      </div>

      {/* Name Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Legal First Name */}
        <div className="space-y-1 md:col-span-1">
          <div className="flex items-center justify-between">
            <label htmlFor="firstName" className="text-xs font-semibold text-slate-700">
              {isEs ? 'Primer Nombre Legal' : 'Legal First Name'} <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => onAskHelp('firstName')}
              className="text-slate-400 hover:text-brand-600 transition"
              title="Explain field"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>
          <input
            id="firstName"
            type="text"
            required
            value={data.firstName}
            onFocus={() => onFieldFocus('firstName')}
            onChange={(e) => onChange({ firstName: e.target.value })}
            placeholder="e.g. Eleanor"
            className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 transition ${
              isFirstNameMissing
                ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20'
                : 'border-slate-300 focus:ring-brand-500 focus:border-brand-500'
            }`}
          />
          {isFirstNameMissing && (
            <p className="text-[11px] text-red-600 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3 h-3" />
              {isEs ? 'El primer nombre es obligatorio' : 'First name is required'}
            </p>
          )}
        </div>

        {/* Middle Name */}
        <div className="space-y-1 md:col-span-1">
          <label htmlFor="middleName" className="text-xs font-semibold text-slate-700">
            {isEs ? 'Segundo Nombre' : 'Middle Name'} {clinic.requiredFields.middleName && <span className="text-red-500">*</span>}
          </label>
          <input
            id="middleName"
            type="text"
            value={data.middleName || ''}
            onFocus={() => onFieldFocus('middleName')}
            onChange={(e) => onChange({ middleName: e.target.value })}
            placeholder="e.g. Rose (Optional)"
            className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 transition ${
              isMiddleNameMissing
                ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20'
                : 'border-slate-300 focus:ring-brand-500 focus:border-brand-500'
            }`}
          />
          {isMiddleNameMissing && (
            <p className="text-[11px] text-red-600 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3 h-3" />
              {isEs ? 'El segundo nombre es obligatorio' : 'Middle name is required'}
            </p>
          )}
        </div>

        {/* Legal Last Name */}
        <div className="space-y-1 md:col-span-1">
          <div className="flex items-center justify-between">
            <label htmlFor="lastName" className="text-xs font-semibold text-slate-700">
              {isEs ? 'Apellido Legal' : 'Legal Last Name'} <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => onAskHelp('lastName')}
              className="text-slate-400 hover:text-brand-600 transition"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>
          <input
            id="lastName"
            type="text"
            required
            value={data.lastName}
            onFocus={() => onFieldFocus('lastName')}
            onChange={(e) => onChange({ lastName: e.target.value })}
            placeholder="e.g. Vance"
            className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 transition ${
              isLastNameMissing
                ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20'
                : 'border-slate-300 focus:ring-brand-500 focus:border-brand-500'
            }`}
          />
          {isLastNameMissing && (
            <p className="text-[11px] text-red-600 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3 h-3" />
              {isEs ? 'El apellido es obligatorio' : 'Last name is required'}
            </p>
          )}
        </div>

        {/* Preferred Name */}
        <div className="space-y-1 md:col-span-1">
          <label className="text-xs font-semibold text-slate-700">
            {isEs ? 'Nombre de Preferencia' : 'Preferred Name'}
          </label>
          <input
            type="text"
            value={data.preferredName || ''}
            onFocus={() => onFieldFocus('preferredName')}
            onChange={(e) => onChange({ preferredName: e.target.value })}
            placeholder="e.g. Ellie"
            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
          />
        </div>
      </div>

      {/* Date of Birth, Phone, Email Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Date of Birth */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label htmlFor="dateOfBirth" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-brand-600" />
              <span>{isEs ? 'Fecha de Nacimiento' : 'Date of Birth'}</span> <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => onAskHelp('dateOfBirth')}
              className="text-slate-400 hover:text-brand-600 transition"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>
          <input
            id="dateOfBirth"
            type="date"
            required
            max={new Date().toISOString().split('T')[0]}
            value={data.dateOfBirth}
            onFocus={() => onFieldFocus('dateOfBirth')}
            onChange={(e) => onChange({ dateOfBirth: e.target.value })}
            className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 transition ${
              isDobMissing || !dobCheck.valid
                ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20'
                : 'border-slate-300 focus:ring-brand-500'
            }`}
          />
          {(isDobMissing || !dobCheck.valid) && (
            <p className="text-[11px] text-red-600 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3 h-3" />
              {dobCheck.message || (isEs ? 'Fecha de nacimiento obligatoria' : 'Date of birth is required')}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label htmlFor="phone" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-brand-600" />
              <span>{isEs ? 'Teléfono Móvil / Principal' : 'Phone Number'}</span> <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => onAskHelp('phone')}
              className="text-slate-400 hover:text-brand-600 transition"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>
          <input
            id="phone"
            type="tel"
            required
            value={data.phone}
            onFocus={() => onFieldFocus('phone')}
            onChange={handlePhoneChange}
            placeholder="(555) 000-0000"
            className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 transition ${
              isPhoneMissing
                ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20'
                : data.phone && !isPhoneValid
                ? 'border-amber-400 focus:ring-amber-500'
                : 'border-slate-300 focus:ring-brand-500'
            }`}
          />
          {isPhoneMissing && (
            <p className="text-[11px] text-red-600 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3 h-3" />
              {isEs ? 'Teléfono válido de 10 dígitos requerido' : 'Valid 10-digit phone number is required'}
            </p>
          )}
          {!isPhoneMissing && data.phone && !isPhoneValid && (
            <p className="text-[11px] text-amber-600">Please enter a complete 10-digit U.S. phone number</p>
          )}
        </div>

        {/* Email Address */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label htmlFor="email" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-brand-600" />
              <span>{isEs ? 'Correo Electrónico' : 'Email Address'}</span> <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => onAskHelp('email')}
              className="text-slate-400 hover:text-brand-600 transition"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>
          <input
            id="email"
            type="email"
            required
            value={data.email}
            onFocus={() => onFieldFocus('email')}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="patient@example.com"
            className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 transition ${
              isEmailMissing
                ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20'
                : data.email && !isEmailValid
                ? 'border-amber-400 focus:ring-amber-500'
                : 'border-slate-300 focus:ring-brand-500'
            }`}
          />
          {isEmailMissing && (
            <p className="text-[11px] text-red-600 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3 h-3" />
              {isEs ? 'Correo electrónico válido requerido' : 'Valid email address is required'}
            </p>
          )}
          {!isEmailMissing && data.email && !isEmailValid && (
            <p className="text-[11px] text-amber-600">Please enter a valid email format (e.g. user@domain.com)</p>
          )}
        </div>
      </div>

      {/* Address Section */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-brand-600" />
            <span>{isEs ? 'Dirección Residencial' : 'Residential Address'}</span>
          </h3>
          <span className="text-[11px] text-slate-500 font-medium">U.S. Address Required</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1 sm:col-span-2">
            <label htmlFor="addressLine1" className="text-xs font-semibold text-slate-700">
              {isEs ? 'Dirección (Calle y Número)' : 'Street Address Line 1'} <span className="text-red-500">*</span>
            </label>
            <input
              id="addressLine1"
              type="text"
              required
              value={data.addressLine1}
              onFocus={() => onFieldFocus('addressLine1')}
              onChange={(e) => onChange({ addressLine1: e.target.value })}
              placeholder="e.g. 742 Evergreen Terrace"
              className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 ${
                isAddressMissing
                  ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20'
                  : 'border-slate-300 focus:ring-brand-500'
              }`}
            />
            {isAddressMissing && (
              <p className="text-[11px] text-red-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" />
                {isEs ? 'La dirección residencial es obligatoria' : 'Street address is required'}
              </p>
            )}
          </div>

          <div className="space-y-1 sm:col-span-1">
            <label htmlFor="addressLine2" className="text-xs font-semibold text-slate-700">
              {isEs ? 'Apto / Suite / Unidad' : 'Apt / Suite / Unit'}
            </label>
            <input
              id="addressLine2"
              type="text"
              value={data.addressLine2 || ''}
              onFocus={() => onFieldFocus('addressLine2')}
              onChange={(e) => onChange({ addressLine2: e.target.value })}
              placeholder="e.g. Apt 3B (Optional)"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label htmlFor="city" className="text-xs font-semibold text-slate-700">
              {isEs ? 'Ciudad' : 'City'} <span className="text-red-500">*</span>
            </label>
            <input
              id="city"
              type="text"
              required
              value={data.city}
              onFocus={() => onFieldFocus('city')}
              onChange={(e) => onChange({ city: e.target.value })}
              placeholder="e.g. Springfield"
              className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 ${
                isCityMissing
                  ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20'
                  : 'border-slate-300 focus:ring-brand-500'
              }`}
            />
            {isCityMissing && (
              <p className="text-[11px] text-red-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" />
                {isEs ? 'La ciudad es obligatoria' : 'City is required'}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="state" className="text-xs font-semibold text-slate-700">
              {isEs ? 'Estado' : 'State'} <span className="text-red-500">*</span>
            </label>
            <select
              id="state"
              value={data.state}
              onFocus={() => onFieldFocus('state')}
              onChange={(e) => onChange({ state: e.target.value })}
              className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 ${
                isStateMissing
                  ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20'
                  : 'border-slate-300 focus:ring-brand-500'
              }`}
            >
              <option value="">Select State</option>
              {US_STATES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
            {isStateMissing && (
              <p className="text-[11px] text-red-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" />
                {isEs ? 'El estado es obligatorio' : 'State is required'}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="zipCode" className="text-xs font-semibold text-slate-700">
              {isEs ? 'Código Postal' : 'ZIP Code'} <span className="text-red-500">*</span>
            </label>
            <input
              id="zipCode"
              type="text"
              maxLength={10}
              required
              value={data.zipCode}
              onFocus={() => onFieldFocus('zipCode')}
              onChange={(e) => onChange({ zipCode: e.target.value })}
              placeholder="e.g. 62704"
              className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 ${
                isZipMissing
                  ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20'
                  : data.zipCode && !isZipValid
                  ? 'border-amber-400 focus:ring-amber-500'
                  : 'border-slate-300 focus:ring-brand-500'
              }`}
            />
            {isZipMissing && (
              <p className="text-[11px] text-red-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" />
                {isEs ? 'Código postal de 5 dígitos requerido' : 'Valid 5-digit ZIP code is required'}
              </p>
            )}
            {!isZipMissing && data.zipCode && !isZipValid && (
              <p className="text-[11px] text-amber-600">Enter a valid 5-digit ZIP code</p>
            )}
          </div>
        </div>
      </div>

      {/* Preferences Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            {isEs ? 'Método de Comunicación Preferido' : 'Preferred Communication Method'}
          </label>
          <div className="flex gap-2">
            {(['phone', 'email', 'sms'] as const).map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => onChange({ preferredContact: method })}
                className={`flex-1 py-2 text-xs font-medium rounded-xl border transition ${
                  data.preferredContact === method
                    ? 'border-brand-600 bg-brand-50 text-brand-700 font-bold'
                    : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {method.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            {isEs ? 'Idioma Preferido para Consultas' : 'Preferred Language for Care'}
          </label>
          <select
            value={data.preferredLanguage}
            onChange={(e) => onChange({ preferredLanguage: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="English">English</option>
            <option value="Spanish">Español (Spanish)</option>
            <option value="Mandarin">Mandarin (Chinese)</option>
            <option value="Vietnamese">Vietnamese</option>
            <option value="Arabic">Arabic</option>
            <option value="Other">Other / Sign Language</option>
          </select>
        </div>
      </div>
    </div>
  );
};
