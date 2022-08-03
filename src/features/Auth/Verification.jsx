import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import ButtonMUI from '../../shared/ButtonMUI';
import {confirmAuth, resendСode} from '../Settings/settingsActions';
import {authPath, rootMainPath} from '../../routes/paths';
import ReactCodeInput from 'react-verification-code-input';
import Countdown from 'react-countdown';
import {ReactComponent as BackArrowIcon} from '../../assets/images/back_arrow.svg';
import {ReactComponent as ResendIcon} from '../../assets/images/resend.svg';
import {ReactComponent as InvalidIcon} from '../../assets/images/invalid.svg';

let additionCounter = 59000;
let remaining = Date.now() + additionCounter;

const Verification = ({history}) => {
  const [loading, setLoad] = useState(false);
  const [verCode, setVerCode] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [restart, setRestart] = useState(0);
  const [authError, setError] = useState(false);
  const dispatch = useDispatch();
  const {confirm_type, security_token} = useSelector(({auth}) => auth);

  const countdownInner = (isComplete, minutes, seconds) => {
    return isComplete ? (
      <div className='info mt-20'>
        <button className='good-hover' onClick={reSend}>
          <ResendIcon />
          Resend the code
        </button>
      </div>
    ) : (
      <div className='info mt-20'>
        <span className='auth-box__only-desk mr-3'>Something went wrong?</span>
        Сan be resent in
        <span className='info__time'>
          {minutes}:{seconds}
        </span>
      </div>
    );
  };

  const renderer = ({minutes, seconds, completed}) => {
    return countdownInner(completed, minutes, seconds);
  };

  const reSend = () => {
    dispatch(resendСode({security_token}));
    remaining = Date.now() + additionCounter;
    setRestart(restart + 1);
    setError(false);
  };

  const submit = () => {
    let url = '',
      data = {security_token};
    switch (confirm_type) {
      case 'email':
        url = 'code';
        data.code = emailCode;
        break;
      case 'totp':
        url = 'totp';
        data.code = verCode;
        break;
      case 'email_and_totp':
        url = 'multi';
        data.email_code = emailCode;
        data.totp_code = verCode;
        break;
    }
    dispatch(confirmAuth(url, data)).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 200) {
        localStorage.setItem('external_token', res.payload.data.external_token);
        localStorage.setItem('token', res.payload.data.token);
        console.log('confirm success');
        history.push(rootMainPath);
      } else {
        setError(true);
      }
    });
  };

  return confirm_type === '' ? null : (
    <>
      {confirm_type === 'email' && (
        <div className='auth-box verification-box'>
          <Link className='back good-hover mb-48' to={authPath.signIn} aria-label='Backlink'>
            <BackArrowIcon />
            Back
          </Link>

          <h2 className='auth-box__title mb-16'>Verification code</h2>
          <div className='descriptions mb-40'>
            Please type the verification code <br /> sent to email
          </div>
          <div className='form-verification'>
            <ReactCodeInput
              className={`block-field five-fields${authError ? ' error-border' : ''}`}
              fieldWidth={61}
              fieldHeight={64}
              fields={5}
              type='text'
              onChange={
                !authError
                  ? (e) => {
                      setEmailCode(e);
                    }
                  : (e) => {
                      setEmailCode(e);
                      setError(false);
                    }
              }
            />
            {authError && (
              <div className='error-verification mt-20'>
                <InvalidIcon />
                <span>Invalid code.</span>
                <button className='good-hover' type='button' onClick={reSend}>
                  Resend the code
                </button>
              </div>
            )}
            {!authError && <Countdown date={remaining} key={restart} renderer={renderer} />}
            <ButtonMUI
              className='auth-box__btn mt-48'
              disabled={emailCode.length < 5 || authError}
              loading={loading}
              fullWidth
              onClick={submit}
            >
              Confirm
            </ButtonMUI>
          </div>
        </div>
      )}

      {confirm_type === 'totp' && (
        <div className='auth-box verification-box'>
          <Link className='back good-hover mb-48' to={authPath.signIn} aria-label='Backlink'>
            <BackArrowIcon />
            Back
          </Link>

          <h2 className='auth-box__title mb-16'>Verification code</h2>
          <div className='descriptions mb-40'>Enter the 6-digit code you see in the app.</div>
          <div className='form-verification'>
            <ReactCodeInput
              className={`block-field${authError ? ' error-border' : ''}`}
              fieldWidth={50}
              fieldHeight={64}
              fields={6}
              type='number'
              onChange={
                !authError
                  ? (e) => {
                      setVerCode(e);
                    }
                  : (e) => {
                      setVerCode(e);
                      setError(false);
                    }
              }
            />
            {authError && (
              <div className='error-verification mt-20'>
                <InvalidIcon />
                <span>Invalid code.</span>
                <button className='good-hover' type='button' onClick={reSend}>
                  Resend the code
                </button>
              </div>
            )}
            {!authError && <Countdown date={remaining} key={restart} renderer={renderer} />}
            <ButtonMUI
              className='auth-box__btn mt-48'
              disabled={verCode.length < 6 || authError}
              loading={loading}
              fullWidth
              onClick={submit}
            >
              Confirm
            </ButtonMUI>
          </div>
        </div>
      )}

      {confirm_type === 'email_and_totp' && (
        <div className='auth-box multi-factor-box'>
          <Link className='back good-hover mb-48' to={authPath.signIn} aria-label='Backlink'>
            <BackArrowIcon />
            Back
          </Link>

          <h2 className='auth-box__title mb-40'>Multifactor verification</h2>
          <div className='descriptions mb-24'>1. Verification code sent to email</div>
          <div className='form-verification'>
            <ReactCodeInput
              className={`block-field five-fields${authError ? ' error-border' : ''}`}
              fieldWidth={61}
              fieldHeight={64}
              fields={5}
              type='text'
              onChange={
                !authError
                  ? (e) => {
                      setEmailCode(e);
                    }
                  : (e) => {
                      setEmailCode(e);
                      setError(false);
                    }
              }
            />
            {authError && (
              <div className='error-verification mt-20'>
                <InvalidIcon />
                <span>Invalid code.</span>
                <button className='good-hover' type='button' onClick={reSend}>
                  Resend the code
                </button>
              </div>
            )}
            {!authError && <Countdown date={remaining} key={restart} renderer={renderer} />}
          </div>

          <div className='descriptions mt-40 mb-24'>2. Google Authenticator code</div>
          <div className='form-verification'>
            <ReactCodeInput
              className={`block-field${authError ? ' error-border' : ''}`}
              fieldWidth={50}
              fieldHeight={64}
              fields={6}
              autoFocus={false}
              onChange={
                !authError
                  ? (e) => {
                      setVerCode(e);
                    }
                  : (e) => {
                      setVerCode(e);
                      setError(false);
                    }
              }
            />
            {authError && (
              <div className='error-verification mt-20'>
                <InvalidIcon />
                <span>Invalid code.</span>
              </div>
            )}
            <ButtonMUI
              className='auth-box__btn mt-48'
              disabled={verCode.length < 6 || authError}
              loading={loading}
              fullWidth
              onClick={submit}
            >
              Confirm
            </ButtonMUI>
          </div>
        </div>
      )}
    </>
  );
};

export default Verification;
