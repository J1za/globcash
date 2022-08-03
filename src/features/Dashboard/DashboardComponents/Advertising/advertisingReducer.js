import { DASHBOARD_ADVERTISING } from './advertisingActionTypes';

const INITIAL_STATE = {
  advertising: {},
  advertisingLoad: true,

  advertisingInner: [],
  advertisingInnerLoad: true,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case DASHBOARD_ADVERTISING.GET_ADVERTISING_SUCCESS:
      return {
        ...state,
        advertising: action.payload.data,
        advertisingLoad: false
      };
    case DASHBOARD_ADVERTISING.GET_ADVERTISING_INNER_SUCCESS:
      return {
        ...state,
        advertisingInner: action.payload.data,
        advertisingInnerLoad: false
      };
    default:
      return state;
  }
}
