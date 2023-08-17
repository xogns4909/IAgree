import React, { useEffect, useState } from 'react';
import './home.scss';
import MainLogo_white from 'assets/images/mainLogo_white.svg';
import Search_icon from 'assets/images/search_icon.svg';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { type SchoolListType } from 'interfaces/HomeTypes';
import { SchoolList } from 'apis/api/HomeAPI';

const Home = () => {
  const [schoolComponent, setSchoolComponent] = useState<any>([]);
  const [schoolName, setSchoolName] = useState<string>('');
  const [isWavy, setIsWavy] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsWavy(false);
    }, 5200);

    return () => clearTimeout(timer);
  }, []);
  const saveSchoolName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSchoolName(e.target.value);
  };

  const Toast = Swal.mixin({
    toast: true,
    position: 'bottom',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  const handleClickSearch = () => {
    if (!schoolName) {
      Toast.fire({
        icon: 'error',
        title: '학교를 입력해주세요.',
      });
      return;
    } else if (
      schoolComponent.find((item: { schoolName: string }) => item.schoolName === schoolName) ===
      undefined
    ) {
      Toast.fire({
        toast: true,
        icon: 'error',
        title: '학교 정보가 없습니다.',
      });
      return;
    }
    navigate(`/restaurant/${schoolName}`, { state: schoolName });
  };

  const activeEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleClickSearch();
    }
  };

  useEffect(() => {
    SchoolList()
      .then(res => {
        setSchoolComponent(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  const filterSchoolName = schoolComponent.filter((item: { schoolName: string | string[] }) => {
    return item.schoolName.includes(schoolName);
  });
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      Swal.fire({
        title: event.data.title,
        text: event.data.body,
        icon: 'info',
        showCancelButton: false,
        confirmButtonText: 'OK',
      });
    };

    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.addEventListener('message', handleMessage);
    }

    return () => {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.removeEventListener('message', handleMessage);
      }
    };
  }, []);

  const logoColors = [
    '#FF611D',
    'hsl(30, 100%, 60%)',
    'hsl(30, 100%, 60%)',
    'hsl(30, 100%, 60%)',
    'hsl(30, 100%, 60%)',
    'hsl(30, 100%, 60%)',
    'hsl(30, 100%, 60%)',
    'hsla(0, 100%, 100%, 0%)',
    '#FF611D',
    'hsl(30, 100%, 60%)',
    'hsl(30, 100%, 60%)',
    'hsl(30, 100%, 60%)',
  ];

  const getWavyStyle = (index: number) =>
    ({
      '--i': index.toString(),
      color: logoColors[index - 1],
    } as React.CSSProperties);
  return (
    <div className="home-hero-text">
      <div
        className={`home-waviy ${isWavy ? '' : 'inactive'}`}
        onMouseEnter={() => setIsWavy(true)}
        onMouseLeave={() => setIsWavy(false)}
      >
        <span style={getWavyStyle(1)}>S</span>
        <span style={getWavyStyle(2)}>t</span>
        <span style={getWavyStyle(3)}>u</span>
        <span style={getWavyStyle(4)}>d</span>
        <span style={getWavyStyle(5)}>e</span>
        <span style={getWavyStyle(6)}>n</span>
        <span style={getWavyStyle(7)}>t</span>
        <span style={getWavyStyle(8)}>&nbsp;</span>
        <span style={getWavyStyle(9)}>S</span>
        <span style={getWavyStyle(10)}>o</span>
        <span style={getWavyStyle(11)}>u</span>
        <span style={getWavyStyle(12)}>p</span>
      </div>
      <h2 className="home-link-texts">대학생들을 위한</h2>
      <h2 className="home-link-texts">대학 주변 맛집 추천</h2>
      <div className="home-school_search_bar">
        <img src={Search_icon} />
        <input
          type="text"
          onChange={saveSchoolName}
          value={schoolName}
          placeholder="지역 학교 명을 입력하세요."
          onKeyDown={e => activeEnter(e)}
        ></input>
        <button onClick={handleClickSearch}>검색</button>
        {schoolName && (
          <>
            {filterSchoolName.map((school: SchoolListType) => (
              <div
                onClick={() => {
                  setSchoolName(school.schoolName);
                }}
                className="home-school-list"
                key={school.schoolId}
              >
                {school.schoolName}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
