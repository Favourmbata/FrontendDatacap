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

export default function AllPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

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

    setFilteredPayments(result);
  }, [searchTerm, payments]);

  return (
    <div className="space-y-6 p-4 max-w-full overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">All Payments</h1>
          <p className="text-muted-foreground text-sm">
            View all subscription payments
          </p>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-3 w-3" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 pb-2">
            <CardTitle className="text-xs font-medium">Total Revenue</CardTitle>
            <CreditCard className="h-3 w-3 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="text-lg font-bold">
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
        <Card className="p-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 pb-2">
            <CardTitle className="text-xs font-medium">Total Transactions</CardTitle>
            <CreditCard className="h-3 w-3 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="text-lg font-bold">{payments.length}</div>
            <p className="text-xs text-muted-foreground">
              All payment records
            </p>
          </CardContent>
        </Card>
        <Card className="p-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 pb-2">
            <CardTitle className="text-xs font-medium">Completed</CardTitle>
            <CreditCard className="h-3 w-3 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="text-lg font-bold">{payments.filter(p => p.status === 'completed').length}</div>
            <p className="text-xs text-muted-foreground">
              Successful payments
            </p>
          </CardContent>
        </Card>
        <Card className="p-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 pb-2">
            <CardTitle className="text-xs font-medium">Pending</CardTitle>
            <CreditCard className="h-3 w-3 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="text-lg font-bold">{payments.filter(p => p.status === 'pending').length}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting confirmation
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2">
          <button className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-sm">
            All Payments
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3 w-3 text-gray-400" />
            <input
              type="search"
              placeholder="Search payments..."
              className="pl-7 pr-3 py-1.5 border rounded-lg w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <Card className="border">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Transaction ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">User</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">Package</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Amount</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-xs font-medium text-gray-900">
                        <div className="truncate" title={payment.transactionId}>
                          {payment.transactionId}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center min-w-0">
                          <div className="flex-shrink-0 h-8 w-8">
                            <User className="h-3 w-3 text-gray-400" />
                          </div>
                          <div className="ml-3 min-w-0">
                            <div className="text-xs font-medium text-gray-900 truncate">{payment.userName}</div>
                            <div className="text-xs text-gray-500 truncate">{payment.userEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <Package className="h-3 w-3 text-gray-400 flex-shrink-0" />
                          <span className="ml-2 text-xs text-gray-900 truncate" title={payment.packageName}>
                            {payment.packageName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                        {formatCurrency(payment.amount, payment.currency)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                        {formatDate(payment.transactionDate)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900 p-1">
                          <Eye className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
