import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReactComponent as WalletValueNoItems } from '../../../../assets/images/WalletValueNoItems.svg';
import './StakingValue.scss';
import StakingChart from '../../../Dashboard/DashboardComponents/Staking/Charts/StakingChart';

const StakingValue = ({ label }) => {
  const dispatch = useDispatch();
  const { stakingPage: { transactions, stakeHistory }, staking: { dashboardStaking } } = useSelector(({ stakingPage, staking }) => ({ stakingPage, staking }));

  return (
    <section className='staking_value_block'>
      {stakeHistory.hasOwnProperty(label) && stakeHistory[label].chart.length > 0 ?
        <div>
          {label === 'stake' || label === 'invglbx' ?
            <div className="chart_wrapper staking_chart_wrapper">
              <div className="title mb-28">
                <h3>Staking value</h3>
              </div>
              <span className="text">Сhart of comparison of the funds invested to the received interest payments</span>
              <div className='chart'>
                <StakingChart
                  isStakePage={false}
                  label={label}
                  chart={stakeHistory[label].chart}
                />
              </div>
            </div>
            :
            <div className="chart_wrapper">
              <div className="title mb-28">
                <h3>Staking value</h3>
                {/* <div className="btn_chart">
                  <button className='good-hover'>1D</button>
                  <button className='active good-hover'>1M</button>
                  <button className='good-hover'>3M</button>
                  <button className='good-hover'>1Y</button>
                  <button className='good-hover'>All</button>
                </div> */}
              </div>
              <div className='chart'>
              <StakingChart
                  isStakePage={false}
                  label={label}
                  chart={stakeHistory[label].chart}
                />
              </div>
            </div>
          }
        </div>
        :
        <div className='no_items'>
          <h3>Staking value</h3>
          <WalletValueNoItems />
          <span>Your No staking deposits is empty</span>
        </div>
      }
    </section>
  );
};

export default StakingValue;
