import { useState } from 'react';
import './findPWD.scss';
import { findUserPassword } from 'apis/auth/AuthAPI';

const FindPWD = () => {
  const [email, setEmail] = useState<string>('');
  const [id, setId] = useState<string>('');
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    findUserPassword(email, id)
      .then(res => {
        console.log(res.data);
        setIsSubmit(true);
        console.log('성공');
      })
      .catch(err => {
        alert(err.response.data.message);
        setIsSubmit(false);
        console.log('실패');
      });
  };
  return (
    <>
      <div className="find-pwd-background">
        <div className="find-pwd-div">
          <span>비밀번호 찾기</span>
          <ul>
            <li>회원정보에 등록된 정보로 비밀번호를 찾습니다.</li>
            <li>
              회원가입시 등록하신 이름, 이메일 주소를 입력해주세요.
              <br />
              회원정보와 다를 경우 조회가 되지 않습니다.
            </li>
            <li>
              비밀번호 재 설정을 원하시는 경우 [내 프로필 편집- 내 프로필 설정]에 들어가셔서 설정
              하시길 바랍니다.
            </li>
          </ul>
        </div>
        <form>
          <div className="find-pwd-form">
            <input
              placeholder="아이디"
              onChange={e => {
                setId(e.target.value);
              }}
              value={id}
              required
              className="find-pwd-input-id"
            />
          </div>
          <div className="find-pwd-email-form">
            <input
              placeholder="이메일 입력"
              onChange={e => {
                setEmail(e.target.value);
              }}
              value={email}
              required
              className="find-pwd-input-email"
            />
          </div>
          <span className={isSubmit ? 'find-pwd-text active' : 'find-pwd-text'}>
            비밀번호를 메일로 전송하였습니다. 이메일을 확인해주세요.
          </span>
          <div className="find-pwd-auth-button-div">
            <button
              type="submit"
              onClick={handleSubmit}
              className={email && id ? 'find-pwd-auth-button active' : 'find-pwd-auth-button'}
            >
              인증하기
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default FindPWD;
