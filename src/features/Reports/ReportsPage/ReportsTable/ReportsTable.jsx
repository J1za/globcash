import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Pagination from '../../../../shared/Pagination';
import { Controller, useForm } from 'react-hook-form';
import SelectComponent from '../../../../shared/SelectComponent';
import { ReactComponent as VectorIcon } from '../../../../assets/images/arrow_actions.svg';
import { ReactComponent as CashFlowIcon } from '../../../../assets/images/CashFlow.svg';
import { ReactComponent as SortDownIcon } from '../../../../assets/images/sort_down.svg';
import { ReactComponent as SortUpIcon } from '../../../../assets/images/sort_up.svg';
import { ReactComponent as FilesIcon } from '../../../../assets/images/files.svg';
import { getReports } from './reportsActions';
import moment from 'moment';
import './ReportsTable.scss';
import { mainPath } from '../../../../routes/paths';
import { ToListStart } from '../../../../helpers/functions';

import { PropagateLoader } from 'react-spinners';

const ReportsTable = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { reports, listLoad } = useSelector(({ reports }) => reports);
  const store = useSelector((store) => store);
  const [activePage, setActivePage] = useState(0);
  const [parameters, setParameters] = useState({
    page_size: 10,
    ordering: '-name'
  });
  const initialParameters = {
    page_size: 10,
    ordering: '-name'
  };

  const optionsPage = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 30, label: '30' },
    { value: 50, label: '50' }
  ];

  const sortList = [
    {
      name: 'Date',
      value: null,
      width: 25,
      addClass: ''
    },
    {
      name: 'Name',
      value: null,
      width: 25,
      addClass: ''
    },
    {
      name: '',
      value: null,
      width: 25
    },
    {
      name: '',
      value: null,
      width: 25
    }
  ];

  const DropdownIndicator = (props) => {
    return (
      <DropdownIndicator {...props}>
        <VectorIcon />
      </DropdownIndicator>
    );
  };

  const { control } = useForm();

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
    dispatch(getReports(url.join('&')));
  };

  const tableAdditionalInfo = (name, data) => {
    let tempObj = [];
    if (name === 'Trend Follower') {
      tempObj.push({ label: 'Coins per trading session', value: data.number_of_trade });
      tempObj.push({ label: 'Clean PNL', value: data.clean_pnl + '%' });
    } else if (name === 'Defi' || name === 'Defi 2.1' || name === 'Defi 2.2') {
      tempObj.push({ label: 'Trading sessions', value: data.number_of_trade_session });
      tempObj.push({ label: 'Net PNL per session', value: data.average_pnl + '%' });
    } else if (name === 'Trend Follower VIP') {
      tempObj.push({ label: 'Coins per trading session', value: data.number_coin });
      tempObj.push({ label: 'Clean PNL', value: data.clean_pnl + '%' });
    } else if (name === 'Altcoin Arbitrage') {
      tempObj.push({ label: 'Transactions', value: data.number_of_transaction });
      tempObj.push({ label: 'Daily PNL', value: data.daily_pnl + '%' });
    } else if (name === 'Liquidity Pool Arbitrage') {
      tempObj.push({ label: 'Transactions', value: data.number_of_trade_session });
      tempObj.push({ label: 'Daily PNL', value: data.pnl + '%' });
    } else {
      tempObj = [
        { label: 'Transactions', value: '-' },
        { label: 'Daily PNL', value: '-' }
      ];
    }
    return tempObj;
  };

  const goToInner = (id) => {
    history.push(`${mainPath.reports}/${id}`);
  };

  useEffect(() => {
    setPage({ selected: 0 }, true);
  }, [parameters]);

  useEffect(() => {
    console.log(reports);
  }, [reports]);

  const { results: reportsData } = reports;

  return (
    <section className={`reports_table${listLoad ? ' loading' : ''}`}>
      <div className='card-wrap'>
        {listLoad ? (
          <section className='reports_table loading'>
            <div className='card-wrap'>
              <PropagateLoader color={'#3579FC'} />
            </div>
          </section>
        ) : !!reports.count ? (
          <div>
            <div className='filter'>
              <div className='left'>
                <div className='title'>Reports</div>
              </div>
              <div className='right'>
                <span>
                  Showing {+activePage * +parameters.page_size + 1} -{' '}
                  {+activePage * +parameters.page_size + parameters.page_size >= reports.count
                    ? reports.count
                    : +activePage * +parameters.page_size + parameters.page_size}{' '}
                  out of {reports.count}
                </span>
                <Controller
                  name='select'
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <SelectComponent
                      // menuIsOpen
                      onChange={(e) => setParameters({ ...parameters, page_size: e.value })}
                      onBlur={onBlur}
                      value={optionsPage.find((el) => el.value === parameters.page_size)}
                      options={optionsPage}
                      components={{ DropdownIndicator }}
                    />
                  )}
                />
              </div>
            </div>
            <table className='table desc full-width'>
              <thead>
                <tr>
                  {sortList.map((el, idx) => (
                    <th className={`w-${el.width} ${el.addClass}`}>
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
                {reportsData.map(({ staking, data, date, id }) => {
                  let { name } = staking;
                  return (
                    <tr className='row' key={id} onClick={() => goToInner(id)}>
                      <td className='w-25 '>
                        <div className='data'>
                          <FilesIcon /> {moment(date).format('DD.MM.YYYY HH:mm')}
                        </div>
                      </td>
                      <td className='w-25'>
                        <div className='name'>
                          <img src={staking && staking.image} />
                          {staking && staking.name}
                        </div>
                      </td>
                      {tableAdditionalInfo(name, data).map((el, idx) => (
                        <td className='w-25' key={idx}>
                          <div className='text'>
                            <span>{el.label}</span>
                            <p>{el.value}</p>
                          </div>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className='mob_table'>
              {reportsData.map(({ staking, data, date, id }) => {
                let { name } = staking;
                return (
                  <div key={id} onClick={() => goToInner(id)}>
                    <div className='top'>
                      <div>
                        <FilesIcon /> {moment(data && data.date, 'DD.MM.YYYY').format('MMM DD, YYYY')} -{' '}
                        {moment(date).format('MMM DD, YYYY')}
                      </div>
                      <div>
                        <img src={staking && staking.image} />
                        {staking && staking.name}
                      </div>
                    </div>
                    <div className='bottom'>
                      {tableAdditionalInfo(name, data).map((el, idx) => (
                        <div className={!idx ? 'left' : 'right'} key={idx}>
                          <span>{el.label}</span>
                          <p>{el.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              <div className='filter'>
                <div className='right'>
                  <span>
                    Showing {+activePage * +parameters.page_size + 1} -{' '}
                    {+activePage * +parameters.page_size + parameters.page_size >= reports.count
                      ? reports.count
                      : +activePage * +parameters.page_size + parameters.page_size}{' '}
                    out of {reports.count}
                  </span>
                  <Controller
                    name='select'
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <SelectComponent
                        // menuIsOpen
                        onChange={(e) => setParameters({ ...parameters, page_size: e.value })}
                        onBlur={onBlur}
                        value={optionsPage.find((el) => el.value === parameters.page_size)}
                        options={optionsPage}
                        components={{ DropdownIndicator }}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
            {reports.count > parameters.page_size && (<>
              <Pagination
                active={activePage}
                pageCount={Math.ceil(reports.count / parameters.page_size)}
                onChange={(page) => setPage(page, true)}
              />
              <ToListStart element='.reports_table' counter={activePage} breakpoint={1399} />
            </>)}
          </div>
        ) : (
          <div className='no_items'>
            <div className='title'>Reports</div>
            <CashFlowIcon />
            <span>No reports</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReportsTable;
