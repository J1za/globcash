import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {useToggle} from '../../../../helpers/hooks';
import {TabItem, Tabs} from '../../../../shared/Tabs';
import {ReactComponent as CashFlowIcon} from '../../../../assets/images/CashFlow.svg';
import {ReactComponent as FilterIcon} from '../../../../assets/images/filter.svg';
import './Cash.scss';
import Pagination from '../../../../shared/Pagination';
import SelectComponent from '../../../../shared/SelectComponent';
import {activityActions, curToFixed} from '../../../../helpers/currencyNaming';
import {renderSortList, DropdownIndicator, optionsPage, getIco, initialParameters} from './static';
import moment from 'moment';
import Convert from '../../../../helpers/Convert';
import Applications from './Applications';
import {ToListStart, toListStart} from '../../../../helpers/functions';
import {ReactComponent as InfoIcon} from '../../../../assets/images/infoIco.svg';

const Cash = () => {
  const [dialog, toggleDialog] = useToggle();
  const {
    recentTransactions: {transactions, transactionsLoad},
    wallets: {activeWallet, wallets}
  } = useSelector(({recentTransactions, wallets}) => ({recentTransactions, wallets}));

  const [activePage, setActivePage] = useState(0);
  const [isFirst, setIsFirst] = useState(true);
  const [parameters, setParameters] = useState({
    page_size: 10,
    ordering: '',
    filtering: ''
  });

  const compareFunction = (a, b) => {
    let {ordering} = parameters,
      type = ordering.includes('-') ? ordering.replace('-', '') : ordering;

    if (ordering.includes('-')) {
      return Number(b[type]) - Number(a[type]);
    } else {
      return Number(a[type]) - Number(b[type]);
    }
  };

  const sliceTransactions = (list) => {
    //third step
    let {page_size} = parameters;
    return page_size === null ? list : list.slice(activePage * page_size, activePage * page_size + page_size);
  };

  const sortTransactions = (list) => {
    //second step
    let {ordering} = parameters;
    return ordering === '' ? list : list.sort((a, b) => compareFunction(a, b));
  };

  const filterTransactions = (list) => {
    //first step
    let {filtering} = parameters;
    return sortTransactions(filtering === '' ? list : list.filter((el) => el.type === filtering));
  };

  useEffect(() => {
    setParameters(initialParameters);
  }, [activeWallet]);

  useEffect(() => {
    //set first page
    setActivePage(0);
  }, [parameters]);

  useEffect(() => {
    //set choosen page
    //toListStart('.сash_table_block');
  }, [activePage]);

  const handleChange = (name, {value}) => {
    setParameters({...parameters, [name]: value});
  };

  const RenderList = (list, noFilter) => {
    let filteredList = filterTransactions(list),
      slicedList = sliceTransactions(filteredList);
    return (
      <>
        {list.length > 0 ? (
          <div>
            <div className='filter'>
              <div className='left'>
                {noFilter ? null : (
                  <>
                    <div className='icon'>
                      <FilterIcon />
                    </div>
                    <SelectComponent
                      onChange={(e) => handleChange('filtering', e)}
                      value={
                        parameters.filtering
                          ? {value: parameters.filtering, label: activityActions[parameters.filtering]}
                          : {value: '', label: 'All'}
                      }
                      options={[
                        {value: '', label: 'All'},
                        ...Object.keys(activityActions)
                          .filter((el) =>
                            el.includes('in_') ? el.includes(wallets[activeWallet].short_name.toLowerCase()) : true
                          )
                          .map((el) => ({value: el, label: activityActions[el]}))
                      ]}
                      components={{DropdownIndicator}}
                    />
                  </>
                )}
              </div>
              <div className='right'>
                <span>
                  Showing {+activePage * +parameters.page_size + 1} -{' '}
                  {+activePage * +parameters.page_size + parameters.page_size >= filteredList.length
                    ? filteredList.length
                    : +activePage * +parameters.page_size + parameters.page_size}{' '}
                  out of {filteredList.length}
                </span>
                <SelectComponent
                  onChange={(e) => handleChange('page_size', e)}
                  value={optionsPage.find((c) => c.value === parameters.page_size)}
                  options={optionsPage}
                  components={{DropdownIndicator}}
                />
              </div>
            </div>
            {filteredList.length > 0 ? (
              <>
                <table className='table desc full-width'>
                  <thead>
                    <tr>{renderSortList(parameters, setParameters)}</tr>
                  </thead>
                  <tbody>
                    {slicedList.map(({time, amount, type}) => (
                      <tr>
                        <td className={type === 'order_out_fiat' ? 'w-30 icon purple' : 'w-30 icon'}>
                          <span>{getIco(type)}</span> {moment(time * 1000).format('MMM DD HH:mm')}
                        </td>
                        <td className='w-30 action'>{activityActions[type]}</td>
                        <td className='w-20 bold '>{curToFixed('usdterc', amount, true)}</td>
                        <td className='w-10 '>
                          <Convert name={wallets[activeWallet].short_name} sum={amount} to={'USD'} />{' '}
                          {type !== 'order_out_fiat' && '$'}
                        </td>
                        {/* {type === 'order_out_fiat' && (
                          <td className='w-10 text_right'>
                            <InfoIcon className='info' onClick={toggleDialog} />
                          </td>
                        )} */}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className='mob_table'>
                  {slicedList.map(({time, amount, type}) => (
                    <div>
                      <div className='time icon'>
                        <span>{getIco(type)}</span>
                        {moment(time * 1000).format('MMM DD HH:mm')}
                      </div>
                      <div className='info'>
                        <div>
                          <div className='action'>{activityActions[type]}</div>
                        </div>
                        <div className='amount'>
                          <span>{curToFixed('usdterc', amount, true)}</span>
                          <p>
                            <Convert name={wallets[activeWallet].short_name} sum={amount} to={'USD'} />$
                          </p>
                        </div>
                      </div>
                      {/* <div className="add_info"><InfoIcon className='info' onClick={toggleDialog} /></div> */}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className='no_items'>
                <CashFlowIcon />
                <span>No action history</span>
              </div>
            )}
            {Math.ceil(filteredList.length / parameters.page_size) > 1 && (
              <>
                <Pagination
                  active={activePage}
                  pageCount={Math.ceil(filteredList.length / parameters.page_size)}
                  onChange={(page) => setActivePage(page.selected)}
                />
                <ToListStart element='.сash_table_block' counter={activePage} />
              </>
            )}
          </div>
        ) : (
          <div className='no_items'>
            <CashFlowIcon />
            <span>No action history</span>
          </div>
        )}
      </>
    );
  };

  return (
    <section className='card-wrap сash_table_block'>
      <div className='title'>Cash flow</div>
      <Tabs defaultIndex='1'>
        <TabItem label='Transactions' index='1'>
          {RenderList(transactions.trans)}
        </TabItem>
        <TabItem label='Applications' index='2'>
          <Applications label='Applications' />
        </TabItem>
      </Tabs>
      {/* <DialogMUI open={dialog} onClose={toggleDialog}>
        <div className="transaction_detail_dialog">
          <h2 >Transaction in detail</h2>
          <h4 className='mb-16'>
            <BitcoinIcon />
            <div className='wallet ml-12'>Bitcoin <span className='ml-4'>BTC</span></div>
            <div className='info'><p></p>Refill of the wallet</div>
          </h4>
          <div className='transaction_detail_dialog__wallets'>
            <div>
              <Recipient_walletIcon className='desc' />
              <Recipient_walletMobIcon className='mob' />
              <div>
                <span className='bm-4'>Sender wallet:</span>
                <p>0xd1E4F500Bbcc2E0FE82701E4f022c3096c0f3597</p>
              </div>
            </div>
            <div>
              <Sender_walletIcon className='desc' />
              <Sender_walletMobIcon className='mob' />
              <div>
                <span className='bm-4'>Recipient wallet:</span>
                <p>0xd1E4F500Bbcc2E0FE82701E4f022c3096c0f3597</p>
              </div>
            </div>

          </div>
          <div className='transaction_detail_dialog__amount'>
            <div className='credited mt-16 mb-24'>
              <h3>Amount credited</h3>
              <div>
                <span>0.00667122</span>
                <p>5.235.35 $</p>
              </div>
            </div>
            <div className="hash">
              <div className='mb-11'><HashIcon /> Hash ID</div>
              <span>a1075db55d416d3ca199f55b6084e2115b9345e16c5cf302fc80e9d5fbf5d48d4e2115b9345e16c5cf3</span>
            </div>
          </div>
        </div>

      </DialogMUI> */}
    </section>
  );
};

export default Cash;
