"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  Banknote,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  Eye,
  X,
  Users,
  Plus,
  Filter,
} from 'lucide-react';
import ProviderSettlementService, {
  Settlement,
  DetailedServiceProvider,
  ProcessSettlementRequest,
} from '@/services/ProviderSettlementService';

type TabType = 'settlements' | 'process';
type StatusFilter = '' | 'pending' | 'confirmed' | 'disputed';

// ─── helpers ────────────────────────────────────────────────────────────────

const statusBadge = (status: string) => {
  const map: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    pending: { bg: 'bg-yellow-100 text-yellow-800', text: 'Pending', icon: <Clock className="w-3 h-3" /> },
    confirmed: { bg: 'bg-green-100 text-green-800', text: 'Confirmed', icon: <CheckCircle className="w-3 h-3" /> },
    disputed: { bg: 'bg-red-100 text-red-800', text: 'Disputed', icon: <AlertCircle className="w-3 h-3" /> },
  };
  const cfg = map[status] ?? { bg: 'bg-gray-100 text-gray-700', text: status, icon: null };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg}`}>
      {cfg.icon}{cfg.text}
    </span>
  );
};

const fmt = (amount: number, currency: string) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency }).format(amount);

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' });

// ─── empty process form ──────────────────────────────────────────────────────

const emptyForm = (): ProcessSettlementRequest => ({
  serviceProviderId: '',
  orderId: '',
  taskId: '',
  serviceId: '',
  description: '',
  amount: 0,
  currency: 'NGN',
  adminBankName: '',
  adminAccountNumber: '',
  settlementDate: new Date().toISOString().split('T')[0],
  paymentEvidenceUrl: '',
});

// ─── main component ──────────────────────────────────────────────────────────

const AdminProviderSettlementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('settlements');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('');
  const [providerFilter, setProviderFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // settlements list
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [total, setTotal] = useState(0);

  // service providers
  const [providers, setProviders] = useState<DetailedServiceProvider[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(false);

  // process form
  const [form, setForm] = useState<ProcessSettlementRequest>(emptyForm());
  const [processing, setProcessing] = useState(false);

  // detail modal
  const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // ── data fetching ──────────────────────────────────────────────────────────

  const fetchSettlements = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ProviderSettlementService.getOrganizationSettlements(
        statusFilter || undefined,
        providerFilter || undefined
      );
      if (res.success) {
        setSettlements(res.data.settlements);
        setTotal(res.data.total);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load settlements');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, providerFilter]);

  const fetchProviders = useCallback(async () => {
    setLoadingProviders(true);
    try {
      const res = await ProviderSettlementService.getDetailedServiceProviders();
      if (res.success) setProviders(res.data.serviceProviders);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load service providers');
    } finally {
      setLoadingProviders(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'settlements') fetchSettlements();
    else fetchProviders();
  }, [activeTab, fetchSettlements, fetchProviders]);

  // ── process settlement ─────────────────────────────────────────────────────

  const handleProviderSelect = (userId: string) => {
    setForm((prev) => ({ ...prev, serviceProviderId: userId }));
  };

  const handleProcess = async () => {
    const required: (keyof ProcessSettlementRequest)[] = [
      'serviceProviderId', 'description', 'amount', 'currency',
      'adminBankName', 'adminAccountNumber', 'settlementDate', 'paymentEvidenceUrl',
    ];
    const missing = required.filter((k) => !form[k]);
    if (missing.length) {
      setError(`Please fill in: ${missing.join(', ')}`);
      return;
    }
    setProcessing(true);
    setError(null);
    try {
      const payload: ProcessSettlementRequest = {
        ...form,
        amount: Number(form.amount),
      };
      // strip empty optional fields
      if (!payload.orderId) delete payload.orderId;
      if (!payload.taskId) delete payload.taskId;
      if (!payload.serviceId) delete payload.serviceId;

      const res = await ProviderSettlementService.processSettlement(payload);
      if (res.success) {
        setSuccessMsg('Settlement processed successfully');
        setForm(emptyForm());
        setActiveTab('settlements');
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to process settlement');
    } finally {
      setProcessing(false);
    }
  };

  // ── view detail ────────────────────────────────────────────────────────────

  const openDetail = async (settlementId: string) => {
    try {
      const res = await ProviderSettlementService.getAdminSettlementById(settlementId);
      if (res.success) {
        setSelectedSettlement(res.data.settlement);
        setShowDetailModal(true);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load settlement details');
    }
  };

  const selectedProvider = providers.find((p) => p.userId === form.serviceProviderId);

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Provider Settlement</h1>
          <p className="text-gray-500 text-sm mt-1">
            Process payments to service providers and track settlement history
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
            <button className="ml-auto" onClick={() => setError(null)}><X className="w-4 h-4" /></button>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />{successMsg}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 mb-6 w-fit">
          <button
            onClick={() => setActiveTab('settlements')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'settlements' ? 'bg-[#5D2A8B] text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            All Settlements
          </button>
          <button
            onClick={() => setActiveTab('process')}
            className={`flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'process' ? 'bg-[#5D2A8B] text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Plus className="w-4 h-4" />
            Process Settlement
          </button>
        </div>

        {/* ── SETTLEMENTS TAB ── */}
        {activeTab === 'settlements' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            {/* Filters */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Filter className="w-4 h-4" />
                <span>{total} settlement{total !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {/* Status filter */}
                {(['', 'pending', 'confirmed', 'disputed'] as StatusFilter[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      statusFilter === s
                        ? 'bg-[#5D2A8B] text-white border-[#5D2A8B]'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#5D2A8B]'
                    }`}
                  >
                    {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
                {/* Provider filter */}
                <select
                  value={providerFilter}
                  onChange={(e) => setProviderFilter(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                >
                  <option value="">All Providers</option>
                  {providers.map((p) => (
                    <option key={p.userId} value={p.userId}>
                      {p.firstName} {p.lastName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#5D2A8B]" />
              </div>
            ) : settlements.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Banknote className="w-12 h-12 mb-3 opacity-40" />
                <p className="text-sm">No settlements found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                      <th className="px-6 py-3">Settlement ID</th>
                      <th className="px-6 py-3">Description</th>
                      <th className="px-6 py-3">Amount</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {settlements.map((s) => (
                      <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-gray-600">{s.settlementId}</td>
                        <td className="px-6 py-4 text-gray-700 max-w-xs truncate">{s.description}</td>
                        <td className="px-6 py-4 font-semibold text-gray-900">{fmt(s.amount, s.currency)}</td>
                        <td className="px-6 py-4 text-gray-500">{fmtDate(s.settlementDate)}</td>
                        <td className="px-6 py-4">{statusBadge(s.settlementStatus)}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => openDetail(s._id)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#5D2A8B] transition-colors"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── PROCESS SETTLEMENT TAB ── */}
        {activeTab === 'process' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Provider selection */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-[#5D2A8B]" />
                <h2 className="font-semibold text-gray-900">Select Service Provider</h2>
              </div>
              {loadingProviders ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="w-6 h-6 animate-spin text-[#5D2A8B]" />
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {providers.map((p) => {
                    const hasBankDetails = !!p.bankDetails?.bankName;
                    const isSelected = form.serviceProviderId === p.userId;
                    return (
                      <button
                        key={p.userId}
                        onClick={() => hasBankDetails && handleProviderSelect(p.userId)}
                        disabled={!hasBankDetails}
                        className={`w-full text-left p-3 rounded-xl border transition-all ${
                          isSelected
                            ? 'border-[#5D2A8B] bg-purple-50'
                            : hasBankDetails
                            ? 'border-gray-200 hover:border-[#5D2A8B] hover:bg-gray-50'
                            : 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm text-gray-900">
                              {p.firstName} {p.lastName}
                            </p>
                            <p className="text-xs text-gray-500">{p.email}</p>
                          </div>
                          <div className="text-right">
                            {hasBankDetails ? (
                              <span className="text-xs text-green-600 font-medium">Bank set up ✓</span>
                            ) : (
                              <span className="text-xs text-red-400">No bank details</span>
                            )}
                            {p.serviceProviderFee && (
                              <p className="text-xs text-gray-500 mt-0.5">
                                Fee: {fmt(p.serviceProviderFee, p.serviceProviderFeeCurrency ?? 'NGN')}
                              </p>
                            )}
                          </div>
                        </div>
                        {isSelected && p.bankDetails && (
                          <div className="mt-2 pt-2 border-t border-purple-100 text-xs text-gray-600">
                            {p.bankDetails.bankName} · {p.bankDetails.accountNumber} · {p.bankDetails.accountName}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Settlement form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Banknote className="w-5 h-5 text-[#5D2A8B]" />
                <h2 className="font-semibold text-gray-900">Settlement Details</h2>
              </div>

              {selectedProvider && (
                <div className="mb-4 p-3 bg-purple-50 rounded-xl text-sm">
                  <p className="font-medium text-[#5D2A8B]">
                    {selectedProvider.firstName} {selectedProvider.lastName}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {selectedProvider.bankDetails?.bankName} · {selectedProvider.bankDetails?.accountNumber}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                {/* Description */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.description}
                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                    placeholder="e.g. Payment for completed haircut service"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                  />
                </div>

                {/* Amount + Currency */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Amount <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={form.amount || ''}
                      onChange={(e) => setForm((p) => ({ ...p, amount: Number(e.target.value) }))}
                      placeholder="5000"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Currency <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.currency}
                      onChange={(e) => setForm((p) => ({ ...p, currency: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                    >
                      <option value="NGN">NGN</option>
                      <option value="USD">USD</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>
                </div>

                {/* Admin bank */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Your Bank Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.adminBankName}
                      onChange={(e) => setForm((p) => ({ ...p, adminBankName: e.target.value }))}
                      placeholder="e.g. GTBank"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Your Account Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.adminAccountNumber}
                      onChange={(e) => setForm((p) => ({ ...p, adminAccountNumber: e.target.value }))}
                      placeholder="e.g. 0987654321"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                    />
                  </div>
                </div>

                {/* Settlement date */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Settlement Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.settlementDate}
                    onChange={(e) => setForm((p) => ({ ...p, settlementDate: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                  />
                </div>

                {/* Payment evidence URL */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Payment Evidence URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    value={form.paymentEvidenceUrl}
                    onChange={(e) => setForm((p) => ({ ...p, paymentEvidenceUrl: e.target.value }))}
                    placeholder="https://..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                  />
                </div>

                {/* Optional fields */}
                <details className="group">
                  <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 select-none">
                    Optional fields (Order ID, Task ID, Service ID)
                  </summary>
                  <div className="mt-3 space-y-3">
                    {(['orderId', 'taskId', 'serviceId'] as const).map((key) => (
                      <div key={key}>
                        <label className="block text-xs font-medium text-gray-700 mb-1 capitalize">
                          {key.replace('Id', ' ID')}
                        </label>
                        <input
                          type="text"
                          value={(form[key] as string) ?? ''}
                          onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                        />
                      </div>
                    ))}
                  </div>
                </details>

                <button
                  onClick={handleProcess}
                  disabled={processing || !form.serviceProviderId}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#5D2A8B] text-white text-sm font-medium hover:bg-[#4a2070] disabled:opacity-60 transition-colors mt-2"
                >
                  {processing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Banknote className="w-4 h-4" />
                  )}
                  Process Settlement
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── DETAIL MODAL ── */}
      {showDetailModal && selectedSettlement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Settlement Details</h3>
              <button onClick={() => setShowDetailModal(false)}>
                <X className="w-5 h-5 text-gray-400 hover:text-gray-700" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-gray-500">{selectedSettlement.settlementId}</span>
                {statusBadge(selectedSettlement.settlementStatus)}
              </div>
              <p className="text-sm text-gray-700">{selectedSettlement.description}</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Amount', value: fmt(selectedSettlement.amount, selectedSettlement.currency) },
                  { label: 'Settlement Date', value: fmtDate(selectedSettlement.settlementDate) },
                  { label: "Provider's Bank", value: selectedSettlement.providerBankDetails?.bankName },
                  { label: 'Provider Account', value: selectedSettlement.providerBankDetails?.accountNumber },
                  { label: 'Account Name', value: selectedSettlement.providerBankDetails?.accountName },
                  { label: 'Admin Bank', value: selectedSettlement.adminBankDetails?.bankName },
                  { label: 'Admin Account', value: selectedSettlement.adminBankDetails?.accountNumber },
                  { label: 'Processed At', value: selectedSettlement.processedAt ? fmtDate(selectedSettlement.processedAt) : '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                    <p className="text-sm font-medium text-gray-900">{value ?? '—'}</p>
                  </div>
                ))}
              </div>
              {selectedSettlement.paymentEvidenceUrl && (
                <a
                  href={selectedSettlement.paymentEvidenceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-[#5D2A8B] hover:underline"
                >
                  View Payment Evidence ↗
                </a>
              )}
              {selectedSettlement.providerComment && (
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-green-600 mb-0.5">Provider Confirmation Comment</p>
                  <p className="text-sm text-green-800">{selectedSettlement.providerComment}</p>
                </div>
              )}
              {selectedSettlement.providerConfirmedAt && (
                <p className="text-xs text-gray-400">
                  Confirmed by provider on {fmtDate(selectedSettlement.providerConfirmedAt)}
                </p>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProviderSettlementPage;
