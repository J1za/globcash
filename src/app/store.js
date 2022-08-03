import {createBrowserHistory} from 'history';
import {routerMiddleware} from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';
import {applyMiddleware, createStore} from 'redux';
import {multiClientMiddleware} from 'redux-axios-middleware';
import rootReducer from './rootReducer';
import rootSaga from './rootSaga';
import axios from 'axios';
import {API_BASE_URL, API_SECOND_URL, API_BINANCE_URL, API_KRAKEN_URL, API_WS_URL} from '../config';

const api = {
  default: {
    client: axios.create({
      baseURL: API_BASE_URL,
      responseType: 'json'
    })
  },
  owlab: {
    client: axios.create({
      baseURL: API_SECOND_URL,
      responseType: 'json'
    })
  },
  binance: {
    client: axios.create({
      baseURL: API_BINANCE_URL,
      responseType: 'json'
    })
  },
  kraken: {
    client: axios.create({
      baseURL: API_KRAKEN_URL,
      responseType: 'json'
    })
  }
};

const axiosMiddlewareOptions = {
  interceptors: {
    request: [
      (action, config) => {
        if (config.baseURL !== API_BINANCE_URL && config.baseURL !== API_KRAKEN_URL) {
          if (config.baseURL === API_WS_URL) {
            config.headers['authorization'] = 'Token 71928d580b7625593f7f20ed9f982d2991d';
          } else if (localStorage.token || localStorage.token_res) {
            let token = localStorage.getItem('token');
            let external_token = localStorage.getItem('external_token');
            if (config.baseURL === API_BASE_URL) {
              config.headers['Authorization'] = 'Bearer ' + external_token;
            } else {
              if (
                
                config.url === '/portfolio/transaction/' ||
                config.url === '/portfolio/statistic/' ||
                config.url === '/portfolio/currency/buy/' ||
                (config.reduxSourceAction.external_token && config.reduxSourceAction.external_token)
              ) {
                config.headers = {
                  ...config.headers,
                  Authorization: 'Token ' + token,
                  'external-token': external_token
                };
              } else {
                config.headers['Authorization'] = 'Token ' + token;
              }
            }
          }
        }
        return config;
      }
    ],
    response: [
      {
        success: ({dispatch}, response) => {
          return response;
        },
        error: ({dispatch}, error) => {
          //console.log(error)
          if (error.response.status === 401) {
            localStorage.clear();
          }
          /* if (error) {
            localStorage.clear();
          } */
          return Promise.reject(error);
        }
      }
    ]
  }
};

export const history = createBrowserHistory();

export const setupStore = () => {
  const appRouterMiddleware = routerMiddleware(history);
  const sagaMiddleware = createSagaMiddleware();

  const createStoreWithMiddleware = applyMiddleware(
    multiClientMiddleware(api, axiosMiddlewareOptions),
    appRouterMiddleware,
    sagaMiddleware
  )(createStore);

  const store = createStoreWithMiddleware(
    rootReducer(history),
    {},
    window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : (f) => f
  );

  sagaMiddleware.run(rootSaga);

  return store;
};
