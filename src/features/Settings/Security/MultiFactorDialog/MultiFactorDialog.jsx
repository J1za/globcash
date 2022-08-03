import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import ButtonMUI from '../../../../shared/ButtonMUI';
import {ReactComponent as MultiIcon} from '../../../../assets/images/multi_mail.svg';
import {Controller, useForm} from 'react-hook-form';
import InputMUI from '../../../../shared/InputMUI';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import ReactCodeInput from 'react-verification-code-input';
import './MultiFactorDialog.scss';
import resend from '../../../../assets/icons/resend.svg';
import {sendAuthEmail, sendAuthCode, resendСode} from '../../settingsActions';
import {ReactComponent as MailIcon} from '../../../../assets/images/successAuth.svg';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Countdown from 'react-countdown';

const getSteps = () => {
  return [
    <div>
      <div className='desc  top_linear'>
        <span>Step 1: Email</span>
        <div />
      </div>
      <div className='mob'>Step 1/3: Email</div>
    </div>,
    <div>
      <div className='desc middle top_linear'>
        <span>Step 2: Verify</span>
        <div />
      </div>
      <div className='mob'>Step 2/3: Verify</div>
    </div>,
    <div>
      <div className='desc top_linear'>
        <span>Step 3: Finalize</span>
        <div />
      </div>
      <div className='mob'>Step 3/3: Confirmation</div>
    </div>
  ];
};

/// COUNTER BLOCK Start

const MultiFactorDialog = ({onClose}) => {
  let additionCounter = 59000;
  let remaining = Date.now() + additionCounter;
  const [restart, setRestart] = useState(0);
  const {confirm_type, security_token} = useSelector(({auth}) => auth);

  const countdownInner = (isComplete, minutes, seconds) => {
    return isComplete ? (
      <div className='info mt-32'>
        <button className='info-resend-button' onClick={handleSubmit(onSubmit)}>
          <img src={resend} alt='resend' />
          Resend the code
        </button>
      </div>
    ) : (
      <div className='info mt-32 info-resend-txt'>
        Something went wrong? Сan be resent in{' '}
        <span>
          {' '}
          {minutes}:{seconds}
        </span>
      </div>
    );
  };

  const renderer = ({minutes, seconds, completed}) => {
    return countdownInner(completed, minutes, seconds);
  };

  const reSend = () => {
    remaining = Date.now() + additionCounter;
    setRestart(restart + 1);
  };

  /// COUNTER BLOCK End
  const steps = getSteps();
  let [activeStep, setActiveStep] = useState(0); ///// НЕ ЗАБУДЬ ЗАМІНИТЬ НА 0

  const [verCode, setVerCode] = useState('');

  // SET Email for 1st step
  const [emailAuth, setEmailAuth] = useState('');

  const schema = yup.object({
    email: yup.string().email('Invalid email').required('Field is required')
  });

  const {
    control,
    setValue,
    handleSubmit,
    formState: {errors, isValid, touchedFields}
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
    shouldFocusError: true,
    defaultValues: {
      email: ''
    }
  });

  const handleNext = () => {
    setActiveStep(activeStep === 2 ? activeStep : (prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep != 0 && activeStep - 1);
    setVerCode('');
  };

  useEffect(() => {
    console.log(touchedFields);
  }, [touchedFields]);
  const dispatch = useDispatch();

  const onSubmit = (data) =>
    dispatch(sendAuthEmail(data)).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 200) {
        localStorage.setItem('security_token', res.payload.data.security_token);
        activeStep !== 1 && handleNext();
        console.log('success');
        reSend();
      } else {
        Object.values(res.error.response.data)
          .flat()
          .forEach((el) => toast.error(el, {}));
      }
    });

  const onSubmitCode = (data) =>
    dispatch(sendAuthCode(data)).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 200) {
        handleNext();
      } else {
        Object.values(res.error.response.data)
          .flat()
          .forEach((el) => toast.error(el, {}));
      }
    });

  return (
    <div className='multi_factor_dialog'>
      <div className='title'>Two step authentification</div>
      <div>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Typography>
          {activeStep === 0 ? (
            <form className='two' onSubmit={handleSubmit(onSubmit)}>
              <span>We’ll send a verification code to this email whenever you sign in to account</span>
              <p>
                <MultiIcon />
              </p>
              <div className='block'>
                <span>Email</span>
                <Controller
                  name='email'
                  control={control}
                  render={({field}) => (
                    <InputMUI
                      type='text'
                      fullWidth
                      onPaste={() => {
                        setValue('email', field.value);
                      }}
                      error={errors.email?.message}
                      inputProps={field}
                      placeholder='Fill your email here'
                    />
                  )}
                />
              </div>
              <div className='two_btn'>
                <ButtonMUI fullWidth formAction disabled={!isValid}>
                  Continue
                </ButtonMUI>
              </div>
            </form>
          ) : activeStep === 1 ? (
            <div className='one'>
              <span>
                To continue, please enter the code that we sent you in <br /> the email.
              </span>
              <div className='form_verification'>
                <div className='block_field '>
                  <Controller
                    name='code'
                    control={control}
                    render={({field}) => (
                      <ReactCodeInput
                        onChange={(e) => {
                          setVerCode(e);
                        }}
                        type='text'
                        fields={6}
                      />
                    )}
                  />
                </div>
                <button className='resend_btn'>
                  {/* <img src={resend} alt='resend the message' />{' '}
                  <button className='impulse' onClick={handleSubmit(onSubmit)}>
                    Resend the code
                  </button> */}
                  <Countdown date={remaining} key={restart} renderer={renderer} />
                </button>
              </div>
              <div className='one_btn'>
                <ButtonMUI fullWidth disabled={activeStep === 0} onClick={handleBack} variant='outlined'>
                  BACK
                </ButtonMUI>

                <ButtonMUI
                  fullWidth
                  disabled={verCode.length < 6 && true}
                  onClick={() => onSubmitCode({code: verCode, security_token: localStorage.getItem('security_token')})}
                >
                  Verify
                </ButtonMUI>
              </div>
            </div>
          ) : (
            <div className='three'>
              <span>Two-factor authentication successfully connected!</span>
              <MailIcon />

              <div className='three_btn'>
                <ButtonMUI fullWidth disabled={activeStep === 1} onClick={handleBack} variant='outlined'>
                  BACK
                </ButtonMUI>
                <ButtonMUI fullWidth onClick={onClose}>
                  Finish
                </ButtonMUI>
              </div>
            </div>
          )}
        </Typography>
      </div>
    </div>
  );
};

export default MultiFactorDialog;
