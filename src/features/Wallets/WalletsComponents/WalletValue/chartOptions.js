import React, {useState, useEffect} from 'react';
import moment from 'moment';

const Options = (data, fixed) => {
  const makeData = () => {
    //console.log([250055005555,25550000,250,2500,25000,2550000,55000,350000,25000].map(el => ({...data[0], x: data[0].x + el, y: data[0].y + el})))
    return [
      {
        type: 'area',
        data: data,
        color: {
          linearGradient: {x1: 0, x2: 0, y1: 0, y2: 1},
          stops: [
            [0, '#70A9FF'],
            [1, 'rgba(206, 232, 255, 0)']
          ]
        },
        /* negativeColor: {
                    linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                    stops: [
                        [0, 'rgba(255, 96, 163, 0.05)'],
                        [1, 'rgba(255, 96, 163, 0.7)']
                    ]
                }, */
        showInLegend: false
      }
    ];
  };

  const sortFunction = (array, sortKey, isArrayReturned) => {
    if (array.length > 0) {
      const startArray = array
        .map((el) => el[sortKey])
        .filter((el, idx) => array.slice(idx).filter((elem) => elem === el).length < 2);
      let sortedArray = startArray.sort(function (a, b) {
          return Number(a[sortKey]) - Number(b[sortKey]);
        }),
        minPoint = Number(sortedArray[0]),
        maxPoint = Number(sortedArray[sortedArray.length - 1]),
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
  };

  return {
    chart: {
      type: 'line',
      backgroundColor: 'rgba(255, 255, 255, 0)',

      height: 300,
      maxHeight: 300,
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
        return (
          '<b>' +
          moment(this.x).format('DD MMM YYYY') +
          '</b><br/>' +
          'Growth ' +
          ': ' +
          this.point.value.toFixed(fixed) +
          '<br/>' +
          'Total: ' +
          this.y.toFixed(fixed)
        );
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
          fontSize: '13px',
          color: '#A1A6B2'
        },
        formatter: function () {
          return moment(this.value).format('DD.MM');
        }
      },
      tickPositioner: function () {
        var positions = [],
          tick = Math.floor(this.dataMin),
          increment = Math.ceil((this.dataMax - this.dataMin) / 6);
        if (data.length > 20) {
          if (this.dataMax !== null && this.dataMin !== null) {
            for (tick; tick - increment <= this.dataMax; tick += increment) {
              positions.push(tick);
            }
          }
        } else {
          data.forEach((el) => (!positions.includes(el.x) ? positions.push(el.x) : null));
        }
        return positions;
      }
    },
    yAxis: {
      gridLineColor: '#D7D7D7',
      gridLineDashStyle: 'ShortDash',
      title: {
        text: undefined
      },
      labels: {
        enabled: true,
        format: '{value}',
        style: {
          fontSize: '13px',
          color: '#A1A6B2'
        }
      }
      //...sortFunction(data, 'y', false)
      /* tickPositions: [...Array((() => {
                return data.map(el => el.y).filter((el, idx) => data.slice(idx).filter(elem => elem === el).length === 1)
            })())] */
      /* tickPositioner: function () {
                var positions = [],
                    tick = Math.floor(this.dataMin),
                    increment = Math.ceil((this.dataMax - this.dataMin) / 6);
                if (data.length > 10) {
                    if (this.dataMax !== null && this.dataMin !== null) {
                        for (tick; tick - increment <= this.dataMax; tick += increment) {
                            positions.push(tick);
                        }
                    }
                } else {
                    //data.forEach(el => !positions.includes(el.y) ? positions.push(el.y) : null);
                    console.log(data.map(el => el.y).filter((el, idx) => data.slice(idx).filter(elem => elem === el).length === 1))
                    return data.map(el => el.y).filter((el, idx) => data.slice(idx).filter(elem => elem === el).length === 1)
                }
                return positions;
            } */
    }
  };
};

export default Options;
