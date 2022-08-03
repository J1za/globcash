import { NEWS } from './newsActionTypes';

const INITIAL_STATE = {

  main_three: {},
  main_threeLoad: true,

  news_type: {},
  news_typeLoad: true,

  news: {},
  newsLoad: true,

  popular: {},
  popularLoad: true,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case NEWS.GET_MAIN_THREE_SUCCESS:
      return {
        ...state,
        main_three: action.payload.data,
        main_threeLoad: false
      };
    case NEWS.GET_NEWS_TYPE_SUCCESS:
      return {
        ...state,
        news_type: action.payload.data,
        news_typeLoad: false
      };

    case NEWS.GET_NEWS_SUCCESS:
      return {
        ...state,
        news: action.payload.data,
        newsLoad: false
      };

    case NEWS.GET_POPULARITY_SUCCESS:
      let obj = {
        ...state,
        popularLoad: false,
        popular: state.popular.hasOwnProperty('results')
          ? {
            ...state.popular,
            count: action.payload.data.count,
            results: [...state.popular.results, ...action.payload.data.results]
          }
          :
          {
            ...state.popular,
            count: action.payload.data.count,
            results: [...action.payload.data.results]
          }
      };

      return { ...obj };

    default:
      return state;
  }
}
