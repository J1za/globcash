import React, { useEffect, useState } from 'react';
import Pagination from '../../../../shared/Pagination';
import { Controller, useForm } from 'react-hook-form';
import SelectComponent from '../../../../shared/SelectComponent';
import { useToggle } from '../../../../helpers/hooks';
import DialogMUI from '../../../../shared/DialogMUI';
import CheckboxMUI from '../../../../shared/CheckboxMUI';
import Slider from '@material-ui/core/Slider';
import ButtonMUI from '../../../../shared/ButtonMUI';
import {
  getAvailableCoins,
  buyAvailableCoins,
  getRecentPurchases,
  getStatistic,
  getLabelsCoins,
  setActualPrice
} from '../LongIActions';
import { useDispatch, useSelector } from 'react-redux';
import { PropagateLoader } from 'react-spinners';
import { useHistory } from 'react-router-dom';

import { ReactComponent as NonAvatar } from '../../../../assets/images/coin-non-avatar.svg';
import { ReactComponent as VectorIcon } from '../../../../assets/images/arrow_actions.svg';
import { ReactComponent as CashFlowIcon } from '../../../../assets/images/CashFlow.svg';
import { ReactComponent as SortDownIcon } from '../../../../assets/images/sort_down.svg';
import { ReactComponent as SortUpIcon } from '../../../../assets/images/sort_up.svg';
import { ReactComponent as BuyIcon } from '../../../../assets/images/buy.svg';
import { ReactComponent as WarningIcon } from '../../../../assets/images/warning.svg';
import { ReactComponent as ArrowRedIcon } from '../../../../assets/images/arrow_down_red.svg';
import { ReactComponent as ArrowGreenIcon } from '../../../../assets/images/arrow_top_green.svg';
import { ReactComponent as СongratulationsIcon } from '../../../../assets/images/Сongratulations.svg';
import { ReactComponent as NoFoundIcon } from '../../../../assets/images/no_found.svg';

import check from '../../../../assets/images/check.svg';
import uncheck from '../../../../assets/images/uncheck.svg';
import ChartIcon from '../../../../assets/images/chart_mini.png';
import './AvailableCoins.scss';
import InputMUI from '../../../../shared/InputMUI';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import classNames from 'classnames';

import useWindowDimensions from '../../../../helpers/useWindowDimensions';

import useWebSocket from 'react-use-websocket';
import { API_WS_URL } from '../../../../config';
import { GlobixFixed, ToListStart } from '../../../../helpers/functions';

import BuyCoinModal from './BuyCoinModal';

