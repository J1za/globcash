import {LONG_INVESTMENT} from './LongIActionTypes';
import {WALLETS_ACTIVITY} from '../../Wallets/WalletsComponents/WalletInfo/sendToWalletActionTypes';
import {DASHBOARD_ACTIVITY} from '../../Dashboard/DashboardComponents/Notifications/notifyActionTypes';

export function getDepositWallet() {
  return {
    type: LONG_INVESTMENT.GET_DEPOSIT_WALLET,
    payload: {
      client: 'default',
      request: {
        url: `/users/long/wallets/`,
        method: 'GET'
      }
    }
  };
}

export function checkWithdrawalInfo() {
  return {
    type: LONG_INVESTMENT.CHECK_WITHDRAWAL_INFO,
    payload: {
      client: 'default',
      request: {
        url: `/users/long/out/check`,
        method: 'GET'
      }
    }
  };
}

export function getStatistic() {
  return {
    type: LONG_INVESTMENT.GET_STATISTIC,
    payload: {
      client: 'owlab',
      request: {
        url: `/portfolio/statistic/`,
        method: 'GET'
      }
    }
  };
}

export function getStatisticDashboard() {
  return {
    type: LONG_INVESTMENT.GET_STATISTIC_DASHBOARD,
    payload: {
      client: 'owlab',
      request: {
        url: `/portfolio/statistic/dashboard/`,
        method: 'GET'
      }
    }
  };
}

export function getStatisticInner(ID) {
  return {
    type: LONG_INVESTMENT.GET_STATISTIC_INNER,
    payload: {
      client: 'owlab',
      request: {
        url: `/portfolio/investment/${ID}/`,
        method: 'GET'
      }
    }
  };
}

export function doCustomStatisticLoad(isLoad) {
  return {
    type: LONG_INVESTMENT.DO_CUSTOM_STATISTIC_LOAD,
    payload: {
      data: isLoad
    }
  };
}

export function setActualPrice(data) {
  return {
    type: LONG_INVESTMENT.SET_ACTUAL_PRICE,
    payload: {
      data: data
    }
  };
}

export function getRecentPurchases() {
  return {
    type: LONG_INVESTMENT.GET_RECENT_PURCHASES,
    payload: {
      client: 'owlab',
      request: {
        url: `/portfolio/investment/list/notapproved/`,
        method: 'GET'
      }
    }
  };
}

export function getPortfolio(path) {
  return {
    type: LONG_INVESTMENT.GET_PORTFOLIO,
    payload: {
      client: 'owlab',
      request: {
        url: `/portfolio/investment/list/${path.length > 0 ? `?${path}` : ''}`,
        method: 'GET'
      }
    }
  };
}

export function getforecasts() {
  return {
    type: LONG_INVESTMENT.GET_FORCASTS,
    payload: {
      client: 'owlab',
      request: {
        url: `/`,
        method: 'GET'
      }
    }
  };
}

export function getAvailableCoins(url) {
  return {
    type: LONG_INVESTMENT.GET_AVAILABLE_COINS,
    payload: {
      client: 'owlab',
      request: {
        url: `/portfolio/currency/list/${url && url.length > 0 ? `?${url}` : ''}`,
        method: 'GET'
      }
    }
  };
}

export function getAllCoins() {
  return {
    type: LONG_INVESTMENT.GET_ALL_COINS,
    payload: {
      client: 'owlab',
      request: {
        url: `/currency/list/`,
        method: 'GET'
      }
    }
  };
}

export function buyAvailableCoins(data) {
  return {
    type: LONG_INVESTMENT.SEND_AVAILABLE_COINS,
    payload: {
      client: 'owlab',
      request: {
        url: `/portfolio/currency/buy/`,
        method: 'POST',
        data
      }
    }
  };
}
export function prolongInvestCoins(id, data) {
  return {
    type: LONG_INVESTMENT.PROLONG_INVEST_COINS,
    payload: {
      client: 'owlab',
      request: {
        url: `/portfolio/investment/${id}/prolongate/`,
        method: 'POST',
        data
      }
    }
  };
}

export function deletePurchases(id, index) {
  return {
    type: LONG_INVESTMENT.DELETE_PURCHASES,
    payload: {
      client: 'owlab',
      request: {
        url: `/portfolio/investment/${id}/reject/`,
        method: 'DELETE'
      }
    },
    index: index
  };
}

export function sellCoins(data) {
  return {
    type: LONG_INVESTMENT.SLL_COINS,
    payload: {
      client: 'owlab',
      request: {
        url: `portfolio/currency/sell/`,
        method: 'POST',
        data
      }
    }
  };
}

