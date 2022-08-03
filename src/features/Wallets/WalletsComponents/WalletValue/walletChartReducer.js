import {WALLET_CHART} from './walletChartActionTypes';

const INITIAL_STATE = {
  loadingWallets: true,
  loadingChart: true,
  walletsInfo: [...Array(10).keys()].map((el) => {
    let str = el.toString();
    return {
      balance: el,
      currency_code: str,
      currency_icon: null,
      currency_name: str,
      id: el,
      name: str,
      usdt: el
    };
  }),
  walletChartInfo: [...Array(10).keys()].map((el) => ({
    created_date: new Date(),
    balance: el
  }))
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case WALLET_CHART.WALLETS_INFO_SUCCESS:
      return {
        ...state,
        walletsInfo: action.payload.data,
        loadingWallets: false
      };
    case WALLET_CHART.WALLET_CHART_INFO:
      return{
        ...state,
        walletChartInfo: [],
      }
    case WALLET_CHART.WALLET_CHART_INFO_SUCCESS:
      let i = 0,
        сhart = action.payload.data
          .sort((a, b) => Number(new Date(a.created_date)) - Number(new Date(b.created_date)))
          .map((el, idx) => {
            let tempVal = idx < 1 ? 0 : el.balance - i;
            i = Number(el.balance);
            return {x: Number(new Date(el.created_date)), y: Number(el.balance), value: tempVal};
          });
      return {
        ...state,
        walletChartInfo: сhart,
        loadingChart: false
      };

    case WALLET_CHART.WALLETS_INFO_LOADING:
      const {name, status} = action.payload;
      return {
        ...state,
        [name]: status
      };

    default:
      return state;
  }
}
