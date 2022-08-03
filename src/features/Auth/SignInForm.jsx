import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Link, useHistory} from 'react-router-dom';
import InputField from '../../shared/InputField';
import {toast} from 'react-toastify';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ButtonMUI from '../../shared/ButtonMUI';
import {authPath, rootMainPath} from '../../routes/paths';
import {postSignInWithEmail} from './authActions';

function SignInForm() {
  const dispatch = useDispatch();
  const history = useHistory();
  const onSubmit = () => {
    dispatch(postSignInWithEmail(data)).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 200) {
        localStorage.setItem('token', res.payload.data.token);
        localStorage.setItem('external_token', res.payload.data.external_token);
        history.push(rootMainPath);
        reset();
      } else {
        Object.values(res.error.response.data)
          .flat()
          .forEach((el) => toast.error(el, {}));
      }
    });
  };
  const [data, setData] = useState({email: null, password: null});
  const schema = yup.object({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().required('Password is required')
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: {errors, isValid},
    setValue
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    shouldFocusError: true,
    resolver: yupResolver(schema)
  });
  return (
    <form className='auth-box sign-up-box' onSubmit={handleSubmit(onSubmit)}>
      <div className='auth-box__text-line my-16'>
        <span>or using email</span>
      </div>
      <Controller
        name='email'
        control={control}
        render={({field}) => (
          <>
            <InputField
              className='mb-20'
              label='Email'
              error={errors.email?.message}
              placeholder='example@gmail.com'
              name='email'
              inputProps={field}
              type='email'
              onChange={(e) => {
                setData({...data, email: e.target.value});
              }}
            />
          </>
        )}
      />

      <Controller
        name='password'
        control={control}
        render={({field}) => (
          <>
            <InputField
              className='mb-32'
              label='Password'
              error={errors.password?.message}
              placeholder='••••••••'
              name='password'
              inputProps={field}
              typePassword
              onChange={(e) => {
                setData({...data, password: e.target.value});
              }}
            >
              <Link className='auth-box__input-link' to={authPath.forgotPassword}>
                Forgot password?
              </Link>
            </InputField>
          </>
        )}
      />

      <ButtonMUI formAction disabled={!isValid}>
        Sign in
      </ButtonMUI>
    </form>
  );
}

export default SignInForm;
