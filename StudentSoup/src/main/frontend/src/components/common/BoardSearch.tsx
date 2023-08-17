import React from 'react';
import { Desktop, Mobile } from '../../mediaQuery';
import './boardsearch.scss';
import { type BoardSearchType } from '../../interfaces/BoardTypes';
import { useNavigate } from 'react-router-dom';
import review_white from 'assets/images/review_white.svg';

const BoardSearch = ({
  handleSearchButton,
  selected,
  setSelected,
  searched,
  setSearched,
  departmentId,
  userInformation,
}: BoardSearchType) => {
  const navigate = useNavigate();

  const selectBoxChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelected(e.target.value);
  };

  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setSearched(e.target.value.toLowerCase());
  };

  const onClickSearch = async () => {
    handleSearchButton(departmentId, selected === 'all' ? undefined : selected, searched);
  };

  const handleOnKeyDownEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onClickSearch();
    }
  };

  const handleClickPostWriteButton = () => {
    navigate('/board/write', { state: userInformation });
  };

  return (
    <>
      <Desktop>
        <div className="board-container-div">
          <div className="board-container">
            <select key={selected} defaultValue={selected} onChange={selectBoxChange}>
              <option value="all">전체</option>
              <option value="title">제목</option>
              <option value="content">내용</option>
              <option value="nickname">닉네임</option>
            </select>
            <input
              type="search"
              placeholder="글 제목, 내용을 적어주세요"
              value={searched}
              onChange={onChangeSearch}
              onKeyDown={handleOnKeyDownEnter}
            />
            <button className="board-button" onClick={onClickSearch}>
              검색
            </button>
          </div>
          <button className="board-write-button" onClick={handleClickPostWriteButton}>
            <img src={review_white} alt="" />
            <p>글쓰기</p>
          </button>
        </div>
      </Desktop>
      <Mobile>
        <>
          <div className="board-mobile-div">
            <div className="board-mobile-container">
              <select defaultValue={selected} onChange={selectBoxChange}>
                <option value="all">전체</option>
                <option value="title">제목</option>
                <option value="content">내용</option>
                <option value="nickname">닉네임</option>
              </select>
              <input
                type="search"
                placeholder="글 제목, 내용을 적어주세요"
                value={searched}
                onChange={onChangeSearch}
                onKeyDown={handleOnKeyDownEnter}
              />
              <button className="board-mobile-button" onClick={onClickSearch}>
                검색
              </button>
            </div>
          </div>
          <div className="board-mobile-button-wrap">
            <button className="board-mobile-write-button" onClick={handleClickPostWriteButton}>
              <img src={review_white} alt="" />
              <p>글쓰기</p>
            </button>
          </div>
        </>
      </Mobile>
    </>
  );
};

export default BoardSearch;
