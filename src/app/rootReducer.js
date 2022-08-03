import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router';
import authReducer from '../features/Auth/authReducer';
import walletReducer from '../features/Dashboard/DashboardComponents/Wallet/walletReducer';
import tableReducer from '../features/Dashboard/DashboardComponents/Table/tableReducer';
import stakingReducer from '../features/Dashboard/DashboardComponents/Staking/stakingReducer';
import headerReducer from '../layout/Header/headerReducer';
import notifyReducer from '../features/Dashboard/DashboardComponents/Notifications/notifyReducer';
import reportsReducer from '../features/Reports/ReportsPage/ReportsTable/reportsReducer';
import sendToWalletReducer from '../features/Wallets/WalletsComponents/WalletInfo/sendToWalletReducer';
import LongIReducer from '../features/LongInvestment/LongInvestmentPage/LongIReducer';
import {APP} from './appActionTypes';
import newsReducer from '../features/News/newsReducer';
import checksReducer from '../features/Checks/checksReducer';
import advertisingReducer from '../features/Dashboard/DashboardComponents/Advertising/advertisingReducer';
import settingsReducer from '../features/Settings/settingsReducer';
import StakingPageReducer from '../features/Staking/StakingPage/StakingPageReducer';
import walletChartReducer from '../features/Wallets/WalletsComponents/WalletValue/walletChartReducer';
import CoinReducer from '../features/LongInvestment/AvailableCoinPage/CoinReducer';
import TicketReducer from '../features/TicketsPage/ticketReducer';

const INITIAL_STATE = {
  loading: false,
  buttonLoading: false,
  errorSnack: false,
  errorSnackText: '',
  successSnack: '',
  successSnackText: ''
};

const appReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case APP.LOADING:
      return {...state, loading: action.payload};
    case APP.BUTTON_LOADING:
      return {...state, buttonLoading: action.payload};
    case APP.ERROR_SNACK_OPEN:
      return {...state, errorSnack: true, errorSnackText: action.payload};
    case APP.ERROR_SNACK_CLOSE:
      return {...state, errorSnack: false};
    case APP.SUCCESS_SNACK_OPEN:
      return {...state, successSnack: true, successSnackText: action.payload};
    case APP.SUCCESS_SNACK_CLOSE:
      return {...state, successSnack: false};
    default:
      return state;
  }
};

const rootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    auth: authReducer,
    app: appReducer,

    wallets: walletReducer,
    recentTransactions: tableReducer,
    staking: stakingReducer,
    header: headerReducer,
    notify: notifyReducer,

    sendToWallet: sendToWalletReducer,

    reports: reportsReducer,

    longInvestment: LongIReducer,

    checks: checksReducer,

    advertising: advertisingReducer,

    news: newsReducer,

    settings: settingsReducer,

    stakingPage: StakingPageReducer,

    walletChart: walletChartReducer,

    coinPage: CoinReducer,
    tickets: TicketReducer
  });

export default rootReducer;
