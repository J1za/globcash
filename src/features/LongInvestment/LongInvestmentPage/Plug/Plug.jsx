import React from 'react';
import {ReactComponent as OneIcon} from '../../../../assets/images/plug_1.svg';
import {ReactComponent as TwoIcon} from '../../../../assets/images/plug_2.svg';
import {ReactComponent as RocketIcon} from '../../../../assets/images/roket.svg';

import './Plug.scss';

const Plug = () => {
  return (
    <div className='plug_block'>
      <RocketIcon className='rocket' />
      <div className='title'>
        Start building your <br /> cryptocurrency portfolio
      </div>
      <div className='descriptions'>
        Diversify your finances, buy coins and follow the forecasts of our experts in order to maximize profit from
        market changes
      </div>
      <div className='icon'>
        <OneIcon />
        <TwoIcon />
      </div>
      <span>Comming soon...</span>
    </div>
  );
};

export default Plug;
