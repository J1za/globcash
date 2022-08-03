import React, {useState} from 'react';
import Personal from './Personal/Personal';
//import Additionally from './Additionally';
import Security from './Security';
import Refferal from './Refferal';
import Promo from './Promo/';

import {ReactComponent as BackIcon} from '../../assets/images/arrow_back_left.svg';

import './Settings.scss';

const Settings = (props) => {
  return (
    <div className='settings_page'>
      <div className='back'>
        <div className='good-hover' onClick={() => props.history.goBack()}>
          <BackIcon />
          Back
        </div>
      </div>
      <Personal />
      <Promo />
      <Security />
      <Refferal />
      {/*<Additionally/>*/}
    </div>
  );
};

export default Settings;
