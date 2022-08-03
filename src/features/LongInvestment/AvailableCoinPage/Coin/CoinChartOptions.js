import moment from 'moment';
import {useState, useEffect} from 'react';
import {GlobixFixed, chartRangeHelper} from '../../../../helpers/functions';

const CoinChartOptions = (data, dataBtc, platform = false, finFormatUsdt, finFormatBtc, checkedCoin, volume24h) => {
  let userScreenWidht = document.documentElement.clientWidth;
  let location = window.location.pathname;
  /*   const [yInterval, setYInterval] = useState({});
  const [yIntervalBtc, setYIntervalBtc] = useState({}); */
  let yInterval = 100,
    yIntervalBtc = 30,
    first = data[0],
    firstBtc = dataBtc[0];

  Array.isArray(first)
    ? (yInterval = first && first[1] > 100 ? 100 : 10)
    : (yInterval = first && first.y > 100 ? 100 : 10);

  Array.isArray(firstBtc)
    ? (yIntervalBtc = firstBtc && firstBtc[1] > 100 ? 100 : 10)
    : (yIntervalBtc = firstBtc && firstBtc.y > 100 ? 100 : 10);

  /* const shortArray = (array) => {
    let ArrSize = 50;
    if (array.length > ArrSize) {
      let tempArr = [],
        subArrSize = Math.floor(array.length / ArrSize);

      for (let i = 0; i < ArrSize; i++) {
        tempArr.push(array.splice(0, subArrSize));
      }
      console.log(
        tempArr,
        'test',
        tempArr.map((el) => el[el.length - 1])
      );
      return tempArr.map((el) => el[el.length - 1]);
    } else {
      return array;
    }
  };

  const sortFunction = (array, isArrayReturned) => {
    if (array.length > 0) {
      const startArray = [...shortArray(array)];
      let index = Array.isArray(array[0]) ? 4 : 'y',
        sortedArray = startArray.sort(function (a, b) {
          return Number(a[index]) - Number(b[index]);
        }),
        minPoint = Number(sortedArray[0][index]),
        maxPoint = Number(sortedArray[sortedArray.length - 1][index]),
        halfRange = (maxPoint - minPoint) / 2,
        returnedObject = {
          min: minPoint - halfRange,
          max: maxPoint + halfRange
        };

      if (isArrayReturned) returnedObject.sortedArray = sortedArray;

      return returnedObject;
    } else {
      return {};
    }
  }; */

  const makeData = () => {
    return [
      {
        name: 'USD',
        type: 'spline',
        data: checkedCoin.usdt ? data : [],
        color: '#15B176',
        negativeColor: 'rgb(255, 96, 163)',
        showInLegend: false
      },
      {
        name: 'BTC',
        type: 'spline',
        yAxis: 1,
        data: checkedCoin.btc ? dataBtc : [],
        color: '#3579FC',
        negativeColor: 'rgb(255, 96, 163)',
        showInLegend: false
      }
    ];
  };

  let chartWidth;

  if (userScreenWidht >= 1980) {
    chartWidth = 1000;
  } else if (userScreenWidht <= 1979 && userScreenWidht >= 1680) {
    chartWidth = 800;
  } else {
    600;
  }
  /* 
  useEffect(() => {
    setYInterval(sortFunction(data, false));
    setYIntervalBtc(sortFunction(dataBtc, false));
  }, [data, dataBtc]); */

  const financeFormat = (num) => {
    return `${
      Number(Number(num).toFixed()) > 999999999 // write numbers in financial format
        ? `${parseInt(Number((Number(Number(num).toFixed()) / 1000000000).toFixed(2)))}B`
        : Number(num) > 999999 && Number(num) < 1000000000
        ? `${parseInt(Number(Number(Number(num).toFixed()) / 1000000).toFixed(2))}m`
        : Number(num) > 999 && Number(num) < 1000000
        ? `${parseInt(Number(Number(Number(num).toFixed()) / 1000).toFixed(2))}k`
        : parseInt(Number(num).toFixed())
    }`;
  };

  return {
    chart: {
      type: 'line',
      backgroundColor: 'rgba(255, 255, 255, 0)',
      width: location === '/main/long-investment' ? chartWidth : null,
      height: 300,
      maxHeight: 300,
      spacingLeft: 0,
      spacingRight: 0,

      style: {
        fontFamily: 'Gilroy, sans-serif',
        fontSize: '12px'
      }
    },

    credits: {
      enabled: false
    },
    /*  plotOptions: {
      column: {
        stacking: 'normal'
      }
    }, */
    series: [...makeData()],
    title: {
      text: undefined
    },
    tooltip: {
      backgroundColor: '#FFFFFF',
      borderRadius: 2,
      borderWidth: 0,
      style: {
        color: '#141D33',
        fontSize: '12px'
      },
      formatter: function () {
        return (
          '<b>' +
          moment(this.x).format('DD MMM YYYY') +
          '</b><br/>' +
          `${
            platform === 'Price'
              ? `Price: <b> ${this.series.name === 'USD' ? '$' : ''}${GlobixFixed(
                  this.series.userOptions.data[this.point.index][5]
                )} ${this.series.name === 'BTC' ? 'BTC' : ''}</b>`
              : `Market Cap: <b> ${GlobixFixed(Number(this.point.options.y))} ${this.series.name}</b>`
          }`
        );
      }
    },
    xAxis: {
      type: 'category',
      categories: ['', ''],
      gridLineColor: '#D7D7D7',
      gridLineDashStyle: 'ShortDash',
      labels: {
        enabled: true,
        style: {
          fontSize: '12px',
          color: '#A1A6B2'
        },
        formatter: function () {
          return moment(this.value).format('DD.MM');
        }
      }
    },
    yAxis: [
      {
        gridLineColor: '#D7D7D7',
        gridLineDashStyle: 'ShortDash',
        title: {
          text: undefined
        },
        // ...{...sortFunction(data, false)},
        labels: {
          enabled: true,
          formatter: function () {
            return financeFormat(
              this.isFirst
                ? parseInt(chartRangeHelper(data, false, false).min)
                : this.isLast
                ? parseInt(chartRangeHelper(data, false, false).max)
                : this.value
            );
          },
          style: {
            fontSize: '12px',
            color: '#A1A6B2'
          }
        },
        ...chartRangeHelper(data, false, false)
      },
      {
        gridLineColor: '#D7D7D7',
        gridLineDashStyle: 'ShortDash',
        title: {
          text: undefined
        },
        //...{...sortFunction(dataBtc, false)},
        labels: {
          enabled: true,
          formatter: function () {
            return financeFormat(
              this.isFirst
                ? parseInt(chartRangeHelper(dataBtc, false, false).min)
                : this.isLast
                ? parseInt(chartRangeHelper(dataBtc, false, false).max)
                : this.value
            );
          },
          style: {
            fontSize: '12px',
            color: '#A1A6B2'
          }
        },
        opposite: true,
        ...chartRangeHelper(dataBtc, false, false)
      }
    ]
  };
};

export default CoinChartOptions;
