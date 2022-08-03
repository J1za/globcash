import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useDispatch, useSelector} from 'react-redux';
import {toast} from 'react-toastify';
import * as yup from 'yup';
import {CheckHash, getFreeChecks, getRisk} from '../checksActions';
import {yupResolver} from '@hookform/resolvers/yup';
import InputMUI from '../../../shared/InputMUI';
import DialogMUI from '../../../shared/DialogMUI';
import ButtonMUI from '../../../shared/ButtonMUI';
import {PropagateLoader} from 'react-spinners';
import {Link} from 'react-router-dom';
import SelectComponent from '../../../shared/SelectComponent';
import {ReactComponent as VectorIcon} from '../../../assets/images/arrow_d.svg';
import {ReactComponent as SorryIcon} from '../../../assets/images/sorry.svg';
import {ReactComponent as OneCheckIcon} from '../../../assets/images/one_check.svg';
import './CheckBlock.scss';

const CheckBlock = () => {

  const optionsPage = [
    {value: 'BTC', label: 'BTC'},
    {value: 'ETH', label: 'ETH'},
    {value: 'LTC', label: 'LTC'},
    {value: 'BCH', label: 'BCH'},
    {value: 'XRP', label: 'XRP'},
    {value: 'TetherOMNI', label: 'TetherOMNI'},
    {value: 'ETC', label: 'ETC'},
    {value: 'BSV', label: 'BSV'},
    {value: 'DOGE', label: 'DOGE'},
    {value: 'TRX', label: 'TRX'},
    {value: 'BSC', label: 'BSC'},
    {value: 'MATIC', label: 'MATIC'},
    {value: 'ADA', label: 'ADA'},
    {value: 'ZEC', label: 'ZEC'},
  ];

  const [addressField, setAddressField] = useState(null);

  const [buttonLoad, setLoad] = useState(false);

  const schema = yup.object({
    address: yup
      .string()
      .min(2, 'Min 2 characters')
      .required('Field is required')
  });

  const {
    control,
    formState: {errors, isValid},
    reset,
  } = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
    shouldFocusError: true,
    defaultValues: {
      address: ''
    }
  });

  const [parameters, setParameters] = useState({
    code: null,
  });

  const dispatch = useDispatch();

  const [dialog, toggleDialog] = useState({
    status: false,
    info: {
      code: null,
    }
  });

  const [dialogError, toggleDialogError] = useState({
    status: false,
    info: {
      code: null,
    }
  });

  const [dialogCheck, toggleDialogCheck] = useState({
    status: false,
  });

  const closeDialog = () =>{
    setLoad(false);
    reset();
    toggleDialog(prev => ({...prev, status: false}));
  };

  const closeDialogCheck = () =>{
    setLoad(false);
    reset();
    setParameters({...parameters, code: null});
    toggleDialogCheck(prev => ({...prev, status: false}));
  };

  const closeDialogError = () =>{
    toggleDialogError(prev => ({...prev, status: false}));
  };

  const checkHash = () => {
    setLoad(true);
    dispatch(CheckHash({
      hash: addressField,
      currency_code: parameters.code,
    })).then(res => {
      closeDialogCheck();
      closeDialog();
      if(res.payload && res.payload.status && res.payload.status === 200) {
        dispatch(getFreeChecks());
        dispatch(getRisk())
      } else if (res.error.response.status === 400) {
        Object.values(res.error.response.data)
          .flat()
          .forEach(el =>
            toast.error(el, {})
          );
      }else {
        Object.values(res.error.response.data)
          .flat()
          .forEach(el =>
            toast.error(el, {})
          );
      }
      setLoad(false);
    });
  };

  const { wallets: { wallets, walletsLoad } } = useSelector(({ wallets }) => ({ wallets }));

  const { freeChecks , freeChecksLoad } = useSelector(({ checks }) => (checks));

  useEffect(() => {
  }, [freeChecks]);

  useEffect(() => {
    doRequest();
  }, []);

  const doRequest = () => dispatch(getFreeChecks())

  return (
    <div className='check_block card-wrap'>
      {walletsLoad || freeChecksLoad ?
        <section className="reports_table loading">
          <div className="card-wrap">
            <PropagateLoader color={'#3579FC'} />
          </div>
        </section>
        :
        <form>
          <div className="title_block">
            <span>Check</span>
            <div>
              <span/>
              {freeChecks.free_count >= 1 ?
                <div>
                  <span>{freeChecks.free_count} сhecks</span>
                  <p>Free</p>
                  <div className='tooltip'>
                    <span>We provide 200 free checks on your account for all the time. Tariffication over the limit:</span>
                    <p>0.9 USDT one check</p>
                  </div>
                </div>
                :
                <div className='one'>
                  <OneCheckIcon/>
                  <div>0.9 USDT one check</div>
                </div>
              }
            </div>
          </div>
          <div className='block'>
            <p>Wallet address or transaction hash</p>
            <div>
              <div className='input_wrapper'>
                <Controller
                  name='address'
                  control={control}
                  render={({field}) => (
                    <InputMUI
                      className='auth-box__input'
                      type='text'
                      fullWidth
                      placeholder='Please enter the address or hash you want check'
                      error={errors.address?.message}
                      inputProps={field}
                      onChange={e => setAddressField(e.target.value)}
                    />
                  )}
                />
              </div>
              <SelectComponent
                options={optionsPage}
                onChange={(e => setParameters({ ...parameters, code: e.value }))}
                value={parameters.code === null ? null: optionsPage.find(el => el.value === parameters.code)}
                components={<VectorIcon/>}
                placeholder='Select the currency'
              />
            </div>
            {/* <span style={parameters.code ? { opacity: '0'} : { opacity: '1'}}>
              To check tokens (e.g. USDT), select the appropriate coin 
            </span> */}
          </div>
          {freeChecks.free_count >= 1 ?
            <ButtonMUI
              disabled={!isValid || !parameters.code }
              onClick={() => toggleDialogCheck({status: true})}
            >
              To check
            </ButtonMUI>
            :
            <div>
              <ButtonMUI
                disabled={!isValid || !parameters.code }
                onClick={() => wallets.usdterc.balance >= 0.9 ?
                  toggleDialog({status: true, info: {code: parameters.code}})
                  :
                  toggleDialogError({
                    status: true,
                    info: {
                      code: parameters.code,
                    }
                  })
                }
              >
                To check
              </ButtonMUI>
            </div>
          }
        </form>
      }
      <DialogMUI open={dialog.status} onClose={closeDialog}>
        <div className="check_address">
          <h2>Сheck crypto address</h2>
          <p>The report reveals the source of funds. Whether they are trustworthy and what risk percentage each source has. <br/><br/>
            Payment for the service - <span>0.9 USDT</span> will be debited from your user <span>{dialog.info.code}</span> wallet.
          </p>
          <div className='btn'>
            <ButtonMUI variant='outlined' onClick={closeDialog}>
              CANCEL
            </ButtonMUI>
            <ButtonMUI
              onClick={checkHash}
              loading={buttonLoad}
            >
              confirm
            </ButtonMUI>
          </div>
        </div>
      </DialogMUI>
      <DialogMUI open={dialogCheck.status} onClose={closeDialogCheck}>
        <div className="check_address">
          <h2>Сheck crypto address</h2>
          <p>The report reveals the source of funds. Whether they are trustworthy and what risk percentage each source has.</p>
          <div className='btn'>
            <ButtonMUI variant='outlined' onClick={closeDialogCheck}>
              CANCEL
            </ButtonMUI>
            <ButtonMUI
              loading={buttonLoad}
              onClick={checkHash}
            >
              Check
            </ButtonMUI>
          </div>

        </div>

      </DialogMUI>
      <DialogMUI open={dialogError.status} onClose={closeDialogError}>
        <div className="check_error">
          <h2>Sorry...</h2>
          <p>
            There is not enough money on your <span>{dialogError.info.code}</span> wallet to pay for the service. <br/><br/>
            Please top up the balance and come back;)
          </p>
          <div className="img"><SorryIcon/></div>
          <div className='btn'>
            <ButtonMUI variant='outlined' onClick={closeDialogError}>
              CLOSE
            </ButtonMUI>
            <ButtonMUI
              component={Link}
              to='/main/wallets'
            >
              Open Wallet
            </ButtonMUI>
          </div>

        </div>

      </DialogMUI>
    </div>
  );
};

export default CheckBlock;
