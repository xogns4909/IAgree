import React, { useEffect, useState } from 'react';
import { DesktopHeader, MobileHeader, Mobile } from '../../mediaQuery';
import RatingStars from './components/RatingStars';
import { preViewBoard, preViewReply, preViewReview } from 'apis/api/MyPageAPI';
import {
  type PreViewBoardResponse,
  type PreViewReplyResponse,
  type PreviewReviewResponse,
} from 'interfaces/MyPageTypes';
interface propTypes {
  handleSelectPage: (pagename: string) => void;
  memberId: number | undefined;
}
const MypagePreview = (props: propTypes) => {
  const [preViewBoardList, setPreViewBoardList] = useState<PreViewBoardResponse>();
  const [preViewReplyList, setPreViewReplyList] = useState<PreViewReplyResponse>();
  const [preViewReviewList, setPreViewReviewList] = useState<PreviewReviewResponse>();
  const onClickViewButton = () => {
    props.handleSelectPage('boardreply');
  };
  const onClickReviewButton = () => {
    props.handleSelectPage('review');
  };

  useEffect(() => {
    if (props?.memberId) {
      preViewBoard(props.memberId)
        .then(res => {
          console.log('게시글부분', res);
          setPreViewBoardList(res);
        })
        .catch(err => {
          console.error(err);
        });
      preViewReply(props.memberId)
        .then(res => {
          console.log('댓글부분', res);
          setPreViewReplyList(res);
        })
        .catch(err => {
          console.error(err);
        });
      preViewReview(props.memberId)
        .then(res => {
          setPreViewReviewList(res);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }, []);

  return (
    <>
      <DesktopHeader>
        <div className="mypagemain-contents">
          <div className="mypagemain-boardcontainer">
            <div className="mypagemain-boardmain">
              <div className="mypagemain-boardmainname">최근 리뷰</div>
              <div onClick={onClickReviewButton} className="mypagemain-boardallview">
                전체보기
              </div>
            </div>
            <table className="mypagemain-boardtable">
              <thead>
                <tr>
                  <th>제목</th>
                  <th>좋아요</th>
                  <th>평점</th>
                </tr>
              </thead>
              <tbody>
                {preViewReviewList?.content?.map((review, index) => (
                  <tr key={`review-${review.restaurantId}-${index}`}>
                    <td>
                      {review.content.length > 10
                        ? review.content.slice(0, 10) + '...'
                        : review.content}
                    </td>
                    <td>{review.likedCount}</td>
                    <td>
                      <RatingStars rating={review.starLiked} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mypagemain-boardcontainer">
            <div className="mypagemain-boardmain">
              <div className="mypagemain-boardmainname">최근 게시글</div>
              <div onClick={onClickViewButton} className="mypagemain-boardallview">
                전체보기
              </div>
            </div>
            <table className="mypagemain-boardtable">
              <thead>
                <tr>
                  <th>제목</th>
                  <th>작성일</th>
                  <th>좋아요</th>
                </tr>
              </thead>
              <tbody>
                {preViewBoardList?.content?.map((board, index) => (
                  <tr key={`board-${board.boardId}-${index}`}>
                    <td>
                      {board.title.length > 10 ? board.title.slice(0, 10) + '...' : board.title}
                    </td>
                    <td>{board.writeDate}</td>
                    <td>{board.likedCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mypagemain-boardcontainer">
            <div className="mypagemain-boardmain">
              <div className="mypagemain-boardmainname">최근 댓글</div>
              <div onClick={onClickViewButton} className="mypagemain-boardallview">
                전체보기
              </div>
            </div>
            <table className="mypagemain-boardtable">
              <thead>
                <tr>
                  <th>제목</th>
                  <th>작성일</th>
                  <th>좋아요</th>
                </tr>
              </thead>
              <tbody>
                {preViewReplyList?.content?.map((reply, index) => (
                  <tr key={`reply-${reply.boardId}-${index}`}>
                    <td>
                      {reply.content.length > 10
                        ? reply.content.slice(0, 10) + '...'
                        : reply.content}
                    </td>
                    <td>{reply.writeDate}</td>
                    <td>{reply.likedCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DesktopHeader>
      <MobileHeader>
        <div className="tablet-mypagemain-contents">
          <div className="tablet-mypagemain-boardcontainer">
            <div className="tablet-mypagemain-boardmain">
              <div className="tablet-mypagemain-boardmainname">최근 리뷰</div>
              <div onClick={onClickReviewButton} className="tablet-mypagemain-boardallview">
                전체보기
              </div>
            </div>
            <table className="tablet-mypagemain-boardtable">
              <thead>
                <tr>
                  <th>제목</th>
                  <th>좋아요</th>
                  <th>평점</th>
                </tr>
              </thead>
              <tbody>
                {preViewReviewList?.content?.map((review, index) => (
                  <tr key={`review-${review.restaurantId}-${index}`}>
                    <td>
                      {review.content.length > 10
                        ? review.content.slice(0, 10) + '...'
                        : review.content}
                    </td>
                    <td>{review.likedCount}</td>
                    <td>
                      <RatingStars rating={review.starLiked} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="tablet-mypagemain-boardcontainer">
            <div className="tablet-mypagemain-boardmain">
              <div className="tablet-mypagemain-boardmainname">최근 게시글</div>
              <div onClick={onClickViewButton} className="tablet-mypagemain-boardallview">
                전체보기
              </div>
            </div>
            <table className="tablet-mypagemain-boardtable">
              <thead>
                <tr>
                  <th>제목</th>
                  <th>작성일</th>
                  <th>좋아요</th>
                </tr>
              </thead>
              <tbody>
                {preViewBoardList?.content?.map((board, index) => (
                  <tr key={`board-${board.boardId}-${index}`}>
                    <td>
                      {board.title.length > 10 ? board.title.slice(0, 10) + '...' : board.title}
                    </td>
                    <td>{board.writeDate}</td>
                    <td>{board.likedCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="tablet-mypagemain-boardcontainer">
            <div className="tablet-mypagemain-boardmain">
              <div className="tablet-mypagemain-boardmainname">최근 댓글</div>
              <div onClick={onClickViewButton} className="tablet-mypagemain-boardallview">
                전체보기
              </div>
            </div>
            <table className="tablet-mypagemain-boardtable">
              <thead>
                <tr>
                  <th>제목</th>
                  <th>작성일</th>
                  <th>좋아요</th>
                </tr>
              </thead>
              <tbody>
                {preViewReplyList?.content?.map((reply, index) => (
                  <tr key={`reply-${reply.boardId}-${index}`}>
                    <td>
                      {reply.content.length > 10
                        ? reply.content.slice(0, 10) + '...'
                        : reply.content}
                    </td>
                    <td>{reply.writeDate}</td>
                    <td>{reply.likedCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </MobileHeader>
      <Mobile>
        <div className="mobile-mypagemain-contents">
          <div className="mobile-mypagemain-boardcontainer">
            <div className="mobile-mypagemain-boardmain">
              <div className="mobile-mypagemain-boardmainname">최근 리뷰</div>
              <div onClick={onClickReviewButton} className="mobile-mypagemain-boardallview">
                전체보기
              </div>
            </div>
            <table className="mobile-mypagemain-boardtable">
              <thead>
                <tr>
                  <th>제목</th>
                  <th>좋아요</th>
                  <th>평점</th>
                </tr>
              </thead>
              <tbody>
                {preViewReviewList?.content?.map((review, index) => (
                  <tr key={`review-${review.restaurantId}-${index}`}>
                    <td>
                      {review.content.length > 10
                        ? review.content.slice(0, 10) + '...'
                        : review.content}
                    </td>
                    <td>{review.likedCount}</td>
                    <td>
                      <RatingStars rating={review.starLiked} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mobile-mypagemain-boardcontainer">
            <div className="mobile-mypagemain-boardmain">
              <div className="mobile-mypagemain-boardmainname">최근 게시글</div>
              <div onClick={onClickViewButton} className="mobile-mypagemain-boardallview">
                전체보기
              </div>
            </div>
            <table className="mobile-mypagemain-boardtable">
              <thead>
                <tr>
                  <th>제목</th>
                  <th>작성일</th>
                  <th>좋아요</th>
                </tr>
              </thead>
              <tbody>
                {preViewBoardList?.content?.map((board, index) => (
                  <tr key={`board-${board.boardId}-${index}`}>
                    <td>
                      {board.title.length > 10 ? board.title.slice(0, 10) + '...' : board.title}
                    </td>
                    <td>{board.writeDate}</td>
                    <td>{board.likedCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mobile-mypagemain-boardcontainer">
            <div className="mobile-mypagemain-boardmain">
              <div className="mobile-mypagemain-boardmainname">최근 댓글</div>
              <div onClick={onClickViewButton} className="mobile-mypagemain-boardallview">
                전체보기
              </div>
            </div>
            <table className="mobile-mypagemain-boardtable">
              <thead>
                <tr>
                  <th>제목</th>
                  <th>작성일</th>
                  <th>좋아요</th>
                </tr>
              </thead>
              <tbody>
                {preViewReplyList?.content?.map((reply, index) => (
                  <tr key={`reply-${reply.boardId}-${index}`}>
                    <td>
                      {reply.content.length > 10
                        ? reply.content.slice(0, 10) + '...'
                        : reply.content}
                    </td>
                    <td>{reply.writeDate}</td>
                    <td>{reply.likedCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Mobile>
    </>
  );
};

export default MypagePreview;
