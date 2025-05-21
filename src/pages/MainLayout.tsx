
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Toaster } from "@/components/ui/toaster";
import { useAuthStore } from '@/store/authStore';
import { Navigate } from 'react-router-dom';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <Toaster />
    </div>
  );
};

export default MainLayout;
