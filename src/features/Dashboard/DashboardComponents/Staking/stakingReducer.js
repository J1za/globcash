import { DASHBOARD_STAKING } from './stakingActionTypes';

const summ2Str = (first, second) => eval(first + (second[0] === '-' ? '' : '+') + Number(second))

const INITIAL_STATE = {
  dashboardStaking: {},
  dashboardStakingHistory: {},
  stakingChart: [],
  loading: true,
  stakingChartCounter: 0
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case DASHBOARD_STAKING.GET_DASHBOARD_STAKING_SUCCESS:
      return { ...state, dashboardStaking: action.payload.data };
    case DASHBOARD_STAKING.GET_DASHBOARD_STAKING_HISTORY_SUCCESS:
      let i = 0,
        stakingChart = action.payload.data.sort((a, b) => a.time - b.time).map(el => {
          i = summ2Str(i, el.amount);
          return { x: el.time * 1000, y: i, value: el.amount };
        });
      return {
        ...state,
        dashboardStakingHistory: action.payload.data,
        stakingChart: stakingChart,
        loading: false,
        stakingChartCounter: state.stakingChartCounter + 1
      };

    default:
      return state;
  }
}
