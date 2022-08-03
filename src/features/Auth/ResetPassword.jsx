import React, {useState} from 'react';
import InputField from '../../shared/InputField';
import ButtonMUI from '../../shared/ButtonMUI';
import {useHistory} from 'react-router-dom';
import {authPath} from '../../routes/paths';
import lockImg from '../../assets/images/lock.png';
import {Controller, useForm} from 'react-hook-form';
import {toast} from 'react-toastify';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {postPasswordRecovery} from './authActions';
import {useDispatch} from 'react-redux';
import Strometer from 'react-password-strometer';

const ResetPassword = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [confirm, setConfirm] = useState(false);
  const confirmPassword = () => setConfirm(true);
  const closePage = () => history.push(authPath.signIn);
  const userEmail = localStorage.getItem('email');
  const [nextStep, setNextStep] = useState(false);
  const [data, setData] = useState({password: null, repeat_password: null, email: userEmail});
  const [stromeLevel, setStromeLevel] = useState(null);
  const [password, setPassword] = useState(null);

  const onSubmit = () => {
    dispatch(postPasswordRecovery(data)).then((res) => {
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

  return (
    <div className='auth-box reset-pass-box'>
      {!nextStep && (
        <form className='auth-box sign-up-box' onSubmit={handleSubmit(onSubmit)}>
          <h1 className='auth-box__title mb-16'>Reset password</h1>
          <span className='auth-box__desc mb-40 max-w-300'>
            Please choose a new account password for <b>{userEmail ? userEmail : 'current account'}</b>
          </span>

          <Strometer password={password}>
            {({passwordInfo}) => (
              <Controller
                name='password'
                control={control}
                render={({field}) => (
                  <>
                    <InputField
                      className='mb-10'
                      inputProps={field}
                      error={errors.password?.message}
                      label='New password'
                      placeholder='••••••••'
                      name='new_password'
                      typePassword
                      onChange={(e) => {
                        {
                          setData({...data, password: e.target.value});
                          setPassword(e.target.value);
                          setStromeLevel(passwordInfo && passwordInfo.score && passwordInfo.score);
                        }
                      }}
                    />
                  </>
                )}
              />
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
                    {
                      setData({...data, repeat_password: e.target.value});
                    }
                  }}
                />
              </>
            )}
          />

          <ButtonMUI formAction disabled={!isValid}>
            Confirm
          </ButtonMUI>
        </form>
      )}

      {nextStep && (
        <>
          <h1 className='auth-box__title mb-40'>Password has been changed</h1>
          <img className='auth-box__img mb-8 mx-auto' src={lockImg} alt='Envelope image' width='164px' height='142px' />
          <span className='auth-box__desc mb-48 max-w-300'>
            Your new password have been set successfully. Now you can sign in.
          </span>
          <ButtonMUI className='auth-box__btn' onClick={closePage}>
            Sign in
          </ButtonMUI>
        </>
      )}
    </div>
  );
};

export default ResetPassword;
