import React from 'react';
import './CoinContent.scss';

const CoinContent = ({text}) => {
  return (
    <div className='coin_content'>
      <div dangerouslySetInnerHTML={{__html: text}}></div>
    </div>
  );
};

export default CoinContent;
