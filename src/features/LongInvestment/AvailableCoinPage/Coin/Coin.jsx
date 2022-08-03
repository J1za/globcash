//PAGE: main/long-investment/available-coin/${ID}

import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  buyAvailableCoins,
  getExpertForecasts,
  getRecentPurchases,
  getStatistic,
  getCoinMarketCap,
  getBinanceInfo,
  getBinanceInfoBtc,
  defaultValueUsdt,
  defaultValueBtc
} from '../../LongInvestmentPage/LongIActions';

import {ReactComponent as ChartIcon} from '../../../../assets/images/chart_coin.svg';
import {Controller, useForm} from 'react-hook-form';
import InputMUI from '../../../../shared/InputMUI';
import DialogMUI from '../../../../shared/DialogMUI';
import Slider from '@material-ui/core/Slider';
import CheckboxMUI from '../../../../shared/CheckboxMUI';
import ButtonMUI from '../../../../shared/ButtonMUI';

import check from '../../../../assets/images/check.svg';
import uncheck from '../../../../assets/images/uncheck.svg';
import {ReactComponent as WarningIcon} from '../../../../assets/images/warning.svg';
import {ReactComponent as ByuIcon} from '../../../../assets/images/Buy_icon.svg';
import {ReactComponent as FinanceIcon} from '../../../../assets/images/finance_mini.svg';
import {ReactComponent as InfoIcon} from '../../../../assets/images/i_icon.svg';
import {ReactComponent as СongratulationsIcon} from '../../../../assets/images/Сongratulations.svg';
import {ReactComponent as CapChart} from '../../../../assets/images/cap.svg';
import BitcoinIcon from '../../../../assets/images/bitcoin.svg';

import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
import CoinChartOptions from './CoinChartOptions';
import moment from 'moment';
import {GlobixFixed} from '../../../../helpers/functions';

import './Coin.scss';
import HoldBalance from '../../LongInvestmentPageInner/HoldBalance/HoldBalance';
import StakingChart from '../../../Dashboard/DashboardComponents/Staking/Charts/StakingChart';
import {toast} from 'react-toastify';

import BuyCoinForm from '../../LongInvestmentPage/AvailableCoins/BuyCoinForm';

