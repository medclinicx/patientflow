import React from 'react';
import { ClinicConfig } from '../../types';
import { StorageService } from '../../services/storageService';
import { Building2, ShieldCheck, RotateCcw, CheckCircle2 } from 'lucide-react';

interface TenantManagementProps {
  clinics: ClinicConfig[];
  currentClinicId: string;
  onSelectClinic: (id: string) => void;
  onResetAllData: () => void;
}

export const TenantManagement: React.FC<TenantManagementProps> = ({
  clinics,
  currentClinicId,
  onSelectClinic,
  onResetAllData,
}) => {
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-[#0066FF]" />
            <span>Platform Administrator & Multi-Tenant Management</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor healthcare provider tenant partitions, enforce HIPAA security boundaries, and provision new clinical facilities.
          </p>
        </div>

        <button
          onClick={onResetAllData}
          className="bg-white hover:bg-red-50 text-red-600 text-xs font-bold px-4 py-2.5 rounded-xl border border-red-200 shadow-2xs flex items-center gap-1.5 transition"
        >
          <RotateCcw className="w-4 h-4 text-red-500" />
          <span>Reset Demo Seed Data</span>
        </button>
      </div>

      {/* Tenant Partition Architecture Card */}
      <div className="bg-[#0B132B] text-white rounded-3xl p-6 sm:p-8 shadow-card space-y-4">
        <div className="flex items-center gap-2 text-[#00C8FF] font-bold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-[#0066FF]" />
          <span>Zero-Knowledge Tenant Isolation Protocol</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black">
          Strict Multi-Tenant PHI Data Segregation
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Under HIPAA Security Rule 45 CFR § 164.308(a)(1), every healthcare tenant's patient records, uploads, and audit trails are cryptographically and logically partitioned. Front-office personnel at one provider cannot query or inspect another clinic's registrations.
        </p>
      </div>

      {/* Active Tenants List */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
          Authorized Healthcare Provider Tenants ({clinics.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {clinics.map((c) => {
            const isCurrent = c.id === currentClinicId;
            const tenantRegistrations = StorageService.getRegistrations(c.id);

            return (
              <div
                key={c.id}
                className={`bg-white rounded-3xl border-2 p-5 space-y-4 transition ${
                  isCurrent ? 'border-[#0066FF] shadow-md ring-2 ring-blue-100' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5 text-[#0066FF]" />
                  </div>
                  <span className="text-[10px] bg-[#EBF8FE] text-[#0066FF] px-2.5 py-0.5 rounded-full font-bold border border-blue-200">
                    Active Tenant
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{c.name}</h4>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">tenant_id: {c.id}</p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span>Active Registrations:</span>
                    <strong className="text-slate-900">{tenantRegistrations.length} records</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Contact:</span>
                    <span className="text-slate-500">{c.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Consent Policy:</span>
                    <span className="font-mono text-[10px]">{c.consentDocumentVersion}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => onSelectClinic(c.id)}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      isCurrent
                        ? 'bg-[#0066FF] hover:bg-[#0052CC] text-white shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isCurrent ? <CheckCircle2 className="w-4 h-4" /> : null}
                    <span>{isCurrent ? 'Current Active Workspace' : 'Switch to This Tenant'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
