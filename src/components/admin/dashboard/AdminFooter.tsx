
import React from 'react';

const AdminFooter = () => {
  return (
    <footer className="border-t border-border py-4 px-4">
      <div className="container mx-auto text-sm text-gray-500 flex justify-between items-center">
        <p>© {new Date().getFullYear()} Gerenciador de Lançamentos</p>
        <p className="text-gray-400">Versão 1.0.0</p>
      </div>
    </footer>
  );
};

export default AdminFooter;
