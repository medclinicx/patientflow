import React, { useState, useEffect } from 'react';
import { UserRole, ClinicConfig, PatientRegistration } from './types';
import { StorageService } from './services/storageService';
import { VoiceAssistantService } from './services/voiceAssistant';

import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';

import { LandingPage } from './components/landing/LandingPage';
import { MultiStepRegistration } from './components/patient/MultiStepRegistration';
import { RegistrationStatusView } from './components/patient/RegistrationStatusView';
import { StaffDashboard } from './components/staff/StaffDashboard';
import { ClinicFormBuilder } from './components/admin/ClinicFormBuilder';
import { OperationalReports } from './components/admin/OperationalReports';
import { TenantManagement } from './components/admin/TenantManagement';

import { 
  UserPlus, 
  Users, 
  Sliders, 
  BarChart3, 
  Building2, 
  Search
} from 'lucide-react';

export type AppView = 
  | 'landing' 
  | 'register' 
  | 'status' 
  | 'staff' 
  | 'admin_forms' 
  | 'admin_reports' 
  | 'platform_tenants';

export function App() {
  const [clinics, setClinics] = useState<ClinicConfig[]>(() => StorageService.getClinics());
  const [currentClinicId, setCurrentClinicId] = useState<string>(() => StorageService.getCurrentClinicId());
  const [currentRole, setCurrentRole] = useState<UserRole>(() => StorageService.getActiveRole());
  const [currentView, setCurrentView] = useState<AppView>('landing');

  // Accessibility state
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [voiceMuted, setVoiceMuted] = useState(false);

  // Active registration if opened in correction mode
  const [correctionTargetReg, setCorrectionTargetReg] = useState<PatientRegistration | null>(null);

  const activeClinic = clinics.find(c => c.id === currentClinicId) || clinics[0];

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    StorageService.setActiveRole(newRole);

    if (newRole === 'patient') {
      setCurrentView('landing');
    } else if (newRole === 'staff') {
      setCurrentView('staff');
    } else if (newRole === 'clinic_admin') {
      setCurrentView('admin_forms');
    } else if (newRole === 'platform_admin') {
      setCurrentView('platform_tenants');
    }
  };

  const handleClinicChange = (clinicId: string) => {
    setCurrentClinicId(clinicId);
    StorageService.setCurrentClinicId(clinicId);
    setCorrectionTargetReg(null);
  };

  const handleToggleVoiceMute = () => {
    const voice = VoiceAssistantService.getInstance();
    const muted = voice.toggleMute();
    setVoiceMuted(muted);
  };

  const handleOpenPatientCorrection = (reg: PatientRegistration) => {
    setCorrectionTargetReg(reg);
    setCurrentRole('patient');
    setCurrentView('register');
  };

  const handleResetDemoData = () => {
    StorageService.resetToDefault();
    setClinics(StorageService.getClinics());
    alert('Demo records and tenant partitions successfully reset to default state.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Universal Header with tenant selection and role switching */}
      <Header
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        currentClinic={activeClinic}
        clinics={clinics}
        onClinicChange={handleClinicChange}
        voiceMuted={voiceMuted}
        onToggleVoiceMute={handleToggleVoiceMute}
        onNavigateHome={() => {
          setCorrectionTargetReg(null);
          setCurrentView('landing');
        }}
      />

      {/* Sub-Navigation Ribbon according to role / context */}
      <nav aria-label="Module Navigation" className="bg-white border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between overflow-x-auto text-xs font-semibold gap-2 sm:gap-3 no-scrollbar">
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              onClick={() => { setCorrectionTargetReg(null); setCurrentView('landing'); }}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
                currentView === 'landing' ? 'bg-[#0066FF] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Product Overview
            </button>

            <button
              onClick={() => { setCorrectionTargetReg(null); setCurrentView('register'); }}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                currentView === 'register' ? 'bg-[#0066FF] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Patient Intake</span>
            </button>

            <button
              onClick={() => setCurrentView('status')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                currentView === 'status' ? 'bg-[#0066FF] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Check Status</span>
            </button>

            {/* Staff & Admin Direct Access Tabs */}
            <div className="h-4 w-[1px] bg-slate-300 mx-1 hidden sm:block"></div>

            <button
              onClick={() => { setCurrentRole('staff'); setCurrentView('staff'); }}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                currentView === 'staff' ? 'bg-[#0066FF] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Staff Queue</span>
            </button>

            <button
              onClick={() => { setCurrentRole('clinic_admin'); setCurrentView('admin_forms'); }}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                currentView === 'admin_forms' ? 'bg-[#0066FF] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Form Builder</span>
            </button>

            <button
              onClick={() => { setCurrentRole('clinic_admin'); setCurrentView('admin_reports'); }}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                currentView === 'admin_reports' ? 'bg-[#0066FF] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Operational Analytics</span>
            </button>

            <button
              onClick={() => { setCurrentRole('platform_admin'); setCurrentView('platform_tenants'); }}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                currentView === 'platform_tenants' ? 'bg-[#0066FF] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Tenant Admin</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-500 font-normal shrink-0">
            <span>Clinic: <strong>{activeClinic.name}</strong></span>
          </div>
        </div>
      </nav>

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        {currentView === 'landing' && (
          <LandingPage
            clinic={activeClinic}
            onStartRegistration={() => {
              setCorrectionTargetReg(null);
              setCurrentRole('patient');
              setCurrentView('register');
            }}
            onGoToStaffDashboard={() => {
              setCurrentRole('staff');
              setCurrentView('staff');
            }}
            onGoToFormBuilder={() => {
              setCurrentRole('clinic_admin');
              setCurrentView('admin_forms');
            }}
          />
        )}

        {currentView === 'register' && (
          <MultiStepRegistration
            clinic={activeClinic}
            initialRegistration={correctionTargetReg}
            language={language}
            onViewStatus={() => setCurrentView('status')}
            voiceMuted={voiceMuted}
            onToggleVoiceMute={handleToggleVoiceMute}
          />
        )}

        {currentView === 'status' && (
          <RegistrationStatusView
            clinic={activeClinic}
            onOpenCorrection={handleOpenPatientCorrection}
            onNewRegistration={() => {
              setCorrectionTargetReg(null);
              setCurrentView('register');
            }}
          />
        )}

        {currentView === 'staff' && (
          <StaffDashboard
            clinic={activeClinic}
            currentRole={currentRole}
            onOpenPatientCorrectionFlow={handleOpenPatientCorrection}
          />
        )}

        {currentView === 'admin_forms' && (
          <ClinicFormBuilder
            clinic={activeClinic}
            onUpdateClinic={(updated) => {
              const updatedList = clinics.map(c => c.id === updated.id ? updated : c);
              setClinics(updatedList);
            }}
            onPreviewPatientView={() => {
              setCorrectionTargetReg(null);
              setCurrentRole('patient');
              setCurrentView('register');
            }}
          />
        )}

        {currentView === 'admin_reports' && (
          <OperationalReports
            clinic={activeClinic}
            registrations={StorageService.getRegistrations(activeClinic.id)}
          />
        )}

        {currentView === 'platform_tenants' && (
          <TenantManagement
            clinics={clinics}
            currentClinicId={currentClinicId}
            onSelectClinic={handleClinicChange}
            onResetAllData={handleResetDemoData}
          />
        )}
      </main>

      {/* Healthcare Compliance Footer */}
      <Footer />
    </div>
  );
}
export default App;
