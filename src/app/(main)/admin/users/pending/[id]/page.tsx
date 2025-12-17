"use client";

import React from "react";
import { CheckCircle, XCircle, ArrowLeft, Phone, Users } from "lucide-react";
import { useRouter } from "next/navigation";

interface PendingUser {
  sn: number;
  name: string;
  usersId: string;
  orgCustomUsersId: string;
  emailAddress: string;
  phoneNumber?: string;
}

const pendingUsers: PendingUser[] = [
  {
    sn: 1,
    name: "John Doe",
    usersId: "USR-003",
    orgCustomUsersId: "ORG-00201",
    emailAddress: "john.doe@example.com",
    phoneNumber: "+2348012345678",
  },
  {
    sn: 2,
    name: "Jane Smith",
    usersId: "USR-006",
    orgCustomUsersId: "ORG-00202",
    emailAddress: "jane.smith@example.com",
    phoneNumber: "+2348098765432",
  },
];

const PendingUserPage = () => {
  const router = useRouter();

  return (
    <div className="manrope">
      <div className="ml-0 md:ml-[350px] pt-48 md:pt-40 p-4 md:p-8 transition-all duration-300">
        
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="mb-4 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            Back to Users
          </button>

          <h1 className="text-2xl font-bold text-gray-800">
            Pending Users
          </h1>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="min-w-full divide-y divide-gray-200">
              
              {/* Table Head */}
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    S/N
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Org. Custom User ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone Number
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Users className="w-12 h-12 mb-4 text-gray-300" />
                        <p className="text-lg font-medium">No pending users</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  pendingUsers.map((user) => (
                    <tr
                      key={user.sn}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {user.sn}
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {user.name}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-500">
                        {user.usersId}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-900">
                        {user.orgCustomUsersId}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-900">
                        {user.emailAddress}
                      </td>

                      <td className="px-6 py-4">
                        {user.phoneNumber ? (
                          <div className="flex items-center gap-2 text-sm text-gray-900">
                            <Phone className="w-4 h-4 text-gray-400" />
                            {user.phoneNumber}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">
                            Not provided
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-4">
                          <button className="flex items-center gap-1 text-green-600 hover:underline text-sm">
                            <CheckCircle size={18} />
                            Approve
                          </button>
                          <button className="flex items-center gap-1 text-red-600 hover:underline text-sm">
                            <XCircle size={18} />
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingUserPage;
