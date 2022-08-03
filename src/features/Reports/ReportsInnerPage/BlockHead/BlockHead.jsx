import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as ArrowIcon } from '../../../../assets/images/arrow_back.svg';
import { ReactComponent as TimeIcon } from '../../../../assets/images/report_inner.svg';
import { ReactComponent as InfoIcon } from '../../../../assets/images/InfoIcon.svg';
import { ReactComponent as CoinIcon } from '../../../../assets/images/rep_coin.svg';
import Convert from '../../../../helpers/Convert';
import { GlobixFixed } from '../../../../helpers/functions';
import moment from 'moment';

import './../ReportsInnerPage.scss';
import { mainPath } from '../../../../routes/paths';

const TopBlock = ({ data }) => {
  return (
    <div className='block_reports_head'>
      <div className='breadcrumbs'>
        <Link className='good-hover' to={'/main/staking'}>Staking</Link>
        <ArrowIcon />
        <Link className='good-hover' to={'/main/staking/reports'}>
          Reports
        </Link>
        <ArrowIcon />
        <span>Report {data.staking.name}</span>
      </div>
      <div className='wrapper_desc'>
        <div className='top'>
          <div className='data'>
            <TimeIcon />
            Report
            <span>{moment(data.date).format('DD.MM.YYYY HH:mm')}</span>
          </div>
          <div className='name'>
            {data.staking.name === 'Altcoin Arbitrage' || data.staking.name === 'Liquidity Pool Arbitrage'
              ? 'Ineterest has been accrued on your'
              : 'Ineterest on your'}
            <img src={data.staking.image} />
            <Link className='good-hover' to={mainPath.staking}>
              {data.staking.name}
            </Link>
            <p>
              {data.staking.name === 'Altcoin Arbitrage' || data.staking.name === 'Liquidity Pool Arbitrage'
                ? ''
                : 'is credited to your USDT exchange wallet'}
            </p>
          </div>
          <div className='coin'>
            <CoinIcon />
            <div>
              <span>{GlobixFixed(data.data.amount, 2)} USDT</span>
              <p>
                <Convert name={'USDT'} sum={data.data.amount} to={'USD'} /> USD
              </p>
            </div>
          </div>
        </div>
        <div className='middle'>
          <InfoIcon />
          Statistics compared to the previous (
          {moment(data.data.date.split('.').reverse().join('-')).format('MMM DD YYYY')} -{' '}
          {moment(data.date).format('MMM DD YYYY')})
        </div>
        {data.staking.name === 'Defi' && (
          <div className='trading_sessions'>
            Number of trading sessions: <span> {data.data.number_of_trade_session}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBlock;
