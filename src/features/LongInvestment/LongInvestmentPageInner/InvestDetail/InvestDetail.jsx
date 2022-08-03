import React, {useState, useEffect} from 'react';
import {ReactComponent as ArrowRedIcon} from '../../../../assets/images/arrow_down_red.svg';
import {ReactComponent as ArrowGreenIcon} from '../../../../assets/images/arrow_top_green.svg';
import {ReactComponent as TimeIcon} from '../../../../assets/images/time_icon.svg';
import {ReactComponent as SellIcon} from '../../../../assets/images/sell.svg';
import {ReactComponent as PlusIcon} from '../../../../assets/images/plus_w.svg';
import {ReactComponent as MoreInfoIcon} from '../../../../assets/images/more_info.svg';
import './InvestDetail.scss';
import DialogMUI from '../../../../shared/DialogMUI';
import Slider from '@material-ui/core/Slider';
import CheckboxMUI from '../../../../shared/CheckboxMUI';
import check from '../../../../assets/images/check.svg';
import uncheck from '../../../../assets/images/uncheck.svg';
import {ReactComponent as WarningIcon} from '../../../../assets/images/warning.svg';
import ButtonMUI from '../../../../shared/ButtonMUI';
import {ReactComponent as СongratulationsIcon} from '../../../../assets/images/Сongratulations.svg';

import {toast} from 'react-toastify';
import moment from 'moment';
import {useSelector, useDispatch} from 'react-redux';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {Controller, useForm} from 'react-hook-form';
import InputMUI from '../../../../shared/InputMUI';
import {PropagateLoader} from 'react-spinners';

import {
  prolongInvestCoins,
  sellCoins,
  getStatistic,
  buyAvailableCoins,
  getRecentPurchases
} from '../../LongInvestmentPage/LongIActions';
import {GlobixFixed} from '../../../../helpers/functions';
import BuyCoinModal from '../../LongInvestmentPage/AvailableCoins/BuyCoinModal';
import SellCoinModal from '../../LongInvestmentPage/Portfolio/SellCoinModal';

let Active = {};

const endsInvest = ['week', 'month', 'year', 'two year', 'three year'];

