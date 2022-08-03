import { REPORTS } from './reportsActionTypes';
import moment from 'moment';

const INITIAL_STATE = {
  reports: {},
  listLoad: true,
  reportInner: [],
  date_month: moment().subtract(30, 'days').format('DD.MM.YY'),
  innerLoad: true,
  innerOrders: {
    count: 10,
    results: [...Array(10).keys()].map(el => {
      return {
        amount: el,
        commission_amount: el,
        created_date: el,
        exchange_name: el,
        filled: el,
        id: el,
        is_profitable: true,
        price: el,
        side: "sell",
        status: "closed",
        symbol_name: "BTC/RUB",
      }
    })
  }
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case REPORTS.GET_REPORTS_SUCCESS:
      return {
        ...state,
        reports: action.payload.data,
        listLoad: false
      };
    case REPORTS.GET_REPORT_INNER_SUCCESS:
      return {
        ...state,
        reportInner: action.payload.data,
        innerLoad: false
      };

    case REPORTS.GET_REPORT_INNER_ORDERS_SUCCESS:
      return { ...state, innerOrders: action.payload.data };

    case `@@router/LOCATION_CHANGE`:
      return {
        ...state,
        innerLoad: true,
        listLoad: true
      };

    default:
      return state;
  }
}
