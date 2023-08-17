import React from 'react';
import './signupcomponent.scss';

const SignUpComponent = (props: any) => {
  return (
    <div className="signup-main">
      <h1>신규 회원가입</h1>
      <div className="signup-progress">
        <img src={props.process_1} alt="activate-process-1" className="process-1" />
        <img src={props.process_bar_1} alt="process-bar" className="process-bar-1" />
        <img src={props.process_2} alt="process-2" className="process-2" />
        <img src={props.process_bar_2} alt="process-bar" className="process-bar-2" />
        <img src={props.process_3} alt="process-3" className="process-3" />
        <p className="activate-sentence-1">이용약관 동의</p>
        <p className={props.sentence_2}>회원가입</p>
        <p className={props.sentence_3}>개인정보 입력</p>
      </div>
      {props.children}
    </div>
  );
};

export default SignUpComponent;
