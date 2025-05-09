
import React from 'react';
import LeadForm from './LeadForm';

interface DefaultFormProps {
  pageId: string;
  companyCode: string;
  pageTitle: string;
  pageSlug: string;
}

const DefaultForm: React.FC<DefaultFormProps> = ({ 
  pageId, 
  companyCode, 
  pageTitle, 
  pageSlug 
}) => {
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
};

export default DefaultForm;
