import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAvatar, removeAvatar } from '../../../layout/Header/headerActions';
import { validateImage } from '../../../helpers/functions';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ButtonMUI from '../../../shared/ButtonMUI';
import InputMUI from '../../../shared/InputMUI';
import VerificationDialog from './VerificationDialog/VerificationDialog';
import { ReactComponent as VerificationIcon } from '../../../assets/images/verification.svg';
import { ReactComponent as WarningIcon } from '../../../assets/images/warning.svg';
import { ReactComponent as TrueIcon } from '../../../assets/images/true.svg';
import { ReactComponent as FalseIcon } from '../../../assets/images/close_red.svg';
import { ReactComponent as TrueVer } from '../../../assets/images/ver.svg';
import { ReactComponent as FalseVer } from '../../../assets/images/not_ver.svg';
import './Personal.scss';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { notifySuccess } from '../../../helpers/notifySnack';

const Vurify = ({ status }) => (
  <span className={`verify ${status}`}>
    {status ? <TrueVer /> : <FalseVer />}
    {status ? 'Verified' : 'Not verified'}
  </span>
);

function Personal() {
  const [file, setFile] = useState({ logo: null, newLogoFile: null });
  const [typeFileError, setTypeFileError] = useState();
  const [dialogVerification, setDialogVerification] = useState(false);
  const [buttonLoad, setButtonLoad] = useState(false);
  const dispatch = useDispatch();

  const {
    header: {
      userInfo: { first_name, last_name, t_photo_url, email, avatar, verified, white_wallet_address }
    },
    settings: {
      KYC: { telegram_id, username, passport_file, address_file, id_card_file, wealth_file }
    }
  } = useSelector(({ header, settings }) => ({ header, settings }));

  const handleFile = (e) => {
    e.persist();

    let file = e.target.files[0];
    if (file) {
      if (!validateImage(file)) {
        setTypeFileError();
      } else {
        const newUrl = URL.createObjectURL(file);
        setTypeFileError({
          logo: newUrl.toString(),
          newLogoFile: file
        });

        const data = new FormData();
        data.append('avatar', file);
        dispatch(setAvatar(data));
      }
    }
  };

  const clearFile = () => {
    setFile({
      logo: undefined,
      newLogoFile: undefined
    });
    document.getElementById('file-input').value = '';

    dispatch(removeAvatar(null));
  };

  const toggleDialogVerification = () => {
    setDialogVerification(!dialogVerification);
  };

  const onSubmit = (data) => {
    setButtonLoad(true);
    dispatch(setAvatar(data))
      .then((res) => {
        if (res.payload && res.payload.status && res.payload.status === 200) {
          reset();
          notifySuccess('Personal info has been changed');
        } else {
          Object.values(res.error.response.data)
            .flat()
            .forEach((el) => toast.error(el, {}));
        }
      })
      .then(() => {
        setButtonLoad(false);
      });
  };

  const schema = yup.object({
    email: yup.string().email('Invalid email').required('Field is required'),
    white_wallet_address: yup.string()
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid },
    setValue
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    reset();
    if (window.location.hash) {
      document.querySelector(window.location.hash.replace('#', '.')).scrollIntoView({ block: "center", behavior: "smooth" })
    }
  }, []);

  useEffect(() => {
    setValue('first_name', first_name);
    setValue('last_name', last_name);
    setValue('email', email);
    setValue('white_wallet_address', white_wallet_address);
  }, [first_name, last_name, email, white_wallet_address]);

  return (
    <div className='personal_block '>
      <div className='title_page'>Settings</div>
      <div className='personal card-wrap'>
        <div className='title'>
          Personal settings
          <Vurify status={verified} />
        </div>
        <div className='download_wrapper_file'>
          <div>
            {avatar ? (
              <div className='btn_file'>
                <img src={avatar} alt='open_icon' />
              </div>
            ) : (
              <>
                {t_photo_url ? (
                  <div className='btn_file'>
                    <img src={t_photo_url} alt='open_icon' />
                  </div>
                ) : (
                  <div className='avatar'>
                    <p>
                      {first_name && first_name[0] ? first_name[0] : ''}
                      {last_name && last_name[0] ? last_name[0] : ''}
                    </p>
                  </div>
                )}
              </>
            )}
            <div className='btn_controller'>
              <div>
                <div className='pulse'>
                  <div>Add photo</div>
                  <input
                    className='file-input'
                    id='file-input'
                    type='file'
                    onChange={(e) => handleFile(e)}
                    accept='image/*'
                  />
                </div>

                {avatar ? <button onClick={clearFile}>Remove</button> : null}
              </div>
              <p>Max size of image - 2mb</p>
            </div>
          </div>

          <form className='user_form' onSubmit={handleSubmit(onSubmit)}>
            <div>
              <div className='block'>
                <span>First name</span>
                <Controller
                  name='first_name'
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputMUI
                        className='auth-box__input'
                        type='text'
                        fullWidth
                        error={errors.first_name?.message}
                        inputProps={field}
                      />
                    </>
                  )}
                />
              </div>
              <div className='block'>
                <span>Last name</span>
                <Controller
                  name='last_name'
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputMUI
                        className='auth-box__input'
                        type='text'
                        fullWidth
                        error={errors.last_name?.message}
                        inputProps={field}
                      />
                    </>
                  )}
                />
              </div>
            </div>
            {email === '' || email === null ? (
              <div className='info_mail'>Please link your email to your account.</div>
            ) : null}
            <div className='next_block'>
              <div className='block '>
                <span>Email</span>
                <Controller
                  name='email'
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputMUI
                        className='auth-box__input'
                        type='email'
                        fullWidth
                        error={errors.email?.message}
                        placeholder='Enter email'
                        inputProps={field}
                      />
                    </>
                  )}
                />
              </div>
            </div>
            <div className='next_block last'>
              <div className='block '>
                <span>White wallet address</span>
                <Controller
                  name='white_wallet_address'
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputMUI
                        className='auth-box__input'
                        type='text'
                        fullWidth
                        error={errors.white_wallet_address?.message}
                        placeholder='Enter wallet address'
                        inputProps={field}
                      />
                    </>
                  )}
                />
              </div>
            </div>
            <div className='btn'>
              <ButtonMUI loading={buttonLoad} disabled={!isValid} formAction>
                Save
              </ButtonMUI>
            </div>
          </form>
        </div>

        <div className='verification'>
          <div>
            <div>
              <VerificationIcon />
              <div>
                <span>KYC verification</span>
                <p>Proof of identity by providing official documents for maximum protection.</p>
              </div>
            </div>
            <button className='pulse' onClick={toggleDialogVerification}>
              Increase protection
            </button>
          </div>

          {wealth_file || id_card_file || address_file || passport_file ? (
            <p className='status'>
              <p>
                {!!passport_file === true ? (
                  <span>
                    <TrueIcon />
                    Passport
                  </span>
                ) : (
                  <span>
                    <FalseIcon />
                    Passport
                  </span>
                )}
                {!!id_card_file === true ? (
                  <span>
                    <TrueIcon />
                    ID card
                  </span>
                ) : (
                  <span>
                    <FalseIcon />
                    ID card
                  </span>
                )}
                {!!address_file === true ? (
                  <span>
                    <TrueIcon />
                    Residential address
                  </span>
                ) : (
                  <span>
                    <FalseIcon />
                    Residential address
                  </span>
                )}

                {!!wealth_file == true ? (
                  <span>
                    <TrueIcon />
                    Income statement
                  </span>
                ) : (
                  <span>
                    <FalseIcon />
                    Income statement
                  </span>
                )}
              </p>
              <span>{username}</span>
            </p>
          ) : (
            <span>
              <WarningIcon />
              We remind you that currently we do not work with citizens from Russian Federation.
            </span>
          )}
        </div>
      </div>
      <VerificationDialog open={dialogVerification} onClose={toggleDialogVerification} />
    </div>
  );
}

export default Personal;
