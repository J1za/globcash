import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useToggle} from '../../../../helpers/hooks';
import DialogMUI from '../../../../shared/DialogMUI';
import {ReactComponent as InfoIcon} from '../../../../assets/images/info.svg';
import {ReactComponent as NoItemsIcon} from '../../../../assets/images/no_items_table.svg';
import {ReactComponent as BitcoinIcon} from '../../../../assets/images/bitcoin.svg';
import {ReactComponent as CloseIcon} from '../../../../assets/images/close_line.svg';
import {ReactComponent as OpenIcon} from '../../../../assets/images/open_icon.svg';
import {TabItem, Tabs} from '../../../../shared/Tabs';
import {ReactComponent as Recipient_walletIcon} from '../../../../assets/images/walletIcon.svg';
import {ReactComponent as Recipient_walletMobIcon} from '../../../../assets/images/Recipient_wallet_mob.svg';
import {ReactComponent as Sender_walletIcon} from '../../../../assets/images/Sender_wallet.svg';
import {ReactComponent as Sender_walletMobIcon} from '../../../../assets/images/walletIcon_mob.svg';
import {ReactComponent as WalletIcon} from '../../../../assets/images/wallet.svg';
import {ReactComponent as HashIcon} from '../../../../assets/images/hash.svg';
import {ReactComponent as MobTimeIcon} from '../../../../assets/images/MobTime.svg';
import {ReactComponent as InfoCashIcon} from '../../../../assets/images/info_cash.svg';
import {ReactComponent as CashFlowIcon} from '../../../../assets/images/CashFlow.svg';
import {ReactComponent as DetailsIcon} from '../../../../assets/images/details_statuses.svg';
import {ReactComponent as FilterIcon} from '../../../../assets/images/filter.svg';
import './Cash.scss';
import Pagination from '../../../../shared/Pagination';
import {Controller, useForm} from 'react-hook-form';
import SelectComponent from '../../../../shared/SelectComponent';
import {ReactComponent as VectorIcon} from '../../../../assets/images/arrow_actions.svg';
import {activityActions, currencies, curToFixed, getCurIco} from '../../../../helpers/currencyNaming';
import {renderSortList, DropdownIndicator, optionsPage, getIco, initialParameters} from './static';
import moment from 'moment';
import Convert from '../../../../helpers/Convert';
import {getWalletApps} from '../../../Dashboard/DashboardComponents/Table/tableActions';
import {ReactComponent as SorryIcon} from '../../../../assets/images/sorry.svg';
import ButtonMUI from '../../../../shared/ButtonMUI';
import {Link} from 'react-router-dom';
import {ToListStart} from '../../../../helpers/functions';
import WithdrawalDialog from '../WalletInfo/WithdrawalDialog';
import {getBinancePrice} from '../../../LongInvestment/LongInvestmentPage/LongIActions';

