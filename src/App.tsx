
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";

import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Admin from './pages/Admin';
import SuperAdmin from './pages/SuperAdmin';
import SuperAdminLogin from './pages/SuperAdminLogin';
import AuthCallback from './components/AuthCallback';
import AuthCheck from './components/AuthCheck';
import SuperAdminCheck from './components/super-admin/SuperAdminCheck';
import LandingPageView from './components/LandingPageView';

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vetpro-theme">
      <Router>
        <AuthProvider>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/super-admin-login" element={<SuperAdminLogin />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/p/:companyCode/:pageSlug" element={<LandingPageView />} />

            {/* Rotas protegidas */}
            <Route path="/admin" element={<AuthCheck><Admin /></AuthCheck>} />
            <Route path="/super-admin" element={<SuperAdminCheck><SuperAdmin /></SuperAdminCheck>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          <Toaster />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
