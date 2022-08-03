import moment from 'moment';
import { chartRangeHelper } from '../../../../helpers/functions';

const Options = (data, isHoldBalancePage = false, platform = false) => {
  let userScreenWidht = document.documentElement.clientWidth;
  let location = window.location.pathname;
  let first = data && data[0];
  let digitsValue = null;
  let yInterval = 1;

  isHoldBalancePage && Array.isArray(first)
    ? first &&
    first[1] &&
    !Number.isInteger(first[1]) &&
    ((digitsValue = first && first[1].toString().split(/\./)[1]?.length),
      (yInterval = first && first[1].toFixed(digitsValue - 2 > 0 ? digitsValue - 2 : 1)))
    : first &&
    first.y &&
    !Number.isInteger(first.y) &&
    ((digitsValue = first && first.y.toString().split(/\./)[1]?.length),
      (yInterval = first && first.y.toFixed(digitsValue - 2 > 0 ? digitsValue - 2 : 1)));

  const makeData = () => {
    return [
      {
        type: 'area',
        data: data,
        color:
          location === '/main/long-investment'
            ? '#70A9FF'
            : {
              linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
              stops: [
                [0, '#70A9FF'],
                [1, 'rgba(206, 232, 255, 0)']
              ]
            },

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

  return {
    chart: {
      type: 'line',
      backgroundColor: 'rgba(255, 255, 255, 0)',
      width: location === '/main/long-investment' ? chartWidth : null,
      height: location === '/main/long-investment' ? 220 : 300,
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
    plotOptions: {
      column: {
        stacking: 'normal'
      }
    },
    series: makeData(),
    title: {
      text: undefined
    },
    tooltip: {
      backgroundColor: '#FFFFFF',
      borderRadius: 2,
      borderWidth: 0,

      style: {
        color: '#141D33',
        fontSize: '14px'
      },
      formatter: function () {
        let tooltip = '<div class="tooltipwrapper">';
        tooltip += `<div class="textContainer"><b>${moment(this.x).format('DD MMM YYYY')}</b></div></br>`;
        tooltip += `<div class="textContainer">${platform === 'Market' ? '' : 'Growth: ' + this.point.value.toFixed(2)
          }</div></br>`;
        tooltip += `<div class="textContainer">${platform !== 'Market' ? 'Total: ' : 'Price: '}${this.y.toFixed(
          2
        )}</div></br>`;
        tooltip += '</div>';
        return tooltip;
      }
    },
    xAxis: {
      type: 'category',
      categories: [],
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
    yAxis: {
      gridLineColor: '#D7D7D7',
      gridLineDashStyle: 'ShortDash',
      tickInterval: yInterval,
      title: {
        text: undefined
      },
      labels: {
        enabled: true,
        format: '{value}',
        style: {
          fontSize: '12px',
          color: '#A1A6B2'
        }
      }
      , ...chartRangeHelper(data, false)
    }
  };
};

export default Options;
