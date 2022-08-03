import {DASHBOARD_ACTIVITY} from './tableActionTypes';

const INITIAL_STATE = {
  transactions: {
    trans: [],
    apps: []
  },
  transactionsLoad: true,
  appsLoad: true
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case DASHBOARD_ACTIVITY.SET_TRANSACTIONS_LOADING:
      return {
        ...state,
        transactionsLoad: action.payload.data
      };
    case DASHBOARD_ACTIVITY.GET_RECENT_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        transactions: {
          ...state.transactions,
          trans: action.payload.data
          //apps: action.payload.data.filter(el => el.type === 'order_out')
        },
        transactionsLoad: false
      };
    case DASHBOARD_ACTIVITY.GET_WALLET_APPS_SUCCESS:
      return {
        ...state,
        transactions: {
          ...state.transactions,
          apps: action.payload.data.result
        },
        appsLoad: false
      };
    default:
      return state;
  }
}
