import React, { useState, useRef, useCallback } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Only search if query is 3+ characters or empty
    if (newQuery.trim().length === 0 || newQuery.trim().length >= 3) {
      timeoutRef.current = setTimeout(() => {
        onSearch(newQuery.trim());
      }, 400);
    }
  }, [onSearch]);

  return (
    <div className="search-container">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search financial products by name, institution, loan type, or SKU... (3+ characters)"
        className="search-input"
      />
      {query.trim().length > 0 && query.trim().length < 3 && (
        <div className="search-hint">Type at least 3 characters to search</div>
      )}
    </div>
  );
};

export default SearchBar;
