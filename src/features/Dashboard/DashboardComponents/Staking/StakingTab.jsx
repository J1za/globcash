import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReactComponent as ArrowGreenIcon } from '../../../../assets/images/arrow_top_green.svg';
import { ReactComponent as ArrowRedIcon } from '../../../../assets/images/arrow_down_red.svg';
import { ReactComponent as NoInvestmentIcon } from '../../../../assets/images/no_investment.svg';
import StakingChart from './Charts/StakingChart';
import { getDashboardStaking } from './stakingActions';
import './Staking.scss';
import Convert from '../../../../helpers/Convert';
import { emptyStakingDialog } from '../../../Staking/StakingPage/StakingComponents/StakingBlock/StakingBlock';
import { useToggle } from '../../../../helpers/hooks';

import { GlobixFixed } from '../../../../helpers/functions';

const StakingTab = ({ label, idx }) => {
  const dispatch = useDispatch();
  const { staking: { dashboardStaking, dashboardStakingHistory, stakingChart, stakingChartCounter, loading }, stakingPage: { stakingPercents } } = useSelector(({ staking, stakingPage }) => ({ staking, stakingPage }));

  const isInv = label.includes('inv');
  const currency = isInv
    ? label.split('inv')[1].toUpperCase()
    : 'USDT';

  const [dialog, toggleDialog] = useToggle();

  useEffect(() => {
    dispatch(getDashboardStaking(true, label));
  }, [label]);

  return dashboardStakingHistory && dashboardStakingHistory.length > 0 ? (
    <div className='block '>
      {loading ? null : (
        <>
          <div className='left'>
            {(label === 'stake' || label === 'invglbx') && (
              <span className='text'>Сhart of comparison of the funds invested to the received interest payments</span>
            )}
            <div>
              <StakingChart label={label} />
            </div>
          </div>
          <div className='right'>
            <div>
              <div>
                <h4>Deposit</h4>
                <div>{GlobixFixed(dashboardStaking[label].balance, 2)} {currency}</div>
                <span>
                  <Convert name={currency} sum={dashboardStaking[label].balance} to={'USD'} /> $
                </span>
              </div>
              <div>
                <h4>interest rate</h4>
                {label === 'stake' || label === 'invglbx' ? (
                  <div className='blue_text'>{stakingPercents[label === 'stake' ? 'inv' : label] && Number(stakingPercents[label === 'stake' ? 'inv' : label].percent) > 0 ? `${stakingPercents[label === 'stake' ? 'inv' : label].percent}% Daily` : 'Float'}</div>
                ) : (
                  <div className='blue_text'>Float</div>
                )}
                <span>Earned yesterday</span>
                <p className={dashboardStaking[label].earned_yesterday >= 0 ? `green-text` : `red_text`}>
                  {dashboardStaking[label].earned_yesterday >= 0 ? '+' : ''}
                  {GlobixFixed(dashboardStaking[label].earned_yesterday)} {currency}
                </p>
              </div>
            </div>
            <div>
              <div>
                {label === 'stake' || label === 'invglbx' || isInv ? (
                  <>
                    <h4>Body</h4>
                    <div>
                      {
                        dashboardStaking[label] &&
                        dashboardStaking[label].balance + stakingChart[stakingChart.length - 1] &&
                        GlobixFixed(stakingChart[stakingChart.length - 1].y)}{' '}
                      {currency}
                    </div>
                    <span>
                      <Convert
                        name={currency}
                        sum={
                          dashboardStaking[label] &&
                          dashboardStaking[label].balance + stakingChart[stakingChart.length - 1] &&
                          stakingChart[stakingChart.length - 1].y
                        }
                        to={'USD'}
                      />{' '}
                      $
                    </span>
                  </>
                ) : (
                  <>
                    <h4>PNL per week</h4>
                    <div>{GlobixFixed(dashboardStaking[label].pnl_per_week)} {currency}</div>
                    <span>
                      <Convert name={currency} sum={dashboardStaking[label].pnl_per_week} to={'USD'} /> $
                      <p className={dashboardStaking[label].pnl_per_week_percent >= 0 ? `green-text` : `red_text`}>
                        {dashboardStaking[label].pnl_per_week_percent >= 0 ? <ArrowGreenIcon /> : <ArrowRedIcon />}
                        {dashboardStaking[label].pnl_per_week_percent === null
                          ? ''
                          : Number(dashboardStaking[label].pnl_per_week_percent).toFixed(2)}
                        %
                      </p>
                    </span>
                  </>
                )}
              </div>
              <div>
                {label === 'stake' || label === 'invglbx' || isInv ? (
                  <>
                    <h4>Growth</h4>
                    <div>
                      {stakingChart[stakingChart.length - 1] &&
                        stakingChart[stakingChart.length - 1].y &&
                        GlobixFixed(stakingChart[stakingChart.length - 1].y, 2)}{' '}
                      {currency}
                    </div>
                    <span>
                      {
                        <Convert
                          name={currency}
                          sum={stakingChart[stakingChart.length - 1] && stakingChart[stakingChart.length - 1].y}
                          to={'USD'}
                        />
                      }{' '}
                      $
                      <p className={`${(100 - (+stakingChart[stakingChart.length - 1].y * 100 / Number(+dashboardStaking[label].balance + +stakingChart[stakingChart.length - 1].y))) >= 0 ? 'green-' : 'red_'}text`}>
                        {(100 - (+stakingChart[stakingChart.length - 1].y * 100 / Number(+dashboardStaking[label].balance + +stakingChart[stakingChart.length - 1].y))) >= 0
                          ? <ArrowGreenIcon />
                          : <ArrowRedIcon />
                        }
                        {GlobixFixed(100 - (+stakingChart[stakingChart.length - 1].y * 100 / Number(+dashboardStaking[label].balance + +stakingChart[stakingChart.length - 1].y)))}%
                      </p>
                    </span>
                  </>
                ) : (
                  <>
                    <h4>PNL per Month</h4>
                    <div>{GlobixFixed(dashboardStaking[label].pnl_per_month, 2)} {currency}</div>
                    <span>
                      <Convert name={currency} sum={dashboardStaking[label].pnl_per_month} to={'USD'} /> $
                      <p className={dashboardStaking[label].pnl_per_month_percent >= 0 ? `green-text` : `red_text`}>
                        {dashboardStaking[label].pnl_per_month_percent === null && <>
                          {dashboardStaking[label].pnl_per_month_percent >= 0 ? <ArrowGreenIcon /> : <ArrowRedIcon />}
                          {dashboardStaking[label].pnl_per_month_percent === null
                            ? ''
                            : GlobixFixed(dashboardStaking[label].pnl_per_month_percent) + '%'}
                        </>}
                      </p>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  ) : (
    <div className='no_items'>
      <div className='no_items__icon mb-16'>
        <NoInvestmentIcon />
      </div>
      <span className='mb-24'>No {dashboardStaking[label] && dashboardStaking[label].name} deposits</span>
      <div className='no_items__link mb-60'>
        <button className='good-hover' onClick={toggleDialog}>
          Learn more about {dashboardStaking[label] && dashboardStaking[label].name}
        </button>
      </div>
      {emptyStakingDialog(dialog, toggleDialog)}
    </div>
  );
};

export default StakingTab;
