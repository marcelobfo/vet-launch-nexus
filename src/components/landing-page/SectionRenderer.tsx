import React from 'react';
import PageHeader from './PageHeader';
import PageText from './PageText';
import PageCTA from './PageCTA';
import LeadForm from './LeadForm';
import { LandingPageSection } from '@/types';

interface SectionRendererProps {
  sections?: LandingPageSection[];
  section?: LandingPageSection;
  index?: number;
  pageId: string;
  companyCode: string;
  pageTitle: string;
  pageSlug: string;
}

const SectionRenderer: React.FC<SectionRendererProps> = ({ 
  sections, 
  section,
  pageId, 
  companyCode,
  pageTitle,
  pageSlug
}) => {
  // If a single section is provided, render just that one
  if (section) {
    switch (section.type) {
      case 'header':
        return <PageHeader content={section.content} />;

      case 'text':
        return <PageText content={section.content} />;

      case 'cta':
        return <PageCTA content={section.content} />;

      case 'form':
        return (
          <LeadForm
            pageId={pageId}
            companyCode={companyCode}
            pageTitle={pageTitle}
            pageSlug={pageSlug}
            formContent={section.content}
          />
        );

      default:
        return <div>Tipo de seção não suportado: {section.type}</div>;
    }
  }
  
  // Otherwise process sections array to render them correctly
  return (
    <div className="flex flex-col space-y-8">
      {sections?.map((section, index) => {
        switch (section.type) {
          case 'header':
            return <PageHeader key={index} content={section.content} />;

          case 'text':
            return <PageText key={index} content={section.content} />;

          case 'cta':
            return <PageCTA key={index} content={section.content} />;

          case 'form':
            return (
              <LeadForm
                key={index}
                pageId={pageId}
                companyCode={companyCode}
                pageTitle={pageTitle}
                pageSlug={pageSlug}
                formContent={section.content}
              />
            );

          default:
            return <div key={index}>Tipo de seção não suportado: {section.type}</div>;
        }
      })}
    </div>
  );
};

export default SectionRenderer;
