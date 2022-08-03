import {HEADER} from './headerActionTypes';

export function getUser() {
  return {
    type: HEADER.GET_USER_INFO,
    payload: {
      client: 'owlab',
      request: {
        url: `/profile-info/`,
        method: 'GET'
      }
    }
  };
}

export function getPrices(str) {
  return {
    type: HEADER.GET_BINANCE_PRICES,
    payload: {
      client: 'binance',
      request: {
        url: `/ticker/price${str !== null && str !== undefined && str !== '' ? `?symbol=${str}` : ''}`,
        method: 'GET'
      }
    }
  };
}

export function getUSDTPrice() {
  return {
    type: HEADER.GET_USDT_PRICE,
    payload: {
      client: 'kraken',
      request: {
        url: `/public/Ticker?pair=USDTUSD`,
        method: 'GET'
      }
    }
  };
}

export function getGLBXPrice() {
  return {
    type: HEADER.GET_GLBX_PRICE,
    payload: {
      client: 'default',
      request: {
        url: `/glbx/price/`,
        method: 'GET'
      }
    }
  };
}

export function setPrices(data) {
  return {
    type: HEADER.SET_PRICES,
    payload: {
      data
    }
  };
}

export function setAlert(data) {
  return {
    type: HEADER.SET_HEADER_ALERT,
    payload: {
      data
    }
  };
}

export function setAvatar(data) {
  return {
    type: HEADER.SET_AVATAR,
    payload: {
      client: 'owlab',
      request: {
        url: `/profile-info/`,
        method: 'PATCH',
        data
      }
    }
  };
}

export function partialUpdateSecurityParams(data) {
  return {
    type: HEADER.PARTIAL_UPDATES_SECURITY_PARAMS,
    payload: {
      client: 'owlab',
      request: {
        url: `/profile-info/`,
        method: 'PATCH',
        data
      }
    }
  };
}

export function removeAvatar(data) {
  return {
    type: HEADER.SET_AVATAR,
    payload: {
      client: 'owlab',
      request: {
        url: `/profile-info/`,
        method: 'PATCH',
        data: {
          avatar: null
        }
      }
    }
  };
}

export function logOut() {
  return {
    type: HEADER.LOGOUT,
    payload: {
      client: 'owlab',
      request: {
        url: `/logout/`,
        method: 'POST'
      }
    }
  };
}
