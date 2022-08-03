import React, { Suspense, lazy, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
const AuthContainer = lazy(() => import('../containers/AuthContainer'));
const MainContainer = lazy(() => import('../containers/MainContainer'));
const StubPage = lazy(() => import('../features/StubPage/StubPage'));
/* import AuthContainer from '../containers/AuthContainer';
import MainContainer from '../containers/MainContainer'; 
import StubPage from '../features/StubPage/StubPage'; */
import { rootMainPath, rootAuthPath } from './paths';

import { ToastContainer, toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { notifyError, notifySuccess } from '../helpers/notifySnack';
import { PropagateLoader } from 'react-spinners';

export const FallbackElement = () => {
  const fallbackStyles = {
    display: 'flex',
    flex: '1',
    alignItems: 'center',
    justifyContent: 'center'
  };
  return <div style={fallbackStyles}>
    <PropagateLoader color={'#3579FC'} />
  </div>
}

const AppRoutes = () => {
  toast.configure();

  const { errorSnack, errorSnackText, successSnack, successSnackText } = useSelector(({ app }) => app);

  useEffect(() => {
    if (errorSnack) {
      notifyError(errorSnackText);
    }
  }, [errorSnack]);

  useEffect(() => {
    if (successSnack) {
      notifySuccess(successSnackText);
    }
  }, [successSnack]);

  return (
    <Suspense fallback={<FallbackElement />}>
      <ToastContainer />
      <Switch>
        <Route
          path='/'
          exact
          render={() => (localStorage.token ? <Redirect to={rootMainPath} /> : <Route path='/' component={StubPage} />)}
        />
        {/* <Route path='/' component={StubPage} /> */}
        <Route path={rootAuthPath} component={AuthContainer} />
        <Route path={rootMainPath} component={MainContainer} />
      </Switch>
    </Suspense>
  );
};

export default AppRoutes;
