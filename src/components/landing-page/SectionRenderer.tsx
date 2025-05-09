
import React from 'react';
import { LandingPageSection } from '@/types';
import PageHeader from './PageHeader';
import PageText from './PageText';
import PageCTA from './PageCTA';
import LeadForm from './LeadForm';

interface SectionRendererProps {
  section: LandingPageSection;
  index: number;
  pageId: string;
  companyCode: string;
  pageTitle: string;
  pageSlug: string;
}

const SectionRenderer: React.FC<SectionRendererProps> = ({ 
  section, 
  index, 
  pageId, 
  companyCode, 
  pageTitle, 
  pageSlug 
}) => {
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
          content={section.content}
          pageId={pageId}
          companyCode={companyCode}
          pageTitle={pageTitle}
          pageSlug={pageSlug}
        />
      );
    
    default:
      return null;
  }
};

export default SectionRenderer;
