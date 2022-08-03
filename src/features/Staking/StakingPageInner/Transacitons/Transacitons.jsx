import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from '../../../../shared/Pagination';
import SelectComponent from '../../../../shared/SelectComponent';
import { ReactComponent as VectorIcon } from '../../../../assets/images/arrow_actions.svg';
import { ReactComponent as CashFlowIcon } from '../../../../assets/images/CashFlow.svg';
import { ReactComponent as SortDownIcon } from '../../../../assets/images/sort_down.svg';
import { ReactComponent as SortUpIcon } from '../../../../assets/images/sort_up.svg';
import './Transacitons.scss';
import moment from 'moment';
import { getStakingTransactions } from '../../StakingPage/StakingPageActions';
import Convert from '../../../../helpers/Convert';

import { curToFixed } from '../../../../helpers/currencyNaming';
import { ToListStart } from '../../../../helpers/functions';

const Transaciton = ({ label }) => {
  const dispatch = useDispatch();
  const {
    stakingPage: { transactions, staking_desc },
    staking: { dashboardStaking }
  } = useSelector(({ stakingPage, staking }) => ({ stakingPage, staking }));
  const currency = label.includes('inv')
    ? label.split('inv')[1].toUpperCase()
    : 'USDT';

  const [isFirst, setIsFirst] = useState(true);
  const [activePage, setActivePage] = useState(0);
  const [parameters, setParameters] = useState({
    count: 10,
    ordering: '',
    type: null,
    filter: label
    //test: 1
  });
  const initialParameters = {
    count: 10,
    ordering: '',
    type: null,
    filter: label
    //test: 1
  };

  const options = [
    { value: null, label: 'All' },
    { value: 'in', label: 'Deposit' },
    { value: 'out', label: 'Withdraw' },
    { value: 'fee', label: 'Accrual' },
    { value: 'ref', label: 'Referral accruals' },
    { value: 'transfer', label: 'Transfer' },
  ];

  const optionsPage = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 30, label: '30' },
    { value: 50, label: '50' }
  ];

  const sortList = [
    {
      name: (
        <>
          <span>#</span> Date & Time
        </>
      ),
      value: 'time',
      width: 25,
      addClass: 'date'
    },
    {
      name: 'Action',
      value: null,
      width: 25,
      addClass: ''
    },
    {
      name: 'Amount',
      value: 'amount',
      width: 25,
      addClass: 'text_right'
    },
    {
      name: 'Equal in $',
      value: null,
      width: 25,
      addClass: 'equal text_right'
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
    <section className='card-wrap transacitons_inner_table'>
      {!!transactions.count ? (
        <div>
          <div className='filter'>
            <div className='left'>
              <div className='title'>Transactions</div>
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
                ? transactions.result.map(({ amount, deposit_type, time, type }) => (
                  <tr>
                    <td className='w-25 icon'>
                      <span>
                        {!Array.isArray(staking_desc) && <img src={staking_desc.image} />}
                        {/* {getStakeIco(deposit_type)} */}
                      </span>
                      {moment(time * 1000).format('MMM DD HH:mm')}
                    </td>
                    <td className='w-25 '>{options.find((el) => el.value === type).label}</td>
                    <td className='w-25 bold text_right'>{curToFixed('usdterc', amount, true)} {currency}</td>
                    <td className='w-25 equal text_right'>
                      <Convert name={currency} sum={amount} to={'USD'} /> $
                    </td>
                  </tr>
                ))
                : null}
            </tbody>
          </table>
          <div className={`mob_table${transactions.result.length === transactions.count ? ' mob_bot' : ''}`}>
            {Object.keys(dashboardStaking).length > 0
              ? transactions.result.map(({ amount, deposit_type, time, type }) => (
                <div>
                  <div className='time'>
                    <div className='icon'>
                      <span>{!Array.isArray(staking_desc) && <img src={staking_desc.image} />}</span>
                      {moment(time * 1000).format('MMM DD HH:mm')}
                    </div>
                    <div className='amount'>
                      <span>{curToFixed('usdterc', amount, true)} {currency}</span>
                      <p>
                        <Convert name={currency} sum={amount} to={'USD'} /> $
                      </p>
                    </div>
                  </div>
                  <div className='info'>
                    <div>
                      <div className='action'>{options.find((el) => el.value === type).label}</div>
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
            <ToListStart element='.transacitons_inner_table' counter={activePage} />
          </>)}
        </div>
      ) : (
        <div className='no_items'>
          <div className='title'>Transacitons</div>

          <CashFlowIcon />
          <span>No action history</span>
        </div>
      )}
    </section>
  );
};

export default Transaciton;
