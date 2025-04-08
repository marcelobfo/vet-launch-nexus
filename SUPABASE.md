
# Configuração do Supabase

## Visão Geral

Este projeto utiliza o Supabase como backend para:
- Autenticação de usuários
- Armazenamento de dados (PostgreSQL)
- Funções serverless (Edge Functions)
- Storage (arquivos e imagens)

## Configuração Inicial

1. Crie uma conta no [Supabase](https://supabase.com) caso ainda não tenha.
2. Crie um novo projeto no Supabase.
3. Obtenha as credenciais de API (URL e Chave anônima) nas configurações do projeto.
4. Configure as variáveis de ambiente no seu projeto:

```
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

## Estrutura do Banco de Dados

Execute o script SQL fornecido em `src/lib/supabase-schema.sql` no editor SQL do Supabase para criar a estrutura do banco de dados.

O script inclui:
- Tabelas para empresas, usuários, projetos, tarefas, etc.
- Políticas de segurança RLS (Row Level Security)
- Funções e triggers necessários
- Dados iniciais de exemplo

## Edge Functions para Email

Crie as seguintes Edge Functions no Supabase:

### 1. Função `send-email`

Esta função envia emails utilizando as configurações SMTP da empresa.

```typescript
// supabase/functions/send-email/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

interface EmailRequestBody {
  to: string;
  subject: string;
  body: string;
  companyId: string;
}

serve(async (req) => {
  try {
    const { to, subject, body, companyId } = await req.json() as EmailRequestBody;
    
    if (!to || !subject || !body || !companyId) {
      return new Response(JSON.stringify({ 
        error: 'Parâmetros incompletos'
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400
      });
    }
    
    // Inicializar cliente Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Buscar configurações SMTP da empresa
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('smtp_host, smtp_port, smtp_user, smtp_pass, smtp_from')
      .eq('id', companyId)
      .single();
      
    if (companyError || !company || !company.smtp_host) {
      return new Response(JSON.stringify({ 
        error: 'Configurações SMTP não encontradas'
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 404
      });
    }
    
    // Configurar cliente SMTP
    const client = new SmtpClient();
    await client.connectTLS({
      hostname: company.smtp_host,
      port: company.smtp_port || 587,
      username: company.smtp_user,
      password: company.smtp_pass,
    });
    
    // Enviar email
    await client.send({
      from: company.smtp_from,
      to: to,
      subject: subject,
      content: body,
    });
    
    await client.close();
    
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Email enviado com sucesso'
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: `Erro ao enviar email: ${error.message}`
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
})
```

### 2. Função `test-smtp`

Esta função testa as configurações SMTP.

```typescript
// supabase/functions/test-smtp/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
  secure: boolean;
}

interface TestSmtpRequestBody {
  config: SmtpConfig;
  to: string;
  subject: string;
  text: string;
}

serve(async (req) => {
  try {
    const { config, to, subject, text } = await req.json() as TestSmtpRequestBody;
    
    if (!config || !to || !subject || !text) {
      return new Response(JSON.stringify({ 
        error: 'Parâmetros incompletos'
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400
      });
    }
    
    // Configurar cliente SMTP
    const client = new SmtpClient();
    await client.connectTLS({
      hostname: config.host,
      port: config.port,
      username: config.user,
      password: config.pass,
    });
    
    // Enviar email de teste
    await client.send({
      from: config.from,
      to: to,
      subject: subject,
      content: text,
    });
    
    await client.close();
    
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Teste de email enviado com sucesso'
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: `Erro ao testar SMTP: ${error.message}`
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
})
```

## Permissões e Segurança

O sistema utiliza políticas RLS (Row Level Security) do Supabase para garantir que:

1. Usuários só possam acessar dados da sua própria empresa
2. Determinadas ações só possam ser executadas por usuários com papel de administrador
3. Senhas e informações sensíveis sejam armazenadas de forma segura

## Fluxo de Autenticação

O sistema implementa um fluxo de login sem senha, utilizando códigos temporários enviados por email:

1. Usuário informa email e código da empresa
2. Sistema verifica se o usuário existe para aquela empresa
3. Sistema gera um código de acesso e envia por email
4. Usuário informa o código recebido
5. Sistema valida o código e autentica o usuário

## Cadastro de Usuários

O cadastro de novos usuários pode ser feito de duas formas:

1. **Auto-cadastro**: Se a empresa permitir (configuração `allow_signup` = true)
2. **Criação por administrador**: Administradores podem adicionar usuários diretamente

Quando um novo usuário se cadastra, o sistema envia os dados para o webhook configurado pela empresa (se disponível).
