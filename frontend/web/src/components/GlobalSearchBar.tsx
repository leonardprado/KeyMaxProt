import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GlobalSearchBarProps {
  onSearch?: (query: string) => void;
}

const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onSearch) {
        onSearch(searchQuery.trim());
      } else {
        // Navigate to a search results page or handle globally
        navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      }
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center space-x-2">
      <Input
        type="text"
        placeholder="Buscar productos, servicios..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-[300px]"
      />
      <Button type="submit" size="icon">
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default GlobalSearchBar;