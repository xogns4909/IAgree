import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire } from '@fortawesome/free-solid-svg-icons';
import { type BoardDataType, type BoardPropsType } from '../../../interfaces/BoardTypes';
import { useNavigate } from 'react-router-dom';

const MobileBoard = (props: BoardPropsType) => {
  const { currentPage, category, bestBoardItems, hotBoardItems, currentPosts, userInformation } =
    props;

  const navigate = useNavigate();

  const handleClickDetail = (e: any) => {
    e.stopPropagation();
    const boardId = e.target.id;

    navigate(`/board/detail/${boardId}`, { state: { boardId, ...userInformation } });
  };

  return (
    <div className="mobile-board-wrap">
      {currentPosts
        .filter((post: BoardDataType) => post.authentication === 'Y')
        .map((post: BoardDataType) => {
          return (
            <div
              id={post.boardId.toString()}
              key={post.boardId}
              className="board-table-div authentication-post"
              onClick={handleClickDetail}
            >
              <div
                id={post.boardId.toString()}
                onClick={handleClickDetail}
                className="board-underline"
              >
                <span id={post.boardId.toString()}>[{post.tag}]</span>
                <span id={post.boardId.toString()}>{post.title}</span>
                <span id={post.boardId.toString()} className="board-review-count">
                  {post.reviewCount}
                </span>
              </div>
              <div id={post.boardId.toString()} className="board-info">
                <div id={post.boardId.toString()} className="board-info-left">
                  <p id={post.boardId.toString()}>{post.nickname}</p>
                  <p id={post.boardId.toString()}>조회수</p>
                  <p id={post.boardId.toString()}>{post.view}</p>
                  <p id={post.boardId.toString()}>좋아요수</p>
                  <p id={post.boardId.toString()}>{post.likedCount}</p>
                </div>
                <div id={post.boardId.toString()} className="board-info-right">
                  <p id={post.boardId.toString()}>{post.writeDate}</p>
                </div>
              </div>
            </div>
          );
        })}
      {currentPage === 1 && category === 'ALL'
        ? bestBoardItems.map((post: BoardDataType) => {
            return (
              <div
                id={post.boardId.toString()}
                key={post.boardId}
                onClick={handleClickDetail}
                className="board-table-div"
              >
                <div
                  id={post.boardId.toString()}
                  onClick={handleClickDetail}
                  className="board-underline"
                >
                  <span id={post.boardId.toString()} className="best-cell">
                    BEST
                  </span>
                  <span id={post.boardId.toString()}>[{post.tag}]</span>
                  <span id={post.boardId.toString()}>{post.title}</span>
                  <span id={post.boardId.toString()} className="board-review-count">
                    {post.reviewCount}
                  </span>
                </div>
                <div id={post.boardId.toString()} className="board-info">
                  <div id={post.boardId.toString()} className="board-info-left">
                    <p id={post.boardId.toString()}>{post.nickname}</p>
                    <p id={post.boardId.toString()}>조회수</p>
                    <p id={post.boardId.toString()}>{post.view}</p>
                    <p id={post.boardId.toString()}>좋아요수</p>
                    <p id={post.boardId.toString()}>{post.likedCount}</p>
                  </div>
                  <div id={post.boardId.toString()} className="board-info-right">
                    <p id={post.boardId.toString()}>{post.writeDate}</p>
                  </div>
                </div>
              </div>
            );
          })
        : null}
      {currentPage === 1 && category === 'ALL'
        ? hotBoardItems.map((post: BoardDataType) => {
            return (
              <div
                id={post.boardId.toString()}
                key={post.boardId}
                onClick={handleClickDetail}
                className="board-table-div"
              >
                <div
                  id={post.boardId.toString()}
                  onClick={handleClickDetail}
                  className="board-underline"
                >
                  <span id={post.boardId.toString()} className="best-cell">
                    HOT <FontAwesomeIcon icon={faFire} />
                  </span>
                  <span id={post.boardId.toString()}>[{post.tag}] </span>
                  <span id={post.boardId.toString()}>{post.title}</span>
                  <span id={post.boardId.toString()} className="board-review-count">
                    {post.reviewCount}
                  </span>
                </div>
                <div id={post.boardId.toString()} className="board-info">
                  <div id={post.boardId.toString()} className="board-info-left">
                    <p id={post.boardId.toString()}>{post.nickname}</p>
                    <p id={post.boardId.toString()}>조회수</p>
                    <p id={post.boardId.toString()}>{post.view}</p>
                    <p id={post.boardId.toString()}>좋아요수</p>
                    <p id={post.boardId.toString()}>{post.likedCount}</p>
                  </div>
                  <div id={post.boardId.toString()} className="board-info-right">
                    <p id={post.boardId.toString()}>{post.writeDate}</p>
                  </div>
                </div>
              </div>
            );
          })
        : null}
      {!!currentPosts &&
        currentPosts
          .filter((post: BoardDataType) => post.authentication === 'N')
          .map((post: BoardDataType) => {
            return (
              <div
                id={post.boardId.toString()}
                key={post.boardId}
                onClick={handleClickDetail}
                className="board-table-div"
              >
                <div
                  id={post.boardId.toString()}
                  onClick={handleClickDetail}
                  className="board-underline"
                >
                  <span id={post.boardId.toString()}>[{post.tag}]</span>
                  <span id={post.boardId.toString()}>{post.title}</span>
                  <span id={post.boardId.toString()} className="board-review-count">
                    {post.reviewCount}
                  </span>
                </div>
                <div id={post.boardId.toString()} className="board-info">
                  <div id={post.boardId.toString()} className="board-info-left">
                    <p id={post.boardId.toString()}>{post.nickname}</p>
                    <p id={post.boardId.toString()}>조회수</p>
                    <p id={post.boardId.toString()}>{post.view}</p>
                    <p id={post.boardId.toString()}>좋아요수</p>
                    <p id={post.boardId.toString()}>{post.likedCount}</p>
                  </div>
                  <div id={post.boardId.toString()} className="board-info-right">
                    <p id={post.boardId.toString()}>{post.writeDate}</p>
                  </div>
                </div>
              </div>
            );
          })}
    </div>
  );
};

export default MobileBoard;
