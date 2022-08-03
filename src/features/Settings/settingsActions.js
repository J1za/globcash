import {SETTINGS} from './settingsActionTypes';

export function setKycData(data) {
  return {
    type: SETTINGS.SET_FILES_KYC,
    payload: {
      client: 'owlab',
      request: {
        url: `/kyc_verification/`,
        method: 'PUT',
        contentType: 'multipart/form-data',
        data
      }
    }
  };
}

export function getKycData() {
  return {
    type: SETTINGS.GET_FILES_KYC,
    payload: {
      client: 'owlab',
      request: {
        url: `/kyc_verification/`,
        method: 'GET'
      }
    }
  };
}

export function getQRSecret() {
  return {
    type: SETTINGS.GET_QRSECRET,
    payload: {
      client: 'owlab',
      request: {
        url: `/enable-totp/`,
        method: 'POST'
      }
    }
  };
}

export function confirmGoogleCode(data) {
  return {
    type: SETTINGS.CONFIRM_GOOGLECODE,
    payload: {
      client: 'owlab',
      request: {
        url: `/check-totp/`,
        method: 'POST',
        data
      }
    }
  };
}

export function sendAuthEmail(data) {
  return {
    type: SETTINGS.SEND_AUTH_EMAIL,
    payload: {
      client: 'owlab',
      request: {
        url: `/enable-email-two-factor/`,
        method: 'POST',
        data
      }
    }
  };
}

export function sendAuthCode(data) {
  return {
    type: SETTINGS.TWO_FACTOR_CODE,
    payload: {
      client: 'owlab',
      request: {
        url: `/verify-email-two-factor/`,
        method: 'POST',
        data
      }
    }
  };
}

export function confirmAuth(url, data) {
  return {
    type: SETTINGS.CONFIRMATION_ACTION,
    payload: {
      client: 'owlab',
      request: {
        url: `/auth/confirm-${url}/`,
        method: 'POST',
        data
      }
    }
  };
}

export function resendСode(data) {
  return {
    type: SETTINGS.RESEND_CODE,
    payload: {
      client: 'owlab',
      request: {
        url: `/auth/resend-code/`,
        method: 'POST',
        data
      }
    }
  };
}

export function getRefferals(url) {
  return {
    type: SETTINGS.GET_REFFERALS,
    payload: {
      client: 'default',
      request: {
        url: `/users/deposit/referals${url && url.length > 0 ? `?${url}` : ''}`,
        method: 'GET'
      }
    }
  };
}

export function getRefferalsStaking(url) {
  return {
    type: SETTINGS.GET_REFFERALS_STAKING,
    payload: {
      client: 'default',
      request: {
        url: `/deposit/history/referal${url && url.length > 0 ? `?${url}` : ''}`,
        method: 'GET'
      }
    }
  };
}

export function sendPromocode(data) {
  return {
    type: SETTINGS.SEND_PROMOCODE,
    payload: {
      client: 'default',
      request: {
        url: `/users/promo/`,
        method: 'POST',
        data
      }
    }
  };
}
