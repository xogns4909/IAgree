import React, { useEffect, useState } from 'react';
import { postBoardCategory } from '../../apis/api/BoardAPI';
import { type BoardDataType } from '../../interfaces/BoardTypes';
import NoticeAndService from 'components/common/NoticeAndService';
import Swal from 'sweetalert2';
import { useLocation } from 'react-router-dom';

export const Notice = () => {
  const [items, setItems] = useState<BoardDataType[]>([]);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage, setPostPerPage] = useState(0);

  const location = useLocation();
  const userInformation = { ...location.state };

  const noticeHeader: string[] = ['title', 'writeDate'];

  const handlePageChange = (e: React.SetStateAction<number>) => {
    setCurrentPage(e);
  };

  const handlePostBoardApi = (search: string = '') => {
    postBoardCategory('ANNOUNCEMENT', currentPage, 12, search)
      .then(response => {
        setItems(response.data.content);
        setPostPerPage(response.data.pageable.pageSize);
        setCount(response.data.totalElements);
      })
      .catch(() => {
        Swal.fire(
          '서버 통신 실패',
          '공지사항 목록 불러오기를 실패하였습니다. 다시 시도해 주세요.',
          'error',
        );
      });
  };

  useEffect(() => {
    handlePostBoardApi();
  }, [currentPage]);

  return (
    <NoticeAndService
      items={items}
      currentPage={currentPage}
      count={count}
      handlePageChange={handlePageChange}
      postPerPage={postPerPage}
      pageTitle="공지사항"
      tableHeader={noticeHeader}
      handlePostBoardApi={handlePostBoardApi}
      userInformation={userInformation}
    />
  );
};

export default Notice;
