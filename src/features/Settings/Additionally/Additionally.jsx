import React from 'react';
import {ReactComponent as LinkIcon} from '../../../assets/images/link.svg';

import './Additionally.scss';

const Additionally = () => {
  return (
    <div className='additionally_block card-wrap'>
      <div className="title">Additionally</div>
      <div className='link'>
        <span>Account verification instructions</span>
        <a href="" className='pulse'><LinkIcon/></a>
      </div>
      <div className='link'>
        <span>About company</span>
        <a href="" className='pulse'><LinkIcon/></a>
      </div>
    </div>
  );
};

export default Additionally;
