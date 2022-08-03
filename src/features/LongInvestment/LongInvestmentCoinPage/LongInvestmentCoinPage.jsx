import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getCurrencyRecomedation, getStatistic} from '../LongInvestmentPage/LongIActions';
import {Link, useParams} from 'react-router-dom';
import TopBlock from './TopBlock/TopBlock';
import FinalBlock from './FinalBlock/FinalBlock';
import CoinContent from './CoinContent/CoinContent';
import './LongInvestmentCoinPage.scss';

const LongInvestmentCoinPage = () => {
  const dispatch = useDispatch();
  let {id} = useParams();

  useEffect(() => {
    dispatch(getCurrencyRecomedation(id));
    dispatch(getStatistic());
  }, []);
  const {currencyRecomendation} = useSelector(({longInvestment}) => longInvestment);

  return (
    <div className='long_investment_coin_page'>
      <TopBlock
        date={currencyRecomendation.created_date}
        username={currencyRecomendation.username}
        position={currencyRecomendation.position}
        avatar={currencyRecomendation.avatar}
        title={currencyRecomendation.title}
        currency={currencyRecomendation.currency}
        image={currencyRecomendation.image}
        term={currencyRecomendation.term}
      />
      <CoinContent text={currencyRecomendation.text} />
      <FinalBlock
        tree_month={currencyRecomendation.tree_month}
        tree_month_risk={currencyRecomendation.tree_month_risk}
        six_month={currencyRecomendation.six_month}
        six_month_risk={currencyRecomendation.six_month_risk}
        one_year={currencyRecomendation.one_year}
        one_year_risk={currencyRecomendation.one_year_risk}
        two_year={currencyRecomendation.two_year}
        two_year_risk={currencyRecomendation.two_year_risk}
        currency={currencyRecomendation.currency}
        currency_price={currencyRecomendation.currency_price}
      />
    </div>
  );
};

export default LongInvestmentCoinPage;
