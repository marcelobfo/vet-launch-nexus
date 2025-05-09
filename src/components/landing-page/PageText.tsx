
import React from 'react';
import { LandingPageSection } from '@/types';

interface TextSectionProps {
  content: LandingPageSection['content'];
}

const PageText: React.FC<TextSectionProps> = ({ content }) => {
  return (
    <div className="py-6 px-4 max-w-3xl mx-auto">
      <div 
        className="prose prose-lg dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: content.text }}
      />
    </div>
  );
};

export default PageText;
