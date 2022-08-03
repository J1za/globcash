import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getReportInner} from '../ReportsPage/ReportsTable/reportsActions';
import Liquidity from './Block/Liquidity';
import Altcoin from './Block/Altcoin';
import TrendVIP from './Block/TrendVIP';
import Defi from './Block/Defi';
import './ReportsInnerPage.scss';

const ReportsInnerPage = ({
  match: {
    params: {id, key}
  }
}) => {
  const dispatch = useDispatch();
  const {innerLoad, reportInner} = useSelector(({reports}) => reports);

  const [target, setTarget] = useState({});

  useEffect(() => {
    dispatch(getReportInner(id));
  }, [id]);

  return (
    <div className='reports_inner_page'>
      {!innerLoad &&
        reportInner &&
        Object.keys(reportInner).length > 0 &&
        reportInner.staking &&
        reportInner.staking.name &&
        (reportInner.staking.name === 'Defi' || reportInner.staking.name === 'Defi 2.1' || reportInner.staking.name === 'Defi 2.2' ? (
          <Defi data={reportInner} />
        ) : reportInner.staking.name === 'Altcoin Arbitrage' ? (
          <Altcoin data={reportInner} />
        ) : /* : reportInner.staking.name === 'Trend Follower'
              ? <Trend data={reportInner} /> */
        reportInner.staking.name === 'Trend Follower VIP' || reportInner.staking.name === 'Trend Follower' ? (
          <TrendVIP data={reportInner} />
        ) : reportInner.staking.name === 'Liquidity Pool Arbitrage' ? (
          <Liquidity data={reportInner} />
        ) : null)}
      {/* <Liquidity id={id} key={key}/>
      <Trend id={id} key={key}/>
      <Defi id={id}/>
      <TrendVIP id={id} key={key}/>
      <Altcoin id={id} key={key} /> */}
    </div>
  );
};

export default ReportsInnerPage;
