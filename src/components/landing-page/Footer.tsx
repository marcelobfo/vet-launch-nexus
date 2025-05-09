
import React from 'react';
import { Company } from '@/types';

interface FooterProps {
  company: Company;
}

const Footer: React.FC<FooterProps> = ({ company }) => {
  return (
    <footer className="py-6 px-4 bg-gray-100 dark:bg-gray-800 text-center text-gray-600 dark:text-gray-400">
      <div className="max-w-7xl mx-auto">
        <p>&copy; {new Date().getFullYear()} {company.name}. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
