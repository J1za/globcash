import React, {useState} from 'react';
import './PasswordDialog.scss';
import {Controller, useForm} from 'react-hook-form';
import {toast} from 'react-toastify';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {postResetPassword} from '../../../Auth/authActions';
import {useDispatch} from 'react-redux';
import ButtonMUI from '../../../../shared/ButtonMUI';
import InputField from '../../../../shared/InputField';
import Strometer from 'react-password-strometer';

function PasswordDialog() {
  const dispatch = useDispatch();
  const [data, setData] = useState({old_password: null, repeat_password: null, new_password: null});
  const [stromeLevel, setStromeLevel] = useState(null);
  const [password, setPassword] = useState(null);

  const onSubmit = () => {
    dispatch(postResetPassword(data)).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 200) {
        toast.success('The password was successfully changed');
        reset();
      } else {
        Object.values(res.error.response.data)
          .flat()
          .forEach((el) => toast.error(el, {}));
      }
    });
  };

  const schema = yup.object({
    old_password: yup.string().required('Please Enter your password'),
    new_password: yup
      .string()
      .required('Please Enter your password')
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        'Must Contain minimum 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character'
      ),
    repeat_password: yup
      .string()
      .required('Repeat password is required')
      .oneOf([yup.ref('new_password'), null], 'Passwords must match')
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
    <form className='auth-box sign-up-box' onSubmit={handleSubmit(onSubmit)}>
      <h1 className='auth-box__title start mb-16'>Reset password</h1>
      <span className='auth-box__desc start'>Your new password must be different from previous used passwords!</span>

      <Controller
        name='old_password'
        control={control}
        render={({field}) => (
          <>
            <InputField
              className='mb-20'
              inputProps={field}
              error={errors.old_password?.message}
              label='Old password'
              placeholder='••••••••'
              name='old_password'
              typePassword
              onChange={(e) => {
                {
                  setData({...data, old_password: e.target.value});
                }
              }}
            />
          </>
        )}
      />

      <Strometer password={password}>
        {({passwordInfo}) => (
          <Controller
            name='new_password'
            control={control}
            render={({field}) => (
              <>
                <InputField
                  className='mb-10'
                  inputProps={field}
                  error={errors.new_password?.message}
                  label='New password'
                  placeholder='••••••••'
                  name='new_password'
                  typePassword
                  onChange={(e) => {
                    {
                      setData({...data, new_password: e.target.value});
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
              type='password'
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
        SAVE
      </ButtonMUI>
    </form>
  );
}

export default PasswordDialog;
