import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setPagination } from '../../actions/dogsActions';

const Pagination = () => {
  const dispatch = useDispatch();
  const dogs = useSelector((state) => state.dogs.filteredDogs) || [];
  const pagination = useSelector((state) => state.dogs.pagination) || {};
  const { currentPage, dogsPerPage } = pagination;

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(dogs.length / dogsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handlePageClick = (pageNumber) => {
    dispatch(setPagination({ currentPage: pageNumber, dogsPerPage }));
  };

  return (
    <div className="pagination">
      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          onClick={() => handlePageClick(pageNumber)}
          className={pageNumber === currentPage ? 'active' : ''}
        >
          {pageNumber}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
