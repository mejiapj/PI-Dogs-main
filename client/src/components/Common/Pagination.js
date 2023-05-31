import React from 'react';
import './Pagination.css';

const Pagination = ({ currentPage, dogsPerPage, totalDogs, onChangePage }) => {
  const totalPages = Math.ceil(totalDogs / dogsPerPage);

  const handleClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      onChangePage(page);
    }
  };

  return (
    <div className="pagination">
      <p>
        Total results: {totalDogs} | Page: {currentPage} of {totalPages}
      </p>
      <div className="page-buttons">
        <button onClick={() => handleClick(currentPage - 1)}>prevPage</button>
        <button onClick={() => handleClick(currentPage + 1)}>nextPage</button>
      </div>
    </div>
  );
};

export default Pagination;
