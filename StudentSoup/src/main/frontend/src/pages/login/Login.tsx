import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.scss';
import useInput from '../../hooks/useInput';
import { login } from '../../apis/auth/AuthAPI';
import Swal from 'sweetalert2';

const Login = () => {
  const [userId, onChangeUserId, setUserId] = useInput('');
  const [userPassword, onChangeUserPassword, setUserPassword] = useInput('');
  const [isRememberId, setIsRememberId] = useState(false);

  const navigate = useNavigate();

  const Toast = Swal.mixin({
    toast: true,
    position: 'bottom',
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
  });

  const onClickRememberId = () => {
    if (isRememberId) {
      localStorage.removeItem('rememberId');
    }

    setIsRememberId(prevState => !prevState);
  };

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (isRememberId) {
        localStorage.setItem('rememberId', userId);
      }

      login(userId, userPassword)
        .then(response => {
          setUserId('');
          setUserPassword('');

          Toast.fire({
            icon: 'success',
            title: '로그인을 성공하였습니다.',
          });
          window.location.replace('/');
        })
        .catch(error => {
          const errorMessage = error.response.data.message;

          Toast.fire({
            icon: 'error',
            title: errorMessage,
          });

          setUserPassword('');
        });
    },
    [userId, userPassword],
  );

  useEffect(() => {
    if (localStorage.getItem('access-token')) {
      Toast.fire({
        icon: 'error',
        title: '이미 로그인이 되어있습니다.',
      });

      navigate('/');
    }

    if (localStorage.getItem('rememberId') != null) {
      setIsRememberId(true);
      setUserId(localStorage.getItem('rememberId'));
    }
  }, [localStorage.getItem('rememberId'), localStorage.getItem('token')]);

  return (
    <div className="background">
      <div className="login-main">
        <h2>로그인</h2>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            className="id"
            value={userId}
            onChange={onChangeUserId}
            placeholder="아이디 또는 이메일을 입력해주세요"
          />
          <input
            type="password"
            className="password"
            value={userPassword}
            onChange={onChangeUserPassword}
            placeholder="비밀번호를 입력해주세요"
            autoComplete="current-password"
          />
          <div className="login-keep-wrap">
            <div className="remember-wrap" onClick={onClickRememberId}>
              <div className={isRememberId ? 'checked-remember-id' : 'unchecked-remember-id'} />
              <span>아이디 저장</span>
            </div>
            <Link to="/login/findAccount">아이디/비밀번호 찾기</Link>
          </div>
          <button className="login-button" type="submit">
            로그인
          </button>
          <Link to="/signup/process/1" className="signup-link">
            <button className="signup-button">회원가입</button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
