import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import InputMUI from '../../../../../shared/InputMUI';
import ButtonMUI from '../../../../../shared/ButtonMUI';
import { yupResolver } from '@hookform/resolvers/yup';
import { ReactComponent as WarningIcon } from '../../../../../assets/images/warning.svg';
import { ReactComponent as BitcoinIcon } from '../../../../../assets/images/bitcoin.svg';
import { ReactComponent as СongratulationsIcon } from '../../../../../assets/images/cong.svg';
import { ReactComponent as StIcon } from '../../../../../assets/images/st_icon.svg';
import './StakingInvestDialog.scss';
import { getCurIco, curToFixed } from '../../../../../helpers/currencyNaming';
import { GlobixFixed, replaceComas } from '../../../../../helpers/functions';
import { getStakingCheck, StakingAdd } from '../../StakingPageActions';

const StakingInvestDialog = ({ label, selectedStaking, selectedWallet, selectedStakingInfo }) => {
  const dispatch = useDispatch();
  const isInv = label.includes('inv');
  const currency = isInv
    ? label.split('inv')[1].toUpperCase()
    : 'USDT';
  const {
    wallets: { wallets, activeWallet },
    walletChart: { walletsInfo, loadingWallets },
    stakingPage: { staking_info, staking_desc, stakingPercents }
  } = useSelector(({ wallets, walletChart, stakingPage }) => ({
    wallets,
    walletChart,
    stakingPage
  }));
  const [amountField, setAmountField] = useState(null);
  const [buttonLoad, setLoad] = useState(false);
  const [step, setStep] = useState(1);
  const [checkResult, setCheckResult] = useState({ amount: 38800, commission: 1200 });

  const schema = yup.object({
    amount: yup
      .number()
      .typeError('you must specify a number')
      .min(
        selectedStaking.min + (selectedStaking.commission * amountField) / 100,
        `Min ${selectedStaking.min + (selectedStaking.commission * amountField) / 100} ${selectedWallet.short_name}`
      )
      //.max(selectedStaking.max, `Max ${selectedStaking.max} ${selectedWallet.short_name}`)
      .max(
        selectedWallet.balance <= selectedStaking.max ? selectedWallet.balance : selectedStaking.max,
        `${selectedWallet.balance <= selectedStaking.max
          ? 'Out of balance'
          : `Max ${selectedStaking.max} ${selectedWallet.short_name}`
        }`
      )
      .required('Field is required')
  });

  const {
    handleSubmit,
    setError,
    control,
    formState: { errors, isValid },
    setValue,
    getValues,
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

  const renderWallet = () => {
    return (
      <div className='market'>
        <div className='left'>
          {getCurIco(isInv ? currency.toLowerCase() : 'usdterc')}
          <div>
            <span>{selectedWallet.long_name}</span>
            <p>{selectedWallet.short_name}</p>
          </div>
        </div>
        <div className='right'>
          <span>Balance</span>
          <p>{curToFixed(isInv ? currency.toLowerCase() : 'usdterc', selectedWallet.balance, true)} {currency}</p>
        </div>
      </div>
    );
  };

  return (
    <div className='staking_invest_dialog'>
      {step === 1 ? (
        <div className='form_bock'>
          <div className='title'>Staking invest</div>
          <div className='descriptions'>From wallet:</div>
          {renderWallet()}
          <form
            className='block sent_to_user'
            onSubmit={handleSubmit((data) => {
              dispatch(getStakingCheck(label, data)).then((res) => {
                if (res.payload && res.payload.status && res.payload.status === 200) {
                  setCheckResult(res.payload.data);
                  setStep(2);
                }
              });
            })}
          >
            <div className='amount'>
              <p>How much do you want to deposit?</p>
              <div>
                <div className='block'>
                  <div className='info'>
                    <p>Amount</p>
                    <p>
                      Min: {selectedStaking.min} {selectedWallet.short_name} Max: {selectedStaking.max}{' '}
                      {selectedWallet.short_name}
                    </p>
                  </div>
                  <div>
                    <Controller
                      name='amount'
                      control={control}
                      render={({ field }) => (
                        <InputMUI
                          className='auth-box__input'
                          type='text'
                          fullWidth
                          placeholder=''
                          error={errors.amount?.message}
                          inputProps={field}

                          isFixed
                          stateSetter={setAmountField}
                          setValue={setValue}
                          /* onChange={(e) => {
                            setTimeout(() => setValue('amount', replaceComas(e.target.value)), 1)
                            setAmountField(replaceComas(e.target.value));
                          }} */
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
              <span>
                Fee: ~{GlobixFixed((selectedStaking.commission * amountField) / 100, 2)} {selectedWallet.short_name}
              </span>
            </div>
            <ButtonMUI fullWidth disabled={!isValid || buttonLoad} loading={buttonLoad} formAction>
              Invest
            </ButtonMUI>
          </form>
        </div>
      ) : step === 2 ? (
        <div className='confirm'>
          <div className='title'>Staking invest</div>
          <span>Please check the details of the transaction and confirm the staking.</span>
          <div className='descriptions'>REPLENISHMENT DETAILS:</div>
          <div className='color'>
            <div className='name'>
              <div>
                <img src={selectedStakingInfo.image} />
              </div>
              {selectedStakingInfo.name}
            </div>
            <div className='interest'>
              {label === 'stake' || label === 'inv' || label === 'invglbx'
                ? `${stakingPercents[label === 'stake' || label === 'inv' ? 'inv' : label].percent}%`
                : 'Float'}{' '}
              interest
            </div>
          </div>
          <div className='info'>
            <span>Amount</span>
            <p>
              {GlobixFixed(checkResult.amount, 2)} {selectedWallet.short_name}
            </p>
          </div>
          <div className='info'>
            <span>Fee</span>
            <p>
              {GlobixFixed(checkResult.commission, 2)} {selectedWallet.short_name}
            </p>
          </div>
          <div className='btn_wrapper'>
            <ButtonMUI onClick={() => setStep(1)} variant='outlined'>
              BACK
            </ButtonMUI>
            <ButtonMUI
              onClick={() => {
                dispatch(StakingAdd(label, { amount: checkResult.amount + checkResult.commission })).then((res) => {
                  if (res.payload && res.payload.status && res.payload.status === 200) {
                    setCheckResult(res.payload.data);
                    setStep(3);
                  }
                });
              }}
            >
              confirm
            </ButtonMUI>
          </div>
        </div>
      ) : step === 3 ? (
        <div className='congratulations'>
          <div className='title'>Сongratulations!</div>

          <div className='descriptions'>You have successfully replenished {selectedStakingInfo.name} staking.</div>
          <div className='color'>
            {GlobixFixed(checkResult.amount, 2)} {selectedWallet.short_name}
          </div>
          <СongratulationsIcon />
          <div className='info'>
            Deposit:{' '}
            <span>
              {' '}
              {GlobixFixed(checkResult.new_balance, 2)} {selectedWallet.short_name}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default StakingInvestDialog;
