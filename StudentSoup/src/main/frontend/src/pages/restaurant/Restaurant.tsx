import axios from 'axios';
import view_count from 'assets/images/view_count.svg';
import heart from 'assets/images/heart.svg';
import star from 'assets/images/star.svg';
import filter from 'assets/images/filter.svg';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './restaurant.scss';
import { DesktopHeader, Mobile, MobileHeader } from 'mediaQuery';
import RestaurantNavbar from './RestaurantNavbar';
import { useMediaQuery } from 'react-responsive';
const kakao = (window as any).kakao;

interface State {
  value1: string;
  value2: string;
}

const Restaurant = () => {
  const [category, setCategory] = useState<string>('ALL');
  const [size, setSize] = useState<number>(6);
  const [sort, setSort] = useState<number>(0);

  const [login, isLogin] = useState<boolean>(false);
  const [click, isClick] = useState<boolean>(true);
  const [total, isTotal] = useState<number>();
  const [set, isSet] = useState<any[]>();
  const [showSorts, setShowSorts] = useState<boolean>(false);
  const [latitude, setLatitude] = useState<any>();
  const [longitude, setLongitude] = useState<any>();
  const url = '/restaurants';
  const state = useLocation();
  const navigate = useNavigate();
  const sortRef: any = useRef(null);
  const searchRef = useRef<any>();
  const schoolName = state.state;

  const foodCategories = [
    { category: '전체', eng: 'ALL' },
    { category: '한식', eng: 'KOREAN' },
    { category: '양식', eng: 'WESTERN' },
    { category: '패스트푸드', eng: 'FASTFOOD' },
    { category: '아시아음식', eng: 'ASIAN' },
    { category: '일식', eng: 'JAPAN' },
    { category: '중식', eng: 'CHINESE' },
    { category: '분식', eng: 'SNACK' },
    { category: '카페', eng: 'CAFE' },
    { category: '뷔페', eng: 'BUFFET' },
    { category: '기타', eng: 'OTHERS' },
  ];

  const sortList = [
    { title: '등록순', value: 0 },
    { title: '별점순', value: 1 },
    { title: '좋아요순', value: 2 },
    { title: '리뷰순', value: 3 },
    { title: '거리순', value: 4 },
  ];

  const isDesktop = useMediaQuery({
    query: '(min-width: 1041px)',
  });
  const isTablet = useMediaQuery({
    query: '(min-width: 769px)',
  });
  const isMobile = useMediaQuery({
    query: '(max-width: 768px)',
  });

  const postRestaurant = () => {
    axios
      .post(
        url,
        {
          schoolName,
        },
        {
          params: {
            size,
            sorted: sort,
            category,
          },
        },
      )
      .then(res => {
        isTotal(res.data.restaurant.totalElements);
        isSet(res.data.restaurant.content);
        setLatitude(Number(res.data.school.schoolLatitude));
        setLongitude(Number(res.data.school.schoolLongitude));
      })
      .catch(function (_error) {
        if (!state.state) {
          alert('비정상적인 경로입니다. 메인페이지로 이동합니다.');
          navigate('/');
        }
      });
  };

  useEffect(() => {
    postRestaurant();
  }, [schoolName]);
  useEffect(() => {
    postRestaurant();
  }, [isDesktop, isTablet, isMobile, size, sort, category]);

  const MapLocation = [longitude, latitude];

  useEffect(() => {
    const container = document.getElementById('map');
    const options = {
      center: new kakao.maps.LatLng(...MapLocation),
      level: 3,
    };
    const map = new kakao.maps.Map(container, options);
    const markerPosition = new kakao.maps.LatLng(...MapLocation);
    const marker = new kakao.maps.Marker({
      position: markerPosition,
    });
    marker.setMap(map);
  });

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
    }
  };

  const handleClickCategory = (e: any) => {
    setCategory(e.target.id);
  };

  const handleDetailPage = (e: any) => {
    const value = e.target.id;
    const throwState: State = { value1: value, value2: schoolName };

    navigate('/restaurant/detail', { state: throwState });
  };

  useEffect(() => {
    const handleOutside = (e: any) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) setShowSorts(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
    };
  }, [sortRef]);
  return (
    <>
      <DesktopHeader>
        <div>
          <div className="restaurant-main">
            <div className="restaurant-top">
              <div className="restaurant-top-div">
                <div>
                  <span className="restaurant-school-name">{state.state}</span>
                  <span className="restaurant-top-text">근처 인기 맛집</span>
                </div>
                <div className="restaurant-filter-divs">
                  <button
                    className="restaurant-filter-button"
                    onClick={() => {
                      setShowSorts(prev => !prev);
                    }}
                  >
                    <img src={filter} alt="" className="restaurant-filter-icon" />
                    정렬
                  </button>
                  {showSorts && (
                    <ul className={click ? 'restaurant-menu-list active' : 'restaurant-menu-list'}>
                      {sortList.map(sortList => (
                        <li
                          key={sortList.value}
                          id={sortList.title}
                          className={
                            sort.toString() === `${sortList.value}`
                              ? 'restaurant-filter-div active'
                              : 'restaurant-filter-div'
                          }
                          onClick={() => {
                            setSort(sortList.value);
                            setShowSorts(false);
                          }}
                        >
                          {sortList.title}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div id="map" className="restaurant-top-map"></div>
            </div>
            <div className="restaurant-bottom">
              <div className="restaurant-bottom-div">
                <ul className="restaurant-bottom-list">
                  {foodCategories.map(food => (
                    <li
                      key={food.eng}
                      id={food.eng}
                      className={
                        category.toString() === `${food.eng}`
                          ? 'restaurant-bottom-li active'
                          : 'restaurant-bottom-li'
                      }
                      onClick={handleClickCategory}
                    >
                      {food.category}
                    </li>
                  ))}
                </ul>
              </div>
              <hr className="underline" />
              <div className="restaurant-bottom-restaurant-list">
                {set?.map(restaurant => (
                  <div id={restaurant.restaurantId} key={restaurant.restaurantId}>
                    {restaurant.fileName ? (
                      <img
                        src={`/image/${restaurant.fileName}`}
                        id={restaurant.restaurantId}
                        className="restaurant-bottom-restaurant-img"
                        onClick={handleDetailPage}
                      />
                    ) : (
                      <div
                        id={restaurant.restaurantId}
                        className="restaurant-bottom-restaurant-img"
                        onClick={handleDetailPage}
                      ></div>
                    )}
                    <div className="restaurant-bottom-restaurant-text">
                      {restaurant.name}
                      <span className="restaurant-bottom-restaurant-starLiked">
                        {restaurant.starLiked}
                      </span>
                    </div>
                    <div className="restaurant-bottom-restaurant-tag">
                      {restaurant.restaurantCategory} | {restaurant.tag}
                    </div>
                    <div className="restaurant-bottom-restaurant-info">
                      <span>
                        <img src={view_count} alt="" />
                        {restaurant.viewCount}
                      </span>
                      <span>
                        <img src={star} alt="" />
                        {restaurant.starLiked}
                      </span>
                      <span>
                        <img src={heart} alt="" />
                        {restaurant.likedCount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DesktopHeader>
      <MobileHeader>
        <div>
          <div className="tablet-restaurant-main">
            <div className="tablet-restaurant-top">
              <div className="tablet-restaurant-top-div">
                <div>
                  <span className="tablet-restaurant-school-name">{state.state}</span>
                  <span className="tablet-restaurant-top-text">근처 인기 맛집</span>
                </div>
                <div className="tablet-restaurant-filter-divs">
                  <button
                    onClick={() => {
                      setShowSorts(prev => !prev);
                    }}
                    className="tablet-restaurant-filter-button"
                  >
                    <img src={filter} alt="" className="tablet-restaurant-filter-icon" />
                    정렬
                  </button>
                  {showSorts && (
                    <ul
                      ref={searchRef}
                      className={
                        click ? 'tablet-restaurant-menu-list active' : 'tablet-restaurant-menu-list'
                      }
                    >
                      {sortList.map(sortList => (
                        <li
                          key={sortList.value}
                          id={sortList.title}
                          className={
                            sort.toString() === `${sortList.value}`
                              ? 'tablet-restaurant-filter-div active'
                              : 'tablet-restaurant-filter-div'
                          }
                          onClick={() => {
                            setSort(sortList.value);
                            setShowSorts(false);
                          }}
                        >
                          {sortList.title}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div id="map" className="tablet-restaurant-top-map"></div>
            </div>
            <div className="tablet-restaurant-bottom">
              <div className="tablet-restaurant-bottom-div">
                <ul className="tablet-restaurant-bottom-list">
                  {foodCategories.map(food => (
                    <li
                      key={food.eng}
                      id={food.eng}
                      className={
                        category.toString() === `${food.eng}`
                          ? 'tablet-restaurant-bottom-li active'
                          : 'tablet-restaurant-bottom-li'
                      }
                      onClick={handleClickCategory}
                    >
                      {food.category}
                    </li>
                  ))}
                </ul>
              </div>
              <hr className="underline" />
              <div className="tablet-restaurant-bottom-restaurant-list">
                {set?.map(restaurant => (
                  <div id={restaurant.restaurantId} key={restaurant.restaurantId}>
                    {restaurant.fileName ? (
                      <img
                        src={`/image/${restaurant.fileName}`}
                        id={restaurant.restaurantId}
                        className="tablet-restaurant-bottom-restaurant-img"
                        onClick={handleDetailPage}
                      />
                    ) : (
                      <div
                        id={restaurant.restaurantId}
                        className="tablet-restaurant-bottom-restaurant-img"
                        onClick={handleDetailPage}
                      ></div>
                    )}
                    <div className="tablet-restaurant-bottom-restaurant-text">
                      {restaurant.name}
                      <span className="tablet-restaurant-bottom-restaurant-starLiked">
                        {restaurant.starLiked}
                      </span>
                    </div>
                    <div className="tablet-restaurant-bottom-restaurant-tag">
                      {restaurant.restaurantCategory} | {restaurant.tag}
                    </div>
                    <div className="tablet-restaurant-bottom-restaurant-info">
                      <span>
                        <img src={view_count} alt="" />
                        {restaurant.viewCount}
                      </span>
                      <span>
                        <img src={star} alt="" />
                        {restaurant.starLiked}
                      </span>
                      <span>
                        <img src={heart} alt="" />
                        {restaurant.likedCount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </MobileHeader>
      <Mobile>
        <div>
          <div className="mobile-restaurant-main">
            <div className="mobile-restaurant-top">
              <div className="mobile-restaurant-top-div">
                <div>
                  <span className="mobile-restaurant-school-name">{state.state}</span>
                  <span className="mobile-restaurant-top-text">근처 인기 맛집</span>
                </div>
                <div className="mobile-restaurant-filter-divs">
                  <button
                    onClick={() => {
                      setShowSorts(prev => !prev);
                    }}
                    className="mobile-restaurant-filter-button"
                  >
                    <img src={filter} alt="" className="mobile-restaurant-filter-icon" />
                    정렬
                  </button>
                  {showSorts && (
                    <ul
                      ref={searchRef}
                      className={
                        click ? 'mobile-restaurant-menu-list active' : 'mobile-restaurant-menu-list'
                      }
                    >
                      {sortList.map(sortList => (
                        <li
                          key={sortList.value}
                          id={sortList.title}
                          className={
                            sort.toString() === `${sortList.value}`
                              ? 'mobile-restaurant-filter-div active'
                              : 'mobile-restaurant-filter-div'
                          }
                          onClick={() => {
                            setSort(sortList.value);
                            setShowSorts(false);
                          }}
                        >
                          {sortList.title}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div id="map" className="mobile-restaurant-top-map"></div>
            </div>
            <div className="mobile-restaurant-bottom">
              <div className="mobile-restaurant-bottom-div">
                <ul className="mobile-restaurant-bottom-list">
                  {foodCategories.map(food => (
                    <li
                      key={food.eng}
                      id={food.eng}
                      className={
                        category.toString() === `${food.eng}`
                          ? 'mobile-restaurant-bottom-li active'
                          : 'mobile-restaurant-bottom-li'
                      }
                      onClick={handleClickCategory}
                    >
                      {food.category}
                    </li>
                  ))}
                </ul>
              </div>
              <hr className="underline" />
              <div className="mobile-restaurant-bottom-restaurant-list">
                {set?.map(restaurant => (
                  <div id={restaurant.restaurantId} key={restaurant.restaurantId}>
                    {restaurant.fileName ? (
                      <img
                        src={`/image/${restaurant.fileName}`}
                        id={restaurant.restaurantId}
                        className="mobile-restaurant-bottom-restaurant-img"
                        onClick={handleDetailPage}
                      />
                    ) : (
                      <div
                        id={restaurant.restaurantId}
                        className="mobile-restaurant-bottom-restaurant-img"
                        onClick={handleDetailPage}
                      ></div>
                    )}
                    <div className="mobile-restaurant-bottom-restaurant-text">
                      {restaurant.name}
                      <span className="mobile-restaurant-bottom-restaurant-starLiked">
                        {restaurant.starLiked}
                      </span>
                    </div>
                    <div className="mobile-restaurant-bottom-restaurant-tag">
                      {restaurant.restaurantCategory} | {restaurant.tag}
                    </div>
                    <div className="mobile-restaurant-bottom-restaurant-info">
                      <span>
                        <img src={view_count} alt="" />
                        {restaurant.viewCount}
                      </span>
                      <span>
                        <img src={star} alt="" />
                        {restaurant.starLiked}
                      </span>
                      <span>
                        <img src={heart} alt="" />
                        {restaurant.likedCount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Mobile>
    </>
  );
};

export default Restaurant;
