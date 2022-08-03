import { SETTINGS } from './settingsActionTypes';

const INITIAL_STATE = {
  KYC: {
    telegram_id: null,
    username: '',
    passport_file: false,
    address_file: false,
    id_card_file: false,
    wealth_file: false,
    qr_data: {}
  },
  refferals: {
    refferals_list: {},
    accruals: {},
    staking: {}
  }
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SETTINGS.SET_FILES_KYC_SUCCESS:
    case SETTINGS.GET_FILES_KYC_SUCCESS:
      return { ...state, KYC: action.payload.data };

    case SETTINGS.GET_QRSECRET_SUCCESS: {
      return { ...state, qr_data: action.payload.data };
    }

    case SETTINGS.GET_REFFERALS_STAKING_SUCCESS:
      const noStaking = ({ data, ...rest }) => rest

      let tempObj = {
        accruals: {
          ...action.payload.data.result.data
        },
        staking: {
          ...noStaking(action.payload.data.result)
        }
      }

      return {
        ...state,
        refferals: {
          ...state.refferals,
          ...tempObj
        }
      };

    case SETTINGS.GET_REFFERALS_SUCCESS:
      return {
        ...state,
        refferals: {
          ...state.refferals,
          refferals_list: action.payload.data.result.data
        }
      };

    /* case SETTINGS.GET_REFFERALS_ACCRUALS_SUCCESS:
      console.log(action.payload.data)

      return {
        ...state,
        refferals: {
          ...state.refferals,
          accruals: action.payload.data
        }
      }; */


    default:
      return state;
  }
}
