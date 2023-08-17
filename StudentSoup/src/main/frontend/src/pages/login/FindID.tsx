import './findID.scss';
import { useState } from 'react';
import { findUserId } from 'apis/auth/AuthAPI';

const FindID = () => {
  const [email, setEmail] = useState<string>('');
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    findUserId(email)
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
      <div className="find-id-background">
        <div className="find-id-div">
          <span>아이디 찾기</span>
          <ul>
            <li>회원정보에 등록된 정보로 아이디를 찾습니다.</li>
            <li>
              회원가입시 등록하신 이메일 주소를 입력해주세요.
              <br />
              회원정보와 다를 경우 조회가 되지 않습니다.
            </li>
          </ul>
        </div>
        <form>
          <div className="find-id-email-form">
            <input
              placeholder="이메일 입력"
              onChange={e => {
                setEmail(e.target.value);
              }}
              value={email}
              required
              className="find-id-input-email"
            />
          </div>
          <div>
            <span className={isSubmit ? 'find-id-text active' : 'find-id-text'}>
              아이디를 메일로 전송하였습니다. 이메일을 확인해주세요.
            </span>
          </div>
          <div className="find-id-auth-button-div">
            <button
              type="submit"
              onClick={handleSubmit}
              className={email ? 'find-id-auth-button active' : 'find-id-auth-button'}
            >
              인증하기
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default FindID;
