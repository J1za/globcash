import {REPORTS} from './reportsActionTypes';

/* export function getReports(path) {
  return {
    type: REPORTS.GET_REPORTS,
    payload: {
      client: 'owlab',
      request: {
        url: `/terminal/?path=v0/trader/reports/${path.length > 0 ? `?${encodeURIComponent(path)}` : ''}`,
        method: 'GET'
      },
    },
  };
}

export function getReportInner(id, isOrders, ordersAttr) {
  return {
    type: REPORTS[isOrders ? 'GET_REPORT_INNER_ORDERS' : 'GET_REPORT_INNER'],
    payload: {
      client: 'owlab',
      request: {
        url: `/terminal/?path=v0/trader/reports/${id}/${isOrders ? `orders/${ordersAttr.length > 0 ? `?${encodeURIComponent(ordersAttr)}` : ''}` : ''}`,
        method: 'GET'
      },
    },
  };
} */

export function getReports(url) {
  return {
    type: REPORTS.GET_REPORTS,
    payload: {
      client: 'owlab',
      request: {
        url: `/staking-report/${!!url ? `?${url}` : ''}`,
        method: 'GET'
      },
    },
  };
}

export function getReportInner(id) {
  return {
    type: REPORTS.GET_REPORT_INNER,
    payload: {
      client: 'owlab',
      request: {
        url: `/staking-report/${id}/`,
        method: 'GET'
      },
    },
  };
}