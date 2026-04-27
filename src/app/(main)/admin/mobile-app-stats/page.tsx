"use client"

import { useState, useEffect } from "react"
import { apkDownloadService } from "@/services/apkDownloadService"
import { Download, Smartphone, TrendingUp, Calendar, Users } from "lucide-react"

interface DownloadStats {
  totalDownloads: number
  uniqueUsers: number
  androidDownloads: number
  iosDownloads: number
  downloadsToday: number
  downloadsThisWeek: number
  downloadsThisMonth: number
}

export default function MobileAppStatsPage() {
  const [stats, setStats] = useState<DownloadStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError("")
      
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("Authentication required. Please login.")
      }

      const response = await apkDownloadService.getDownloadStats(token)
      if (response.success) {
        setStats(response.data)
      } else {
        throw new Error(response.message || "Failed to fetch statistics")
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching statistics")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5D2A8B] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading statistics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
            <p className="text-red-600">{error}</p>
          </div>
          <button
            onClick={fetchStats}
            className="px-6 py-2 bg-[#5D2A8B] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!stats) {
    return null
  }

  const StatCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
    color = "purple",
  }: {
    icon: any
    title: string
    value: number | string
    subtitle?: string
    color?: "purple" | "blue" | "green" | "orange"
  }) => {
    const colorClasses = {
      purple: "bg-purple-50 border-purple-200 text-purple-600",
      blue: "bg-blue-50 border-blue-200 text-blue-600",
      green: "bg-green-50 border-green-200 text-green-600",
      orange: "bg-orange-50 border-orange-200 text-orange-600",
    }

    return (
      <div className={`border rounded-xl p-6 ${colorClasses[color]}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium opacity-75 mb-1">{title}</p>
            <p className="text-3xl font-bold mb-1">{value}</p>
            {subtitle && <p className="text-xs opacity-75">{subtitle}</p>}
          </div>
          <div className="p-3 rounded-lg bg-white bg-opacity-60">
            <Icon size={24} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-0 ml-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-3xl font-bold text-[#1A1A1A] mb-2"
            style={{ fontFamily: "Monument Extended, sans-serif" }}
          >
            Mobile App Statistics
          </h1>
          <p className="text-gray-600">
            Track app downloads and user engagement across platforms
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Download}
            title="Total Downloads"
            value={stats.totalDownloads}
            subtitle="All time"
            color="purple"
          />
          <StatCard
            icon={Users}
            title="Unique Users"
            value={stats.uniqueUsers}
            subtitle="Distinct users"
            color="blue"
          />
          <StatCard
            icon={Smartphone}
            title="Android Downloads"
            value={stats.androidDownloads}
            subtitle={`${((stats.androidDownloads / stats.totalDownloads) * 100).toFixed(1)}% of total`}
            color="green"
          />
          <StatCard
            icon={Smartphone}
            title="iOS Downloads"
            value={stats.iosDownloads}
            subtitle={`${((stats.iosDownloads / stats.totalDownloads) * 100).toFixed(1)}% of total`}
            color="orange"
          />
        </div>

        {/* Time-based Stats */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">
            <Calendar size={20} />
            Download Trends
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              icon={TrendingUp}
              title="Today"
              value={stats.downloadsToday}
              subtitle="Last 24 hours"
              color="purple"
            />
            <StatCard
              icon={TrendingUp}
              title="This Week"
              value={stats.downloadsThisWeek}
              subtitle="Last 7 days"
              color="blue"
            />
            <StatCard
              icon={TrendingUp}
              title="This Month"
              value={stats.downloadsThisMonth}
              subtitle="Last 30 days"
              color="green"
            />
          </div>
        </div>

        {/* Platform Distribution */}
        <div className="bg-white border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-[#1A1A1A] mb-6">
            Platform Distribution
          </h2>
          <div className="space-y-4">
            {/* Android Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Android</span>
                <span className="text-sm font-semibold text-gray-900">
                  {stats.androidDownloads} downloads
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${(stats.androidDownloads / stats.totalDownloads) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* iOS Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">iOS</span>
                <span className="text-sm font-semibold text-gray-900">
                  {stats.iosDownloads} downloads
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-orange-500 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${(stats.iosDownloads / stats.totalDownloads) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {((stats.androidDownloads / stats.totalDownloads) * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600">Android Users</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">
                  {((stats.iosDownloads / stats.totalDownloads) * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600">iOS Users</p>
              </div>
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="mt-6 text-center">
          <button
            onClick={fetchStats}
            className="px-6 py-2 bg-[#5D2A8B] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Refresh Statistics
          </button>
        </div>
      </div>
    </div>
  )
}
