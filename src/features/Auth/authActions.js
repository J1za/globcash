import {AUTH} from './authActionTypes';

export function postSignIn(data) {
  return {
    type: AUTH.SIGN_IN,
    payload: {
      client: 'owlab',
      request: {
        url: `/telegram/login/`,
        method: 'POST',
        data
      }
    }
  };
}

export function postVerification(data) {
  return {
    type: AUTH.VERIFICATION,
    payload: {
      client: 'default',
      request: {
        url: `verification/`,
        method: 'post',
        data
      }
    }
  };
}

export function postSignUp(data) {
  return {
    type: AUTH.SIGN_UP,
    payload: {
      client: 'owlab',
      request: {
        url: `/auth/email/signup/`,
        method: 'POST',
        data
      }
    }
  };
}

export function postSignInWithEmail(data) {
  return {
    type: AUTH.SIGN_IN_WITH_EMAIL,
    payload: {
      client: 'owlab',
      request: {
        url: `/auth/email/signin/`,
        method: 'POST',
        data
      }
    }
  };
}

export function postPasswordRecovery(data) {
  return {
    type: AUTH.PASSWORD_RECOVERY,
    payload: {
      client: 'owlab',
      request: {
        url: `/auth/email/password-recovery/send-email/`,
        method: 'POST',
        data
      }
    }
  };
}

export function postPasswordRecoveryTOKEN(data) {
  return {
    type: AUTH.PASSWORD_RECOVERY_TOKEN,
    payload: {
      client: 'owlab',
      request: {
        url: `/auth/email/password-recovery/`,
        method: 'POST',
        data
      }
    }
  };
}

export function postResetPassword(data) {
  return {
    type: AUTH.PASSWORD_RESET,
    payload: {
      client: 'owlab',
      request: {
        url: `/change-password/`,
        method: 'POST',
        data
      }
    }
  };
}

export function userActivationByToken(data) {
  return {
    type: AUTH.USER_ACTIVATION,
    payload: {
      client: 'owlab',
      request: {
        url: `/auth/email/user-activation/`,
        method: 'POST',
        data
      }
    }
  };
}
