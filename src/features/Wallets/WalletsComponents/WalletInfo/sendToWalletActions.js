import { WALLETS_ACTIVITY } from './sendToWalletActionTypes';

export function getUsersWallets(activeWallet, e) {
  console.log(activeWallet, e)
  return {
    type: WALLETS_ACTIVITY.GET_USERS_WALLETS,
    payload: {
      client: 'default',
      request: {
        url: `/users/u2u/check/${activeWallet}/${e.length > 16 && e.slice(0, 2) === '0x' ? e.slice(2) : e}`,
        method: 'GET'
      },
    },
  };
}

export function sendToWallet(activeWallet, id, data) {
  return {
    type: WALLETS_ACTIVITY.SEND_TO_WALLET,
    payload: {
      client: 'default',
      request: {
        url: `/users/u2u/${activeWallet}/${id}`,
        method: 'POST',
        data
      },
    },
  };
}