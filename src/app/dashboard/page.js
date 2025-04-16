'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Import icons
const CreditCardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const ReplaceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-50 to-purple-50">
    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    <p className="mt-4 text-lg font-medium text-indigo-700">Loading your dashboard...</p>
  </div>
);

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }

    // Fetch user data
    const fetchUserData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/cards/status`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setCards(data.cards);
        } else {
          localStorage.removeItem('token');
          router.push('/');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        // Add a slight delay to make the loading animation noticeable
        setTimeout(() => setLoading(false), 800);
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  // Function to get card design classes
  const getCardDesignClasses = (design) => {
    switch (design) {
      case 'blue':
        return 'bg-gradient-to-r from-blue-500 to-indigo-600';
      case 'green':
        return 'bg-gradient-to-r from-emerald-400 to-teal-500';
      case 'gold':
        return 'bg-gradient-to-r from-amber-400 to-yellow-500';
      case 'platinum':
        return 'bg-gradient-to-r from-slate-600 to-slate-800';
      default:
        return 'bg-gradient-to-r from-purple-500 to-indigo-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      
            
           

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome section with user info */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Welcome back, <span className="text-indigo-600">{user?.name}</span>
              </h1>
              <p className="mt-1 text-gray-500">Manage your cards and account information</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                Last login: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick action cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div 
            onClick={() => router.push('/apply')} 
            className="bg-white overflow-hidden rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition duration-300 cursor-pointer group"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4 group-hover:bg-indigo-600 group-hover:text-white transition duration-300">
                  <CreditCardIcon />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition duration-300">Apply for New Card</h2>
                  <p className="text-gray-500">Request with personalized options</p>
                </div>
              </div>
            </div>
            <div className="h-1 w-full bg-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </div>
          
          <div 
            onClick={() => router.push('/replace')} 
            className="bg-white overflow-hidden rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition duration-300 cursor-pointer group"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-emerald-100 text-emerald-600 mr-4 group-hover:bg-emerald-600 group-hover:text-white transition duration-300">
                  <ReplaceIcon />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 group-hover:text-emerald-600 transition duration-300">Replace Card</h2>
                  <p className="text-gray-500">For lost or damaged cards</p>
                </div>
              </div>
            </div>
            <div className="h-1 w-full bg-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </div>
          
          <div 
            onClick={() => router.push('/kiosks')} 
            className="bg-white overflow-hidden rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition duration-300 cursor-pointer group"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-amber-100 text-amber-600 mr-4 group-hover:bg-amber-600 group-hover:text-white transition duration-300">
                  <LocationIcon />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 group-hover:text-amber-600 transition duration-300">Find Nearby Kiosks</h2>
                  <p className="text-gray-500">Locate card pickup points</p>
                </div>
              </div>
            </div>
            <div className="h-1 w-full bg-amber-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </div>
          
          <div 
            onClick={() => router.push('/profile')} 
            className="bg-white overflow-hidden rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition duration-300 cursor-pointer group"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4 group-hover:bg-purple-600 group-hover:text-white transition duration-300">
                  <ProfileIcon />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 group-hover:text-purple-600 transition duration-300">Profile Settings</h2>
                  <p className="text-gray-500">Update personal information</p>
                </div>
              </div>
            </div>
            <div className="h-1 w-full bg-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </div>
        </div>
        
        {/* Cards section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <CreditCardIcon />
            <span className="ml-2">Your Cards</span>
          </h2>
          
          {cards.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <p className="mt-4 text-gray-600 text-lg">You don't have any cards yet.</p>
              <button 
                onClick={() => router.push('/apply')}
                className="mt-4 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300"
              >
                Apply for a New Card
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map(card => (
                <div 
                  key={card.id} 
                  className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className={`relative p-6 text-white ${getCardDesignClasses(card.design)} h-48 flex flex-col justify-between`}>
                    {/* Card chip icon */}
                    <div className="absolute right-6 top-6">
                      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0" y="8" width="36" height="20" rx="4" fill="rgba(255, 255, 255, 0.2)" />
                        <rect x="7" y="12" width="22" height="12" rx="2" fill="rgba(255, 255, 255, 0.3)" />
                      </svg>
                    </div>
                    
                    <div className="text-xs uppercase tracking-wider font-semibold opacity-80">{card.card_type}</div>
                    
                    <div>
                      <div className="text-lg tracking-widest font-mono mb-2">
                        **** **** **** {card.card_number.slice(-4)}
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-xs opacity-80">
                          <div>Card Holder</div>
                          <div className="font-medium">{user?.name}</div>
                        </div>
                        <div className="text-xs opacity-80">
                          <div>Expires</div>
                          <div className="font-medium">
                            {new Date(new Date(card.created_at).setFullYear(
                              new Date(card.created_at).getFullYear() + 3
                            )).toLocaleDateString('en-US', { month: '2-digit', year: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-800">
                        Status: 
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${card.status === 'active' ? 'bg-green-100 text-green-800' : 
                            card.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-gray-100 text-gray-800'}`
                        }>
                          {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
                        </span>
                      </p>
                      
                      <button 
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                        onClick={() => router.push(`/card/${card.id}`)}
                      >
                        View Details
                      </button>
                    </div>
                    
                    <p className="text-sm text-gray-600">
                      Applied on: {new Date(card.created_at).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="flex items-center">
              <span className="text-lg font-bold text-indigo-600">CardDash</span>
              <span className="ml-1 text-gray-500 text-sm">&copy; {new Date().getFullYear()}</span>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex space-x-6">
                <a href="#" className="text-gray-500 hover:text-indigo-600">Privacy Policy</a>
                <a href="#" className="text-gray-500 hover:text-indigo-600">Terms of Service</a>
                <a href="#" className="text-gray-500 hover:text-indigo-600">Contact Support</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}