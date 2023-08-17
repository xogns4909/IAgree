import React from 'react';
import Pagination from 'react-js-pagination';

interface MyPaginationProps {
  currentPage: number;
  itemsCount: number;
  itemsPerPage: number;
  onChange: (pageNumber: number) => void;
}

const MyPagination: React.FC<MyPaginationProps> = ({
  currentPage,
  itemsCount,
  itemsPerPage,
  onChange,
}) => {
  const totalPages = Math.ceil(itemsCount / itemsPerPage);

  return totalPages > 0 ? (
    <Pagination
      activePage={currentPage}
      itemsCountPerPage={itemsPerPage}
      totalItemsCount={itemsCount}
      pageRangeDisplayed={5}
      onChange={onChange}
      hideFirstLastPages={true}
      hideDisabled={true}
      itemClass="page-item"
      linkClass="page-link"
    />
  ) : null;
};

export default MyPagination;
