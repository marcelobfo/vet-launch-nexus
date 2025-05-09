
import React, { useState } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Users, 
  Building, 
  Mail, 
  Database 
} from 'lucide-react';
import UserManagement from '@/components/admin/UserManagement';
import CompanyManagement from '@/components/admin/CompanyManagement';
import SMTPConfig from '@/components/admin/SMTPConfig';
import DatabaseConfig from '@/components/admin/DatabaseConfig';
import SecuritySettings from '@/components/admin/SecuritySettings';
import WebhookSettings from '@/components/admin/WebhookSettings';
import { WebhookSettingsProps, SecuritySettingsProps } from '@/types';

const AdminSettings = () => {
  // Mock props for components that require them
  const mockWebhookSettings: WebhookSettingsProps = {
    companyInfo: {},
    metrics: {},
    webhookSettings: {
      url: '',
      autoSend: false,
      frequency: "daily",
      registrationWebhookUrl: '',
      whatsappWebhookUrl: '',
      smtpSettings: {
        host: '',
        port: 587,
        user: '',
        password: '',
        fromEmail: '',
        fromName: ''
      }
    },
    setWebhookSettings: () => {}
  };

  const mockSecuritySettings: SecuritySettingsProps = {
    securitySettings: {
      passwordProtection: false,
      adminPassword: ''
    },
    setSecuritySettings: () => {}
  };

  return (
    <Tabs defaultValue="users">
      <TabsList className="w-full mb-8">
        <TabsTrigger value="users" className="flex-1">
          <Users className="h-4 w-4 mr-2" />
          Usuários
        </TabsTrigger>
        
        <TabsTrigger value="company" className="flex-1">
          <Building className="h-4 w-4 mr-2" />
          Empresa
        </TabsTrigger>
        
        <TabsTrigger value="email" className="flex-1">
          <Mail className="h-4 w-4 mr-2" />
          Email
        </TabsTrigger>
        
        <TabsTrigger value="api" className="flex-1">
          <Database className="h-4 w-4 mr-2" />
          API e Webhooks
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="users">
        <UserManagement />
      </TabsContent>
      
      <TabsContent value="company">
        <CompanyManagement />
      </TabsContent>
      
      <TabsContent value="email">
        <SMTPConfig />
      </TabsContent>
      
      <TabsContent value="api">
        <div className="grid gap-6 grid-cols-1">
          <WebhookSettings {...mockWebhookSettings} />
          <DatabaseConfig />
          <SecuritySettings {...mockSecuritySettings} />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default AdminSettings;
