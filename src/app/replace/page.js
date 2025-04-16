'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Card replacement icon component
const ReplaceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-50 to-purple-50">
    <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    <p className="mt-4 text-lg font-medium text-emerald-700">Loading your cards...</p>
  </div>
);

// Custom ReplaceForm Component
const ReplaceForm = ({ cards }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    card_id: cards.length > 0 ? cards[0].id : '',
    reason: 'lost',
    details: '',
    shipping_address: '',
    express_delivery: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      // This is a placeholder for the actual API call
      // In a real app, you would implement the actual call to your backend
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      
      setSubmitSuccess(true);
      
      // Redirect after a delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting replacement request:', error);
      alert('An error occurred while submitting your request');
      setIsSubmitting(false);
    }
  };
  
  if (submitSuccess) {
    return (
      <div className="bg-white rounded-lg p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Replacement Request Submitted</h3>
        <p className="text-gray-600 mb-6">Your card replacement request has been submitted successfully. You will be redirected shortly.</p>
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
          <div className="bg-green-500 h-1.5 rounded-full w-full animate-pulse"></div>
        </div>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="card_id" className="block text-sm font-medium text-gray-700 mb-1">Select Card to Replace</label>
        <select
          id="card_id"
          name="card_id"
          value={formData.card_id}
          onChange={handleChange}
          className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
          required
        >
          {cards.map(card => (
            <option key={card.id} value={card.id}>
              {card.card_type} - **** {card.card_number.slice(-4)}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Replacement</label>
        <div className="mt-2 space-y-2">
          <div className="flex items-center">
            <input
              id="reason-lost"
              name="reason"
              type="radio"
              value="lost"
              checked={formData.reason === 'lost'}
              onChange={handleChange}
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
            />
            <label htmlFor="reason-lost" className="ml-3 block text-sm text-gray-700">
              Lost Card
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="reason-stolen"
              name="reason"
              type="radio"
              value="stolen"
              checked={formData.reason === 'stolen'}
              onChange={handleChange}
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
            />
            <label htmlFor="reason-stolen" className="ml-3 block text-sm text-gray-700">
              Stolen Card
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="reason-damaged"
              name="reason"
              type="radio"
              value="damaged"
              checked={formData.reason === 'damaged'}
              onChange={handleChange}
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
            />
            <label htmlFor="reason-damaged" className="ml-3 block text-sm text-gray-700">
              Damaged Card
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="reason-other"
              name="reason"
              type="radio"
              value="other"
              checked={formData.reason === 'other'}
              onChange={handleChange}
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
            />
            <label htmlFor="reason-other" className="ml-3 block text-sm text-gray-700">
              Other Reason
            </label>
          </div>
        </div>
      </div>
      
      <div>
        <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">Additional Details</label>
        <textarea
          id="details"
          name="details"
          value={formData.details}
          onChange={handleChange}
          rows="3"
          className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
          placeholder="Please provide any additional information about your request"
        ></textarea>
      </div>
      
      <div>
        <label htmlFor="shipping_address" className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
        <textarea
          id="shipping_address"
          name="shipping_address"
          value={formData.shipping_address}
          onChange={handleChange}
          rows="3"
          className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
          placeholder="Enter the address where you want to receive your replacement card"
          required
        ></textarea>
      </div>
      
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="express_delivery"
            name="express_delivery"
            type="checkbox"
            checked={formData.express_delivery}
            onChange={handleChange}
            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="express_delivery" className="font-medium text-gray-700">Express Delivery</label>
          <p className="text-gray-500">Get your replacement card within 2-3 business days (additional $15 fee applies)</p>
        </div>
      </div>
      
      <div className="pt-4">
        <button 
          type="submit" 
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-300 w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : "Submit Replacement Request"}
        </button>
      </div>
    </form>
  );
};

export default function Replace() {
  const router = useRouter();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }
    
    // Fetch user cards
    const fetchCards = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/cards/status`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setCards(data.cards);
        } else {
          if (response.status === 401) {
            localStorage.removeItem('token');
            router.push('/');
          }
        }
      } catch (error) {
        console.error('Error fetching cards:', error);
      } finally {
        // Add a slight delay to make the loading animation noticeable
        setTimeout(() => setLoading(false), 800);
      }
    };

    fetchCards();
  }, [router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/dashboard" className="text-gray-500 hover:text-emerald-600">Dashboard</Link>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-2 text-emerald-600 font-medium">Replace Card</span>
              </li>
            </ol>
          </nav>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 sm:p-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-emerald-100 text-emerald-600 mr-4">
                  <ReplaceIcon />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">Request Card Replacement</h1>
                  <p className="text-gray-600">Complete the form below to request a replacement for your existing card</p>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-0">
                <Link 
                  href="/dashboard" 
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
            
            {cards.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <p className="mt-4 text-gray-600 text-lg">You don't have any cards to replace. Apply for a new card first.</p>
                <button 
                  onClick={() => router.push('/apply')}
                  className="mt-4 px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-300"
                >
                  Apply for New Card
                </button>
              </div>
            ) : (
              <ReplaceForm cards={cards} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}