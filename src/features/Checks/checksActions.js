import {CHECKS} from './checksActionTypes';

export function CheckHash(data) {
  return {
    type: CHECKS.CHECK_HASH,
    payload: {
      client: 'owlab',
      request: {
        url: `/amlbot/`,
        method: 'POST',
        data
      }
    }
  };
}

export function getRisk(url) {
  return {
    type: CHECKS.GET_RISK,
    payload: {
      client: 'owlab',
      request: {
        url: `/amlbot/${url && url.length > 0 ? `?${url}` : ''}`,
        method: 'GET'
      }
    }
  };
}

export function getFreeChecks() {
  return {
    type: CHECKS.GET_FREE_CHECKS,
    payload: {
      client: 'owlab',
      request: {
        url: `/amlbot/free-count/`,
        method: 'GET'
      }
    }
  };
}