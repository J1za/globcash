import React, {useEffect, useState} from 'react';
import {ReactComponent as WalletValueNoItems} from '../../../../assets/images/WalletValueNoItems.svg';
import './HoldBalance.scss';
import moment from 'moment';

import {useDispatch, useSelector} from 'react-redux';
import {PropagateLoader} from 'react-spinners';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';

import {getBinanceInfo, getBalanceInfo, setChartLoading, getBinancePrice} from '../../LongInvestmentPage/LongIActions';

import Options from './chartOptions';
const HoldBalance = () => {
  const {
    longInvestment: {
      statisticInner,
      loadCurrencyCode,
      statisticLoad,
      longInvestment_charts,
      longInvestment_charts_balance
    }
  } = useSelector(({longInvestment}) => ({longInvestment}));

  const {daily_pnls} = statisticInner;
  const dispatch = useDispatch();

  const switchParams = [
    {value: 'longInvestment_charts_balance', label: 'Balance'},
    {value: 'longInvestment_charts', label: 'Price'}
  ];

  // Допустимые интервалы:
  // •    1m     // 1 минута
  // •    3m     // 3 минуты
  // •    5m    // 5 минут
  // •    15m  // 15 минут
  // •    30m    // 30 минут
  // •    1h    // 1 час
  // •    2h    // 2 часа
  // •    4h    // 4 часа
  // •    6h    // 6 часов
  // •    8h    // 8 часов
  // •    12h    // 12 часов
  // •    1d    // 1 день
  // •    3d    // 3 дня
  // •    1w    // 1 неделя
  // •    1M    // 1 месяц
  // https://bablofil.com/binance-api/

  const [activePeriod, setActivePeriod] = useState({value: {c: '1w', b: '1y'}, label: '1Y'});
  const [activePlatform, setActivePlatform] = useState({value: 'longInvestment_charts', label: 'Market'});

  const periods = [
    {value: {c: '4h', b: '1w'}, label: '1W'},
    {value: {c: '1d', b: '1m'}, label: '1M'},
    {value: {c: '3d', b: '3m'}, label: '3M'},
    {value: {c: '1w', b: '1y'}, label: '1Y'},
    {value: {c: '1M', b: null}, label: 'All'}
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

  useEffect(() => {
    statisticInner &&
      statisticInner.currency &&
      statisticInner.currency.code &&
      dispatch(getBinanceInfo(`${statisticInner.currency.code}USDT`, activePeriod.value.c, startDate)).then((res) => {
        if (res.payload && res.payload.status && res.payload.status === 200) {
        } else {
          console.log(res.error.response.data);
        }
      });

    statisticInner && statisticInner.id && dispatch(getBalanceInfo(statisticInner.id, activePeriod.value.b));
  }, [statisticInner.currency.code, activePeriod, activePlatform]);

  return (
    <div className='hold_balance_block'>
      <div className='chart_wrapper'>
        <div className='title mb-28'>
          <div className='row-container'>
            <h3>Value</h3>
            {!statisticLoad && (
              <div className='btn_chart switch'>
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
            )}
          </div>
          {!statisticLoad && (
            <>
              <div className='btn_chart'>
                {periods.map((el, idx) => (
                  <button
                    className={`good-hover${el.value.b === activePeriod.value.b ? ' active' : ''}`}
                    onClick={() => {
                      setActivePeriod(el);
                    }}
                    key={idx}
                  >
                    {el.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        {statisticLoad ? (
          <div className='no_items'>
            <PropagateLoader color={'#3579FC'} />
          </div>
        ) : (
          <div className='chart'>
            <HighchartsReact
              highcharts={Highcharts}
              options={Options(
                activePlatform.value === 'longInvestment_charts_balance'
                  ? longInvestment_charts_balance
                  : longInvestment_charts,
                true, /// look at chartOptions.js params.The boolean true means that yAxis interval will be calculated for the chart
                activePlatform.label
              )}
              className='highchart'
            />
          </div>
        )}
      </div>
      {daily_pnls < 0 && (
        <div className='no_items'>
          <h3>Staking value</h3>
          <WalletValueNoItems />
          <span>Your Hold balance deposits is empty</span>
        </div>
      )}
    </div>
  );
};

export default HoldBalance;
