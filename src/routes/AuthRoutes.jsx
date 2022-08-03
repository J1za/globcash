import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {authPath, rootAuthPath, rootMainPath} from './paths';
import {ForgotPassword, ResetPassword, SignIn, SignUp, Verification} from '../features/Auth';
import NotFound from '../shared/NotFound';

const AuthRoutes = () => {
  if (localStorage.token) return <Redirect to={rootMainPath} />;

  return (
    <Switch>
      <Redirect from={rootAuthPath} exact to={authPath.signIn} />
      <Route path={authPath.signIn} exact component={SignIn} />
      <Route path={authPath.signUp} exact component={SignUp} />
      <Route path={authPath.forgotPassword} exact component={ForgotPassword} />
      <Route path={authPath.resetPassword} exact component={ResetPassword} />
      <Route path={authPath.confirmation} exact component={Verification} />
      <Route path='*' component={NotFound} />
    </Switch>
  );
};

export default AuthRoutes;
