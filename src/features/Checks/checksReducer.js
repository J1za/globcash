import { CHECKS } from './checksActionTypes';

const INITIAL_STATE = {
  risk: {},
  riskLoad: true,

  freeChecks: {},
  freeChecksLoad: true,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case CHECKS.GET_RISK_SUCCESS:
      return {
        ...state,
        risk: action.payload.data,
        riskLoad: false
      };
    case CHECKS.GET_FREE_CHECKS_SUCCESS:
      return {
        ...state,
        freeChecks: action.payload.data,
        freeChecksLoad: false
      };
    default:
      return state;
  }
}
