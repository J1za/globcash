import React, {useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import ButtonMUI from '../../../../shared/ButtonMUI';
import DialogMUI from '../../../../shared/DialogMUI';
import {Controller, useForm} from 'react-hook-form';
import {useDispatch, useSelector} from 'react-redux';
import {GlobixFixed} from '../../../../helpers/functions';
import {sellCoins, getStatistic} from '../LongIActions';
import moment from 'moment';
import 'react-toastify/dist/ReactToastify.css';
import './Portfolio.scss';
import InputMUI from '../../../../shared/InputMUI';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';

const SellCoinModal = ({dialogSell, closeDialogSell}) => {
  const dispatch = useDispatch();
  const [amountField, setAmountField] = useState(null);

  const [buttonLoad, setLoad] = useState(false);

  const schema = yup.object({
    amount: yup
      .number()
      .typeError('you must specify a number')
      .min(0, 'Should be a positive number')
      .required('Field is required')
      .test(true, 'Out of balance', () => {
        return amountField * dialogSell.info.price <= dialogSell.info.amount;
      })
  });

  const {
    handleSubmit,
    control,
    formState: {errors, isValid},
    reset,
    setValue,
    trigger
  } = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
    shouldFocusError: true,
    defaultValues: {
      amount: ''
    }
  });

  const sellAmount = () => {
    dispatch(
      sellCoins({
        investment_id: dialogSell.info.id,
        amount: +amountField
      })
    ).then((res) => {
      setLoad(false);
      if (res.payload && res.payload.status && res.payload.status === 201) {
        closeDialogSell();
        reset();
        dispatch(getStatistic());
      } else {
        Object.values(res.error.response.data)
          .flat()
          .forEach((el) => toast.error(el, {}));
      }
    });
  };

  const {
    longInvestment: {coinCommission, coinCommissionLoad, statisticInner}
  } = useSelector(({longInvestment}) => ({longInvestment}));

  let feeValue =
    dialogSell.info.pnl !== null
      ? dialogSell.info.pnl > 0
        ? (coinCommission.exchange_withdrawal_commission_for_profit *
            ((((dialogSell.info.price * amountField * 100) / dialogSell.info.amount) * dialogSell.info.pnl) / 100)) /
          100
        : (coinCommission.exchange_withdrawal_commission_for_loss * (dialogSell.info.price * amountField)) / 100
      : 0;

  return (
    <DialogMUI
      open={dialogSell.status}
      onClose={() => {
        closeDialogSell();
        reset();
      }}
    >
      <div className='dialog dialog_sell'>
        <div className='title'>Sell a coin</div>
        <div className='descriptions'>On your portfolio</div>
        <h3>
          deposit term: {dialogSell.info.duration}
          <span>ends in {moment(dialogSell.info.end_date).format('DD.MM.YY')}</span>
        </h3>
        <div className='market'>
          <div className='left'>
            {dialogSell.info.icon !== null ? <img src={dialogSell.info.icon} alt='icon' /> : <span />}
            <div>
              <span>{dialogSell.info.name}</span>
              <p>{dialogSell.info.code}</p>
            </div>
          </div>
          <div className='right'>
            <span>Hold balance</span>
            <p>{dialogSell.info.amount ? <p>{GlobixFixed(dialogSell.info.amount)}{' '}USDT </p> : null}</p>
          </div>
        </div>
        <div className='color_block'>
          When withdrawing stakes, the company withdraws{' '}
          <span>
            {dialogSell.info.pnl > 0
              ? coinCommission.exchange_withdrawal_commission_for_profit
              : coinCommission.exchange_withdrawal_commission_for_loss}
            %
          </span>{' '}
          of the commission from the net income for managing the account.
        </div>
        <form onSubmit={handleSubmit(sellAmount)} className='block '>
          <div className='amount'>
            <p>How much do you want to sell?</p>
            <div>
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
                    isFixed
                    stateSetter={setAmountField}
                    setValue={setValue}
                    /* onChange={(e) => {
                  setAmountField(
                    e.target.value * dialogSell.info.price >= dialogSell.info.amount
                      ? dialogSell.info.amount / dialogSell.info.price
                      : e.target.value
                  );
                }} */
                  />
                )}
              />
              <p
                className='good-hover max'
                onClick={() => {
                  setValue('amount', (dialogSell.info.amount / dialogSell.info.price).toFixed(8));
                  setAmountField((dialogSell.info.amount / dialogSell.info.price).toFixed(8));
                  trigger();
                }}
              >
                MAX
              </p>
            </div>
            <span>Fee: {GlobixFixed(feeValue)} USDT</span>
          </div>

          <ButtonMUI fullWidth disabled={!isValid || buttonLoad} loading={buttonLoad} formAction>
            Sell
            {!amountField ? <div> 0.0 </div> : <div>{amountField} </div>}
            {dialogSell.info.code}
          </ButtonMUI>
        </form>
      </div>
    </DialogMUI>
  );
};

export default SellCoinModal;
