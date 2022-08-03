import {COIN_PAGE} from './CoinActionTypes';

export function getHeadInfo(id) {
  return {
    type: COIN_PAGE.GET_HEAD_INFO,
    payload: {
      client: 'owlab',
      request: {
        url: `/currency/${id}/`,
        method: 'GET'
      }
    }
  };
}

export function getYourInvestment(id) {
  return {
    type: COIN_PAGE.GET_YOUR_INVESTMENT,
    payload: {
      client: 'owlab',
      request: {
        url: `/portfolio/currency/${id}/investment/list/`,
        method: 'GET'
      }
    }
  };
}

export function getCoinNews(id, activepage, page_size) {
  return {
    type: COIN_PAGE.GET_COIN_NEWS,
    payload: {
      client: 'owlab',
      request: {
        url: `news-post/list/?currency=${id}&page=${activepage}&page_size=${page_size}`,
        method: 'GET'
      }
    }
  };
}
