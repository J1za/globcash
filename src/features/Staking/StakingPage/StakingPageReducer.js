import {STAKING} from './StakingPageActionTypes';
import moment from 'moment';

const summ2Str = (first, second) => eval(`${first}${second[0] === '-' ? '' : '+'}${Number(second)}`);

const INITIAL_STATE = {
  transactions: {
    count: 10,
    result: [...Array(10).keys()].map((el) => {
      let str = `${el}`;
      return {
        amount: str,
        deposit_type: 'stake',
        time: new Date(),
        type: 'in'
      };
    })
  },
  transLoad: true,
  stakeHistory: {},
  FAQ: [],
  staking_desc: [],
  staking_desc_all: [],
  deposit_staking_info: {},
  transfer: [],
  staking_info: {},
  stakingPercents: {},
  date_week: moment().subtract(7, 'days').format('DD.MM.YY'),
  date_month: moment().subtract(1, 'month').format('DD.MM.YY'),
  stakingInvestCounter: 0,
  userStakings: [],
  loading: false
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case STAKING.GET_STAKING_PAGE_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        transactions: action.payload.data,
        date_week: moment().subtract(7, 'days').format('DD.MM.YY'),
        date_month: moment().subtract(1, 'month').format('DD.MM.YY'),
        transLoad: false
      };
    case STAKING.GET_FAQ_SUCCESS:
      return {
        ...state,
        FAQ: [
          ...action.payload.data.map((el) => ({
            summary: el.question,
            details: el.answer,
            id: el.id
          }))
        ]
      };
    case STAKING.GET_STAKING_DESC_SUCCESS:
      return {
        ...state,
        staking_desc: action.payload.data
      };
    case STAKING.GET_ALL_STAKING_DESC_SUCCESS:
      return {
        ...state,
        staking_desc_all: action.payload.data
      };
    case STAKING.GET_TRANSFER:
      return {
        ...state,
        transfer: []
      };
    case STAKING.GET_TRANSFER_SUCCESS:
      return {
        ...state,
        transfer: action.payload.data.result
      };
    case STAKING.GET_STAKING_ADD_SUCCESS:
      return {
        ...state,
        stakingInvestCounter: state.stakingInvestCounter + 1
      };
    case STAKING.GET_STAKING_INFO_SUCCESS:
      return {
        ...state,
        staking_info: action.payload.data.result
      };

    case STAKING.DEPOSIT_STAKING_INFO_SUCCESS:
      return {
        ...state,
        deposit_staking_info: action.payload.data.result
      };
    case STAKING.GET_STAKING_PERCENTS_SUCCESS:
      return {
        ...state,
        stakingPercents: action.payload.data.result
      };

    case STAKING.GET_USER_STAKINGS_SUCCESS:
      return {
        ...state,
        userStakings: action.payload.data
      };

    case STAKING.STAKING_WITHDRAW:
      return {
        ...state,
        loading: true
      };
    case STAKING.STAKING_WITHDRAW_SUCCESS:
      return {
        ...state,
        loading: false
      };

    case STAKING.GET_STAKING_HISTORY_SUCCESS:
      let {stakeInfo} = action.meta.previousAction,
        tempArr = [],
        i = 0,
        yCounter = 0,
        stakingChart = [];

      if (action.payload.data.length > 50 && stakeInfo.type !== 'stake' && stakeInfo.type !== 'invglbx') {
        let ArrSize = 50,
          subArrSize = Math.floor(action.payload.data.length / ArrSize);
        for (let i = 0; i < ArrSize; i++) {
          tempArr.push(action.payload.data.splice(0, subArrSize));
        }
        tempArr = tempArr.map((el) => ({
          ...el[el.length - 1],
          time: el[el.length - 1].time,
          amount: el.reduce((tempSum, el) => summ2Str(tempSum, el.amount), 0)
        }));
      } else {
        tempArr = action.payload.data;
      }

      stakingChart = tempArr
        .sort((a, b) => a.time - b.time)
        .map((el) => {
          if (el.type === 'fee') i = summ2Str(i, el.amount);
          yCounter = summ2Str(yCounter, el.amount);
          return {x: el.time * 1000, y: yCounter, value: el.amount};
        });

      return {
        ...state,
        stakeHistory: {
          ...state.stakeHistory,
          [stakeInfo.type]: {
            ...stakeInfo,
            growth: i,
            growthPercents: stakeInfo.balance + (i * 100) / i,
            body: stakeInfo.balance + i,
            chart: stakingChart
          }
        }
      };
    default:
      return state;
  }
}
