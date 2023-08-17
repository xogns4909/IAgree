import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire } from '@fortawesome/free-solid-svg-icons';
import { type BoardDataType, type BoardPropsType } from '../../../interfaces/BoardTypes';
import { useNavigate } from 'react-router-dom';

const PCBoard = (props: BoardPropsType) => {
  const {
    currentPage,
    category,
    bestBoardItems,
    hotBoardItems,
    currentPosts,
    setSorted,
    userInformation,
  } = props;

  const handleClickSorted = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLDivElement;
    const sortedValue = parseInt(target.getAttribute('data-value')?.toString() ?? '');

    if (setSorted) {
      setSorted(sortedValue);
    }
  };

  const navigate = useNavigate();

  const handleClickDetail = (e: any) => {
    e.stopPropagation();
    const boardId = e.target.id;

    navigate(`/board/detail/${boardId}`, { state: { boardId, ...userInformation } });
  };

  return (
    <table className="board-table">
      <thead>
        <tr>
          <th className="board-title">제목</th>
          <th className="post-information">
            <div className="board-writer">작성자</div>
            <div className="board-write-date" data-value="2" onClick={handleClickSorted}>
              작성일
            </div>
            <div className="board-view-count" data-value="3" onClick={handleClickSorted}>
              조회수
            </div>
            <div className="board-like-count" data-value="1" onClick={handleClickSorted}>
              좋아요
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {currentPosts
          .filter((post: BoardDataType) => post.authentication === 'Y')
          .map((post: BoardDataType) => {
            return (
              <tr id={post.boardId.toString()} key={post.boardId} className="authentication-wrap">
                <td
                  id={post.boardId.toString()}
                  onClick={handleClickDetail}
                  className="board-title"
                >
                  [{post.tag}]&nbsp;
                  <span id={post.boardId.toString()} className="authentication-post">
                    {post.title}
                  </span>
                  <span className="board-review-count">{post.reviewCount}</span>
                </td>
                <td className="post-information">
                  <div className="board-writer">{post.nickname}</div>
                  <div className="board-write-date">{post.writeDate}</div>
                  <div className="board-view-count">{post.view}</div>
                  <div className="board-like-count">{post.likedCount}</div>
                </td>
              </tr>
            );
          })}
        {currentPage === 1 && category === 'ALL'
          ? bestBoardItems.map((post: BoardDataType) => {
              return (
                <tr id={post.boardId.toString()} key={post.boardId} className="best-post">
                  <td
                    id={post.boardId.toString()}
                    onClick={handleClickDetail}
                    className="board-title"
                  >
                    <span className="best-cell">BEST</span>[{post.tag}]&nbsp;
                    <span id={post.boardId.toString()}>{post.title}</span>
                    <span className="board-review-count">{post.reviewCount}</span>
                  </td>
                  <td className="post-information">
                    <div className="board-writer">{post.nickname}</div>
                    <div className="board-write-date">{post.writeDate}</div>
                    <div className="board-view-count">{post.view}</div>
                    <div className="board-like-count">{post.likedCount}</div>
                  </td>
                </tr>
              );
            })
          : null}
        {currentPage === 1 && category === 'ALL'
          ? hotBoardItems.map((post: BoardDataType) => {
              return (
                <tr id={post.boardId.toString()} key={post.boardId} className="best-post">
                  <td
                    id={post.boardId.toString()}
                    onClick={handleClickDetail}
                    className="board-title"
                  >
                    <span className="best-cell">
                      HOT &nbsp;
                      <FontAwesomeIcon icon={faFire} />
                    </span>
                    [{post.tag}]&nbsp;
                    <span id={post.boardId.toString()}>{post.title}</span>
                    <span className="board-review-count">{post.reviewCount}</span>
                  </td>
                  <td className="post-information">
                    <div className="board-writer">{post.nickname}</div>
                    <div className="board-write-date">{post.writeDate}</div>
                    <div className="board-view-count">{post.view}</div>
                    <div className="board-like-count">{post.likedCount}</div>
                  </td>
                </tr>
              );
            })
          : null}
        {!!currentPosts &&
          currentPosts
            .filter((post: BoardDataType) => post.authentication === 'N')
            .map((post: BoardDataType) => {
              return (
                <tr id={post.boardId.toString()} key={post.boardId} className="board-wrap">
                  <td
                    id={post.boardId.toString()}
                    onClick={handleClickDetail}
                    className="board-title"
                  >
                    [{post.tag}]&nbsp;
                    <span id={post.boardId.toString()}>{post.title}</span>
                    <span className="board-review-count">{post.reviewCount}</span>
                  </td>
                  <td className="post-information">
                    <div className="board-writer">{post.nickname}</div>
                    <div className="board-write-date">{post.writeDate}</div>
                    <div className="board-view-count">{post.view}</div>
                    <div className="board-like-count">{post.likedCount}</div>
                  </td>
                </tr>
              );
            })}
      </tbody>
    </table>
  );
};

export default PCBoard;
