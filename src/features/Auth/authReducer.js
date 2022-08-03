import {AUTH} from './authActionTypes';

const INITIAL_STATE = {
  signInError: {},
  Verification: {},
  confirm_type: 'email_and_totp',
  security_token: 'test',
  is_signup_success: false
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case AUTH.SIGN_IN_FAIL:
    case AUTH.SIGN_IN_WITH_EMAIL_FAIL:
    case AUTH.PASSWORD_RECOVERY_FAIL:
    case AUTH.PASSWORD_RECOVERY_TOKEN_FAIL:
    case AUTH.PASSWORD_RESET_FAIL:
      return {...state, signInError: action};
    case AUTH.SIGN_UP_FAIL:
      return {...state, verificationError: action.error.response.data};
    case AUTH.VERIFICATION_FAIL:
      return {...state};
    case AUTH.SIGN_IN_SUCCESS:
      return {...state, ...action.payload.data};
    case AUTH.SIGN_UP_SUCCESS:
      return {...state, is_signup_success: true};
    case AUTH.SIGN_UP_FAIL:
      return {...state, signInError: action.payload.data.email};

    default:
      return state;
  }
}
