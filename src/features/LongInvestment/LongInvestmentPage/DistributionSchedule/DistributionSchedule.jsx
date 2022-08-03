import './distributionSchedule.scss';
import { renderToStaticMarkup } from 'react-dom/server';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStatistic, getInvestChart } from '../LongIActions';

import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

import SelectComponent from '../../../../shared/SelectComponent';
import { PropagateLoader } from 'react-spinners';
import Options from '../../LongInvestmentPageInner/HoldBalance/chartOptions';
import Slider from 'react-slick';

import { ReactComponent as VectorIcon } from '../../../../assets/images/arrow_actions.svg';
import NoIcon from '../../../../assets/icons/resend.svg';

import { TabItem, Tabs } from '../../../../shared/Tabs';

import useWindowDimensions from '../../../../helpers/useWindowDimensions';
import { GlobixFixed } from '../../../../helpers/functions';

const DistributionSchedule = () => {
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();
  // HISTORICAL DATA
  const periods = [
    { value: '1w', label: '7D' },
    { value: '1m', label: '1M' },
    { value: '3m', label: '3M' },
    { value: '1y', label: '1Y' },
    { value: null, label: 'All' }
  ];
  const [activePeriod, setActivePeriod] = useState({ value: '1w', label: '7D' });

  const {
    longInvestment: {
      statistic,
      statisticLoad,
      chartInvestment,
      statistic: { invested_balance_usdt, currency }
    }
  } = useSelector(({ longInvestment }) => ({ longInvestment }));

  /* useEffect(() => {
    dispatch(getStatistic());
  }, []); */

  const [dataChart, setDataChart] = useState([]);
  const [dataChartReverse, setDataChartReverse] = useState([]);

  useEffect(() => {
    setDataChart(
      currency && currency.map(({ invested_percent, ...n }) => ((n.y = Number(invested_percent?.toFixed(2))), n))
    );
    setDataChartReverse(
      currency &&
      currency.reverse().map(({ invested_percent, ...n }) => ((n.y = Number(invested_percent?.toFixed(2))), n))
    );
  }, [statistic]);

  useEffect(() => {
    dispatch(getInvestChart(activePeriod.value));
  }, [activePeriod]);

  const coinsOptions = [
    { value: null, label: 'Gainers' },
    { value: 'falling', label: 'Falling' }
  ];

  const [parametersCoins, setParametersCoins] = useState({
    type: null
  });
  const filterCoins = parametersCoins.type == 'falling' ? dataChartReverse : dataChart;

  const DropdownIndicator = (props) => {
    return (
      <DropdownIndicator {...props}>
        <VectorIcon />
      </DropdownIndicator>
    );
  };

  const sliderRef = useRef();

  const СhartTooltip = (props) => {
    const { icon, name, code, price_usdt, percent_change_7d, amount } = props.info.point;
    return (
      <div className='chartTooltip'>
        <div className='chartTooltip_head'>
          <img src={icon ? icon : NoIcon} alt='coin' />
          <span className='chartTooltip_head_name'>{name}</span>
          {width > 767 && <span>({props.info.y}%)</span>}
        </div>
        <div className='chartTooltip_mana'>
          {amount} <span>{code}</span>
        </div>
        <div className='chartTooltip_price'>
          <span>{GlobixFixed(price_usdt)} $</span>
          {percent_change_7d > 0 ? (
            <span className='distributionSchedule_green'>+{percent_change_7d?.toFixed(2)}%</span>
          ) : (
            <span className='distributionSchedule_red'>{percent_change_7d?.toFixed(2)}%</span>
          )}
        </div>
        {width < 767 && <div className='chartTooltip_percent'>{props.info.y}%</div>}
      </div>
    );
  };
  const СenterInfoTooltip = () => {
    return (
      <div className='centerInfoTooltip'>
        <p>Portfolio Value</p>
        <p>${invested_balance_usdt && GlobixFixed(invested_balance_usdt)}</p>
        <p>{dataChart?.length} assets</p>
      </div>
    );
  };
  const config = {
    chart: {
      type: 'pie',
      margin: -10,
      backgroundColor: 'transparent'
    },
    credits: {
      enabled: false
    },
    title: {
      useHTML: true,
      text: renderToStaticMarkup(<СenterInfoTooltip />)
    },
    tooltip: {
      hideDelay: 100,
      borderWidth: 0,
      backgroundColor: 'none',
      padding: 0,
      shadow: false,
      distance: 16,
      useHTML: true,
      outside: width < 767 ? false : true,
      formatter: function () {
        return renderToStaticMarkup(<СhartTooltip info={this} />);
      }
    },
    plotOptions: {
      series: {
        states: {
          hover: {
            halo: {
              size: -15,
              opacity: 1
            },
            brightness: 0
          },
          inactive: {
            opacity: 1
          }
        },
        animation: false
      },
      pie: {
        innerSize: '90%',
        cursor: 'pointer',
        dataLabels: {
          enabled: false
        },
        point: {
          events: {
            legendItemClick: () => false
          }
        },
        showInLegend: true,
        borderWidth: false
      }
    },
    series: [
      {
        data: dataChart
      }
    ],
    legend: {
      enabled: false
    }
  };

  const settingsSlider = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    rows: 3,
    slidesPerRow: 2,
    adaptiveHeight: false,
    responsive: [
      {
        breakpoint: 499,
        settings: {
          slidesPerRow: 1,
          centerMode: true,
          centerPadding: '3%'
        }
      }
    ]
  };

  const RenderChart = () => (
    <div className='distributionSchedule_chart'>
      <HighchartsReact highcharts={Highcharts} options={config} />
    </div>
  );
  const RenderHistorialData = () => (
    <div className='hold_balance_block'>
      <div className='chart_wrapper'>
        <div className='title mb-28 chart-container'>
          <div className='row-container chart-head'>
            {width > 1099 && <h3>Historical data</h3>}
            {!statisticLoad && (
              <div className='btn_chart'>
                {periods.map((el, idx) => (
                  <button
                    className={`good-hover${el.value === activePeriod.value ? ' active' : ''}`}
                    onClick={() => {
                      setActivePeriod(el);
                    }}
                    key={idx}
                  >
                    {el.label}
                  </button>
                ))}
              </div>
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
                  chartInvestment,
                  true /// look at chartOptions.js params.The boolean true means that yAxis interval will be calculated for the chart
                )}
                className='highchart'
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return dataChart && dataChart.length > 0 ? (
    <section className='distributionSchedule'>
      <div className={`distributionSchedule_wrapper${statisticLoad ? ' loading' : ''}`}>
        {statisticLoad ? (
          <PropagateLoader color={'#3579FC'} />
        ) : (
          <>
            {width <= 991 && (
              <Tabs defaultIndex='false'>
                <TabItem label='Allocation' index='false'>
                  {RenderChart()}
                </TabItem>
                <TabItem label='Statistics' index='true'>
                  {RenderHistorialData()}
                </TabItem>
              </Tabs>
            )}

            {width > 991 && RenderChart()}
            <div className='distributionSchedule_coins'>
              <div className='distributionSchedule_coins_filter'>
                <span>Coins</span>
                <SelectComponent
                  onChange={(e) => {
                    setParametersCoins({ ...parametersCoins, type: e.value }), sliderRef.current.slickGoTo(0);
                  }}
                  value={coinsOptions.find((c) => c.value === parametersCoins.type)}
                  options={coinsOptions}
                  components={{ DropdownIndicator }}
                />
              </div>

              <div className='distributionSchedule_coins_slider'>
                <Slider ref={sliderRef} {...settingsSlider}>
                  {dataChart &&
                    filterCoins.map((elem) => (
                      <div className='slider_coin' key={elem.id}>
                        <div className='slider_coin_icon'>
                          <img src={elem.icon ? elem.icon : NoIcon} alt='icon' />
                        </div>
                        <div className='slider_coin_info'>
                          <h4>{elem.name}</h4>
                          <p>
                            {GlobixFixed(elem.price_usdt)} ${' '}
                            {elem.percent_change_7d >= 0 ? (
                              <span className='distributionSchedule_green'>
                                {elem.percent_change_7d <= 0.1 ? 0 : elem.percent_change_7d?.toFixed(2)}%
                              </span>
                            ) : (
                              <span className='distributionSchedule_red'>
                                {elem.percent_change_7d == null ? '-' : elem.percent_change_7d.toFixed(2)}%
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                </Slider>
              </div>
            </div>
            {width > 991 && RenderHistorialData()}
          </>
        )}
      </div>
    </section>
  ) : null;
};

export default DistributionSchedule;
