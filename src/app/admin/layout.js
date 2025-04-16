'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

// Admin dashboard icons
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const CardsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const ApplicationsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const KiosksIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    <p className="mt-4 text-lg font-medium text-indigo-700">Loading admin panel...</p>
  </div>
);

export default function AdminLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken');
    if (!token && !pathname.includes('/admin/login')) {
      router.push('/admin/login');
      return;
    }
    // Add slight delay to show loading animation
    setTimeout(() => setLoading(false), 500);
  }, [pathname, router]);
  
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (pathname.includes('/admin/login')) {
    return <>{children}</>;
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: <DashboardIcon /> },
    { name: 'Users', href: '/admin/users', icon: <UsersIcon /> },
    { name: 'Cards', href: '/admin/cards', icon: <CardsIcon /> },
    { name: 'Applications', href: '/admin/applications', icon: <ApplicationsIcon /> },
    { name: 'Kiosks', href: '/admin/kiosks', icon: <KiosksIcon /> },
  ];
  
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <div className="flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 text-indigo-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" 
              />
            </svg>
            <h1 className="ml-2 text-xl font-bold text-gray-800">Admin Panel</h1>
          </div>
        </div>

        <div className="overflow-y-auto h-full pb-20">
          <nav className="px-4 pt-4">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link 
                  key={item.name}
                  href={item.href} 
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                    pathname === item.href 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className={`mr-3 ${
                    pathname === item.href 
                      ? 'text-indigo-700' 
                      : 'text-gray-500 group-hover:text-gray-700'
                  }`}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>

        <div className="absolute bottom-0 w-full border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="group flex items-center w-full px-6 py-4 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-700"
          >
            <span className="mr-3 text-gray-500 group-hover:text-red-700">
              <LogoutIcon />
            </span>
            Logout
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="text-gray-500 focus:outline-none focus:text-gray-700 lg:hidden"
            >
              <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            
            <h2 className="text-xl font-semibold text-gray-800">
              {pathname.includes('/dashboard') && 'Dashboard'}
              {pathname.includes('/users') && 'User Management'}
              {pathname.includes('/cards') && 'Card Management'}
              {pathname.includes('/applications') && 'Application Management'}
              {pathname.includes('/kiosks') && 'Kiosk Management'}
            </h2>
            
            <div className="flex items-center">
              <span className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </span>
              
              <div className="ml-4 relative">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold text-sm">
                    A
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">Admin</span>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}