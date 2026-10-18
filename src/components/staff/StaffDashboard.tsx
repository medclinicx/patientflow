import React, { useState } from 'react';
import { PatientRegistration, ClinicConfig, RegistrationStatus, UserRole } from '../../types';
import { StorageService } from '../../services/storageService';
import { RegistrationDetailModal } from './RegistrationDetailModal';
import { 
  Users, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileEdit, 
  Eye, 
  Building2, 
  ArrowUpRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

interface StaffDashboardProps {
  clinic: ClinicConfig;
  currentRole: UserRole;
  onOpenPatientCorrectionFlow?: (registration: PatientRegistration) => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  clinic,
  currentRole,
  onOpenPatientCorrectionFlow,
}) => {
  const [registrations, setRegistrations] = useState<PatientRegistration[]>(() => 
    StorageService.getRegistrations(clinic.id)
  );
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReg, setSelectedReg] = useState<PatientRegistration | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const refreshData = () => {
    setRegistrations(StorageService.getRegistrations(clinic.id));
    if (selectedReg) {
      const refreshed = StorageService.getRegistrationById(selectedReg.id, clinic.id);
      setSelectedReg(refreshed);
    }
  };

  // Metrics
  const totalCount = registrations.length;
  const submittedCount = registrations.filter(r => r.status === 'submitted').length;
  const underReviewCount = registrations.filter(r => r.status === 'under_review').length;
  const needsCorrectionCount = registrations.filter(r => r.status === 'needs_correction').length;
  const completeCount = registrations.filter(r => r.status === 'complete').length;

  // Filtered list
  const filtered = registrations.filter(r => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = `${r.demographics.firstName} ${r.demographics.lastName}`.toLowerCase().includes(q);
      const matchId = r.id.toLowerCase().includes(q);
      const matchEmail = r.demographics.email.toLowerCase().includes(q);
      const matchPhone = r.demographics.phone.includes(q);
      return matchName || matchId || matchEmail || matchPhone;
    }
    return true;
  });

  const handleOpenDetail = (reg: PatientRegistration) => {
    setSelectedReg(reg);
    setDetailModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn pb-16">
      {/* Clinic Tenant Title & Quick Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Front-Office Registration Queue
            </h1>
            <span className="bg-[#EBF8FE] text-[#0066FF] text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#0066FF]" /> Tenant Isolated: {clinic.name}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time digital intake processing, document review, and patient correction workflow.
          </p>
        </div>

        <button
          onClick={refreshData}
          className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 shadow-2xs flex items-center gap-1.5 transition"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-subtle space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
            Total Intakes
          </span>
          <p className="text-2xl font-black text-slate-900">{totalCount}</p>
          <span className="text-[10px] text-slate-500">{clinic.name}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-subtle space-y-1">
          <span className="text-[11px] font-semibold text-blue-700 block uppercase tracking-wider">
            Awaiting Review
          </span>
          <p className="text-2xl font-black text-blue-600">{submittedCount}</p>
          <span className="text-[10px] text-blue-600 font-medium">Ready for staff triage</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-indigo-200 shadow-subtle space-y-1">
          <span className="text-[11px] font-semibold text-indigo-700 block uppercase tracking-wider">
            Under Review
          </span>
          <p className="text-2xl font-black text-indigo-600">{underReviewCount}</p>
          <span className="text-[10px] text-indigo-600 font-medium">Being processed</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-subtle space-y-1">
          <span className="text-[11px] font-semibold text-amber-700 block uppercase tracking-wider">
            Needs Correction
          </span>
          <p className="text-2xl font-black text-amber-600">{needsCorrectionCount}</p>
          <span className="text-[10px] text-amber-600 font-medium">Patient notified</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-subtle space-y-1">
          <span className="text-[11px] font-semibold text-emerald-700 block uppercase tracking-wider">
            Completed
          </span>
          <p className="text-2xl font-black text-emerald-600">{completeCount}</p>
          <span className="text-[10px] text-emerald-600 font-medium">Ready for doctor visit</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Intakes', count: totalCount },
            { id: 'submitted', label: 'Submitted', count: submittedCount },
            { id: 'under_review', label: 'Under Review', count: underReviewCount },
            { id: 'needs_correction', label: 'Needs Correction', count: needsCorrectionCount },
            { id: 'complete', label: 'Complete', count: completeCount },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                statusFilter === tab.id
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                statusFilter === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search patient, ID, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Main Registrations Queue Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Patient Details</th>
                <th className="px-4 py-3.5">Intake ID & Type</th>
                <th className="px-4 py-3.5">Department & Visit</th>
                <th className="px-4 py-3.5">Insurance / Card</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Patient Name & Contact */}
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-900 text-sm">
                        {reg.demographics.firstName} {reg.demographics.lastName}
                      </div>
                      <div className="text-slate-500 text-[11px] flex items-center gap-2 mt-0.5">
                        <span>DOB: {reg.demographics.dateOfBirth}</span>
                        <span>•</span>
                        <span>{reg.demographics.phone}</span>
                      </div>
                    </td>

                    {/* ID & Purpose */}
                    <td className="px-4 py-3.5">
                      <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px] block w-fit">
                        {reg.id}
                      </span>
                      <span className="text-[11px] text-slate-400 capitalize mt-0.5 block">
                        {reg.registrationType.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Department */}
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-800">
                        {reg.appointment.department}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {reg.appointment.appointmentDate || 'Requested appointment'}
                      </div>
                    </td>

                    {/* Insurance */}
                    <td className="px-4 py-3.5">
                      {reg.insurance.isSelfPay ? (
                        <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                          Self-Pay
                        </span>
                      ) : (
                        <div>
                          <span className="font-semibold text-slate-800 block text-[11.5px]">
                            {reg.insurance.providerName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            ID: {reg.insurance.memberId}
                            {reg.insurance.cardFrontUrl ? ' (Card attached)' : ''}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] inline-flex items-center gap-1.5 ${
                        reg.status === 'complete'
                          ? 'bg-emerald-100 text-emerald-800'
                          : reg.status === 'needs_correction'
                          ? 'bg-amber-100 text-amber-800 animate-pulse'
                          : reg.status === 'under_review'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          reg.status === 'complete'
                            ? 'bg-emerald-500'
                            : reg.status === 'needs_correction'
                            ? 'bg-amber-500'
                            : reg.status === 'under_review'
                            ? 'bg-blue-500'
                            : 'bg-slate-400'
                        }`} />
                        <span>{reg.status.toUpperCase().replace('_', ' ')}</span>
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="px-4 py-3.5 text-right space-x-2">
                      {reg.status === 'needs_correction' && onOpenPatientCorrectionFlow && (
                        <button
                          onClick={() => onOpenPatientCorrectionFlow(reg)}
                          className="bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold px-2.5 py-1.5 rounded-lg border border-amber-200 text-[11px] transition inline-flex items-center gap-1"
                          title="View patient correction interface"
                        >
                          <FileEdit className="w-3 h-3" />
                          <span>Patient View</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenDetail(reg)}
                        className="bg-[#EBF8FE] hover:bg-blue-100 text-[#0066FF] font-bold px-3 py-1.5 rounded-lg border border-blue-200 text-[11.5px] transition inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Review</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-400 italic">
                    No registrations found matching the current search or status filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration Detail Modal */}
      <RegistrationDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        registration={selectedReg}
        onUpdate={refreshData}
        currentRole={currentRole}
      />
    </div>
  );
};
