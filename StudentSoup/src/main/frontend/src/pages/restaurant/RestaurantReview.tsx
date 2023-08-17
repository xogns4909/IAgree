import './restaurantReview.scss';
import review_white from 'assets/images/review_white.svg';
import { useState, useEffect, Fragment } from 'react';
import Circle_human from 'assets/images/circle_human.png';
import RestaurantReviewWrite from './RestaurantReviewWrite';
import { Desktop, Mobile } from 'mediaQuery';
import axios from 'axios';
import RatingStars from 'pages/mypage/components/RatingStars';
import ReviewPaginate from 'components/common/ReviewPaginate';
import RestaurantReviewHeartInfo from './RestaurantReviewHeartInfo';

interface Props {
  name: string;
  reviewCount: number;
  starLiked: number;
  restaurantId: number;
  memberId: number | undefined;
}

const RestaurantReview = ({ name, reviewCount, starLiked, restaurantId, memberId }: Props) => {
  const [write, isWrite] = useState<boolean>(false);

  const [currentpage, setCurrentpage] = useState(1);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [postPerPage, setPostPerPage] = useState(3);
  const [reviewList, setReviewList] = useState<any>([]);
  const [page, setPage] = useState<number>(0);
  const [sort, setSort] = useState<string>('newest');
  const url = `/restaurantReview/${restaurantId}`;

  useEffect(() => {
    axios
      .post(
        url,
        {
          restaurantId,
          memberId,
        },
        {
          params: {
            page,
            sorted: sort,
          },
        },
      )
      .then(res => {
        setReviewList(res.data.content);
        setTotalElements(res.data.totalElements);
      })
      .catch(err => {
        console.error(err);
      });
  }, [currentpage, sort]);

  const handleImgError = (e: any) => {
    e.target.src = Circle_human;
  };

  const reviewInfo = {
    name,
    restaurantId,
    isWrite,
  };

  const reviewHeart = {
    memberId,
  };

  const handlePageChange = (e: any) => {
    setCurrentpage(e);
    setPage(e - 1);
  };

  return (
    <>
      <Desktop>
        <div className="restaurant-detail-bottom-review-div">
          <div className="restaurant-detail-bottom-review-info">
            <div className="restaurant-detail-bottom-review-info-left">
              <p>{name}</p>
              <span>총 {reviewCount}명이 리뷰를 작성했어요</span>
            </div>
            <button
              className="restaurant-detail-bottom-review-write-button"
              onClick={() => isWrite(!write)}
            >
              <img src={review_white} alt="" />
              <p>리뷰 작성</p>
            </button>
          </div>
          {write && <RestaurantReviewWrite {...reviewInfo} />}
          <div className="restaurant-detail-bottom-review-select-div">
            <div className="restaurant-detail-bottom-review-buttons">
              <button
                className={
                  sort === 'newest'
                    ? 'restaurant-detail-bottom-review-button active'
                    : 'restaurant-detail-bottom-review-button'
                }
                onClick={() => setSort('newest')}
              >
                최신순
              </button>
              <button
                className={
                  sort === 'liked'
                    ? 'restaurant-detail-bottom-review-button active'
                    : 'restaurant-detail-bottom-review-button'
                }
                onClick={() => setSort('liked')}
              >
                추천순
              </button>
            </div>
          </div>
          {reviewList.map((review: any, idx: any) => (
            <Fragment key={review.restaurantReviewId}>
              <div className="restaurant-detail-bottom-review-list-div">
                {review.memberProfileImageName ? (
                  <img
                    key={review.restaurantReviewId}
                    src={`/image/${review.memberProfileImageName}`}
                    alt=""
                    onError={handleImgError}
                    className="restaurant-detail-bottom-review-list-profile"
                  />
                ) : (
                  <img
                    src={Circle_human}
                    className="restaurant-detail-bottom-review-list-profile"
                  ></img>
                )}
                <div className="restaurant-detail-bottom-review-list-item">
                  <div className="restaurant-detail-bottom-review-list-item-top">
                    <span className="restaurant-detail-bottom-review-list-item-username">
                      {review.nickName}
                    </span>
                    <RestaurantReviewHeartInfo {...reviewHeart} review={review} />
                  </div>
                  <div className="restaurant-detail-bottom-review-list-item-middle">
                    <RatingStars
                      rating={review.starLiked}
                      width="21px"
                      height="19px"
                      color="#ffb21d"
                    />
                    <span>{review.writeDate}</span>
                  </div>
                  {review.imageFileNameList.length ? (
                    <>
                      <div className="restaurant-detail-bottom-review-list-item-img-div">
                        {review.imageFileNameList.map((img: any) => (
                          <img key={img} src={`/image/${img}`} alt="" />
                        ))}
                      </div>
                      <div className="restaurant-detail-bottom-review-list-content">
                        {review.content}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="restaurant-detail-bottom-review-list-content">
                        {review.content}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Fragment>
          ))}
          <div className="restaurant-detail-bottom-paginate">
            <ReviewPaginate
              page={currentpage}
              count={totalElements}
              setPage={handlePageChange}
              postPerPage={postPerPage}
              hideFirstLastPages={true}
              hideDisabled={true}
            />
          </div>
        </div>
      </Desktop>
      <Mobile>
        <div className="restaurant-mobile-detail-bottom-review-div">
          <div className="restaurant-mobile-detail-bottom-review-info">
            <div className="restaurant-mobile-detail-bottom-review-info-left">
              <div className="restaurant-mobile-detail-bottom-review-info-left-div">
                <p>{name}</p>
                <div>{starLiked}</div>
              </div>
              <span>총 {reviewCount}명이 리뷰를 작성했어요</span>
            </div>
          </div>
          <div className="restaurant-mobile-detail-bottom-review-select-div">
            <div className="restaurant-mobile-detail-bottom-review-buttons">
              <div>
                <button
                  className={
                    sort === 'newest'
                      ? 'restaurant-mobile-detail-bottom-review-button active'
                      : 'restaurant-mobile-detail-bottom-review-button'
                  }
                  onClick={() => setSort('newest')}
                >
                  최신순
                </button>
                <button
                  className={
                    sort === 'liked'
                      ? 'restaurant-mobile-detail-bottom-review-button active'
                      : 'restaurant-mobile-detail-bottom-review-button'
                  }
                  onClick={() => setSort('liked')}
                >
                  추천순
                </button>
              </div>
              <button
                className="restaurant-mobile-detail-bottom-review-write-button"
                onClick={() => isWrite(!write)}
              >
                <img src={review_white} alt="" />
                <p>리뷰 작성</p>
              </button>
            </div>
            {write && <RestaurantReviewWrite {...reviewInfo} />}
          </div>
          {reviewList.map((review: any, idx: any) => (
            <Fragment key={review.restaurantReviewId}>
              <div className="restaurant-mobile-detail-bottom-review-list-div">
                {review.memberProfileImageName ? (
                  <img
                    key={review.restaurantReviewId}
                    src={`/image/${review.memberProfileImageName}`}
                    alt=""
                    onError={handleImgError}
                    className="restaurant-mobile-detail-bottom-review-list-profile"
                  />
                ) : (
                  <img
                    src={Circle_human}
                    className="restaurantmobile-detail-bottom-review-list-profile"
                  ></img>
                )}
                <div className="restaurant-mobile-detail-bottom-review-list-item">
                  <div className="restaurant-mobile-detail-bottom-review-list-item-top">
                    <span className="restaurant-mobile-detail-bottom-review-list-item-username">
                      {review.nickName}
                    </span>
                    <RestaurantReviewHeartInfo {...reviewHeart} review={review} />
                  </div>
                  <div className="restaurant-mobile-detail-bottom-review-list-item-middle">
                    <RatingStars
                      rating={review.starLiked}
                      width="21px"
                      height="19px"
                      color="#ffb21d"
                    />
                    <span>{review.writeDate}</span>
                  </div>
                  {review.imageFileNameList.length ? (
                    <>
                      <div className="restaurant-mobile-detail-bottom-review-list-item-img-div">
                        {review.imageFileNameList.map((img: any) => (
                          <img key={img} src={`/image/${img}`} alt="" />
                        ))}
                      </div>
                      <div className="restaurant-mobile-detail-bottom-review-list-content">
                        {review.content}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="restaurant-mobile-detail-bottom-review-list-content">
                        {review.content}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Fragment>
          ))}
          <div className="restaurant-mobile-detail-bottom-paginate">
            <ReviewPaginate
              page={currentpage}
              count={totalElements}
              setPage={handlePageChange}
              postPerPage={postPerPage}
              hideFirstLastPages={true}
              hideDisabled={true}
            />
          </div>
        </div>
      </Mobile>
    </>
  );
};

export default RestaurantReview;
