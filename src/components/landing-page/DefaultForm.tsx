
import React from 'react';
import LeadForm from './LeadForm';
import { LandingPage } from '@/types';

interface DefaultFormProps {
  page: LandingPage;
  companyCode: string;
}

const DefaultForm: React.FC<DefaultFormProps> = ({ page, companyCode }) => {
  // Default form with standard header when no content is defined
  return (
    <>
      <header className="text-center py-12 px-4">
        <h1 className="text-4xl font-bold mb-4">{page.title}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Bem-vindo à nossa página
        </p>
      </header>
      
      <LeadForm 
        content={{}}
        pageId={page.id}
        companyCode={companyCode}
        pageTitle={page.title}
        pageSlug={page.slug}
      />
    </>
  );
};

export default DefaultForm;
