import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import ButtonMUI from '../../../../shared/ButtonMUI';
import {ReactComponent as AuthenticatorIcon} from '../../../../assets/images/Authenticator.svg';
import {ReactComponent as WarningIcon} from '../../../../assets/images/warning.svg';
import {ReactComponent as TextIcon} from '../../../../assets/images/text.svg';
import checked from '../../../../assets/images/checkedRadio.svg';
import unchecked from '../../../../assets/images/uncheckedRadio.svg';
import {Controller, useForm} from 'react-hook-form';
import QRCode from 'react-qr-code';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputMUI from '../../../../shared/InputMUI';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import './GoogleDialog.scss';
import {getQRSecret, confirmGoogleCode} from '../../settingsActions';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const getSteps = () => {
  return [
    <div>
      <div className='desc top_linear'>
        <span>Step 1: Select OS</span>
        <div />
      </div>
      <div className='mob'>Step 1/3: Select OS</div>
    </div>,
    <div>
      <div className='desc middle top_linear'>
        <span>Step 2: Secure Code</span>
        <div />
      </div>
      <div className='mob'>Step 2/3: Secure Code</div>
    </div>,
    <div>
      <div className='desc top_linear'>
        <span>Step 3: Verify</span>
        <div />
      </div>
      <div className='mob'>Step 3/3: Verify</div>
    </div>
  ];
};

