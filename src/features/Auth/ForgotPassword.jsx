import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import InputField from '../../shared/InputField';
import ButtonMUI from '../../shared/ButtonMUI';
import {Link, useHistory} from 'react-router-dom';
import {authPath} from '../../routes/paths';
import envelopeImg from '../../assets/images/envelope.png';
import {ReactComponent as ClockIcon} from '../../assets/icons/clock-red.svg';
import {Controller, useForm} from 'react-hook-form';
import {toast} from 'react-toastify';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {postPasswordRecovery} from './authActions';

const ForgotPassword = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [nextStep, setNextStep] = useState(false);
  const [data, setData] = useState({email: null});
  const closePage = () => history.push(authPath.signIn);

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
    email: yup.string().email('Invalid email').required('Email is required')
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
    <div className='auth-box forgot-pass-box'>
      {!nextStep && (
        <form className='auth-box sign-up-box' onSubmit={handleSubmit(onSubmit)}>
          <h1 className='auth-box__title mb-16'>Forgot password</h1>
          <span className='auth-box__desc mb-32 max-w-300'>
            No problem. Just enter your email address below and we’ll send you a link to reset it.
          </span>

          <Controller
            name='email'
            control={control}
            render={({field}) => (
              <>
                <InputField
                  className='mb-32'
                  label='Email'
                  error={errors.email?.message}
                  placeholder='example@gmail.com'
                  inputProps={field}
                  name='email'
                  type='email'
                  onChange={(e) => {
                    {
                      setData({...data, email: e.target.value});
                      localStorage.setItem('email', e.target.value);
                    }
                  }}
                />
              </>
            )}
          />

          <ButtonMUI className='auth-box__btn' formAction disabled={!isValid}>
            Send link
          </ButtonMUI>
          <hr className='auth-box__divider auth-box__only-desk mt-30' />
          <span className='auth-box__text-center mt-16'>
            Did you remember your password? <Link to={authPath.signIn}>Sign in</Link>
          </span>
        </form>
      )}

      {nextStep && (
        <>
          <h1 className='auth-box__title mb-40'>The email was sent</h1>
          <img
            className='auth-box__img mb-24 mx-auto'
            src={envelopeImg}
            alt='Envelope image'
            width='120px'
            height='112px'
          />
          <div className='auth-box__speech-wrap mb-32'>
            <p>
              <b>1.</b> Check mailbox <b>{data.email}</b>.
            </p>
            <p>
              <b>2.</b> Click the link in the email to reset your password.
            </p>
            <span>
              <b>P.S.</b> This link will be valid for <ClockIcon /> 12 hours
            </span>
          </div>
          <ButtonMUI variant='outlined' onClick={closePage}>
            Ok
          </ButtonMUI>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
