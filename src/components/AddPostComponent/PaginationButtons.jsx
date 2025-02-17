import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const PaginationButtons = ({ page, totalPages, handlePrevPage, handleNextPage }) => (
  <div className="flex justify-between mt-4">
    <button
      type="button"
      onClick={handlePrevPage}
      disabled={page === 1}
      className={`w-10 h-10 bg-transparent flex items-center justify-center text-white hover:text-gray-300 transition-all duration-300 transform ${page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
    >
      <FontAwesomeIcon
        icon={faChevronLeft}
        className={`text-2xl ${page === 1 ? 'opacity-50' : 'hover:text-blue-500'}`}
      />
    </button>
    <button
      type="button"
      onClick={handleNextPage}
      disabled={page === totalPages}
      className={`w-10 h-10 bg-transparent flex items-center justify-center text-white hover:text-gray-300 transition-all duration-300 transform ${page === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
    >
      <FontAwesomeIcon
        icon={faChevronRight}
        className={`text-2xl ${page === totalPages ? 'opacity-50' : 'hover:text-blue-500'}`}
      />
    </button>
  </div>
);

export default PaginationButtons;