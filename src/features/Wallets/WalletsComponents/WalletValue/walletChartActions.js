import { WALLET_CHART } from './walletChartActionTypes';

export function getWallets() {
  return {
    type: WALLET_CHART.WALLETS_INFO,
    payload: {
      client: 'owlab',
      request: {
        url: `/wallets/`,
        method: 'GET',
      },
    },
  };
}

export function getWalletChartInfo(id, period) {
  return {
    type: WALLET_CHART.WALLET_CHART_INFO,
    payload: {
      client: 'owlab',
      request: {
        url: `/wallets/${id}/history/${period ? `?period=${period}` : ''}`,
        method: 'GET',
      },
    },
  };
}

export function setWalletsLoading(name, status) {
  return {
    type: WALLET_CHART.WALLETS_INFO_LOADING,
    payload: {
      name, status
    },
  };
}