const InvestDetail = () => {
  const {
    longInvestment: {
      statisticInner,
      statisticLoad,
      statistic,
      investmentRequestTimeout,
      statisticInner: {
        total_pnl_usdt,
        total_pnl_percent,
        current_amount,
        usdt_invested = 0,
        amount = 0,
        usdt_amount = 0,
        exchange_withdrawal_commission = 0,
        created_date,
        end_date
      }
    }
  } = useSelector(({longInvestment}) => ({longInvestment}));

  const {currency, duration, id, price} = statisticInner;

  const durationDeposit = moment(end_date).diff(created_date, 'days');

  const dispatch = useDispatch();

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
  const [checked, setChecked] = useState(false);
  const [durations, setDurations] = useState(5);
  const [amountField, setAmountField] = useState(null);

  const getDurations = (active) =>
    active === 2 ? '3 months' : active === 3 ? '6 months' : active === 4 ? '1 year' : active === 5 ? '2 years' : '';

  const [buttonLoad, setLoad] = useState(false);

  const [dialogProlong, toggleDialogProlong] = useState({
    status: false,
    info: {
      price: null,
      name: null,
      icon: null,
      code: null,
      amount: null,
      id: null
    }
  });

  const [dialogSell, toggleDialogSell] = useState({
    status: false,
    info: {
      price: null,
      name: null,
      icon: null,
      code: null,
      amount: null,
      id: null,
      duration: null,
      end_date: null,
      pnl: total_pnl_usdt
    }
  });

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

  const [dialogCongratulations, toggleDialogCongratulations] = useState({
    status: false
  });
  const prolongInvest = () => {
    dispatch(
      prolongInvestCoins(id, {
        duration: getDurations(durations)
      })
    ).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 201) {
        closeDialog();
      } else {
        Object.values(res.error.response.data)
          .flat()
          .forEach((el) => toast.error(el, {}));
      }
    });
  };

  const closeDialog = (isReset) => {
    toggleDialogProlong((prev) => ({...prev, status: false}));
    toggleDialog((prev) => ({...prev, status: false}));
    setChecked(false);
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
        return amountField * dialogSell.info.price <= dialogSell.info.amount;
      })
  });

  const {
    handleSubmit,
    control,
    formState: {errors, isValid},
    reset,
    setValue
  } = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
    shouldFocusError: true,
    defaultValues: {
      amount: ''
    }
  });

  const buyAmount = () => {
    dispatch(
      buyAvailableCoins({
        amount: +amountField,
        currency_id: currency.id,
        duration: getDurations(durations)
      })
    ).then((res) => {
      setLoad(false);
      closeDialog();
      if (res.payload && res.payload.status && res.payload.status === 201) {
        toggleDialogCongratulations({status: true});
        dispatch(getRecentPurchases());
        dispatch(getStatistic());
      }
    });
  };
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
        dispatch(getStatistic());
      } else {
        Object.values(res.error.response.data)
          .flat()
          .forEach((el) => toast.error(el, {}));
      }
    });
  };

  const closeDialogSell = () => {
    toggleDialogSell((prev) => ({...prev, status: false}));
    reset();
  };

  const closeDialogCongratulations = () => {
    toggleDialogCongratulations((prev) => ({...prev, status: false}));
    setAmountField(null);
  };
  return (
    <div className={`Invest_detail_block ${statisticLoad ? '_loading' : ''}`}>
      <div className='title'>Invest detail</div>
      {statisticLoad ? (
        <div style={{position: 'absolute', left: '50%', top: '50%'}}>
          <PropagateLoader color={'#3579FC'} />
        </div>
      ) : (
        <>
          <div className='descriptions'>term of deposit</div>
          <div className='time'>
            <TimeIcon />
            {moment(created_date).format('DD.MM.YYYY')} - {moment(end_date).format('DD.MM.YYYY')}
            <p>(ends {moment(end_date).fromNow()})</p>
          </div>
          {durationDeposit > 30 ? null : (
            <div className='more_info'>
              <span>Prolong your investment if you want to keep the coin in your portfolio.</span>
              <button
                className='good-hover'
                onClick={() =>
                  toggleDialogProlong({
                    status: true,
                    info: {
                      name: currency.name,
                      code: currency.code,
                      icon: currency.icon,
                      amount: usdt_amount
                    }
                  })
                }
              >
                <MoreInfoIcon /> Prolong invest
              </button>
            </div>
          )}
          <div className='block'>
            <div className='info'>
              <div>
                <span>Invested funds (USDT)</span>
                <span>{GlobixFixed(usdt_invested)}</span>
              </div>
              <div>
                <span>In cryptocurrency ({currency.name})</span>
                <span>{GlobixFixed(amount)}</span>
              </div>
              <hr />
              <div>
                <span>PNL for all the time</span>
                <span>
                  <p className={`${total_pnl_percent > 0 ? 'green' : 'red'}`}>
                    {+total_pnl_percent > 0 ? (
                      <>
                        <ArrowGreenIcon /> +
                      </>
                    ) : (
                      <>
                        <ArrowRedIcon />
                      </>
                    )}
                    {total_pnl_percent && Number(total_pnl_percent).toFixed(2)}%
                  </p>
                  {total_pnl_usdt && total_pnl_percent > 0
                    ? GlobixFixed((total_pnl_usdt * (100 - exchange_withdrawal_commission)) / 100)
                    : GlobixFixed(total_pnl_usdt)}{' '}
                  USDT
                </span>
              </div>
              {!Active ? null : (
                <div>
                  <span>Funds now (USDT)</span>
                  <span>{GlobixFixed(usdt_amount)}</span>
                </div>
              )}

              <div>
                <span>In cryptocurrency now ({currency.name})</span>
                <span>{GlobixFixed(current_amount)}</span>
              </div>
              <div>
                <span>Fee (%)</span>
                <span>{GlobixFixed(exchange_withdrawal_commission)}</span>
              </div>
            </div>
            <div className='amount'>
              <span>Net amount</span>
              <p>
                {total_pnl_percent < 0
                  ? GlobixFixed((usdt_amount * (100 - exchange_withdrawal_commission)) / 100)
                  : GlobixFixed(usdt_amount)}{' '}
                USDT
              </p>
            </div>
          </div>
          {!Active ? (
            <div className='btn_download active'>
              <button
                className='buy good-hover'
                onClick={() => {
                  toggleDialog({
                    status: true,
                    info: {
                      price: currency.price,
                      name: currency.name,
                      icon: currency.icon,
                      code: currency.code,
                      id: currency.id
                    }
                  });
                }}
              >
                <PlusIcon />
                Buy more
              </button>
            </div>
          ) : (
            <div className='btn_download inactive'>
              <button
                className='buy good-hover'
                onClick={() => {
                  console.log(currency);
                  toggleDialog({
                    status: true,
                    info: {
                      price: currency.price,
                      name: currency.name,
                      icon: currency.icon,
                      code: currency.code,
                      id: currency.id
                    }
                  });
                }}
              >
                <PlusIcon />
                Buy more
              </button>
              <button
                className='sell good-hover'
                onClick={() =>
                  toggleDialogSell({
                    status: true,
                    info: {
                      name: currency.name,
                      code: currency.code,
                      icon: currency.icon,
                      amount: usdt_amount,
                      duration: duration,
                      end_date: end_date,
                      price: price,
                      id: id,
                      pnl: total_pnl_usdt
                    }
                  })
                }
              >
                <SellIcon />
                Sell
              </button>
            </div>
          )}
          <SellCoinModal dialogSell={dialogSell} closeDialogSell={closeDialogSell} />
          <DialogMUI open={dialogProlong.status} onClose={closeDialog}>
            <div className='dialog dialog_prolong'>
              <div className='title'>Prolong invest</div>
              <div className='descriptions'>Invest info</div>
              <div className='market'>
                <div className='left'>
                  {dialogProlong.info.icon !== null ? <img src={dialogProlong.info.icon} alt='icon' /> : <span />}
                  <div>
                    <span>{dialogProlong.info.name}</span>
                    <p>{dialogProlong.info.code}</p>
                  </div>
                </div>
                <div className='right'>
                  <span>Hold balance</span>
                  {dialogProlong.info.amount ? <p>{GlobixFixed(dialogProlong.info.amount)}USDT </p> : null}
                </div>
              </div>
              <div className='deposit'>
                <p>Term of deposit</p>
                <div className='rate'>
                  <Slider
                    defaultValue={2}
                    aria-labelledby='discrete-slider'
                    valueLabelDisplay='auto'
                    step={1}
                    marks={marks}
                    min={2}
                    max={5}
                    onChange={(e, val) => setDurations(val)}
                  />
                </div>
              </div>
              <div className='checkbox'>
                <CheckboxMUI
                  checkedIcon={<img src={check} alt='check' />}
                  icon={<img src={uncheck} alt='uncheck' />}
                  onChange={(e, val) => setChecked(val)}
                />

                <p>I am familiar with the company's policy in relation to savings accounts</p>
              </div>
              <div className='color_block'>
                <WarningIcon />
                The company does not guarantee income from buying currency in the event of a fall in the rate.
              </div>
              <ButtonMUI fullWidth disabled={!checked} formAction onClick={prolongInvest}>
                Prolong
              </ButtonMUI>
            </div>
          </DialogMUI>
          <BuyCoinModal dialog={dialog} toggleDialog={toggleDialog} />
        </>
      )}
    </div>
  );
};

export default InvestDetail;