const Coin = ({currencyId, headInfo, code}) => {
  // console.log(headInfo);
  const [checked, setChecked] = useState(false);

  const [checkedCoin, setCheckedCoin] = useState({usdt: true, btc: false});
  const [amountField, setAmountField] = useState(null);
  const [duration, setDuration] = useState(5);

  const [checkedLoss, setCheckedLoss] = useState(false);
  const [checkedProfit, setCheckedProfit] = useState(false);
  const [percentStopLoss, setPercentStopLoss] = useState(null);
  const [percentProfitLoss, setPercentProfitLoss] = useState(null);
  const [dialogCongratulations, toggleDialogCongratulations] = useState({
    status: false
  });

  const [activePeriod, setActivePeriod] = useState({value: {c: '4h', b: '1w'}, label: '1W'});
  const [activePeriodMarket, setActivePeriodMarket] = useState({value: {c: '1d', b: '1m'}, label: '1M'});

  const [activePlatform, setActivePlatform] = useState({value: 'coin_charts_price', label: 'Price'});
  const [finFormat, setFinFormat] = useState('');

  const {
    longInvestment: {
      investmentRequestTimeout,
      chartMarketcap,
      coin_usdt_longInvestment_charts,
      coin_btc_longInvestment_charts,
      chartMarketcapBtc,
      coinChartLoad,
      statistic: {balance_usdt, balance_usd}
    }
  } = useSelector(({longInvestment}) => ({
    longInvestment
  }));

  const periods = [
    {value: {c: '4h', b: '1w'}, label: '1W'},
    {value: {c: '1d', b: '1m'}, label: '1M'},
    {value: {c: '3d', b: '3m'}, label: '3M'},
    {value: {c: '1w', b: '1y'}, label: '1Y'},
    {value: {c: '1M', b: 'all'}, label: 'All'}
  ];

  const periodsMarket = [
    {value: {c: '1d', b: '1m'}, label: '1M'},
    {value: {c: '3d', b: '3m'}, label: '3M'},
    {value: {c: '1w', b: '1y'}, label: '1Y'},
    {value: {c: '1M', b: 'all'}, label: 'All'}
  ];

  const switchParams = [
    {value: 'coin_charts_price', label: 'Price'},
    {value: 'coin_charts', label: 'MarketCap'}
  ];

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

  let dateFrom;

  if (activePeriod.label === '1W') {
    dateFrom = moment().subtract(7, 'days').format('YYYY-MM-DD');
  } else if (activePeriod.label === '1M') {
    dateFrom = moment().subtract(1, 'month').format('YYYY-MM-DD');
  } else if (activePeriod.label === '3M') {
    dateFrom = moment().subtract(3, 'month').format('YYYY-MM-DD');
  } else if (activePeriod.label === '1Y') {
    dateFrom = moment().subtract(1, 'year').format('YYYY-MM-DD');
  } else {
    dateFrom = moment().subtract(5, 'year').format('YYYY-MM-DD');
  }

  let startDate = Date.parse(dateFrom);

  const [buttonLoad, setLoad] = useState(false);

  const [priceFinFormat, setPriceFinFormat] = useState({btc: '', usdt: ''});

  const [priceFinFormatUsdt, setPriceFinFormatUsdt] = useState('');

  const [priceFinFormatBtc, setPriceFinFormatBtc] = useState('');

  const [marketFinFormatUsdt, setMarketFinFormatUsdt] = useState('');

  const [marketFinFormatBtc, setMarketFinFormatBtc] = useState('');

  const getDuration = (active) =>
    active === 2 ? '3 months' : active === 3 ? '6 months' : active === 4 ? '1 year' : active === 5 ? '2 years' : '';

  const schema = yup.object({
    amount: yup
      .number()
      .min(0.00000001, 'The value should be greater than 0.00000001')
      .max(balance_usdt / headInfo.price_usdt, 'Out of limit')
      .typeError('You must specify a number')
      .required('Field is required'),
    take_profit_percent:
      checkedProfit &&
      yup
        .number()
        .required('required')
        .typeError('you must specify a number')
        .min(0.01, 'The value should be greater than 0.01')
        .max(100, 'Max 100% '),
    stop_loss_percent:
      checkedLoss &&
      yup
        .number()
        .required('required')
        .typeError('you must specify a number')
        .min(0.01, 'The value should be greater than 0.01')
        .max(100, 'Max 100% ')
  });

  const {
    handleSubmit,
    setError,
    control,
    formState: {errors, isValid},
    setValue,
    getValues,
    trigger,
    register,
    unregister,
    reset,
    clearErrors
  } = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
    shouldFocusError: true,
    defaultValues: {
      amount: '',
      take_profit_percent: null,
      stop_loss_percent: null
    }
  });

  const toggleSwitch = (val, name) => {
    name === 'take_profit_percent' ? setCheckedProfit(val) : setCheckedLoss(val);
    name === 'take_profit_percent' ? setPercentProfitLoss(null) : setPercentStopLoss(null);
    if (!val) {
      unregister(name);
      clearErrors(name);
      trigger('amount');
    } else {
      register(name);
    }
  };

  const dispatch = useDispatch();

  const buyCoin = () => {
    dispatch(
      buyAvailableCoins({
        amount: +amountField,
        currency_id: currencyId,
        duration: getDuration(duration),
        take_profit_percent: percentProfitLoss,
        stop_loss_percent: percentStopLoss
      })
    ).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 201) {
        dispatch(getStatistic());
        dispatch(getRecentPurchases());
        toggleDialogCongratulations({status: true});
      } else {
        Object.values(res.error.response.data)
          .flat()
          .forEach((el) => toast.error(el, {}));
      }
    });
  };

  const closeDialogCongratulations = () => {
    toggleDialogCongratulations((prev) => ({...prev, status: false}));
    setAmountField(null);
    setPercentStopLoss(null);
    setPercentProfitLoss(null);
    setCheckedLoss(false);
    setCheckedProfit(false);
    setChecked(false);
    reset();
  };

  const doRequest = () => {
    dispatch(getExpertForecasts());
    dispatch(getStatistic());
  };

  const getChartPrice = () => {
    headInfo && headInfo.code && headInfo.code !== 'USDT'
      ? dispatch(getBinanceInfo(`${headInfo.code}USDT`, activePeriod.value.c, startDate)).then((res) => {
          if (res.payload && res.payload.status && res.payload.status === 200) {
            let first = res.payload.data[0][3];

            if (first > 9999999999) {
              setPriceFinFormatUsdt('B');
            }
            if (first > 999999 && first < 1000000000) {
              setPriceFinFormatUsdt('m');
            }
            if (first > 9999 && first < 1000000) {
              setPriceFinFormatUsdt('k');
            }

            headInfo.code === 'BTC' &&
              dispatch(defaultValueBtc(res.payload.data[0][0], res.payload.data[res.payload.data.length - 1][0]));
          } else {
            console.log(res.error.response.data);
          }
        })
      : setPriceFinFormatUsdt('');

    headInfo && headInfo.code && headInfo.code !== 'BTC'
      ? dispatch(getBinanceInfoBtc(`${headInfo.code}BTC`, activePeriod.value.c, startDate)).then((res) => {
          if (res.payload && res.payload.status && res.payload.status === 200) {
            let first = res.payload.data[0][3];

            if (first > 9999999999) {
              setPriceFinFormatBtc('B');
            }
            if (first > 999999 && first < 1000000000) {
              setPriceFinFormatBtc('m');
            }
            if (first > 9999 && first < 1000000) {
              setPriceFinFormatBtc('k');
            }
            if (first < 999) {
              setPriceFinFormatBtc('');
            }

            headInfo.code === 'USDT' &&
              dispatch(defaultValueUsdt(res.payload.data[0][0], res.payload.data[res.payload.data.length - 1][0]));
          } else {
            console.log(res.error.response.data);
          }
        })
      : setPriceFinFormatBtc('');

    currencyId &&
      dispatch(getCoinMarketCap(currencyId, activePeriodMarket.value.b)).then((res) => {
        if (res.payload && res.payload.status && res.payload.status === 200) {
          let first = res.payload.data[0]['usd'];

          let firstBtc = res.payload.data[0]['btc'];

          if (firstBtc > 1000000000) {
            setMarketFinFormatBtc('B');
          }
          if (firstBtc > 999999 && firstBtc < 1000000000) {
            setMarketFinFormatBtc('m');
          }
          if (firstBtc > 9999 && firstBtc < 1000000) {
            setMarketFinFormatBtc('k');
          }

          if (first.toString().length > 10) {
            setMarketFinFormatUsdt('B');
          }
          if (first > 999999 && first < 1000000000) {
            setMarketFinFormatUsdt('m');
          }
          if (first > 9999 && first < 1000000) {
            setMarketFinFormatUsdt('k');
          }
        } else {
          console.log(res.error.response.data);
        }
      });
  };

  useEffect(() => {
    doRequest();
  }, []);

  useEffect(() => {
    getChartPrice();
  }, [headInfo]);

  useEffect(() => {
    getChartPrice();
  }, [currencyId, activePeriod, activePlatform, activePeriodMarket]);

  // let firstPrice = action.payload.data[0]['usd'];
  // if (firstPrice > 999999) {
  //   finFormatCoin = 'bl';
  // } else if (firstPrice > 999 && first < 1000000) {
  //   finFormatCoin = 'k';
  // } else {
  //   finFormatCoin = '';
  // }

  let experts = {
    currency_name: 'Bitcoin',
    currency_icon: <img src={BitcoinIcon} alt='icon' />,
    currency_code: 'BTC',
    currency_id: '123',
    currency_price: '123'
  };

  return (
    <div className='coin_block_info'>
      <div className='chart'>
        <div className='top'>
          <div className='left'>
            <span>{headInfo.name} to USDT chart</span>
            <div>
              {switchParams.map((el, idx) => (
                <button
                  className={`good-hover${el.value === activePlatform.value ? ' active' : ''}`}
                  onClick={() => {
                    setActivePlatform(el);
                  }}
                  key={idx}
                >
                  {el.label}
                </button>
              ))}
            </div>
          </div>
          <div className='right'>
            {(activePlatform.label === 'Price' ? periods : periodsMarket).map((el, idx) => (
              <button
                className={`good-hover${
                  activePlatform.label === 'Price'
                    ? el.value.b === activePeriod.value.b
                      ? ' active'
                      : ''
                    : el.value.b === activePeriodMarket.value.b
                    ? ' active'
                    : ''
                }`}
                onClick={() => {
                  activePlatform.label === 'Price' ? setActivePeriod(el) : setActivePeriodMarket(el);
                }}
                key={idx}
              >
                {el.label}
              </button>
            ))}
          </div>
        </div>
        <div className='wrapper'>
          {coinChartLoad || (!checkedCoin.btc && !checkedCoin.usdt) ? (
            <div className='chart_cap'>
              <CapChart />
            </div>
          ) : (
            <HighchartsReact
              highcharts={Highcharts}
              options={CoinChartOptions(
                activePlatform.value === 'coin_charts_price' ? coin_usdt_longInvestment_charts : chartMarketcap,
                activePlatform.value === 'coin_charts_price' ? coin_btc_longInvestment_charts : chartMarketcapBtc,
                activePlatform.label,
                activePlatform.value === 'coin_charts_price' ? priceFinFormatUsdt : marketFinFormatUsdt,
                activePlatform.value === 'coin_charts_price' ? priceFinFormatBtc : marketFinFormatBtc,
                checkedCoin,
                headInfo.volume_24h_usd
              )}
              className='highchart'
            />
          )}
        </div>
        <div className='bottom'>
          <div>
            <CheckboxMUI
              checked={checkedCoin.usdt}
              checkedIcon={<img src={check} alt='check' />}
              icon={<img src={uncheck} alt='uncheck' />}
              label='USDT'
              onChange={(e, val) => {
                setCheckedCoin({...checkedCoin, usdt: val});
              }}
            />
            <span>USDT</span>
          </div>
          <div>
            <CheckboxMUI
              checked={checkedCoin.btc}
              checkedIcon={<img src={check} alt='check' />}
              icon={<img src={uncheck} alt='uncheck' />}
              onChange={(e, val) => setCheckedCoin({...checkedCoin, btc: val})}
            />
            <span>BTC</span>
          </div>
        </div>
      </div>
      <div className='buy_coin'>
        <div className='title'>
          <ByuIcon />
          Buy a coin
          <div>
            <InfoIcon />
            <span>
              You can buy cryptocurrencies into your long investment portfolio. Choose the amount of investment in USDT
              and the storage time of the coin and earn on price volatility.
            </span>
          </div>
        </div>
        <BuyCoinForm
          dialog={{
            info: {
              price: headInfo.price_usdt,
              name: headInfo.name,
              icon: headInfo.icon,
              code: headInfo.code,
              id: headInfo.id,
              balance_usdt: balance_usdt
            }
          }}
        />
      </div>
      <DialogMUI open={dialogCongratulations.status} onClose={closeDialogCongratulations}>
        <div className='dialog dialog_congratulations'>
          <div className='title'>Сongratulations</div>
          <div className='descriptions'>
            An application to buy {amountField} {headInfo.code} has been generated and will be processed within{' '}
            {investmentRequestTimeout} minutes.
          </div>
          <div className='color'>
            {amountField} {headInfo.code}
          </div>
          <СongratulationsIcon />
        </div>
      </DialogMUI>
    </div>
  );
};

export default Coin;
