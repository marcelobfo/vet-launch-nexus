import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Users, ClipboardList, Settings, BarChart } from 'lucide-react';
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
    </Tabs>
  );
};

export default AdminTabs;
