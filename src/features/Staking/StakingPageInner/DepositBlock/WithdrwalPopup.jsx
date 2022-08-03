import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import DialogMUI from '../../../../shared/DialogMUI';
import ButtonMUI from '../../../../shared/ButtonMUI';
import {useToggle} from '../../../../helpers/hooks';
import {Controller, useForm} from 'react-hook-form';
import InputMUI from '../../../../shared/InputMUI';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {GlobixFixed} from '../../../../helpers/functions';
import {ReactComponent as Clock} from '../../../../assets/images/staking_clock.svg';
import arrow from '../../../../assets/images/arrow-down-full.svg';
import {ReactComponent as DepositIcon} from '../../../../assets/images/Deposit.svg';
import moment from 'moment';
import {getCurIco, curToFixed} from '../../../../helpers/currencyNaming';
import {makeWithdrawal} from '../../StakingPage/StakingPageActions';
import {getKycData} from '../../../../../src/features/Settings/settingsActions';
import {getDashboardStaking} from '../../../Dashboard/DashboardComponents/Staking/stakingActions';

function WithdrwalPopup({open, label, onClose, isCodeEntered, selectedWallet}) {
  const [btnLoad, toggleBtnLoad] = useToggle(false);
  const [step, setStep] = useState(1);
  const [amountField, setAmountField] = useState(null);
  const isInv = label.includes('inv');
  const currency = isInv ? label.split('inv')[1].toUpperCase() : 'USDT';
  const dispatch = useDispatch();
  const {
    stakingPage: {staking_desc, userStakings},
    staking: {dashboardStaking},
    settings: {KYC}
  } = useSelector(({stakingPage, staking, settings}) => ({stakingPage, staking, settings}));
  const schema = yup.object({
    amount: yup
      .number()
      .typeError('you must specify a number')
      .min(0.00001, 'Should be a positive value')
      .required('Field is required')
      .test(
        true,
        `max ${dashboardStaking[label] && dashboardStaking[label].balance && dashboardStaking[label].balance} USDT`,
        () => {
          return amountField <= +dashboardStaking[label].balance;
        }
      )
  });
  const {
    handleSubmit,
    setError,
    control,
    formState: {errors, isValid},
    setValue,
    getValues,
    trigger,
    reset
  } = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
    shouldFocusError: true,
    defaultValues: {
      amount: ''
    }
  });

  const closePopup = () => {
    onClose();
    reset();
    setStep(1);
  };
  useEffect(() => {
    dispatch(getKycData());
  }, []);

  const withdrawStatus =
    userStakings[Object.keys(userStakings)[0]] && userStakings[Object.keys(userStakings)[0]].withdrawal_status;

  const onSubmit = () => {
    dispatch(makeWithdrawal({amount: amountField}, staking_desc && staking_desc.type)).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 200) {
        setStep(3);
        dispatch(getDashboardStaking());
        reset();
      } else {
        Object.values(res.error.response.data)
          .flat()
          .forEach((el) => toast.error(el, {}));
      }
    });
  };
  return (
    <DialogMUI open={open} onClose={closePopup}>
      <div className='dialog withdraw_dialog'>
        <form onSubmit={handleSubmit(onSubmit)}>
          {step === 1 && !withdrawStatus && (
            <>
              <div className='withdraw_dialog--step1'>
                <div className='withdraw_dialog--title'>Withdrawal from staking</div>
                <p className='withdraw_dialog--subtitle'>
                  Dear, <b>{KYC && KYC.username ? KYC.username : 'user'}</b> ! <br /> <br />
                  In order to make a request for the withdrawal of your deposit, either partial or complete, you need to
                  send a letter from your email in the subject line to indicate the{' '}
                  <b>ID number and withdrawal staking</b>. <br />
                  <br />
                  In the letter, you must specify which staking you want to close, as well as the closing amount.
                  <br />
                  <br />
                  Separately, according to the rules of Globix, if the deposit is not unfrozen, then the term for
                  withdrawing the deposit is <b>60 days</b>.
                </p>
                <DepositIcon className='withdraw_dialog--image' />
              </div>
            </>
          )}
          {step === 1 && withdrawStatus && (
            <div className='withdraw_dialog--step1'>
              <div className='withdraw_dialog--title'>Withdrawal from staking</div>

              <div className='withdraw_dialog--date'>
                <Clock />
                <p>
                  End date: {moment(dashboardStaking[label] && dashboardStaking[label].close * 1000).format('DD.MM.YY')}
                </p>
                <p className='withdraw_dialog--enddate'>
                  (ends {moment(dashboardStaking[label] && dashboardStaking[label].close * 1000).fromNow()})
                </p>
                <span className='true'>
                  {' '}
                  <span>●</span> Active
                </span>
              </div>
              <div className='withdraw_dialog--market'>
                <div className='left'>
                  <img src={staking_desc && staking_desc.image && staking_desc.image} alt='icon' />
                  <div>
                    <span>{staking_desc && staking_desc.name && staking_desc.name}</span>
                  </div>
                </div>
                <div className='right'>
                  <span>Hold balance</span>
                  <p>
                    {dashboardStaking[label] && dashboardStaking[label].balance && dashboardStaking[label].balance}{' '}
                    {currency}
                  </p>
                </div>
                <p className='withdraw_dialog--arrow'>
                  <span>
                    <img src={arrow} alt='arrow' />
                  </span>
                </p>
              </div>

              <div className='withdraw_dialog--market filled'>
                <div className='left'>
                  {getCurIco(isInv ? currency.toLowerCase() : 'usdterc')}
                  <div>
                    <span>{selectedWallet && selectedWallet.long_name && selectedWallet.long_name}</span>
                    <p>{selectedWallet && selectedWallet.short_name && selectedWallet.short_name}</p>
                  </div>
                </div>
                <div className='right'>
                  <span>Balance</span>
                  <p>
                    {selectedWallet &&
                      selectedWallet.balance &&
                      selectedWallet.balance &&
                      curToFixed(
                        isInv ? currency.toLowerCase() : 'usdterc',
                        selectedWallet && selectedWallet.balance && selectedWallet.balance,
                        true
                      )}{' '}
                    {currency}
                  </p>
                </div>
              </div>

              <div className='withdraw_dialog--period'>
                <p>Funds will be transferred within 30 days of your request.</p>
              </div>

              <div className='withdraw_dialog--amount'>
                <p>How much do you want to withdraw?</p>
                <div className='withdraw_dialog--input'>
                  <span>Amount</span>

                  <Controller
                    name='amount'
                    control={control}
                    render={({field}) => (
                      <InputMUI
                        className='auth-box__input'
                        type='text'
                        fullWidth
                        error={errors.amount?.message}
                        inputProps={field}
                        value={amountField}
                        placeholder={'0.00'}
                        isFixed
                        stateSetter={setAmountField}
                        setValue={setValue}
                        onChange={(e) => {
                          setAmountField(e.target.value);
                        }}
                      />
                    )}
                  />
                  <p
                    className='good-hover withdraw_dialog--max'
                    onClick={() => {
                      setValue('amount', +dashboardStaking[label].balance.toFixed(2));
                      setAmountField(+dashboardStaking[label].balance.toFixed(2));
                      trigger();
                    }}
                  >
                    MAX
                  </p>
                </div>
              </div>

              <ButtonMUI disabled={!isValid} fullWidth onClick={() => setStep(2)} loading={btnLoad}>
                Withdraw
              </ButtonMUI>
            </div>
          )}
          {step === 2 && (
            <div className='withdraw_dialog--step2'>
              <div className='withdraw_dialog--title'>Withdrawal from staking</div>
              <p className='withdraw_dialog--subtitle'>Please check the details of the transaction and confirm.</p>
              <div className='withdraw_dialog--market empty'>
                <div className='left'>
                  <img src={staking_desc && staking_desc.image && staking_desc.image} alt='icon' />
                  <div>
                    <span>From:</span>
                    <p>{staking_desc && staking_desc.name && staking_desc.name}</p>
                  </div>
                </div>
              </div>
              <div className='withdraw_dialog--market empty'>
                <div className='left'>
                  {getCurIco(isInv ? currency.toLowerCase() : 'usdterc')}
                  <div>
                    <span>To:</span>
                    <p>{selectedWallet.long_name}</p>
                  </div>
                </div>
              </div>
              <div className='withdraw_dialog--totamount'>
                <span>Amount</span>
                <p>
                  {GlobixFixed(amountField)} {currency}
                </p>
              </div>
              <div className='withdraw_dialog--buttons'>
                <ButtonMUI variant='outlined' onClick={() => setStep(1)}>
                  Back
                </ButtonMUI>
                <ButtonMUI formAction loading={btnLoad}>
                  Confirm
                </ButtonMUI>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className='withdraw_dialog--step3'>
              <div className='withdraw_dialog--title'>Funds withdrawn successfully</div>
              <p className='withdraw_dialog--subtitle'>
                Funds have been transfered from the Altcoin Arbitrage staking balance to your{' '}
                <b>{selectedWallet.long_name}</b> Globix wallet.
              </p>
              <div className='withdraw_dialog--final'>
                <p>
                  {GlobixFixed(amountField)} {currency}
                </p>
              </div>
            </div>
          )}
        </form>
      </div>
    </DialogMUI>
  );
}

export default WithdrwalPopup;
