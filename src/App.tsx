
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Admin from '@/pages/Admin';
import NotFound from '@/pages/NotFound';
import { AuthProvider } from '@/contexts/AuthContext';
import AuthCheck from '@/components/AuthCheck';
import AuthCallback from '@/components/AuthCallback';
import { useState } from 'react';

function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route 
            path="/" 
            element={
              <AuthCheck>
                <Index isDarkTheme={isDarkTheme} setIsDarkTheme={setIsDarkTheme} />
              </AuthCheck>
            } 
          />
          <Route 
            path="/admin/*" 
            element={
              <AuthCheck>
                <Admin isDarkTheme={isDarkTheme} setIsDarkTheme={setIsDarkTheme} />
              </AuthCheck>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
