import React, { useState, useEffect } from 'react';
import { TabItem, Tabs } from '../../../../shared/Tabs';
import { Controller, useForm } from 'react-hook-form';
import SelectComponent from '../../../../shared/SelectComponent';
import { ReactComponent as SortUpIcon } from '../../../../assets/images/sort_up.svg';
import { ReactComponent as SortDownIcon } from '../../../../assets/images/sort_down.svg';

import Pagination from '../../../../shared/Pagination';
import { ReactComponent as CashFlowIcon } from '../../../../assets/images/CashFlow.svg';
import { ReactComponent as Finance } from '../../../../assets/images/balances_icon.svg';
import { ReactComponent as Withdrawal } from '../../../../assets/images/Withdrawal.svg';
import { ReactComponent as VectorIcon } from '../../../../assets/images/arrow_actions.svg';
import { ReactComponent as PlusIcon } from '../../../../assets/images/plus_grey.svg';

import './MyActivities.scss';

import { useDispatch, useSelector } from 'react-redux';
import { getMyActivities, deleteCoins } from '../../LongInvestmentPage/LongIActions';
import moment from 'moment';
import { PropagateLoader } from 'react-spinners';
import { GlobixFixed, ToListStart } from '../../../../helpers/functions';

const MyActivities = ({ id }) => {
  const dispatch = useDispatch();
  const {
    longInvestment: { statisticLoad, myActivities }
  } = useSelector(({ longInvestment }) => ({ longInvestment }));
  useEffect(() => {
    dispatch(getMyActivities(id));
  }, []);

  const [activePage, setActivePage] = useState(0);
  const [parameters, setParameters] = useState({
    page_size: 10,
    ordering: '-created_date',
    r: false
  });

  const changeTabIndex = () => {
    setParameters({ ...parameters, r: !parameters.r });
  };

  const optionsPage = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 30, label: '30' },
    { value: 50, label: '50' }
  ];

  const sortList = [
    {
      name: 'Date & Time',
      value: 'created_date',
      width: 30,
      addClass: ''
    },
    {
      name: 'Action',
      width: 30,
      addClass: ''
    },
    {
      name: 'Amount',
      value: 'amount',
      width: 25,
      addClass: ''
    },
    {
      name: 'Equal in $',
      width: 15,
      addClass: ''
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
    dispatch(getMyActivities(id, url.join('&')));
  };

  const deleteItem = (investment_request, idx) => dispatch(deleteCoins(investment_request, idx, id));

  useEffect(() => {
    setPage({ selected: 0 }, true);
  }, [parameters]);

  return (
    <section className={`card-wrap my_activities_table${statisticLoad ? ' _loading' : ''}`}>
      <div className='title'>My activities</div>
      {statisticLoad ? (
        <div style={{ position: 'absolute', left: '50%', top: '50%' }}>
          <PropagateLoader color={'#3579FC'} />
        </div>
      ) : (
        <Tabs defaultIndex='1' changeTabIndex={changeTabIndex}>
          <TabItem label='Transactions' index='1'>
            {myActivities ? (
              <div>
                <div className='filter'>
                  <div className='left'></div>
                  <div className={myActivities.count <= 10 ? 'right' : 'right pagination'}>
                    <span>
                      Showing {+activePage * +parameters.page_size + 1} -{' '}
                      {+activePage * +parameters.page_size + parameters.page_size >= myActivities.count
                        ? myActivities.count
                        : +activePage * +parameters.page_size + parameters.page_size}{' '}
                      out of {myActivities.count}
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
                    {sortList.map((el, idx) => (
                      <th className={`w-${el.width} ${el.addClass} ${idx == 0 ? 'date' : ''}`}>
                        <button
                          key={idx}
                          className={`${el.value && 'good-hover'} sort_btn${el.value
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
                          {idx == 0 && <span>#</span>}
                          {el.name}
                          {el.value && (
                            <div>
                              <SortUpIcon className='up_icon' />
                              <SortDownIcon className='up_down' />
                            </div>
                          )}
                        </button>
                      </th>
                    ))}
                  </thead>
                  <tbody>
                    {myActivities &&
                      myActivities.results &&
                      myActivities.results.map(({ id, created_date, action_text, amount, usdt }) => (
                        <tr key={id}>
                          <td className='w-30 icon'>
                            <span>
                              <Finance />
                            </span>
                            {moment(created_date).format('MMM DD h:mm')}
                          </td>
                          <td className='w-30 action'>{action_text}</td>
                          <td className='w-25 bold '>{amount}</td>
                          <td className='w-15 '>{GlobixFixed(usdt)} $</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                <div className='mob_table'>
                  {myActivities &&
                    myActivities.results &&
                    myActivities.results.map(({ created_date, action_text, amount, usdt }) => (
                      <div>
                        <div className='time icon'>
                          <span>
                            <Finance />
                          </span>
                          {moment(created_date).format('MMM DD h:mm')}
                        </div>
                        <div className='info'>
                          <div>
                            <div className='action'>{action_text}</div>
                          </div>
                          <div className='amount'>
                            <span>{amount}</span>
                            <p>{GlobixFixed(usdt)}$</p>
                          </div>
                        </div>
                        {/*<div className="add_info"><InfoIcon className='info' /></div>*/}
                      </div>
                    ))}
                </div>
                {myActivities.count > parameters.page_size && (<>
                  <Pagination
                    active={activePage}
                    pageCount={Math.ceil(myActivities.count / parameters.page_size)}
                    onChange={(page) => setPage(page, true)}
                  />
                  <ToListStart element='.my_activities_table' counter={activePage} />
                </>)}
              </div>
            ) : (
              <div className='no_items'>
                <CashFlowIcon />
                <span>No action history</span>
              </div>
            )}
          </TabItem>
          <TabItem label='Applications ' index='2'>
            {myActivities ? (
              <div>
                <div className='filter'>
                  <div className='left'></div>
                  <div className={myActivities.count <= 10 ? 'right' : 'right pagination'}>
                    <span>
                      Showing {+activePage * +parameters.page_size + 1} -{' '}
                      {+activePage * +parameters.page_size + parameters.page_size >= myActivities.count
                        ? myActivities.count
                        : +activePage * +parameters.page_size + parameters.page_size}{' '}
                      out of {myActivities.count}
                    </span>
                    <Controller
                      name='select'
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <SelectComponent
                          // menuIsOpen
                          onChange={(e) => setParameters({ ...parameters, page_size: e.value })}
                          value={optionsPage.find((el) => el.value === parameters.page_size)}
                          onBlur={onBlur}
                          options={optionsPage}
                          components={{ DropdownIndicator }}
                        />
                      )}
                    />
                  </div>
                </div>
                <table className='table desc full-width'>
                  <thead>
                    {sortList.map((el, idx) => (
                      <th className={`w-${el.width} ${el.addClass} ${idx == 0 ? 'date' : ''}`}>
                        <button
                          key={idx}
                          className={`${el.value && 'good-hover'} sort_btn${el.value
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
                          {idx == 0 && <span>#</span>}
                          {el.name}
                          {el.value && (
                            <div>
                              <SortUpIcon className='up_icon' />
                              <SortDownIcon className='up_down' />
                            </div>
                          )}
                        </button>
                      </th>
                    ))}
                    <th className='w-15'></th>
                  </thead>
                  <tbody>
                    {myActivities &&
                      myActivities.results &&
                      myActivities.results.map(
                        ({ id, created_date, action_text, investment_request, amount, usdt, status }, idx) => (
                          <tr key={id}>
                            <td className='w-30 icon'>
                              <span>
                                <Finance />
                              </span>
                              {moment(created_date).format('MMM DD h:mm')}
                            </td>
                            <td className='w-30 action'>{action_text}</td>
                            <td className='w-25 bold '>{amount}</td>
                            <td className='w-15 '>{GlobixFixed(usdt)} $</td>
                            <td className={`w-15  status${status === 'pending' ? ' pending_status' : ''}`}>
                              <div
                                className={
                                  status === 'rejected' ? 'rejected' : status === 'pending' ? 'pending' : 'approved'
                                }
                              >
                                {status === 'rejected' ? 'rejected' : status === 'pending' ? 'pending' : 'approved'}
                              </div>
                              {status === 'pending' ? (
                                <button
                                  className='good-hover delete'
                                  onClick={() => deleteItem(investment_request, idx)}
                                >
                                  <PlusIcon />
                                </button>
                              ) : null}
                            </td>
                          </tr>
                        )
                      )}
                  </tbody>
                </table>
                <div className='mob_table'>
                  {myActivities &&
                    myActivities.results &&
                    myActivities.results.map(({ id, created_date, action_text, amount, usdt, status }) => (
                      <div key={id}>
                        <div className='status'>
                          <span className='time icon'>
                            <span>
                              <Finance />
                            </span>
                            {moment(created_date).format('MMM DD h:mm')}
                          </span>
                          <div
                            className={
                              status === 'rejected' ? 'rejected' : status === 'pending' ? 'pending' : 'approved'
                            }
                          >
                            {status === 'rejected' ? 'rejected' : status === 'pending' ? 'pending' : 'approved'}
                          </div>
                        </div>
                        <div className='info'>
                          <div>
                            <div className='action'>{action_text}</div>
                          </div>
                          <div className='amount'>
                            <span>{amount}</span>
                            <p>{GlobixFixed(usdt)}$</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                {myActivities.count > parameters.page_size && (<>
                  <Pagination
                    active={activePage}
                    pageCount={Math.ceil(myActivities.count / parameters.page_size)}
                    onChange={(page) => setPage(page, true)}
                  />
                  <ToListStart element='.my_activities_table' counter={activePage} />
                </>)}
              </div>
            ) : (
              <div className='no_items'>
                <CashFlowIcon />
                <span>No action history</span>
              </div>
            )}
          </TabItem>
        </Tabs>
      )}
    </section>
  );
};

export default MyActivities;