const AvailableCoins = () => {
  const history = useHistory();
  const socketUrl = `${API_WS_URL}/portfolio/currency/price/`;
  const { width } = useWindowDimensions();

  const [activeLabels, setActiveLabels] = useState(null);

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

  const [inputField, setInputField] = useState(null);

  const dispatch = useDispatch();

  const {
    longInvestment: { available, availableLoad, statistic, labelsCoins, labelsCoinsLoad },
    header: { loading }
  } = useSelector(({ longInvestment, header }) => ({
    longInvestment,
    header
  }));

  const { sendJsonMessage } = useWebSocket(socketUrl, {
    onOpen: () => console.log('opened'),
    onMessage: (e) => {
      [...JSON.parse(e.data)].forEach((el) => (available.results.find((elem) => elem.id === el.id).price = el.price));
      //dispatch(setActualPrice([ ...JSON.parse(e.data) ]));
    },
    shouldReconnect: (closeEvent) => true,
    queryParams: {
      token: localStorage.getItem('token')
    }
  });

  useEffect(() => {
    if (available?.results) sendJsonMessage({ currencies_ids: available.results.map((el) => el.id) });
  }, [available]);

  const [activePage, setActivePage] = useState(0);

  const [parameters, setParameters] = useState({
    page_size: 10,
    ordering: 'symbol__cmc_rank'
  });
 
  const initialParameters ={
    page_size: 10,
    ordering: 'symbol__cmc_rank'
  };

  const sortList = [
    {
      name: 'Rank',
      value: 'symbol__cmc_rank',
      classes: ''
    },
    {
      name: 'Name',
      value: null,
      classes: ''
    },
    {
      name: 'Market Cap ($)',
      value: 'symbol__market_cap',
      classes: 'text_right'
    },
    {
      name: 'Price (USDT)',
      value: 'symbol__price',
      classes: 'text_right'
    },
    {
      name: '24h %',
      value: 'symbol__percent_change_24h',
      classes: 'text_right'
    },
    {
      name: '7d %',
      value: 'symbol__percent_change_7d',
      classes: 'text_right'
    },
    {
      name: 'Last 7 Days',
      value: null,
      classes: 'chart'
    },
    {
      name: '',
      value: null,
      classes: ''
    }
  ];

  const optionsPage = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 30, label: '30' },
    { value: 50, label: '50' }
  ];

  const DropdownIndicator = (props) => {
    return (
      <DropdownIndicator {...props}>
        <VectorIcon />
      </DropdownIndicator>
    );
  };

  const setPage = ({ selected }, isReload) => {
    setActivePage(selected);
    if (isReload) doRequest(selected);
  };

  const doRequest = (page) => {
    let url = activeLabels === null ? [`page=${page + 1}`] : [`labels=${activeLabels + 1}&page=${page + 1}`];
    for (let key in parameters) {
      if (parameters[key] !== null && parameters[key] !== '') {
        activeLabels === null && url.push(`${key}=${parameters[key].value ? parameters[key].value : parameters[key]}`);
      }
    }

    if (inputField) {
      dispatch(getAvailableCoins(`search=${inputField}&${url.join('&')}`));
    } else if (activeLabels) {
      dispatch(getAvailableCoins(`labels=${activeLabels}&${url.join('&')}`));
    } else {
      dispatch(getAvailableCoins(url.join('&')));
    }
  };
  const doRequestLabel = (id) => {
    dispatch(getAvailableCoins(id && `labels=${id}`));
  };
  const doRequestSearch = (coin) => {
    activeLabels === null
      ? dispatch(getAvailableCoins(`search=${coin}`))
      : dispatch(getAvailableCoins(`search=${coin}&labels=${activeLabels + 1}`));
  };

  useEffect(() => {
    setPage({ selected: 0 }, true);
  }, [parameters]);

  useEffect(() => {
    dispatch(getLabelsCoins());
  }, []);

  const handleRowClick = (id) => {
    history.push(`/main/long-investment/available-coin/${id}`);
  };

  const renderFilterLabels = () => <div className='filter_labels'>
    {!labelsCoinsLoad &&
      labelsCoins.map((el, idx) => (
        <React.Fragment key={el.id}>
          <span
            className={classNames({ filter_labels__active: idx == activeLabels, available_labels: activeLabels === null })}
            onClick={() => {
              doRequestLabel(activeLabels === idx ? null : el.id);
              setActiveLabels(activeLabels === idx ? null : idx)
            }}
          >
            <img src={el.image} alt='image' />
            {el.name}
          </span>
        </React.Fragment>
      ))}
  </div>

  return (
    <section className=' available_coins_block'>
      <div className='card-wrap'>
        {availableLoad ? (
          <section className='reports_table loading'>
            <div className='card-wrap'>
              <PropagateLoader color={'#3579FC'} />
            </div>
          </section>
        ) : available ? (
          <div>
            <div className='filter'>
              <div className='left'>
                <div className='title'>All available coins</div>
                <div className='filter_search'>
                  <InputMUI
                    className='filter_search__input'
                    type='search'
                    iconSearch
                    fullWidth
                    value={inputField}
                    placeholder='Type the name of the coin'
                    onChange={(e) => (doRequestSearch(e.target.value), setInputField(e.target.value))}
                  />
                </div>
                {width < 1360 && renderFilterLabels()}
              </div>
              <div className='right'>
                {width >= 1360 && renderFilterLabels()}
                {available && available.results && available.results.length > 0 && available.results.length > 9 && (
                  <>
                    <span>
                      Showing {+activePage * +parameters.page_size + 1} -{' '}
                      {+activePage * +parameters.page_size + parameters.page_size >= available.count
                        ? available.count
                        : +activePage * +parameters.page_size + parameters.page_size}{' '}
                      out of {available.count}
                    </span>
                    <SelectComponent
                      onChange={(e) => (setParameters({ ...parameters, page_size: e.value }), setActiveLabels(null))}
                      value={optionsPage.find((el) => el.value === parameters.page_size)}
                      options={optionsPage}
                      components={{ DropdownIndicator }}
                    />
                  </>
                )}
              </div>
            </div>
            <table className='table desc full-width'>
              <thead>
                <tr>
                  {sortList.map((el, idx) => (
                    <th className={`${el.classes}`}>
                      {el.value === null ? (
                        el.name
                      ) : (
                        <button
                          key={idx}
                          className={`good-hover sort_btn${el.value
                            ? el.value ===
                              (parameters.ordering.includes('-') ? parameters.ordering.slice(1) : parameters.ordering)
                              ? el.value === parameters.ordering
                                ? ' up'
                                : ' down'
                              : ''
                            : ' no-sort'
                            }`}
                          onClick={() =>
                            el.value &&
                            setParameters({
                              ...parameters,
                              ordering:
                                el.value ===
                                  (parameters.ordering.includes('-') ? parameters.ordering.slice(1) : parameters.ordering)
                                  ? el.value === parameters.ordering
                                    ? `-${el.value}`
                                    : el.value
                                  : el.value
                            })
                          }
                        >
                          {el.name}
                          <div>
                            <SortUpIcon className='up_icon' />
                            <SortDownIcon className='up_down' />
                          </div>
                        </button>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {available &&
                  available.results &&
                  available.results.length > 0 &&
                  available.results.map(
                    ({
                      cmc_rank,
                      icon,
                      code,
                      percent_change_24h,
                      percent_change_7d,
                      market_cap,
                      id,
                      name,
                      price,
                      chart_7d_svg
                    }) => (
                      <tr key={id} onClick={() => handleRowClick(id)}>
                        <td className='w-10 semi_bold'>
                          <span className='rank'>{cmc_rank !== null ? <span>{cmc_rank}</span> : '-'}</span>
                        </td>
                        <td className='w-12 '>
                          <div className='name'>
                            {icon !== null ? <img src={icon} alt='icon' /> : <NonAvatar />}
                            <div>
                              <span>{name}</span>
                              <p>{code}</p>
                            </div>
                          </div>
                        </td>
                        <td className='w-12 text_right semi_bold'>
                          {market_cap !== null ? <span>{GlobixFixed(market_cap)}</span> : <span>-</span>}
                        </td>
                        <td className='w-12 text_right semi_bold'>
                          {price !== null ? <span>{GlobixFixed(price)}</span> : <span>-</span>}
                        </td>
                        <td className='w-12'>
                          {percent_change_24h !== null ? (
                            <div className={`color ${percent_change_24h < 0 ? 'red' : 'green'}`}>
                              {percent_change_24h < 0 ? <ArrowRedIcon /> : <ArrowGreenIcon />}
                              {percent_change_24h?.toFixed(2)}%
                            </div>
                          ) : (
                            <div className='color'>-</div>
                          )}
                        </td>
                        <td className='w-12'>
                          {percent_change_7d !== null ? (
                            <div className={`color ${percent_change_7d < 0 ? 'red' : 'green'}`}>
                              {percent_change_7d < 0 ? <ArrowRedIcon /> : <ArrowGreenIcon />}
                              {percent_change_7d?.toFixed(2)}%
                            </div>
                          ) : (
                            <div className='color'>-</div>
                          )}
                        </td>
                        <td className='w-20 chart'>
                          {chart_7d_svg && <img className='portfolio-chart' src={chart_7d_svg} alt='currency chart' />}
                        </td>
                        <td className='w-10' onClick={(e) => e.stopPropagation()}>
                          <button
                            className='btn'
                            onClick={() =>
                              toggleDialog({
                                status: true,
                                info: {
                                  price: price,
                                  name: name,
                                  icon: icon,
                                  code: code,
                                  id: id
                                }
                              })
                            }
                          >
                            <BuyIcon />
                            Buy
                          </button>
                        </td>
                      </tr>
                    )
                  )}
              </tbody>
            </table>
            {available && available.results && available.results.length <= 0 && (
              <div className='search-notFound'>
                <NoFoundIcon />
                <p>No coins found...</p>
                <p>Correct your search query if it’s necessary</p>
                <a
                  className='search-notFound_reset'
                  onClick={() => {
                    setParameters(initialParameters);
                    setInputField(null);
                    setActiveLabels(null)
                  }}
                >
                  Clear search
                </a>
              </div>
            )}

            <div className='mob_table'>
              {available &&
                available.results &&
                available.results.map(
                  ({ icon, price, id, cmc_rank, percent_change_7d, percent_change_24h, name, code, chart_7d_svg }) => (
                    <div onClick={() => handleRowClick(id)}>
                      <div className='top'>
                        <div className='left'>
                          {icon !== null ? <img src={icon} alt='icon' /> : <NonAvatar />}
                          <div>
                            <span>{name}</span>
                            <p>{code}</p>
                          </div>
                        </div>
                        <div className='right'>
                          <span>Market price</span>
                          {price !== null ? <p>{GlobixFixed(price)}</p> : <p>-</p>}
                        </div>
                      </div>
                      <div className='middle'>
                        <div className='block'>
                          <span>24h %</span>
                          {percent_change_24h !== null ? (
                            <div className={percent_change_24h < 0 ? 'red' : 'green'}>
                              {percent_change_24h < 0 ? <ArrowRedIcon /> : <ArrowGreenIcon />}
                              {percent_change_24h?.toFixed(2)}%
                            </div>
                          ) : (
                            <div className=''>-</div>
                          )}
                        </div>
                        <div className='block'>
                          <span>7d %</span>
                          {percent_change_7d !== null ? (
                            <div className={percent_change_7d < 0 ? 'red' : 'green'}>
                              {percent_change_7d < 0 ? <ArrowRedIcon /> : <ArrowGreenIcon />}
                              {percent_change_24h?.toFixed(2)}%
                            </div>
                          ) : (
                            <div className=''>-</div>
                          )}
                        </div>
                        <div className='chart_mob'>
                          <span>Last 7 Days</span>
                          <div>{chart_7d_svg && <img src={chart_7d_svg} alt='' />}</div>
                        </div>
                      </div>
                      <div className='bottom' onClick={(e) => e.stopPropagation()}>
                        <div>
                          <p>CM Rank</p>
                          <span>{cmc_rank !== null ? <span>{cmc_rank}</span> : '-'}</span>
                        </div>
                        <button
                          className='btn'
                          onClick={() =>
                            toggleDialog({
                              status: !dialog.status,
                              info: {
                                price: price,
                                name: name,
                                icon: icon,
                                code: code,
                                id: id
                              }
                            })
                          }
                        >
                          <BuyIcon />
                          Buy
                        </button>
                      </div>
                    </div>
                  )
                )}
            </div>
            {available.count > parameters.page_size && (<>
              <Pagination
                active={activePage}
                pageCount={Math.ceil(available.count / parameters.page_size)}
                onChange={(page) => setPage(page, true)}
              />
              <ToListStart element='.available_coins_block' counter={activePage} breakpoint={1360} />
              </>)}
          </div>
        ) : (
          <div className='no_items'>
            <div className='title'>All available coins</div>
            <CashFlowIcon />
            <span>No available coins</span>
          </div>
        )}
      </div>

      <BuyCoinModal dialog={dialog} toggleDialog={toggleDialog} />
    </section>
  );
};

export default AvailableCoins;
