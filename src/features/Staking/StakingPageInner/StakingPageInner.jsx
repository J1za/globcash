import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TransitionedBlock from '../../../shared/TransitionedBlock';
import Transacitons from '../StakingPageInner/Transacitons/Transacitons'
import StakingValue from '../StakingPageInner/StakingValue/StakingValue'
import DepositBlock from '../StakingPageInner/DepositBlock/DepositBlock'
import TopBlock from '../StakingPageInner/TopBlock/TopBlock'
import LegalAgreements from '../StakingPageInner/LegalAgreements/LegalAgreements'
import Questions from '../StakingPage/StakingComponents/Questions';
import { ReactComponent as ArrowIcon } from '../../../assets/images/arrow_back.svg';
import { Link } from 'react-router-dom';

import './StakingPageInner.scss';

import { getDashboardStaking } from '../../Dashboard/DashboardComponents/Staking/stakingActions';
import { getStakingHistory, getStakingTransactions, getPercents, getDescriptions, getStakingInfo } from '../StakingPage/StakingPageActions';

const StakingPageInner = ({ match: { params: { type } } }) => {
  const dispatch = useDispatch();
  const { stakingPage: { transactions, stakeHistory, stakingInvestCounter }, staking: { dashboardStaking } } = useSelector(({ stakingPage, staking }) => ({ stakingPage, staking }));

  useEffect(() => {
    dispatch(getStakingInfo())
    dispatch(getDescriptions(type))
    dispatch(getDashboardStaking(false)).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 200) {
        //get charts for current staking type
        let elemInfo = {
          type: type,
          name: res.payload.data[type].name,
          balance: res.payload.data[type].balance
        };
        dispatch(getPercents()).then(() => {
          dispatch(getStakingHistory(elemInfo)).then(() => {
            //get staking transactions
            dispatch(getStakingTransactions(`filter=${type}&count=10&page=1`))
            //dispatch(getStakingTransactions(`filter=${type}&count=10&page=1&test=1`))
          })
        })
      }
    })
  }, [type, stakingInvestCounter])
  
  return /* !dashboardStaking.hasOwnProperty(type) ? null : */ (
    <TransitionedBlock>
      <main className="staking_inner_page">
        <div className={`page top_wrapper${Number(stakeHistory[type]?.balance) !== 0 ? '' : ' empty'}`}>
          <div className='breadcrumbs'>
            <Link className='good-hover' to={'/main/staking'}>Staking</Link>
            <ArrowIcon />
            <span>{dashboardStaking.hasOwnProperty(type) && dashboardStaking[type].name}</span>
          </div>
          <TopBlock type={type} />
        </div>
        <div className='staking_block_wrapper page'>
          {Number(stakeHistory[type]?.balance) !== 0 && <>
            <div className='wrapper_left'>
              <DepositBlock type={type} />
            </div>
            <div className="wrapper">
              <StakingValue label={type} />
              <Transacitons label={type} />
            </div>
          </>}
          <Questions isInnerStakingPage={type} />
        </div>
      </main>
    </TransitionedBlock>
  );
};

export default StakingPageInner;
