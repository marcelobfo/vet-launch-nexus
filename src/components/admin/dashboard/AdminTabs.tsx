
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Users, ClipboardList, Settings, BarChart, Shield } from 'lucide-react';
import Dashboard from '@/components/admin/dashboard/Dashboard';
import LeadsTable from '@/components/admin/LeadsTable';
import LandingPagesTable from '@/components/admin/LandingPagesTable';
// Import the refactored FacebookCampaigns component
import FacebookCampaigns from '@/components/admin/facebook/FacebookCampaigns';
import AdminSettings from './AdminSettings';

interface AdminTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin: boolean;
  permissions: string[];
}

const AdminTabs: React.FC<AdminTabsProps> = ({ activeTab, setActiveTab, isAdmin, permissions }) => {
  const hasPermission = (permission: string) => permissions.includes(permission);
  const isSuperAdmin = permissions.includes('super_admin_access');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-4">
        {hasPermission('view_dashboard') && (
          <TabsTrigger value="dashboard" className="flex items-center space-x-2">
            <Home className="h-4 w-4" />
            <span>Dashboard</span>
          </TabsTrigger>
        )}
        {hasPermission('view_leads') && (
          <TabsTrigger value="leads" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Leads</span>
          </TabsTrigger>
        )}
        {hasPermission('view_landing_pages') && (
          <TabsTrigger value="landing-pages" className="flex items-center space-x-2">
            <ClipboardList className="h-4 w-4" />
            <span>Landing Pages</span>
          </TabsTrigger>
        )}
        {hasPermission('view_facebook_campaigns') && (
          <TabsTrigger value="facebook-campaigns" className="flex items-center space-x-2">
            <BarChart className="h-4 w-4" />
            <span>Facebook Campaigns</span>
          </TabsTrigger>
        )}
        {isAdmin && hasPermission('view_settings') && (
          <TabsTrigger value="admin" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Admin</span>
          </TabsTrigger>
        )}
        {isSuperAdmin && (
          <TabsTrigger value="super-admin" className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-red-500" />
            <span className="text-red-500">Super Admin</span>
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="dashboard">
        <Dashboard />
      </TabsContent>

      <TabsContent value="leads">
        <LeadsTable />
      </TabsContent>

      <TabsContent value="landing-pages">
        <LandingPagesTable />
      </TabsContent>

      <TabsContent value="facebook-campaigns">
        <FacebookCampaigns />
      </TabsContent>

      <TabsContent value="admin">
        <AdminSettings />
      </TabsContent>

      <TabsContent value="super-admin">
        <div className="p-4 border border-red-500/20 rounded-lg bg-red-500/5">
          <h2 className="text-xl font-bold text-red-500 mb-4">Super Admin Panel</h2>
          <p className="text-muted-foreground">
            This area is restricted to Super Administrators. Here you can manage all companies, users, and system-wide settings.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
