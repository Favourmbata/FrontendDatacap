"use client"

import { X } from "lucide-react"
import { useRouter } from "next/navigation"

interface DownloadAppModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function DownloadAppModal({ isOpen, onClose }: DownloadAppModalProps) {
  const router = useRouter()

  if (!isOpen) return null

  const navigate = (path: string) => {
    onClose()
    router.push(path)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div
        className="relative bg-white rounded-2xl w-full max-w-sm p-6 pt-8"
        style={{ fontFamily: "Manrope, sans-serif" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={22} />
        </button>

        <h2
          className="text-xl font-semibold text-[#1A1A1A] mb-2"
          style={{ fontFamily: "Monument Extended, sans-serif" }}
        >
          Download App
        </h2>
        <p className="text-sm text-[#6E6E6E] mb-6">
          To download the app, kindly sign up briefly for a great experience.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/auth/signup/admin")}
            className="w-full py-3 rounded-xl border-2 border-[#5D2A8B] text-[#5D2A8B] font-medium text-sm hover:bg-[#F4EFFA] transition-colors"
          >
            Sign up as Organisation
          </button>
          <button
            onClick={() => navigate("/auth/signup/user")}
            className="w-full py-3 rounded-xl bg-[#5D2A8B] text-white font-medium text-sm hover:opacity-90 transition-opacity"
          >
            Sign up as Individual
          </button>
        </div>
      </div>
    </div>
  )
}
