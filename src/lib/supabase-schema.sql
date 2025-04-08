
-- Script para criar a estrutura do banco de dados no Supabase

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
);

-- Tabela de configurações da empresa
CREATE TABLE company_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) UNIQUE,
  theme JSON, -- Configurações de tema (cores, etc.)
  texts JSON, -- Textos personalizados
  metrics JSON, -- Métricas definidas pelo usuário
  security_settings JSON, -- Configurações de segurança
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Função para atualizar o timestamp de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar o timestamp de updated_at
CREATE TRIGGER update_company_settings_updated_at
BEFORE UPDATE ON company_settings
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Exemplo de políticas RLS (Row Level Security)
-- Habilitar RLS em todas as tabelas
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;

-- Política para usuários: apenas podem ver sua própria empresa e usuários da mesma empresa
CREATE POLICY user_company_policy ON companies 
  FOR ALL USING (id IN (
    SELECT company_id FROM users 
    WHERE auth.uid() = id
  ));

CREATE POLICY user_users_policy ON users 
  FOR ALL USING (company_id IN (
    SELECT company_id FROM users 
    WHERE auth.uid() = id
  ));

-- Política para projetos: apenas podem ver projetos da própria empresa
CREATE POLICY user_projects_policy ON projects 
  FOR ALL USING (company_id IN (
    SELECT company_id FROM users 
    WHERE auth.uid() = id
  ));

-- Política para tarefas: apenas podem ver tarefas de projetos da própria empresa
CREATE POLICY user_tasks_policy ON tasks 
  FOR ALL USING (project_id IN (
    SELECT id FROM projects 
    WHERE company_id IN (
      SELECT company_id FROM users 
      WHERE auth.uid() = id
    )
  ));

-- Política para códigos de acesso: apenas podem ver códigos da própria empresa (admin)
CREATE POLICY admin_access_codes_policy ON access_codes 
  FOR ALL USING (company_id IN (
    SELECT company_id FROM users 
    WHERE auth.uid() = id AND role = 'admin'
  ));

-- Política para configurações da empresa: apenas podem ver configurações da própria empresa
CREATE POLICY user_company_settings_policy ON company_settings 
  FOR ALL USING (company_id IN (
    SELECT company_id FROM users 
    WHERE auth.uid() = id
  ));

-- Inserir algumas empresas de exemplo
INSERT INTO companies (name, code, allow_signup) VALUES
  ('Vet Clinic A', 'VETA2023', true),
  ('Pet Hospital B', 'PETB2023', true),
  ('Animal Care C', 'ANIMALC', true);

-- Inserir um usuário administrador para cada empresa
INSERT INTO users (email, name, company_id, role) VALUES
  ('admin@vetclinica.com', 'Administrador A', (SELECT id FROM companies WHERE code = 'VETA2023'), 'admin'),
  ('admin@pethospitalb.com', 'Administrador B', (SELECT id FROM companies WHERE code = 'PETB2023'), 'admin'),
  ('admin@animalcarec.com', 'Administrador C', (SELECT id FROM companies WHERE code = 'ANIMALC'), 'admin');
