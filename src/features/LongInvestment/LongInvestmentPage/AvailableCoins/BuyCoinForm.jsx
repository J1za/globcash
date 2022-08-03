import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import DialogMUI from '../../../../shared/DialogMUI';
import CheckboxMUI from '../../../../shared/CheckboxMUI';
import Slider from '@material-ui/core/Slider';
import ButtonMUI from '../../../../shared/ButtonMUI';
import {buyAvailableCoins, getRecentPurchases, getStatistic} from '../LongIActions';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';

import {ReactComponent as WarningIcon} from '../../../../assets/images/warning.svg';
import {ReactComponent as СongratulationsIcon} from '../../../../assets/images/Сongratulations.svg';

import {ReactComponent as FinanceIcon} from '../../../../assets/images/finance_mini.svg';

import check from '../../../../assets/images/check.svg';
import uncheck from '../../../../assets/images/uncheck.svg';
import './AvailableCoins.scss';
import InputMUI from '../../../../shared/InputMUI';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';

import {GlobixFixed} from '../../../../helpers/functions';

const BuyCoinForm = ({isModalInner, setFirstStep, dialog, setOuterAmount}) => {
  const marks = [
    {
      value: 2,
      label: '3m'
    },
    {
      value: 3,
      label: '6m'
    },
    {
      value: 4,
      label: '1y'
    },
    {
      value: 5,
      label: '2y'
    }
  ];

  const [dialogCongratulations, toggleDialogCongratulations] = useState(false);

  const [checked, setChecked] = useState(false);
  const [checkedProfit, setCheckedProfit] = useState(false);
  const [checkedLoss, setCheckedLoss] = useState(false);

  const [duration, setDuration] = useState(marks[0].value);
  const [percentStopLoss, setPercentStopLoss] = useState(null);
  const [percentProfitLoss, setPercentProfitLoss] = useState(null);

  const getDuration = (active) =>
    active === 2 ? '3 months' : active === 3 ? '6 months' : active === 4 ? '1 year' : active === 5 ? '2 years' : '';

  const [buttonLoad, setLoad] = useState(false);

  const [amountField, setAmountField] = useState(null);

  const dispatch = useDispatch();

  const {
    longInvestment: {
      statistic,
      investmentRequestTimeout,
      coinCommission: {exchange_refill_commission}
    }
  } = useSelector(({longInvestment}) => ({
    longInvestment
  }));

  const schema = yup.object({
    amount: yup
      .number()
      .typeError('you must specify a number')
      .min(0.00000001, 'The value should be greater than 0.00000001')
      .required('Field is required')
      .test(true, 'Out of balance', () => {
        return amountField * dialog.info.price < statistic.balance_usdt;
      }),
    take_profit_percent:
      checkedProfit &&
      yup
        .number()
        .typeError('you must specify a number')
        .min(0.01, 'The value should be greater than 0.01')
        .max(100, 'Max 100% ')
        .required('Field is required')
        .test(true, 'Only two decimal places', () => {
          return typeof percentProfitLoss === 'string' &&
            percentProfitLoss !== undefined &&
            percentProfitLoss.includes('.')
            ? percentProfitLoss.split('.')[1].length <= 2
            : true;
        }),
    stop_loss_percent:
      checkedLoss &&
      yup
        .number()
        .typeError('you must specify a number')
        .min(0.01, 'The value should be greater than 0.01')
        .max(100, 'Max 100% ')
        .required('Field is required')
        .test(true, 'Only two decimal places', () => {
          return typeof percentStopLoss === 'string' && percentStopLoss !== undefined && percentStopLoss.includes('.')
            ? percentStopLoss.split('.')[1].length <= 2
            : true;
        })
  });

  const {
    handleSubmit,
    setError,
    control,
    formState: {errors, isValid},
    setValue,
    getValues,
    reset,
    register,
    trigger,
    unregister
  } = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
    shouldFocusError: true,
    defaultValues: {
      amount: ''
    }
  });

  const toggleSwitch = (val, name) => {
    switch (name) {
      case 'take_profit_percent':
        setCheckedProfit(val);
        setPercentProfitLoss(null);
        break;
      case 'stop_loss_percent':
        setCheckedLoss(val);
        setPercentStopLoss(null);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (checkedProfit) {
      register('take_profit_percent');
      trigger('take_profit_percent');
    } else {
      unregister('take_profit_percent');
    }
  }, [checkedProfit, unregister, register]);

  useEffect(() => {
    if (checkedLoss) {
      register('stop_loss_percent');
      trigger('stop_loss_percent');
    } else {
      unregister('stop_loss_percent');
    }
  }, [checkedLoss, unregister, register]);

  const buyAmount = () => {
    dispatch(
      buyAvailableCoins({
        amount: +amountField,
        currency_id: dialog.info.id,
        duration: getDuration(duration),
        take_profit_percent: percentProfitLoss,
        stop_loss_percent: percentStopLoss
      })
    ).then((res) => {
      setLoad(false);
      if (res.payload && res.payload.status && res.payload.status === 201) {
        if (isModalInner) {
          setOuterAmount(res.payload.data.amount);
          closeDialogCongratulations();
          setFirstStep(false);
        } else {
          setAmountField(res.payload.data.amount);
          toggleDialogCongratulations(true);
        }
        dispatch(getRecentPurchases());
        dispatch(getStatistic());
      }
    });
  };

  const closeDialogCongratulations = () => {
    toggleDialogCongratulations(false);
    reset();
    setChecked(false);
    setCheckedLoss(false);
    setCheckedProfit(false);
    setLoad(false);
    if (isModalInner) setFirstStep(true);
    setDuration(marks[0].value);
    setAmountField(null);
  };

  return (
    <>
      <form onSubmit={handleSubmit(buyAmount)} className='block sent_to_user'>
        <div className='amount'>
          <p>How much do you want to buy?</p>

          <div>
            <div className='block'>
              <p>Amount</p>
              <div>
                <Controller
                  name='amount'
                  control={control}
                  render={({field}) => (
                    <InputMUI
                      className='auth-box__input'
                      type='text'
                      fullWidth
                      placeholder={dialog.info.code}
                      error={errors.amount?.message}
                      inputProps={field}
                      isFixed
                      stateSetter={setAmountField}
                      setValue={setValue}
                      /* onChange={(e) =>
                  setAmountField(
                    e.target.value * dialog.info.price > statistic.balance_usdt
                      ? statistic.balance_usdt / dialog.info.price
                      : e.target.value
                  )
                } */
                    />
                  )}
                />
              </div>
              {amountField && amountField.length > 0 && (
                <span className={`buy-coin-fee`}>
                  Fee: ~
                  {(amountField * exchange_refill_commission) / 100 < 0.00000001
                    ? 0.00000001
                    : GlobixFixed((amountField * exchange_refill_commission) / 100)}
                </span>
              )}
            </div>
            <div className='info_price'>
              <span>
                {dialog.info.price && amountField ? GlobixFixed(amountField * dialog.info.price) : '0.00'} USDT
              </span>
            </div>
          </div>
        </div>
        {!isModalInner && dialog.info.balance_usdt && (
          <div className='info_balance'>
            <FinanceIcon /> {GlobixFixed(dialog.info.balance_usdt)} USDT is available on your investment balance.
          </div>
        )}
        <div className='deposit'>
          <p>Term of deposit</p>
          <div className='rate'>
            <Slider
              defaultValue={marks[0].value}
              aria-labelledby='discrete-slider'
              valueLabelDisplay='auto'
              step={1}
              marks={marks}
              min={2}
              max={5}
              onChange={(e, val) => setDuration(val)}
            />
          </div>
        </div>
        <div className='checkbox'>
          <CheckboxMUI
            checkedIcon={<img src={check} alt='check' />}
            icon={<img src={uncheck} alt='uncheck' />}
            onChange={(e, val) => {
              toggleSwitch(val, 'take_profit_percent');
            }}
            checked={checkedProfit}
          />
          <p>Take Profit, %</p>
        </div>
        {checkedProfit && (
          <div className='input-percent'>
            <div className='block'>
              <div>
                <Controller
                  name='take_profit_percent'
                  control={control}
                  render={({field}) => (
                    <InputMUI
                      className='auth-box__input'
                      type='text'
                      fullWidth
                      placeholder={'Enter the Take Profit percent, %'}
                      error={errors.take_profit_percent?.message}
                      inputProps={field}
                      isFixed
                      stateSetter={setPercentProfitLoss}
                      setValue={setValue}
                      // onChange={(e) => console.log(percentProfitLoss)}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        )}
        <div className='checkbox'>
          <CheckboxMUI
            checkedIcon={<img src={check} alt='check' />}
            icon={<img src={uncheck} alt='uncheck' />}
            onChange={(e, val) => {
              toggleSwitch(val, 'stop_loss_percent');
            }}
            checked={checkedLoss}
          />
          <p>Stop Loss, %</p>
        </div>
        {checkedLoss && (
          <div className='input-percent'>
            <div className='block'>
              <div>
                <Controller
                  name='stop_loss_percent'
                  control={control}
                  render={({field}) => (
                    <InputMUI
                      className='auth-box__input'
                      type='text'
                      fullWidth
                      placeholder={'Enter the Stop Loss percent, %'}
                      error={errors.stop_loss_percent?.message}
                      inputProps={field}
                      isFixed
                      stateSetter={setPercentStopLoss}
                      setValue={setValue}
                      //onChange={(e) => setPercentStopLoss(e.target.value)}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        )}
        <div className='checkbox'>
          <CheckboxMUI
            checkedIcon={<img src={check} alt='check' />}
            icon={<img src={uncheck} alt='uncheck' />}
            onChange={(e, val) => setChecked(val)}
            checked={checked}
          />
          <p>I am familiar with the company's policy in relation to savings accounts*</p>
        </div>

        <div className='color_block'>
          <WarningIcon />
          The company does not guarantee income from buying currency in the event of a fall in the rate.
        </div>

        <ButtonMUI fullWidth disabled={!isValid || buttonLoad || !checked} loading={buttonLoad} formAction>
          Buy {!amountField ? <div> 0.0 </div> : <div>{amountField}</div>}
          {dialog.info.code}
        </ButtonMUI>
      </form>

      {!isModalInner && (
        <DialogMUI open={dialogCongratulations} onClose={closeDialogCongratulations}>
          <div className='dialog dialog_congratulations'>
            <div className='title'>Сongratulations</div>
            <div className='descriptions'>
              An application to buy {amountField} {dialog.info.code} has been generated and will be processed within{' '}
              {investmentRequestTimeout} minutes.
            </div>
            <div className='color'>
              {amountField} {dialog.info.code}
            </div>
            <СongratulationsIcon />
          </div>
        </DialogMUI>
      )}
    </>
  );
};

export default BuyCoinForm;
