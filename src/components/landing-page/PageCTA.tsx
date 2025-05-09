
import React from 'react';
import { LandingPageSection } from '@/types';

interface CTASectionProps {
  content: LandingPageSection['content'];
}

const PageCTA: React.FC<CTASectionProps> = ({ content }) => {
  return (
    <div className="py-8 px-4 text-center">
      <a 
        href={content.buttonLink} 
        className="inline-block px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
      >
        {content.buttonText}
      </a>
    </div>
  );
};

export default PageCTA;
