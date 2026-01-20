"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { 
  CreditCard, 
  Calendar, 
  User, 
  Package, 
  Search,
  Download,
  Eye,
  Filter
} from "lucide-react";

// Mock data for payments
const mockPayments = [
  {
    id: "pay_123456789",
    transactionId: "trx_987654321",
    userId: "user_abc123",
    userEmail: "john@example.com",
    userName: "John Doe",
    packageName: "Premium Business Package",
    amount: 25000,
    currency: "NGN",
    status: "completed" as const,
    paymentMethod: "card",
    transactionDate: "2024-01-15T10:30:00.000Z",
    expiryDate: "2025-01-15T10:30:00.000Z",
  },
  {
    id: "pay_987654321",
    transactionId: "trx_123456789",
    userId: "user_def456",
    userEmail: "jane@example.com",
    userName: "Jane Smith",
    packageName: "Basic Business Package",
    amount: 15000,
    currency: "NGN",
    status: "pending" as const,
    paymentMethod: "bank_transfer",
    transactionDate: "2024-01-14T09:15:00.000Z",
    expiryDate: "2025-01-14T09:15:00.000Z",
  },
  {
    id: "pay_456789123",
    transactionId: "trx_321654987",
    userId: "user_ghi789",
    userEmail: "bob@example.com",
    userName: "Bob Johnson",
    packageName: "Enterprise Package",
    amount: 50000,
    currency: "NGN",
    status: "failed" as const,
    paymentMethod: "card",
    transactionDate: "2024-01-13T14:45:00.000Z",
    expiryDate: null,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    // In a real app, this would fetch from an API
    setPayments(mockPayments);
    setFilteredPayments(mockPayments);
  }, []);

  useEffect(() => {
    let result = payments;

    if (searchTerm) {
      result = result.filter(payment => 
        payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.packageName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      result = result.filter(payment => payment.status === statusFilter);
    }

    setFilteredPayments(result);
  }, [searchTerm, statusFilter, payments]);

  const completedPayments = payments.filter(p => p.status === 'completed');
  const pendingPayments = payments.filter(p => p.status === 'pending');
  const failedPayments = payments.filter(p => p.status === 'failed');

  return (
    <div className="p-4 md:p-6 max-w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Manage and monitor all subscription payments
          </p>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                payments.reduce((sum, p) => sum + (p.status === 'completed' ? p.amount : 0), 0),
                'NGN'
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              From completed transactions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payments.length}</div>
            <p className="text-xs text-muted-foreground">
              All payment records
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedPayments.length}</div>
            <p className="text-xs text-muted-foreground">
              Successful payments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPayments.length}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting confirmation
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex space-x-2">
            <button 
              className={`px-4 py-2 rounded-lg ${statusFilter === "all" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-700"}`}
              onClick={() => setStatusFilter("all")}
            >
              All Payments
            </button>
            <button 
              className={`px-4 py-2 rounded-lg ${statusFilter === "completed" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"}`}
              onClick={() => setStatusFilter("completed")}
            >
              Completed
            </button>
            <button 
              className={`px-4 py-2 rounded-lg ${statusFilter === "pending" ? "bg-yellow-600 text-white" : "bg-gray-200 text-gray-700"}`}
              onClick={() => setStatusFilter("pending")}
            >
              Pending
            </button>
            <button 
              className={`px-4 py-2 rounded-lg ${statusFilter === "failed" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700"}`}
              onClick={() => setStatusFilter("failed")}
            >
              Failed
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search payments..."
                className="pl-8 pr-4 py-2 border rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payment.transactionId}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <User className="h-4 w-4 text-gray-400" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{payment.userName}</div>
                            <div className="text-sm text-gray-500">{payment.userEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Package className="h-4 w-4 text-gray-400" />
                          <span className="ml-2 text-sm text-gray-900">{payment.packageName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(payment.amount, payment.currency)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(payment.transactionDate)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900">
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
        </div>
    </div>
  );
}