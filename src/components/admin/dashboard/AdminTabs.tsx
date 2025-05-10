
import React from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  PieChart, 
  UserPlus, 
  FileText, 
  Layers, 
  Settings,
  Facebook
} from 'lucide-react';
import LeadManager from '@/components/admin/LeadManager';
import LandingPageManager from '@/components/admin/LandingPageManager';
import ProjectManagement from '@/components/admin/ProjectManagement';
import PerformanceMetrics from '@/components/admin/PerformanceMetrics';
import AdminSettings from '@/components/admin/dashboard/AdminSettings';
import FacebookCampaigns from '@/components/admin/FacebookCampaigns';

interface AdminTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin: boolean;
  permissions: string[];
}

const AdminTabs: React.FC<AdminTabsProps> = ({ activeTab, setActiveTab, isAdmin, permissions }) => {
  // Check permissions
  const canViewDashboard = permissions.includes('view_dashboard');
  const canViewLeads = permissions.includes('view_leads') || permissions.includes('manage_leads');
  const canViewPages = permissions.includes('view_landing_pages') || permissions.includes('manage_landing_pages');
  const canViewProjects = permissions.includes('view_projects') || permissions.includes('manage_projects');
  const canViewSettings = permissions.includes('view_settings') || permissions.includes('manage_settings');
  const canViewFacebookCampaigns = permissions.includes('view_facebook_campaigns') || permissions.includes('manage_facebook_campaigns');
  
  const getNumberOfTabs = () => {
    let count = 0;
    if (canViewDashboard) count++;
    if (canViewLeads) count++;
    if (canViewPages) count++;
    if (canViewProjects) count++;
    if (canViewFacebookCampaigns) count++;
    if (canViewSettings && isAdmin) count++;
    return count;
  };

  const getTabsGridCols = () => {
    const count = getNumberOfTabs();
    if (count <= 3) return 'grid-cols-' + count;
    if (count <= 6) return 'grid-cols-3 md:grid-cols-' + count;
    return 'grid-cols-3 md:grid-cols-6';
  };
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className={`grid ${getTabsGridCols()} h-auto md:h-12 mb-8`}>
        {canViewDashboard && (
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-vet-primary">
            <PieChart className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
        )}
        
        {canViewLeads && (
          <TabsTrigger value="leads" className="data-[state=active]:bg-vet-primary">
            <UserPlus className="h-4 w-4 mr-2" />
            Leads
          </TabsTrigger>
        )}
        
        {canViewPages && (
          <TabsTrigger value="pages" className="data-[state=active]:bg-vet-primary">
            <FileText className="h-4 w-4 mr-2" />
            Landing Pages
          </TabsTrigger>
        )}
        
        {canViewProjects && (
          <TabsTrigger value="projects" className="data-[state=active]:bg-vet-primary">
            <Layers className="h-4 w-4 mr-2" />
            Projetos
          </TabsTrigger>
        )}
        
        {canViewFacebookCampaigns && (
          <TabsTrigger value="facebook" className="data-[state=active]:bg-vet-primary">
            <Facebook className="h-4 w-4 mr-2" />
            Facebook
          </TabsTrigger>
        )}
        
        {isAdmin && canViewSettings && (
          <TabsTrigger value="admin" className="data-[state=active]:bg-vet-primary">
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </TabsTrigger>
        )}
      </TabsList>
      
      {canViewDashboard && (
        <TabsContent value="dashboard">
          <PerformanceMetrics />
        </TabsContent>
      )}
      
      {canViewLeads && (
        <TabsContent value="leads">
          <LeadManager />
        </TabsContent>
      )}
      
      {canViewPages && (
        <TabsContent value="pages">
          <LandingPageManager />
        </TabsContent>
      )}
      
      {canViewProjects && (
        <TabsContent value="projects">
          <ProjectManagement />
        </TabsContent>
      )}
      
      {canViewFacebookCampaigns && (
        <TabsContent value="facebook">
          <FacebookCampaigns />
        </TabsContent>
      )}
      
      {isAdmin && canViewSettings && (
        <TabsContent value="admin">
          <AdminSettings />
        </TabsContent>
      )}
    </Tabs>
  );
};

export default AdminTabs;
