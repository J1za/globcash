import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {ReactComponent as ArrowIcon} from '../../../../assets/images/arrow.svg';
import {ReactComponent as ArrowRedIcon} from '../../../../assets/images/arrow_down_red.svg';
import {ReactComponent as ArrowGreenIcon} from '../../../../assets/images/arrow_top_green.svg';
import {ReactComponent as TimeIcon} from '../../../../assets/images/time.svg';
import {TabItem, Tabs} from '../../../../shared/Tabs';
import {PropagateLoader} from 'react-spinners';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
import './Investment.scss';
import {ReactComponent as NoStakingIcon} from '../../../../assets/images/no_staking.svg';
import {ReactComponent as PlusIcon} from '../../../../assets/images/plus_blue.svg';
import Options from '../../../LongInvestment/LongInvestmentPageInner/HoldBalance/chartOptions';
import {useDispatch, useSelector} from 'react-redux';
import {getStatisticDashboard} from '../../../LongInvestment/LongInvestmentPage/LongIActions';
import {GlobixFixed} from '../../../../helpers/functions';

const Investment = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getStatisticDashboard());
  }, []);
  const {
    longInvestment: {
      statistic,
      statisticLoad,
      dashboardChart,
      statistic: {invested_balance_usd, invested_balance_usdt, percent, pnl, coins, coins_diff, currency}
    }
  } = useSelector(({longInvestment}) => ({longInvestment}));

  const settings = {
    dots: false,
    infinite: false,
    //center: false,
    speed: 500,
    slidesToShow: 4,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true
        }
      }
    ]
  };

  return (
    <section className='investment_block'>
      {!statisticLoad ? (
        <div>
          <div className='chart_info'>
            <div className='chart'>
              <div className='head mb-16'>
                <div className='head--title '>Long investment</div>
                <span>
                  <TimeIcon /> Weekly review
                </span>
              </div>
              <div className='chart_wrapper mb-16'>
                {statisticLoad ? (
                  <div className='no_items'>
                    <PropagateLoader color={'#3579FC'} />
                  </div>
                ) : (
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={Options(
                      dashboardChart,
                      true /// look at chartOptions.js params.The boolean true means that yAxis interval will be calculated for the chart
                    )}
                    className='highchart'
                  />
                )}
              </div>
            </div>
            <div className='info'>
              <div className='link'>
                <Link className='good-hover' to={'/main/long-investment'}>
                  <span className='mob'>More</span>
                  <p className='desc'>View all portfolio info</p>
                  <ArrowIcon />
                </Link>
              </div>
              <div className='balance'>
                <h3 className='mb-12'>HOLD Balance</h3>
                <p className='mb-4'>{GlobixFixed(invested_balance_usdt)} USDT</p>
                <span className='mb-6'>{GlobixFixed(invested_balance_usd)} $</span>
                <div className='mt-7'>
                  {percent > 0 ? (
                    <>
                      <ArrowGreenIcon />
                      <div className='text_green'>{Number(percent).toFixed(2)}%</div>
                    </>
                  ) : (
                    <>
                      <ArrowRedIcon />
                      <div className='text_red'>{Number(percent).toFixed(2)}%</div>
                    </>
                  )}
                  <span className='ml-12'>{GlobixFixed(pnl)} USDT</span>
                </div>
              </div>
              <div className='portfolio'>
                <h3 className='mb-12'>Portfolio</h3>
                <p className='mb-4'>{coins} coins</p>
                <div className='mt-7'>
                  {coins_diff >= 0 ? (
                    <>
                      <ArrowGreenIcon />
                      <div className='text_green'>{coins_diff == 0 ? coins_diff : `+${coins_diff}`}</div>
                    </>
                  ) : (
                    <>
                      <ArrowRedIcon />
                      <div className='text_red'>-{coins_diff}</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          {currency && currency.length > 0 && (
            <div className='volatility'>
              <div className='volatility__title'>Volatility</div>
              <Tabs defaultIndex='1'>
                <TabItem label='Gainers' index='1'>
                  <Slider {...settings}>
                    {currency &&
                      currency
                        .filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i && v.percent_change_7d != null)
                        .map(({icon, name, price_usd, percent_change_7d}, idx) => (
                          <div className='slider_items' key={idx}>
                            <div className='slider_content'>
                              {icon && (
                                <div className='icon mr-8'>
                                  <img src={icon} alt='icon' />
                                </div>
                              )}
                              <div className='info'>
                                <h3>{name}</h3>
                                <div>
                                  <span className='mr-4'>{GlobixFixed(price_usd)}</span>
                                  <div className={percent_change_7d >= 0 ? 'status ap' : ' status down'}>
                                    {percent_change_7d >= 0 ? (
                                      <div>
                                        <ArrowGreenIcon />
                                        <p>{percent_change_7d.toFixed(2)}%</p>
                                      </div>
                                    ) : (
                                      <div>
                                        <ArrowRedIcon />
                                        <p>{percent_change_7d.toFixed(2)}%</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                  </Slider>
                </TabItem>
                <TabItem label='Falling' index='2'>
                  <Slider {...settings}>
                    {currency &&
                      currency
                        .filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i && v.percent_change_7d != null)
                        .reverse()
                        .map(({icon, name, price_usd, percent_change_7d}, idx) => (
                          <div className='slider_items' key={idx}>
                            <div className='slider_content'>
                              {icon && (
                                <div className='icon mr-8'>
                                  <img src={icon} alt='icon' />
                                </div>
                              )}
                              <div className='info'>
                                <h3>{name}</h3>
                                <div>
                                  <span className='mr-4'>{GlobixFixed(price_usd)}</span>
                                  <div className={percent_change_7d >= 0 ? 'status ap' : ' status down'}>
                                    {percent_change_7d >= 0 ? (
                                      <div>
                                        <ArrowGreenIcon />
                                        <p>{percent_change_7d.toFixed(2)}%</p>
                                      </div>
                                    ) : (
                                      <div>
                                        <ArrowRedIcon />
                                        <p>{percent_change_7d.toFixed(2)}%</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                  </Slider>
                </TabItem>
              </Tabs>
            </div>
          )}
        </div>
      ) : (
        <div className='no_items'>
          <div className='no_items__title mb-38'>Loing investment</div>
          <div className='no_items__icon mb-16'>
            <NoStakingIcon />
          </div>
          <span className='mb-24'>Investment portfolio is empty </span>
          <div className='no_items__link mb-60'>
            <Link className='good-hover' to={'/main/long-investment'}>
              <PlusIcon />
              Start ivesting
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};

export default Investment;
