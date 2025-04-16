'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CardForm from '@/components/CardForm';

export default function Apply() {
  const router = useRouter();
  
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
    }
  }, [router]);

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold text-primary mb-2">Apply for a New Card</h1>
      <p className="text-gray-600 mb-8">Complete the form below to request a new card</p>
      
      <CardForm formType="new" />
    </div>
  );
}