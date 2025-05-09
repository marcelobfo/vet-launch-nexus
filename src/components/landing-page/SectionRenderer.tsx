
import React from 'react';
import PageHeader from './PageHeader';
import PageText from './PageText';
import PageCTA from './PageCTA';
import LeadForm from './LeadForm';

interface SectionRendererProps {
  sections: any[];
  pageId: string;
  companyCode: string;
  pageTitle: string;
  pageSlug: string;
}

const SectionRenderer: React.FC<SectionRendererProps> = ({ 
  sections, 
  pageId, 
  companyCode,
  pageTitle,
  pageSlug
}) => {
  // Process sections to render them correctly
  return (
    <div className="flex flex-col space-y-8">
      {sections.map((section, index) => {
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
