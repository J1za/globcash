import {HEADER} from './headerActionTypes';

import {SETTINGS} from '../../features/Settings/settingsActionTypes';

const INITIAL_STATE = {
  userInfo: {},
  binance_prices: [],
  kraken_usdt: {},
  glbx_coin: {},
  prices: [],
  header_alert: { id: null, text: '' },
  loading: true
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case HEADER.GET_BINANCE_PRICES_SUCCESS:
      return {...state, binance_prices: action.payload.data};
    case HEADER.GET_USDT_PRICE_SUCCESS:
      return {...state, kraken_usdt: action.payload.data};
    case HEADER.GET_GLBX_PRICE_SUCCESS:
      return {...state, glbx_coin: action.payload.data};
    case HEADER.SET_PRICES:
      return {
        ...state,
        prices: action.payload.data,
        loading: false
      };
    case HEADER.SET_HEADER_ALERT:
      return {
        ...state,
        header_alert: action.payload.data
      };
    case HEADER.GET_USER_INFO_SUCCESS:
      return {
        ...state,
        userInfo: action.payload.data
      };

    case HEADER.SET_AVATAR_SUCCESS:
    case HEADER.PARTIAL_UPDATES_SECURITY_PARAMS_SUCCESS:
    case SETTINGS.TWO_FACTOR_CODE_SUCCESS:
      return {...state, userInfo: action.payload.data};

    case SETTINGS.CONFIRM_GOOGLECODE_SUCCESS:
      return {...state, userInfo: {...state.userInfo, totp_auth: !state.userInfo.totp_auth}};

    case HEADER.REMOVE_AVATAR_SUCCESS:
      return {...state, userInfo: action.payload.data};

    case `@@router/LOCATION_CHANGE`:
      return {
        ...state,
        loading: true
      };

    default:
      return state;
  }
}
