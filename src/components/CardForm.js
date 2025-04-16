'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Credit card icon component
const CreditCardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

export default function CardForm({ formType }) {
  const [formData, setFormData] = useState({
    cardType: 'standard',
    name: '',
    design: 'blue',
    deliveryMethod: 'mail'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const router = useRouter();

  // Populate name field with user info if available
  useEffect(() => {
    const populateUserInfo = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.user && data.user.name) {
            setFormData(prev => ({
              ...prev,
              name: data.user.name
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    
    populateUserInfo();
  }, []);
  
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
      const response = await fetch(`${apiUrl}/cards/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          card_type: formData.cardType,
          name_on_card: formData.name,
          design: formData.design,
          delivery_method: formData.deliveryMethod
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccessMessage('Card application submitted successfully!');
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setError(data.message || 'Application failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
      console.error('Application error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get card design classes based on the selected design
  const getCardDesignClasses = (design) => {
    switch (design) {
      case 'blue':
        return 'bg-gradient-to-r from-blue-500 to-indigo-600';
      case 'green':
        return 'bg-gradient-to-r from-emerald-400 to-teal-500';
      case 'black':
        return 'bg-gradient-to-r from-gray-700 to-gray-900';
      default:
        return 'bg-gradient-to-r from-blue-500 to-indigo-600';
    }
  };

  // Get card type details
  const getCardTypeDetails = (type) => {
    switch (type) {
      case 'standard':
        return {
          name: 'Standard Card',
          description: 'Basic features for everyday use',
          fee: 'No annual fee'
        };
      case 'premium':
        return {
          name: 'Premium Card',
          description: 'Enhanced benefits and rewards',
          fee: '$99 annual fee'
        };
      case 'business':
        return {
          name: 'Business Card',
          description: 'Designed for business expenses',
          fee: '$149 annual fee'
        };
      default:
        return {
          name: 'Standard Card',
          description: 'Basic features for everyday use',
          fee: 'No annual fee'
        };
    }
  };

  // Card Preview component
  const CardPreview = () => {
    const cardTypeDetails = getCardTypeDetails(formData.cardType);
    
    return (
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Card Preview</h3>
        <div className="relative w-full max-w-md mx-auto">
          <div className={`p-6 rounded-xl shadow-lg ${getCardDesignClasses(formData.design)} h-56 flex flex-col justify-between`}>
            {/* Card chip icon */}
            <div className="absolute right-6 top-6">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0" y="8" width="36" height="20" rx="4" fill="rgba(255, 255, 255, 0.2)" />
                <rect x="7" y="12" width="22" height="12" rx="2" fill="rgba(255, 255, 255, 0.3)" />
              </svg>
            </div>
            
            <div className="text-xs uppercase tracking-wider font-semibold text-white opacity-80">{cardTypeDetails.name}</div>
            
            <div>
              <div className="text-lg tracking-widest font-mono mb-2 text-white">
                **** **** **** ****
              </div>
              <div className="flex justify-between items-center">
                <div className="text-xs text-white opacity-80">
                  <div>Card Holder</div>
                  <div className="font-medium">{formData.name || 'YOUR NAME'}</div>
                </div>
                <div className="text-xs text-white opacity-80">
                  <div>Expires</div>
                  <div className="font-medium">
                    {new Date(new Date().setFullYear(
                      new Date().getFullYear() + 3
                    )).toLocaleDateString('en-US', { month: '2-digit', year: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // If success message is shown, display it
  if (successMessage) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{successMessage}</h3>
        <p className="text-gray-600 mb-6">Redirecting to your dashboard...</p>
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
          <div className="bg-green-500 h-1.5 rounded-full w-full animate-pulse"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-end mb-4">
        <button 
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </button>
      </div>
      
      {showPreview && <CardPreview />}
      
      <form className="space-y-6" onSubmit={handleSubmit}>
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
          <label htmlFor="cardType" className="block text-sm font-medium text-gray-700 mb-1">Card Type</label>
          <select
            id="cardType"
            name="cardType"
            value={formData.cardType}
            onChange={handleChange}
            className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="standard">Standard Card</option>
            <option value="premium">Premium Card</option>
            <option value="business">Business Card</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
            maxLength="26"
            placeholder="As it will appear on your card"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Card Design</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`relative rounded-lg overflow-hidden border-2 ${formData.design === 'blue' ? 'border-indigo-500' : 'border-transparent'}`}>
              <input
                type="radio"
                id="designBlue"
                name="design"
                value="blue"
                checked={formData.design === 'blue'}
                onChange={handleChange}
                className="sr-only"
              />
              <label htmlFor="designBlue" className="cursor-pointer block">
                <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-end p-3">
                  <span className="text-white text-xs font-medium">Blue Horizon</span>
                </div>
                <div className="p-2 bg-white text-center">
                  <span className="block text-sm font-medium">Blue</span>
                </div>
              </label>
              {formData.design === 'blue' && (
                <div className="absolute top-2 right-2 bg-white rounded-full p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            
            <div className={`relative rounded-lg overflow-hidden border-2 ${formData.design === 'green' ? 'border-emerald-500' : 'border-transparent'}`}>
              <input
                type="radio"
                id="designGreen"
                name="design"
                value="green"
                checked={formData.design === 'green'}
                onChange={handleChange}
                className="sr-only"
              />
              <label htmlFor="designGreen" className="cursor-pointer block">
                <div className="h-32 bg-gradient-to-r from-emerald-400 to-teal-500 flex items-end p-3">
                  <span className="text-white text-xs font-medium">Emerald Wave</span>
                </div>
                <div className="p-2 bg-white text-center">
                  <span className="block text-sm font-medium">Green</span>
                </div>
              </label>
              {formData.design === 'green' && (
                <div className="absolute top-2 right-2 bg-white rounded-full p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            
            <div className={`relative rounded-lg overflow-hidden border-2 ${formData.design === 'black' ? 'border-gray-700' : 'border-transparent'}`}>
              <input
                type="radio"
                id="designBlack"
                name="design"
                value="black"
                checked={formData.design === 'black'}
                onChange={handleChange}
                className="sr-only"
              />
              <label htmlFor="designBlack" className="cursor-pointer block">
                <div className="h-32 bg-gradient-to-r from-gray-700 to-gray-900 flex items-end p-3">
                  <span className="text-white text-xs font-medium">Midnight Black</span>
                </div>
                <div className="p-2 bg-white text-center">
                  <span className="block text-sm font-medium">Black</span>
                </div>
              </label>
              {formData.design === 'black' && (
                <div className="absolute top-2 right-2 bg-white rounded-full p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-800" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Method</label>
          <div className="mt-2 space-y-3">
            <div className="relative flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="radio"
                  id="deliveryMail"
                  name="deliveryMethod"
                  value="mail"
                  checked={formData.deliveryMethod === 'mail'}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="deliveryMail" className="font-medium text-gray-700">Mail to Address</label>
                <p className="text-gray-500">Your card will be delivered to your registered address within 7-10 business days</p>
              </div>
            </div>
            
            <div className="relative flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="radio"
                  id="deliveryKiosk"
                  name="deliveryMethod"
                  value="kiosk"
                  checked={formData.deliveryMethod === 'kiosk'}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="deliveryKiosk" className="font-medium text-gray-700">Pickup at Kiosk</label>
                <p className="text-gray-500">Collect your card from one of our kiosks when ready (typically 3-5 business days)</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-indigo-50 p-4 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-indigo-800">About your card</h3>
              <div className="mt-2 text-sm text-indigo-700">
                <p>You're applying for a {getCardTypeDetails(formData.cardType).name}.</p>
                <p className="mt-1">{getCardTypeDetails(formData.cardType).description}. {getCardTypeDetails(formData.cardType).fee}.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : "Submit Application"}
          </button>
        </div>
      </form>
    </div>
  );
}