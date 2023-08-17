import { useState } from 'react';
import './findAccount.scss';
import FindID from './FindID';
import FindPWD from './FindPWD';

const FindAccount = () => {
  const [tab, setTab] = useState<string>('아이디');

  return (
    <div className="find-account-background">
      <div className="find-account-main">
        <h2>아이디/비밀번호 찾기</h2>
        <div className="find-account-tab-menu">
          <div
            id="아이디"
            className={tab === '아이디' ? 'find-account-id active' : 'find-account-id'}
            onClick={() => setTab('아이디')}
          >
            아이디 찾기
          </div>
          <div
            id="비밀번호"
            className={tab === '비밀번호' ? 'find-account-pwd active' : 'find-account-pwd'}
            onClick={() => setTab('비밀번호')}
          >
            비밀번호 찾기
          </div>
        </div>
        <div className="find-account-tab-info">
          아래에 정보를 입력하여 SFOO의 {tab}를 <br /> 찾아주세요.
        </div>
        <div>{tab === '아이디' && <FindID />}</div>
        <div>{tab === '비밀번호' && <FindPWD />}</div>
      </div>
    </div>
  );
};

export default FindAccount;
