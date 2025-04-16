'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Dashboard icons
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const CardsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const ApplicationsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const SuccessRateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    <p className="mt-4 text-lg font-medium text-indigo-700">Loading dashboard data...</p>
  </div>
);

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          router.push('/admin/login');
          return;
        }
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/admin/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        } else {
          localStorage.removeItem('adminToken');
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        // Add a slight delay to show loading animation
        setTimeout(() => setLoading(false), 800);
      }
    };
    
    fetchDashboardData();
  }, [router]);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!dashboardData) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-medium text-gray-900">Failed to load dashboard data</h3>
        <p className="mt-2 text-gray-600">Please check your connection and try again.</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }
  
  // Calculate application success rate
  const successRate = dashboardData.status_distribution.approved ? 
    Math.round((dashboardData.status_distribution.approved / 
      Object.values(dashboardData.status_distribution).reduce((a, b) => a + b, 0)) * 100) : 0;
  
  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Welcome to your admin dashboard</h1>
        <p className="text-gray-600 mt-1">Here's what's happening with your card platform today.</p>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-transform hover:transform hover:scale-105">
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
                <UsersIcon />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-3xl font-bold text-gray-800">{dashboardData.total_users.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-indigo-50 px-6 py-2">
            <div className="text-xs text-indigo-700">Active platform users</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-transform hover:transform hover:scale-105">
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                <CardsIcon />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Cards</p>
                <p className="text-3xl font-bold text-gray-800">{dashboardData.total_cards.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 px-6 py-2">
            <div className="text-xs text-purple-700">All issued cards</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-transform hover:transform hover:scale-105">
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-amber-100 text-amber-600 mr-4">
                <ApplicationsIcon />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Applications</p>
                <p className="text-3xl font-bold text-amber-600">{dashboardData.pending_applications}</p>
              </div>
            </div>
          </div>
          <div className="bg-amber-50 px-6 py-2">
            <div className="text-xs text-amber-700">Awaiting review</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-transform hover:transform hover:scale-105">
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <SuccessRateIcon />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Success Rate</p>
                <p className="text-3xl font-bold text-green-600">{successRate}%</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 px-6 py-2">
            <div className="text-xs text-green-700">Application approvals</div>
          </div>
        </div>
      </div>
      
      {/* Status distribution */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Application Status Distribution</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(dashboardData.status_distribution).map(([status, count]) => {
            const getStatusColor = (status) => {
              switch(status) {
                case 'approved': return 'bg-green-100 text-green-800';
                case 'rejected': return 'bg-red-100 text-red-800';
                case 'pending': return 'bg-amber-100 text-amber-800';
                case 'processing': return 'bg-blue-100 text-blue-800';
                default: return 'bg-gray-100 text-gray-800';
              }
            };
            
            const getStatusBgStyle = (status) => {
              switch(status) {
                case 'approved': return 'bg-gradient-to-r from-green-50 to-green-100';
                case 'rejected': return 'bg-gradient-to-r from-red-50 to-red-100';
                case 'pending': return 'bg-gradient-to-r from-amber-50 to-amber-100';
                case 'processing': return 'bg-gradient-to-r from-blue-50 to-blue-100';
                default: return 'bg-gradient-to-r from-gray-50 to-gray-100';
              }
            };
            
            return (
              <div 
                key={status} 
                className={`${getStatusBgStyle(status)} rounded-lg p-4 shadow-sm`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                    <p className="text-2xl font-bold mt-2">{count}</p>
                  </div>
                  <div className="p-2 rounded-full bg-white">
                    <div className={`w-3 h-3 rounded-full ${
                      status === 'approved' ? 'bg-green-500' :
                      status === 'rejected' ? 'bg-red-500' :
                      status === 'pending' ? 'bg-amber-500' :
                      'bg-blue-500'
                    }`}></div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {status === 'approved' ? 'Approved applications' :
                   status === 'rejected' ? 'Rejected applications' :
                   status === 'pending' ? 'Waiting for review' :
                   'In processing state'}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Recent applications */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Recent Applications</h3>
            <button 
              onClick={() => router.push('/admin/applications')}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              View all
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dashboardData.recent_applications.map(app => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-800 font-medium text-sm">
                          {app.user_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{app.user_name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">{app.request_type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      app.status === 'approved' ? 'bg-green-100 text-green-800' :
                      app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      app.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(app.created_at).toLocaleDateString(undefined, { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {dashboardData.recent_applications.length === 0 && (
          <div className="px-6 py-4 text-center text-gray-500">
            No recent applications found.
          </div>
        )}
      </div>
    </div>
  );
}