const Applications = ({isMain, label}) => {
  const dispatch = useDispatch();
  const {
    recentTransactions: {
      transactions: {apps},
      appsLoad
    },
    wallets: {successWithdraw},
    sendToWallet: {successSendToUser},
    longInvestment: {exchangePAIR}
  } = useSelector(({recentTransactions, wallets, longInvestment, sendToWallet}) => ({
    recentTransactions,
    longInvestment,
    wallets,
    sendToWallet
  }));

  const statuses = {
    null: {name: 'rejected', styles: {color: '#FD5757', backgroundColor: 'rgba(253, 87, 87, .16)'}},
    rejected: {name: 'rejected', styles: {color: '#FD5757', backgroundColor: 'rgba(253, 87, 87, .16)'}},
    false: {name: 'pending', styles: {color: '#E18644', backgroundColor: 'rgb(253, 157, 87, .16)'}},
    pending: {name: 'pending', styles: {color: '#E18644', backgroundColor: 'rgb(253, 157, 87, .16)'}},
    true: {name: 'approved', styles: {color: '#15B176', backgroundColor: 'rgba(32, 201, 172, .16)'}},
    approved: {name: 'approved', styles: {color: '#15B176', backgroundColor: 'rgba(32, 201, 172, .16)'}},
    processing: {name: 'processing', styles: {color: '#C854FF', backgroundColor: 'rgba(200, 84, 255, .16)'}}
  };
  const [activePage, setActivePage] = useState(0);
  const [parameters, setParameters] = useState({
    page_size: 10,
    ordering: ''
  });

  const [popupData, setPopupData] = useState({
    amount: null,
    status: null,
    full_name: '',
    iban: '',
    time: '',
    docs: null
  });

  const sortList = [
    {
      name: (
        <>
          <span>#</span>Date & Time
        </>
      ),
      value: null,
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
      value: null,
      width: 20,
      addClass: ''
    },
    {
      name: 'Withdraw amount',
      value: null,
      width: 20,
      addClass: ''
    },
    {
      name: '',
      value: null,
      width: 10,
      addClass: ''
    },
    {
      name: '',
      value: null,
      width: 5,
      addClass: ''
    }
  ];

  const doRequest = () => {
    let url = [`page=${activePage + 1}`];

    dispatch(getWalletApps(url.join('&')));
  };

  useEffect(() => {
    doRequest();
  }, [activePage, successWithdraw, successSendToUser]);

  useEffect(() => {
    dispatch(getBinancePrice('EURUSDT'));
  }, []);

  const [openText, setOpenText] = useState(false);

  const OpenText = () => {
    setOpenText(true);
  };
  const CloseText = () => {
    setOpenText(false);
  };

  const [dialog, toggleDialog] = useState({
    status: false
  });

  const [dialogWithdrawal, toggleDialogWithdrawal] = useState(false);

  const closeDialog = () => {
    toggleDialog((prev) => ({...prev, status: false}));
  };

  const openPopup = (time, amount, full_name, iban, docs, status) => {
    toggleDialogWithdrawal(true);
    setPopupData({
      amount,
      status,
      full_name,
      iban,
      time,
      docs
    });
  };

  const RenderList = () => {
    return (
      <>
        {apps.data.length > 0 ? (
          <div>
            <table className='table desc applications full-width'>
              <thead>
                <tr>{renderSortList(parameters, setParameters, sortList)}</tr>
              </thead>
              <tbody>
                {!isMain
                  ? apps.data.map(
                      ({time = '1643272153', amount, amount_out, full_name, iban, wallet, docs, type, status}) => (
                        <tr>
                          <td className={type === "usdt_euro" ? 'w-27 icon purple' : 'w-27 icon'}>
                            <span>{type === "usdt_euro"? getIco('order_out_fiat') : getIco('order_out')}</span>{' '}
                            {moment(time * 1000).format('MMM DD HH:mm')}
                          </td>
                          <td className='w-28 action'>
                            <p>{type === "usdt_euro" ? 'Withdrawal to fiat' : activityActions['order_out']}</p>
                            {getCurIco(type === 'usdt' ? 'usdterc' : type)}
                          </td>
                          <td className='w-20 '>{curToFixed('usdterc', amount_out, true)}</td>
                          <td className='w-20 bold '>{curToFixed('usdterc', amount, true)}</td>

                          <td className='w-10 status'>
                            <div style={{...statuses[status].styles}}>
                              {statuses[status] && statuses[status].name && statuses[status].name}
                            </div>
                          </td>
                          <td className='w-5 info_td'>
                            <div className='good-hover'>
                              {type !== 'usdt' && type !== 'btc' && type !== 'eth' && (
                                <InfoCashIcon
                                  onClick={() =>
                                    type === 'usdt_euro'
                                      ? openPopup(time, amount, full_name, iban, docs, status)
                                      : toggleDialog({status: true})
                                  }
                                />
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    )
                  : apps.data
                      .slice(0, 5)
                      .map(({time = '1643272153', amount, amount_out, full_name, iban, wallet, docs, type, status}) => (
                        <tr>
                          <td className='w-20 icon'>
                            <span>{type === "usdt_euro"? getIco('order_out_fiat') : getIco('order_out')}</span> {moment(time * 1000).format('MMM DD HH:mm')}

                            
                          </td>
                          <td className='w-25 action'>
                            <p>{type === "usdt_euro" ? 'Withdrawal to fiat' : activityActions['order_out']}</p>
                            {getCurIco(type === 'usdt' ? 'usdterc' : type)}
                          </td>
                          <td className='w-20 '>{curToFixed('usdterc', amount_out, true)}</td>
                          <td className='w-20 bold '>{curToFixed('usdterc', amount, true)}</td>
                          <td className='w-10 status'>
                            <div style={{...statuses[status].styles}}>{statuses[status].name}</div>
                          </td>
                          <td className='w-5 info_td'>
                            <div className='good-hover'>
                              {type !== 'usdt' && type !== 'btc' && type !== 'eth' && (
                                <InfoCashIcon
                                  onClick={() =>
                                    type === 'usdt_euro'
                                      ? openPopup(time, amount, full_name, iban, docs, status)
                                      : toggleDialog({status: true})
                                  }
                                />
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
              </tbody>
            </table>
            <div className='mob_table applications'>
              {apps.data.map(
                ({time = '1643272153', amount, amount_out, full_name, iban, wallet, docs, type, status}) => (
                  <div>
                    <div className='info'>
                      <div className={type === "usdt_euro" ? 'time icon purple' : "time icon"}>
                        <span>{type === "usdt_euro"? getIco('order_out_fiat') : getIco('order_out')}</span>
                        {moment(time * 1000).format('MMM DD HH:mm')}
                      </div>
                      <div className='amount'>
                        <span>
                          <div className={`status`} style={{...statuses[status].styles}}>
                            {statuses[status] && statuses[status].name && statuses[status].name}
                          </div>
                          <span className='info_td'>
                            {type !== 'usdt' && type !== 'btc' && type !== 'eth' && (
                              <InfoCashIcon
                                onClick={() =>
                                  docs
                                    ? openPopup(time, amount, full_name, iban, docs, status)
                                    : toggleDialog({status: true})
                                }
                              />
                            )}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className='info'>
                      <div>Withdraw amount:</div>
                      <div className='amount'>
                        <span>{curToFixed('usdterc', amount_out, true)}</span>
                      </div>
                    </div>
                    <div className='info'>
                      <div>Amount:</div>
                      <div className='amount'>
                        <span>{curToFixed('usdterc', amount, true)}</span>
                      </div>
                    </div>
                    <div className='info'>
                      <div>Сurrency:</div>
                      <div className='amount'>
                        <span>
                          {getCurIco(type === 'usdt' ? 'usdterc' : type)}{' '}
                          {currencies[type === 'usdt' ? 'usdterc' : type] &&
                            currencies[type === 'usdt' ? 'usdterc' : type].fullName &&
                            currencies[type === 'usdt' ? 'usdterc' : type].fullName}{' '}
                          {currencies[type === 'usdt' ? 'usdterc' : type] &&
                            currencies[type === 'usdt' ? 'usdterc' : type].shortName &&
                            currencies[type === 'usdt' ? 'usdterc' : type].shortName}
                        </span>
                      </div>
                    </div>
                    <div className='info bold'>{type === "usdt_euro" ? 'Withdrawal to fiat' : activityActions['order_out']}</div>
                  </div>
                )
              )}
            </div>
            {apps.all_page > 1 && !isMain && (
              <>
                <Pagination
                  active={activePage}
                  pageCount={apps.all_page}
                  onChange={(page) => setActivePage(page.selected)}
                />
                <ToListStart element={/* isMain ? '.table_block' :  */ '.сash_table_block'} counter={activePage} />
              </>
            )}
          </div>
        ) : (
          <div className='no_items'>
            <CashFlowIcon />
            <span>No action history</span>
          </div>
        )}

        <DialogMUI open={dialog.status} onClose={closeDialog}>
          <div className='check_error_dialog'>
            <h2>Withdrawal detail</h2>
            <div className='check_error_dialog__descriptions'>
              <WalletIcon />
              <div>
                Ethereum <span>ETH</span>
              </div>
              <hr />
              <p>Send to wallet</p>
            </div>
            <div className='check_error_dialog__wallets'>
              <div>
                <Sender_walletIcon className='desc' />
                <Recipient_walletMobIcon className='mob' />
                <div>
                  <span className='bm-4'>Inner wallet:</span>
                  <p>0xd1E4F500Bbcc2E0FE82701E4f022c3096c0f3597</p>
                </div>
              </div>
              <div>
                <Recipient_walletIcon className='desc' />
                <Sender_walletMobIcon className='mob' />
                <div>
                  <span className='bm-4'>Recipient wallet:</span>
                  <p>0xd1E4F500Bbcc2E0FE82701E4f022c3096c0f3597</p>
                </div>
              </div>
            </div>
            <div className='check_error_dialog__info'>
              <div>
                <span>Status</span>
                <div className='status' style={{background: 'rgba(253, 157, 87, 0.16)', color: 'rgb(225, 134, 68)'}}>
                  test{' '}
                </div>
              </div>
              <div>
                <span>Amount</span>
                <p>1.567042 ETH</p>
              </div>
              <div>
                <span>Comission</span>
                <p>0.0168846 ETH</p>
              </div>
            </div>
            <div className='check_error_dialog__net_ammount'>
              <div className='text'>
                <span>Net ammount</span>
                <div>
                  <span>1.5545754 ETH</span>
                  <p>5.235.35 $</p>
                </div>
              </div>
            </div>

            <div
              className={
                openText ? 'check_error_dialog__details_statuses open' : 'check_error_dialog__details_statuses'
              }
            >
              <div className='title'>
                <div>
                  <DetailsIcon />
                  Details about application statuses
                </div>
                {!openText ? (
                  <button onClick={OpenText}>
                    <OpenIcon />
                  </button>
                ) : (
                  <button onClick={CloseText}>
                    <CloseIcon />
                  </button>
                )}
              </div>
              {openText ? (
                <div className='details'>
                  <div>The application can be in one of the following statuses:</div>
                  <div>
                    <span>Rejected</span> by the manager, contact support for more details;
                  </div>
                  <div>
                    <span>Pending</span> such an application is in the queue and is awaiting consideration by the
                    manager;
                  </div>
                  <div>
                    An <span>approved</span> request means that the funds have been sent to the wallet address.
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </DialogMUI>

        <WithdrawalDialog
          dialog={dialogWithdrawal}
          step={4}
          usdt={popupData.amount}
          full_name={popupData.full_name}
          iban={popupData.iban}
          status={popupData.status}
          docs={popupData.docs}
          euro={+popupData.amount / +exchangePAIR?.price}
          toggleDialog={() => {
            toggleDialogWithdrawal(!dialogWithdrawal);
          }}
        />
      </>
    );
  };

  return !appsLoad && RenderList();
};

export default Applications;