const GoogleDialog = ({onClose}) => {
  const steps = getSteps();

  const [currentOS, setOS] = useState({OS: 'android', QR: false});

  const [activeStep, setActiveStep] = useState(0);

  const [authCode, setAuthCode] = useState('');

  const schema = yup.object({
    id_number: yup
      .string()
      .min(6, 'You should enter 6-digit code')
      .max(6, 'You should enter 6-digit code')
      .required('Field is required')
  });

  const {
    control,
    formState: {errors, isValid, touchedFields}
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
    shouldFocusError: true,
    defaultValues: {
      id_number: ''
    }
  });

  useEffect(() => {}, [currentOS]);

  const [value, setValue] = useState('android');

  const handleChange = (event) => {
    setValue(event.target.value);
    setOS({...currentOS, OS: event.target.value});
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setOS({...currentOS, QR: false});
  };

  const dispatch = useDispatch();

  const {
    settings: {qr_data},
    header: {userInfo}
  } = useSelector(({settings, header}) => ({settings, header}));

  return (
    <div className='goggle_dialog'>
      <div className='title'>Set up Authenticator</div>
      <div>
        {activeStep < 3 && (
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        )}
        <Typography>
          {(() => {
            switch (activeStep) {
              case 0:
                return (
                  <div className='one'>
                    <TextIcon />
                    <p>
                      Instead of waiting for text messages, get verification codes for free from the Authenticator app.
                      It works even if your phone is offline.
                    </p>
                    <p>What kind of phone do you have?</p>
                    <RadioGroup aria-label='gender' name='gender1' value={value} onChange={handleChange}>
                      <FormControlLabel
                        value='android'
                        control={
                          <Radio icon={<img src={unchecked} alt='' />} checkedIcon={<img src={checked} alt='' />} />
                        }
                        label='Android'
                      />
                      <FormControlLabel
                        value='iphone'
                        control={
                          <Radio icon={<img src={unchecked} alt='' />} checkedIcon={<img src={checked} alt='' />} />
                        }
                        label='Iphone'
                      />
                    </RadioGroup>
                    <div>
                      <ButtonMUI
                        fullWidth
                        onClick={() => {
                          dispatch(getQRSecret()).then((res) => {
                            if (res.payload && res.payload.status && res.payload.status === 200) {
                              handleNext();
                            }
                          });
                        }}
                      >
                        Continue
                      </ButtonMUI>
                    </div>
                  </div>
                );
              case 1:
                return (
                  <div className='two'>
                    {currentOS.OS == 'iphone' ? (
                      <div className='ios'>
                        {currentOS.QR === false ? (
                          <>
                            <div className='text'>
                              <span>
                                -Get the Authenticator App from the{' '}
                                <a
                                  href='https://apps.apple.com/ru/app/google-authenticator/id388497605'
                                  target='_blank'
                                  className='pulse'
                                >
                                  App Store.
                                </a>
                              </span>
                              <span>
                                -List the App select <p>Set up account.</p>
                              </span>
                              <span>
                                -Choose <p>Scan barcode.</p>
                              </span>
                            </div>
                            <div className='qr_cod'>
                              <QRCode
                                size={160}
                                value={`otpauth://totp/GlobixCashClient:${qr_data && qr_data.name}?secret=${
                                  qr_data && qr_data.secret
                                }&issuer=GlobixCashClient`}
                              />
                              {/*<QRIcon />*/}
                            </div>

                            <p
                              className='pulse'
                              onClick={() => {
                                setOS({...currentOS, QR: true});
                              }}
                            >
                              Can’t Scan IT?
                            </p>
                          </>
                        ) : (
                          <>
                            <p>Can’t scan the barcode?</p>
                            <div className='text'>
                              <span>
                                1) Tap Menu, <p>then Set up acсount.</p>
                              </span>
                              <span>
                                2) Tap<p>Enter provided key.</p>
                              </span>
                              <span>3) Enter your email and this key:</span>
                            </div>
                            <div className='color'>
                              <div>
                                <span>{qr_data && qr_data.secret}</span>
                              </div>
                              <p>
                                <WarningIcon />
                                Spaces don’t matter
                              </p>
                            </div>
                            <span>
                              4) Make sure <p>Time based</p> is turned on, and tap <p>Add</p> to finish.
                            </span>
                          </>
                        )}

                        <div className='two_btn'>
                          <ButtonMUI fullWidth disabled={activeStep === 0} onClick={handleBack} variant='outlined'>
                            BACK
                          </ButtonMUI>
                          <ButtonMUI fullWidth onClick={handleNext}>
                            Continue
                          </ButtonMUI>
                        </div>
                      </div>
                    ) : null}
                    {currentOS.OS == 'android' ? (
                      <div className='android'>
                        {currentOS.QR === false ? (
                          <>
                            <div className='text'>
                              <span>
                                -Get the Authenticator App from the{' '}
                                <a
                                  href='https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=uk&gl=US'
                                  className='pulse'
                                  target='_blank'
                                >
                                  Play Market.
                                </a>
                              </span>
                              <span>
                                -List the App select <p>Set up account.</p>
                              </span>
                              <span>
                                -Choose <p>Scan barcode.</p>
                              </span>
                            </div>
                            <div className='qr_cod'>
                              <QRCode
                                size={160}
                                value={`otpauth://totp/GlobixCashClient:${qr_data && qr_data.name}?secret=${
                                  qr_data && qr_data.secret
                                }&issuer=GlobixCashClient`}
                              />
                              {/*<QRIcon />*/}
                            </div>

                            <p
                              className='pulse'
                              onClick={() => {
                                setOS({...currentOS, QR: true});
                              }}
                            >
                              Can’t Scan IT?
                            </p>
                          </>
                        ) : (
                          <>
                            <p>Can’t scan the barcode?</p>
                            <div className='text'>
                              <span>
                                1) Tap Menu, <p>then Set up acсount.</p>
                              </span>
                              <span>
                                2) Tap<p>Enter provided key.</p>
                              </span>
                              <span>3) Enter your email and this key:</span>
                            </div>
                            <div className='color'>
                              <div>
                                <span>{qr_data && qr_data.secret}</span>
                              </div>
                              <p>
                                <WarningIcon />
                                Spaces don’t matter
                              </p>
                            </div>
                            <span>
                              4) Make sure <p>Time based</p> is turned on, and tap <p>Add</p> to finish.
                            </span>
                          </>
                        )}
                        <div className='two_btn'>
                          <ButtonMUI fullWidth disabled={activeStep === 0} onClick={handleBack} variant='outlined'>
                            BACK
                          </ButtonMUI>
                          <ButtonMUI fullWidth onClick={handleNext}>
                            Continue
                          </ButtonMUI>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              case 2:
                return (
                  <div className='three'>
                    <span>Enter the 6-digit code you see in the app.</span>
                    <div className='block'>
                      <span>Temporary code</span>
                      <Controller
                        name='id_number'
                        control={control}
                        render={({field}) => (
                          <InputMUI
                            type='text'
                            fullWidth
                            error={errors.id_number?.message}
                            onChange={(e) => setAuthCode(e.target.value)}
                            value={authCode}
                            inputProps={field}
                            placeholder='Enter the 6-digit code you see in the app.'
                          />
                        )}
                      />
                    </div>
                    <div className='three_btn'>
                      <ButtonMUI
                        fullWidth
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        variant='outlined'
                        formAction
                      >
                        BACK
                      </ButtonMUI>
                      <ButtonMUI
                        fullWidth
                        onClick={() => {
                          dispatch(confirmGoogleCode({code: authCode})).then((res) => {
                            if (res.payload && res.payload.status && res.payload.status === 200) {
                              handleNext();
                            } else {
                              Object.values(res.error.response.data)
                                .flat()
                                .forEach((el) => toast.error(el, {}));
                            }
                          });
                        }}
                        disabled={!isValid}
                      >
                        Finish
                      </ButtonMUI>
                    </div>
                  </div>
                );

              default:
                return;
            }
          })()}
        </Typography>
        {activeStep === 3 && (
          <div className='more_step'>
            <p>You’re all set! From now on, you’ll use Authenticator to sign in to your GlobixCash account.</p>
            <AuthenticatorIcon />
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleDialog;
