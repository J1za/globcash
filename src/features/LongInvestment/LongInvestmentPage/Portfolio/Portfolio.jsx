import React, { useEffect, useState } from 'react';
import { useToggle } from '../../../../helpers/hooks';
import { TabItem, Tabs } from '../../../../shared/Tabs';
import AccordionMUI from '../../../../shared/AccordionMUI';
import Slider from '@material-ui/core/Slider';
import { toast } from 'react-toastify';
import ButtonMUI from '../../../../shared/ButtonMUI';
import DialogMUI from '../../../../shared/DialogMUI';
import CheckboxMUI from '../../../../shared/CheckboxMUI';
import Pagination from '../../../../shared/Pagination';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import SelectComponent from '../../../../shared/SelectComponent';
import { GlobixFixed, ToListStart } from '../../../../helpers/functions';
import {
  buyAvailableCoins,
  getCoinCommission,
  getPortfolio,
  prolongInvestCoins,
  sellCoins,
  deleteCoins,
  getStatistic,
  getExpertForecasts
} from '../LongIActions';
import NoData from '../no_data';
import { css } from '@emotion/react';
import { PropagateLoader } from 'react-spinners';
import moment from 'moment';
import { ReactComponent as VectorIcon } from '../../../../assets/images/arrow_actions.svg';
import { ReactComponent as AccordionIcon } from '../../../../assets/images/acardion.svg';
import { ReactComponent as ArrowGreenIcon } from '../../../../assets/images/arrow_top_green.svg';
import { ReactComponent as ArrowRedIcon } from '../../../../assets/images/arrow_down_red.svg';
import { ReactComponent as BitcoinIcon, ReactComponent as CoinIcon } from '../../../../assets/images/bitcoin.svg';
import { ReactComponent as CashFlowIcon } from '../../../../assets/images/CashFlow.svg';
import { ReactComponent as EndsIcon } from '../../../../assets/images/ends.svg';
import { ReactComponent as ChartIcon } from '../../../../assets/images/chart_portfolio.svg';
import { ReactComponent as PlusIcon } from '../../../../assets/images/plus_grey.svg';
import { ReactComponent as DepositInnerIcon } from '../../../../assets/images/deposit_info.svg';
import { ReactComponent as DepositInfoPopupIcon } from '../../../../assets/images/deposit_info-popup.svg';
import { ReactComponent as ArrowIcon } from '../../../../assets/images/arrow.svg';
import { ReactComponent as InfoGreyIcon } from '../../../../assets/images/info_grey.svg';
import { ReactComponent as WarningIcon } from '../../../../assets/images/warning.svg';
import CashIcon from '../../../../assets/images/cash-ico.png';
import check from '../../../../assets/images/check.svg';
import uncheck from '../../../../assets/images/uncheck.svg';
import 'react-toastify/dist/ReactToastify.css';
import './Portfolio.scss';
import InputMUI from '../../../../shared/InputMUI';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import { curToFixed } from '../../../../helpers/currencyNaming';
import TooltipMUI from '../../../../shared/TooltipMUI';

import useWebSocket from 'react-use-websocket';
import { API_WS_URL } from '../../../../config';

import SellCoinModal from './SellCoinModal';

