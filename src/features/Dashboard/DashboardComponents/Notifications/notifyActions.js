import { DASHBOARD_ACTIVITY } from './notifyActionTypes';

export function getNotifications(limit, offset, notifyPage, dateLimit, isPoling) {
  let obj = {
    type: DASHBOARD_ACTIVITY.GET_NOTIFICATIONS,
    payload: {
      client: 'owlab',
      request: {
        url: `/notification/?limit=${limit}`,
        method: 'GET'
      },
    },
  };
  if (typeof offset === 'number') obj.payload.request.url += `&offset=${offset}`;
  if (notifyPage) {
    obj.notifyPage = notifyPage;
    obj.payload.request.url += `&all=true`
    if (isPoling) obj.isPoling = isPoling;
    if (Object.values(dateLimit).some(el => el !== null)) obj.payload.request.url += `${Object.keys(dateLimit).filter(el => dateLimit[el] !== null).map(el => `&${el}=${dateLimit[el].toISOString()}`).join('')}`;
  }
  return { ...obj };
}

export function deleteNotifications(index, id) {
  return {
    type: DASHBOARD_ACTIVITY.DELETE_NOTIFICATIONS,
    payload: {
      client: 'owlab',
      request: {
        url: `/notification/${id}/`,
        method: 'DELETE'
      },
      index
    },
  };
}