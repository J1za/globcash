import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import NP from 'number-precision';
import ButtonMUI from '../../../../shared/ButtonMUI';
import InputMUI from '../../../../shared/InputMUI';
import DialogMUI from '../../../../shared/DialogMUI';

import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import useWindowDimensions from '../../../../helpers/useWindowDimensions';
import * as yup from 'yup';

import {depositLongWallet} from '../LongIActions';
import {getWallets} from '../../../Dashboard/DashboardComponents/Wallet/walletActions';
import CoinIcon from '../../../../assets/images/rep_coin.svg';
import {ReactComponent as WithdrawSucces} from '../../../../assets/images/WithdrawSucces.svg';
import {ReactComponent as BotIcon} from '../../../../assets/images/bot.svg';

import './StartPortfolio.scss';
import {GlobixFixed} from '../../../../helpers/functions';
import {WalletRow} from '../../../Wallets/WalletsComponents/WalletInfo/WithdrawalTab';
import {putWithdrawalUSDT} from '../../../Dashboard/DashboardComponents/Wallet/walletActions';

const WithdrawForm = ({openWithdraw, closeWithdraw}) => {
  const dispatch = useDispatch();
  const {
    longInvestment: {
      coinCommission: {
        b_withdrawal_commission_percent,
        b_withdrawal_min_limit,
        b_withdrawal_max_limit,
        available,
        commission,
        max_sending
      },
      statistic: {balance_usdt}
    }
  } = useSelector(({longInvestment}) => ({longInvestment}));

  const [buttonLoad, setLoad] = useState(false);
  const [modalStatus, setModalStatus] = useState('withdraw');
  const [withdrawField, setWithdrawField] = useState(null);
  const [addressField, setAddressField] = useState('');

  const schema = yup.object({
    wallet: yup.string().min(9, 'Min 9 characters').required('Field is required'),
    amount: yup
      .number()
      .typeError('you must specify a number')
      .required('Field is required')
      /* .test(true, 'Out of balance', () => {
        return withdrawField > balance_usdt;
      }) */
      .min(+commission)
      .max(+max_sending)
    // .test(true, 'Out of limit', () => {
    //   return withdrawField <= max_sending;
    // })
    // .test(true, 'Out of limit', () => {
    //   return withdrawField >= commission;
    // })
  });

  const {width} = useWindowDimensions();

  const {
    handleSubmit,
    control,
    formState: {errors, isValid},
    reset,
    trigger,
    setValue
  } = useForm({
    mode: 'all',
    reValidateMode: 'all',
    resolver: yupResolver(schema),
    shouldFocusError: true,
    defaultValues: {
      amount: '',
      wallet: ''
    }
  });

  const close = () => {
    closeWithdraw();
    setTimeout(() => {
      setWithdrawField(null);
      reset();
      setModalStatus('withdraw');
    }, 500);
  };

  const withdrawAmount = (data) => {
    setAddressField(data.wallet);
    setModalStatus('confirm');
  };

  const confirm = () => {
    dispatch(
      depositLongWallet({
        wallet: addressField,
        amount: withdrawField
      })
    ).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 200) {
        setModalStatus('success');
      }
    });
  };

  return (
    <DialogMUI open={openWithdraw} onClose={close}>
      <div
        className={`dialog ${modalStatus === 'confirm' ? 'deposit_dialog' : 'dialog_deposit'}${
          modalStatus === 'success' ? '-success' : ''
        }`}
      >
        {modalStatus === 'success' ? (
          <>
            <div className='title'>Funds withdrawn successfully</div>

            <div className='descriptions'>Funds have been transfered from the investment balance to {addressField}</div>
            <div className='color'>{GlobixFixed(withdrawField - commission)} USDT</div>
            <WithdrawSucces />
            {/* <div className="glbx">
              <div className="description">
                You can check withdrawal status in Telegram
              </div>
              <a target='_blank' href='https://t.me/GlobixCashBot' className='good-hover'>
                <BotIcon /> Open the bot
              </a>
            </div> */}
          </>
        ) : modalStatus === 'confirm' ? (
          <>
            <h2>Withdrawal of funds</h2>
            <div className={`descriptions no_opacity mb-20`}>
              Please confirm sending <span>{GlobixFixed(withdrawField - commission)}</span> to the address:
            </div>
            <WalletRow address={addressField} />
            <div className={`button-group mt-40`}>
              <ButtonMUI variant='outlined' onClick={() => setModalStatus('withdraw')}>
                BACK
              </ButtonMUI>
              <ButtonMUI onClick={confirm}>confirm</ButtonMUI>
            </div>
          </>
        ) : modalStatus === 'withdraw' ? (
          <>
            <div className='title'>Withdraw to storage</div>
            <div className='descriptions'>internal investment balance</div>
            <div className='market'>
              <div className='left'>
                <img src={CoinIcon} alt='icon' />
                <div>
                  <span>Tether(ERC-20)</span>
                  <p>USDT</p>
                </div>
              </div>
              <div className='right'>
                <span>Balance</span>
                <p>{balance_usdt && balance_usdt} USDT</p>
              </div>
            </div>
            <form onSubmit={handleSubmit(withdrawAmount)} className='block'>
              <div className='amount'>
                <p>How much do you want to withdraw?</p>
                <div className='input_wrapper'>
                  <div className='input_label'>
                    <span>Wallet address</span>
                  </div>
                  <Controller
                    name='wallet'
                    control={control}
                    render={({field}) => (
                      <InputMUI
                        className='auth-box__input'
                        type='text'
                        fullWidth
                        error={errors.wallet?.message}
                        inputProps={field}
                        placeholder='Enter the wallet address'
                      />
                    )}
                  />
                </div>
                <div className='input_wrapper amount_field'>
                  <div className='input_label'>
                    <span>Amount</span>
                    <span>
                      Min: {commission} USDT Max: {max_sending < commission ? commission : max_sending} USDT
                    </span>
                  </div>
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
                        isFixed
                        stateSetter={setWithdrawField}
                        setValue={setValue}
                        /* onChange={(e) => {
                            setWithdrawField(e.target.value);
                          }} */
                      />
                    )}
                  />
                  <p
                    className='good-hover max'
                    onClick={() => {
                      setValue('amount', Number((max_sending <= balance_usdt ? max_sending : balance_usdt).toFixed(8)));
                      setWithdrawField(Number((max_sending <= balance_usdt ? max_sending : balance_usdt).toFixed(8)));

                      trigger('amount');
                    }}
                  >
                    MAX
                  </p>
                </div>
                {commission !== null && <span>Fee: {GlobixFixed(commission)} USD</span>}
              </div>

              <ButtonMUI fullWidth disabled={!isValid || buttonLoad} loading={buttonLoad} formAction>
                WITHDRAW
              </ButtonMUI>
            </form>
          </>
        ) : null}
      </div>
    </DialogMUI>
  );
};

export default WithdrawForm;
