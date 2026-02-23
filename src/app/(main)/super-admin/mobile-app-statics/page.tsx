
"use client";

import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Download, 
  Users, 
  Calendar,
  Globe,
  Apple,
  ChevronDown,
  Search,
  Filter,
  Download as DownloadIcon,
  Mail,
  User,
  MapPin,
  Clock,
  BarChart3,
  PieChart,
  TrendingUp
} from 'lucide-react';
import Image from 'next/image';

interface DownloadStat {
  id: string;
  name: string;
  email: string;
  country: string;
  downloadDate: string;
  clientType: 'organization' | 'user';
  platform: 'android' | 'ios';
}

export default function MobileAppStaticsPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [stats, setStats] = useState<DownloadStat[]>([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
  
    setTimeout(() => {
      const mockData: DownloadStat[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@company.com',
          country: 'United States',
          downloadDate: '2024-01-15 14:30',
          clientType: 'organization',
          platform: 'android'
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah.j@email.com',
          country: 'Canada',
          downloadDate: '2024-01-15 10:15',
          clientType: 'user',
          platform: 'ios'
        },
        {
          id: '3',
          name: 'Tech Corp Inc',
          email: 'contact@techcorp.com',
          country: 'United Kingdom',
          downloadDate: '2024-01-14 16:45',
          clientType: 'organization',
          platform: 'android'
        },
        {
          id: '4',
          name: 'Maria Garcia',
          email: 'maria.g@email.com',
          country: 'Spain',
          downloadDate: '2024-01-14 09:20',
          clientType: 'user',
          platform: 'ios'
        },
        {
          id: '5',
          name: 'Alice Wong',
          email: 'alice.w@email.com',
          country: 'Singapore',
          downloadDate: '2024-01-13 11:30',
          clientType: 'user',
          platform: 'android'
        },
        {
          id: '6',
          name: 'Global Solutions Ltd',
          email: 'info@globalsolutions.com',
          country: 'Australia',
          downloadDate: '2024-01-13 08:45',
          clientType: 'organization',
          platform: 'ios'
        },
        {
          id: '7',
          name: 'Robert Chen',
          email: 'robert.c@email.com',
          country: 'China',
          downloadDate: '2024-01-12 13:15',
          clientType: 'user',
          platform: 'android'
        },
        {
          id: '8',
          name: 'Innovate Tech',
          email: 'hello@innovatetech.com',
          country: 'Germany',
          downloadDate: '2024-01-12 10:30',
          clientType: 'organization',
          platform: 'ios'
        }
      ];
      setStats(mockData);
      setLoading(false);
    }, 1000);
  }, []);


  const totalDownloads = stats.length;
  const androidDownloads = stats.filter(s => s.platform === 'android').length;
  const iosDownloads = stats.filter(s => s.platform === 'ios').length;
  const organizationDownloads = stats.filter(s => s.clientType === 'organization').length;
  const userDownloads = stats.filter(s => s.clientType === 'user').length;


  const uniqueCountries = [...new Set(stats.map(s => s.country))];


  const filteredStats = stats.filter(stat => {
    const matchesSearch = 
      stat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stat.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stat.country.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || stat.clientType === filterType;
    
    return matchesSearch && matchesFilter;
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        .inter { font-family: 'Inter', sans-serif; }
      `}</style>

      <div className="ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen">
      
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Smartphone className="w-6 h-6 text-purple-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 inter">
              Mobile App Statistics
            </h1>
          </div>
          <p className="text-gray-600 inter">
            Track and analyze mobile app downloads and user demographics
          </p>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Download className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                Lifetime
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 inter mb-1">
              {totalDownloads.toLocaleString()}
            </h3>
            <p className="text-sm text-gray-600 inter">Total Downloads</p>
          </div>

 
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                {((androidDownloads / totalDownloads) * 100).toFixed(1)}%
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 inter mb-1">
              {androidDownloads.toLocaleString()}
            </h3>
            <p className="text-sm text-gray-600 inter">Android Downloads</p>
          </div>

        
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Apple className="w-5 h-5 text-gray-700" />
              </div>
              <span className="text-xs font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded">
                {((iosDownloads / totalDownloads) * 100).toFixed(1)}%
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 inter mb-1">
              {iosDownloads.toLocaleString()}
            </h3>
            <p className="text-sm text-gray-600 inter">iOS Downloads</p>
          </div>

       
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Globe className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">
                Countries
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 inter mb-1">
              {uniqueCountries.length}
            </h3>
            <p className="text-sm text-gray-600 inter">Geographic Reach</p>
          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
         
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 rounded-xl">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 inter mb-1">Organizations</p>
                <h3 className="text-2xl font-bold text-gray-900 inter">
                  {organizationDownloads.toLocaleString()}
                </h3>
                <p className="text-xs text-gray-500 inter mt-1">
                  {((organizationDownloads / totalDownloads) * 100).toFixed(1)}% of total downloads
                </p>
              </div>
            </div>
          </div>

        
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <User className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 inter mb-1">Individual Users</p>
                <h3 className="text-2xl font-bold text-gray-900 inter">
                  {userDownloads.toLocaleString()}
                </h3>
                <p className="text-xs text-gray-500 inter mt-1">
                  {((userDownloads / totalDownloads) * 100).toFixed(1)}% of total downloads
                </p>
              </div>
            </div>
          </div>
        </div>

      
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-lg font-semibold text-gray-900 inter">
                Download History
              </h2>
              
              <div className="flex flex-col md:flex-row gap-3">
               
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, email, country..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm inter focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full md:w-64"
                  />
                </div>

               
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm inter focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Clients</option>
                  <option value="organization">Organizations</option>
                  <option value="user">Individual Users</option>
                </select>

                
                <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm inter">
                  <DownloadIcon className="w-4 h-4" />
                  Export Data
                </button>
              </div>
            </div>
          </div>

       
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider inter">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider inter">
                      Email Address
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider inter">
                      Country
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider inter">
                      Date & Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider inter">
                      Client Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider inter">
                      Platform
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredStats.map((stat) => (
                    <tr key={stat.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-50 rounded-full flex items-center justify-center mr-3">
                            <span className="text-sm font-medium text-purple-600 inter">
                              {stat.name.charAt(0)}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900 inter">
                            {stat.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 inter">{stat.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 inter">{stat.country}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 inter">{formatDate(stat.downloadDate)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium inter
                          ${stat.clientType === 'organization' 
                            ? 'bg-indigo-100 text-indigo-800' 
                            : 'bg-orange-100 text-orange-800'
                          }`}>
                          {stat.clientType === 'organization' ? 'Organization' : 'Individual User'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {stat.platform === 'android' ? (
                            <>
                              {/* <Android className="w-4 h-4 text-green-600" /> */}
                              <span className="text-sm text-gray-600 inter">Android</span>
                            </>
                          ) : (
                            <>
                              <Apple className="w-4 h-4 text-gray-700" />
                              <span className="text-sm text-gray-600 inter">iOS</span>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {!loading && filteredStats.length === 0 && (
              <div className="text-center py-20">
                <Download className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 inter mb-1">No downloads found</h3>
                <p className="text-sm text-gray-500 inter">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>

       
          {!loading && filteredStats.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 inter">
                  Showing <span className="font-medium">{filteredStats.length}</span> of{' '}
                  <span className="font-medium">{stats.length}</span> downloads
                </p>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-100 inter">
                    Previous
                  </button>
                  <button className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 inter">
                    1
                  </button>
                  <button className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-100 inter">
                    2
                  </button>
                  <button className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-100 inter">
                    3
                  </button>
                  <button className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-100 inter">
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

       
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 inter mb-4">Top Download Countries</h3>
            <div className="space-y-3">
              {uniqueCountries.slice(0, 5).map((country, index) => {
                const count = stats.filter(s => s.country === country).length;
                return (
                  <div key={country} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 inter">{country}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-900 inter">{count}</span>
                      <span className="text-xs text-gray-500 inter w-12">
                        ({((count / totalDownloads) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 inter mb-4">Platform Distribution</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600 inter">Android</span>
                  <span className="text-sm font-medium text-gray-900 inter">{androidDownloads}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${(androidDownloads / totalDownloads) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600 inter">iOS</span>
                  <span className="text-sm font-medium text-gray-900 inter">{iosDownloads}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gray-700 h-2 rounded-full" 
                    style={{ width: `${(iosDownloads / totalDownloads) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 inter mb-4">Client Type Distribution</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600 inter">Organizations</span>
                  <span className="text-sm font-medium text-gray-900 inter">{organizationDownloads}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full" 
                    style={{ width: `${(organizationDownloads / totalDownloads) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600 inter">Individual Users</span>
                  <span className="text-sm font-medium text-gray-900 inter">{userDownloads}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-600 h-2 rounded-full" 
                    style={{ width: `${(userDownloads / totalDownloads) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}