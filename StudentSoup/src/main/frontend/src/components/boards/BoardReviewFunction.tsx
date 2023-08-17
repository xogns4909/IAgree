import { useEffect, useState } from 'react';
import './boardReviewFunction.scss';
import Circle_human from 'assets/images/circle_human.png';
import axiosInstance from 'apis/utils/AxiosInterceptor';
import { useNavigate } from 'react-router-dom';
import { Desktop, Mobile } from 'mediaQuery';
import Swal from 'sweetalert2';

interface Props {
  review: any;
  memberId: number;
  nickname: string;
  getBoardId: number;
}

const BoardReviewFunction = ({ review, memberId, getBoardId, nickname }: Props) => {
  const [modifyClick, setModifyClick] = useState<boolean>(false);
  const [saveBoardReplyId, setSaveBoardReplyId] = useState<any>();
  const [contented, setContented] = useState<string>('');
  const [addReply, setAddReply] = useState<boolean>(false);
  const [replyContented, setReplyContented] = useState<string>('');
  const [saveAddReplyId, setSaveAddReplyId] = useState<any>();
  const [reply, setReply] = useState<number>(0);

  const [like, isLike] = useState<boolean>(review.like);
  const [clicklike, isClickLike] = useState<boolean>();
  const [likeCount, setlikeCount] = useState<number>(review.likedCount);

  const navigate = useNavigate();

  useEffect(() => {
    isLike(review.like);
    setlikeCount(review.likedCount);
  }, [review]);

  const handleReplySetContentValue = (e: any) => {
    setContented(e.target.value);
  };

  const handleAddReplySetContentValue = (e: any) => {
    setReplyContented(e.target.value);
  };

  const Toast = Swal.mixin({
    toast: true,
    position: 'bottom',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  const handleEditClick = (e: any) => {
    setModifyClick(!modifyClick);
    setSaveBoardReplyId(e.target.id);

    axiosInstance
      .get(`/boardReply/${e.target.id}/${memberId}`)
      .then(res => {
        setContented(res.data.content);
      })
      .catch(err => {
        console.error(err);
      });
  };

  const handleEditReply = (e: any) => {
    if (!contented.length) {
      Swal.fire('등록 실패', '내용을 입력해주세요.', 'error');
      return;
    }
    if (contented.length < 2 || contented.length > 500) {
      Swal.fire('등록 실패', '댓글은 2자이상 500자 이하입니다.', 'error');
      return;
    }
    axiosInstance
      .patch(`/boardReply/${saveBoardReplyId}`, {
        boardReplyId: saveBoardReplyId,
        boardId: getBoardId,
        memberId,
        content: contented,
      })
      .then(res => {
        Swal.fire('수정 성공', '성공적으로 댓글을 수정하였습니다.', 'success').then(result => {
          if (result.isConfirmed) {
            location.reload();
          }
        });
      })
      .catch(err => {
        console.error(err);
      });
  };

  const handleClickAddReply = (e: any) => {
    setAddReply(!addReply);
    setSaveAddReplyId(e.target.id);
    setReply(review.seq);
  };

  const handleAddReply = (e: any) => {
    if (!replyContented.length) {
      Swal.fire('등록 실패', '내용을 입력해주세요.', 'error');
      return;
    }
    if (replyContented.length < 2 || replyContented.length > 500) {
      Swal.fire('등록 실패', '댓글은 2자이상 500자 이하입니다.', 'error');
      return;
    }
    axiosInstance
      .put('/boardReply', {
        boardReplyId: saveAddReplyId,
        boardId: getBoardId,
        memberId,
        content: replyContented,
        seq: reply,
        level: 1,
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

  const handleDeleteReply = (e: any) => {
    Swal.fire({
      title: '댓글삭제 시도',
      text: '정말로 댓글을 삭제하시겟습니까?',
      icon: 'warning',

      showCancelButton: true,
      confirmButtonColor: '#ff611d',
      cancelButtonColor: '#bcbcbc',
      confirmButtonText: '확인',
      cancelButtonText: '취소',
    }).then(result => {
      if (result.isConfirmed) {
        axiosInstance
          .delete(`/boardReply/${e.target.id}/${memberId}`)
          .then(res => {
            Swal.fire('삭제 성공', '성공적으로 댓글을 삭제하였습니다.', 'success').then(result => {
              if (result.isConfirmed) {
                location.reload();
              }
            });
          })
          .catch(err => {
            console.error(err);
          });
      }
    });
  };

  const handleHeartClick = async (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    if (!memberId) {
      if (confirm('로그인후 이용가능한 기능입니다. 로그인하시겠습니까?')) {
        navigate('/login');
      } else {
        /* empty */
      }
    } else {
      await axiosInstance.post(`/boardReply/${e.target.id}/${memberId}/like`).then(res => {
        isLike(res.data.data.like);
        setlikeCount(res.data.data.likeCount);
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
      });
      isClickLike(!clicklike);
      isLike(!like);
    }
  };
  return (
    <>
      <Desktop>
        <>
          <div className="board-detail-bottom-review">
            <div className="board-detail-bottom-review-left">
              <div className="board-detail-bottom-review-left-top">
                <img
                  src={
                    review.memberProfileImageName
                      ? `/image/${review.memberProfileImageName}`
                      : Circle_human
                  }
                  alt=""
                />
                <span>
                  {review.nickname} <p>{review.writeDate}</p>
                </span>
              </div>
              {modifyClick ? (
                <div id={review.boardReplyId} className="board-detail-bottom-review-modify-content">
                  <textarea
                    maxLength={500}
                    value={contented}
                    onChange={e => handleReplySetContentValue(e)}
                    placeholder="댓글을 입력해주세요."
                  ></textarea>
                  <button onClick={handleEditReply}>등록</button>
                </div>
              ) : (
                <p className="board-detail-bottom-review-content">{review.content}</p>
              )}
            </div>
            {nickname === review.nickname && (
              <div className="board-detail-function-div">
                <>
                  {modifyClick ? (
                    <span>
                      <p
                        id={review.boardReplyId}
                        onClick={handleEditClick}
                        className="board-detail-modify-cancel"
                      >
                        수정취소
                      </p>
                    </span>
                  ) : (
                    <span>
                      <p
                        id={review.boardReplyId}
                        onClick={handleEditClick}
                        className="board-detail-modify"
                      >
                        수정
                      </p>
                      |
                      <p
                        id={review.boardReplyId}
                        onClick={handleDeleteReply}
                        className="board-detail-delete"
                      >
                        삭제
                      </p>
                    </span>
                  )}
                </>
              </div>
            )}
          </div>
          {addReply ? (
            <div className="board-detail-bottom-review-right">
              <span id={review.boardReplyId} onClick={handleClickAddReply}>
                답글달기 취소
              </span>
              <div
                id={review.boardReplyId}
                onClick={handleHeartClick}
                className="board-detail-bottom-review-heart"
              >
                {like ? (
                  <svg
                    id={review.boardReplyId}
                    onClick={handleHeartClick}
                    className="board-detail-function-heart-icon"
                    width="17"
                    height="15"
                    viewBox="0 0 17 15"
                    fill="#FF611D"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      id={review.boardReplyId}
                      onClick={handleHeartClick}
                      d="M4.75 1C2.67893 1 1 2.61547 1 4.60825C1 6.21701 1.656 10.035 8.11563 13.8951C8.34955 14.035 8.65045 14.035 8.88437 13.8951C15.344 10.035 16 6.21701 16 4.60825C16 2.61547 14.321 1 12.25 1C10.179 1 8.5 3.18682 8.5 3.18682C8.5 3.18682 6.82107 1 4.75 1Z"
                      stroke="#FF611D"
                      strokeWidth="1.30715"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg
                    id={review.boardReplyId}
                    onClick={handleHeartClick}
                    className="restaurant-detail-bottom-review-list-item-heart"
                    width="17"
                    height="15"
                    viewBox="0 0 17 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      id={review.boardReplyId}
                      onClick={handleHeartClick}
                      d="M4.75 1C2.67893 1 1 2.61547 1 4.60825C1 6.21701 1.656 10.035 8.11563 13.8951C8.34955 14.035 8.65045 14.035 8.88437 13.8951C15.344 10.035 16 6.21701 16 4.60825C16 2.61547 14.321 1 12.25 1C10.179 1 8.5 3.18682 8.5 3.18682C8.5 3.18682 6.82107 1 4.75 1Z"
                      stroke="#ACACAC"
                      strokeWidth="1.30715"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                <p id={review.boardReplyId} onClick={handleHeartClick}>
                  {clicklike ? likeCount : review.likeCount}
                </p>
              </div>
            </div>
          ) : (
            <div className="board-detail-bottom-review-right">
              <span id={review.boardReplyId} onClick={handleClickAddReply}>
                답글달기
              </span>
              <div
                id={review.boardReplyId}
                onClick={handleHeartClick}
                className="board-detail-bottom-review-heart"
              >
                {like ? (
                  <svg
                    id={review.boardReplyId}
                    onClick={handleHeartClick}
                    className="board-detail-function-heart-icon"
                    width="17"
                    height="15"
                    viewBox="0 0 17 15"
                    fill="#FF611D"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      id={review.boardReplyId}
                      onClick={handleHeartClick}
                      d="M4.75 1C2.67893 1 1 2.61547 1 4.60825C1 6.21701 1.656 10.035 8.11563 13.8951C8.34955 14.035 8.65045 14.035 8.88437 13.8951C15.344 10.035 16 6.21701 16 4.60825C16 2.61547 14.321 1 12.25 1C10.179 1 8.5 3.18682 8.5 3.18682C8.5 3.18682 6.82107 1 4.75 1Z"
                      stroke="#FF611D"
                      strokeWidth="1.30715"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg
                    id={review.boardReplyId}
                    onClick={handleHeartClick}
                    className="restaurant-detail-bottom-review-list-item-heart"
                    width="17"
                    height="15"
                    viewBox="0 0 17 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      id={review.boardReplyId}
                      onClick={handleHeartClick}
                      d="M4.75 1C2.67893 1 1 2.61547 1 4.60825C1 6.21701 1.656 10.035 8.11563 13.8951C8.34955 14.035 8.65045 14.035 8.88437 13.8951C15.344 10.035 16 6.21701 16 4.60825C16 2.61547 14.321 1 12.25 1C10.179 1 8.5 3.18682 8.5 3.18682C8.5 3.18682 6.82107 1 4.75 1Z"
                      stroke="#ACACAC"
                      strokeWidth="1.30715"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                <p id={review.boardReplyId} onClick={handleHeartClick}>
                  {clicklike ? likeCount : review.likeCount}
                </p>
              </div>
            </div>
          )}
          {addReply ? (
            <div id={review.boardReplyId} className="board-detail-bottom-add-review-content">
              <textarea
                maxLength={500}
                value={replyContented}
                onChange={e => handleAddReplySetContentValue(e)}
                placeholder="댓글을 입력해주세요."
              ></textarea>
              <button onClick={handleAddReply}>등록</button>
            </div>
          ) : (
            <span></span>
          )}
        </>
      </Desktop>
      <Mobile>
        <>
          <div className="board-detail-mobile-bottom-review">
            <div className="board-detail-mobile-bottom-review-left">
              <div className="board-detail-mobile-bottom-review-left-top">
                <img
                  src={
                    review.memberProfileImageName
                      ? `/image/${review.memberProfileImageName}`
                      : Circle_human
                  }
                  alt=""
                />
                <span>
                  {review.nickname} <p>{review.writeDate}</p>
                </span>
              </div>
              {modifyClick ? (
                <div
                  id={review.boardReplyId}
                  className="board-detail-mobile-bottom-review-modify-content"
                >
                  <textarea
                    maxLength={500}
                    value={contented}
                    onChange={e => handleReplySetContentValue(e)}
                    placeholder="댓글을 입력해주세요."
                  ></textarea>
                  <button onClick={handleEditReply}>등록</button>
                </div>
              ) : (
                <p className="board-detail-mobile-bottom-review-content">{review.content}</p>
              )}
            </div>
            {nickname === review.nickname && (
              <div className="board-detail-function-div">
                <>
                  {modifyClick ? (
                    <span>
                      <p
                        id={review.boardReplyId}
                        onClick={handleEditClick}
                        className="board-detail-modify-cancel"
                      >
                        수정취소
                      </p>
                    </span>
                  ) : (
                    <span>
                      <p
                        id={review.boardReplyId}
                        onClick={handleEditClick}
                        className="board-detail-modify"
                      >
                        수정
                      </p>
                      |
                      <p
                        id={review.boardReplyId}
                        onClick={handleDeleteReply}
                        className="board-detail-delete"
                      >
                        삭제
                      </p>
                    </span>
                  )}
                </>
              </div>
            )}
          </div>
          {addReply ? (
            <div className="board-detail-bottom-review-right">
              <span id={review.boardReplyId} onClick={handleClickAddReply}>
                답글달기 취소
              </span>
              <div
                id={review.boardReplyId}
                onClick={handleHeartClick}
                className="board-detail-bottom-review-heart"
              >
                {like ? (
                  <svg
                    id={review.boardReplyId}
                    onClick={handleHeartClick}
                    className="board-detail-function-heart-icon"
                    width="17"
                    height="15"
                    viewBox="0 0 17 15"
                    fill="#FF611D"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      id={review.boardReplyId}
                      onClick={handleHeartClick}
                      d="M4.75 1C2.67893 1 1 2.61547 1 4.60825C1 6.21701 1.656 10.035 8.11563 13.8951C8.34955 14.035 8.65045 14.035 8.88437 13.8951C15.344 10.035 16 6.21701 16 4.60825C16 2.61547 14.321 1 12.25 1C10.179 1 8.5 3.18682 8.5 3.18682C8.5 3.18682 6.82107 1 4.75 1Z"
                      stroke="#FF611D"
                      strokeWidth="1.30715"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg
                    id={review.boardReplyId}
                    onClick={handleHeartClick}
                    className="restaurant-detail-bottom-review-list-item-heart"
                    width="17"
                    height="15"
                    viewBox="0 0 17 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      id={review.boardReplyId}
                      onClick={handleHeartClick}
                      d="M4.75 1C2.67893 1 1 2.61547 1 4.60825C1 6.21701 1.656 10.035 8.11563 13.8951C8.34955 14.035 8.65045 14.035 8.88437 13.8951C15.344 10.035 16 6.21701 16 4.60825C16 2.61547 14.321 1 12.25 1C10.179 1 8.5 3.18682 8.5 3.18682C8.5 3.18682 6.82107 1 4.75 1Z"
                      stroke="#ACACAC"
                      strokeWidth="1.30715"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                <p id={review.boardReplyId} onClick={handleHeartClick}>
                  {clicklike ? likeCount : review.likeCount}
                </p>
              </div>
            </div>
          ) : (
            <div className="board-detail-bottom-review-right">
              <span id={review.boardReplyId} onClick={handleClickAddReply}>
                답글달기
              </span>
              <div
                id={review.boardReplyId}
                onClick={handleHeartClick}
                className="board-detail-bottom-review-heart"
              >
                {like ? (
                  <svg
                    id={review.boardReplyId}
                    onClick={handleHeartClick}
                    className="board-detail-function-heart-icon"
                    width="17"
                    height="15"
                    viewBox="0 0 17 15"
                    fill="#FF611D"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      id={review.boardReplyId}
                      onClick={handleHeartClick}
                      d="M4.75 1C2.67893 1 1 2.61547 1 4.60825C1 6.21701 1.656 10.035 8.11563 13.8951C8.34955 14.035 8.65045 14.035 8.88437 13.8951C15.344 10.035 16 6.21701 16 4.60825C16 2.61547 14.321 1 12.25 1C10.179 1 8.5 3.18682 8.5 3.18682C8.5 3.18682 6.82107 1 4.75 1Z"
                      stroke="#FF611D"
                      strokeWidth="1.30715"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg
                    id={review.boardReplyId}
                    onClick={handleHeartClick}
                    className="restaurant-detail-bottom-review-list-item-heart"
                    width="17"
                    height="15"
                    viewBox="0 0 17 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      id={review.boardReplyId}
                      onClick={handleHeartClick}
                      d="M4.75 1C2.67893 1 1 2.61547 1 4.60825C1 6.21701 1.656 10.035 8.11563 13.8951C8.34955 14.035 8.65045 14.035 8.88437 13.8951C15.344 10.035 16 6.21701 16 4.60825C16 2.61547 14.321 1 12.25 1C10.179 1 8.5 3.18682 8.5 3.18682C8.5 3.18682 6.82107 1 4.75 1Z"
                      stroke="#ACACAC"
                      strokeWidth="1.30715"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                <p id={review.boardReplyId} onClick={handleHeartClick}>
                  {clicklike ? likeCount : review.likeCount}
                </p>
              </div>
            </div>
          )}
          {addReply ? (
            <div id={review.boardReplyId} className="board-detail-mobile-bottom-add-review-content">
              <textarea
                maxLength={500}
                value={replyContented}
                onChange={e => handleAddReplySetContentValue(e)}
                placeholder="댓글을 입력해주세요."
              ></textarea>
              <button onClick={handleAddReply}>등록</button>
            </div>
          ) : (
            <span></span>
          )}
        </>
      </Mobile>
    </>
  );
};

export default BoardReviewFunction;
