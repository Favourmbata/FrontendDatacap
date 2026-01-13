"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { Search, Plus, Download, Filter, ChevronDown, CheckCircle, Edit, Trash2, MoreVertical } from "lucide-react"
import { VerifiedBadgeApprovalModal } from "../../verifiedbadge-approval/page"

interface Organization {
  id: string
  serialNumber: number
  name: string
  totalSubscriptionAmount: number
  currency: string
  totalLocations: number
  headquarters: string
  locationVerificationCost: number
  subscriptionDuration: string
  address: string
  city: string
  lga: string
  state: string
  country: string
  branches: Branch[]
  createdAt: string
  updatedAt: string
}

interface Branch {
  id: string
  branchName: string
  houseNumber: string
  streetName: string
  cityRegion: string
  buildingType?: string
  lga: string
  state: string
  country: string
  contactPerson?: string
  contactPosition?: string
  contactEmail?: string
  contactPhone?: string
}

const VerifiedBadgeSubscriptionPage = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [filteredOrganizations, setFilteredOrganizations] = useState<Organization[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [showBranchModal, setShowBranchModal] = useState(false)
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [organizationToDelete, setOrganizationToDelete] = useState<string | null>(null)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [organizationForApproval, setOrganizationForApproval] = useState<Organization | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [organizationToEdit, setOrganizationToEdit] = useState<Organization | null>(null)
  const [sortConfig, setSortConfig] = useState<{ key: keyof Organization; direction: "asc" | "desc" } | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const tableContainerRef = useRef<HTMLDivElement>(null)

  // ... existing sample data ...
  const sampleData: Organization[] = [
    {
      id: "ORG-001",
      serialNumber: 1,
      name: "Tech Innovators Ltd",
      totalSubscriptionAmount: 2500000,
      currency: "NGN",
      totalLocations: 3,
      headquarters: "Lagos Main Office",
      locationVerificationCost: 750000,
      subscriptionDuration: "12 months",
      address: "123 Innovation Street, Ikeja",
      city: "Lagos",
      lga: "Ikeja",
      state: "Lagos",
      country: "Nigeria",
      branches: [
        {
          id: "b1",
          branchName: "Lagos Main Office",
          houseNumber: "123",
          streetName: "Innovation Street",
          cityRegion: "Ikeja",
          buildingType: "Commercial",
          lga: "Ikeja",
          state: "Lagos",
          country: "Nigeria",
          contactPerson: "John Doe",
          contactPosition: "Manager",
          contactEmail: "john@techinnovators.com",
          contactPhone: "+2348012345678",
        },
      ],
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    },
    {
      id: "ORG-002",
      serialNumber: 2,
      name: "Green Energy Solutions",
      totalSubscriptionAmount: 1800000,
      currency: "NGN",
      totalLocations: 2,
      headquarters: "Port Harcourt HQ",
      locationVerificationCost: 600000,
      subscriptionDuration: "24 months",
      address: "45 Energy Road, GRA",
      city: "Port Harcourt",
      lga: "Port Harcourt City",
      state: "Rivers",
      country: "Nigeria",
      branches: [
        {
          id: "b2",
          branchName: "Port Harcourt HQ",
          houseNumber: "45",
          streetName: "Energy Road",
          cityRegion: "GRA",
          buildingType: "Industrial",
          lga: "Port Harcourt City",
          state: "Rivers",
          country: "Nigeria",
          contactPerson: "Michael Brown",
          contactPosition: "Director",
          contactEmail: "michael@greenenergy.com",
          contactPhone: "+2348055555555",
        },
      ],
      createdAt: "2024-01-02",
      updatedAt: "2024-01-02",
    },
    {
      id: "ORG-003",
      serialNumber: 3,
      name: "MediCare Hospital Group",
      totalSubscriptionAmount: 3500000,
      currency: "NGN",
      totalLocations: 4,
      headquarters: "Abuja Central",
      locationVerificationCost: 950000,
      subscriptionDuration: "36 months",
      address: "78 Health Avenue, Wuse 2",
      city: "Abuja",
      lga: "Abuja Municipal",
      state: "FCT",
      country: "Nigeria",
      branches: [],
      createdAt: "2024-01-03",
      updatedAt: "2024-01-03",
    },
  ]

  // ... existing useEffect ...
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setOrganizations(sampleData)
        setFilteredOrganizations(sampleData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // ... existing filter and search ...
  useEffect(() => {
    if (!searchTerm) {
      setFilteredOrganizations(organizations)
    } else {
      const filtered = organizations.filter(
        (org) =>
          org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          org.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          org.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          org.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
          org.lga.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredOrganizations(filtered)
    }
  }, [searchTerm, organizations])

  // ... existing sorting ...
  const sortedOrganizations = useMemo(() => {
    if (!sortConfig) return filteredOrganizations

    return [...filteredOrganizations].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1
      }
      return 0
    })
  }, [filteredOrganizations, sortConfig])

  const requestSort = (key: keyof Organization) => {
    let direction: "asc" | "desc" = "asc"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  // ... existing formatCurrency ...
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // ... existing formatDate ...
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // ... existing exportToExcel ...
  const exportToExcel = () => {
    const headers = [
      "S/N",
      "Organization Name",
      "ID",
      "Total Subscription (₦)",
      "Currency",
      "Total Locations",
      "Headquarters",
      "Location Verification Cost",
      "Subscription Duration",
      "Address",
      "City",
      "LGA",
      "State",
      "Country",
      "Created Date",
      "Updated Date",
    ]

    const data = organizations.map((org) => [
      org.serialNumber,
      org.name,
      org.id,
      org.totalSubscriptionAmount,
      org.currency,
      org.totalLocations,
      org.headquarters,
      org.locationVerificationCost,
      org.subscriptionDuration,
      org.address,
      org.city,
      org.lga,
      org.state,
      org.country,
      formatDate(org.createdAt),
      formatDate(org.updatedAt),
    ])

    const csvContent = [headers.join(","), ...data.map((row) => row.join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "verified-badge-subscriptions.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // ... existing handleViewHeadquarters ...
  const handleViewHeadquarters = (org: Organization) => {
    setSelectedOrganization(org)
    setShowBranchModal(true)
  }

  const handleOpenApproval = (org: Organization) => {
    setOrganizationForApproval(org)
    setShowApprovalModal(true)
  }

  const handleEdit = (org: Organization) => {
    setOrganizationToEdit(org)
    setShowEditModal(true)
  }

  // ... existing handleDelete ...
  const handleDelete = (id: string) => {
    setOrganizationToDelete(id)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (organizationToDelete) {
      setOrganizations((orgs) => orgs.filter((org) => org.id !== organizationToDelete))
      setFilteredOrganizations((orgs) => orgs.filter((org) => org.id !== organizationToDelete))
      setShowDeleteModal(false)
      setOrganizationToDelete(null)
    }
  }

  // ... existing loading skeleton ...
  if (loading) {
    return (
      <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
        <div className="max-w-full mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-10 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((col) => (
                      <th key={col} className="py-3 px-4">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map((row) => (
                    <tr key={row} className="border-b border-gray-100">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((col) => (
                        <td key={col} className="py-4 px-4">
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
        
        /* Custom scrollbar for table */
        .table-container::-webkit-scrollbar {
          height: 8px;
          width: 8px;
        }
        
        .table-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        
        .table-container::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }
        
        .table-container::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
        
        /* Fix table header */
        .sticky-header {
          position: sticky;
          top: 0;
          background: #f9fafb;
          z-index: 10;
        }
      `}</style>

      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Verified Badge Subscriptions</h1>
          <p className="text-gray-600">Manage organization verified badge subscriptions</p>
        </div>

        {/* Search and Actions Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col md:flex-row gap-4 md:w-2/3">
              <div className="relative w-full md:w-1/2">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B]"
                  placeholder="Search organizations by name, ID, city, or state..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <button className="flex items-center justify-center border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-5 h-5 mr-2" />
                More Filters
              </button>
            </div>

            <div className="flex gap-3">
              <button
                className="flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                onClick={exportToExcel}
              >
                <Download className="w-5 h-5 mr-2" />
                Export to Excel
              </button>

              <button
                className="flex items-center justify-center bg-[#5D2A8B] text-white px-4 py-2 rounded-lg hover:bg-[#4a216d] transition-colors"
                onClick={() => (window.location.href = "/super-admin/subscription/verified-badge/create")}
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Subscription
              </button>
            </div>
          </div>
        </div>

        {/* Main Table with Horizontal Scroll */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div ref={tableContainerRef} className="table-container overflow-x-auto max-h-[600px]">
            <table className="w-full min-w-[1800px]">
              <thead className="sticky-header">
                <tr className="bg-gray-50 border-b border-gray-200">
                  {/* S/N */}
                  <th
                    className="py-3 px-4 text-left text-gray-600 font-medium cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                    onClick={() => requestSort("serialNumber")}
                  >
                    <div className="flex items-center">
                      S/N
                      <ChevronDown
                        className={`w-4 h-4 ml-1 transition-transform ${
                          sortConfig?.key === "serialNumber" && sortConfig.direction === "desc" ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </th>

                  {/* Organization Name */}
                  <th
                    className="py-3 px-4 text-left text-gray-600 font-medium cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                    onClick={() => requestSort("name")}
                  >
                    <div className="flex items-center">
                      Organization Name
                      <ChevronDown
                        className={`w-4 h-4 ml-1 transition-transform ${
                          sortConfig?.key === "name" && sortConfig.direction === "desc" ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </th>

                  {/* ID */}
                  <th className="py-3 px-4 text-left text-gray-600 font-medium whitespace-nowrap">
                    <div className="flex items-center">ID</div>
                  </th>

                  {/* Total Subscription */}
                  <th
                    className="py-3 px-4 text-left text-gray-600 font-medium cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                    onClick={() => requestSort("totalSubscriptionAmount")}
                  >
                    <div className="flex items-center">
                      Total Subscription
                      <ChevronDown
                        className={`w-4 h-4 ml-1 transition-transform ${
                          sortConfig?.key === "totalSubscriptionAmount" && sortConfig.direction === "desc"
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </div>
                  </th>

                  {/* Currency */}
                  <th className="py-3 px-4 text-left text-gray-600 font-medium whitespace-nowrap">
                    <div className="flex items-center">Currency</div>
                  </th>

                  {/* Total Locations */}
                  <th
                    className="py-3 px-4 text-left text-gray-600 font-medium cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                    onClick={() => requestSort("totalLocations")}
                  >
                    <div className="flex items-center">
                      Total Locations
                      <ChevronDown
                        className={`w-4 h-4 ml-1 transition-transform ${
                          sortConfig?.key === "totalLocations" && sortConfig.direction === "desc" ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </th>

                  {/* Headquarters */}
                  <th className="py-3 px-4 text-left text-gray-600 font-medium whitespace-nowrap">
                    <div className="flex items-center">Headquarters</div>
                  </th>

                  {/* Verification Cost */}
                  <th
                    className="py-3 px-4 text-left text-gray-600 font-medium cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                    onClick={() => requestSort("locationVerificationCost")}
                  >
                    <div className="flex items-center">
                      Verification Cost
                      <ChevronDown
                        className={`w-4 h-4 ml-1 transition-transform ${
                          sortConfig?.key === "locationVerificationCost" && sortConfig.direction === "desc"
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </div>
                  </th>

                  {/* Duration */}
                  <th className="py-3 px-4 text-left text-gray-600 font-medium whitespace-nowrap">
                    <div className="flex items-center">Duration</div>
                  </th>

                  {/* City */}
                  <th
                    className="py-3 px-4 text-left text-gray-600 font-medium cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                    onClick={() => requestSort("city")}
                  >
                    <div className="flex items-center">
                      City
                      <ChevronDown
                        className={`w-4 h-4 ml-1 transition-transform ${
                          sortConfig?.key === "city" && sortConfig.direction === "desc" ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </th>

                  {/* State */}
                  <th
                    className="py-3 px-4 text-left text-gray-600 font-medium cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                    onClick={() => requestSort("state")}
                  >
                    <div className="flex items-center">
                      State
                      <ChevronDown
                        className={`w-4 h-4 ml-1 transition-transform ${
                          sortConfig?.key === "state" && sortConfig.direction === "desc" ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </th>

                  {/* Verified Badge */}
                  <th className="py-3 px-4 text-left text-gray-600 font-medium whitespace-nowrap">
                    <div className="flex items-center">Verified Badge</div>
                  </th>

                  {/* Actions */}
                  <th className="py-3 px-4 text-left text-gray-600 font-medium whitespace-nowrap">
                    <div className="flex items-center">Actions</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedOrganizations.map((org) => (
                  <tr key={org.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 text-gray-900 font-medium text-sm">{org.serialNumber}</td>
                    <td className="py-4 px-4 text-gray-900 font-medium text-sm">{org.name}</td>
                    <td className="py-4 px-4 text-gray-600 text-sm">{org.id}</td>
                    <td className="py-4 px-4 text-gray-900 font-medium text-sm">
                      {formatCurrency(org.totalSubscriptionAmount, org.currency)}
                    </td>
                    <td className="py-4 px-4 text-gray-600 text-sm">{org.currency}</td>
                    <td className="py-4 px-4 text-gray-600 text-sm text-center">{org.totalLocations}</td>
                    <td className="py-4 px-4 text-gray-600 text-sm">{org.headquarters}</td>
                    <td className="py-4 px-4 text-gray-600 text-sm">
                      {formatCurrency(org.locationVerificationCost, org.currency)}
                    </td>
                    <td className="py-4 px-4 text-gray-600 text-sm">{org.subscriptionDuration}</td>
                    <td className="py-4 px-4 text-gray-600 text-sm">{org.city}</td>
                    <td className="py-4 px-4 text-gray-600 text-sm">{org.state}</td>

                    <td className="py-4 px-4 text-sm">
                      <button
                        onClick={() => handleOpenApproval(org)}
                        className="flex items-center justify-center gap-1 bg-[#5D2A8B] text-white px-3 py-1.5 rounded-lg hover:bg-[#4a216d] transition-colors text-xs font-medium whitespace-nowrap"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Verified Badge
                      </button>
                    </td>

                    <td className="py-4 px-4 text-sm">
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === org.id ? null : org.id)}
                          className="flex items-center justify-center gap-1 bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openMenuId === org.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                            <button
                              onClick={() => {
                                handleEdit(org)
                                setOpenMenuId(null)
                              }}
                              className="w-full text-left px-4 py-2.5 text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                handleDelete(org.id)
                                setOpenMenuId(null)
                              }}
                              className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <VerifiedBadgeApprovalModal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        organization={organizationForApproval}
      />

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-sm mx-4">
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Delete Organization</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this organization? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VerifiedBadgeSubscriptionPage

