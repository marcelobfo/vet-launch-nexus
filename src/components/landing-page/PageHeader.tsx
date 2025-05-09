
import React from 'react';
import { LandingPageSection } from '@/types';

interface HeaderSectionProps {
  content: LandingPageSection['content'];
}

const PageHeader: React.FC<HeaderSectionProps> = ({ content }) => {
  return (
    <header className="text-center py-12 px-4">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">{content.title}</h1>
      {content.subtitle && (
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300">
          {content.subtitle}
        </p>
      )}
    </header>
  );
};

export default PageHeader;
