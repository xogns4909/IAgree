import React, { useEffect, useState } from 'react';
import { DesktopHeader, MobileHeader, Mobile } from '../../mediaQuery';
import './mypageContents.scss';
import MyPagination from './components/MyPagination';
import { detailCount, preViewBoard, preViewReply } from 'apis/api/MyPageAPI';
import {
  type DetailCountResponse,
  type PreViewBoardResponse,
  type PreViewReplyResponse,
} from 'interfaces/MyPageTypes';
import { type UserInfoType } from './interfaces/MypageInterface';
import { useNavigate } from 'react-router-dom';

interface State {
  boardId: string;
  userInfomation: UserInfoType;
}

const MypageContents = (props: UserInfoType) => {
  const userInfomation = props;
  const [content, setContent] = useState<string>('board');
  const [currentPage, setCurrentpage] = useState(1);
  const [postPerPage, setPostPerPage] = useState(6);
  const [replycurrentPage, setReplyCurrentpage] = useState(1);
  const [replypostPerPage, setReplyPostPerPage] = useState(6);
  const [contentCount, setContentCount] = useState<DetailCountResponse>();
  const [boardList, setBoardList] = useState<PreViewBoardResponse>();
  const [replyList, setReplyList] = useState<PreViewReplyResponse>();
  const navigate = useNavigate();

  const handleBoardPageChange = (e: any) => {
    setCurrentpage(e);
  };
  const handleReplyPageChange = (e: any) => {
    setReplyCurrentpage(e);
  };
  useEffect(() => {
    if (props?.memberId) {
      detailCount(props.memberId)
        .then(res => {
          setContentCount(res);
        })
        .catch(err => {
          console.error(err);
        });
      preViewBoard(props.memberId, currentPage - 1, postPerPage)
        .then(res => {
          setBoardList(res);
        })
        .catch(err => {
          console.error(err);
        });
      preViewReply(props.memberId, replycurrentPage - 1, replypostPerPage)
        .then(res => {
          setReplyList(res);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }, [currentPage, replycurrentPage]);

  const handleClickDetail = (e: any) => {
    e.stopPropagation();
    const value = e.target.id;
    const propsState: State = { boardId: value, userInfomation };
    navigate(`/board/detail/${propsState.boardId}`, { state: propsState });
  };
  return (
    <>
      <DesktopHeader>
        <div className="mypagecontents-container">
          <h2>게시글/댓글</h2>
          <div className="mypagecontents-bordercontainer">
            <div
              onClick={() => {
                setContent('board');
              }}
              className={
                content === 'board'
                  ? 'mypagecontents-borderbuttonboard mypagecontents-borderbuttonboardactive'
                  : 'mypagecontents-borderbuttonboard'
              }
            >
              게시글 ({contentCount?.boardWriteCount})
            </div>
            <div
              onClick={() => {
                setContent('reply');
              }}
              className={
                content === 'reply'
                  ? 'mypagecontents-borderbuttonreply mypagecontents-borderbuttonreplyactive'
                  : 'mypagecontents-borderbuttonreply'
              }
            >
              댓글 ({contentCount?.boardReplyWriteCount})
            </div>
          </div>
          {content === 'board' && (
            <>
              <table className="mypagecontents-boardtable">
                <thead>
                  <tr>
                    <th>제목</th>
                    <th>작성일</th>
                    <th>조회수</th>
                    <th>좋아요</th>
                  </tr>
                </thead>
                <tbody>
                  {boardList?.content?.map((board, index) => (
                    <tr key={`board-${board.boardId}-${index}`}>
                      <td
                        id={board.boardId.toString()}
                        onClick={handleClickDetail}
                        style={{
                          cursor: 'pointer',
                          textDecoration: 'none',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                        onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
                      >
                        {board.title}
                      </td>
                      <td>{board.writeDate}</td>
                      <td>{board.viewCount}</td>
                      <td>{board.likedCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mypagecontents-pagenation">
                {boardList?.totalElements !== undefined && (
                  <MyPagination
                    currentPage={currentPage}
                    itemsCount={boardList.totalElements}
                    itemsPerPage={postPerPage}
                    onChange={handleBoardPageChange}
                  />
                )}
              </div>
            </>
          )}

          {content === 'reply' && (
            <>
              <table className="mypagecontents-boardtable">
                <thead>
                  <tr>
                    <th>내용</th>
                    <th>작성일</th>
                    <th>좋아요</th>
                  </tr>
                </thead>
                <tbody>
                  {replyList?.content?.map((reply, index) => (
                    <tr key={`reply-${reply.boardId}-${index}`}>
                      <td
                        id={reply.boardId.toString()}
                        onClick={handleClickDetail}
                        style={{
                          cursor: 'pointer',
                          textDecoration: 'none',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                        onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
                      >
                        {reply.content}
                      </td>
                      <td>{reply.writeDate}</td>
                      <td>{reply.likedCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mypagecontents-pagenation">
                {replyList?.totalElements !== undefined && (
                  <MyPagination
                    currentPage={replycurrentPage}
                    itemsCount={replyList.totalElements}
                    itemsPerPage={replypostPerPage}
                    onChange={handleReplyPageChange}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </DesktopHeader>
      <MobileHeader>
        <div className="tablet-mypagecontents-container">
          <h2>게시글/댓글</h2>
          <div className="tablet-mypagecontents-bordercontainer">
            <div
              onClick={() => {
                setContent('board');
              }}
              className={
                content === 'board'
                  ? 'tablet-mypagecontents-borderbuttonboard tablet-mypagecontents-borderbuttonboardactive'
                  : 'tablet-mypagecontents-borderbuttonboard'
              }
            >
              게시글 ({contentCount?.boardWriteCount})
            </div>
            <div
              onClick={() => {
                setContent('reply');
              }}
              className={
                content === 'reply'
                  ? 'tablet-mypagecontents-borderbuttonreply tablet-mypagecontents-borderbuttonreplyactive'
                  : 'tablet-mypagecontents-borderbuttonreply'
              }
            >
              댓글 ({contentCount?.boardReplyWriteCount})
            </div>
          </div>
          {content === 'board' && (
            <>
              <table className="tablet-mypagecontents-boardtable">
                <thead>
                  <tr>
                    <th>제목</th>
                    <th>작성일</th>
                    <th>조회수</th>
                    <th>좋아요</th>
                  </tr>
                </thead>
                <tbody>
                  {boardList?.content?.map((board, index) => (
                    <tr key={`board-${board.boardId}-${index}`}>
                      <td
                        id={board.boardId.toString()}
                        onClick={handleClickDetail}
                        style={{
                          cursor: 'pointer',
                          textDecoration: 'none',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                        onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
                      >
                        {board.title}
                      </td>
                      <td>{board.writeDate}</td>
                      <td>{board.viewCount}</td>
                      <td>{board.likedCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="tablet-mypagecontents-pagenation">
                {boardList?.totalElements !== undefined && (
                  <MyPagination
                    currentPage={currentPage}
                    itemsCount={boardList.totalElements}
                    itemsPerPage={postPerPage}
                    onChange={handleBoardPageChange}
                  />
                )}
              </div>
            </>
          )}

          {content === 'reply' && (
            <>
              <table className="tablet-mypagecontents-boardtable">
                <thead>
                  <tr>
                    <th>내용</th>
                    <th>작성일</th>
                    <th>좋아요</th>
                  </tr>
                </thead>
                <tbody>
                  {replyList?.content?.map((reply, index) => (
                    <tr key={`reply-${reply.boardId}-${index}`}>
                      <td
                        id={reply.boardId.toString()}
                        onClick={handleClickDetail}
                        style={{
                          cursor: 'pointer',
                          textDecoration: 'none',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                        onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
                      >
                        {reply.content}
                      </td>
                      <td>{reply.writeDate}</td>
                      <td>{reply.likedCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="tablet-mypagecontents-pagenation">
                {replyList?.totalElements !== undefined && (
                  <MyPagination
                    currentPage={replycurrentPage}
                    itemsCount={replyList.totalElements}
                    itemsPerPage={replypostPerPage}
                    onChange={handleReplyPageChange}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </MobileHeader>
      <Mobile>
        <div className="mobile-mypagecontents-container">
          <h2>게시글/댓글</h2>
          <div className="mobile-mypagecontents-bordercontainer">
            <div
              onClick={() => {
                setContent('board');
              }}
              className={
                content === 'board'
                  ? 'mobile-mypagecontents-borderbuttonboard mobile-mypagecontents-borderbuttonboardactive'
                  : 'mobile-mypagecontents-borderbuttonboard'
              }
            >
              게시글 ({contentCount?.boardWriteCount})
            </div>
            <div
              onClick={() => {
                setContent('reply');
              }}
              className={
                content === 'reply'
                  ? 'mobile-mypagecontents-borderbuttonreply mobile-mypagecontents-borderbuttonreplyactive'
                  : 'mobile-mypagecontents-borderbuttonreply'
              }
            >
              댓글 ({contentCount?.boardReplyWriteCount})
            </div>
          </div>
          {content === 'board' && (
            <>
              <table className="mobile-mypagecontents-boardtable">
                <thead>
                  <tr>
                    <th>제목</th>
                    <th>작성일</th>
                    <th>조회수</th>
                    <th>좋아요</th>
                  </tr>
                </thead>
                <tbody>
                  {boardList?.content?.map((board, index) => (
                    <tr key={`board-${board.boardId}-${index}`}>
                      <td
                        id={board.boardId.toString()}
                        onClick={handleClickDetail}
                        style={{
                          cursor: 'pointer',
                          textDecoration: 'none',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                        onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
                      >
                        {board.title}
                      </td>
                      <td>{board.writeDate}</td>
                      <td>{board.viewCount}</td>
                      <td>{board.likedCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mobile-mypagecontents-pagenation">
                {boardList?.totalElements !== undefined && (
                  <MyPagination
                    currentPage={currentPage}
                    itemsCount={boardList.totalElements}
                    itemsPerPage={postPerPage}
                    onChange={handleBoardPageChange}
                  />
                )}
              </div>
            </>
          )}

          {content === 'reply' && (
            <>
              <table className="mobile-mypagecontents-boardtable">
                <thead>
                  <tr>
                    <th>내용</th>
                    <th>작성일</th>
                    <th>좋아요</th>
                  </tr>
                </thead>
                <tbody>
                  {replyList?.content?.map((reply, index) => (
                    <tr key={`reply-${reply.boardId}-${index}`}>
                      <td
                        id={reply.boardId.toString()}
                        onClick={handleClickDetail}
                        style={{
                          cursor: 'pointer',
                          textDecoration: 'none',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                        onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
                      >
                        {reply.content}
                      </td>
                      <td>{reply.writeDate}</td>
                      <td>{reply.likedCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mobile-mypagecontents-pagenation">
                {replyList?.totalElements !== undefined && (
                  <MyPagination
                    currentPage={replycurrentPage}
                    itemsCount={replyList.totalElements}
                    itemsPerPage={replypostPerPage}
                    onChange={handleReplyPageChange}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </Mobile>
    </>
  );
};

export default MypageContents;
