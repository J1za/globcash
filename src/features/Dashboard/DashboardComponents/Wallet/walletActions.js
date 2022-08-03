import {DASHBOARD_ACTIVITY} from './walletActionTypes';

export function getWallets() {
  return {
    type: DASHBOARD_ACTIVITY.GET_WALLETS,
    payload: {
      client: 'default',
      request: {
        url: `/users/wallets/`,
        method: 'GET'
      }
    }
  };
}

export function getWalletFAQ(currency) {
  return {
    type: DASHBOARD_ACTIVITY.GET_FAQ_WALLETS,
    payload: {
      client: 'owlab',
      request: {
        url: `/wallets/${currency}/faq/`,
        method: 'GET'
      }
    }
  };
}

export function checkWalletswithdraw() {
  return {
    type: DASHBOARD_ACTIVITY.CHECK_WALLETS_WITHDRAW,
    payload: {
      client: 'default',
      request: {
        url: `/users/orders/out/check/`,
        method: 'GET'
      }
    }
  };
}

export function doWithdraw(wallet, data) {
  return {
    type: DASHBOARD_ACTIVITY.DO_WITHDRAW,
    payload: {
      client: 'default',
      request: {
        url: `/users/orders/out/${wallet}/send/`,
        method: 'POST',
        data
      }
    }
  };
}

export function setActiveWallet(name) {
  return {
    type: DASHBOARD_ACTIVITY.SET_ACTIVE_WALLET,
    payload: {
      data: name
    }
  };
}

export function withdrawalUSDT(data) {
  return {
    type: DASHBOARD_ACTIVITY.WITHDRAWAL_USDT,
    external_token:true,
    payload: {
      client: 'owlab',
      request: {
        url: `/portfolio/fiat/`,
        method: 'POST',
        data
      }
    }
  };
}

export function getWithdrawalUSDT() {
  return {
    type: DASHBOARD_ACTIVITY.GET_WITHDRAWAL_USDT,
    external_token:true,
    payload: {
      client: 'owlab',
      request: {
        url: `/portfolio/fiat/`,
        method: 'GET'
      }
    }
  };
}

export function putWithdrawalUSDT(id) {
  return {
    type: DASHBOARD_ACTIVITY.PUT_WITHDRAWAL_USDT,
    payload: {
      client: 'owlab',
      request: {
        url: `portfolio/fiat/${id}/close/`,
        method: 'PUT'
      }
    }
  };
}


export function updateSalesContract(id, data) {
  return {
    type: DASHBOARD_ACTIVITY.UPDATE_SALES_CONTRACT,
    external_token:true,
    payload: {
      client: 'owlab',
      request: {
        url: `portfolio/fiat/${id}/`,
        method: 'PUT',
        data
      }
    }
  };
}