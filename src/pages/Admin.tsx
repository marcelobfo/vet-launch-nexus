
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminHeader from '@/components/admin/dashboard/AdminHeader';
import AdminFooter from '@/components/admin/dashboard/AdminFooter';
import AdminTabs from '@/components/admin/dashboard/AdminTabs';

const Admin = () => {
  const { user, company } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  
  if (!user || !company) {
    return <div>Carregando...</div>;
  }

  const isAdmin = user.role === 'admin';
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AdminHeader />
      
      {/* Main content */}
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-6">
          <AdminTabs 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            isAdmin={isAdmin} 
          />
        </div>
      </div>
      
      <AdminFooter />
    </div>
  );
};

export default Admin;
