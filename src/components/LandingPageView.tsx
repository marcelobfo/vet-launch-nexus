import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { LandingPage, LandingPageSection } from '@/types';
import { Json } from '@supabase/supabase-js';

interface Company {
  id: string;
  name: string;
  code: string;
}

const LandingPageView = () => {
  const { companyCode, pageSlug } = useParams<{ companyCode: string; pageSlug: string }>();
  const [page, setPage] = useState<LandingPage | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (companyCode && pageSlug) {
      loadPage();
    }
  }, [companyCode, pageSlug]);

  const loadPage = async () => {
    try {
      setLoading(true);
      
      // Buscar empresa pelo código
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('code', companyCode)
        .eq('is_active', true)
        .single();
      
      if (companyError || !companyData) {
        console.error('Empresa não encontrada:', companyError);
        setError('Empresa não encontrada');
        setLoading(false);
        return;
      }
      
      setCompany(companyData);
      
      // Buscar landing page pelo slug
      const { data: pageData, error: pageError } = await supabase
        .from('landing_pages')
        .select('*')
        .eq('company_id', companyData.id)
        .eq('slug', pageSlug)
        .single();
      
      if (pageError || !pageData) {
        console.error('Página não encontrada:', pageError);
        setError('Página não encontrada');
        setLoading(false);
        return;
      }
      
      // Verificar se a página está publicada
      if (!pageData.published) {
        setError('Esta página não está disponível');
        setLoading(false);
        return;
      }
      
      // Processar o conteúdo
      let parsedContent: { sections: LandingPageSection[] };
      
      if (typeof pageData.content === 'string') {
        try {
          parsedContent = JSON.parse(pageData.content);
        } catch (e) {
          parsedContent = { sections: [] };
        }
      } else {
        const contentObj = pageData.content as any;
        
        // Verificar se já tem a estrutura correta
        if (contentObj.sections && Array.isArray(contentObj.sections)) {
          parsedContent = { sections: contentObj.sections };
        } else {
          // Criar estrutura vazia
          parsedContent = { sections: [] };
        }
      }
      
      // Criar um objeto formatado para o tipo LandingPage
      const formattedPage: LandingPage = {
        id: pageData.id,
        title: pageData.title,
        slug: pageData.slug,
        company_id: pageData.company_id,
        published: pageData.published,
        template_id: pageData.template_id || null,
        webhook_url: pageData.webhook_url || null,
        created_at: pageData.created_at || new Date().toISOString(),
        updated_at: pageData.updated_at || new Date().toISOString(),
        content: parsedContent
      };
      
      setPage(formattedPage);
    } catch (err) {
      console.error('Erro ao carregar página:', err);
      setError('Erro ao carregar a página');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email) {
      alert('Por favor, informe seu email');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Chamar a edge function para processar o lead
      const { data, error } = await supabase.functions.invoke('process-lead', {
        body: {
          email: formData.email,
          name: formData.name || null,
          phone: formData.phone || null,
          companyCode: companyCode,
          landingPageId: page?.id,
          source: 'landing-page',
          customFields: {
            page_slug: pageSlug,
            page_title: page?.title
          }
        }
      });
      
      if (error) throw error;
      
      setSubmitted(true);
    } catch (err) {
      console.error('Erro ao enviar formulário:', err);
      alert('Ocorreu um erro ao enviar o formulário. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  // Renderização de um componente com base no tipo
  const renderSection = (section: LandingPageSection, index: number) => {
    switch (section.type) {
      case 'header':
        return (
          <header key={index} className="text-center py-12 px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{section.content.title}</h1>
            {section.content.subtitle && (
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300">
                {section.content.subtitle}
              </p>
            )}
          </header>
        );
      
      case 'text':
        return (
          <div key={index} className="py-6 px-4 max-w-3xl mx-auto">
            <div 
              className="prose prose-lg dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: section.content.text }}
            />
          </div>
        );
      
      case 'cta':
        return (
          <div key={index} className="py-8 px-4 text-center">
            <a 
              href={section.content.buttonLink} 
              className="inline-block px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              {section.content.buttonText}
            </a>
          </div>
        );
      
      case 'form':
        return (
          <div key={index} className="py-8 px-4 max-w-md mx-auto">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center">
                  {section.content.title || "Preencha o formulário"}
                </h2>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Seu nome"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="(00) 00000-0000"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-70"
                >
                  {submitting ? "Enviando..." : section.content.buttonText || "Enviar"}
                </button>
              </form>
            ) : (
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mx-auto flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-green-800 dark:text-green-300 mt-4">
                  {section.content.successTitle || "Obrigado!"}
                </h3>
                <p className="text-green-700 dark:text-green-400 mt-2">
                  {section.content.successMessage || "Suas informações foram enviadas com sucesso."}
                </p>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-12 w-12 text-red-500 mx-auto mb-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{error}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            A página que você está procurando não está disponível ou não existe.
          </p>
          <a 
            href="/" 
            className="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Voltar ao início
          </a>
        </div>
      </div>
    );
  }

  if (!page || !company) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Conteúdo da página */}
      <main className="flex-grow">
        {page.content && page.content.sections?.map((section, index) => (
          renderSection(section, index)
        ))}
        
        {/* Se não houver seções, mostrar uma seção padrão */}
        {(!page.content || !page.content.sections || page.content.sections.length === 0) && (
          <>
            <header className="text-center py-12 px-4">
              <h1 className="text-4xl font-bold mb-4">{page.title}</h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Bem-vindo à nossa página
              </p>
            </header>
            
            <div className="py-8 px-4 max-w-md mx-auto">
              <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center">Cadastre-se</h2>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Seu nome"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="(00) 00000-0000"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-70"
                >
                  {submitting ? "Enviando..." : "Enviar"}
                </button>
              </form>
            </div>
          </>
        )}
      </main>
      
      {/* Rodapé */}
      <footer className="py-6 px-4 bg-gray-100 dark:bg-gray-800 text-center text-gray-600 dark:text-gray-400">
        <div className="max-w-7xl mx-auto">
          <p>&copy; {new Date().getFullYear()} {company.name}. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPageView;
