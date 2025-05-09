
import React from 'react';
import { Input } from "@/components/ui/input";
import { Search, X } from 'lucide-react';

interface LeadSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const LeadSearch: React.FC<LeadSearchProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative w-full sm:w-72">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
      <Input
        placeholder="Buscar por nome, email..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-8"
      />
      {searchQuery && (
        <button
          className="absolute right-2 top-2.5"
          onClick={() => setSearchQuery('')}
        >
          <X className="h-4 w-4 text-gray-400" />
        </button>
      )}
    </div>
  );
};

export default LeadSearch;
