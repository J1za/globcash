import React from 'react';
import CheckBlock from './CheckBlock';
import RequestHistory from './RequestHistory';
import {ReactComponent as TitleIcon} from '../../assets/images/check_page_title.svg';

import './Checks.scss';

const Checks = () => {
  return (
    <div className='checks_page'>
      <div className="title"><p><TitleIcon/></p> <span>Checking crypto wallets for dirty money</span></div>
      <div className='descriptions'>If dirty money comes in, you become an accomplice in a crime and lose everything. <br/>
        Make sure that everything is clean!</div>
      <CheckBlock/>
      <RequestHistory/>
    </div>
  );
};

export default Checks;
