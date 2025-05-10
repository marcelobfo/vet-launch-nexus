
import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { LandingPage, Company } from '@/types';
import LoadingSpinner from './landing-page/LoadingSpinner';
import ErrorDisplay from './landing-page/ErrorDisplay';
import SectionRenderer from './landing-page/SectionRenderer';
import DefaultForm from './landing-page/DefaultForm';
import Footer from './landing-page/Footer';

const LandingPageView = () => {
  const { companyCode, pageSlug } = useParams<{ companyCode: string; pageSlug: string }>();
  const [page, setPage] = useState<LandingPage | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      let parsedContent: { sections: any[] };
      
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
        template_id: pageData.template_id || undefined,
        webhook_url: pageData.webhook_url || undefined,
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

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  if (!page || !company) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Conteúdo da página */}
      <main className="flex-grow">
        {page.content && page.content.sections && page.content.sections.length > 0 ? (
          <SectionRenderer
            sections={page.content.sections}
            pageId={page.id}
            companyCode={companyCode || ''}
            pageTitle={page.title}
            pageSlug={page.slug}
          />
        ) : (
          <DefaultForm
            pageId={page.id}
            companyCode={companyCode || ''}
            pageTitle={page.title}
            pageSlug={page.slug}
          />
        )}
      </main>
      
      {/* Rodapé */}
      <Footer company={company} />
    </div>
  );
};

export default LandingPageView;
