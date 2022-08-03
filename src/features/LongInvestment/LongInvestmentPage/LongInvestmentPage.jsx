import React from 'react';
import StartPortfolio from '../../LongInvestment/LongInvestmentPage/StartPortfolio/StartPortfolio';
import AvailableCoins from '../../LongInvestment/LongInvestmentPage/AvailableCoins/AvailableCoins';
import RecentPurchases from '../../LongInvestment/LongInvestmentPage/RecentPurchases/RecentPurchases';
import Forecasts from '../../LongInvestment/LongInvestmentPage/Forecasts/Forecasts';
import Portfolio from '../../LongInvestment/LongInvestmentPage/Portfolio/Portfolio';
import TransitionedBlock from '../../../shared/TransitionedBlock';
import DistributionSchedule from '../../LongInvestment/LongInvestmentPage/DistributionSchedule';
import './LongInvestmentPage.scss';

const LongInvestmentPage = () => {
  return (
    <TransitionedBlock>
      <main className="long_investment_page">
        <StartPortfolio />
        <DistributionSchedule />
        <RecentPurchases />
        <div className="page">
          <Portfolio />
          <Forecasts />
        </div>
        <AvailableCoins />
        {/* <Plug/> */}

      </main>
    </TransitionedBlock>
  );
};

export default LongInvestmentPage;
