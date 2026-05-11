"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  Banknote,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  Edit2,
  Eye,
  X,
  Save,
  MessageSquare,
} from 'lucide-react';
import ProviderSettlementService, {
  Settlement,
  BankDetails,
  UpdateBankDetailsRequest,
} from '@/services/ProviderSettlementService';

type TabType = 'settlements' | 'bank-details';
type StatusFilter = '' | 'pending' | 'confirmed' | 'disputed';

// ─── helpers ────────────────────────────────────────────────────────────────

const statusBadge = (status: string) => {
  const map: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    pending: {
      bg: 'bg-yellow-100 text-yellow-800',
      text: 'Pending',
      icon: <Clock className="w-3 h-3" />,
    },
    confirmed: {
      bg: 'bg-green-100 text-green-800',
      text: 'Confirmed',
      icon: <CheckCircle className="w-3 h-3" />,
    },
    disputed: {
      bg: 'bg-red-100 text-red-800',
      text: 'Disputed',
      icon: <AlertCircle className="w-3 h-3" />,
    },
  };
  const cfg = map[status] ?? { bg: 'bg-gray-100 text-gray-700', text: status, icon: null };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg}`}>
      {cfg.icon}
      {cfg.text}
    </span>
  );
};

const fmt = (amount: number, currency: string) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency }).format(amount);

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' });

// ─── main component ──────────────────────────────────────────────────────────

const ProviderSettlementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('settlements');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // settlements
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [total, setTotal] = useState(0);

  // bank details
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [editingBank, setEditingBank] = useState(false);
  const [bankForm, setBankForm] = useState<UpdateBankDetailsRequest>({
    bankName: '',
    accountNumber: '',
    accountName: '',
  });
  const [savingBank, setSavingBank] = useState(false);

  // detail modal
  const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // confirm modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmComment, setConfirmComment] = useState('');
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  // ── data fetching ──────────────────────────────────────────────────────────

  const fetchSettlements = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ProviderSettlementService.getMySettlements(statusFilter || undefined);
      if (res.success) {
        setSettlements(res.data.settlements);
        setTotal(res.data.total);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load settlements');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  const fetchBankDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ProviderSettlementService.getMyBankDetails();
      if (res.success) {
        setBankDetails(res.data.bankDetails);
        if (res.data.bankDetails.hasBankDetails) {
          setBankForm({
            bankName: res.data.bankDetails.bankName ?? '',
            accountNumber: res.data.bankDetails.accountNumber ?? '',
            accountName: res.data.bankDetails.accountName ?? '',
          });
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load bank details');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'settlements') fetchSettlements();
    else fetchBankDetails();
  }, [activeTab, fetchSettlements, fetchBankDetails]);

  // ── bank details save ──────────────────────────────────────────────────────

  const handleSaveBank = async () => {
    if (!bankForm.bankName || !bankForm.accountNumber || !bankForm.accountName) {
      setError('All bank detail fields are required');
      return;
    }
    setSavingBank(true);
    setError(null);
    try {
      const res = await ProviderSettlementService.updateBankDetails(bankForm);
      if (res.success) {
        setSuccessMsg(res.message);
        setEditingBank(false);
        fetchBankDetails();
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save bank details');
    } finally {
      setSavingBank(false);
    }
  };

  // ── confirm settlement ─────────────────────────────────────────────────────

  const openConfirmModal = (settlementId: string) => {
    setConfirmingId(settlementId);
    setConfirmComment('');
    setShowConfirmModal(true);
  };

  const handleConfirmSettlement = async () => {
    if (!confirmingId) return;
    setConfirming(true);
    setError(null);
    try {
      const res = await ProviderSettlementService.confirmSettlement(confirmingId, {
        comment: confirmComment || undefined,
      });
      if (res.success) {
        setSuccessMsg('Settlement confirmed successfully');
        setShowConfirmModal(false);
        fetchSettlements();
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to confirm settlement');
    } finally {
      setConfirming(false);
    }
  };

  // ── view detail ────────────────────────────────────────────────────────────

  const openDetail = async (settlementId: string) => {
    try {
      const res = await ProviderSettlementService.getMySettlementById(settlementId);
      if (res.success) {
        setSelectedSettlement(res.data.settlement);
        setShowDetailModal(true);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load settlement details');
    }
  };

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Provider Settlement</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your bank details and track settlement payments
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
            <button className="ml-auto" onClick={() => setError(null)}>
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            {successMsg}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 mb-6 w-fit">
          {(['settlements', 'bank-details'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-[#5D2A8B] text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {tab === 'settlements' ? 'My Settlements' : 'Bank Details'}
            </button>
          ))}
        </div>

        {/* ── SETTLEMENTS TAB ── */}
        {activeTab === 'settlements' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            {/* Filter bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-gray-100">
              <span className="text-sm text-gray-500">
                {total} settlement{total !== 1 ? 's' : ''}
              </span>
              <div className="flex gap-2">
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
                        <td className="px-6 py-4 font-mono text-xs text-gray-600">
                          {s.settlementId}
                        </td>
                        <td className="px-6 py-4 text-gray-700 max-w-xs truncate">
                          {s.description}
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          {fmt(s.amount, s.currency)}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {fmtDate(s.settlementDate)}
                        </td>
                        <td className="px-6 py-4">{statusBadge(s.settlementStatus)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openDetail(s._id)}
                              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#5D2A8B] transition-colors"
                              title="View details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {s.settlementStatus === 'pending' && (
                              <button
                                onClick={() => openConfirmModal(s._id)}
                                className="px-3 py-1 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 text-xs font-medium transition-colors"
                              >
                                Confirm
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── BANK DETAILS TAB ── */}
        {activeTab === 'bank-details' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#5D2A8B]" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Bank Account Details</h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Required to receive settlement payments
                    </p>
                  </div>
                  {!editingBank && (
                    <button
                      onClick={() => setEditingBank(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#5D2A8B] text-white text-sm font-medium hover:bg-[#4a2070] transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      {bankDetails?.hasBankDetails ? 'Update' : 'Add Bank Details'}
                    </button>
                  )}
                </div>

                {!editingBank ? (
                  bankDetails?.hasBankDetails ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { label: 'Bank Name', value: bankDetails.bankName },
                        { label: 'Account Number', value: bankDetails.accountNumber },
                        { label: 'Account Name', value: bankDetails.accountName },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-gray-50 rounded-xl p-4">
                          <p className="text-xs text-gray-400 mb-1">{label}</p>
                          <p className="font-medium text-gray-900">{value}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                      <Banknote className="w-12 h-12 mb-3 opacity-40" />
                      <p className="text-sm font-medium">No bank details set up yet</p>
                      <p className="text-xs mt-1">Add your bank details to receive settlements</p>
                    </div>
                  )
                ) : (
                  <div className="space-y-4 max-w-lg">
                    {(
                      [
                        { key: 'bankName', label: 'Bank Name', placeholder: 'e.g. First Bank of Nigeria' },
                        { key: 'accountNumber', label: 'Account Number', placeholder: 'e.g. 1234567890' },
                        { key: 'accountName', label: 'Account Name', placeholder: 'e.g. John Doe' },
                      ] as { key: keyof UpdateBankDetailsRequest; label: string; placeholder: string }[]
                    ).map(({ key, label, placeholder }) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {label} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={bankForm[key]}
                          onChange={(e) => setBankForm((prev) => ({ ...prev, [key]: e.target.value }))}
                          placeholder={placeholder}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5D2A8B] focus:border-transparent"
                        />
                      </div>
                    ))}
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={handleSaveBank}
                        disabled={savingBank}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#5D2A8B] text-white text-sm font-medium hover:bg-[#4a2070] disabled:opacity-60 transition-colors"
                      >
                        {savingBank ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        Save
                      </button>
                      <button
                        onClick={() => setEditingBank(false)}
                        className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
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
                  { label: 'Your Bank', value: selectedSettlement.providerBankDetails?.bankName },
                  { label: 'Account Number', value: selectedSettlement.providerBankDetails?.accountNumber },
                  { label: 'Account Name', value: selectedSettlement.providerBankDetails?.accountName },
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
                  <p className="text-xs text-green-600 mb-0.5">Your Confirmation Comment</p>
                  <p className="text-sm text-green-800">{selectedSettlement.providerComment}</p>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              {selectedSettlement.settlementStatus === 'pending' && (
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    openConfirmModal(selectedSettlement._id);
                  }}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  Confirm Receipt
                </button>
              )}
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

      {/* ── CONFIRM MODAL ── */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Confirm Payment Receipt</h3>
              <button onClick={() => setShowConfirmModal(false)}>
                <X className="w-5 h-5 text-gray-400 hover:text-gray-700" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <p className="text-sm text-gray-600">
                Confirm that you have received this payment. This action cannot be undone.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MessageSquare className="w-4 h-4 inline mr-1" />
                  Comment <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={confirmComment}
                  onChange={(e) => setConfirmComment(e.target.value)}
                  placeholder="e.g. Payment received successfully. Thank you!"
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5D2A8B] resize-none"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSettlement}
                disabled={confirming}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-60 transition-colors"
              >
                {confirming ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderSettlementPage;
