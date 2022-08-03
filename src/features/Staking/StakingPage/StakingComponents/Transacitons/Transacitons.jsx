import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from '../../../../../shared/Pagination';
import SelectComponent from '../../../../../shared/SelectComponent';
import { ReactComponent as VectorIcon } from '../../../../../assets/images/arrow_actions.svg';
import { ReactComponent as CashFlowIcon } from '../../../../../assets/images/CashFlow.svg';
import { ReactComponent as FilterIcon } from '../../../../../assets/images/filter.svg';
import { ReactComponent as SortDownIcon } from '../../../../../assets/images/sort_down.svg';
import { ReactComponent as SortUpIcon } from '../../../../../assets/images/sort_up.svg';
import './Transacitons.scss';
import { getStakingTransactions } from '../../StakingPageActions';
import Convert from '../../../../../helpers/Convert';
import { curToFixed } from '../../../../../helpers/currencyNaming';
import { ToListStart } from '../../../../../helpers/functions';

import moment from 'moment';

const Transaciton = () => {
  const dispatch = useDispatch();
  const {
    stakingPage: { transactions, staking_desc },
    staking: { dashboardStaking }
  } = useSelector(({ stakingPage, staking }) => ({ stakingPage, staking }));

  const [isFirst, setIsFirst] = useState(true);
  const [activePage, setActivePage] = useState(0);
  const [parameters, setParameters] = useState({
    count: 10,
    ordering: '',
    type: null,
    filter: null
    //test: 1
  });
  const initialParameters = {
    count: 10,
    ordering: '',
    type: null,
    filter: null
    //test: 1
  };

  const options = [
    { value: null, label: 'All' },
    { value: 'in', label: 'Deposit' },
    { value: 'out', label: 'Withdraw' },
    { value: 'fee', label: 'Accrual' },
    { value: 'ref', label: 'Referral accruals' }
  ];

  const optionsSpec = [
    { value: null, label: 'All' },
    { value: 'in', label: 'Deposit' },
    { value: 'fee', label: 'Accrual' }
  ];

  const StakingOptions = [
    { value: null, label: 'All' },
    { value: 'swap', label: 'Uniswap' },
    { value: 'pump', label: 'Pump deposit' },
    { value: 'stake', label: 'Staking' }
  ];

  const optionsPage = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 30, label: '30' },
    { value: 50, label: '50' }
  ];

  const sortList = [
    {
      name: 'Date & Time',
      value: 'time',
      width: 18,
      addClass: ''
    },
    {
      name: 'Staking',
      value: null,
      width: 15,
      addClass: ''
    },
    {
      name: 'Amount',
      value: 'amount',
      width: 15,
      addClass: 'text_right'
    },
    {
      name: 'Equal in $',
      value: null,
      width: 15,
      addClass: 'text_right'
    },
    {
      name: 'Action',
      value: null,
      width: 32,
      addClass: 'action'
    }
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
    let url = [`page=${page + 1}`];
    for (let key in parameters) {
      if (parameters[key] !== null && parameters[key] !== '') {
        url.push(`${key}=${parameters[key].value ? parameters[key].value : parameters[key]}`);
      }
    }
    dispatch(getStakingTransactions(url.join('&')));
  };

  useEffect(() => {
    if (isFirst) {
      setIsFirst(false);
    } else {
      setPage({ selected: 0 }, true);
    }
  }, [parameters]);

  return (
    <section className='card-wrap transaciton_table_block'>
      <div>
        <div className='filter'>
          <div className='left'>
            <div className='title'>Transactions</div>
            <div className='options'>
              <div className='icon'>
                <FilterIcon style={{ cursor: 'pointer' }} onClick={() => setParameters(initialParameters)} />
              </div>
              <SelectComponent
                // menuIsOpen
                onChange={(e) => setParameters({ ...parameters, type: e.value })}
                value={optionsSpec.find((c) => c.value === parameters.type)}
                options={optionsSpec}
                components={{ DropdownIndicator }}
              />

              <SelectComponent
                // menuIsOpen
                onChange={(e) => setParameters({ ...parameters, filter: e.value })}
                value={[
                  { value: null, label: 'All' },
                  ...Object.keys(dashboardStaking).map((el) => ({ value: el, label: dashboardStaking[el].name }))
                ].find((c) => c.value === parameters.filter)}
                options={[
                  { value: null, label: 'All' },
                  ...Object.keys(dashboardStaking).map((el) => ({ value: el, label: dashboardStaking[el].name }))
                ]}
                components={{ DropdownIndicator }}
              />
            </div>
          </div>
          <div className={`right${transactions.result.length === transactions.count ? ' mob_bot' : ''}`}>
            <span>
              Showing {+activePage * +parameters.count + 1} -{' '}
              {+activePage * +parameters.count + parameters.count >= transactions.count
                ? transactions.count
                : +activePage * +parameters.count + parameters.count}{' '}
              out of {transactions.count}
            </span>
            <SelectComponent
              onChange={(e) => setParameters({ ...parameters, count: e.value })}
              value={optionsPage.find((el) => el.value === parameters.count)}
              options={optionsPage}
              components={{ DropdownIndicator }}
            />
          </div>
        </div>
        {!!transactions.count ? (
          <>
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
                {Object.keys(dashboardStaking).length > 0
                  ? transactions.result.map(({ amount, deposit_type, time, type }, idx) => (
                    <tr key={idx}>
                      <td className='w-18'>{moment(time * 1000).format('MMM DD HH:mm')}</td>
                      <td className='w-15 icon'>
                        <span>
                          {Array.isArray(staking_desc) && staking_desc.some((elem) => elem.type === deposit_type) && (
                            <img src={staking_desc.find((elem) => elem.type === deposit_type).image} />
                          )}
                        </span>
                        <b>{dashboardStaking[deposit_type].name}</b>
                      </td>
                      <td className='w-15 text_right'>
                        <b>{curToFixed('usdterc', amount, true)}</b>
                      </td>
                      <td className='w-15 text_right'>
                        {deposit_type.includes('inv')
                          ? <Convert name={`${deposit_type.split('inv')[1].toUpperCase()}`} sum={amount} to={`USD`} />
                          : <Convert name={'USDT'} sum={amount} />
                        }
                        {' $'}
                      </td>
                      <td className='w-32 action'>{options.find((el) => el.value === type)?.label}</td>
                    </tr>
                  ))
                  : null}
              </tbody>
            </table>
            <div className={`mob_table${transactions.result.length === transactions.count ? ' mob_bot' : ''}`}>
              {Object.keys(dashboardStaking).length > 0
                ? transactions.result.map(({ amount, deposit_type, time, type }, idx) => (
                  <div key={idx}>
                    <div className='time'>
                      <span>{moment(time * 1000).format('MMM DD HH:mm')}</span>
                      <p>{options.find((el) => el.value === type)?.label}</p>
                    </div>
                    <div className='block'>
                      <div className='icon'>
                        <span>
                          {Array.isArray(staking_desc) && staking_desc.some((elem) => elem.type === deposit_type) && (
                            <img src={staking_desc.find((elem) => elem.type === deposit_type).image} />
                          )}
                        </span>
                        {dashboardStaking[deposit_type].name}
                      </div>
                      <div className='info'>
                        <div className='amount'>
                          <span>{curToFixed('usdterc', amount, true)}</span>
                          <p>
                            {deposit_type.includes('inv')
                              ? <Convert name={`${deposit_type.split('inv')[1].toUpperCase()}`} sum={amount} to={`USD`} />
                              : <Convert name={'USDT'} sum={amount} />
                            }
                            {' $'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
                : null}
            </div>
            {transactions.count > parameters.count && (<>
              <Pagination
                active={activePage}
                pageCount={Math.ceil(transactions.count / parameters.count)}
                //pageCount={10}
                onChange={(page) => setPage(page, true)}
              />
              <ToListStart element='.transaciton_table_block' counter={activePage} />
            </>)}
          </>
        ) : (
          <div className='no_items'>
            <CashFlowIcon />
            <span>No action history</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default Transaciton;
