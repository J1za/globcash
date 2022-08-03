import {DASHBOARD_ACTIVITY} from './walletActionTypes';

const INITIAL_STATE = {
  wallets: {},
  activeWallet: '',
  walletsCount: '',
  withdrawal_check: {},
  successWithdraw: 0,
  fiat: null,
  loading: false,
  faq: []
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case DASHBOARD_ACTIVITY.GET_WALLETS_SUCCESS:
      if (action.payload.data.minter) delete action.payload.data.minter;
      return {
        ...state,
        wallets: action.payload.data,
        activeWallet: Object.keys(action.payload.data).includes('usdterc')
          ? 'usdterc'
          : Object.keys(action.payload.data)[0],
        walletsCount: Object.keys(action.payload.data).length
      };
    case DASHBOARD_ACTIVITY.CHECK_WALLETS_WITHDRAW_SUCCESS:
      if (action.payload.data.minter) delete action.payload.data.minter;
      return {
        ...state,
        withdrawal_check: action.payload.data
      };
    case DASHBOARD_ACTIVITY.SET_ACTIVE_WALLET:
      //console.log(action.payload.data)
      return {
        ...state,
        activeWallet: action.payload.data
      };
    case DASHBOARD_ACTIVITY.DO_WITHDRAW_SUCCESS:
      return {
        ...state,
        successWithdraw: state.successWithdraw + 1
      };
    case DASHBOARD_ACTIVITY.GET_FAQ_WALLETS_SUCCESS:
      return {
        ...state,
        faq: action.payload.data
      };

    case DASHBOARD_ACTIVITY.GET_WITHDRAWAL_USDT_SUCCESS:
      return {
        ...state,
        fiat: action.payload.data
      };

    case DASHBOARD_ACTIVITY.GET_WITHDRAWAL_USDT_FAIL:
      return {
        ...state,
        fiat: null
      };

    case DASHBOARD_ACTIVITY.UPDATE_SALES_CONTRACT:
      return {
        ...state,
        loading: true
      };

    case DASHBOARD_ACTIVITY.UPDATE_SALES_CONTRACT_SUCCESS:
      return {
        ...state,
        loading: false
      };

    default:
      return state;
  }
}
