import React, {useState, useEffect} from 'react';
import GoogleDialog from './GoogleDialog/GoogleDialog';
import {useDispatch, useSelector} from 'react-redux';
import MultiFactorDialog from './MultiFactorDialog/MultiFactorDialog';
import PasswordDialog from './PasswordDialog/PasswordDialog';
import SwitchMUI from '../../../shared/SwitchMUI';
import DialogMUI from '../../../shared/DialogMUI';
import {useToggle} from '../../../helpers/hooks';
import {ReactComponent as TrueIcon} from '../../../assets/images/true.svg';
import {ReactComponent as Lock} from '../../../assets/icons/lock-password.svg';
import {ReactComponent as MultiFactorIcon} from '../../../assets/images/Multi_Factor.svg';
import {ReactComponent as GoogleAuthenticatorIcon} from '../../../assets/images/google_authenticator.svg';
import {partialUpdateSecurityParams} from '../../../layout/Header/headerActions';
import moment from 'moment';
import './Security.scss';

const Security = () => {
  const [dialogGoogle, toggleDialogGoogle] = useToggle();
  const [dialogMultiFactor, toggleDialogMultiFactor] = useToggle();
  const [dialogPassword, toggleDialogPassword] = useToggle();

  const [Multifactor, SetMultifactor] = useState(true);
  const [Status, SetStatus] = useState(true);

  const dispatch = useDispatch();

  const {
    header: {
      userInfo: {
        first_name,
        last_name,
        t_photo_url,
        email,
        totp_auth,
        two_factor_auth,
        two_factor_email,
        two_factow_verified_date,
        avatar
      }
    },
    settings: {
      KYC: {telegram_id, username, passport_file, address_file, id_card_file, wealth_file}
    }
  } = useSelector(({header, settings}) => ({header, settings}));

  return (
    <div className='security_block card-wrap'>
      <div className='title'>Security</div>
      <div className={`block start`}>
        {/*<div className="block">*/}
        <div className='password-container'>
          <div className='left'>
            <Lock />
            <div>
              <span>Password</span>
              <p className='password-circles'> ● ● ● ● ● ● ● ●</p>
              <p className='password-txt'>This password is used when you login via email</p>
            </div>
          </div>
          <div className='right'>
            <button className='pulse' onClick={() => toggleDialogPassword(true)}>
              Change
            </button>
          </div>
        </div>

        {two_factor_auth ? (
          <p className='status'>
            <span>
              <TrueIcon />
              Verified: {moment(two_factow_verified_date).format('MMM DD,YYYY')}
            </span>

            <p>
              {two_factor_email}
              <button className='pulse' onClick={() => toggleDialogMultiFactor(true)}>
                Change
              </button>
            </p>
          </p>
        ) : null}
      </div>

      <div className={`block${two_factor_auth ? ' active' : ''}`}>
        {/*<div className="block">*/}
        <div className='left'>
          <MultiFactorIcon />
          <div>
            <span>Protect your account with Multi-Factor Authentication</span>
            <p>Every time you sign into your account, you will need a verification code</p>
          </div>
        </div>
        <div className='right'>
          {two_factor_auth ? (
            <SwitchMUI
              onChange={() => {
                dispatch(partialUpdateSecurityParams({two_factor_auth: !two_factor_auth}));
              }}
              checked={two_factor_auth}
            />
          ) : (
            <button className='pulse' onClick={() => toggleDialogMultiFactor(true)}>
              Enable
            </button>
          )}
        </div>

        {two_factor_auth ? (
          <p className='status'>
            <span>
              <TrueIcon />
              Verified: {moment(two_factow_verified_date).format('MMM DD,YYYY')}
            </span>

            <p>
              {two_factor_email}
              <button className='pulse' onClick={() => toggleDialogMultiFactor(true)}>
                Change
              </button>
            </p>
          </p>
        ) : null}
      </div>
      <div className={`block${totp_auth ? ' active' : ''}`}>
        <div className='left'>
          <GoogleAuthenticatorIcon />
          <div>
            <span>Use google authenticator instead</span>
            <p>
              Use to get free verification codes even when your phone is offline. <br />
              Available for Android and Iphone.
            </p>
          </div>
        </div>
        <div className='right'>
          {totp_auth === true ? (
            <SwitchMUI
              onChange={() => {
                dispatch(partialUpdateSecurityParams({totp_auth: !totp_auth}));
              }}
              checked={totp_auth}
            />
          ) : (
            <button className='pulse' onClick={() => toggleDialogGoogle(true)}>
              Enable
            </button>
          )}
        </div>
      </div>

      <DialogMUI open={dialogGoogle} onClose={toggleDialogGoogle}>
        <GoogleDialog onClose={toggleDialogGoogle} />
      </DialogMUI>
      <DialogMUI open={dialogMultiFactor} onClose={toggleDialogMultiFactor}>
        <MultiFactorDialog onClose={toggleDialogMultiFactor} />
      </DialogMUI>
      <DialogMUI open={dialogPassword} onClose={toggleDialogPassword}>
        <PasswordDialog onClose={toggleDialogPassword} />
      </DialogMUI>
    </div>
  );
};

export default Security;
