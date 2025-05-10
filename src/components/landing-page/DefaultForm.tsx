
import React from 'react';
import LeadForm from './LeadForm';
import { LandingPage } from '@/types';

interface DefaultFormProps {
  pageId: string;
  companyCode: string;
  pageTitle: string;
  pageSlug: string;
}

const DefaultForm: React.FC<DefaultFormProps | { page: LandingPage; companyCode: string }> = (props) => {
  // Handle both types of props
  if ('page' in props) {
    const { page, companyCode } = props;
    return (
      <div className="max-w-md mx-auto">
        <LeadForm
          pageId={page.id}
          companyCode={companyCode}
          pageTitle={page.title}
          pageSlug={page.slug}
          formContent={{}}
        />
      </div>
    );
  } else {
    const { pageId, companyCode, pageTitle, pageSlug } = props;
    return (
      <div className="max-w-md mx-auto">
        <LeadForm
          pageId={pageId}
          companyCode={companyCode}
          pageTitle={pageTitle}
          pageSlug={pageSlug}
          formContent={{}}
        />
      </div>
    );
  }
};

export default DefaultForm;
