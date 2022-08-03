import React, { Suspense, lazy } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { FallbackElement } from './AppRoutes';

import Dashboard from '../features/Dashboard/Dashboard';
import Wallets from '../features/Wallets/Wallets';
import StakingPage from '../features/Staking/StakingPage';
import LongInvestmentPage from '../features/LongInvestment/LongInvestmentPage';
import ReportsPage from '../features/Reports/ReportsPage';
import Settings from '../features/Settings/Settings';
import Checks from '../features/Checks/Checks';
import Notifications from '../features/Notifications';
import ServerDown from '../features/ServerDown/ServerDown';
import News from '../features/News/News';
import NotFound from '../shared/NotFound';
import DaoGlobix from '../features/DaoGlobix';
import TicketsPage from '../features/TicketsPage';
import AvailableCoinPage from '../features/LongInvestment/AvailableCoinPage';

/* import AdvertisingPage from '../features/Dashboard/DashboardComponents/Advertising/AdvertisingPage';
import LongInvestmentPageInner from '../features/LongInvestment/LongInvestmentPageInner';
import LongInvestmentCoinPage from '../features/LongInvestment/LongInvestmentCoinPage';
import StakingPageInner from '../features/Staking/StakingPageInner';
import Risk from '../features/Checks/RiskPage/RiskPage';
import ReportsInnerPage from '../features/Reports/ReportsInnerPage';
import Forecasts from '../features/LongInvestment/LongInvestmentPage/Forecasts'; */

import { mainPath, rootMainPath } from './paths';

/* const Dashboard = lazy(() => import('../features/Dashboard/Dashboard'));
const Wallets = lazy(() => import('../features/Wallets/Wallets'));
const StakingPage = lazy(() => import('../features/Staking/StakingPage/StakingPage'));
const LongInvestmentPage = lazy(() => import('../features/LongInvestment/LongInvestmentPage/LongInvestmentPage'));
const ReportsPage = lazy(() => import('../features/Reports/ReportsPage'));
const Settings = lazy(() => import('../features/Settings/Settings'));
const Checks = lazy(() => import('../features/Checks/Checks'));
const Notifications = lazy(() => import('../features/Notifications/Notifications'));
const ServerDown = lazy(() => import('../features/ServerDown/ServerDown'));
const News = lazy(() => import('../features/News/News'));
const NotFound = lazy(() => import('../shared/NotFound'));
const DaoGlobix = lazy(() => import('../features/DaoGlobix'));
const TicketsPage = lazy(() => import('../features/TicketsPage'));
const AvailableCoinPage = lazy(() => import('../features/LongInvestment/AvailableCoinPage/AvailableCoinPage')); */

const AdvertisingPage = lazy(() => import('../features/Dashboard/DashboardComponents/Advertising/AdvertisingPage'));
const LongInvestmentPageInner = lazy(() => import('../features/LongInvestment/LongInvestmentPageInner/LongInvestmentPageInner'));
const LongInvestmentCoinPage = lazy(() => import('../features/LongInvestment/LongInvestmentCoinPage/LongInvestmentCoinPage'));
const StakingPageInner = lazy(() => import('../features/Staking/StakingPageInner/StakingPageInner'));
const Risk = lazy(() => import('../features/Checks/RiskPage/RiskPage'));
const ReportsInnerPage = lazy(() => import('../features/Reports/ReportsInnerPage'));
const Forecasts = lazy(() => import('../features/LongInvestment/LongInvestmentPage/Forecasts'));


const MainRoutes = () => {
  if (!localStorage.token) return <Redirect to={'/'} />;

  return (
    <Suspense fallback={<FallbackElement />}>
      <Switch>
        <Redirect from={rootMainPath} exact to={mainPath.dashboard} />
        <Route path={mainPath.dashboard} exact render={props => <Dashboard {...props} />} />
        <Route path={mainPath.wallets} render={props => <Wallets {...props} />} />
        <Route path={mainPath.staking} exact render={props => <StakingPage {...props} />} />
        <Route path={mainPath.longInvestment} exact render={props => <LongInvestmentPage {...props} />} />
        <Route path={mainPath.daoGlobix} exact render={props => <DaoGlobix {...props} />} />
        <Route path={mainPath.checks} exact render={props => <Checks {...props} />} />
        <Route path={mainPath.settings} exact render={props => <Settings {...props} />} />
        <Route path={mainPath.notifications} exact render={props => <Notifications {...props} />} />
        <Route path={mainPath.reports} exact render={props => <ReportsPage {...props} />} />
        <Route path={mainPath.news} exact render={props => <News {...props} />} />
        <Route path={mainPath.tickets} exact render={props => <TicketsPage {...props} />} />
        <Route path={mainPath.availableCoin} render={props => <AvailableCoinPage {...props} />} />

        <Route path={mainPath.stakingInner} exact render={props => <StakingPageInner {...props} />} />
        <Route path={mainPath.longInvestmentForecasts} render={(props) => <Forecasts {...props} isInner />} />
        <Route path={mainPath.longInvestmentInner} render={props => <LongInvestmentPageInner {...props} />} />
        <Route path={mainPath.longInvestmentCoin} render={props => <LongInvestmentCoinPage {...props} />} />
        <Route path={mainPath.reportsInner} exact render={props => <ReportsInnerPage {...props} />} />
        <Route path={mainPath.risk} exact render={props => <Risk {...props} />} />
        <Route path={mainPath.advertising} exact render={props => <AdvertisingPage {...props} />} />

        <Route path={mainPath.serverDown} exact render={props => <ServerDown {...props} />} />
        <Route path='*' render={props => <NotFound {...props} />} />
      </Switch>
    </Suspense>
  );
};

export default MainRoutes;
