import React from 'react';
import Pagination from 'react-js-pagination';
import './paginate.scss';

export interface PaginateType {
  page: number;
  count: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  postPerPage: number;
  hideFirstLastPages: boolean | undefined;
  hideDisabled: boolean | undefined;
}

const ReviewPaginate = ({
  page,
  count,
  setPage,
  postPerPage,
  hideFirstLastPages,
  hideDisabled,
}: PaginateType) => {
  return (
    <>
      <Pagination
        activePage={page}
        itemsCountPerPage={postPerPage}
        totalItemsCount={count}
        pageRangeDisplayed={5}
        prevPageText="<"
        nextPageText=">"
        onChange={setPage}
        hideFirstLastPages={true}
        hideDisabled={true}
      />
    </>
  );
};

export default ReviewPaginate;
