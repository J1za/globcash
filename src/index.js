import React from 'react';
import { render } from 'react-dom';
import { Provider, ReactReduxContext } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { setupStore, history } from './app/store';
import { StylesProvider } from '@material-ui/core';
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import App from './app/App';
import { GlobixFixed } from './helpers/functions';

Sentry.init({
  dsn: "https://8ab469ad2d9b4bce8b596129edc42e4b@sentry.4-com.pro/24",
  autoSessionTracking: true,
  integrations: [
    new Integrations.BrowserTracing(),
  ],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

const store = setupStore();

render(
  <Provider store={store} context={ReactReduxContext}>
    <StylesProvider injectFirst>
      <App history={history} context={ReactReduxContext} />
    </StylesProvider>
  </Provider>,
  document.getElementById('root'),
);