const ListTop = ({ props, setActiveAccordion, activeAccordion, reload, activeTab, parameters }) => {
  const history = useHistory();

  const goToInner = () => {
    history.push(`/main/long-investment/inner/${id}`);
  };

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
  const [openBlock, setOpenBlock] = useState(false);

  const [checked, setChecked] = useState(false);

  const [durations, setDurations] = useState(5);

  const [amountField, setAmountField] = useState(null);

  const getDurations = (active) =>
    active === 2 ? '3 months' : active === 3 ? '6 months' : active === 4 ? '1 year' : active === 5 ? '2 years' : '';

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

  const [buttonLoad, setLoad] = useState(false);

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
      pnl: props.pnl
    }
  });

  const prolongInvest = () => {
    dispatch(
      prolongInvestCoins(id, {
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

  const schema = yup.object({
    amount: yup
      .number()
      .typeError('you must specify a number')
      .min(0, 'Should be a positive number')
      .required('Field is required')
      .test(true, 'Out of balance', () => {
        return amountField * dialogSell.info.price <= dialogSell.info.amount;
      })
  });

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
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

  useEffect(() => { }, [amountField]);

  const closeDialog = () => {
    toggleDialogProlong((prev) => ({ ...prev, status: false }));
    setChecked(false);
    setAmountField(null);
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

  const closeDialogSell = () => {
    toggleDialogSell((prev) => ({ ...prev, status: false }));
    reset();
    setOpenBlock(false);
    setAmountField(null);
  };

  const {
    created_date,
    currency,
    closed_date,
    closed,
    usdt_amount,
    percent,
    duration,
    end_date,
    events,
    pnl,
    id,
    price,
    chart_7d_svg
  } = props;

  const isLessThenWeek = (+new Date(end_date) - +new Date()) / 1000 / 60 / 60 / 24 / 7 < 1;

  const isLessThenMonth = (+new Date(end_date) - +new Date()) / 1000 / 60 / 60 / 24 / 30 < 1;

  const {
    longInvestment: { coinCommission, coinCommissionLoad }
  } = useSelector(({ longInvestment }) => ({ longInvestment }));

  let feeValue =
    percent !== null
      ? ((percent > 0
        ? coinCommission.exchange_withdrawal_commission_for_profit
        : coinCommission.exchange_withdrawal_commission_for_loss) /
        100) *
      amountField
      : 0;

  return (
    <div className='block_top'>
      <div className='coin_info'>
        <div className='coin'>
          <img src={currency.icon} />
          {closed && <img className='closed-deal-icon' src={CashIcon} alt='coin' />}
        </div>
        <div>
          <div>
            {currency.name} <span>{currency.code}</span>
          </div>
          <p>Invested {moment(created_date).format('DD.MM.YY')}</p>
        </div>
      </div>
      <div className='info'>
        <span>{!parameters ? 'Market price' : 'Hold balance'}</span>
        <div>{!parameters ? GlobixFixed(price) : GlobixFixed(usdt_amount)} USD</div>
      </div>
      <div className='info'>
        <span>{!parameters ? 'Hold balance' : 'Pnl for all time'}</span>
        <div>
          {!parameters ? GlobixFixed(usdt_amount) : GlobixFixed(pnl)} USDT
          <span className={percent > 0 ? 'green' : 'red'}>
            {percent > 0 ? (
              <p>
                <ArrowGreenIcon />
                <p>+{Number(percent).toFixed(2)}%</p>
              </p>
            ) : (
              <p>
                <ArrowRedIcon />
                <p>{percent && Number(percent).toFixed(2)}%</p>
              </p>
            )}
          </span>
        </div>
      </div>
      <div className='chart'>
        {/* <ChartIcon /> */}
        {chart_7d_svg && <img className='portfolio-chart' src={chart_7d_svg} alt='currency chart'></img>}
      </div>
      <div className='info'>
        <span>deposit term: {duration}</span>
        {isLessThenWeek ? (
          <div>
            <div className='tooltip_wrapper' onClick={(event) => event.stopPropagation()}>
              ends in a week <EndsIcon />
              <span>
                There is very little left to the end! Prolong your investment if you want to keep the coin in your
                portfolio
              </span>
            </div>
          </div>
        ) : closed ? (
          <p>paid on {moment(closed_date).format('DD.MM.YY')}</p>
        ) : (
          <p>ends on {moment(end_date).format('DD.MM.YY')}</p>
        )}
        <div></div>
      </div>
      <div className='btn_wrapper'>
        {events.length > 0 && (
          <div className='accordion_icon' onClick={() => setActiveAccordion(activeAccordion === id ? false : id)}>
            <AccordionIcon />
            <span>{events.length}</span>
          </div>
        )}
        {isLessThenMonth && !parameters &&
          <div>
            <TooltipMUI title='Prolong invest' position='top'>
              <button
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
                <PlusIcon />
              </button>
            </TooltipMUI>
          </div>
        }
        {!parameters && (
          <div>
            <TooltipMUI title='Sell a coin' position='top'>
              <button
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
                      pnl: pnl
                    }
                  })
                }
              >
                <DepositInfoPopupIcon />
              </button>
            </TooltipMUI>
          </div>
        )}
        <div onClick={() => goToInner(id)}>
          <TooltipMUI title='Long investment info' position='top'>
            <button>
              <DepositInnerIcon />
            </button>
          </TooltipMUI>
        </div>

        {/*<div*/}
        {/*  className="deposit_info"*/}
        {/*  onClick={(event) => event.stopPropagation()}*/}
        {/*>*/}
        {/*  <div><DepositInfoIcon /></div>*/}
        {/*  <span>The deposit for this coin cannot be sold before the end of the term</span>*/}
        {/*</div>*/}
      </div>

      <SellCoinModal
        dialogSell={dialogSell}
        closeDialogSell={closeDialogSell}
      />

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
    </div>
  );
};

