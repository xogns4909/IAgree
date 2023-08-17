import './restaurantReviewWrite.scss';
import camera from 'assets/images/camera.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Desktop, Mobile } from 'mediaQuery';
import RatingStars from 'pages/mypage/components/RatingStars';
import { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { getUserInformation } from 'apis/api/UserAPI';

interface Props {
  restaurantId: number;
  name: string;
  isWrite: React.Dispatch<React.SetStateAction<boolean>>;
}

const RestaurantReviewWrite = ({ restaurantId, name, isWrite }: Props) => {
  const [rating, setRating] = useState<number>(0);
  const [imgs, setImgs] = useState<any>();
  const imageUploader = useRef<any>(null);

  const [nickName, setNickName] = useState<string>('');
  const [memberId, setMemberId] = useState<string>('');
  const [showImages, setShowImages] = useState([]);
  const [textValue, setTextValue] = useState<any>('');
  const [count, setCount] = useState<number>(0);
  const [maxCount, setMaxCount] = useState<number>(400);

  useEffect(() => {
    getUserInformation()
      .then(res => {
        setMemberId(res.data.memberId);
        setNickName(res.data.nickname);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  const handleSetValue = (e: any) => {
    setTextValue(e.target.value);
    setCount(e.target.value.length);
    setMaxCount(maxCount);
  };

  const handleAddImages = (event: any) => {
    const maxFilesizeAll = 4 * 1024 * 1000;
    const imageLists = event.target.files;
    setImgs(event.target.files);

    let imageUrlLists = [...showImages];

    for (let i = 0; i < imageLists.length; i++) {
      if (!/\.(gif|jpg|png|jpeg|bmp|svg)$/i.test(imageLists[i].name)) {
        alert('해당파일은 업로드가 불가능한 파일입니다.');
        return;
      } else if (imageLists[i].size > maxFilesizeAll) {
        alert('업로드 가능한 최대 용량은 5MB입니다.');
        return;
      }

      const currentImageUrl = URL.createObjectURL(imageLists[i]) as never;

      imageUrlLists.push(currentImageUrl);
    }

    if (imageUrlLists.length <= 4) {
      imageUrlLists = imageUrlLists.slice(0, 4);
    } else {
      alert('이미지파일은 4개이하만 업로드 할수 있습니다.');
      return;
    }

    setShowImages(imageUrlLists);
  };

  const handleReviewValue = async (e: any) => {
    if (count < 4) {
      alert('5자 이상 입력해야 합니다.');
    } else if (rating === 0) {
      alert('별점은 최소 1점부터 가능합니다.');
    } else if (!imgs) {
      await axios.put(
        `/restaurantReview/${restaurantId}`,
        {
          restaurantName: name,
          memberId,
          nickName,
          content: textValue,
          starLiked: rating,
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      alert('리뷰 작성이 완료되었습니다.');
      setShowImages([]);
      setRating(0);
      setTextValue('');
      location.reload();
    } else {
      await axios.put(
        `/restaurantReview/${restaurantId}`,
        {
          restaurantName: name,
          memberId,
          nickName,
          content: textValue,
          starLiked: rating,
          multipartFileList: [...imgs],
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      alert('리뷰 작성이 완료되었습니다.');
      setShowImages([]);
      setRating(0);
      setTextValue('');
      location.reload();
    }
  };

  const cancelReviewValue = (e: any) => {
    if (confirm('게시글 작성을 취소하시겠습니까? (작성중이던 글은 삭제됩니다.)')) {
      setShowImages([]);
      setTextValue('');
    }
    isWrite(false);
  };

  const onCickImageUpload = () => {
    imageUploader.current.click();
  };

  const handleDeleteImage = (id: any) => {
    setShowImages(showImages.filter((_, index) => index !== id));
  };

  return (
    <>
      <Desktop>
        <div className="restaurant-detail-review-write-div">
          <div className="restaurant-detail-review-write-top">
            <div className="restaurant-detail-review-write-caution">
              ※홍보 및 비방 등 부적절한 평가는 평점 산정에서 제외될 수 있습니다.
            </div>
          </div>
          <div className="restaurant-detail-review-write-middle">
            <span>맛있게 드셨나요?</span>
            <RatingStars
              rating={rating}
              width="42px"
              height="38px"
              color="#ffb21d"
              onClick={newRating => setRating(newRating)}
              hoverable
            />
            <p>고객님의 리뷰가 다른 고객드에게 도움이 될 수 있어요!</p>
          </div>
          <div className="restaurant-detail-review-write-middle-textarea-div">
            <textarea
              className="restaurant-detail-review-write-middle-textarea"
              placeholder="업주와 다른 사용자들이 상처받지 않도록 좋은 표현과 주문하신 메뉴 및 매장 서비스에 대해서 작성해주세요 :)"
              maxLength={399}
              value={textValue}
              onChange={e => {
                handleSetValue(e);
              }}
            ></textarea>
            <div className="restaurant-detail-review-write-middle-text-count">
              {count}/400 (최소 5글자)
            </div>
          </div>
          <div className="restaurant-detail-review-write-middle-img-div">
            <div
              onChange={handleAddImages}
              onClick={onCickImageUpload}
              className="restaurant-detail-review-write-middle-add-img"
            >
              <div className="restaurant-detail-review-write-middle-img-input-div">
                <img src={camera} alt="" />
                <span>사진 첨부</span>
                <p>{showImages.length}/4</p>
                <input
                  type="file"
                  multiple
                  accept=".png,.jpg,.gif,.jpeg,.bmp,.svg"
                  ref={imageUploader}
                  className="restaurant-detail-review-write-middle-img-input"
                />
              </div>
            </div>
            {showImages.map((image, id) => (
              <>
                <div key={id} className="restaurant-detail-review-write-middle-add-img-item-div">
                  <div className="restaurant-detail-review-write-middle-add-img-item">
                    <img src={image} alt={`${image}-${id}`} />
                    <FontAwesomeIcon
                      icon={faXmark}
                      onClick={() => {
                        handleDeleteImage(id);
                      }}
                      className="restaurant-detail-review-write-middle-delete-button"
                    />
                  </div>
                </div>
              </>
            ))}
          </div>
          <span className="restaurant-detail-review-write-bottom-text">
            사진은 최대 20MB 이하의 JPG, PNG, GIF 파일 4장까지 첨부 가능합니다.
          </span>
          <div className="restaurant-detail-review-write-bottom-buttons-div">
            <button
              onClick={cancelReviewValue}
              className="restaurant-detail-review-write-bottom-cancel-button"
            >
              취소하기
            </button>
            <button
              onClick={handleReviewValue}
              className="restaurant-detail-review-write-bottom-submit-button"
            >
              등록하기
            </button>
          </div>
        </div>
      </Desktop>
      <Mobile>
        <div className="restaurant-mobile-detail-review-write-div">
          <div className="restaurant-mobile-detail-review-write-middle">
            <span>맛있게 드셨나요?</span>
            <RatingStars
              rating={rating}
              width="42px"
              height="38px"
              color="#ffb21d"
              onClick={newRating => setRating(newRating)}
              hoverable
            />
            <p>고객님의 리뷰가 다른 고객드에게 도움이 될 수 있어요!</p>
          </div>
          <div className="restaurant-mobile-detail-review-write-middle-textarea-div">
            <textarea
              className="restaurant-mobile-detail-review-write-middle-textarea"
              placeholder="업주와 다른 사용자들이 상처받지 않도록 좋은 표현과 주문하신 메뉴 및 매장 서비스에 대해서 작성해주세요 :)"
              maxLength={399}
              value={textValue}
              onChange={e => {
                handleSetValue(e);
              }}
            ></textarea>
            <div className="restaurant-mobile-detail-review-write-middle-text-count">
              {count}/400 (최소 5글자)
            </div>
          </div>
          <div className="restaurant-mobile-detail-review-write-middle-img-div">
            <div
              onChange={handleAddImages}
              onClick={onCickImageUpload}
              className="restaurant-mobile-detail-review-write-middle-add-img"
            >
              <div className="restaurant-mobile-detail-review-write-middle-img-input-div">
                <img src={camera} alt="" />
                <span>사진 첨부</span>
                <p>{showImages.length}/4</p>
                <input
                  type="file"
                  multiple
                  accept=".png,.jpg,.gif,.jpeg,.bmp,.svg"
                  ref={imageUploader}
                  className="restaurant-mobile-detail-review-write-middle-img-input"
                />
              </div>
            </div>
            {showImages.map((image, id) => (
              <>
                <div
                  key={id}
                  className="restaurant-mobile-detail-review-write-middle-add-img-item-div"
                >
                  <div className="restaurant-mobile-detail-review-write-middle-add-img-item">
                    <img src={image} alt={`${image}-${id}`} />
                    <FontAwesomeIcon
                      icon={faXmark}
                      onClick={() => {
                        handleDeleteImage(id);
                      }}
                      className="restaurant-mobile-detail-review-write-middle-delete-button"
                    />
                  </div>
                </div>
              </>
            ))}
          </div>
          <span className="restaurant-mobile-detail-review-write-bottom-text">
            사진은 최대 20MB 이하의 JPG, PNG, GIF 파일 4장까지 첨부 가능합니다.
          </span>
          <div className="restaurant-mobile-detail-review-write-bottom-buttons-div">
            <button
              onClick={cancelReviewValue}
              className="restaurant-mobile-detail-review-write-bottom-cancel-button"
            >
              취소하기
            </button>
            <button
              onClick={handleReviewValue}
              className="restaurant-mobile-detail-review-write-bottom-submit-button"
            >
              등록하기
            </button>
          </div>
        </div>
      </Mobile>
    </>
  );
};

export default RestaurantReviewWrite;
