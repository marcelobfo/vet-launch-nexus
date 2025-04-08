
import React from 'react';

const SqlSchema: React.FC = () => {
  return (
    <script type="application/sql" style={{ display: 'none' }}>
{`-- Script para criar a estrutura do banco de dados no Supabase

-- Tabela de empresas
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE, -- Código único da empresa para acesso
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  
  -- Configurações SMTP
  smtp_host TEXT,
  smtp_port INTEGER,
  smtp_user TEXT,
  smtp_pass TEXT,
  smtp_from TEXT,
  
  -- URL do webhook para receber notificações
  webhook_url TEXT,
  
  -- Permitir auto-cadastro de usuários
  allow_signup BOOLEAN DEFAULT true
);

-- Tabela de usuários
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  whatsapp TEXT,
  company_id UUID NOT NULL REFERENCES companies(id),
  role TEXT NOT NULL DEFAULT 'user', -- 'admin', 'user', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  department TEXT,
  
  -- Chave única para evitar duplicidade de email na mesma empresa
  UNIQUE(email, company_id)
);

-- Tabela de projetos
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  company_id UUID NOT NULL REFERENCES companies(id),
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'completed', 'canceled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  start_date DATE,
  end_date DATE,
  owner_id UUID REFERENCES users(id)
);

-- Tabela de tarefas do projeto
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'completed'
  priority TEXT NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  due_date DATE,
  assigned_to UUID REFERENCES users(id)
);

-- Tabela de códigos de acesso temporários
CREATE TABLE access_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  company_id UUID NOT NULL REFERENCES companies(id),
  code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_used BOOLEAN DEFAULT false
);`}
    </script>
  );
};

export default SqlSchema;
