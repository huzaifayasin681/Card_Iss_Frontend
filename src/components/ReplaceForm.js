'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ReplaceForm({ cards }) {
  const [formData, setFormData] = useState({
    cardId: cards.length > 0 ? cards[0].id : '',
    reason: 'lost',
    details: '',
    shippingAddress: '',
    expressDelivery: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const router = useRouter();
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const token = localStorage.getItem('token');
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/cards/replace`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          card_id: formData.cardId,
          reason: formData.reason,
          details: formData.details,
          shipping_address: formData.shippingAddress,
          express_delivery: formData.expressDelivery
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSubmitSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      } else {
        setError(data.message || 'Replacement request failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
      console.error('Replacement error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // If success message is shown, display it
  if (submitSuccess) {
    return (
      <div className="bg-white rounded-lg p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Replacement Request Submitted</h3>
        <p className="text-gray-600 mb-6">Your card replacement request has been submitted successfully. You will be redirected to your dashboard shortly.</p>
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
          <div className="bg-green-500 h-1.5 rounded-full w-full animate-pulse"></div>
        </div>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <div>
        <label htmlFor="cardId" className="block text-sm font-medium text-gray-700 mb-1">Select Card to Replace</label>
        <select
          id="cardId"
          name="cardId"
          value={formData.cardId}
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
          placeholder={formData.reason === 'other' ? 'Please explain the reason for replacement' : 'Provide any additional information (optional)'}
          required={formData.reason === 'other'}
        ></textarea>
      </div>
      
      <div>
        <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
        <textarea
          id="shippingAddress"
          name="shippingAddress"
          value={formData.shippingAddress}
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
            id="expressDelivery"
            name="expressDelivery"
            type="checkbox"
            checked={formData.expressDelivery}
            onChange={handleChange}
            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="expressDelivery" className="font-medium text-gray-700">Express Delivery</label>
          <p className="text-gray-500">Get your replacement card within 2-3 business days (additional $15 fee applies)</p>
        </div>
      </div>
      
      <div className="pt-4">
        <button 
          type="submit" 
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-300 w-full"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing Request...
            </>
          ) : "Submit Replacement Request"}
        </button>
      </div>
    </form>
  );
}