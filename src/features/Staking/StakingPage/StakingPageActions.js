import {STAKING} from './StakingPageActionTypes';
import {LONG_INVESTMENT} from '../../LongInvestment/LongInvestmentPage/LongIActionTypes';

export function getStakingTransactions(url) {
  return {
    type: STAKING.GET_STAKING_PAGE_TRANSACTIONS,
    payload: {
      client: 'default',
      request: {
        url: `/deposit/history/${url.length > 0 ? `?${url}` : ''}`,
        method: 'GET'
      }
    }
  };
}

export function getStakingHistory(stakeInfo) {
  return {
    type: STAKING.GET_STAKING_HISTORY,
    stakeInfo: stakeInfo,
    payload: {
      client: 'default',
      request: {
        url: `/users/${stakeInfo.type}/history/`,
        //url: `/users/${stakeInfo.type}/history/?test=1`,
        method: 'GET'
      }
    }
  };
}

export function getFAQ(type) {
  return {
    type: STAKING.GET_FAQ,
    payload: {
      client: 'owlab',
      request: {
        url: `${type !== undefined && type !== '' ? `/staking/${type}` : ''}/faq/`,
        method: 'GET'
      }
    }
  };
}

export function getPercents() {
  return {
    type: STAKING.GET_STAKING_PERCENTS,
    payload: {
      client: 'default',
      request: {
        url: `/users/deposit/percent/`,
        method: 'GET'
      }
    }
  };
}

export function getStakingInfo() {
  return {
    type: STAKING.GET_STAKING_INFO,
    payload: {
      client: 'default',
      request: {
        url: `/users/deposit/info/`,
        method: 'GET'
      }
    }
  };
}

export function getStakingCheck(type, data) {
  return {
    type: STAKING.GET_STAKING_CHECK,
    payload: {
      client: 'default',
      request: {
        url: `/users/deposit/${type}/check/`,
        method: 'POST',
        data
      }
    }
  };
}

export function StakingAdd(type, data) {
  return {
    type: STAKING.GET_STAKING_ADD,
    payload: {
      client: 'default',
      request: {
        url: `/users/deposit/${type}/add/`,
        method: 'POST',
        data
      }
    }
  };
}

export function getDescriptions(type) {
  return {
    type: STAKING.GET_STAKING_DESC,
    payload: {
      client: 'owlab',
      request: {
        url: `/staking/${!!type ? `${type}/` : ''}`,
        method: 'GET'
      }
    }
  };
}

export function depositStaking(type, type2, data) {
  return {
    type: STAKING.DEPOSIT_STAKING,
    payload: {
      client: 'default',
      request: {
        url: `/deposit/transfer/${type}/${type2}`,
        method: 'POST',
        data
      }
    }
  };
}

export function depositStakingInfo(type, type2) {
  return {
    type: STAKING.DEPOSIT_STAKING_INFO,
    payload: {
      client: 'default',
      request: {
        url: `/deposit/transfer/${type}/${type2}`,
        method: 'GET'
      }
    }
  };
}

export function getTransfer(type) {
  return {
    type: STAKING.GET_TRANSFER,
    payload: {
      client: 'default',
      request: {
        url: `/deposit/transfer/${type}`,
        method: 'GET'
      }
    }
  };
}

export function getAllDescriptions() {
  return {
    type: STAKING.GET_ALL_STAKING_DESC,
    payload: {
      client: 'owlab',
      request: {
        url: `/staking/`,
        method: 'GET'
      }
    }
  };
}

export function sendContactForm(data) {
  return {
    type: STAKING.SEND_CONTACT_FORM,
    payload: {
      client: 'owlab',
      request: {
        url: `/contact-form/`,
        method: 'POST',
        data
      }
    }
  };
}

export function getUserStakes() {
  return {
    type: STAKING.GET_USER_STAKINGS,
    payload: {
      client: 'default',
      request: {
        url: `/users/stake/`,
        method: 'GET'
      }
    }
  };
}

export function makeWithdrawal(data, type) {
  return {
    type: STAKING.STAKING_WITHDRAW,
    payload: {
      client: 'default',
      request: {
        url: `/deposit/orders/out/${type}/send/`,
        method: 'POST',
        data
      }
    }
  };
}
