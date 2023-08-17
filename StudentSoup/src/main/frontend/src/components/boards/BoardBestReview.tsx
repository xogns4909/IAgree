import './boardBestReview.scss';
import Circle_human from 'assets/images/circle_human.png';
import { Desktop, Mobile } from 'mediaQuery';
import BoardBestReviewHeart from './BoardBestReviewHeart';

interface Props {
  bestReview: any;
  memberId: number;
}

const BoardBestReview = ({ bestReview, memberId }: Props) => {
  return (
    <>
      <Desktop>
        <div id={bestReview.boardReplyId} className="board-detail-bottom-best-review-div">
          <div className="board-detail-bottom-best-review">
            <div className="board-detail-bottom-best-review-left">
              <div className="board-detail-bottom-best-review-left-top">
                <img
                  src={
                    bestReview.memberProfileImageName
                      ? `/image/${bestReview.memberProfileImageName}`
                      : Circle_human
                  }
                  alt=""
                />
                <span className="board-detail-bottom-best-text">BEST</span>
                <span>
                  {bestReview.nickname} <p>{bestReview.writeDate}</p>
                </span>
              </div>
              <p className="board-detail-bottom-best-review-content">{bestReview.content}</p>
            </div>
          </div>
          <BoardBestReviewHeart bestReview={bestReview} memberId={memberId} />
          <div className="board-detail-underline" />
        </div>
      </Desktop>
      <Mobile>
        <div id={bestReview.boardReplyId} className="board-detail-mobile-bottom-best-review-div">
          <div className="board-detail-mobile-bottom-best-review">
            <div className="board-detail-mobile-bottom-best-review-left">
              <div className="board-detail-mobile-bottom-best-review-left-top">
                <img
                  src={
                    bestReview.memberProfileImageName
                      ? `/image/${bestReview.memberProfileImageName}`
                      : Circle_human
                  }
                  alt=""
                />
                <span className="board-detail-mobile-bottom-best-text">BEST</span>
                <span>
                  {bestReview.nickname} <p>{bestReview.writeDate}</p>
                </span>
              </div>
              <p className="board-detail-mobile-bottom-best-review-content">{bestReview.content}</p>
            </div>
          </div>
          <BoardBestReviewHeart bestReview={bestReview} memberId={memberId} />
          <div className="board-detail-mobile-underline" />
        </div>
      </Mobile>
    </>
  );
};

export default BoardBestReview;
