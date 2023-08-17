import './restaurantNavbar.scss';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { DesktopRestaurantHeader, Mobile, MobileRestaurantHeader } from 'mediaQuery';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import SearchIcon from 'assets/images/restaurant_search.svg';
import { postUserInfo } from 'apis/api/BoardAPI';
import { logout } from 'apis/auth/AuthAPI';
import mainLogo from 'assets/images/mainLogo.svg';
import Circle_human from 'assets/images/circle_human.png';
import { type userInformationType } from 'interfaces/UserTypes';
import { SchoolList } from 'apis/api/HomeAPI';
import { type SchoolListType } from 'interfaces/HomeTypes';

const RestaurantNavbar = () => {
  const [schoolComponent, setSchoolComponent] = useState<SchoolListType[]>([]);
  const [schoolName, setSchoolName] = useState<string>('');
  const [userSchoolName, setUserSchoolName] = useState<string>('');
  const [isUseSearch, setIsUseSearch] = useState<boolean>(true);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [userInformation, setUserInformation] = useState<userInformationType>({
    departmentId: 0,
    departmentName: '',
    email: '',
    fileName: null,
    id: '',
    memberClassification: '',
    memberId: 0,
    nickname: '',
    registrationDate: '',
    schoolId: 0,
    schoolName: '',
  });

  const [IMAGE_FILE_ID, SET_IMAGE_FILE_ID] = useState<string>('');

  const searchRef = useRef<HTMLUListElement | null>(null);
  const navigate = useNavigate();

  const Toast = Swal.mixin({
    toast: true,
    position: 'bottom',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  const saveSchoolName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSchoolName(e.target.value);
    if (schoolName !== '') {
      setIsUseSearch(true);
    }
  };

  const handleClickNearbyRestaurants = () => {
    navigate(`/restaurant/${userSchoolName}`, { state: userSchoolName });
  };

  const handleClickSearch = useCallback(() => {
    if (schoolName !== '') {
      if (!schoolName) {
        Toast.fire({
          icon: 'error',
          title: '학교를 입력해주세요.',
        });
      } else if (
        schoolComponent.find((item: { schoolName: string }) => item.schoolName === schoolName) ===
        undefined
      ) {
        Toast.fire({
          toast: true,
          icon: 'error',
          title: '학교 정보가 없습니다.',
        });
      }

      setIsUseSearch(false);
      setIsMenuOpen(false);
      setSchoolName('');
      navigate(`/restaurant/${schoolName}`, { state: schoolName });
    } else {
      Toast.fire({
        toast: true,
        icon: 'error',
        title: '지역 또는 학교 정보를 입력해주세요.',
      });
    }
  }, [schoolName, schoolComponent]);

  const activeEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleClickSearch();
    }
  };

  const filterSchoolName = schoolComponent.filter((item: { schoolName: string | string[] }) => {
    return item.schoolName.includes(schoolName);
  });

  const handleClickMenu = (e: React.MouseEvent) => {
    e.stopPropagation();

    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    setIsMenuOpen(false);

    Swal.fire({
      title: '로그아웃 시도',
      text: '로그아웃을 하시겠습니까?',
      icon: 'warning',

      showCancelButton: true,
      confirmButtonColor: '#ff611d',
      cancelButtonColor: '#bcbcbc',
      confirmButtonText: '확인',
      cancelButtonText: '취소',
    }).then(result => {
      if (result.isConfirmed) {
        logout()
          .then(() => {
            localStorage.removeItem('access-token');
            localStorage.removeItem('refresh-token');
            setIsLogin(false);

            Swal.fire('로그아웃 성공', '로그아웃이 완료되었습니다.', 'success');
            navigate('/');
          })
          .catch(() => {
            Swal.fire('로그아웃 실패', '로그아웃이 실패되었습니다. 다시 시도해 주세요.', 'error');
          });
      }
    });
  };

  const onCheckClickOutside = (e: MouseEvent) => {
    if (isMenuOpen && searchRef.current && !searchRef.current.contains(e.target as Node)) {
      setIsMenuOpen(!isMenuOpen);
    }
  };

  const loginCheck = () => {
    return localStorage.getItem('access-token') ? setIsLogin(true) : setIsLogin(false);
  };

  useEffect(() => {
    loginCheck();
    SchoolList()
      .then(res => {
        setSchoolComponent(res.data);
      })
      .catch(() => {
        Swal.fire(
          '학교 정보 불러오기 실패',
          '불러오기가 실패되었습니다. 다시 시도해 주세요.',
          'error',
        );
      });

    document.addEventListener('mousedown', onCheckClickOutside);

    return () => {
      document.removeEventListener('mousedown', onCheckClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (isLogin) {
      postUserInfo()
        .then(response => {
          setUserSchoolName(response.data.schoolName);
          SET_IMAGE_FILE_ID(response.data.fileName);
          setUserInformation({ ...response.data });
        })
        .catch(() => {
          Swal.fire(
            '유저 정보 불러오기 실패',
            '유저정보를 불러오지 못했습니다. 다시 시도해 주세요.',
            'error',
          );
        });
    }
  }, [isLogin]);

  return (
    <>
      <DesktopRestaurantHeader>
        <>
          <nav className="restaurant-navbar-items">
            <div className="restaurant-navbar-left">
              <Link to="/" className="restaurant-navbar-logo-links">
                <i className="restaurant-navbar-logo">SOUP</i>
              </Link>
              <div className="restaurant-navbar-input-div">
                <input
                  type="search"
                  value={schoolName}
                  onChange={saveSchoolName}
                  placeholder="지역 또는 학교명을 입력하세요."
                  className="restaurant-navbar-input"
                  onKeyUp={e => activeEnter(e)}
                />
                <img
                  src={SearchIcon}
                  className="restaurant-navbar-img"
                  alt="검색이미지"
                  onClick={handleClickSearch}
                />
                {schoolName && isUseSearch && (
                  <>
                    {filterSchoolName.map((school: SchoolListType) => (
                      <div
                        onClick={() => {
                          setSchoolName(school.schoolName);
                        }}
                        className="search-school-list"
                        key={school.schoolId}
                      >
                        {school.schoolName}
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
            <ul className="restaurant-nav-menu">
              <li className="restaurant-nav-li">
                <Link to="/notice" className="restaurant-nav-links" state={userInformation}>
                  <i>공지사항</i>
                </Link>
              </li>
              <li className="restaurant-nav-li">
                <Link
                  to="/customerservice"
                  className="restaurant-nav-links"
                  state={userInformation}
                >
                  <i>고객센터</i>
                </Link>
              </li>
              {isLogin ? (
                <>
                  <li className="restaurant-nav-li">
                    <div className="restaurant-nav-links" onClick={handleClickNearbyRestaurants}>
                      <i>주변 맛집</i>
                    </div>
                  </li>
                  <li className="restaurant-nav-li">
                    <Link to="/board" className="restaurant-nav-links" state={userInformation}>
                      <i>학교 게시판</i>
                    </Link>
                  </li>
                  <li className="restaurant-nav-li">
                    <Link to="/mypage" className="restaurant-nav-links">
                      <i>마이페이지</i>
                    </Link>
                  </li>
                  <li className="restaurant-nav-li">
                    <div className="restaurant-navbar-logout-div" onClick={handleLogout}>
                      <i>
                        <img
                          src={IMAGE_FILE_ID ? `/image/${IMAGE_FILE_ID}` : Circle_human}
                          className="restaurant-navbar-logout"
                        />
                        <p className="restaurant-navbar-hover-text">로그아웃</p>
                      </i>
                    </div>
                  </li>
                </>
              ) : (
                <li className="restaurant-nav-li">
                  <Link to="/login" className="restaurant-nav-links">
                    <i>로그인</i>
                  </Link>
                </li>
              )}
            </ul>
          </nav>
          <Outlet />
        </>
      </DesktopRestaurantHeader>
      <MobileRestaurantHeader>
        <>
          <nav className="tablet-restaurant-navbar-items">
            <Link to="/" className="restaurant-navbar-logo-links">
              <i className="restaurant-navbar-logo">SOUP</i>
            </Link>
            <div className="tablet-restaurant-nav-menu">
              {isMenuOpen ? (
                <FontAwesomeIcon icon={faXmark} className="tablet-restaurant-nav-menu-icon" />
              ) : isLogin ? (
                <img
                  src={IMAGE_FILE_ID ? `/image/${IMAGE_FILE_ID}` : Circle_human}
                  onMouseDown={handleClickMenu}
                  className="tablet-restaurant-nav-menu-profile"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faBars}
                  className="tablet-restaurant-nav-menu-icon"
                  onMouseDown={handleClickMenu}
                />
              )}
            </div>
            <ul
              ref={searchRef}
              className={
                isMenuOpen
                  ? 'tablet-restaurant-nav-menu-list active'
                  : 'tablet-restaurant-nav-menu-list'
              }
            >
              <li className="tablet-restaurant-navbar-input-div">
                <div className="tablet-restaurant-navbar-input-div">
                  <input
                    type="search"
                    onChange={saveSchoolName}
                    value={schoolName}
                    placeholder="지역 또는 학교명을 입력하세요."
                    className="tablet-restaurant-navbar-input"
                    onKeyUp={e => activeEnter(e)}
                  />
                  <img
                    src={SearchIcon}
                    className="tablet-restaurant-navbar-img"
                    alt="검색이미지"
                    onClick={handleClickSearch}
                  />
                  {schoolName && isUseSearch && (
                    <>
                      {filterSchoolName.map((school: SchoolListType) => (
                        <div
                          onClick={() => {
                            setSchoolName(school.schoolName);
                          }}
                          className="tablet-search-school-list"
                          key={school.schoolId}
                        >
                          {school.schoolName}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </li>
              <li>
                <Link to="/notice" className="tablet-restaurant-nav-link" state={userInformation}>
                  <div className="tablet-restaurant-nav-list">
                    <i className="tablet-restaurant-nav-list-item">공지사항</i>
                    <FontAwesomeIcon icon={faAngleRight} className="tablet-restaurant-nav-icons" />
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  to="/customerservice"
                  className="tablet-restaurant-nav-link"
                  state={userInformation}
                >
                  <div className="tablet-restaurant-nav-list">
                    <i className="tablet-restaurant-nav-list-item">고객센터</i>
                    <FontAwesomeIcon icon={faAngleRight} className="tablet-restaurant-nav-icons" />
                  </div>
                </Link>
              </li>
              {isLogin ? (
                <>
                  <li>
                    <div
                      className="tablet-restaurant-nav-link"
                      onClick={handleClickNearbyRestaurants}
                    >
                      <div className="tablet-restaurant-nav-list">
                        <i className="tablet-restaurant-nav-list-item">주변 맛집</i>
                        <FontAwesomeIcon
                          icon={faAngleRight}
                          className="tablet-restaurant-nav-icons"
                        />
                      </div>
                    </div>
                  </li>
                  <li>
                    <Link
                      to="/board"
                      className="tablet-restaurant-nav-links"
                      state={userInformation}
                    >
                      <div className="tablet-restaurant-nav-list">
                        <i className="tablet-restaurant-nav-list-item">학교 게시판</i>
                        <FontAwesomeIcon
                          icon={faAngleRight}
                          className="tablet-restaurant-nav-icons"
                        />
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="/mypage" className="tablet-restaurant-nav-links">
                      <div className="tablet-restaurant-nav-list">
                        <i className="tablet-restaurant-nav-list-item">마이페이지</i>
                        <FontAwesomeIcon
                          icon={faAngleRight}
                          className="tablet-restaurant-nav-icons"
                        />
                      </div>
                    </Link>
                  </li>
                  <li>
                    <div className="tablet-restaurant-nav-list" onClick={handleLogout}>
                      <i className="tablet-restaurant-nav-list-item">로그아웃</i>
                      <FontAwesomeIcon
                        icon={faAngleRight}
                        className="tablet-restaurant-nav-icons"
                      />
                    </div>
                  </li>
                </>
              ) : (
                <li>
                  <Link to="/login" className="tablet-restaurant-nav-link">
                    <div className="tablet-restaurant-nav-list">
                      <i className="tablet-restaurant-nav-list-item">로그인</i>
                      <FontAwesomeIcon
                        icon={faAngleRight}
                        className="tablet-restaurant-nav-icons"
                      />
                    </div>
                  </Link>
                </li>
              )}
            </ul>
          </nav>
          <Outlet />
        </>
      </MobileRestaurantHeader>
      <Mobile>
        <>
          <nav className="mobile-restaurant-navbar-items">
            <Link to="/" className="restaurant-navbar-logo-links">
              <i className="restaurant-navbar-logo">SOUP</i>
            </Link>
            <div className="mobile-restaurant-nav-menu">
              {isMenuOpen ? (
                <FontAwesomeIcon icon={faXmark} className="mobile-restaurant-nav-menu-icon" />
              ) : isLogin ? (
                <img
                  src={IMAGE_FILE_ID ? `/image/${IMAGE_FILE_ID}` : Circle_human}
                  onMouseDown={handleClickMenu}
                  className="mobile-restaurant-nav-menu-profile"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faBars}
                  className="mobile-restaurant-nav-menu-icon"
                  onMouseDown={handleClickMenu}
                />
              )}
            </div>
            <ul
              ref={searchRef}
              className={
                isMenuOpen
                  ? 'mobile-restaurant-nav-menu-list active'
                  : 'mobile-restaurant-nav-menu-list'
              }
            >
              <li className="mobile-restaurant-navbar-input-div">
                <div className="mobile-restaurant-navbar-input-div">
                  <input
                    type="search"
                    onChange={saveSchoolName}
                    value={schoolName}
                    placeholder="지역 또는 학교명을 입력하세요."
                    className="mobile-restaurant-navbar-input"
                    onKeyUp={e => activeEnter(e)}
                  />
                  <img
                    src={SearchIcon}
                    className="mobile-restaurant-navbar-img"
                    alt="검색이미지"
                    onClick={handleClickSearch}
                  />
                  {schoolName && isUseSearch && (
                    <>
                      {filterSchoolName.map((school: SchoolListType) => (
                        <div
                          onClick={() => {
                            setSchoolName(school.schoolName);
                          }}
                          className="mobile-search-school-list"
                          key={school.schoolId}
                        >
                          {school.schoolName}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </li>
              <li>
                <Link to="/notice" className="mobile-restaurant-nav-link" state={userInformation}>
                  <div className="mobile-restaurant-nav-list">
                    <i className="mobile-restaurant-nav-list-item">공지사항</i>
                    <FontAwesomeIcon icon={faAngleRight} className="mobile-restaurant-nav-icons" />
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  to="/customerservice"
                  className="mobile-restaurant-nav-link"
                  state={userInformation}
                >
                  <div className="mobile-restaurant-nav-list">
                    <i className="mobile-restaurant-nav-list-item">고객센터</i>
                    <FontAwesomeIcon icon={faAngleRight} className="mobile-restaurant-nav-icons" />
                  </div>
                </Link>
              </li>
              {isLogin ? (
                <>
                  <li>
                    <div
                      className="mobile-restaurant-nav-link"
                      onClick={handleClickNearbyRestaurants}
                    >
                      <div className="mobile-restaurant-nav-list">
                        <i className="mobile-restaurant-nav-list-item">주변 맛집</i>
                        <FontAwesomeIcon
                          icon={faAngleRight}
                          className="mobile-restaurant-nav-icons"
                        />
                      </div>
                    </div>
                  </li>
                  <li>
                    <Link
                      to="/board"
                      className="mobile-restaurant-nav-link"
                      state={userInformation}
                    >
                      <div className="mobile-restaurant-nav-list">
                        <i className="mobile-restaurant-nav-list-item">학교 게시판</i>
                        <FontAwesomeIcon
                          icon={faAngleRight}
                          className="mobile-restaurant-nav-icons"
                        />
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="/mypage" className="mobile-restaurant-nav-link">
                      <div className="mobile-restaurant-nav-list">
                        <i className="mobile-restaurant-nav-list-item">마이페이지</i>
                        <FontAwesomeIcon
                          icon={faAngleRight}
                          className="mobile-restaurant-nav-icons"
                        />
                      </div>
                    </Link>
                  </li>
                  <li>
                    <div className="mobile-restaurant-nav-list" onClick={handleLogout}>
                      <i className="mobile-restaurant-nav-list-item">로그아웃</i>
                      <FontAwesomeIcon
                        icon={faAngleRight}
                        className="mobile-restaurant-nav-icons"
                      />
                    </div>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="mobile-restaurant-nav-link">
                      <div className="mobile-restaurant-nav-list">
                        <i className="mobile-restaurant-nav-list-item">로그인</i>
                        <FontAwesomeIcon
                          icon={faAngleRight}
                          className="mobile-restaurant-nav-icons"
                        />
                      </div>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
          <Outlet />
        </>
      </Mobile>
    </>
  );
};

export default RestaurantNavbar;
