import './restaurantPhoto.scss';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const RestaurantPhoto = () => {
  const state = useLocation();
  const restaurantId = state.state.value1;
  const [image, setImage] = useState<any>([]);
  const [size, setSize] = useState<number>(6);
  const [totalSize, setTotalSize] = useState<any>();
  const url = `/restaurantReview/${restaurantId}/images`;

  useEffect(() => {
    axios
      .get(url, { params: { size } })
      .then(res => {
        setImage(res.data.content);
        setTotalSize(res.data.totalElements);
      })
      .catch(err => {
        console.error(err);
      });
  }, [size]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight) {
      setSize(size + 6);
      if (size >= totalSize) {
        setSize(totalSize);
      }
    }
  };

  return (
    <>
      {image.length ? (
        <div className="restaurant-detail-photo-div">
          {image.map((img: any, idx: number) => (
            <img key={idx} src={`/image/${img}`} alt="" />
          ))}
        </div>
      ) : (
        <div className="restaurant-detail-non-photo-div">
          <span>이미지 리뷰가 없습니다. 리뷰를 달아보세요!</span>
        </div>
      )}
    </>
  );
};

export default RestaurantPhoto;
