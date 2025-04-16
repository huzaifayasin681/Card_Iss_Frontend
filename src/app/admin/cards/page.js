'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-20">
    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Card Status Badge component
const CardStatusBadge = ({ status }) => {
  const getStatusClasses = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'replacement_pending':
        return 'bg-blue-100 text-blue-800';
      case 'replacement_approved':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format status display by replacing underscores with spaces and capitalizing
  const formatStatus = (status) => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(status)}`}>
      {formatStatus(status)}
    </span>
  );
};

export default function CardsManagement() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          router.push('/admin/login');
          return;
        }
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/admin/cards`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setCards(data.cards);
        } else {
          localStorage.removeItem('adminToken');
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Error fetching cards:', error);
      } finally {
        // Add a slight delay to show loading animation
        setTimeout(() => setLoading(false), 800);
      }
    };
    
    fetchCards();
  }, [router]);
  
  // Filter cards based on all criteria
  const filteredCards = cards.filter(card => {
    const typeMatch = filterType === 'all' || card.card_type === filterType;
    const statusMatch = filterStatus === 'all' || card.status === filterStatus;
    const searchMatch = 
      searchTerm === '' || 
      card.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.name_on_card.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.card_number.includes(searchTerm);
    return typeMatch && statusMatch && searchMatch;
  });

  // Visualize card design
  const getCardDesignClasses = (cardType) => {
    switch (cardType) {
      case 'standard':
        return 'bg-gradient-to-r from-blue-500 to-indigo-600';
      case 'premium':
        return 'bg-gradient-to-r from-purple-500 to-indigo-600';
      case 'business':
        return 'bg-gradient-to-r from-gray-700 to-gray-900';
      default:
        return 'bg-gradient-to-r from-indigo-500 to-purple-600';
    }
  };

  // Mock export function (would be replaced with actual implementation)
  const exportData = (format) => {
    alert(`Data would be exported as ${format}`);
    setShowExportOptions(false);
  };
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="space-y-6">
      {/* Card details modal */}
      {selectedCard && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-semibold text-gray-800">Card Details</h3>
              <button 
                onClick={() => setSelectedCard(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              {/* Card visualization */}
              <div className={`${getCardDesignClasses(selectedCard.card_type)} rounded-xl p-6 text-white shadow-lg mb-6`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs uppercase tracking-wider font-semibold opacity-80">
                      {selectedCard.card_type.toUpperCase()} CARD
                    </div>
                  </div>
                  <div>
                    <CardStatusBadge status={selectedCard.status} />
                  </div>
                </div>
                
                <div className="mt-10 font-mono text-lg tracking-widest">
                  {selectedCard.card_number}
                </div>
                
                <div className="mt-6 flex justify-between items-end">
                  <div>
                    <div className="text-xs opacity-80">CARD HOLDER</div>
                    <div className="text-sm font-medium">{selectedCard.name_on_card}</div>
                  </div>
                  <div>
                    <div className="text-xs opacity-80">ISSUED</div>
                    <div className="text-sm font-medium">
                      {new Date(selectedCard.created_at).toLocaleDateString(undefined, { 
                        month: '2-digit', year: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div>
                  <p className="text-sm text-gray-500">User Information</p>
                  <p className="text-md font-medium">{selectedCard.user_name}</p>
                  <p className="text-sm text-gray-600">ID: {selectedCard.user_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Issued On</p>
                  <p className="text-md font-medium">
                    {new Date(selectedCard.created_at).toLocaleDateString(undefined, { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                    onClick={() => window.open(`/admin/users?id=${selectedCard.user_id}`, '_blank')}
                  >
                    View User Details
                  </button>
                  <button 
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    onClick={() => setSelectedCard(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-800">Card Management</h3>
            </div>
            
            <div className="flex flex-wrap gap-4">
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
                id="typeFilter"
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Card Types</option>
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
                <option value="business">Business</option>
              </select>
              
              <select
                id="statusFilter"
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="expired">Expired</option>
                <option value="replacement_pending">Replacement Pending</option>
                <option value="replacement_approved">Replacement Approved</option>
              </select>
              
              <div className="relative">
                <button
                  onClick={() => setShowExportOptions(!showExportOptions)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Export
                </button>
                
                {showExportOptions && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20">
                    <div className="py-1">
                      <button
                        onClick={() => exportData('CSV')}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                      >
                        Export as CSV
                      </button>
                      <button
                        onClick={() => exportData('Excel')}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                      >
                        Export as Excel
                      </button>
                      <button
                        onClick={() => exportData('PDF')}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                      >
                        Export as PDF
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
                  Card Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Card Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name on Card
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issued On
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCards.map(card => (
                <tr key={card.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {card.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-800 font-medium text-sm">
                          {card.user_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{card.user_name}</div>
                        <div className="text-xs text-gray-500">ID: {card.user_id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      card.card_type === 'standard' ? 'bg-blue-100 text-blue-800' :
                      card.card_type === 'premium' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {card.card_type.charAt(0).toUpperCase() + card.card_type.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                    {card.card_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {card.name_on_card}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <CardStatusBadge status={card.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(card.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 font-medium">
                    <button 
                      onClick={() => setSelectedCard(card)}
                      className="hover:text-indigo-900"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredCards.length === 0 && (
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
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No cards found</h3>
            <p className="mt-1 text-sm text-gray-500">
              No cards match your current filter criteria.
            </p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setFilterType('all');
                  setFilterStatus('all');
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