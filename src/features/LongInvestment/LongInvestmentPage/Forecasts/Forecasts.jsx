import React, { useEffect, useState } from 'react';
import {
  ButtonMUI,
  DialogMUI,
  InputMUI,
  Pagination,
  MultiSelectMUI,
  SelectComponent
} from '../../../../shared';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { getExpertForecasts, getAllCoins } from '../LongIActions';
import { useDispatch, useSelector } from 'react-redux';
import { ReactComponent as BackIcon } from '../../../../assets/images/arrow_back_left.svg';
import { ReactComponent as DateIcon } from '../../../../assets/images/time.svg';
import { ReactComponent as MoreForecastIcon } from '../../../../assets/images/forcast_more.svg';
import { ReactComponent as VisibilityIcon } from '../../../../assets/images/visibility.svg';
import { ReactComponent as RelevantIcon } from '../../../../assets/images/relevant.svg';
import { ReactComponent as FilterIcon } from '../../../../assets/images/forecast-filter-icon.svg';
import { ReactComponent as FilterDelete } from '../../../../assets/images/forecast-filter-delete.svg';
import { ReactComponent as VectorIcon } from '../../../../assets/images/arrow_d.svg';
import { ReactComponent as ArrowUp } from '../../../../assets/images/arrow-up.svg';
import { ReactComponent as ArrowDown } from '../../../../assets/images/arrow-down.svg';
import { ReactComponent as CurrentPrice } from '../../../../assets/images/current_price.svg';
import { ReactComponent as TermFlag } from '../../../../assets/images/term-flag.svg';
import LowRisk from '../../../../assets/images/risk=low.svg';
import MediumRisk from '../../../../assets/images/risk=medium.svg';
import HighRisk from '../../../../assets/images/risk=high.svg';
import './Forecasts.scss';
import { ReactComponent as ArrowRight } from '../../../../assets/images/forecast_arrow.svg';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { GlobixFixed, ToListStart } from '../../../../helpers/functions';

import useWebSocket from 'react-use-websocket';
import { API_WS_URL } from '../../../../config';

import BuyCoinModal from '../AvailableCoins/BuyCoinModal';

import Slider from 'react-slick';

const Wrapper = ({ children, currencyId }) => {
  return currencyId
    ? <div className='page'>{children}</div>
    : (
      <main className='long_investment_page forecast-inner'>
        <div className='page'>{children}</div>
      </main>
    );
};

export const TermRender = ({ term }) => {
  return <div className={`term ${term}`}>
    <TermFlag />
    {term} term
  </div>
};

