import {NEWS} from './newsActionTypes';
import {DASHBOARD_ACTIVITY} from '../Dashboard/DashboardComponents/Notifications/notifyActionTypes';
import {LONG_INVESTMENT} from '../LongInvestment/LongInvestmentPage/LongIActionTypes';

export function getMainThree() {
  return {
    type: NEWS.GET_MAIN_THREE,
    payload: {
      client: 'owlab',
      request: {
         url: `/news-post/main-three/`,
        method: 'GET'
      }
    }
  };
}

export function getNewsType() {
  return {
    type: NEWS.GET_NEWS_TYPE,
    payload: {
      client: 'owlab',
      request: {
        url: `/news-post/type/list/`,
        method: 'GET'
      }
    }
  };
}

export function getPopularity(limit, offset, popularityPage, dateLimit, isPoling) {
  let obj = {
    type: NEWS.GET_POPULARITY,
    payload: {
      client: 'owlab',
      request: {
        url: `/news-post/list/popularity/?page_size=${limit}`,
        method: 'GET'
      },
    },
  };
  if (typeof offset === 'number') obj.payload.request.url += `&page=${offset}`;
  if (popularityPage) {
    obj.popularityPage = popularityPage;
    obj.payload.request.url += `&all=true`
    if (isPoling) obj.isPoling = isPoling;
  }
  return { ...obj };
}

export function getPopular(url) {
  return {
    type: NEWS.GET_POPULAR,
    payload: {
      client: 'owlab',
      request: {
        url: `/news-post/list/popularity/${url && url.length > 0 ? `?${url}` : ''}`,
        method: 'GET'
      }
    }
  };
}

export function getNews(url) {
  return {
    type: NEWS.GET_NEWS,
    payload: {
      client: 'owlab',
      request: {
        url: `/news-post/list/${url && url.length > 0 ? `?${url}` : ''}`,
        method: 'GET'
      }
    }
  };
}