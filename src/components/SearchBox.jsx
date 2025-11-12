import React, { useState, useEffect } from 'react';
import { MdSearch, MdLocationOn, MdClose } from 'react-icons/md';
import { searchCities } from '../services/weatherAPI.js';
import { debounce } from '../utils/helpers.js';
import useWeatherStore from '../store/weatherStore.js';
import LoadingSpinner from './LoadingSpinner.jsx';

const SearchBox = ({ onLocationSelect, className = '' }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { setSearchQuery, setSearchResults, searchResults } = useWeatherStore();

  // Debounced search function
  const debouncedSearch = debounce(async (searchQuery) => {
    if (searchQuery.length < 2) {
      setResults([]);
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const cities = await searchCities(searchQuery);
      setResults(cities);
      setSearchResults(cities);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, 300);

  useEffect(() => {
    debouncedSearch(query);
  }, [query]);

  useEffect(() => {
    setSearchQuery(query);
  }, [query, setSearchQuery]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length > 0);
  };

  const handleLocationSelect = (location) => {
    setQuery(`${location.name}${location.state ? `, ${location.state}` : ''}, ${location.country}`);
    setIsOpen(false);
    setResults([]);
    onLocationSelect(location);
  };

  const clearSearch = () => {
    setQuery('');
    setIsOpen(false);
    setResults([]);
    setSearchResults([]);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(query.length > 0)}
          placeholder="Search for a city..."
          className="w-full pl-10 pr-10 py-3 bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <MdClose className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 glass rounded-xl shadow-xl max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-4">
              <LoadingSpinner size="sm" />
            </div>
          ) : results.length > 0 ? (
            <ul className="py-2">
              {results.map((location, index) => (
                <li key={`${location.lat}-${location.lon}-${index}`}>
                  <button
                    onClick={() => handleLocationSelect(location)}
                    className="w-full px-4 py-3 text-left hover:bg-white/10 dark:hover:bg-black/10 transition-colors duration-150 flex items-center space-x-3"
                  >
                    <MdLocationOn className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-gray-900 dark:text-white font-medium">
                        {location.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {location.state && `${location.state}, `}{location.country}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-gray-600 dark:text-gray-400">
              No cities found
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
