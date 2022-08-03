import {DASHBOARD_ACTIVITY} from './notifyActionTypes';

const INITIAL_STATE = {
  notifications: {},
  loading: true
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case DASHBOARD_ACTIVITY.GET_NOTIFICATIONS_SUCCESS:
      //action.meta.previousAction.notifyPage
      let obj = {
        ...state,
        loading: false,
        notifications: state.notifications.hasOwnProperty('results')
          ? {
              ...state.notifications,
              count: action.payload.data.count,
              results: [...state.notifications.results]
            }
          : {
              ...state.notifications,
              count: action.payload.data.count,
              results: []
            }
      };

      if (action.meta.previousAction.notifyPage) {
        if (action.meta.previousAction.isPoling) {
          //let tempArr = [...action.payload.data.results.reverse()];
          let tempArr = [...action.payload.data.results];

          /* if (tempArr.findIndex(el => obj.notifications.results.every(elem => elem.id !== el.id)) !== -1) {
            let findedIndex = tempArr.findIndex(el => obj.notifications.results.every(elem => elem.id !== el.id))

            tempArr[findedIndex]['unread'] = true;
          } */
          obj.notifications.results = [...tempArr];
        } else {
          //obj.notifications.results.unshift(...action.payload.data.results.reverse())
          obj.notifications.results.push(...action.payload.data.results);
        }
      } else {
        obj.notifications.results = [...obj.notifications.results, ...action.payload.data.results];
      }

      return {...obj};

    case DASHBOARD_ACTIVITY.DELETE_NOTIFICATIONS:
      state.notifications.results.splice(action.payload.index, 1);
      return {
        ...state,
        notifications: {
          ...state.notifications,
          count: state.notifications.count - 1,
          results: [...state.notifications.results]
        }
      };
    case `@@router/LOCATION_CHANGE`:
      return {
        ...state,
        notifications: {},
        loading: true
      };
    default:
      return state;
  }
}
