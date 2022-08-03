import React from 'react';

import moment from 'moment';
import {Link} from 'react-router-dom';
import {ReactComponent as ArrowIcon} from '../../../../assets/images/arrow_back.svg';
import {ReactComponent as TimeIcon} from '../../../../assets/images/time_icon.svg';
import './TopBlock.scss';
import { TermRender } from '../../LongInvestmentPage/Forecasts/Forecasts';

const TopBlock = ({date, username, position, avatar, title, image, currency, term}) => {
  return (
    <div className='top_block_coin'>
      <div>
        <div className='coin'>
          <div className='breadcrumbs page'>
            <Link className='good-hover' to={'/main/long-investment'}>
              Long investment
            </Link>
            <ArrowIcon />
            <span>{currency && currency.name}</span>
          </div>
          <div className='icon'>{image && <img src={image} alt='coin' />}</div>
        </div>
        <div className='info'>
          <img className='avatar' src={avatar} alt='avatar' />
          <div className='name'>{username}</div>
          <div className='mail'>{position}</div>
          <div className='title'>{title}</div>
          <div className='date'>
            <TimeIcon />
            {moment(date).format('DD.MM.YYYY')}
            <TermRender term={term} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBlock;
