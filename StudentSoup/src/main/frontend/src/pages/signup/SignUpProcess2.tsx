import React, { useCallback, useEffect, useState } from 'react';
import { Desktop, Mobile } from 'mediaQuery';
import Background from 'components/common/Background';
import SignUpComponent from './components/SignUpComponent';
import process_activate_2 from 'assets/images/signup_process_activate_2.png';
import process_3 from 'assets/images/signup_process_3.png';
import process_check from 'assets/images/signup_process_check.png';
import process_bar from 'assets/images/signup_process_bar.png';
import process_next_bar from 'assets/images/signup_process_next_bar.png';
import unchecked from 'assets/images/signup_uncheck.png';
import './signupprocess2.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import useInput from 'hooks/useInput';
import Swal from 'sweetalert2';
import { createUser, checkSignUpId } from 'apis/auth/AuthAPI';

const SignUpProcess2 = () => {
  const [userId, , setUserId] = useInput('');
  const [userPassword, , setUserPassword] = useInput('');
  const [userPasswordValidation, , setUserPasswordValidation] = useInput('');

  const [userIdText, setUserIdText] = useState('');
  const [isCheckedId, setCheckedId] = useState(false);
  const [isPasswordValidation, setIsPasswordValidation] = useState(false);
  const [isPasswordUpperLowerCaseTest, setIsPasswordUpperLowerCaseTest] = useState(false);
  const [isPasswordNumberTest, setIsPasswordNumberTest] = useState(false);
  const [isPasswordCharacterLength, setIsPasswordCharacterLength] = useState(false);

  const { state } = useLocation();
  console.log(state);
  const navigate = useNavigate();

  const REG_ID = /^[a-zA-Z]{1}/;
  const REG_UPPER_LOWERCASE = /[a-zA-Z]/;
  const REG_NUMBER = /[0-9]/;
  const REG_CHARACTER_LENGTH = /^[a-zA-Z0-9@$!%*#?&]{8,20}$/;

  const onChangeUserId = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUserId(e.target.value);
    },
    [userId],
  );

  const onClickIdCheck = () => {
    if (userId !== '') {
      if (REG_ID.test(userId)) {
        checkSignUpId(userId)
          .then(response => {
            if (response.statusText === 'OK') {
              setUserIdText('사용 가능한 아이디 입니다.');
              setCheckedId(true);
            }
          })
          .catch(error => {
            setUserIdText(error.response.data.message);
            setCheckedId(false);
          });
      } else {
        setUserIdText('아이디는 영문자로 시작해야하며 영문자 또는 숫자로만 사용 가능합니다.');
        setCheckedId(false);
      }
    } else {
      setUserIdText('아이디를 입력해 주세요.');
      setCheckedId(false);
    }
  };

  const passwordTest = useCallback(() => {
    setIsPasswordUpperLowerCaseTest(REG_UPPER_LOWERCASE.test(userPassword));
    setIsPasswordNumberTest(REG_NUMBER.test(userPassword));
    setIsPasswordCharacterLength(REG_CHARACTER_LENGTH.test(userPassword));
  }, [userPassword, isPasswordUpperLowerCaseTest, isPasswordNumberTest]);

  const onChangeUserPassword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUserPassword(e.target.value);
      passwordTest();
      onChangeComparePassword();
    },
    [userPassword],
  );

  const onChangeUserPasswordValidation = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUserPasswordValidation(e.target.value);
      onChangeComparePassword();
    },
    [userPasswordValidation, setUserPasswordValidation],
  );

  const onChangeComparePassword = useCallback(() => {
    if (userPassword !== '' && userPassword === userPasswordValidation) {
      setIsPasswordValidation(true);
    } else {
      setIsPasswordValidation(false);
    }
  }, [userPassword, userPasswordValidation, setIsPasswordValidation]);

  const onSubmitSignup = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (
        isCheckedId &&
        isPasswordUpperLowerCaseTest &&
        isPasswordNumberTest &&
        isPasswordCharacterLength &&
        isPasswordValidation
      ) {
        createUser(userId, userPassword)
          .then(response => {
            const id = response.data.id;
            const password = response.data.pwd;
            navigate('/signup/process/3', { state: { id, password, ...state } });
          })
          .catch(error => {
            console.log(error.response.data.message);
            Swal.fire({
              icon: 'error',
              title: '회원가입에 실패하였습니다.',
              text: error.response.data.message,
            });
          });
      }
    },
    [
      userId,
      userPassword,
      isPasswordUpperLowerCaseTest,
      isPasswordNumberTest,
      isPasswordCharacterLength,
      isPasswordValidation,
    ],
  );

  useEffect(() => {
    if (!state) {
      navigate('/');
    }

    passwordTest();
    onChangeComparePassword();
  }, [
    state,
    userId,
    userPassword,
    userPasswordValidation,
    isPasswordUpperLowerCaseTest,
    isPasswordNumberTest,
    isPasswordCharacterLength,
  ]);

  return (
    <div className="signup-process-2-container">
      <Background>
        <SignUpComponent
          process_1={process_check}
          process_2={
            isCheckedId &&
            isPasswordUpperLowerCaseTest &&
            isPasswordNumberTest &&
            isPasswordCharacterLength &&
            isPasswordValidation
              ? process_check
              : process_activate_2
          }
          process_3={process_3}
          process_bar_1={process_next_bar}
          process_bar_2={process_bar}
          sentence_2="activate-sentence-2"
          sentence_3="sentence-3"
        >
          <Desktop>
            <h2>
              로그인에 사용할 아이디와 비밀번호를
              <br /> 입력해주세요.
            </h2>
          </Desktop>
          <Mobile>
            <h2>
              로그인에 사용할 아이디와
              <br />
              비밀번호를 입력해주세요.
            </h2>
          </Mobile>
          <form className="signup-form" onSubmit={onSubmitSignup}>
            <label className="id-input-label">
              ID
              <div>
                <input
                  type="text"
                  value={userId}
                  placeholder="아이디 입력"
                  onChange={onChangeUserId}
                />
                <button type="button" onClick={onClickIdCheck}>
                  중복 확인
                </button>
              </div>
            </label>
            <div className="alert-text-wrap">
              <span className="signup-concord">{userIdText}</span>
            </div>
            <label className="password-input-label">
              PW
              <input
                type="password"
                value={userPassword}
                placeholder="비밀번호 입력"
                onChange={onChangeUserPassword}
              />
            </label>
            <div className="alert-text-wrap">
              <span className={isPasswordUpperLowerCaseTest ? 'signup-concord' : undefined}>
                대소문자 <img src={unchecked} alt="checked" />
              </span>
              <span className={isPasswordNumberTest ? 'signup-concord' : undefined}>
                &nbsp;숫자 <img src={unchecked} alt="checked" />
              </span>
              <span className={isPasswordCharacterLength ? 'signup-concord' : undefined}>
                &nbsp;8-20자 이내 <img src={unchecked} alt="checked" />
              </span>
            </div>
            <label>
              <input
                type="password"
                value={userPasswordValidation}
                placeholder="비밀번호 확인"
                onChange={onChangeUserPasswordValidation}
              />
            </label>
            <div className="alert-text-wrap">
              <span className={isPasswordValidation ? 'signup-concord' : undefined}>
                비밀번호 일치 <img src={unchecked} alt="checked" />
              </span>
            </div>
            {isCheckedId &&
            isPasswordUpperLowerCaseTest &&
            isPasswordNumberTest &&
            isPasswordCharacterLength &&
            isPasswordValidation ? (
              <button className="signup-activate-button" type="submit">
                다음
              </button>
            ) : (
              <button className="signup-disabled-button" type="submit">
                다음
              </button>
            )}
          </form>
        </SignUpComponent>
      </Background>
    </div>
  );
};

export default SignUpProcess2;
