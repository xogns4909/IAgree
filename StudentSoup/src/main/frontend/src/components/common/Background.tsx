import React from 'react';
import './background.scss';

const Background = ({ children }: any) => {
  return (
    <>
      <div className="background-wrap">{children}</div>
    </>
  );
};

export default Background;
