import React, {useEffect, useState} from 'react';
import Slider from 'react-slick';
import DepositSlider from '@material-ui/core/Slider';

import {getYourInvestment} from './../CoinAction';
import {
  buyAvailableCoins,
  getCoinCommission,
  getPortfolio,
  prolongInvestCoins,
  sellCoins,
  deleteCoins,
  getStatistic,
  getExpertForecasts
} from '../../LongInvestmentPage/LongIActions';
import {useParams, NavLink} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import DialogMUI from '../../../../shared/DialogMUI';
import CheckboxMUI from '../../../../shared/CheckboxMUI';
import ButtonMUI from '../../../../shared/ButtonMUI';
import InputMUI from '../../../../shared/InputMUI';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import NP from 'number-precision';
import useWindowDimensions from '../../../../helpers/useWindowDimensions';

import ChartIcon from '../../../../assets/images/chart_mini_coin.svg';
import {ReactComponent as AddIcon} from '../../../../assets/images/icon_add.svg';
import {ReactComponent as ExportIcon} from '../../../../assets/images/export_icon.svg';
import {ReactComponent as SellIcon} from '../../../../assets/images/sell_icon.svg';
import {ReactComponent as ArrowGreenIcon} from '../../../../assets/images/arrow_top_green.svg';
import {ReactComponent as ArrowRedIcon} from '../../../../assets/images/arrow_down_red.svg';
import {ReactComponent as TermIcon} from '../../../../assets/images/term.svg';
import check from '../../../../assets/images/check.svg';
import uncheck from '../../../../assets/images/uncheck.svg';
import {ReactComponent as WarningIcon} from '../../../../assets/images/warning.svg';

import './YourInvestment.scss';
import {GlobixFixed} from '../../../../helpers/functions';
import SellCoinModal from '../../LongInvestmentPage/Portfolio/SellCoinModal';

