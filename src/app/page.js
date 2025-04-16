'use client';
import { useState } from 'react';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';

export default function Home() {
  const [showLogin, setShowLogin] = useState(true);
  
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md">
        <div className="card">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-primary">{showLogin ? 'Login' : 'Register'}</h1>
            <p className="text-gray-600">Welcome to the Card Issuance Platform</p>
          </div>
          
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
  );
}