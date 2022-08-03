import React from 'react';
import ErrorBoundary from '../shared/ErrorBoundary';
import AppRoutes from '../routes/AppRoutes';

import 'react-toastify/dist/ReactToastify.css';
import '../assets/styles/main.scss';
import { ConnectedRouter } from 'connected-react-router';

const App = ({ history, context }) => {
  return (
    <ErrorBoundary>
      <ConnectedRouter history={history} context={context}>
        <AppRoutes />
      </ConnectedRouter>
    </ErrorBoundary>
  );
};

export default App;