const Forecasts = ({ isInner, currencyId, history }) => {
  const search = window.location.search; // could be '?foo=bar'
  const params = new URLSearchParams(search);
  const preset_id = params.get('preset_id');
  const socketUrl = `${API_WS_URL}/portfolio/currency/price/`;
  const [dialog, toggleDialog] = useState({
    status: false,
    info: {
      price: null,
      name: null,
      icon: null,
      code: null,
      id: null
    }
  });
  const [target, setTarget] = useState(0);

  const [mobFiltersModal, setMobFiltersModal] = useState(false);

  const [parameters, setParameters] = useState({
    page_size: isInner ? 6 : 3,
    start_date: null, // YYYY-MM-DD
    end_date: null, // YYYY-MM-DD
    currency_id: currencyId ? [currencyId] : [], // 1,2,3,4
    profit: null, // 10-20
    risk: null, // low | medium | high
    term: !isInner ? 'short' : null // short | medium | long
  });

  const paramsNames = {
    start_date: 'Start date',
    end_date: 'End date',
    currency_id: 'Currencies',
    profit: 'Profit (%)',
    risk: 'Risk',
    term: 'Term'
  };

  const [activePage, setActivePage] = useState(0);

  const createUrl = (page) =>
    [
      `page=${(typeof page === 'number' ? page : activePage) + 1}`,
      ...Object.keys(parameters)
        .filter((el) => parameters[el] !== null && parameters[el] !== '')
        .map((el) => `${el}=${parameters[el]}`)
    ].join('&');

  /* не дописано
   const createUrl = (page) => [
    `page=${page ? page : (activePage + 1)}`,
    ...Object.keys(parameters)
      .filter(el => (parameters[el] !== null) || ((typeof parameters[el] === 'string' || Array.isArray(parameters[el])) && parameters[el].length > 0))
      .map(el => `${el}=${parameters[el]}`)
  ].join('&')
  */

  const optionsPage = [
    {
      value: '',
      label: <>All</>
    },
    {
      value: 'low',
      label: (
        <>
          <img src={LowRisk} />
          Low risk
        </>
      )
    },
    {
      value: 'medium',
      label: (
        <>
          <img src={MediumRisk} />
          Medium risk
        </>
      )
    },
    {
      value: 'high',
      label: (
        <>
          <img src={HighRisk} />
          High risk
        </>
      )
    }
  ];

  const termOptions = [
    {
      value: '',
      label: <>All</>
    },
    {
      value: 'short',
      label: 'Short term'
    },
    {
      value: 'medium',
      label: 'Medium term'
    },
    {
      value: 'long',
      label: 'Long term'
    }
  ];

  const dispatch = useDispatch();

  const {
    longInvestment: { expertForecasts, statistic, allCoins },
    header: { loading }
  } = useSelector(({ longInvestment, header }) => ({ longInvestment, header }));

  const { sendJsonMessage } = useWebSocket(socketUrl, {
    onOpen: () => console.log('opened'),
    onMessage: (e) => {
      [...JSON.parse(e.data)].forEach((el) => expertForecasts.results.forEach((elem) => { if (elem.currency_id === el.id) elem.price = el.price }));
      //dispatch(setActualPrice([ ...JSON.parse(e.data) ]));
    },
    shouldReconnect: (closeEvent) => true,
    queryParams: {
      token: localStorage.getItem('token')
    }
  });

  useEffect(() => {
    if (expertForecasts?.results) {
      let arr = expertForecasts.results.map((el) => el.currency_id);
      sendJsonMessage({ currencies_ids: arr.filter((el, idx) => arr.slice(idx).filter(elem => elem === el).length === 1) })
    };
  }, [expertForecasts]);

  useEffect(() => {
    if (isInner && allCoins.length < 1) {
      dispatch(getAllCoins()).then((res) => {
        if (res.payload && res.payload.status && res.payload.status === 200) {
          if (preset_id) changeCurIds(res.payload.data.find(el => el.id === +preset_id))
          doRequest(createUrl());
        }
      });
    } else {
      if (currencyId) {
        if (parameters.currency_id.length > 0) doRequest(createUrl())
      } else {
        doRequest(createUrl())
      };
    }
  }, [parameters]);

  const setPage = ({ selected }, isReload) => {
    setActivePage(selected);
    if (isReload) doRequest(createUrl(selected), true);
  };

  const doRequest = (url, paginate) => {
    dispatch(getExpertForecasts(url)).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 200) {
        if (paginate) {
          let topPosition =
            window.pageYOffset +
            document
              .querySelector('.long_investment_page.forecast-inner .page .forecasts_block > .title')
              .getBoundingClientRect().bottom;
          if (currencyId) window.scrollTo({ top: topPosition, behavior: 'smooth' })
          else document.body.scrollIntoView({ block: "start", behavior: "smooth" })
        }
        if (
          !isInner
          && parameters.term === 'short'
          && res.payload.data.short_count < 1
          && Object.keys(res.payload.data).filter(el => el.includes('_count')).some(el => res.payload.data[el] > 0)
        ) {
          setParameters({ ...parameters, term: Object.keys(res.payload.data).filter(el => el.includes('_count')).find(el => res.payload.data[el] > 0).replace('_count', '') });
        }
      }
    });
  };

  const moreForecasts = () => {
    let tempParams = [
      `page_size=${(activePage + 1) * parameters.page_size + parameters.page_size}`,
    ];

    if (!isInner) tempParams.push(`term=${parameters.term}`)
    if (currencyId) tempParams.push(`currency_id=${parameters.currency_id.join(',')}`)

    doRequest(tempParams.join('&'));
    setPage({ selected: activePage + 1 }, false);
  };

  const DropdownIndicator = (props) => {
    return (
      <DropdownIndicator {...props}>
        <VectorIcon />
      </DropdownIndicator>
    );
  };

  const changeCurIds = (e) =>
    setParameters({
      ...parameters,
      currency_id: parameters.currency_id.some((el) => el === e.id)
        ? (() => {
          parameters.currency_id.splice(
            parameters.currency_id.findIndex((el) => el === e.id),
            1
          );
          return parameters.currency_id;
        })()
        : [e.id, ...parameters.currency_id]
    });

  const renderTermsTabs = () =>
    termOptions.map((el, idx) =>
      el.value !== '' && expertForecasts[`${el.value}_count`] !== 0 && (
        <button
          className={`term_tab${parameters.term === el.value ? ' active' : ' good-hover'}`}
          key={idx}
          disabled={parameters.term === el.value}
          onClick={() => {
            setPage({ selected: 0 }, false);
            setParameters({ ...parameters, term: el.value });
          }}
        >
          {el.label.replace(' term', '')}
          <span>{expertForecasts[`${el.value}_count`]}</span>
        </button>
      )
    )

  const renderTitle = () => (
    <div className={`title${isInner ? '' : ' with-tabs'}`}>
      {isInner ? (
        <>
          <div
            className='good-hover'
            onClick={() => (history && history.length > 1 ? history.goBack() : history.push('/main/dashboard'))}
          >
            <div>
              <BackIcon />
            </div>
            <span>{history && history.length > 1 ? 'Back' : 'To dashboard'}</span>
          </div>
          <span>Expert forecasts</span>
          <p className='description'>
            We have collected up-to-date predictions and views on the market situation from leading experts and
            developers of the crypto industry.
          </p>
        </>
      ) : (
        <>
          <span>Expert forecasts</span>
          <div className="tab-block">
            {renderTermsTabs()}
          </div>
          <Link className='good-hover' to={`/main/long-investment/forecasts${currencyId ? `?preset_id=${currencyId}` : ''}`}>
            All forecasts
            <ArrowRight />
          </Link>
        </>
      )}
    </div>
  );

  const renderFilters = () => (
    <div className='filters-row'>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          disableToolbar
          variant='inline'
          format='dd.MM.yyyy'
          margin='normal'
          id='date-picker-inline'
          value={parameters.start_date}
          placeholder={'Start date'}
          onChange={(e) => setParameters({ ...parameters, start_date: moment(e).format('YYYY-MM-DD') })}
          KeyboardButtonProps={{
            'aria-label': 'change date'
          }}
          maxDate={parameters.end_date ? parameters.end_date : moment('2100-01-01')}
          autoOk={true}
        />
      </MuiPickersUtilsProvider>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          disableToolbar
          variant='inline'
          format='dd.MM.yyyy'
          margin='normal'
          id='date-picker-inline'
          value={parameters.end_date}
          placeholder={'End date'}
          onChange={(e) => setParameters({ ...parameters, end_date: moment(e).format('YYYY-MM-DD') })}
          KeyboardButtonProps={{
            'aria-label': 'change date'
          }}
          minDate={parameters.start_date ? parameters.start_date : moment('1900-01-01')}
          autoOk={true}
        />
      </MuiPickersUtilsProvider>
      <MultiSelectMUI
        label={false}
        items={allCoins}
        value={allCoins.filter((el) => parameters.currency_id.some((elem) => el.id === elem))}
        onChange={(e) => changeCurIds(e)}
        placeholder={`Select the currency`}
        maxItems={1}
        isSearchable
      />
      <InputMUI
        className='auth-box__input'
        type='text'
        placeholder={'Profit (%): for ex. 10-20'}
        error={(() => {
          if (parameters.profit === null || parameters.profit === '') return;
          if (!parameters.profit.includes('-')) {
            return 'Must be range specified. Please enter two numbers separated by a hyphen';
          } else if (parameters.profit.split('-').some((el) => isNaN(Number(el)) || el === '')) {
            return 'Both sides must be numbers';
          } else if (parameters.profit.split('-')[1] < parameters.profit.split('-')[0]) {
            return 'Right side must be less than or equal to the left side';
          }
        })()}
        onChange={(e) => setParameters({ ...parameters, profit: e.target.value })}
        value={parameters.profit}
      />
      <SelectComponent
        //menuIsOpen
        onChange={(e) => setParameters({ ...parameters, risk: e.value })}
        value={optionsPage.find((el) => el.value === parameters.risk)}
        options={optionsPage}
        components={{ DropdownIndicator }}
        placeholder={'Select risk level'}
      />
      <SelectComponent
        //menuIsOpen
        onChange={(e) => setParameters({ ...parameters, term: e.value })}
        value={termOptions.find((el) => el.value === parameters.term)}
        options={termOptions}
        components={{ DropdownIndicator }}
        placeholder={'Timeframe'}
      />
    </div>
  );

  const mobFilterIndicators = () => {
    let TempArr = [];

    const createFilterButton = (el, value, del) => (
      <button onClick={() => setParameters({ ...parameters, [el]: del || null })} className={`filter-delete-button`}>
        {paramsNames[el]}: {value || parameters[el]}
        <FilterDelete />
      </button>
    );

    Object.keys(paramsNames).forEach((el) => {
      if (typeof parameters[el] === 'string' || Array.isArray(parameters[el])) {
        if (parameters[el].length > 0) {
          if (el === 'currency_id') {
            let cropSize = 1, //Must specify crop size
              values = parameters[el].map((curId) => allCoins.find((coin) => Number(coin.id) === Number(curId)).name),
              str =
                values.length <= cropSize
                  ? values.join(', ')
                  : `${[...Array(cropSize).keys()].map((el) => values[el]).join(', ')} + more ${values.length - cropSize
                  }`;

            TempArr.push(createFilterButton(el, str, []));
          } else if (el.includes('date') && parameters[el] !== null && parameters[el] !== '') {
            TempArr.push(createFilterButton(el, moment(parameters[el]).format('DD.MM.YYYY')));
          } else {
            TempArr.push(createFilterButton(el));
          }
        }
      } else {
        if (parameters[el] !== null && parameters[el] !== '') {
          TempArr.push(createFilterButton(el));
        }
      }
    });
    return TempArr;
  };

  const mobFilters = () => {
    let filters = [
      <ButtonMUI onClick={() => setMobFiltersModal(true)}>
        <FilterIcon />
        FILTERS
      </ButtonMUI>,
      ...mobFilterIndicators()
    ];
    return <div className='mob-filters'>{filters}</div>;
  };

  const heightFix = (target) => {
    target.parentElement.style.paddingBottom = `${target.clientHeight}px`;
  };

  const forecastMapFunc = () => (
    expertForecasts && expertForecasts.results && expertForecasts.results.length > 0 ? (
      expertForecasts.results.map(
        (
          {
            one_year,
            currency_id,
            six_month,
            tree_month,
            two_year,
            created_date,
            price_change,
            preview,
            currency_code,
            percent,
            currency_name,
            currency_icon,
            id,
            username,
            position,
            predict_price,
            price,
            avatar,
            title,
            tree_month_risk,
            six_month_risk,
            one_year_risk,
            two_year_risk,
            term
          },
          idx
        ) => (
          <div key={id} className={`forcast-card ${term}`}>
            <div className='top'>
              <div className='left'>
                {avatar ? (
                  <Link className='good-hover' to={`/main/long-investment/coin/${id}`}>
                    <img src={avatar} alt='avatar' />
                  </Link>
                ) : (
                  <span />
                )}
                <div>
                  <Link className='good-hover' to={`/main/long-investment/coin/${id}`}>
                    <span>{username}</span>
                  </Link>
                  <p>{position}</p>
                </div>
              </div>
              <TermRender term={term} />
            </div>
            <div className='middle'>
              <div className="term-date_block">
                {created_date ? (
                  <div className='date'>
                    {/* <DateIcon /> */}
                    {moment(created_date).format('DD.MM.YYYY')}
                  </div>
                ) : (
                  <div className='date'>
                    {/* <RelevantIcon /> */}
                    not relevant
                  </div>
                )}
                <TermRender term={term} />
              </div>
              <div className='title'>
                {title}
                {created_date ? (
                  <div className='date'>
                    {/* <DateIcon /> */}
                    {moment(created_date).format('DD.MM.YYYY')}
                  </div>
                ) : (
                  <div className='date'>
                    {/* <RelevantIcon /> */}
                    not relevant
                  </div>
                )}
              </div>
              <div className=' descriptions'>{preview}</div>
              <Link className='good-hover' to={`/main/long-investment/coin/${id}`}>
                <span className='btn_more good-hover'>Learn more →</span>
              </Link>
              <div className='brown'>Expert forecast</div>
              <div className='info_coin'>
                {tree_month ? (
                  <div>
                    <div className='recomendation-row'>
                      {tree_month_risk && tree_month_risk.toLowerCase() === 'low' ? (
                        <>
                          <img src={LowRisk} alt='icon' />
                          <div className='recomendation-txt'>
                            <span>3 months</span>
                            <p>Low risk</p>
                          </div>
                          <div className={tree_month >= 0 ? 'info_coin__month green' : 'info_coin__month red'}>
                            {tree_month >= 0 ? <ArrowUp /> : <ArrowDown />}≈ {tree_month}%
                          </div>
                        </>
                      ) : tree_month_risk.toLowerCase() === 'medium' ? (
                        <>
                          <img src={MediumRisk} alt='icon' />
                          <div className='recomendation-txt'>
                            <span>3 months</span>
                            <p>Medium risk</p>
                          </div>
                          <div className={tree_month >= 0 ? 'info_coin__month green' : 'info_coin__month red'}>
                            {tree_month >= 0 ? <ArrowUp /> : <ArrowDown />} ≈ {tree_month}%
                          </div>
                        </>
                      ) : tree_month_risk.toLowerCase() === 'high' ? (
                        <>
                          <img src={HighRisk} alt='icon' />
                          <div className='recomendation-txt'>
                            <span>3 months</span>
                            <p>High risk</p>
                          </div>
                          <div className={tree_month >= 0 ? 'info_coin__month green' : 'info_coin__month red'}>
                            {tree_month >= 0 ? <ArrowUp /> : <ArrowDown />} ≈ {tree_month}%
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                ) : null}
                {six_month ? (
                  <div>
                    <div className='recomendation-row'>
                      {six_month_risk && six_month_risk.toLowerCase() === 'low' ? (
                        <>
                          <img src={LowRisk} alt='icon' />
                          <div className='recomendation-txt'>
                            <span>6 months</span>
                            <p>Low risk</p>
                          </div>
                          <div className={six_month >= 0 ? 'info_coin__month green' : 'info_coin__month red'}>
                            {six_month >= 0 ? <ArrowUp /> : <ArrowDown />}≈ {six_month}%
                          </div>
                        </>
                      ) : six_month_risk.toLowerCase() === 'medium' ? (
                        <>
                          <img src={MediumRisk} alt='icon' />
                          <div className='recomendation-txt'>
                            <span>6 months</span>
                            <p>Medium risk</p>
                          </div>
                          <div className={six_month >= 0 ? 'info_coin__month green' : 'info_coin__month red'}>
                            {six_month >= 0 ? <ArrowUp /> : <ArrowDown />} ≈ {six_month}%
                          </div>
                        </>
                      ) : six_month_risk.toLowerCase() === 'high' ? (
                        <>
                          <img src={HighRisk} alt='icon' />
                          <div className='recomendation-txt'>
                            <span>6 months</span>
                            <p>High risk</p>
                          </div>
                          <div className={six_month >= 0 ? 'info_coin__month green' : 'info_coin__month red'}>
                            {six_month >= 0 ? <ArrowUp /> : <ArrowDown />} ≈ {six_month}%
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                ) : null}
                {one_year ? (
                  <div>
                    <div className='recomendation-row'>
                      {one_year_risk && one_year_risk.toLowerCase() === 'low' ? (
                        <>
                          <img src={LowRisk} alt='icon' />
                          <div className='recomendation-txt'>
                            <span>1 year</span>
                            <p>Low risk</p>
                          </div>
                          <div className={one_year >= 0 ? 'info_coin__month green' : 'info_coin__month red'}>
                            {one_year >= 0 ? <ArrowUp /> : <ArrowDown />}≈ {one_year}%
                          </div>
                        </>
                      ) : one_year_risk.toLowerCase() === 'medium' ? (
                        <>
                          <img src={MediumRisk} alt='icon' />
                          <div className='recomendation-txt'>
                            <span>1 year</span>
                            <p>Medium risk</p>
                          </div>
                          <div className={one_year >= 0 ? 'info_coin__month green' : 'info_coin__month red'}>
                            {one_year >= 0 ? <ArrowUp /> : <ArrowDown />} ≈ {one_year}%
                          </div>
                        </>
                      ) : one_year_risk.toLowerCase() === 'high' ? (
                        <>
                          <img src={HighRisk} alt='icon' />
                          <div className='recomendation-txt'>
                            <span>1 year</span>
                            <p>High risk</p>
                          </div>
                          <div className={one_year >= 0 ? 'info_coin__month green' : 'info_coin__month red'}>
                            {one_year >= 0 ? <ArrowUp /> : <ArrowDown />} ≈ {one_year}%
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                ) : null}
                {two_year ? (
                  <div>
                    <div className='recomendation-row'>
                      {two_year_risk && two_year_risk.toLowerCase() === 'low' ? (
                        <>
                          <img src={LowRisk} alt='icon' />
                          <div className='recomendation-txt'>
                            <span>2 year</span>
                            <p>Low risk</p>
                          </div>
                          <div className={two_year >= 0 ? 'info_coin__month green' : 'info_coin__month red'}>
                            {one_year >= 0 ? <ArrowUp /> : <ArrowDown />}≈ {two_year}%
                          </div>
                        </>
                      ) : two_year_risk.toLowerCase() === 'medium' ? (
                        <>
                          <img src={MediumRisk} alt='icon' />
                          <div className='recomendation-txt'>
                            <span>2 year</span>
                            <p>Medium risk</p>
                          </div>
                          <div className={one_year >= 0 ? 'info_coin__month green' : 'info_coin__month red'}>
                            {two_year >= 0 ? <ArrowUp /> : <ArrowDown />} ≈ {one_year}%
                          </div>
                        </>
                      ) : two_year_risk.toLowerCase() === 'high' ? (
                        <>
                          <img src={HighRisk} alt='icon' />
                          <div className='recomendation-txt'>
                            <span>2 year</span>
                            <p>High risk</p>
                          </div>
                          <div className={one_year >= 0 ? 'info_coin__month green' : 'info_coin__month red'}>
                            {two_year >= 0 ? <ArrowUp /> : <ArrowDown />} ≈ {two_year}%
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
            <div className='bottom' ref={(e) => !!e && heightFix(e)}>
              <div className='bottom-container'>
                <div className='bottom-container-price'>
                  <CurrentPrice />
                  Сurrent price
                </div>
                <div className='info'>
                  <div className='info_name'>
                    {currency_icon ? <img src={currency_icon} alt='' /> : <span />}
                    <div>
                      <span>{currency_name}</span>
                      <p>{currency_code}</p>
                    </div>
                  </div>
                  <div className='price'>
                    <span>{price !== null ? GlobixFixed(price) : '-'} USDT</span>
                    <div>
                      {/* <span className={`${price >= predict_price ? 'green' : 'red'}`}>
                    {price >= predict_price ? <ArrowGreenIcon /> : <ArrowRedIcon />}
                    <p>{price ? Number(100 - (predict_price * 100 / price)).toFixed(2) : '0.00'}%</p>
                  </span> */}
                      <p>{price && GlobixFixed(price - predict_price)} USDT</p>
                    </div>
                  </div>
                </div>

                <div className='bottom-container-predict'>
                  <div>
                    <p>{price_change && GlobixFixed(predict_price)} USDT</p>
                    <span>Predict price</span>
                  </div>
                  <ButtonMUI
                    fullWidth
                    onClick={() =>
                      toggleDialog({
                        status: true,
                        info: {
                          price: price,
                          name: currency_name,
                          icon: currency_icon,
                          code: currency_code,
                          id: currency_id
                        }
                      })
                    }
                  >
                    Buy now
                  </ButtonMUI>
                </div>
              </div>
            </div>
          </div>
        )
      )
    ) : (
      <h3>No results</h3>
    )
  )

  const desktopView = () => <div className='forecasts_wrapper'>
    {forecastMapFunc()}
  </div>

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToScroll: 1,
    adaptiveHeight: false,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2.25,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1.25,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1.1,
        }
      },
      {
        breakpoint: 425,
        settings: {
          slidesToShow: 1,
        }
      }
    ],
    afterChange: (e) => {
      //console.log(e)
      setTarget(e);
      if ((expertForecasts.results.length - (e + 1) <= 2) && (expertForecasts.results.length !== expertForecasts.count)) {
        moreForecasts();
      }
    }
  };

  const mobView = () => <div className='forecasts_wrapper'>
    <div className='mob_info'>
      <VisibilityIcon />
      <p>{Math.ceil(target + 1)}</p> / <span>{expertForecasts?.count}</span>
    </div>
    <Slider {...settings}>
      {forecastMapFunc()}
    </Slider>
  </div>

  const renderForecast = () => (
    <div className={`forecasts_block${isInner ? ' inner' : ''}`}>
      {renderTitle()}
      {isInner && (window.innerWidth < 1200 ? mobFilters() : renderFilters())}

      {window.innerWidth < 1200 ? mobView() : desktopView()}

      {!(window.innerWidth < 1200)
        ? isInner
          ? Math.ceil(expertForecasts.count / parameters.page_size) > 1 && <>
            <Pagination
              active={activePage}
              pageCount={Math.ceil(expertForecasts.count / parameters.page_size)}
              onChange={(page) => setPage(page, true)}
            />
            <ToListStart element='.forecasts_block' counter={activePage} breakpoint={null} />
          </>
          : expertForecasts && expertForecasts.results && expertForecasts.count > expertForecasts.results.length &&
          <button className='more good-hover' onClick={moreForecasts}>
            <MoreForecastIcon />
            more forecasts
          </button>
        : null}

      <BuyCoinModal dialog={dialog} toggleDialog={toggleDialog} />

      <DialogMUI open={mobFiltersModal} onClose={() => setMobFiltersModal(false)}>
        <div className='dialog dialog_filter'>
          <span>Filters</span>
          {renderFilters()}
          <ButtonMUI fullWidth onClick={() => setMobFiltersModal(false)}>
            APPLY
          </ButtonMUI>
        </div>
      </DialogMUI>
    </div>
  );

  return isInner || currencyId
    ? currencyId && expertForecasts.count === 0
      ? null
      : <Wrapper currencyId={currencyId}>{renderForecast()}</Wrapper>
    : renderForecast();
};

export default Forecasts;
