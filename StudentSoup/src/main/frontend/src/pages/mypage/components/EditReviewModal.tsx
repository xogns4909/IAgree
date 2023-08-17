import React, { useState } from 'react';
import { ReactComponent as MypageEditStar } from '../../../img/mypageeditstar.svg';
import './editReviewModal.scss';
import RatingStars from './RatingStars';

interface EditReviewModalProps {
  onSubmit: (rating: number, content: string) => void;
  onCancel: () => void;
  currentRating: number;
  currentContent: string;
}

const EditReviewModal: React.FC<EditReviewModalProps> = ({
  onSubmit,
  onCancel,
  currentRating,
  currentContent,
}) => {
  const [rating, setRating] = useState(currentRating);
  const [content, setContent] = useState(currentContent);

  const handleSubmit = () => {
    onSubmit(rating, content);
  };

  return (
    <div className="edit-review-modal">
      <h3>맛있게 드셨나요?</h3>
      <div className="edit-review-modal-star">
        <RatingStars
          rating={rating}
          width="40px"
          height="37px"
          color="#ffb21d"
          onClick={newRating => setRating(newRating)}
          hoverable
        />
      </div>
      <p className="edit-review-modal-helpcontext">
        고객님의 리뷰가 다른 고객들에게 도움이 될 수 있어요!
      </p>
      <textarea
        className="edit-review-modal-textarea"
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="리뷰를 작성해주세요."
        rows={4}
        style={{ width: '100%' }}
      />

      <div className="edit-review-modal-buttonline">
        <button className="edit-review-modal-cancel" onClick={onCancel}>
          취소하기
        </button>
        <button className="edit-review-modal-complete" onClick={handleSubmit}>
          수정하기
        </button>
      </div>
    </div>
  );
};

export default EditReviewModal;
