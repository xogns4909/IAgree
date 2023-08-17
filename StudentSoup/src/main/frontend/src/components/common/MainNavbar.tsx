import './mainNavbar.scss';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { DesktopHeader, Mobile, MobileHeader } from 'mediaQuery';
import mainLogo from 'assets/images/mainLogo.svg';
import Circle_human from 'assets/images/circle_human.png';
import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { postUserInfo } from 'apis/api/BoardAPI';
import { type userInformationType } from 'interfaces/UserTypes';

const MainNavbar = () => {
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

  const handleClickMenu = (e: React.MouseEvent) => {
    e.stopPropagation();

    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    setIsMenuOpen(() => false);

    Swal.fire({
      title: '로그아웃 시도',
      text: '로그아웃을 하시겠습니까?',
      icon: 'warning',

      showCancelButton: true,
      confirmButtonColor: '#ff611d',
      cancelButtonColor: '#bcbcbc',
      confirmButtonText: '확인',
      cancelButtonText: '취소',
    })
      .then(result => {
        if (result.isConfirmed) {
          localStorage.removeItem('access-token');
          localStorage.removeItem('refresh-token');

          setIsLogin(() => false);
          navigate('/');
          Swal.fire('로그아웃 성공', '로그아웃이 완료되었습니다.', 'success');
        }
      })
      .catch(() => {
        Swal.fire('로그아웃 실패', '로그아웃이 실패되었습니다. 다시 시도해 주세요.', 'error');
      });
  };

  const onCheckClickOutside = (e: MouseEvent) => {
    if (isMenuOpen && searchRef.current && !searchRef.current.contains(e.target as Node)) {
      setIsMenuOpen(!isMenuOpen);
    }
  };

  const loginCheck = () => {
    localStorage.getItem('access-token') ? setIsLogin(() => true) : setIsLogin(() => false);
  };

  useEffect(() => {
    if (isLogin) {
      postUserInfo()
        .then(response => {
          setUserInformation({ ...response.data });

          SET_IMAGE_FILE_ID(response.data.fileName);
        })
        .catch(() => {
          Swal.fire(
            '유저 정보 불러오기 실패',
            '유저 정보를 불러오지 못하였습니다. 다시 시도해 주세요.',
            'error',
          );
        });
    }
  }, [isLogin]);

  useEffect(() => {
    document.addEventListener('mousedown', onCheckClickOutside);

    return () => {
      document.removeEventListener('mousedown', onCheckClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    loginCheck();
  }, []);

  return (
    <>
      <DesktopHeader>
        <nav className="navbar-items">
          <Link to="/" className="navbar-logo-links">
            <i className="navbar-logo">SOUP</i>
          </Link>
          <ul className="nav-menu">
            <li className="nav-li">
              <Link to="/notice" className="nav-links" state={userInformation}>
                <i>공지사항</i>
              </Link>
            </li>
            <li className="nav-li">
              <Link to="/customerservice" className="nav-links" state={userInformation}>
                <i>고객센터</i>
              </Link>
            </li>
            {isLogin ? (
              <>
                <li className="nav-li">
                  <Link
                    to={`/restaurant/${userInformation.schoolName}`}
                    className="nav-links"
                    state={userInformation.schoolName}
                  >
                    <i>주변 맛집</i>
                  </Link>
                </li>
                <li className="nav-li">
                  <Link to="/board" className="nav-links" state={userInformation}>
                    <i>학교 게시판</i>
                  </Link>
                </li>
                <li className="nav-li">
                  <Link to="/mypage" className="nav-links">
                    <i>마이페이지</i>
                  </Link>
                </li>
                <li className="nav-li">
                  <div className="navbar-logout-div" onClick={handleLogout}>
                    <i>
                      <img
                        src={IMAGE_FILE_ID ? `/image/${IMAGE_FILE_ID}` : Circle_human}
                        className="navbar-logout"
                      />
                      <p className="navbar-hover-text">로그아웃</p>
                    </i>
                  </div>
                </li>
              </>
            ) : (
              <>
                <li className="nav-li">
                  <Link to="/Login" className="nav-links">
                    <i>로그인</i>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </DesktopHeader>
      <MobileHeader>
        <nav className="mobile-navbar-items">
          <Link to="/" className="navbar-logo-links">
            <i className="navbar-logo">SOUP</i>
          </Link>
          <div className="mobile-nav-menu">
            {isMenuOpen ? (
              <FontAwesomeIcon icon={faXmark} className="mobile-nav-menu-icon" />
            ) : isLogin ? (
              <img
                src={IMAGE_FILE_ID ? `/image/${IMAGE_FILE_ID}` : Circle_human}
                onMouseDown={handleClickMenu}
                className="mobile-nav-menu-profile"
              />
            ) : (
              <FontAwesomeIcon
                icon={faBars}
                className="mobile-nav-menu-icon"
                onMouseDown={handleClickMenu}
              />
            )}
          </div>
          <ul
            ref={searchRef}
            className={isMenuOpen ? 'mobile-nav-menu-list active' : 'mobile-nav-menu-list'}
          >
            <li>
              <Link to="/notice" className="mobile-nav-link" state={userInformation}>
                <div className="mobile-nav-list">
                  <i className="mobile-nav-listItme">공지사항</i>
                  <FontAwesomeIcon icon={faAngleRight} className="mobile-nav-icons" />
                </div>
              </Link>
            </li>
            <li>
              <Link to="/customerservice" className="mobile-nav-link" state={userInformation}>
                <div className="mobile-nav-list">
                  <i className="mobile-nav-listItme">고객센터</i>
                  <FontAwesomeIcon icon={faAngleRight} className="mobile-nav-icons" />
                </div>
              </Link>
            </li>
            {isLogin ? (
              <>
                <li>
                  <Link
                    to={`/restaurant/${userInformation.schoolName}`}
                    className="mobile-nav-link"
                    state={userInformation.schoolName}
                  >
                    <div className="mobile-nav-list">
                      <i className="mobile-nav-listItme">주변 맛집</i>
                      <FontAwesomeIcon icon={faAngleRight} className="mobile-nav-icons" />
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/board" className="mobile-nav-link" state={userInformation}>
                    <div className="mobile-nav-list">
                      <i className="mobile-nav-listItme">학교 게시판</i>
                      <FontAwesomeIcon icon={faAngleRight} className="mobile-nav-icons" />
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/mypage" className="mobile-nav-link">
                    <div className="mobile-nav-list">
                      <i className="mobile-nav-listItme">마이페이지</i>
                      <FontAwesomeIcon icon={faAngleRight} className="mobile-nav-icons" />
                    </div>
                  </Link>
                </li>
                <div className="mobile-nav-link" onClick={handleLogout}>
                  <div className="mobile-nav-list">
                    <i className="mobile-nav-listItme">로그아웃</i>
                    <FontAwesomeIcon icon={faAngleRight} className="mobile-nav-icons" />
                  </div>
                </div>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="mobile-nav-link">
                    <div className="mobile-nav-list">
                      <i className="mobile-nav-listItme">로그인</i>
                      <FontAwesomeIcon icon={faAngleRight} className="mobile-nav-icons" />
                    </div>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </MobileHeader>
      <Mobile>
        <nav className="mobile-navbar-items">
          <Link to="/" className="navbar-logo-links">
            <i className="navbar-logo">SOUP</i>
          </Link>
          <div className="mobile-nav-menu">
            {isMenuOpen ? (
              <FontAwesomeIcon icon={faXmark} className="mobile-nav-menu-icon" />
            ) : (
              <FontAwesomeIcon
                icon={faBars}
                className="mobile-nav-menu-icon"
                onMouseDown={handleClickMenu}
              />
            )}
          </div>
          <ul
            ref={searchRef}
            className={isMenuOpen ? 'mobile-nav-menu-list active' : 'mobile-nav-menu-list'}
          >
            <li>
              <Link to="/notice" className="mobile-nav-link" state={userInformation}>
                <div className="mobile-nav-list">
                  <i className="mobile-nav-listItme">공지사항</i>
                  <FontAwesomeIcon icon={faAngleRight} className="mobile-nav-icons" />
                </div>
              </Link>
            </li>
            <li>
              <Link to="/customerservice" className="mobile-nav-link" state={userInformation}>
                <div className="mobile-nav-list">
                  <i className="mobile-nav-listItme">고객센터</i>
                  <FontAwesomeIcon icon={faAngleRight} className="mobile-nav-icons" />
                </div>
              </Link>
            </li>
            {isLogin ? (
              <>
                <li>
                  <Link
                    to={`/restaurant/${userInformation.schoolName}`}
                    className="mobile-nav-link"
                    state={userInformation.schoolName}
                  >
                    <div className="mobile-nav-list">
                      <i className="mobile-nav-listItme">주변 맛집</i>
                      <FontAwesomeIcon icon={faAngleRight} className="mobile-nav-icons" />
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/board" className="mobile-nav-link" state={userInformation}>
                    <div className="mobile-nav-list">
                      <i className="mobile-nav-listItme">학교 게시판</i>
                      <FontAwesomeIcon icon={faAngleRight} className="mobile-nav-icons" />
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/mypage" className="mobile-nav-link">
                    <div className="mobile-nav-list">
                      <i className="mobile-nav-listItme">마이페이지</i>
                      <FontAwesomeIcon icon={faAngleRight} className="mobile-nav-icons" />
                    </div>
                  </Link>
                </li>
                <div className="mobile-nav-link" onClick={handleLogout}>
                  <div className="mobile-nav-list">
                    <i className="mobile-nav-listItme">로그아웃</i>
                    <FontAwesomeIcon icon={faAngleRight} className="mobile-nav-icons" />
                  </div>
                </div>
              </>
            ) : (
              <li>
                <Link to="/login" className="mobile-nav-link">
                  <div className="mobile-nav-list">
                    <i className="mobile-nav-listItme">로그인</i>
                    <FontAwesomeIcon icon={faAngleRight} className="mobile-nav-icons" />
                  </div>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </Mobile>
      <Outlet />
    </>
  );
};

export default MainNavbar;