const YourInvestment = ({headInfo}) => {
  const {width} = useWindowDimensions();
  const dispatch = useDispatch();

  const {id} = useParams();

  const {yourInvestment} = useSelector(({coinPage}) => coinPage);

  const {
    longInvestment: {coinCommission}
  } = useSelector(({longInvestment}) => ({longInvestment}));

  const [checked, setChecked] = useState(false);

  const [buttonLoad, setLoad] = useState(false);

  const [durations, setDurations] = useState(5);

  const [amountField, setAmountField] = useState(null);

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
      end_date: null
    }
  });

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
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    rows: 3,
    slidesToShow: 1,
    adaptiveHeight: false
  };

  const getDurations = (active) =>
    active === 2 ? '3 months' : active === 3 ? '6 months' : active === 4 ? '1 year' : active === 5 ? '2 years' : '';

  const prolongInvest = () => {
    dispatch(
      prolongInvestCoins(dialogProlong.info.id, {
        duration: getDurations(durations)
      })
    ).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 201) {
        closeDialog();
        reload();
      } else {
        Object.values(res.error.response.data)
          .flat()
          .forEach((el) => toast.error(el, {}));
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
        reload();
        closeDialogSell();
        dispatch(getStatistic());
      } else {
        Object.values(res.error.response.data)
          .flat()
          .forEach((el) => toast.error(el, {}));
      }
    });
  };

  const closeDialog = () => {
    toggleDialogProlong((prev) => ({...prev, status: false}));
    setChecked(false);
  };

  const closeDialogSell = () => {
    toggleDialogSell((prev) => ({...prev, status: false}));
    reset();
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

  useEffect(() => {
    dispatch(getYourInvestment(id));
  }, []);

  // const slider = yourInvestment.results.map((el, id) => ({
  //   id: el.id,
  //   chart: <img src={ChartIcon} alt='' />,
  //   coin_icon: <img src={headInfo.icon} alt='' />,
  //   invested: `Invested ${moment(yourInvestment.created_date).format('DD.MM.YY')}`,
  //   coin: 'Ethereum',
  //   cod: 'ETH',
  //   price: '62724.16 USDT',
  //   pnl_percent: '4',
  //   time: 'ends on 23.12.22',
  //   term: false
  // }));

  return yourInvestment && yourInvestment.results && yourInvestment.results.length !== 0 ? (
    <div className='your_investment_block'>
      <div className='title'>Your investment</div>
      <Slider {...settings}>
        {yourInvestment &&
          yourInvestment.results &&
          yourInvestment.results.map(({id, chart_7d_svg, end_date, term, usdt_amount, percent, created_date}) => (
            <div className='slider_items' key={id}>
              <div className='slider_content'>
                <div className='top'>
                  <div className='coin'>
                    <div className='icon'>
                      <img src={headInfo.icon} alt='' />
                    </div>
                    <div className='coin_info'>
                      <div>
                        <span>{headInfo.name}</span>
                        <p>{headInfo.code}</p>
                      </div>
                      <span>Invested {moment(created_date).format('DD.MM.YY')}</span>
                    </div>
                  </div>
                  <div className='btn'>
                    {/* <button
                      className='good-hover'
                      onClick={() =>
                        toggleDialogProlong({
                          status: true,
                          info: {
                            name: headInfo.name,
                            code: headInfo.code,
                            icon: headInfo.icon,
                            amount: usdt_amount,
                            id: id
                          }
                        })
                      }
                    >
                      <AddIcon />
                    </button> */}
                    {/* {true === true ? (
                      <button
                        className='good-hover'
                        onClick={() =>
                          toggleDialogSell({
                            status: true,
                            info: {
                              name: headInfo.name,
                              code: headInfo.code,
                              icon: headInfo.icon,
                              amount: usdt_amount,
                              // duration: duration,
                              end_date: end_date,
                              // price: usdt_amount,
                              id: id
                            }
                          })
                        }
                      >
                        <ExportIcon />
                      </button>
                    ) : null} */}
                    <button className='good-hover'>
                      <NavLink to={`/main/long-investment/inner/${id}`}>
                        <SellIcon />
                      </NavLink>
                    </button>
                  </div>
                </div>
                <div className='bottom'>
                  <div className='price'>
                    <span>Hold balance</span>
                    <p>{GlobixFixed(usdt_amount)} USDT</p>
                    <div className={`${percent > 0 ? 'green' : 'red'}`}>
                      {percent ? (
                        +percent > 0 ? (
                          <>
                            <ArrowGreenIcon />
                          </>
                        ) : (
                          <>
                            <ArrowRedIcon />
                          </>
                        )
                      ) : null}
                      {percent ? (percent > 1 ? GlobixFixed(Math.abs(percent)) : Math.abs(percent).toFixed(2)) : '- '}%
                    </div>
                  </div>
                  <div className='chart'>
                    <img src={chart_7d_svg} alt='' />
                    {true === true ? (
                      <span>ends on {moment(end_date).format('DD.MM.YY')}</span>
                    ) : (
                      <p>
                        <TermIcon />
                        ends on {moment(end_date).format('DD.MM.YY')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </Slider>
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
              <p>
                {dialogProlong &&
                  dialogProlong.info &&
                  dialogProlong.info.amount &&
                  GlobixFixed(dialogProlong.info.amount)}
                USDT{' '}
              </p>
            </div>
          </div>
          <div className='deposit'>
            <p>Term of deposit</p>
            <div className='rate'>
              <DepositSlider
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
          <ButtonMUI fullWidth disabled={!checked} formAction onClick={() => prolongInvest()}>
            Prolong
          </ButtonMUI>
        </div>
      </DialogMUI>

      <SellCoinModal dialogSell={dialogSell} closeDialogSell={closeDialogSell} />
    </div>
  ) : width > 1399 ? (
    <div className='your_investment_block'></div>
  ) : null;
};

export default YourInvestment;
