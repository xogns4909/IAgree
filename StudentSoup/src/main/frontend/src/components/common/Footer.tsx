import React from 'react';
import './footer.scss';

const Footer = () => {
  return (
    <div className="footer-container">
      <div className="policy-wrap">
        <span>개인정보 방침</span>
        <span>이용약관</span>
        <span>위치기반 서비스 이용약관</span>
        <span>공지사항</span>
      </div>
      <div className="footer-information">
        <span>(주)스푸</span>
        <span>대표: 문종운</span>
        <span>소재지: 인천광역시 미추홀구 주안</span>
      </div>
      <span>이메일 문의: anwkdud1234@sfoo.com</span>
      <span>전화 문의: 031-123-4567</span>
      <div className="footer-language policy-wrap">
        <span>한국어</span>
        <span>English</span>
        <span>日本語</span>
      </div>
    </div>
  );
};

export default Footer;
