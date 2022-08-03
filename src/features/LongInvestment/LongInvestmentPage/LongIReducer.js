import {LONG_INVESTMENT} from './LongIActionTypes';
import moment from 'moment';
import {DASHBOARD_ACTIVITY} from '../../Dashboard/DashboardComponents/Notifications/notifyActionTypes';

const INITIAL_STATE = {
  statistic: {},
  statisticInner: {
    currency: {}
  },
  exchangePAIR: {},
  statisticLoad: true,
  loadCurrencyCode: false,

  statiscticDashboard: {},

  currencyRecomendation: {},

  depositWalletInfo: {
    address: '',
    balance: 0,
    long_name: '',
    name: '',
    short_name: ''
  },

  recentPurchases: [],
  recentPurchasesLoad: true,

  investmentRequestTimeout: 0,
  chartInvestment: {},
  dashboardChart: [],

  portfolio: {
    count: 10,
    results: [...Array(10).keys()].map((el) => {
      let num = el,
        str = el.toString(),
        date = new Date(el);
      return {
        id: num,
        currency: {
          id: num,
          name: str,
          code: str,
          icon: str
        },
        created_date: date,
        end_date: date,
        price: num,
        usdt_amount: num,
        percent: num,
        duration: str,
        prolongation_date: null,
        events: [],
        pnl: num
      };
    })
  },
  portfolioLoad: true,
  longInvestment_charts: {},
  longInvestment_charts_balance: [...Array(10).keys()].map((el) => ({
    created_date: new Date(),
    balance: el
  })),
  available: {},
  availableLoad: true,

  expertForecasts: {},
  expertForecastsLoad: true,

  coinCommission: {},
  coinCommissionLoad: true,
  myActivities: {},

  labelsCoins: {},
  labelsCoinsLoad: true,

  allCoins: [],

  chartMarketcap: [],
  chartMarketcapBtc: [],
  coin_usdt_longInvestment_charts: [],
  coin_btc_longInvestment_charts: [],
  coinChartLoad: true
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    //statistics
    case LONG_INVESTMENT.GET_STATISTIC_SUCCESS:
      let temp = {};
      Object.keys(action.payload.data).forEach(
        (el) =>
          (temp[el] =
            typeof action.payload.data[el] === 'number' ? action.payload.data[el].toFixed(2) : action.payload.data[el])
      );
      temp.online_pnl_date = moment(new Date()).format('DD.MM.YY HH:mm');
      temp.week_pnl_date = moment().subtract(7, 'days').format('DD.MM.YY');
      return {
        ...state,
        statistic: temp,
        statisticLoad: false
      };
    case LONG_INVESTMENT.GET_STATISTIC_FAIL:
      return {
        ...state,
        statisticLoad: undefined
      };
    case LONG_INVESTMENT.GET_STATISTIC_DASHBOARD_SUCCESS:
      let k = 0,
        сhartData = action.payload.data.chart
          .sort((a, b) => Number(new Date(a.created_date__date)) - Number(new Date(b.created_date__date)))
          .map((el, idx) => {
            let tempVal = idx < 1 ? 0 : el.usdt - k;
            k = Number(el.usdt);
            return {x: Number(new Date(el.created_date__date)), y: Number(el.usdt), value: tempVal};
          });
      return {
        ...state,
        statistic: action.payload.data,
        dashboardChart: сhartData,
        statisticLoad: action.payload.data.chart.length > 0 ? false : true
      };

    case LONG_INVESTMENT.GET_STATISTIC_DASHBOARD_FAIL:
      return {
        ...state,
        statisticLoad: undefined
      };
    case LONG_INVESTMENT.GET_STATISTIC_INNER:
      return {
        ...state,
        statisticInner: {
          currency: {}
        },
        statisticLoad: true,
        loadCurrencyCode: true
      };
    case LONG_INVESTMENT.GET_STATISTIC_INNER_SUCCESS:
      return {
        ...state,
        statisticInner: action.payload.data,
        statisticLoad: false,
        loadCurrencyCode: false
      };
    case LONG_INVESTMENT.DO_CUSTOM_STATISTIC_LOAD:
      return {
        ...state,
        statisticLoad: action.payload.data
      };

    //recent purchases
    case LONG_INVESTMENT.GET_RECENT_PURCHASES_SUCCESS:
      return {
        ...state,
        recentPurchases: action.payload.data,
        recentPurchasesLoad: false
      };
    case LONG_INVESTMENT.GET_RECENT_PURCHASES_FAIL:
      return {
        ...state,
        recentPurchasesLoad: undefined
      };

    //portfolio
    case LONG_INVESTMENT.GET_PORTFOLIO_SUCCESS:
      return {
        ...state,
        portfolio: action.payload.data,
        portfolioLoad: false
      };
    case LONG_INVESTMENT.GET_PORTFOLIO_FAIL:
      return {
        ...state,
        portfolioLoad: undefined
      };

    //forecasts
    case LONG_INVESTMENT.GET_FORCASTS_SUCCESS:
      return {
        ...state,
        forecast: action.payload.data,
        forecastLoad: false
      };
    case LONG_INVESTMENT.GET_FORCASTS_FAIL:
      return {
        ...state,
        forecastLoad: undefined
      };

    case LONG_INVESTMENT.SEND_AVAILABLE_COINS_SUCCESS:
      let requestTimeout = (action.payload.data.investment_request_timeout / 60).toFixed();
      return {
        ...state,
        investmentRequestTimeout: requestTimeout
      };

    //All available coins
    case LONG_INVESTMENT.GET_AVAILABLE_COINS_SUCCESS:
      return {
        ...state,
        available: action.payload.data,
        availableLoad: false
      };
    case LONG_INVESTMENT.SET_ACTUAL_PRICE:
      action.payload.data.forEach((el) => (state.available.results.find((elem) => elem.id === el.id).price = el.price));
      return {...state};

    //All coins
    case LONG_INVESTMENT.GET_ALL_COINS_SUCCESS:
      return {
        ...state,
        allCoins: action.payload.data
      };
    case LONG_INVESTMENT.GET_AVAILABLE_COINS_FAIL:
      return {
        ...state,
        availableLoad: undefined
      };

    case LONG_INVESTMENT.DELETE_PURCHASES_SUCCESS:
      let {index} = action.meta.previousAction;
      state.recentPurchases.splice(index, 1);
      return {
        ...state,
        recentPurchasesLoad: false
      };
    case LONG_INVESTMENT.DELETE_COINS_SUCCESS:
      let {del, parent} = action.meta.previousAction;
      state.portfolio.results.find((el) => el.id === parent).events.splice(del, 1);
      return {
        ...state,
        portfolioLoad: false
      };

    //Expert Forecasts
    case LONG_INVESTMENT.GET_EXPORT_FORECASTS_SUCCESS:
      return {
        ...state,
        expertForecasts: {
          ...action.payload.data,
          results: [
            ...action.payload.data.results.map((el) => ({
              ...el,
              predict_price: el.price
            }))
          ]
        },
        expertForecastsLoad: false
      };
    case LONG_INVESTMENT.GET_EXPORT_FORECASTS_FAIL:
      return {
        ...state,
        expertForecastsLoad: undefined
      };
    //Coin Commission
    case LONG_INVESTMENT.GET_COIN_COMMISSION_SUCCESS:
      return {
        ...state,
        statisticInner: {
          currency: {}
        },
        coinCommission: {
          ...state.coinCommission,
          ...action.payload.data
        },
        coinCommissionLoad: false
      };
    case LONG_INVESTMENT.CHECK_WITHDRAWAL_INFO_SUCCESS:
      return {
        ...state,
        coinCommission: {
          ...state.coinCommission,
          ...action.payload.data
        }
      };
    case LONG_INVESTMENT.GET_DEPOSIT_WALLET_SUCCESS:
      return {
        ...state,
        depositWalletInfo: action.payload.data
      };
    case LONG_INVESTMENT.GET_MY_ACTIVITIES_SUCCESS:
      return {
        ...state,
        myActivities: action.payload.data,
        statisticLoad: false
      };
    //LABELS COINS
    case LONG_INVESTMENT.GET_LABELS_COINS_SUCCESS:
      return {
        ...state,
        labelsCoins: action.payload.data,
        labelsCoinsLoad: false
      };
    // Long Investment CHART MARKET
    case LONG_INVESTMENT.GET_DASHBOARD_BINANCE_INFO_SUCCESS:
      return {
        ...state,
        longInvestment_charts: action.payload.data.map((el) => [
          Number(el[0]),
          Number(el[3]),
          Number(el[2]),
          Number(el[1]),
          Number(el[4])
        ]),
        coin_usdt_longInvestment_charts: action.payload.data.map((el) => [
          Number(el[0]),
          Number(el[3]).toFixed() > 9999999999 //  write numbers in financial format
            ? Number((Number(el[3]).toFixed() / 100000000000).toFixed(2))
            : Number(el[3]) > 99999 && Number(el[3]) < 1000000
            ? Number((Number(el[3]) / 1000).toFixed(2))
            : Number(el[3]) > 1000000
            ? Number((Number(el[3]) / 1000000).toFixed(2))
            : Number(el[3]) < 1
            ? Number(Number(el[3]).toFixed(5))
            : Number(Number(el[3]).toFixed(2)),

          Number(el[2]),
          Number(el[1]),
          Number(el[4]),
          Number(el[3])
        ]),
        coinChartLoad: action.payload.data.length < 0 ? true : false
      };

    case LONG_INVESTMENT.GET_DASHBOARD_BINANCE_BTC_SUCCESS:
      return {
        ...state,
        coin_btc_longInvestment_charts: action.payload.data.map((el) => [
          Number(el[0]),

          Number(el[3]).toFixed() > 9999999999 //  write numbers in financial format
            ? Number((Number(el[3]).toFixed() / 100000000000).toFixed(2))
            : Number(el[3]) > 99999 && Number(el[3]) < 1000000
            ? Number((Number(el[3]) / 1000).toFixed(2))
            : Number(el[3]) > 1000000
            ? Number((Number(el[3]) / 1000000).toFixed(2))
            : Number(el[3]) < 1
            ? Number(Number(el[3]).toFixed(5))
            : Number(Number(el[3]).toFixed(2)),
          Number(el[2]),
          Number(el[1]),
          Number(el[4]),
          Number(el[3])
        ]),
        coinChartLoad: action.payload.data.length < 0 ? true : false
      };

    case LONG_INVESTMENT.GET_DASHBOARD_BALANCE_INFO:
    case LONG_INVESTMENT.GET_DASHBOARD_BINANCE_INFO:
      return {
        ...state,
        longInvestment_charts: [],
        longInvestment_charts_balance: [],
        coin_longInvestment_charts: []
      };

    case LONG_INVESTMENT.GET_DASHBOARD_BINANCE_BTC:
      return {
        ...state,
        coin_btc_longInvestment_charts: []
      };
    case LONG_INVESTMENT.GET_DASHBOARD_BINANCE_PRICE_SUCCESS:
      return {
        ...state,
        exchangePAIR: action.payload.data
      };

    //Long Investment INVEST CHART
    case LONG_INVESTMENT.GET_DASHBOARD_INVEST_INFO:
      return {
        ...state,
        chartInvestment: []
      };

    case LONG_INVESTMENT.GET_DASHBOARD_INVEST_INFO_SUCCESS:
      let n = 0,
        сhartInfo = action.payload.data
          .sort((a, b) => Number(new Date(a.created_date)) - Number(new Date(b.created_date)))
          .map((el, idx) => {
            let tempVal = idx < 1 ? 0 : el.total_usdt - n;
            n = Number(el.total_usdt);
            return {x: Number(new Date(el.created_date)), y: Number(el.total_usdt), value: tempVal};
          });
      return {
        ...state,
        statisticLoad: false,
        chartInvestment: сhartInfo
      };

    //Long Investment CHART BALANCE
    case LONG_INVESTMENT.GET_DASHBOARD_BALANCE_INFO_SUCCESS:
      let i = 0,
        сhart = action.payload.data
          .sort((a, b) => Number(new Date(a.created_date)) - Number(new Date(b.created_date)))
          .map((el, idx) => {
            let tempVal = idx < 1 ? 0 : el.total_usdt - i;
            i = Number(el.total_usdt);
            return {x: Number(new Date(el.created_date)), y: Number(el.total_usdt), value: tempVal};
          });
      return {
        ...state,
        statisticLoad: false,
        longInvestment_charts_balance: сhart
      };

    //Inner Coin CHART MARKETCAP
    case LONG_INVESTMENT.GET_COIN_MARKETCAP_SUCCESS:
      let tempArrUsdt = [],
        t = 0,
        сhartCoin = [],
        a = 0,
        сhartCoinBtc = [];

      сhartCoin = action.payload.data
        .sort((a, b) => Number(new Date(a.date)) - Number(new Date(b.date)))
        .map((el, idx) => {
          t = Number(el.usd);
          return {
            x: Number(new Date(el.date)),
            // y:
            // 	Number(Number(el.usd).toFixed()) > 999999999 // write numbers in financial format
            // 		? parseInt(Number((Number(Number(el.usd).toFixed()) / 1000000000).toFixed(2)))
            // 		: Number(el.usd) > 999999 && Number(el.usd) < 1000000000
            // 			? parseInt(Number(Number(Number(el.usd).toFixed()) / 1000000).toFixed(2))
            // 			: Number(el.usd) > 999 && Number(el.usd) < 1000000
            // 				? parseInt(Number(Number(Number(el.usd).toFixed()) / 1000).toFixed(2))
            // 				: parseInt(Number(el.usd).toFixed()),
            y: Number(el.usd)
          };
        });
      сhartCoinBtc = action.payload.data
        .sort((a, b) => Number(new Date(a.date)) - Number(new Date(b.date)))
        .map((el, idx) => {
          a = Number(el.btc);
          return {
            x: Number(new Date(el.date)),
            y:
              Number(el.btc).toFixed() > 999999999 // write numbers in financial format
                ? parseInt(Number((Number(el.btc).toFixed() / 1000000000).toFixed(2)))
                : Number(el.btc) > 999 && Number(el.btc) < 1000000
                ? parseInt(Number(Number(Number(el.btc).toFixed() / 1000).toFixed(2)))
                : Number(el.btc) > 999999 && Number(el.btc) < 1000000000
                ? parseInt(Number((Number(el.btc).toFixed() / 1000000).toFixed(2)))
                : parseInt(Number(Number(el.btc).toFixed())),
            value: Number(el.btc)
          };
        });

      return {
        ...state,
        chartMarketcap: сhartCoin,
        chartMarketcapBtc: сhartCoinBtc,
        coinChartLoad: сhartCoin.length < 0 && сhartCoinBtc.length < 0 ? true : false
      };

    //set default valuas

    case LONG_INVESTMENT.GET_COIN_MARKETCAP:
      return {
        ...state,
        chartMarketcap: [],
        chartMarketcapBtc: [],
        longInvestment_charts: [],
        coin_usdt_longInvestment_charts: []
      };

    case LONG_INVESTMENT.DEFAULT_BTC:
      state.coin_btc_longInvestment_charts = [
        [action.payload.startDate, 1, 1, 1, 1, 1],
        [action.payload.endDate, 1, 1, 1, 1, 1]
      ];
      return {
        ...state
      };

    case LONG_INVESTMENT.DEFAULT_USDT:
      state.coin_usdt_longInvestment_charts = [
        [action.payload.startDate, 1, 1, 1, 1],
        [action.payload.endDate, 1, 1, 1, 1]
      ];
      return {
        ...state
      };

    //RECOMENDATION
    case LONG_INVESTMENT.CURRENCY_RECOMENDATION_SUCCESS:
      return {
        ...state,
        currencyRecomendation: action.payload.data
      };

    case `@@router/LOCATION_CHANGE`:
      return {
        ...state,
        statisticLoad: true
      };
    default:
      return state;
  }
}