const ListBottom = ({ props, id }) => {
  const dispatch = useDispatch();

  const history = useHistory();

  const goToInner = () => {
    history.push(`/main/long-investment/inner/${id}`);
  };

  const deleteItem = (investment_request, idx) => dispatch(deleteCoins(investment_request, idx, id));
  return (
    <div className='block_bottom'>
      <div className='inner_block head desc'>
        <div className='date'>
          <span>#</span> Date & time
        </div>
        <div>Action</div>
        <div>Amount</div>
        <div>Equal in USDT</div>
        <div>Income tax (%)</div>
        <div className='btn good-hover' onClick={() => goToInner(id)}>
          More applications <ArrowIcon />
        </div>
      </div>
      {props.map(
        (
          { action, action_text, amount, commission, created_date, id, investment, investment_request, status, usdt },
          idx
        ) => (
          <div key={id} className='inner desc'>
            <div className='date opacity'>
              <span>{idx + 1}</span>
              {moment(created_date).format('MMM YY HH:mm')}
            </div>
            <div className='opacity'>{action_text}</div>
            <div className='opacity'>{GlobixFixed(amount)}</div>
            <div className=''>{GlobixFixed(usdt)}</div>
            <div className=''>{GlobixFixed(commission)}</div>
            <div className=''>
              <div className='status'>
                <div className={status}>{status}</div>
              </div>
              <div className='btn_wrapper_inner'>
                {status === 'rejected' ? (
                  <button className='good-hover'>
                    <InfoGreyIcon />
                  </button>
                ) : status === 'pending' ? (
                  <button className='good-hover delete' onClick={() => deleteItem(investment_request, idx)}>
                    <PlusIcon />
                  </button>
                ) : (
                  <button></button>
                )}
              </div>
            </div>
          </div>
        )
      )}
      {props.map(({ id, date, number, action, amount, equal, income, status, investment_request }, idx) => (
        <div className='mob'>
          <div>
            <div className='date_mob'>
              <span>#{number}</span>
              {date}
            </div>
            <div className='text_mob'>{action}</div>
            <div className='income_mob'>
              Income tax (%): <p>{income}</p>
            </div>
          </div>
          <div>
            <div className='amount_mob'>{amount}</div>
            <div className='equal_mob'>{equal}</div>
            <div className='btn_mob'>
              <div className='status'>
                <div className={status === false ? 'rejected' : status === true ? 'approved' : 'pending'}>
                  {status === false ? 'rejected' : status === true ? 'approved' : 'pending'}
                </div>
              </div>
              <div className='btn_wrapper_inner'>
                {status === false ? (
                  <button className='good-hover'>
                    <InfoGreyIcon />
                  </button>
                ) : status === true ? (
                  <button></button>
                ) : (
                  <button className='good-hover delete' onClick={() => deleteItem(investment_request, idx)}>
                    <PlusIcon />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className='mob mob_applications good-hover' onClick={() => goToInner(id)}>
        More applications <ArrowIcon />
      </div>
    </div>
  );
};

const Portfolio = () => {
  const dispatch = useDispatch();
  const socketUrl = `${API_WS_URL}/portfolio/currency/price/`;

  const {
    longInvestment: { portfolio, portfolioLoad }
  } = useSelector(({ longInvestment }) => ({ longInvestment }));

  const override = css`
    position: absolute;
    top: 50%;
    left: 50%;
  `;

  const [parameters, setParameters] = useState({
    page_size: 10,
    closed: false
  });

  const [activePage, setActivePage] = useState(0);

  const [activeAccordion, setActiveAccordion] = useState(false);

  const optionsPage = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 30, label: '30' },
    { value: 50, label: '50' }
  ];

  const setPage = ({ selected }, isReload) => {
    setActivePage(selected);

    if (isReload) doRequest(selected);
  };

  const doRequest = (page) => {
    let url = [`page=${page + 1}`];
    for (let key in parameters) {
      if (parameters[key] !== null && parameters[key] !== '') {
        url.push(`${key}=${parameters[key].value ? parameters[key].value : parameters[key]}`);
      }
    }
    dispatch(getPortfolio(url.join('&')));
  };

  useEffect(() => {
    setPage({ selected: 0 }, true);
  }, [parameters]);

  const { sendJsonMessage } = useWebSocket(socketUrl, {
    onMessage: (e) => {
      [...JSON.parse(e.data)].forEach(
        (el) => (portfolio.results.find((elem) => elem.currency.id === el.id).price = el.price)
      );
      //dispatch(setActualPrice([ ...JSON.parse(e.data) ]));
    },
    shouldReconnect: (closeEvent) => true,
    queryParams: {
      token: localStorage.getItem('token')
    }
  });

  useEffect(() => {
    if (portfolio?.results) sendJsonMessage({ currencies_ids: portfolio.results.map((el) => el.currency.id) });
  }, [portfolio]);

  const DropdownIndicator = (props) => {
    return (
      <DropdownIndicator {...props}>
        <VectorIcon />
      </DropdownIndicator>
    );
  };

  const { control } = useForm();

  const renderTabInner = () =>
    portfolio.count < 1 ? (
      <div className='no_items'>
        <CashFlowIcon />
        <span>No active history</span>
      </div>
    ) : (
      <div>
        <div className='filter'>
          <div className='left'></div>
          <div className='right'>
            <span>
              Showing {+activePage * +parameters.page_size + 1} -{' '}
              {+activePage * +parameters.page_size + parameters.page_size >= portfolio.count
                ? portfolio.count
                : +activePage * +parameters.page_size + parameters.page_size}{' '}
              out of {portfolio.count}
            </span>
            <SelectComponent
              onChange={(e) => setParameters({ ...parameters, page_size: e.value })}
              value={optionsPage.find((c) => c.value === parameters.page_size)}
              options={optionsPage}
              components={{ DropdownIndicator }}
            />
          </div>
        </div>
        <div className='portfolio_content'>
          {portfolio.results.map((el) =>
            el.events.length > 0 ? (
              <AccordionMUI
                accordionData={[
                  {
                    summary: (
                      <ListTop
                        reload={() => setPage({ selected: activePage }, true)}
                        props={el}
                        setActiveAccordion={setActiveAccordion}
                        activeAccordion={activeAccordion}
                        parameters={parameters.closed}
                      />
                    ),
                    details: <ListBottom props={el.events} id={el.id} />,
                    isManualExpanded: true,
                    manualExpanded: activeAccordion === el.id
                  }
                ]}
                color='none'
                expandIcon={<AccordionIcon />}
              />
            ) : (
              <ListTop reload={() => setPage({ selected: activePage }, true)} props={el} parameters={parameters.closed} />
            )
          )}
        </div>
        {portfolio.count > parameters.page_size && (<>
          <Pagination
            active={activePage}
            pageCount={Math.ceil(portfolio.count / parameters.page_size)}
            onChange={(page) => setPage(page, true)}
          />
          <ToListStart element='.portfolio_block' counter={activePage} breakpoint={null} />
        </>)}
      </div>
    );

  return (
    <section className='card-wrap portfolio_block'>
      <div className='title'>Portfolio</div>
      {portfolioLoad ? (
        <PropagateLoader css={override} color={'#3579FC'} />
      ) : portfolioLoad === undefined ? (
        <NoData text={`Error getting portfolio`} />
      ) : (
        <Tabs
          defaultIndex='false'
          onTabClick={(e) => {
            setParameters({ ...parameters, closed: e === 'true' });
          }}
        >
          <TabItem label='Active' index='false'>
            {renderTabInner()}
          </TabItem>
          <TabItem label='History' index='true'>
            {renderTabInner()}
          </TabItem>
        </Tabs>
      )}
    </section>
  );
};

export default Portfolio;
