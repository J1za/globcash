import { DASHBOARD_STAKING } from './stakingActionTypes';

export function getDashboardStaking(isHistory, type) {
  return {
    type: DASHBOARD_STAKING[isHistory ? 'GET_DASHBOARD_STAKING_HISTORY' : 'GET_DASHBOARD_STAKING'],
    payload: {
      client: 'default',
      request: {
        url: `/users/${isHistory ? `${type}/history/` : 'stake/'}`,
        //url: `/users/${isHistory ? `${type}/history/` : 'stake/'}?test=1`,
        method: 'GET'
      },
    },
  };
}