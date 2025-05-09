
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
  Settings
} from 'lucide-react';
import LeadManager from '@/components/admin/LeadManager';
import LandingPageManager from '@/components/admin/LandingPageManager';
import ProjectManagement from '@/components/admin/ProjectManagement';
import PerformanceMetrics from '@/components/admin/PerformanceMetrics';
import AdminSettings from './AdminSettings';

interface AdminTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin: boolean;
}

const AdminTabs: React.FC<AdminTabsProps> = ({ activeTab, setActiveTab, isAdmin }) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid md:grid-cols-5 grid-cols-2 h-auto md:h-12 mb-8">
        <TabsTrigger value="dashboard" className="data-[state=active]:bg-vet-primary">
          <PieChart className="h-4 w-4 mr-2" />
          Dashboard
        </TabsTrigger>
        
        <TabsTrigger value="leads" className="data-[state=active]:bg-vet-primary">
          <UserPlus className="h-4 w-4 mr-2" />
          Leads
        </TabsTrigger>
        
        <TabsTrigger value="pages" className="data-[state=active]:bg-vet-primary">
          <FileText className="h-4 w-4 mr-2" />
          Landing Pages
        </TabsTrigger>
        
        <TabsTrigger value="projects" className="data-[state=active]:bg-vet-primary">
          <Layers className="h-4 w-4 mr-2" />
          Projetos
        </TabsTrigger>
        
        {isAdmin && (
          <TabsTrigger value="admin" className="data-[state=active]:bg-vet-primary">
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </TabsTrigger>
        )}
      </TabsList>
      
      <TabsContent value="dashboard">
        <PerformanceMetrics />
      </TabsContent>
      
      <TabsContent value="leads">
        <LeadManager />
      </TabsContent>
      
      <TabsContent value="pages">
        <LandingPageManager />
      </TabsContent>
      
      <TabsContent value="projects">
        <ProjectManagement />
      </TabsContent>
      
      {isAdmin && (
        <TabsContent value="admin">
          <AdminSettings />
        </TabsContent>
      )}
    </Tabs>
  );
};

export default AdminTabs;
