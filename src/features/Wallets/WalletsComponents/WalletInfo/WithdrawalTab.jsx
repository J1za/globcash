import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { InputMUI, ButtonMUI } from '../../../../shared';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { curToFixed } from '../../../../helpers/currencyNaming';
import { ReactComponent as WalletIco } from '../../../../assets/images/walletIco.svg';
import SendingConfirmationDialog from './SendingConfirmationDialog';
import { useToggle } from '../../../../helpers/hooks';
import { replaceComas } from '../../../../helpers/functions';

export const WalletRow = ({ address }) => (
  <div className='wallet-ico-with-address'>
    <WalletIco />
    <div className='right-side'>
      <p>Recipient wallet:</p>
      <span>{address}</span>
    </div>
  </div>
);

const WithdrawalTab = ({ }) => {
  const dispatch = useDispatch();
  const {
    wallets: { wallets, activeWallet, withdrawal_check, successWithdraw },
    sendToWallet: { userWallet }
  } = useSelector(({ wallets, sendToWallet }) => ({
    wallets,
    sendToWallet
  }));
  const [finalStep, setFinalStep] = useState(false);
  const [buttonLoad, setLoad] = useState(false);
  const [amountField, setAmountField] = useState(null);
  const [addressField, setAddressField] = useState(null);
  const [dialog, toggleDialog] = useToggle();

  const schema = yup.object({
    address: yup
      .string()
      .min(9, 'Min 9 characters')
      .required('Field is required')
      .test(true, 'Can`t send to yourself', () => {
        return !Object.values(wallets).some((el) => el.address === addressField);
      }),
    amount: yup
      .number()
      .typeError('you must specify an amount')
      .required('Field is required')
      .min(withdrawal_check[activeWallet].commission, `Amount can't be less than commission`)
      .test(true, 'Out of balance', () => {
        return amountField <= Number(withdrawal_check[activeWallet].available);
      })
  });

  const {
    control,
    handleSubmit,
    setError,
    register,
    formState: { errors, isValid, isDirty },
    setValue,
    getValues,
    reset
  } = useForm({
    mode: 'all',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(schema),
    shouldFocusError: true,
    defaultValues: {
      address: '',
      amount: ''
    }
  });

  useEffect(() => {
    reset();
    setFinalStep(false);
  }, [successWithdraw])

  return (
    <div className='block withdraw'>
      <div className='top'>
        {!finalStep ? (
          <>
            <p className='title'>Enter the recipient's {wallets[activeWallet].short_name} address.</p>
            <p className='attention'>
              Be careful with this, in case of an error, the funds unfortunately cannot be returned.
            </p>
          </>
        ) : (
          <WalletRow address={addressField} />
        )}
      </div>
      <form onSubmit={handleSubmit(() => toggleDialog())} className='bottom'>

        <div className={`first-step${!finalStep ? ' visible' : ''}`}>
          <div className='block'>
            <span>Wallet address</span>
            <div>
              <Controller
                name='address'
                control={control}
                render={({ field }) => (
                  <>
                    <InputMUI
                      className='auth-box__input'
                      type='text'
                      fullWidth
                      error={errors.address?.message}
                      inputProps={field}
                      placeholder='Enter the address of the wallet'
                      onChange={(e) => {
                        setAddressField(e.target.value);
                      }}
                    />
                  </>
                )}
              />
            </div>
          </div>
          <ButtonMUI fullWidth disabled={errors.address?.message || !isDirty} onClick={() => {
            setValue('amount', '');
            setFinalStep(true);
          }}>
            NEXT
          </ButtonMUI>
        </div>

        <div className={`second-step${finalStep ? ' visible' : ''}`}>
          <div className='block'>
            <span>Transfer amount</span>
            <div>
              <Controller
                name='amount'
                control={control}
                render={({ field }) => (
                  <InputMUI
                    className='auth-box__input'
                    type='text'
                    fullWidth
                    error={errors.amount?.message}
                    control={control}
                    inputProps={field}
                    placeholder='Amount'

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
              <p
                className='good-hover'
                onClick={() => {
                  setValue('amount', curToFixed(activeWallet, withdrawal_check[activeWallet].available));
                  setAmountField(curToFixed(activeWallet, withdrawal_check[activeWallet].available));
                }}
              >
                MAX
              </p>
            </div>
            <span className='commission'>Fee: {withdrawal_check[activeWallet].commission}</span>
          </div>
          <ButtonMUI
            fullWidth
            disabled={/*errors.amount?.message  || !isDirty  ||*/ buttonLoad}
            loading={buttonLoad}
            formAction
          >
            Withdraw
            {!amountField ? <div> 0.0 </div> : <div>{curToFixed(activeWallet, amountField, true)}</div>}
            {wallets[activeWallet].short_name}
          </ButtonMUI>
        </div>

      </form>
      <SendingConfirmationDialog
        dialog={dialog}
        toggleDialog={toggleDialog}
        isWithdraw
        withdrawData={{
          amount: amountField,
          wallet: addressField
        }}
      />
    </div>
  );
};

export default WithdrawalTab;
