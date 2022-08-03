import { WALLETS_ACTIVITY } from './sendToWalletActionTypes';

const INITIAL_STATE = {
  userWallet: {},
  successSendToUser: 0
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case WALLETS_ACTIVITY.GET_USERS_WALLETS_SUCCESS:
      return {
        ...state,
        userWallet: action.payload.data.error ? {} : action.payload.data
      };
    case WALLETS_ACTIVITY.SEND_TO_WALLET_SUCCESS:
      return {
        ...state,
        successSendToUser: state.successSendToUser + 1
      };

    default:
      return state;
  }
}
