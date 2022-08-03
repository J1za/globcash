import {DASHBOARD_ACTIVITY} from './tableActionTypes';

export function getRecent(activeWallet, url) {
  return {
    type: DASHBOARD_ACTIVITY.GET_RECENT_TRANSACTIONS,
    payload: {
      client: 'default',
      request: {
        url: `/users/wallets/${activeWallet}/history/${url && url.length > 0 ? `?${url}` : ''}`,
        method: 'GET'
      },
    },
  };
}

export function getWalletApps(url) {
  return {
    type: DASHBOARD_ACTIVITY.GET_WALLET_APPS,
    payload: {
      client: 'default',
      request: {
        url: `/users/orders/out/${url && url.length > 0 ? `?${url}` : ''}`,
        method: 'GET'
      },
    },
  };
}

export function setTransactionsLoading(isLoad) {
  return {
    type: DASHBOARD_ACTIVITY.SET_TRANSACTIONS_LOADING,
    payload: {
      data: isLoad
    },
  };
}