import {DASHBOARD_ADVERTISING} from './advertisingActionTypes';

export function getAdvertising() {
  return {
    type: DASHBOARD_ADVERTISING.GET_ADVERTISING,
    payload: {
      client: 'owlab',
      request: {
        url: `/news-post/dashboard/`,
        method: 'GET'
      }
    }
  };
}

export function getAdvertisingInner(id) {
  return {
    type: DASHBOARD_ADVERTISING.GET_ADVERTISING_INNER,
    payload: {
      client: 'owlab',
      request: {
        url: `/news-post/${id}/`,
        method: 'GET'
      }
    }
  };
}