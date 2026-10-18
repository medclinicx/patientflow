import React from 'react';
import { UserRole, ClinicConfig } from '../../types';
import { 
  Building2, 
  Users, 
  Volume2, 
  VolumeX, 
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  currentClinic: ClinicConfig;
  clinics: ClinicConfig[];
  onClinicChange: (clinicId: string) => void;
  voiceMuted: boolean;
  onToggleVoiceMute: () => void;
  onNavigateHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  currentClinic,
  clinics,
  onClinicChange,
  voiceMuted,
  onToggleVoiceMute,
  onNavigateHome,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-subtle">
      {/* Top Utility Bar with Healthcare Provider Tenant Selector and Role Switcher */}
      <div className="bg-slate-900 text-slate-300 text-xs border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-1.5 sm:gap-2">
          {/* Healthcare Provider Tenant Selector */}
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <Building2 className="w-3.5 h-3.5 text-[#0066FF] shrink-0" />
            <span className="text-slate-400 hidden sm:inline text-[11px]">Active Clinic Tenant:</span>
            <div className="relative inline-block">
              <select
                value={currentClinic.id}
                onChange={(e) => onClinicChange(e.target.value)}
                className="bg-slate-800 text-white font-medium rounded px-2 py-0.5 pr-5 text-[11px] sm:text-xs border border-slate-700 hover:border-slate-600 focus:outline-none focus:ring-1 focus:ring-[#0066FF] cursor-pointer appearance-none max-w-[130px] sm:max-w-none truncate"
                aria-label="Select Clinic Provider"
              >
                {clinics.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1.5 pointer-events-none" />
            </div>
          </div>

          {/* Role Switcher */}
          <div className="flex items-center gap-1 shrink-0 ml-auto sm:ml-0">
            <Users className="w-3.5 h-3.5 text-[#0066FF] hidden md:inline" />
            <span className="text-slate-400 hidden md:inline text-[11px]">Role:</span>
            <div className="bg-slate-800 p-0.5 rounded flex border border-slate-700 overflow-x-auto no-scrollbar">
              {(['patient', 'staff', 'clinic_admin', 'platform_admin'] as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => onRoleChange(role)}
                  className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-medium transition whitespace-nowrap ${
                    currentRole === role
                      ? 'bg-[#0066FF] text-white shadow-sm font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {role === 'patient' && 'Patient'}
                  {role === 'staff' && 'Front Desk'}
                  {role === 'clinic_admin' && 'Admin'}
                  {role === 'platform_admin' && 'Platform'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Brand Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5 flex items-center justify-between gap-2">
        {/* Brand Logo & Product Identity - No icon, typography matching MedClinicX */}
        <div 
          onClick={onNavigateHome}
          className="cursor-pointer group flex flex-col"
          role="button"
          tabIndex={0}
          aria-label="PatientFlow Home"
        >
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="font-heading font-black text-xl sm:text-2xl tracking-tight select-none leading-none">
              <span className="text-[#0066FF]">Patient</span>
              <span className="text-[#0a192f]">Flow</span>
            </span>
            <span className="bg-[#EBF8FE] text-[#0066FF] text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full border border-blue-200">
              Healthcare Intake
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium hidden sm:block mt-0.5">
            {currentClinic.name} • {currentClinic.tagline}
          </p>
        </div>

        {/* Right Action: Voice Assistant Indicator & Clinic Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onToggleVoiceMute}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold border transition shrink-0 ${
              voiceMuted
                ? 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200'
                : 'bg-[#EBF8FE] text-[#0066FF] border-blue-200 hover:bg-blue-100 shadow-sm'
            }`}
            title={voiceMuted ? 'Voice Guidance Muted - Click to Enable' : 'Voice Guidance Active - Click to Mute'}
          >
            {voiceMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[11px] sm:text-xs">Voice Off</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#0066FF] animate-pulse" />
                <span className="text-[11px] sm:text-xs">Voice Guide</span>
              </>
            )}
          </button>

          {currentRole !== 'patient' && (
            <div className="hidden md:flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md text-xs font-medium text-slate-700 border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-[#0066FF]"></span>
              <span>Staff Portal Active</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
