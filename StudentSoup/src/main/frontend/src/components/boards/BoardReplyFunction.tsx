import './boardReplyFunction.scss';
import Circle_human from 'assets/images/circle_human.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTurnUp } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import axiosInstance from 'apis/utils/AxiosInterceptor';
import { useNavigate } from 'react-router-dom';
import { Desktop, Mobile } from 'mediaQuery';
import Swal from 'sweetalert2';

interface Props {
  reply: any;
  memberId: number;
  nickname: string;
  getBoardId: number;
}

const BoardReplyFunction = ({ reply, memberId, nickname, getBoardId }: Props) => {
  const [modifyClick, setModifyClick] = useState<boolean>(false);
  const [saveBoardReplyId, setSaveBoardReplyId] = useState<any>();
  const [contented, setContented] = useState<string>('');

  const [likeReply, isLikeReply] = useState<boolean>(reply.like);
  const [clicklikeReply, isClickLikeReply] = useState<boolean>();
  const [likeReplyCount, setlikeReplyCount] = useState<number>(reply.likedCount);

  const navigate = useNavigate();

  useEffect(() => {
    isLikeReply(reply.like);
    setlikeReplyCount(reply.likedCount);
  }, [reply]);

  const Toast = Swal.mixin({
    toast: true,
    position: 'bottom',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  const handleReplySetContentValue = (e: any) => {
    setContented(e.target.value);
  };

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

  const handleReplyHeartClick = async (e: any) => {
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
        isLikeReply(res.data.data.like);
        setlikeReplyCount(res.data.data.likeCount);
        if (!likeReply) {
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
      isClickLikeReply(!clicklikeReply);
      isLikeReply(!likeReply);
    }
  };

  return (
    <>
      <Desktop>
        <>
          <div className="board-detail-bottom-reply">
            <div className="board-detail-bottom-reply-left">
              <div className="board-detail-bottom-reply-left-top">
                <FontAwesomeIcon icon={faArrowTurnUp} className="board-detail-reply-icon" />
                <img
                  src={
                    reply.memberProfileImageName
                      ? `/image/${reply.memberProfileImageName}`
                      : Circle_human
                  }
                  alt=""
                />
                <span>
                  {reply.nickname} <p>{reply.writeDate}</p>
                </span>
              </div>
              {modifyClick ? (
                <div id={reply.boardReplyId} className="board-detail-bottom-reply-modify-content">
                  <textarea
                    maxLength={500}
                    value={contented}
                    onChange={e => handleReplySetContentValue(e)}
                    placeholder="댓글을 입력해주세요."
                  ></textarea>
                  <button onClick={handleEditReply}>등록</button>
                </div>
              ) : (
                <p className="board-detail-bottom-reply-content">{reply.content}</p>
              )}
            </div>
            {nickname === reply.nickname && (
              <div className="board-detail-function-div">
                <>
                  {modifyClick ? (
                    <span>
                      <p
                        id={reply.boardReplyId}
                        onClick={handleEditClick}
                        className="board-detail-modify-cancel"
                      >
                        수정취소
                      </p>
                    </span>
                  ) : (
                    <span>
                      <p
                        id={reply.boardReplyId}
                        onClick={handleEditClick}
                        className="board-detail-modify"
                      >
                        수정
                      </p>
                      |
                      <p
                        id={reply.boardReplyId}
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
          <div id={reply.boardReplyId} className="board-detail-bottom-reply-right">
            {likeReply ? (
              <svg
                id={reply.boardReplyId}
                onClick={handleReplyHeartClick}
                className="board-detail-reply-function-heart-icon"
                width="17"
                height="15"
                viewBox="0 0 17 15"
                fill="#FF611D"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  id={reply.boardReplyId}
                  onClick={handleReplyHeartClick}
                  d="M4.75 1C2.67893 1 1 2.61547 1 4.60825C1 6.21701 1.656 10.035 8.11563 13.8951C8.34955 14.035 8.65045 14.035 8.88437 13.8951C15.344 10.035 16 6.21701 16 4.60825C16 2.61547 14.321 1 12.25 1C10.179 1 8.5 3.18682 8.5 3.18682C8.5 3.18682 6.82107 1 4.75 1Z"
                  stroke="#FF611D"
                  strokeWidth="1.30715"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                id={reply.boardReplyId}
                onClick={handleReplyHeartClick}
                className="board-detail-reply-function-heart-icon"
                width="17"
                height="15"
                viewBox="0 0 17 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  id={reply.boardReplyId}
                  onClick={handleReplyHeartClick}
                  d="M4.75 1C2.67893 1 1 2.61547 1 4.60825C1 6.21701 1.656 10.035 8.11563 13.8951C8.34955 14.035 8.65045 14.035 8.88437 13.8951C15.344 10.035 16 6.21701 16 4.60825C16 2.61547 14.321 1 12.25 1C10.179 1 8.5 3.18682 8.5 3.18682C8.5 3.18682 6.82107 1 4.75 1Z"
                  stroke="#ACACAC"
                  strokeWidth="1.30715"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            <p id={reply.boardReplyId} onClick={handleReplyHeartClick}>
              {clicklikeReply ? likeReplyCount : reply.likeCount}
            </p>
          </div>
        </>
      </Desktop>
      <Mobile>
        <>
          <div className="board-detail-mobile-bottom-reply">
            <div className="board-detail-mobile-bottom-reply-left">
              <div className="board-detail-mobile-bottom-reply-left-top">
                <FontAwesomeIcon icon={faArrowTurnUp} className="board-detail-mobile-reply-icon" />
                <img
                  src={
                    reply.memberProfileImageName
                      ? `/image/${reply.memberProfileImageName}`
                      : Circle_human
                  }
                  alt=""
                />
                <span>
                  {reply.nickname} <p>{reply.writeDate}</p>
                </span>
              </div>
              {modifyClick ? (
                <div
                  id={reply.boardReplyId}
                  className="board-detail-mobile-bottom-reply-modify-content"
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
                <p className="board-detail-mobile-bottom-reply-content">{reply.content}</p>
              )}
            </div>
            {nickname === reply.nickname && (
              <div className="board-detail-function-div">
                <>
                  {modifyClick ? (
                    <span>
                      <p
                        id={reply.boardReplyId}
                        onClick={handleEditClick}
                        className="board-detail-modify-cancel"
                      >
                        수정취소
                      </p>
                    </span>
                  ) : (
                    <span>
                      <p
                        id={reply.boardReplyId}
                        onClick={handleEditClick}
                        className="board-detail-modify"
                      >
                        수정
                      </p>
                      |
                      <p
                        id={reply.boardReplyId}
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
          <div id={reply.boardReplyId} className="board-detail-mobile-bottom-reply-right">
            {likeReply ? (
              <svg
                id={reply.boardReplyId}
                onClick={handleReplyHeartClick}
                className="board-detail-mobile-reply-function-heart-icon"
                width="17"
                height="15"
                viewBox="0 0 17 15"
                fill="#FF611D"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  id={reply.boardReplyId}
                  onClick={handleReplyHeartClick}
                  d="M4.75 1C2.67893 1 1 2.61547 1 4.60825C1 6.21701 1.656 10.035 8.11563 13.8951C8.34955 14.035 8.65045 14.035 8.88437 13.8951C15.344 10.035 16 6.21701 16 4.60825C16 2.61547 14.321 1 12.25 1C10.179 1 8.5 3.18682 8.5 3.18682C8.5 3.18682 6.82107 1 4.75 1Z"
                  stroke="#FF611D"
                  strokeWidth="1.30715"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                id={reply.boardReplyId}
                onClick={handleReplyHeartClick}
                className="board-detail-mobile-reply-function-heart-icon"
                width="17"
                height="15"
                viewBox="0 0 17 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  id={reply.boardReplyId}
                  onClick={handleReplyHeartClick}
                  d="M4.75 1C2.67893 1 1 2.61547 1 4.60825C1 6.21701 1.656 10.035 8.11563 13.8951C8.34955 14.035 8.65045 14.035 8.88437 13.8951C15.344 10.035 16 6.21701 16 4.60825C16 2.61547 14.321 1 12.25 1C10.179 1 8.5 3.18682 8.5 3.18682C8.5 3.18682 6.82107 1 4.75 1Z"
                  stroke="#ACACAC"
                  strokeWidth="1.30715"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            <p id={reply.boardReplyId} onClick={handleReplyHeartClick}>
              {clicklikeReply ? likeReplyCount : reply.likeCount}
            </p>
          </div>
        </>
      </Mobile>
    </>
  );
};

export default BoardReplyFunction;
