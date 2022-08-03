import {Link} from 'react-router-dom';
import TransitionedBlock from '../../../shared/TransitionedBlock';
import {ReactComponent as ArrowIcon} from '../../../assets/images/arrow_back.svg';
import TopBlock from '../../LongInvestment/LongInvestmentPageInner/TopBlock/TopBlock';
import Balance from '../../LongInvestment/LongInvestmentPageInner/Balance/Balance';
import InvestDetail from '../../LongInvestment/LongInvestmentPageInner/InvestDetail/InvestDetail';
import HoldBalance from '../../LongInvestment/LongInvestmentPageInner/HoldBalance/HoldBalance';
import MyActivities from '../../LongInvestment/LongInvestmentPageInner/MyActivities/MyActivities';

import './LongInvestmentPageInner.scss';

import {useSelector} from 'react-redux';

const LongInvestmentPageInner = ({
  match: {
    params: {id}
  }
}) => {
  const {
    longInvestment: {
      statisticInner,
      statisticInner: {
        currency: {name}
      }
    }
  } = useSelector(({longInvestment}) => ({longInvestment}));
  return (
    <TransitionedBlock>
      <main className='long_investment_inner_page'>
        <div className='page top_wrapper'>
          <div className='breadcrumbs'>
            <Link className='good-hover' to={'/main/long-investment'}>
              Long investment
            </Link>
            <ArrowIcon />
            <span>{name}</span>
          </div>
          <TopBlock id={id} />
        </div>
        <div className='staking_block_wrapper page'>
          <div className='wrapper_left'>
            <Balance />
            <InvestDetail />
          </div>
          <div className='wrapper'>
            <HoldBalance id={id} />
            <MyActivities id={id} />
          </div>
        </div>
      </main>
    </TransitionedBlock>
  );
};

export default LongInvestmentPageInner;
