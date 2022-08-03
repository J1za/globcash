import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';

import {getHeadInfo, getCoinNews} from './CoinAction';
//import LatestNews from './LatestNews/LatestNews';
import LatestNews from '../../News/LatestNews';

import Coin from './Coin/Coin';
import AboutCoin from './AboutCoin/AboutCoin';
import YourInvestment from './YourInvestment/YourInvestment';
import HeadBlock from './HeadBlock/HeadBlock';
import './AvailableCoinPage.scss';
import useWindowDimensions from '../../../helpers/useWindowDimensions';
import Forecasts from '../LongInvestmentPage/Forecasts/Forecasts';

const AvailableCoinPage = () => {
  const {width} = useWindowDimensions();

  const {headInfo, coinLoad} = useSelector(({coinPage}) => coinPage);

  const {id} = useParams();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getHeadInfo(id));
  }, []);

  return (
    <div className='available_coin_page'>
      <HeadBlock headInfo={headInfo} coinLoad={coinLoad} />
      <Coin currencyId={id} headInfo={headInfo} code={headInfo.code} />
      {width < 767 && <Forecasts />}
      <div className='wrapper_coin'>
        <AboutCoin headInfo={headInfo} />
        <YourInvestment headInfo={headInfo} />
      </div>
      {width > 767 && <Forecasts currencyId={id} />}
      <LatestNews currencyId={id} />
    </div>
  );
};

export default AvailableCoinPage;
