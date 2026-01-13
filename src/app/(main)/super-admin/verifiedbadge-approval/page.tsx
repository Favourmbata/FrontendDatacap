"use client"

import type React from "react"
import { useState } from "react"
import { X, Upload, Send, Check, Clock, AlertCircle, Download } from "lucide-react"

interface ApprovalData {
  organizationName: string
  organizationEmail: string
  organizationAddress: string
  submissionDate: string
}

interface ApprovalFieldData {
  name: string
  uploadedFile?: File
  comment: string
}

interface VerifiedBadgeApprovalModalProps {
  isOpen: boolean
  onClose: () => void
  organization: {
    id: string
    name: string
    address: string
    city: string
    state: string
    country: string
    contactEmail?: string
  } | null
}

export const VerifiedBadgeApprovalModal: React.FC<VerifiedBadgeApprovalModalProps> = ({
  isOpen,
  onClose,
  organization,
}) => {
  const [activeTab, setActiveTab] = useState<"details" | "data" | "approval">("details")
  const [fieldData, setFieldData] = useState<Record<string, ApprovalFieldData>>({
    organizationName: { name: "Organization Name", comment: "" },
    businessAddress: { name: "Business Address", comment: "" },
    registrationDocument: { name: "Registration Document", comment: "" },
    identificationProof: { name: "Identification Proof", comment: "" },
  })
  const [approvalStatus, setApprovalStatus] = useState<"pending" | "approved" | "rejected">("pending")
  const [approvalComment, setApprovalComment] = useState("")
  const [isSendingEmail, setIsSendingEmail] = useState(false)

  if (!isOpen || !organization) return null

  const handleFileUpload = (fieldKey: string, file: File | undefined) => {
    setFieldData((prev) => ({
      ...prev,
      [fieldKey]: {
        ...prev[fieldKey],
        uploadedFile: file,
      },
    }))
  }

  const handleCommentChange = (fieldKey: string, comment: string) => {
    setFieldData((prev) => ({
      ...prev,
      [fieldKey]: {
        ...prev[fieldKey],
        comment,
      },
    }))
  }

  const handleApprove = () => {
    setApprovalStatus("approved")
    console.log("Badge approved for:", organization.id, fieldData)
  }

  const handleReject = () => {
    setApprovalStatus("rejected")
  }

  const handleSendEmail = async () => {
    setIsSendingEmail(true)
    try {
      // Simulate email sending
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Email sent to:", organization.contactEmail)
    } finally {
      setIsSendingEmail(false)
    }
  }

  const handleDownloadPDF = () => {
    console.log("Downloading PDF for:", organization.id)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#5D2A8B] to-[#7a3aaf] text-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold">Verified Badge Approval</h2>
            <p className="text-purple-100 text-sm">{organization.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50 sticky top-16 z-40">
          {(["details", "data", "approval"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-[#5D2A8B] text-[#5D2A8B] bg-white"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab === "details" && "Organization Details"}
              {tab === "data" && "Data Provided"}
              {tab === "approval" && "Approval Decision"}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Organization Details Tab */}
          {activeTab === "details" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Organization Name
                  </label>
                  <p className="text-lg font-medium text-gray-900 mt-1">{organization.name}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Contact Email</label>
                  <p className="text-lg font-medium text-gray-900 mt-1">
                    {organization.contactEmail || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Location</label>
                  <p className="text-lg font-medium text-gray-900 mt-1">
                    {organization.city}, {organization.state}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Country</label>
                  <p className="text-lg font-medium text-gray-900 mt-1">{organization.country}</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Full Address</label>
                <p className="text-gray-900 mt-1">{organization.address}</p>
              </div>
            </div>
          )}

          {/* Data Provided Tab */}
          {activeTab === "data" && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-900">
                  Review and verify all submitted documents. Add comments for any clarifications needed.
                </p>
              </div>

              {Object.entries(fieldData).map(([key, field]) => (
                <div key={key} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{field.name}</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* File Upload */}
                    <div>
                      <label className="text-xs font-medium text-gray-600 uppercase tracking-wide block mb-2">
                        Upload Document
                      </label>
                      <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-[#5D2A8B] hover:bg-purple-50 transition-colors">
                        <Upload className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-600">
                          {field.uploadedFile ? field.uploadedFile.name : "Choose file"}
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => handleFileUpload(key, e.target.files?.[0])}
                        />
                      </label>
                    </div>

                    {/* Comment */}
                    <div>
                      <label className="text-xs font-medium text-gray-600 uppercase tracking-wide block mb-2">
                        Comment
                      </label>
                      <textarea
                        value={field.comment}
                        onChange={(e) => handleCommentChange(key, e.target.value)}
                        placeholder="Add any comments or notes..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] resize-none"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Approval Decision Tab */}
          {activeTab === "approval" && (
            <div className="space-y-6">
              {/* Status Indicator */}
              <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {approvalStatus === "pending" && (
                    <>
                      <Clock className="w-6 h-6 text-yellow-600" />
                      <div>
                        <p className="font-semibold text-gray-900">Pending Approval</p>
                        <p className="text-sm text-gray-600">Awaiting admin decision</p>
                      </div>
                    </>
                  )}
                  {approvalStatus === "approved" && (
                    <>
                      <Check className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="font-semibold text-gray-900">Approved</p>
                        <p className="text-sm text-gray-600">Verified badge granted</p>
                      </div>
                    </>
                  )}
                  {approvalStatus === "rejected" && (
                    <>
                      <AlertCircle className="w-6 h-6 text-red-600" />
                      <div>
                        <p className="font-semibold text-gray-900">Rejected</p>
                        <p className="text-sm text-gray-600">Additional information needed</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Approval Comment */}
              <div>
                <label className="text-sm font-semibold text-gray-900 block mb-2">Approval Notes</label>
                <textarea
                  value={approvalComment}
                  onChange={(e) => setApprovalComment(e.target.value)}
                  placeholder="Add approval notes, reasons for rejection, or feedback..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] resize-none"
                  rows={4}
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">Select an action:</p>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={handleApprove}
                    disabled={approvalStatus !== "pending"}
                    className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Check className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={approvalStatus !== "pending"}
                    className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <AlertCircle className="w-4 h-4" />
                    Reject
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    className="flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    PDF
                  </button>
                </div>
              </div>

              {/* Send Email */}
              {approvalStatus !== "pending" && (
                <div className="border-t pt-4">
                  <button
                    onClick={handleSendEmail}
                    disabled={isSendingEmail}
                    className="w-full flex items-center justify-center gap-2 bg-[#5D2A8B] text-white px-4 py-3 rounded-lg hover:bg-[#4a216d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    <Send className="w-4 h-4" />
                    {isSendingEmail ? "Sending..." : "Send Email to Organization"}
                  </button>
                  <p className="text-xs text-gray-600 text-center mt-2">
                    Email will be sent to {organization.contactEmail}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex justify-end gap-3 sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
export default VerifiedBadgeApprovalModal