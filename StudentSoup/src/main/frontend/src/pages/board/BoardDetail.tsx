import './boardDetail.scss';
import left from 'assets/images/left.svg';
import review_white from 'assets/images/review_white.svg';
import heart_white from 'assets/images/heart_white.svg';
import heart_border_white from 'assets/images/heart_border_white.svg';
import BoardBestReview from '../../components/boards/BoardBestReview';
import BoardReview from '../../components/boards/BoardReview';
import { Desktop, Mobile } from 'mediaQuery';
import { useEffect, useState } from 'react';
import axiosInstance from 'apis/utils/AxiosInterceptor';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import DOMPurify from 'dompurify';

const BoardDetail = () => {
  const [boardTitle, setBoardTitle] = useState<string>();
  const [boardNickname, setBoardNickname] = useState<string>();
  const [boardContent, setBoardContent] = useState<string>('');
  const [boardreviewCount, setBoardreviewCount] = useState<number>();
  const [boardlikeCount, setBoardlikeCount] = useState<number>();
  const [boardLiked, isBoardLiked] = useState<boolean>();
  const [boardView, setBoardView] = useState<number>();
  const [boardDate, setBoardDate] = useState<any>();
  const [isCategory, setCategory] = useState<string>();
  const [viewCategory, setViewCategory] = useState<string>();
  const [reply, setReply] = useState<number>(0);
  const [like, isLike] = useState<boolean>();
  const [likeCount, setLikeCount] = useState<number>();

  const state = useLocation();
  const navigate = useNavigate();

  const [boardReviewList, setBoardReviewList] = useState<any>([]);
  const [boardBestReviewList, setBoardBestReviewList] = useState<any>([]);

  const [replyContent, setReplyContent] = useState<string>();

  const userInfo = state.state;
  const getBoardId = Number(userInfo.boardId);

  const purifyBoardContent = DOMPurify.sanitize(boardContent);

  const Toast = Swal.mixin({
    toast: true,
    position: 'bottom',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });
  const memberId = userInfo.userInfomation ? userInfo.userInfomation.memberId : userInfo.memberId;

  useEffect(() => {
    axiosInstance
      .post(`/board/detail/${getBoardId}/${memberId}`)
      .then(res => {
        setBoardTitle(res.data.title);
        setBoardContent(res.data.content);
        setBoardNickname(res.data.nickname);
        setBoardDate(res.data.writeDate);
        setBoardView(res.data.view);
        setBoardreviewCount(res.data.reviewCount);
        setBoardlikeCount(res.data.likedCount);
        setCategory(res.data.boardCategory);
        isLike(res.data.like);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (isCategory === 'FREE') {
      setViewCategory('자유게시판');
    } else if (isCategory === 'CONSULTING') {
      setViewCategory('취업/상담게시판');
    } else if (isCategory === 'TIP') {
      setViewCategory('팁게시판');
    } else if (isCategory === 'ANNOUNCEMENT') {
      setViewCategory('공지사항');
    } else if (isCategory === 'EMPLOYMENT') {
      setViewCategory('취업/상담게시판');
    }
  });

  const handleClickPostWriteButton = () => {
    navigate('/board/write', { state: { ...userInfo } });
  };
  useEffect(() => {
    axiosInstance
      .get(`/boardReplies/${getBoardId}/${memberId}`)
      .then(res => {
        setBoardReviewList(res.data.boardReplyList);
        setBoardBestReviewList(res.data.bestReplyList);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  const handleBoardLikeCount = () => {
    axiosInstance
      .post(`/board/${getBoardId}/${memberId}/like`)
      .then(res => {
        setLikeCount(res.data.data.likedCount);
        isLike(res.data.data.like);
        if (!like) {
          Toast.fire({
            icon: 'success',
            title: '좋아요를 눌렀어요.',
          });
        } else {
          Toast.fire({
            icon: 'success',
            title: '좋아요를 취소했어요.',
          });
        }
      })
      .catch(err => {
        console.error(err);
      });
    isLike(!like);
    isBoardLiked(!boardLiked);
  };

  const handleReplyContent = (e: any) => {
    setReplyContent(e.target.value);
  };

  const handleSumbitReply = (e: any) => {
    if (!replyContent) {
      Swal.fire('등록 실패', '내용을 입력해주세요.', 'error');
      return;
    }
    if (replyContent.length < 2 || replyContent.length > 500) {
      Swal.fire('등록 실패', '댓글은 2자이상 500자 이하입니다.', 'error');
      return;
    }
    axiosInstance
      .put('/boardReply', {
        boardId: getBoardId,
        memberId,
        content: replyContent,
        level: 0,
        seq: reply,
      })
      .then(res => {
        Swal.fire('등록 성공', '성공적으로 댓글을 작성하였습니다.', 'success').then(result => {
          if (result.isConfirmed) {
            location.reload();
          }
        });
      })
      .catch(err => {
        console.error(err);
      });
  };

  const handleBoardDelete = () => {
    Swal.fire({
      title: '게시글 삭제',
      text: '정말로 게시글을 삭제하시겟습니까?',
      icon: 'warning',

      showCancelButton: true,
      confirmButtonColor: '#ff611d',
      cancelButtonColor: '#bcbcbc',
      confirmButtonText: '확인',
      cancelButtonText: '취소',
    }).then(result => {
      if (result.isConfirmed) {
        axiosInstance
          .delete(`/board/${getBoardId}/${memberId}`)
          .then(res => {
            Swal.fire('삭제 성공', '게시글이 삭제되었습니다.', 'success');
            navigate(-1);
          })
          .catch(err => {
            console.error(err);
            Swal.fire('삭제 실패', '작성자만 삭제할 수 있습니다.', 'error');
          });
      }
    });
  };

  const handleBoardEdit = () => {
    Swal.fire({
      title: '게시글 수정',
      text: '정말로 게시글을 수정하시겠습니까?',
      icon: 'warning',

      showCancelButton: true,
      confirmButtonColor: '#ff611d',
      cancelButtonColor: '#bcbcbc',
      confirmButtonText: '확인',
      cancelButtonText: '취소',
    })
      .then(result => {
        if (result.isConfirmed) {
          navigate('/board/write', { state: { getBoardId, userInfo } });
        }
      })
      .catch(err => {
        console.error(err);
        Swal.fire('오류', '작성자만 수정할 수 있습니다.', 'error');
      });
  };

  const handleGoBack = (e: any) => {
    navigate(-1);
  };

  return (
    <>
      <Desktop>
        <div>
          <div className="board-detail-main">
            <div className="board-detail-top-div">
              <div className="board-detail-top">
                <div className="board-detail-top-left">
                  <img src={left} alt="" onClick={handleGoBack} />
                  <span>{viewCategory}</span>
                </div>
                <div className="board-detail-top-right">
                  <button className="board-detail-write-div" onClick={handleClickPostWriteButton}>
                    <img src={review_white} alt="" />
                    <p>글쓰기</p>
                  </button>
                </div>
              </div>
            </div>
            <div className="board-detail-mid-div">
              <div className="board-detail-mid-title-div">
                <div className="board-detail-mid-title">
                  <span>{boardTitle}</span>
                  <p>{boardreviewCount}</p>
                </div>
                <div className="board-detail-mid-title-info">
                  <p>
                    {boardNickname} | {boardDate} | {boardView} | {boardlikeCount}
                  </p>
                </div>
                <div className="board-detail-underline" />
              </div>
              <div className="board-detail-content-div">
                <div className="board-detail-content">
                  <div dangerouslySetInnerHTML={{ __html: purifyBoardContent }}></div>
                </div>
                <div className="board-detail-like-button-div">
                  <button onClick={handleBoardLikeCount} className="board-detail-like-button">
                    {like ? (
                      <img src={heart_white} alt="" />
                    ) : (
                      <img src={heart_border_white} alt="" />
                    )}
                    <p>좋아요 {boardLiked ? likeCount : boardlikeCount}</p>
                  </button>
                </div>
              </div>
            </div>
            <div className="board-detail-bottom-div">
              <div className="board-detail-bottom-review-text">
                <div className="board-detail-bottom-review-count">
                  <p>댓글 {boardreviewCount}개</p>
                </div>
                {userInfo &&
                  (userInfo.userInfomation
                    ? userInfo.userInfomation.nickname
                    : userInfo.nickname) === boardNickname && (
                    <div className="board-detail-bottom-function">
                      <span onClick={handleBoardEdit} className="board-detail-bottom-modify">
                        수정
                      </span>
                      <span onClick={handleBoardDelete} className="board-detail-bottom-report">
                        삭제
                      </span>
                    </div>
                  )}
              </div>
              <div className="board-detail-bottom-review-write-div">
                <div className="board-detail-bottom-review-write">
                  <textarea
                    maxLength={500}
                    onChange={e => handleReplyContent(e)}
                    placeholder="댓글을 입력해주세요."
                  />
                  <button onClick={handleSumbitReply}>작성</button>
                </div>
              </div>
              {boardBestReviewList?.map((bestReview: any, index: number) => (
                <BoardBestReview
                  key={`bestReview-${index}`}
                  bestReview={bestReview}
                  memberId={userInfo.memberId}
                />
              ))}
              <BoardReview
                key={`boardReview-${getBoardId}`}
                review={boardReviewList}
                nickname={
                  userInfo.userInfomation ? userInfo.userInfomation.nickname : userInfo.nickname
                }
                memberId={
                  userInfo.userInfomation ? userInfo.userInfomation.memberId : userInfo.memberId
                }
                getBoardId={getBoardId}
              />
            </div>
          </div>
        </div>
      </Desktop>
      <Mobile>
        <div>
          <div className="board-detail-mobile-main">
            <div className="board-detail-mobile-top-div">
              <div className="board-detail-mobile-top">
                <div className="board-detail-mobile-top-left">
                  <img src={left} alt="" onClick={handleGoBack} />
                  <span>{viewCategory}</span>
                </div>
                <div className="board-detail-mobile-top-right">
                  <button
                    className="board-detail-mobile-write-div"
                    onClick={handleClickPostWriteButton}
                  >
                    <img src={review_white} alt="" />
                    <p>글쓰기</p>
                  </button>
                </div>
              </div>
            </div>
            <div className="board-detail-mobile-mid-div">
              <div className="board-detail-mobile-mid-title-div">
                <div className="board-detail-mobile-mid-title">
                  <span>{boardTitle}</span>
                  <p>{boardreviewCount}</p>
                </div>
                <div className="board-detail-mobile-mid-title-info">
                  <p>
                    {boardNickname} | {boardDate} | {boardView} | {boardlikeCount}
                  </p>
                </div>
                <div className="board-detail-mobile-underline" />
              </div>
              <div className="board-detail-mobile-content-div">
                <div className="board-detail-mobile-content">
                  <div dangerouslySetInnerHTML={{ __html: purifyBoardContent }}></div>
                </div>
                <div className="board-detail-mobile-like-button-div">
                  <button
                    onClick={handleBoardLikeCount}
                    className="board-detail-mobile-like-button"
                  >
                    {like ? (
                      <img src={heart_white} alt="" />
                    ) : (
                      <img src={heart_border_white} alt="" />
                    )}
                    <p>좋아요 {boardLiked ? likeCount : boardlikeCount}</p>
                  </button>
                </div>
              </div>
            </div>
            <div className="board-detail-mobile-bottom-div">
              <div className="board-detail-mobile-bottom-review-text">
                <div className="board-detail-mobile-bottom-review-count">
                  <p>댓글 {boardreviewCount}개</p>
                </div>
                {userInfo &&
                  (userInfo.userInfomation
                    ? userInfo.userInfomation.nickname
                    : userInfo.nickname) === boardNickname && (
                    <div className="board-detail-bottom-function">
                      <span onClick={handleBoardEdit} className="board-detail-bottom-modify">
                        수정
                      </span>
                      <span onClick={handleBoardDelete} className="board-detail-bottom-report">
                        삭제
                      </span>
                    </div>
                  )}
              </div>
              <div className="board-detail-mobile-bottom-review-write-div">
                <div className="board-detail-mobile-bottom-review-write">
                  <textarea
                    maxLength={500}
                    onChange={e => handleReplyContent(e)}
                    placeholder="댓글을 입력해주세요."
                  />
                  <button onClick={handleSumbitReply}>작성</button>
                </div>
              </div>
              {boardBestReviewList?.map((bestReview: any, index: number) => (
                <BoardBestReview
                  key={`bestReview-${index}`}
                  bestReview={bestReview}
                  memberId={userInfo.memberId}
                />
              ))}
              <BoardReview
                key={`boardReview-${getBoardId}`}
                review={boardReviewList}
                nickname={
                  userInfo.userInfomation ? userInfo.userInfomation.nickname : userInfo.nickname
                }
                memberId={
                  userInfo.userInfomation ? userInfo.userInfomation.memberId : userInfo.memberId
                }
                getBoardId={getBoardId}
              />
            </div>
          </div>
        </div>
      </Mobile>
    </>
  );
};

export default BoardDetail;
