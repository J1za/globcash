import React, { useState } from 'react';
import { ReactComponent as BgIcon } from '../../../../assets/images/bg_final.svg';
import { ReactComponent as CoinIcon } from '../../../../assets/images/coin_mini.svg';

import scalesIcon from '../../../../assets/images/scales.png';
import dartsIcon from '../../../../assets/images/darts.png';
import bulbIcon from '../../../../assets/images/bulb.png';

import { useDispatch, useSelector } from 'react-redux';
import { buyAvailableCoins, getStatistic, getRecentPurchases } from '../../LongInvestmentPage/LongIActions';

import { ButtonMUI, DialogMUI, CheckboxMUI, InputMUI } from '../../../../shared';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Slider from '@material-ui/core/Slider';
import check from '../../../../assets/images/check.svg';
import uncheck from '../../../../assets/images/uncheck.svg';

import { ReactComponent as WarningIcon } from '../../../../assets/images/warning.svg';
import { ReactComponent as СongratulationsIcon } from '../../../../assets/images/Сongratulations.svg';

import './FinalBlock.scss';
import { GlobixFixed } from '../../../../helpers/functions';
import BuyCoinModal from '../../LongInvestmentPage/AvailableCoins/BuyCoinModal';

const FinalBlock = ({
  tree_month,
  tree_month_risk,
  six_month,
  six_month_risk,
  one_year,
  one_year_risk,
  two_year,
  two_year_risk,
  currency,
  currency_price
}) => {
  let coin = [
    {
      time: '3 months',
      isAvailable: tree_month ? true : false,
      risk: (
        <p>
          <img src={dartsIcon} alt='icon' /> {tree_month_risk}
        </p>
      ),
      amount: `+${tree_month}%`
    },
    {
      time: '6 months',
      isAvailable: six_month ? true : false,
      risk: (
        <p>
          <img src={scalesIcon} alt='icon' /> {six_month_risk}{' '}
        </p>
      ),
      amount: `+${six_month}%`
    },
    {
      time: '1 year',
      isAvailable: one_year ? true : false,
      risk: (
        <p>
          <img src={bulbIcon} alt='icon' /> {one_year_risk}{' '}
        </p>
      ),
      amount: `+${one_year}%`
    },
    {
      time: '2 year',
      isAvailable: two_year ? true : false,
      risk: (
        <p>
          <img src={dartsIcon} alt='icon' /> {two_year_risk}
        </p>
      ),
      amount: `+${two_year}%`
    }
  ];

  const dispatch = useDispatch();

  const [amountField, setAmountField] = useState(null);

  const [checked, setChecked] = useState(false);
  const [buttonLoad, setLoad] = useState(false);
  const [checkedProfit, setCheckedProfit] = useState(false);
  const [checkedLoss, setCheckedLoss] = useState(false);
  const [percentStopLoss, setPercentStopLoss] = useState(null);
  const [percentProfitLoss, setPercentProfitLoss] = useState(null);

  const {
    longInvestment: { expertForecasts, expertForecastsLoad, statistic, investmentRequestTimeout, allCoins }
  } = useSelector(({ longInvestment, header }) => ({ longInvestment, header }));

  const [duration, setDuration] = useState(5);

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

  const [dialog, toggleDialog] = useState({
    status: false,
    info: {
      price: null,
      name: null,
      icon: null,
      code: null,
      id: null
    }
  });

  const closeDialog = (isReset) => {
    toggleDialog((prev) => ({ ...prev, status: false }));
    reset();
    setChecked(false);
    setCheckedLoss(false);
    setCheckedProfit(false);
    setLoad(false);
    if (isReset) {
      setAmountField(null);
    }
  };

  const schema = yup.object({
    amount: yup
      .number()
      .typeError('you must specify a number')
      .min(0, 'Should be a positive value')
      .required('Field is required')
      .test(true, 'Out of balance', () => {
        return amountField * dialog.info.price < statistic.balance_usdt;
      })
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

  const getDuration = (active) =>
    active === 2 ? '3 months' : active === 3 ? '6 months' : active === 4 ? '1 year' : active === 5 ? '2 years' : '';

  const buyAmount = () => {
    dispatch(
      buyAvailableCoins({
        amount: +amountField,
        currency_id: currency.id,
        duration: getDuration(duration),
        take_profit_percent: percentProfitLoss,
        stop_loss_percent: percentStopLoss
      })
    ).then((res) => {
      setLoad(false);
      closeDialog();
      if (res.payload && res.payload.status && res.payload.status === 201) {
        toggleDialogCongratulations({ status: true });
        dispatch(getStatistic());
        dispatch(getRecentPurchases());
      }
    });
  };

  return (
    <div className='final_block'>
      <div className='coin'>
        {coin &&
          coin.map(
            ({ isAvailable, amount, time, risk }) =>
              isAvailable && (
                <div>
                  <span>{time}</span>
                  <div className='coin_block'>
                    {risk}
                    <div>
                      <CoinIcon /> {amount}
                    </div>
                  </div>
                </div>
              )
          )}
      </div>
      <div className='color_block'>
        <div className='text'>Do you agree with the expert's opinion?</div>
        <button
          onClick={() =>
            toggleDialog({
              status: true,
              info: {
                price: currency.price,
                name: currency.name,
                icon: currency.icon,
                code: currency.code,
                id: currency.id
              }
            })
          }
          className='good-hover'
        >
          Buy {currency && currency.name && currency.name}
        </button>
        <BgIcon className='bg' />
      </div>

      <BuyCoinModal dialog={dialog} toggleDialog={toggleDialog} />
    </div>
  );
};

export default FinalBlock;
