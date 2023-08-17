import './boardBestReviewHeart.scss';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../apis/utils/AxiosInterceptor';
import Swal from 'sweetalert2';

interface Props {
  bestReview: any;
  memberId: number;
}

const BoardBestReviewHeart = ({ bestReview, memberId }: Props) => {
  const [likeBestReview, isLikeBestReview] = useState<boolean>(bestReview.like);
  const [clicklikeReview, isClickLikeReview] = useState<boolean>();
  const [likeReviewCount, setlikeReviewCount] = useState<number>(bestReview.likedCount);

  const Toast = Swal.mixin({
    toast: true,
    position: 'bottom',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  const navigate = useNavigate();

  useEffect(() => {
    isLikeBestReview(bestReview.like);
    setlikeReviewCount(bestReview.likedCount);
  }, [bestReview]);

  const handleClickBestHeart = async (e: any) => {
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
        isLikeBestReview(res.data.data.like);
        setlikeReviewCount(res.data.data.likeCount);
        if (!likeBestReview) {
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
      isClickLikeReview(!clicklikeReview);
      isLikeBestReview(!likeBestReview);
    }
  };

  return (
    <div id={bestReview.boardReplyId} className="board-detail-bottom-best-review-best-div">
      {likeBestReview ? (
        <svg
          id={bestReview.boardReplyId}
          onClick={handleClickBestHeart}
          className="board-detail-function-heart-icon"
          width="17"
          height="15"
          viewBox="0 0 17 15"
          fill="#FF611D"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            id={bestReview.boardReplyId}
            onClick={handleClickBestHeart}
            d="M4.75 1C2.67893 1 1 2.61547 1 4.60825C1 6.21701 1.656 10.035 8.11563 13.8951C8.34955 14.035 8.65045 14.035 8.88437 13.8951C15.344 10.035 16 6.21701 16 4.60825C16 2.61547 14.321 1 12.25 1C10.179 1 8.5 3.18682 8.5 3.18682C8.5 3.18682 6.82107 1 4.75 1Z"
            stroke="#FF611D"
            strokeWidth="1.30715"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg
          id={bestReview.boardReplyId}
          onClick={handleClickBestHeart}
          className="board-detail-function-heart-icon"
          width="17"
          height="15"
          viewBox="0 0 17 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            id={bestReview.boardReplyId}
            onClick={handleClickBestHeart}
            d="M4.75 1C2.67893 1 1 2.61547 1 4.60825C1 6.21701 1.656 10.035 8.11563 13.8951C8.34955 14.035 8.65045 14.035 8.88437 13.8951C15.344 10.035 16 6.21701 16 4.60825C16 2.61547 14.321 1 12.25 1C10.179 1 8.5 3.18682 8.5 3.18682C8.5 3.18682 6.82107 1 4.75 1Z"
            stroke="#ACACAC"
            strokeWidth="1.30715"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}

      <p id={bestReview.boardReplyId} onClick={handleClickBestHeart}>
        {clicklikeReview ? likeReviewCount : bestReview.likeCount}
      </p>
    </div>
  );
};

export default BoardBestReviewHeart;
