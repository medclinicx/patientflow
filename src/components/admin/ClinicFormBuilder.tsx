import React, { useState } from 'react';
import { ClinicConfig } from '../../types';
import { StorageService } from '../../services/storageService';
import { 
  Sliders, 
  Settings, 
  Check, 
  Save, 
  Eye, 
  ShieldCheck, 
  FileText, 
  Sparkles, 
  Building2,
  Palette,
  AlertCircle
} from 'lucide-react';

interface ClinicFormBuilderProps {
  clinic: ClinicConfig;
  onUpdateClinic: (updated: ClinicConfig) => void;
  onPreviewPatientView: () => void;
}

export const ClinicFormBuilder: React.FC<ClinicFormBuilderProps> = ({
  clinic,
  onUpdateClinic,
  onPreviewPatientView,
}) => {
  const [config, setConfig] = useState<ClinicConfig>({ ...clinic });
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'fields' | 'branding' | 'consents'>('fields');

  const handleSave = () => {
    StorageService.updateClinic(config);
    onUpdateClinic(config);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const toggleSection = (sectionKey: keyof ClinicConfig['activeSections']) => {
    setConfig({
      ...config,
      activeSections: {
        ...config.activeSections,
        [sectionKey]: !config.activeSections[sectionKey],
      },
    });
  };

  const toggleRequiredField = (fieldKey: keyof ClinicConfig['requiredFields']) => {
    setConfig({
      ...config,
      requiredFields: {
        ...config.requiredFields,
        [fieldKey]: !config.requiredFields[fieldKey],
      },
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Sliders className="w-6 h-6 text-brand-600" />
            <span>Clinic Form Builder & Intake Settings</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure dynamic intake sections, required clinical fields, branding, and consent versioning for {config.name}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPreviewPatientView}
            className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-300 shadow-2xs flex items-center gap-1.5 transition"
          >
            <Eye className="w-4 h-4 text-brand-600" />
            <span>Live Patient Preview</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            {isSaved ? <Check className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? 'Published & Saved!' : 'Publish Form Updates'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-2 flex items-center gap-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('fields')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'fields' ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Form Sections & Required Fields
        </button>
        <button
          onClick={() => setActiveTab('branding')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'branding' ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Clinic Branding & Welcome Message
        </button>
        <button
          onClick={() => setActiveTab('consents')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'consents' ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Consent Documents & Version History
        </button>
      </div>

      {/* Tab 1: Form Sections & Fields */}
      {activeTab === 'fields' && (
        <div className="space-y-6">
          {/* Active Sections Toggles */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-subtle space-y-4">
            <h3 className="font-bold text-sm text-slate-900">
              Active Intake Sections
            </h3>
            <p className="text-xs text-slate-500">
              Toggle which steps are enabled for this clinic's digital registration workflow.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { key: 'demographics', label: 'Patient Demographics', desc: 'Legal name, contact, residential address' },
                { key: 'emergencyContact', label: 'Emergency Contact', desc: 'Trusted contact in case of emergency' },
                { key: 'insurance', label: 'Health Insurance', desc: 'Payer name, member ID, card photo upload' },
                { key: 'appointment', label: 'Visit Information', desc: 'Specialty department & reason for visit' },
                { key: 'consent', label: 'Consents & E-Signature', desc: 'HIPAA, treatment consent & canvas signature' },
              ].map((s) => {
                const isEnabled = config.activeSections[s.key as keyof ClinicConfig['activeSections']];
                return (
                  <div
                    key={s.key}
                    onClick={() => toggleSection(s.key as keyof ClinicConfig['activeSections'])}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition ${
                      isEnabled 
                        ? 'border-brand-500 bg-brand-50/40 text-brand-950 shadow-2xs' 
                        : 'border-slate-200 bg-white text-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs">{s.label}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isEnabled ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {isEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{s.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Field Level Requirements */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-subtle space-y-4">
            <h3 className="font-bold text-sm text-slate-900">
              Field-Level Validation Requirements
            </h3>
            <p className="text-xs text-slate-500">
              Configure which specific optional fields must be made mandatory for patients registering at {config.name}.
            </p>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
              {[
                { key: 'insuranceCardUpload', label: 'Insurance Card Front Upload', desc: 'Require patient to attach front photo of their card prior to submission' },
                { key: 'appointmentDate', label: 'Appointment Target Date', desc: 'Require patient to specify appointment date or schedule reference' },
                { key: 'insuranceGroupNumber', label: 'Insurance Group Number', desc: 'Enforce non-empty Group number if patient has commercial insurance' },
                { key: 'emergencySecondaryPhone', label: 'Emergency Secondary Phone', desc: 'Require alternate telephone number for emergency contact' },
                { key: 'middleName', label: 'Legal Middle Name', desc: 'Mark middle name as mandatory instead of optional' },
              ].map((rf) => {
                const isReq = config.requiredFields[rf.key as keyof ClinicConfig['requiredFields']];
                return (
                  <div key={rf.key} className="p-4 flex items-center justify-between gap-4 bg-white">
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">{rf.label}</span>
                      <span className="text-[11.5px] text-slate-500">{rf.desc}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleRequiredField(rf.key as keyof ClinicConfig['requiredFields'])}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        isReq 
                          ? 'bg-brand-600 text-white' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {isReq ? 'Required' : 'Optional'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Clinic Branding */}
      {activeTab === 'branding' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-subtle space-y-5">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Palette className="w-4 h-4 text-brand-600" />
            <span>Clinic Identity & Patient Welcome Message</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Official Clinic Name</label>
              <input
                type="text"
                value={config.name}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Clinic Tagline / Subtitle</label>
              <input
                type="text"
                value={config.tagline}
                onChange={(e) => setConfig({ ...config, tagline: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Clinic Telephone</label>
              <input
                type="text"
                value={config.phone}
                onChange={(e) => setConfig({ ...config, phone: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Intake Desk Email</label>
              <input
                type="text"
                value={config.email}
                onChange={(e) => setConfig({ ...config, email: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-slate-700">Custom Patient Welcome Banner Text</label>
              <textarea
                rows={3}
                value={config.customWelcomeMessage || ''}
                onChange={(e) => setConfig({ ...config, customWelcomeMessage: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Consent Versioning */}
      {activeTab === 'consents' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-subtle space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-600" />
                <span>Legal Consent Documentation & Version Tracking</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage regulatory compliance versions. Modifications increment the version tag and preserve previous historical signatures.
              </p>
            </div>
            <span className="bg-brand-50 text-brand-700 font-mono text-xs px-2.5 py-1 rounded-lg font-bold border border-brand-200">
              Active: {config.consentDocumentVersion}
            </span>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold">Compliance Invariant Rule:</p>
              <p className="text-amber-800 text-[11.5px] leading-relaxed">
                Updating consent policies generates a new immutable version timestamp. Previously signed patient agreements remain permanently archived with their respective historical document version.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-700 block">
              Current Published Policy Version Identifier:
            </label>
            <input
              type="text"
              value={config.consentDocumentVersion}
              onChange={(e) => setConfig({ ...config, consentDocumentVersion: e.target.value })}
              className="w-full sm:w-80 bg-white border border-slate-300 rounded-xl p-2.5 font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};
