'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Placeholder for KioskMap component
// Since we don't have the actual implementation, I'll create a basic version
const KioskMap = ({ kiosks }) => {
  return (
    <div className="w-full h-96 bg-gray-100 rounded-xl overflow-hidden shadow-md relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <p className="mt-4 text-gray-600">Interactive map would be displayed here</p>
        </div>
      </div>
    </div>
  );
};

// Location icon component
const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-50 to-purple-50">
    <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
    <p className="mt-4 text-lg font-medium text-amber-700">Finding kiosks near you...</p>
  </div>
);

export default function Kiosks() {
  const router = useRouter();
  const [kiosks, setKiosks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }
    
    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
    
    // Fetch kiosk locations
    const fetchKiosks = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/kiosks`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setKiosks(data.kiosks);
        } else {
          if (response.status === 401) {
            localStorage.removeItem('token');
            router.push('/');
          }
        }
      } catch (error) {
        console.error('Error fetching kiosks:', error);
      } finally {
        // Add a slight delay to make the loading animation noticeable
        setTimeout(() => setLoading(false), 800);
      }
    };

    fetchKiosks();
  }, [router]);

  // Filter kiosks based on search query
  const filteredKiosks = kiosks.filter(kiosk => 
    kiosk.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    kiosk.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/dashboard" className="text-gray-500 hover:text-amber-600">Dashboard</Link>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-2 text-amber-600 font-medium">Kiosks</span>
              </li>
            </ol>
          </nav>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="p-6 sm:p-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-amber-100 text-amber-600 mr-4">
                  <LocationIcon />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">Find Nearby Kiosks</h1>
                  <p className="text-gray-600">Locate the nearest kiosk for card pickup and services</p>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-0">
                <Link 
                  href="/dashboard" 
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="pl-10 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Search by location or address"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="mb-8">
              <KioskMap kiosks={filteredKiosks} userLocation={userLocation} />
            </div>
            
            {userLocation && (
              <div className="mb-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-amber-700">
                      Your current location has been detected. The map shows kiosks closest to you.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 sm:p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Available Kiosk Locations
            </h2>
            
            {filteredKiosks.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <p className="mt-4 text-gray-600 text-lg">No kiosks found matching your search criteria.</p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="mt-4 px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition duration-300"
                >
                  Show All Kiosks
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredKiosks.map(kiosk => (
                  <div 
                    key={kiosk.id} 
                    className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
                  >
                    <div className="p-5 border-b border-gray-200 bg-gray-50">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {kiosk.location}
                      </h3>
                    </div>
                    
                    <div className="p-5">
                      <div className="mb-3">
                        <div className="text-sm text-gray-500 mb-1">Address</div>
                        <div className="text-gray-700">{kiosk.address}</div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="text-sm text-gray-500 mb-1">Operating Hours</div>
                        <div className="text-gray-700">{kiosk.hours}</div>
                      </div>
                      
                      {kiosk.phone && (
                        <div className="mb-3">
                          <div className="text-sm text-gray-500 mb-1">Phone</div>
                          <div className="text-gray-700">{kiosk.phone}</div>
                        </div>
                      )}
                      
                      <button 
                        className="mt-3 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-amber-700 bg-amber-100 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Get Directions
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}