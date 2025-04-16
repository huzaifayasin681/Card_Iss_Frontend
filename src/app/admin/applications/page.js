'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Status badge component
const StatusBadge = ({ status }) => {
  const getStatusClasses = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(status)}`}>
      {status}
    </span>
  );
};

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-20">
    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function ApplicationsManagement() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeApplication, setActiveApplication] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showStatusUpdateSuccess, setShowStatusUpdateSuccess] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          router.push('/admin/login');
          return;
        }
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/admin/applications`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setApplications(data.applications);
        } else {
          localStorage.removeItem('adminToken');
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        // Add a slight delay to show loading animation
        setTimeout(() => setLoading(false), 800);
      }
    };
    
    fetchApplications();
  }, [router]);
  
  const updateApplicationStatus = async (applicationId, status) => {
    setUpdatingStatus(true);
    try {
      const token = localStorage.getItem('adminToken');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${apiUrl}/admin/applications/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        // Update the applications list
        setApplications(applications.map(app => 
          app.id === applicationId ? { ...app, status } : app
        ));
        setShowStatusUpdateSuccess(true);
        setTimeout(() => setShowStatusUpdateSuccess(false), 3000);
      } else {
        alert('Failed to update application status');
      }
    } catch (error) {
      console.error('Error updating application:', error);
      alert('An error occurred while updating application');
    } finally {
      setUpdatingStatus(false);
    }
  };
  
  // Filter applications by status and search term
  const filteredApplications = applications.filter(app => {
    const statusMatch = statusFilter === 'all' || app.status === statusFilter;
    const searchMatch = 
      searchTerm === '' || 
      app.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toString().includes(searchTerm) ||
      app.card_number.includes(searchTerm);
    return statusMatch && searchMatch;
  });
  
  const viewApplicationDetails = (app) => {
    setActiveApplication(app);
  };
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="space-y-6">
      {/* Status update success message */}
      {showStatusUpdateSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-50 border-l-4 border-green-400 p-4 rounded shadow-md transition-opacity duration-500 opacity-100">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm leading-5 text-green-800">
                Application status updated successfully
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Application detail modal */}
      {activeApplication && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-semibold text-gray-800">Application Details</h3>
              <button 
                onClick={() => setActiveApplication(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Application ID</p>
                  <p className="text-lg font-medium">{activeApplication.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Current Status</p>
                  <div className="mt-1">
                    <StatusBadge status={activeApplication.status} />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">User</p>
                  <p className="text-lg font-medium">{activeApplication.user_name}</p>
                  <p className="text-sm text-gray-500">ID: {activeApplication.user_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date Submitted</p>
                  <p className="text-lg font-medium">
                    {new Date(activeApplication.created_at).toLocaleDateString(undefined, { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Card Details</p>
                  <p className="text-lg font-medium capitalize">{activeApplication.card_type} Card</p>
                  <p className="text-sm text-gray-500">Number: **** {activeApplication.card_number.slice(-4)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Request Type</p>
                  <p className="text-lg font-medium capitalize">{activeApplication.request_type}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-md font-medium text-gray-800 mb-2">Update Status</h4>
                <div className="flex items-center">
                  <div className="space-x-2">
                    {activeApplication.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => updateApplicationStatus(activeApplication.id, 'approved')}
                          disabled={updatingStatus}
                          className="px-3 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateApplicationStatus(activeApplication.id, 'rejected')}
                          disabled={updatingStatus}
                          className="px-3 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <select
                        className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={activeApplication.status}
                        onChange={(e) => updateApplicationStatus(activeApplication.id, e.target.value)}
                        disabled={updatingStatus}
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                      </select>
                    )}
                    
                    {updatingStatus && (
                      <div className="inline-flex items-center ml-2">
                        <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                        <span className="text-sm text-gray-600">Updating...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <h3 className="text-lg font-semibold text-gray-800">Application Management</h3>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              
              <select
                id="statusFilter"
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Card Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplications.map(app => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {app.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-800 font-medium text-sm">
                          {app.user_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{app.user_name}</div>
                        <div className="text-xs text-gray-500">ID: {app.user_id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">{app.card_type} Card</div>
                    <div className="text-xs text-gray-500 font-mono">**** {app.card_number.slice(-4)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">
                    {app.request_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(app.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => viewApplicationDetails(app)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View
                      </button>
                      
                      {app.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateApplicationStatus(app.id, 'approved')}
                            className="text-green-600 hover:text-green-900"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateApplicationStatus(app.id, 'rejected')}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredApplications.length === 0 && (
          <div className="px-6 py-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
            <p className="mt-1 text-sm text-gray-500">
              No applications match your current filter criteria.
            </p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setSearchTerm('');
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}