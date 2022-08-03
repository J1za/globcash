import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TransitionedBlock from '../../../shared/TransitionedBlock';
import './StakingPage.scss';
import LinkBlockReports from './StakingComponents/LinkBlockReports/LinkBlockReports';
import Transaciton from './StakingComponents/Transacitons/Transacitons';
import Questions from './StakingComponents/Questions/Questions';
import Contact from './StakingComponents/Contact/Contact';
import StakingBlock from './StakingComponents/StakingBlock/StakingBlock';

import { getStakingTransactions, getStakingHistory, getPercents, getDescriptions, getStakingInfo } from './StakingPageActions';
import { getDashboardStaking } from '../../Dashboard/DashboardComponents/Staking/stakingActions';
import { getWallets } from '../../Wallets/WalletsComponents/WalletValue/walletChartActions';

const StakingPage = () => {
  const dispatch = useDispatch();
  const { stakingPage: { transactions, stakeHistory, stakingInvestCounter }, staking: { dashboardStaking } } = useSelector(({ stakingPage, staking }) => ({ stakingPage, staking }));

  useEffect(() => {
    //get staking names and balances
    dispatch(getWallets())
    dispatch(getDescriptions())
    dispatch(getStakingInfo())
    dispatch(getDashboardStaking(false)).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 200) {
        //get charts for all staking types
        dispatch(getPercents()).then(() => {
          Object.keys(res.payload.data).forEach((el, idx) => {
            let elemInfo = {
              type: el,
              name: res.payload.data[el].name,
              balance: res.payload.data[el].balance
            };

            if (idx !== Object.keys(res.payload.data).length - 1) {
              dispatch(getStakingHistory(elemInfo))
            } else {
              dispatch(getStakingHistory(elemInfo)).then(() => {
                //get staking transactions only on last staking chart
                dispatch(getStakingTransactions('count=10&page=1'))
                //dispatch(getStakingTransactions('count=10&page=1&test=1'))
              })
            }
          })
        })
      }
    })
  }, [stakingInvestCounter])

  return (
    <TransitionedBlock>
      <main className=" staking_page">
        <StakingBlock />

        <LinkBlockReports/>
        <div className="page">
          <Transaciton />
          <Questions />
        </div>
        <Contact />
      </main>
    </TransitionedBlock>

  );
};

export default StakingPage;
