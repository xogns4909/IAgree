import './boardReview.scss';
import { Desktop, Mobile } from '../../mediaQuery';
import BoardReply from './BoardReply';
import BoardReviewFunction from './BoardReviewFunction';

interface Props {
  review: any;
  memberId: number;
  nickname: string;
  getBoardId: number;
}

const BoardReview = ({ review, memberId, getBoardId, nickname }: Props) => {
  return (
    <>
      <Desktop>
        {review.map((review: any) => (
          <div
            key={review.boardReplyId}
            id={review.boardReplyId}
            className="board-detail-bottom-review-div"
          >
            <BoardReviewFunction
              review={review}
              memberId={memberId}
              nickname={nickname}
              getBoardId={getBoardId}
            />
            <div className="board-detail-underline" />
            {review.boardNestedReplyDtoList.length !== 0 && (
              <BoardReply
                reply={review.boardNestedReplyDtoList}
                memberId={memberId}
                nickname={nickname}
                getBoardId={getBoardId}
              />
            )}
          </div>
        ))}
      </Desktop>
      <Mobile>
        {review.map((review: any) => (
          <div
            key={review.boardReplyId}
            id={review.boardReplyId}
            className="board-detail-mobile-bottom-review-div"
          >
            <BoardReviewFunction
              review={review}
              memberId={memberId}
              nickname={nickname}
              getBoardId={getBoardId}
            />
            <div className="board-detail-mobile-underline" />
            {review.boardNestedReplyDtoList.length !== 0 && (
              <BoardReply
                reply={review.boardNestedReplyDtoList}
                memberId={memberId}
                nickname={nickname}
                getBoardId={getBoardId}
              />
            )}
          </div>
        ))}
      </Mobile>
    </>
  );
};

export default BoardReview;
