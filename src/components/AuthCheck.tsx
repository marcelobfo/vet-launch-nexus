
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";

const AuthCheck: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Check if user is authenticated
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    // Check company code
    const companyCode = localStorage.getItem("companyCode");
    
    // For demo purposes, we're accepting any company code
    if (companyCode) {
      setIsAuthorized(true);
    } else {
      // If no company code found, redirect to login
      localStorage.removeItem("isLoggedIn");
      navigate('/login');
    }
  }, [navigate]);
  
  // Loading state
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vet-dark">
        <Card className="p-6 text-center bg-card border-gray-800">
          <div className="animate-pulse">Verificando autenticação...</div>
        </Card>
      </div>
    );
  }
  
  // Authorized
  if (isAuthorized) {
    return <>{children}</>;
  }
  
  // This should never render as we redirect in the useEffect
  return null;
};

export default AuthCheck;
