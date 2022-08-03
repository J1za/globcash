import {COIN_PAGE} from './CoinActionTypes';

const INITIAL_STATE = {
  headInfo: {},
  yourInvestment: {},
  coinNews: {},
  coinLoad: true
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case COIN_PAGE.GET_HEAD_INFO_SUCCESS:
      return {...state, headInfo: action.payload.data, coinLoad: false};
    case COIN_PAGE.GET_HEAD_INFO:
      return {...state, coinLoad: true};
    case COIN_PAGE.GET_YOUR_INVESTMENT_SUCCESS:
      return {...state, yourInvestment: action.payload.data};
    case COIN_PAGE.GET_COIN_NEWS_SUCCESS:
      return {...state, coinNews: action.payload.data};
    case `@@router/LOCATION_CHANGE`:
      return {
        ...state,
        coinLoad: true
      };
    default:
      return state;
  }
}
