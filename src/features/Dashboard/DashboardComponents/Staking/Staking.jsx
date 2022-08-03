import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StakingTab from './StakingTab';
import { TabItem, Tabs } from '../../../../shared/Tabs';
import { getDashboardStaking } from './stakingActions';
import { getPercents } from '../../../Staking/StakingPage/StakingPageActions';
import './Staking.scss';

const StakingBlock = () => {
  const dispatch = useDispatch();
  const { dashboardStaking, dashboardStakingHistory } = useSelector(({ staking }) => staking)

  useEffect(() => {
    dispatch(getPercents()).then(() => dispatch(getDashboardStaking(false)));
  }, [])

  useEffect(() => {
    //console.log(dashboardStaking, dashboardStakingHistory)
  }, [dashboardStaking, dashboardStakingHistory])

  return (
    <section className='card-wrap staking_wrapper'>
      <div className='staking'>
        <div className="staking__title mb-20">
          Staking
        </div>
        {Object.keys(dashboardStaking).length > 0
          ? <>
            < Tabs defaultIndex={0}>
              {Object.keys(dashboardStaking).map((el, idx) => (
                <TabItem label={dashboardStaking[el].name} index={idx} key={idx}>
                  <StakingTab label={el} idx={idx} />
                </TabItem>
              ))}
            </Tabs></>
          : null}
      </div>
    </section >
  );
};

export default StakingBlock;
