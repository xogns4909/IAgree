import React, { useEffect, useState } from 'react';
import { type PostSearchPropsType } from 'interfaces/BoardTypes';
import './postsearch.scss';
import { useNavigate } from 'react-router-dom';
import review_white from 'assets/images/review_white.svg';

const PostSearch = ({ pageTitle, handlePostBoardApi, userInformation }: PostSearchPropsType) => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const navigate = useNavigate();

  const selectBoxChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelected(e.target.value);
  };

  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setSearch(e.target.value.toLowerCase());
  };

  const postBoardApi = (search: string) => {
    handlePostBoardApi(search);
  };

  const onClickSearch = () => {
    postBoardApi(search);
  };

  const handleOnKeyDownEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      return onClickSearch();
    }
  };

  const handleClickPostWriteButton = () => {
    navigate('/board/write', { state: userInformation });
  };

  useEffect(() => {
    if (window.localStorage.getItem('access-token')) {
      setIsLogin(true);
    }
  }, []);

  return (
    <>
      <div className="search-container">
        <select key={selected} defaultValue={selected} onChange={selectBoxChange}>
          <option value="all">전체</option>
          <option value="title">제목</option>
        </select>
        <input
          type="search"
          placeholder="글 제목을 적어주세요"
          value={search}
          onChange={onChangeSearch}
          onKeyDown={handleOnKeyDownEnter}
        />
        <button className="search-button" onClick={onClickSearch}>
          검색
        </button>
        <div className="board-control-wrap">
          {pageTitle === '고객센터' && isLogin && (
            <button onClick={handleClickPostWriteButton}>
              <img src={review_white} alt="" />
              <p>글쓰기</p>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default PostSearch;
