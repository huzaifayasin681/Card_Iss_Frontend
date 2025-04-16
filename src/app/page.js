'use client';
import { useState } from 'react';
import Link from 'next/link';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';

export default function Home() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      {/* Navigation */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-primary">CardIssuance</h1>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={() => {
                  setShowLogin(true);
                  setShowAuthModal(true);
                }}
                className="px-4 py-2 text-primary hover:text-primary-dark"
              >
                Login
              </button>
              <button 
                onClick={() => {
                  setShowLogin(false);
                  setShowAuthModal(true);
                }}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Simplified Card Issuance <span className="text-primary">Made Easy</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Issue, manage, and replace cards with our streamlined platform. Fast, secure, and hassle-free.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={() => {
                  setShowLogin(false);
                  setShowAuthModal(true);
                }}
                className="px-8 py-4 bg-primary text-white text-lg rounded-lg hover:bg-primary-dark transition-colors"
              >
                Create Your Account
              </button>
              <a href="#features" className="px-8 py-4 border-2 border-gray-300 text-gray-700 text-lg rounded-lg hover:border-primary hover:text-primary transition-colors text-center">
                Learn More
              </a>
            </div>
          </div>
          <div className="relative h-64 md:h-auto">
            <div className="absolute top-0 right-0 w-5/6 h-full bg-gradient-to-r from-blue-400 to-primary rounded-2xl shadow-2xl transform rotate-6"></div>
            <div className="absolute -top-4 -right-4 w-5/6 h-full bg-gradient-to-r from-primary to-primary-dark rounded-2xl shadow-2xl"></div>
            <div className="relative w-5/6 h-full bg-white rounded-2xl shadow-xl p-6 flex items-center justify-center">
              <div className="w-full h-48 bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl flex flex-col justify-between p-4 transform -rotate-3">
                <div className="flex justify-between items-start">
                  <div className="text-white text-sm">Premium Card</div>
                  <div className="w-10 h-6 bg-yellow-400 rounded-md"></div>
                </div>
                <div className="text-white text-lg tracking-widest font-mono">
                  **** **** **** 1234
                </div>
                <div className="text-white text-sm">
                  JOHN DOE
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-16 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything You Need for Card Management
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Card Application</h3>
              <p className="text-gray-600">
                Apply for new cards with a simplified application process. Choose your card type and design in minutes.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Replacements</h3>
              <p className="text-gray-600">
                Lost or damaged your card? Request a replacement with just a few clicks and minimal waiting time.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Convenient Pickup</h3>
              <p className="text-gray-600">
                Find the nearest kiosk for card pickup with our interactive map and location finder.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Our Platform
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-md bg-primary text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Secure and Reliable</h3>
                <p className="mt-2 text-gray-600">
                  Advanced security measures protect your data and transactions, ensuring peace of mind with every use.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-md bg-primary text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Fast Processing</h3>
                <p className="mt-2 text-gray-600">
                  Streamlined workflows mean your applications are processed quickly, reducing wait times significantly.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-md bg-primary text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Personalization Options</h3>
                <p className="mt-2 text-gray-600">
                  Choose from multiple card designs and types to match your personal style and requirements.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-md bg-primary text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Exceptional Support</h3>
                <p className="mt-2 text-gray-600">
                  Our dedicated team is ready to assist you with any questions or issues through multiple support channels.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto bg-primary rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-12 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Simplify Your Card Management?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied users who have streamlined their card issuance process with our platform.
            </p>
            <button 
              onClick={() => {
                setShowLogin(false);
                setShowAuthModal(true);
              }}
              className="px-8 py-4 bg-white text-primary text-lg font-medium rounded-lg hover:bg-blue-50 transition-colors"
            >
              Get Started Today
            </button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">CardIssuance</h3>
            <p className="text-gray-400">
              Simplifying card management for individuals and businesses alike.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
              <li><a href="#features" className="text-gray-400 hover:text-white">Features</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Cookie Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: support@cardissuance.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>123 Card Street, Suite 101</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>© 2025 CardIssuance. All rights reserved.</p>
        </div>
      </footer>
      
      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {showLogin ? 'Login to Your Account' : 'Create an Account'}
              </h2>
              <button 
                onClick={() => setShowAuthModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              {showLogin ? (
                <LoginForm />
              ) : (
                <RegisterForm />
              )}
              
              <div className="text-center mt-6">
                {showLogin ? (
                  <p>Don't have an account? <button onClick={() => setShowLogin(false)} className="text-primary font-medium">Register</button></p>
                ) : (
                  <p>Already have an account? <button onClick={() => setShowLogin(true)} className="text-primary font-medium">Login</button></p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}