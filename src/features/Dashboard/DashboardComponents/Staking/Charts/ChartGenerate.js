import moment from 'moment';
import { GlobixFixed } from '../../../../../helpers/functions';
import '../Staking.scss';
import { chartRangeHelper } from '../../../../../helpers/functions';

export const ChartGenerate = (label, dashboardStaking, stakingChart, isStakePage) => {
  const isStake = label === 'stake' || label === 'invglbx';
  const chartType = isStake ? 'column' : 'line';

  const makeData = () => {
    return isStake
      ? [
        {
          name: 'Growth',
          data: [
            '0',
            dashboardStaking[label] &&
            dashboardStaking[label].balance + stakingChart[stakingChart.length - 1] &&
            stakingChart[stakingChart.length - 1].y
          ],
          // stack: 'male',
          color: '#3579FC',
          showInLegend: !isStakePage
        },
        {
          name: 'Body',
          data: [dashboardStaking[label].balance, dashboardStaking[label].balance],
          // stack: 'male',
          color: '#FDD1FF',
          showInLegend: !isStakePage
        }
      ]
      : [
        {
          type: 'area',
          data: stakingChart,
          color: {
            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
            stops: [
              [0, 'rgba(49, 185, 140, 0.7)'],
              [1, 'rgba(49, 185, 140, 0.05)']
            ]
          },
          negativeColor: {
            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
            stops: [
              [0, 'rgba(255, 96, 163, 0.05)'],
              [1, 'rgba(255, 96, 163, 0.7)']
            ]
          },
          showInLegend: false
        }
      ];
  };

  const options = {
    chart: {
      type: chartType,
      backgroundColor: 'rgba(255, 255, 255, 0)',

      height: isStakePage ? 89 : 300,
      maxHeight: isStakePage ? 89 : 300,
      spacingLeft: 0,
      spacingRight: 0,
      style: {
        fontFamily: 'Gilroy, sans-serif',
        fontSize: '13px'
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
        fontSize: '13px'
      },
      formatter: function () {
        if (isStake) {
          return (
            'Target: ' +
            this.y +
            '<br/>' +
            (this.series.name !== 'Body'
              ? 'Total: ' +
              (this.series.stackedYData[1] > 0
                ? this.series.stackedYData[1]
                : eval(this.series.stackedYData.join('+')))
              : '')
          );
        } else {
          return (
            '<b>' +
            moment(this.x).format('DD MMM YYYY') +
            '</b><br/>' +
            'Growth' +
            ': ' +
            GlobixFixed(this.point.value) +
            '<br/>' +
            'Total: ' +
            GlobixFixed(this.y)
          );
        }
      }
    },
    xAxis: {
      type: 'category',
      categories: isStake ? ['', ''] : [],
      gridLineColor: `${isStakePage ? 'transparent' : '#D7D7D7'}`,
      lineColor: `${isStakePage ? 'transparent' : '#D7D7D7'}`,
      gridLineDashStyle: 'ShortDash',
      labels: {
        enabled: !isStakePage,
        style: {
          fontSize: '13px',
          color: '#A1A6B2'
        },
        formatter: function () {
          return isStake ? this.value : moment(this.value).format('DD MMM');
        }
      }
    },
    yAxis: {
      gridLineColor: `${isStakePage ? 'transparent' : '#D7D7D7'}`,
      lineColor: `${isStakePage ? 'transparent' : '#D7D7D7'}`,
      gridLineDashStyle: 'ShortDash',
      title: {
        text: undefined
      },
      labels: {
        enabled: !isStake && !isStakePage,
        format: '{value}',
        style: {
          fontSize: '11px',
          color: '#A1A6B2'
        }
      }
      , ...chartRangeHelper(isStake ? [] : stakingChart, false)
    }
  };

  return options;
};
