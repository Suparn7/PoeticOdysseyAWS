import React from 'react';

const Pagination = ({ currentPage, totalPages, handlePageChange }) => {
  const visiblePages = [];
  const maxPages = 5;
  let startPage = Math.max(currentPage - Math.floor(maxPages / 2), 1);
  let endPage = startPage + maxPages - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(endPage - maxPages + 1, 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    visiblePages.push(i);
  }

  return (
    <div className="pagination">
      {currentPage > 1 && (
        <button className="page-button" onClick={() => handlePageChange(currentPage - 1)}>
          Prev
        </button>
      )}

      {visiblePages.map((page) => (
        <button
          key={page}
          className={`page-button ${currentPage === page ? 'active' : ''}`}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
      ))}

      {currentPage < totalPages && (
        <button className="page-button" onClick={() => handlePageChange(currentPage + 1)}>
          Next
        </button>
      )}
    </div>
  );
};

export default Pagination;