export function deleteCoins(investment_request, del, parent) {
  return {
    type: LONG_INVESTMENT.DELETE_COINS,
    payload: {
      client: 'owlab',
      request: {
        url: `/portfolio/investment-request/${investment_request}/reject/`,
        method: 'DELETE'
      }
    },
    parent: parent,
    del: del
  };
}

export function getExpertForecasts(url) {
  return {
    type: LONG_INVESTMENT.GET_EXPORT_FORECASTS,
    payload: {
      client: 'owlab',
      request: {
        url: `/posts/${url && url.length > 0 ? `?${url}` : ''}`,
        method: 'GET'
      }
    }
  };
}

//RECOMENDATION

export function getCurrencyRecomedation(id) {
  return {
    type: LONG_INVESTMENT.CURRENCY_RECOMENDATION,
    payload: {
      client: 'owlab',
      request: {
        url: `/posts/${id}/`,
        method: 'GET'
      }
    }
  };
}

export function getCoinCommission() {
  return {
    type: LONG_INVESTMENT.GET_COIN_COMMISSION,
    payload: {
      client: 'owlab',
      request: {
        url: `/portfolio/commission/`,
        method: 'GET'
      }
    }
  };
}
export function getMyActivities(id, path) {
  return {
    type: LONG_INVESTMENT.GET_MY_ACTIVITIES,
    payload: {
      client: 'owlab',
      request: {
        url: `/portfolio/investment/${id}/event/${path?.length > 0 ? `?${path}` : ''}`,
        method: 'GET'
      }
    }
  };
}

export function getLabelsCoins() {
  return {
    type: LONG_INVESTMENT.GET_LABELS_COINS,
    payload: {
      client: 'owlab',
      request: {
        url: `/portfolio/currency/labels/`,
        method: 'GET'
      }
    }
  };
}

export function getBinanceInfo(pair, interval, startTime) {
  return {
    type: LONG_INVESTMENT.GET_DASHBOARD_BINANCE_INFO,
    payload: {
      client: 'binance',
      request: {
        url: `/klines?symbol=${pair}&interval=${interval}&startTime=${startTime}`,

        method: 'GET'
      }
    }
  };
}

export function getBinanceInfoBtc(pair, interval, startTime) {
  return {
    type: LONG_INVESTMENT.GET_DASHBOARD_BINANCE_BTC,
    payload: {
      client: 'binance',
      request: {
        url: `/klines?symbol=${pair}&interval=${interval}&startTime=${startTime}`,
        method: 'GET'
      }
    }
  };
}

export function getBalanceInfo(id, period) {
  return {
    type: LONG_INVESTMENT.GET_DASHBOARD_BALANCE_INFO,
    payload: {
      client: 'owlab',
      request: {
        url: `/portfolio/investment/${id}/chart/?period=${period}`,
        method: 'GET'
      }
    }
  };
}

export function getInvestChart(period) {
  return {
    type: LONG_INVESTMENT.GET_DASHBOARD_INVEST_INFO,
    payload: {
      client: 'owlab',
      request: {
        url: `/portfolio/statistic/chart/?period=${period}`,
        method: 'GET'
      }
    }
  };
}

export function getBinancePrice(pair) {
  return {
    type: LONG_INVESTMENT.GET_DASHBOARD_BINANCE_PRICE,
    payload: {
      client: 'binance',
      request: {
        url: `/ticker/price?symbol=${pair}`,
        method: 'GET'
      }
    }
  };
}

export function depositLongWallet(data) {
  return {
    type: LONG_INVESTMENT.DEPOSIT_LONG_WALLET,
    payload: {
      client: 'default',
      request: {
        url: `/users/long/out/send/`,
        method: 'POST',
        data
      }
    }
  };
}

export function getCoinMarketCap(id, period) {
  return {
    type: LONG_INVESTMENT.GET_COIN_MARKETCAP,
    payload: {
      client: 'owlab',
      request: {
        url: `/portfolio/currency/${id}/marketcap/chart/?period=${period}`,
        method: 'GET'
      }
    }
  };
}

export function defaultValueBtc(startDate, endDate) {
  return {
    type: LONG_INVESTMENT.DEFAULT_BTC,
    payload: {
      startDate,
      endDate
    }
  };
}

export function defaultValueUsdt(startDate, endDate) {
  return {
    type: LONG_INVESTMENT.DEFAULT_USDT,
    payload: {
      startDate,
      endDate
    }
  };
}
