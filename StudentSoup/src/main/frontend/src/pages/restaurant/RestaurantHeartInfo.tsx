import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './restaurantHeartInfo.scss';

interface Props {
  memberId: number | undefined;
  restaurantId: number;
  menu: any;
}

const RestaurantHeartInfo = ({ memberId, restaurantId, menu }: Props) => {
  const navigate = useNavigate();
  const [like, isLike] = useState<boolean>(menu.like);
  const [clicklike, isClickLike] = useState<boolean>();
  const [likeCount, setlikeCount] = useState<number>(menu.likedCount);
  useEffect(() => {
    isLike(menu.like);
  }, [menu.like]);
  console.log('넘겨온값', menu);
  console.log([like]);
  const handleHeartCount = async (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    const saveMenuId = e.target.parentElement.parentElement.id;
    if (!memberId) {
      if (confirm('로그인후 이용가능한 기능입니다. 로그인하시겠습니까?')) {
        navigate('/login');
      } else {
        /* empty */
      }
    } else {
      await axios
        .post(`/restaurant/${restaurantId}/menu/like`, {
          restaurantMenuId: saveMenuId,
          memberId,
        })
        .then(res => {
          isLike(res.data.data.like);
          setlikeCount(res.data.data.likedCount);
        });
    }
  };
  return (
    <div
      className="restaurant-detail-bottom-menu-heart-div"
      id={menu.restaurantMenuId}
      key={menu.restaurantMenuId}
      onClick={handleHeartCount}
    >
      {like ? (
        <svg
          onClick={handleHeartCount}
          id={menu.restaurantMenuId}
          key={menu.restaurantMenuId}
          className="restaurant-detail-bottom-menu-heart"
          width="17"
          height="15"
          viewBox="0 0 17 15"
          fill="#FF611D"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            id={menu.restaurantMenuId}
            key={menu.restaurantMenuId}
            d="M4.75 1C2.67893 1 1 2.61547 1 4.60825C1 6.21701 1.656 10.035 8.11563 13.8951C8.34955 14.035 8.65045 14.035 8.88437 13.8951C15.344 10.035 16 6.21701 16 4.60825C16 2.61547 14.321 1 12.25 1C10.179 1 8.5 3.18682 8.5 3.18682C8.5 3.18682 6.82107 1 4.75 1Z"
            stroke="#FF611D"
            strokeWidth="1.30715"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg
          onClick={handleHeartCount}
          id={menu.restaurantMenuId}
          key={menu.restaurantMenuId}
          className="restaurant-detail-bottom-menu-heart"
          width="17"
          height="15"
          viewBox="0 0 17 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            id={menu.restaurantMenuId}
            key={menu.restaurantMenuId}
            d="M4.75 1C2.67893 1 1 2.61547 1 4.60825C1 6.21701 1.656 10.035 8.11563 13.8951C8.34955 14.035 8.65045 14.035 8.88437 13.8951C15.344 10.035 16 6.21701 16 4.60825C16 2.61547 14.321 1 12.25 1C10.179 1 8.5 3.18682 8.5 3.18682C8.5 3.18682 6.82107 1 4.75 1Z"
            stroke="#ACACAC"
            strokeWidth="1.30715"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}

      <p id={menu.restaurantMenuId}>{clicklike ? likeCount : menu.likedCount}</p>
    </div>
  );
};

export default RestaurantHeartInfo;
