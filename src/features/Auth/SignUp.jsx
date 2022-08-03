import React, {useState, useEffect} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {authPath} from '../../routes/paths';
import ButtonMUI from '../../shared/ButtonMUI';
import InputField from '../../shared/InputField';
import userCard from '../../assets/images/user-card.png';
import {postSignUp} from './authActions';
import {useDispatch, useSelector} from 'react-redux';
import {TG_BOT_NAME} from '../../config.js';
import {Controller, useForm} from 'react-hook-form';
import {TLoginButton, TLoginButtonSize} from 'react-telegram-auth';
import {toast} from 'react-toastify';
import {yupResolver} from '@hookform/resolvers/yup';
import avatar from '../../assets/images/ada.svg';
import * as yup from 'yup';
import Strometer from 'react-password-strometer';

const SignUp = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [signUp, setSignUp] = useState(null);
  const [stromeLevel, setStromeLevel] = useState(null);
  const [password, setPassword] = useState(null);
  const signUpUser = () => setSignUp(true);
  const closePage = () => {
    history.push(authPath.signIn);
  };

  const [telegramData, setTelegramData] = useState(null);

  const [data, setData] = useState({
    email: null,
    fullname: null,
    password: null,
    repeat_password: null,
    telegram_id: Math.floor(Math.random() * 1000000000) + 2
  });
  const [nextStep, setNextStep] = useState(false);

  const onSubmit = () => {
    dispatch(
      postSignUp({
        email: sessionStorage.getItem('email'),
        fullname: sessionStorage.getItem('fullname'),
        password: sessionStorage.getItem('password'),
        telegram_id: data.telegram_id
      })
    ).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 200) {
        setNextStep(true);
        reset();
      } else {
        Object.values(res.error.response.data)
          .flat()
          .forEach((el) => toast.error(el, {}));
      }
    });
  };

  const schema = yup.object({
    email: yup.string().email('Invalid email').required('Field is required'),
    fullname: yup.string().required('Full Name is required'),
    password: yup
      .string()
      .required('Please Enter your password')
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        'Must Contain minimum 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character'
      ),
    repeat_password: yup
      .string()
      .required('Repeat password is required')
      .oneOf([yup.ref('password'), null], 'Passwords must match')
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: {errors, isValid}
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    shouldFocusError: true,
    resolver: yupResolver(schema)
  });

  const handleTelegramResponse = (response) => {
    setTelegramData(response);
    setData({...data, telegram_id: response.id});
  };

  return (
    <form className='auth-box sign-up-box' onSubmit={handleSubmit(onSubmit)}>
      {!nextStep && (
        <>
          <h1 className='auth-box__title mb-40'>Sign up</h1>

          <Controller
            name='email'
            control={control}
            render={({field}) => (
              <>
                <InputField
                  className='mb-20'
                  label='Email'
                  name='email'
                  placeholder='example@gmail.com'
                  inputProps={field}
                  error={errors.email?.message}
                  type='email'
                  onChange={(e) => {
                    setData({...data, email: e.target.value});
                    sessionStorage.setItem('email', e.target.value);
                  }}
                />
              </>
            )}
          />

          <Controller
            name='fullname'
            control={control}
            render={({field}) => (
              <>
                <InputField
                  className='mb-20'
                  label='Full name'
                  name='fullname'
                  placeholder='New User'
                  inputProps={field}
                  error={errors.fullname?.message}
                  type='text'
                  onChange={(e) => {
                    setData({...data, fullname: e.target.value});
                    sessionStorage.setItem('fullname', e.target.value);
                  }}
                />
              </>
            )}
          />
          {telegramData === null ? (
            <>
              <span className='input-field__label'>Telegram ID (optional)</span>
              <div className='auth-box__tg-signup '>
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
              </div>
              <p className='auth-box__text-small mb-20'>
                *Pass the telegram id to use the web version and the telegram bot from one account.
              </p>
            </>
          ) : (
            <>
              <div className='telegram-block'>
                <div className='telegram-block__container'>
                  <img
                    className='telegram-block__img'
                    src={telegramData && telegramData.photo_url && telegramData.photo_url}
                    alt='avatar'
                  />
                  <div className='telegram-block__txtBlock'>
                    <p className='telegram-block__name'>
                      {telegramData && telegramData.first_name && telegramData.first_name}
                      {telegramData && telegramData.last_name && telegramData.last_name}
                    </p>
                    <p className='telegram-block__id'>ID: {telegramData && telegramData.id && telegramData.id}</p>
                  </div>
                </div>

                <button onClick={() => setTelegramData(null)} type='button' className='telegram-block__btn'>
                  Cancel
                </button>
              </div>
              <p className='auth-box__text-small mb-20'>
                *Pass the telegram id to use the web version and the telegram bot from one account.
              </p>
            </>
          )}

          <Strometer password={password}>
            {({passwordInfo}) => (
              <>
                <Controller
                  name='password'
                  control={control}
                  render={({field}) => (
                    <>
                      <InputField
                        className='mb-10'
                        label='Password'
                        placeholder='••••••••'
                        typePassword
                        inputProps={field}
                        error={errors.password?.message}
                        onChange={(e) => {
                          setData({...data, password: e.target.value});
                          setPassword(e.target.value);
                          sessionStorage.setItem('password', e.target.value);
                          setStromeLevel(passwordInfo && passwordInfo.score && passwordInfo.score);
                        }}
                      />
                    </>
                  )}
                />
              </>
            )}
          </Strometer>

          {stromeLevel !== null && (
            <div className='password-strength'>
              <ul
                className={
                  stromeLevel === 0
                    ? 'password-strength-bar'
                    : stromeLevel === 1
                    ? 'password-strength-bar weak'
                    : stromeLevel === 2
                    ? 'password-strength-bar low'
                    : stromeLevel === 3
                    ? 'password-strength-bar okay'
                    : stromeLevel === 4
                    ? 'password-strength-bar strong'
                    : 'password-strength-bar'
                }
              >
                <li className='password-strength-item'></li>
                <li className='password-strength-item'></li>
                <li className='password-strength-item'></li>
                <li className='password-strength-item'></li>
                <li className='password-strength-item'></li>
              </ul>
              <p className='password-strength-level'>
                {stromeLevel === 0
                  ? 'Lowest'
                  : stromeLevel === 1
                  ? 'Weak'
                  : stromeLevel === 2
                  ? 'Low'
                  : stromeLevel === 3
                  ? 'Okay'
                  : 'Strong'}
              </p>
            </div>
          )}

          <Controller
            name='repeat_password'
            control={control}
            render={({field}) => (
              <>
                <InputField
                  className='auth-box__input mb-32'
                  label='Repeat password'
                  placeholder='••••••••'
                  name='repeat_password'
                  inputProps={field}
                  error={errors.repeat_password?.message}
                  typePassword
                  onChange={(e) => {
                    setData({...data, repeat_password: e.target.value});
                  }}
                />
              </>
            )}
          />

          <small className='auth-box__text-small mb-20'>
            By selecting Sign up, I agree to{' '}
            <a href='#' target='_blank'>
              Terms of Service
            </a>{' '}
            and acknowledge the{' '}
            <a href='#' target='_blank'>
              Privacy Policy
            </a>
            .
          </small>
          {/* </><ButtonMUI formAction onClick={signUpUser}> */}
          <ButtonMUI formAction disabled={!isValid}>
            Sign up
          </ButtonMUI>
          <div className='auth-box__text-line auth-box__only-desk mt-16 mb-12'>
            <span>Already a member?</span>
          </div>
          <span className='auth-box__text-center auth-box__only-desk'>
            <Link to={authPath.signIn}>Sign in</Link> using a registered account data
          </span>
          <span className='auth-box__text-center auth-box__only-mob mt-16'>
            Already have an account? <Link to={authPath.signIn}>Sign in</Link>
          </span>
        </>
      )}

      {nextStep && (
        <>
          <h1 className='auth-box__title mb-40'>Congratulations!</h1>
          <img
            className='auth-box__img mb-32 mx-auto'
            src={userCard}
            alt='User card image'
            width='109px'
            height='135px'
          />
          <span className='auth-box__subtitle mb-16'>Welcome to globix web client</span>
          <span className='auth-box__desc mb-40 max-w-230'>
            We have sent you a link to email. Please confirm your account .
          </span>
          <ButtonMUI variant='outlined' onClick={closePage}>
            Ok
          </ButtonMUI>
        </>
      )}
    </form>
  );
};

export default SignUp;
