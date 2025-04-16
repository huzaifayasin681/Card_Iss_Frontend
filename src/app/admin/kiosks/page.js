'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Location icon component
const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-20">
    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function KiosksManagement() {
  const [kiosks, setKiosks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddingKiosk, setIsAddingKiosk] = useState(false);
  const [newKiosk, setNewKiosk] = useState({
    location: '',
    address: '',
    hours: '',
    phone: ''
  });
  const [editingKiosk, setEditingKiosk] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();
  
  useEffect(() => {
    const fetchKiosks = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          router.push('/admin/login');
          return;
        }
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/admin/kiosks`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setKiosks(data.kiosks);
        } else {
          localStorage.removeItem('adminToken');
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Error fetching kiosks:', error);
      } finally {
        // Add a slight delay to show loading animation
        setTimeout(() => setLoading(false), 800);
      }
    };
    
    fetchKiosks();
  }, [router]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingKiosk) {
      setEditingKiosk({
        ...editingKiosk,
        [name]: value
      });
    } else {
      setNewKiosk({
        ...newKiosk,
        [name]: value
      });
    }
  };
  
  const handleAddKiosk = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!newKiosk.location || !newKiosk.address || !newKiosk.hours) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      const token = localStorage.getItem('adminToken');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${apiUrl}/admin/kiosks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newKiosk)
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Add the new kiosk to the list
        setKiosks([...kiosks, data.kiosk]);
        
        // Reset form and close it
        setNewKiosk({
          location: '',
          address: '',
          hours: '',
          phone: ''
        });
        setIsAddingKiosk(false);
        
        // Show success message
        setSuccessMessage('Kiosk added successfully');
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
      } else {
        alert('Failed to add kiosk');
      }
    } catch (error) {
      console.error('Error adding kiosk:', error);
      alert('An error occurred while adding kiosk');
    }
  };
  
  const handleUpdateKiosk = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!editingKiosk.location || !editingKiosk.address || !editingKiosk.hours) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      const token = localStorage.getItem('adminToken');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${apiUrl}/admin/kiosks/${editingKiosk.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingKiosk)
      });
      
      if (response.ok) {
        // Update the kiosk in the list
        setKiosks(kiosks.map(kiosk => 
          kiosk.id === editingKiosk.id ? editingKiosk : kiosk
        ));
        
        // Reset form and close it
        setEditingKiosk(null);
        
        // Show success message
        setSuccessMessage('Kiosk updated successfully');
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
      } else {
        alert('Failed to update kiosk');
      }
    } catch (error) {
      console.error('Error updating kiosk:', error);
      alert('An error occurred while updating kiosk');
    }
  };
  
  const handleDeleteKiosk = async (kioskId) => {
    if (!window.confirm('Are you sure you want to delete this kiosk?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('adminToken');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${apiUrl}/admin/kiosks/${kioskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        // Remove the kiosk from the list
        setKiosks(kiosks.filter(kiosk => kiosk.id !== kioskId));
        
        // Show success message
        setSuccessMessage('Kiosk deleted successfully');
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
      } else {
        alert('Failed to delete kiosk');
      }
    } catch (error) {
      console.error('Error deleting kiosk:', error);
      alert('An error occurred while deleting kiosk');
    }
  };
  
  // Filter kiosks based on search term
  const filteredKiosks = kiosks.filter(kiosk => 
    searchTerm === '' || 
    kiosk.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kiosk.address.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="space-y-6">
      {/* Success notification */}
      {showSuccessAlert && (
        <div className="fixed top-4 right-4 z-50 bg-green-50 border-l-4 border-green-400 p-4 rounded shadow-md transition-opacity duration-500 opacity-100">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm leading-5 text-green-800">
                {successMessage}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-3">
                <LocationIcon />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Kiosk Management</h3>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search kiosks..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
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
              
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 whitespace-nowrap"
                onClick={() => {
                  setIsAddingKiosk(true);
                  setEditingKiosk(null);
                }}
              >
                Add New Kiosk
              </button>
            </div>
          </div>
        </div>
        
        {/* Add/Edit Kiosk Form */}
        {(isAddingKiosk || editingKiosk) && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h4 className="text-lg font-medium text-gray-800 mb-4">
              {editingKiosk ? 'Edit Kiosk' : 'Add New Kiosk'}
            </h4>
            
            <form onSubmit={editingKiosk ? handleUpdateKiosk : handleAddKiosk}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={editingKiosk ? editingKiosk.location : newKiosk.location}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={editingKiosk ? editingKiosk.phone || '' : newKiosk.phone}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="(Optional)"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={editingKiosk ? editingKiosk.address : newKiosk.address}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="hours" className="block text-sm font-medium text-gray-700 mb-1">
                    Operating Hours <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="hours"
                    name="hours"
                    value={editingKiosk ? editingKiosk.hours : newKiosk.hours}
                    onChange={handleInputChange}
                    placeholder="e.g. Mon-Fri: 9AM-5PM, Sat: 10AM-2PM"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => {
                    setIsAddingKiosk(false);
                    setEditingKiosk(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {editingKiosk ? 'Update Kiosk' : 'Add Kiosk'}
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Kiosks Grid View */}
        <div className="p-6">
          {filteredKiosks.length === 0 ? (
            <div className="py-8 text-center">
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
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No kiosks found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'No kiosks match your search criteria.' : 'Get started by adding a new kiosk.'}
              </p>
              <div className="mt-6">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setIsAddingKiosk(true);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add New Kiosk
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredKiosks.map(kiosk => (
                <div key={kiosk.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-5 border-b border-gray-200 bg-indigo-50 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-indigo-900 truncate">{kiosk.location}</h3>
                    <div className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                      ID: {kiosk.id}
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <div className="mb-4">
                      <div className="flex items-start">
                        <svg className="h-5 w-5 text-gray-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-gray-700">{kiosk.address}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-start">
                        <svg className="h-5 w-5 text-gray-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-gray-700">{kiosk.hours}</p>
                      </div>
                    </div>
                    
                    {kiosk.phone && (
                      <div className="mb-4">
                        <div className="flex items-start">
                          <svg className="h-5 w-5 text-gray-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <p className="text-gray-700">{kiosk.phone}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-end space-x-2 mt-4">
                      <button
                        onClick={() => setEditingKiosk(kiosk)}
                        className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteKiosk(kiosk.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}