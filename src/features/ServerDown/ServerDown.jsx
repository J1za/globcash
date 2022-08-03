import React from 'react';
import TransitionedBlock from '../../shared/TransitionedBlock/TransitionedBlock'
import {ReactComponent as ServerDownIcon} from './../../assets/images/server_down.svg';
import {ReactComponent as LogoIcon} from './../../assets/images/logo_main.svg';

import './ServerDown.scss';

const ServerDown = () => {
  return (
    <TransitionedBlock>
      <div className="server_down_wrapper">
        <LogoIcon/>
        <div className='server_down'>
          <ServerDownIcon/>
          <div>We are currently updating and will be back soon.</div>
          <p>Thank you for your patience;)</p>
        </div>
        <div/>
      </div>
    </TransitionedBlock>
  );
};

export default ServerDown;
