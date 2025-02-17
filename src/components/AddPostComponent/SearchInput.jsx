import React from 'react';
import Input from '../Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const SearchInput = ({ searchQuery, setSearchQuery, isImageSelectedFromPC, handleKeyDown }) => (
  <Input
    type="text"
    placeholder="Search for images (e.g., Nature)"
    label="Search images"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    disabled={isImageSelectedFromPC}
    onKeyDown={handleKeyDown}
    icon={<FontAwesomeIcon icon={faSearch} className="text-gray-400" />}
    className="mb-4 p-4 !bg-gray-800 text-white rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 hover:bg-gray-700 placeholder:text-gray-400"
  />
);

export default SearchInput;