import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { TLoginButton, TLoginButtonSize } from 'react-telegram-auth';
import CircularProgress from '@material-ui/core/CircularProgress';
import { authPath, rootMainPath } from '../../routes/paths';
import { postSignIn, userActivationByToken } from './authActions';
import ButtonMUI from '../../shared/ButtonMUI';
import SignInForm from './SignInForm';
import { TG_BOT_NAME } from '../../config.js';
import InputField from '../../shared/InputField';
import { toast } from 'react-toastify';

const SignIn = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const params = new URLSearchParams(history.location.search);
  const from_mobile = params.get('from_mobile');
  const isFromMobile = !!from_mobile && from_mobile === 'true';

  const query = params.get('security_token');
  const security_token = query?.split('=')[1];

  const { buttonLoading } = useSelector(({ app }) => app);
  const { signInError } = useSelector(({ auth }) => auth);
  const [error, setError] = useState({
    status: false,
    text: ''
  });
  const [loading, setLoad] = useState(false);

  const clearError = () => {
    setError({
      status: false,
      text: ''
    });
  };

  useEffect(() => {
    localStorage.getItem('token') && localStorage.getItem('external_token') && history.push(rootMainPath);
    security_token &&
      dispatch(userActivationByToken({ security_token: security_token })).then((res) => {
        if ((res.payload && res.payload.status && res.payload.status === 200) || res.payload.status === 201) {
          toast.success('Your account was activated!');
        } else {
          Object.values(res.error.response.data)
            .flat()
            .forEach((el) => toast.error(el, {}));
        }
      });
  }, []);

  const handleTelegramResponse = (response) => {
    if (isFromMobile) {
      window.open(`${window.location.href}&${Object.keys(response).map(el => `${el}=${response[el]}`).join('&')}`, '_self');
      /* history.push({
        pathname: history.location.pathname,
        search: `${history.location.search}&id=${response.id}`
      }) */
    } else {
      setLoad(true);
      return dispatch(postSignIn(response)).then((res) => {
        if (res.payload && res.payload.status && res.payload.status === 200) {
          clearError();
          if (res.payload.data.security_token) {
            /* localStorage.setItem('security_token', res.payload.data.security_token);
            localStorage.setItem('external_token', res.payload.data.external_token); */
            history.push(authPath.confirmation);
          } else {
            localStorage.setItem('token', res.payload.data.token);
            localStorage.setItem('external_token', res.payload.data.external_token);
            history.push(rootMainPath);
          }
        } else if (res.error.response.status === 401) {
          setError({
            status: true,
            text: 'Account not verified by administrator'
          });
        } else if (res.error.response.status === 403) {
          setError({
            status: true,
            text: 'You do not have authorization rights'
          });
        } else {
          setError({
            status: true,
            text: 'Unknown error'
          });
        }
        setLoad(false);
      });
    }
  };

  return (
    <div className='auth-box sign-in-box'>
      {!isFromMobile && <h1 className='auth-box__title mb-40'>Welcome Back</h1>}
      <div className='auth-box__tg-auth'>
        <TLoginButton
          botName={TG_BOT_NAME}
          buttonSize={TLoginButtonSize.Large}
          lang='en'
          usePic={false}
          cornerRadius={4}
          onAuthCallback={(user) => {
            handleTelegramResponse(user);
          }}
          requestAccess={'write'}
        />
        {loading ? (
          <div className='load-wrapper'>
            <CircularProgress size={24} color='inherit' />
          </div>
        ) : error.status ? (
          <>
            <span className='error'>{error.text}</span>
          </>
        ) : null}
      </div>
      {!isFromMobile && <>
        <SignInForm />
        <div className='auth-box__text-line auth-box__only-desk mt-16 mb-12'>
          <span>Not a member?</span>
        </div>
        <span className='auth-box__text-center auth-box__only-desk'>
          <Link to={authPath.signUp}>Join</Link> to unlock the best of Globix Cash
        </span>
        <span className='auth-box__text-center auth-box__only-mob mt-16'>
          Not a member? <Link to={authPath.signUp}>Join now</Link>
        </span>
      </>}
    </div>
  );
};

export default SignIn;
