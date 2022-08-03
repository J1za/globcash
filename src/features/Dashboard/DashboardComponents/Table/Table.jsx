import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useToggle} from '../../../../helpers/hooks';
import DialogMUI from '../../../../shared/DialogMUI';
import moment from 'moment';
import {ReactComponent as InfoIcon} from '../../../../assets/images/info.svg';
import {ReactComponent as NoItemsIcon} from '../../../../assets/images/no_items_table.svg';
import {ReactComponent as BitcoinIcon} from '../../../../assets/images/bitcoin.svg';
import {TabItem, Tabs} from '../../../../shared/Tabs';
import {ReactComponent as Recipient_walletIcon} from '../../../../assets/images/Recipient_wallet.svg';
import {ReactComponent as Recipient_walletMobIcon} from '../../../../assets/images/Recipient_wallet_mob.svg';
import {ReactComponent as Sender_walletIcon} from '../../../../assets/images/Sender_wallet.svg';
import {ReactComponent as Sender_walletMobIcon} from '../../../../assets/images/Sender_wallet_mob.svg';
import {ReactComponent as HashIcon} from '../../../../assets/images/hash.svg';
import {ReactComponent as MobTimeIcon} from '../../../../assets/images/MobTime.svg';

import {getCurIco, currencies, curToFixed, activityActions} from '../../../../helpers/currencyNaming';
import Convert from '../../../../helpers/Convert';
import {getRecent} from './tableActions';
import './Table.scss';
import Applications from '../../../Wallets/WalletsComponents/Cash/Applications';

const TabInner = ({isApp}) => {
  const {activeWallet, recentTransactions, prices} = useSelector(({wallets, recentTransactions, header}) => ({
    activeWallet: wallets.activeWallet,
    recentTransactions: recentTransactions.transactions,
    prices: header.prices
  }));
  return recentTransactions[isApp ? 'apps' : 'trans'].length > 0 ? (
    <div>
      <table className='table desc full-width'>
        <thead>
          <tr>
            <th className='w-14'>Date & Time</th>
            <th className='w-25 currency_title'>Currency</th>
            <th className='w-20'>Action</th>
            <th className='w-14 text_right'>Amount</th>
            <th className='w-14 text_right'>Equal in $</th>
            <th className='w-13' />
          </tr>
        </thead>
        <tbody>
          {prices.length > 0 &&
            activeWallet &&
            recentTransactions &&
            recentTransactions[isApp ? 'apps' : 'trans'].slice(0, 5).map(({amount, time, type}, idx) => (
              <tr key={idx}>
                <td className='w-14'>{moment(time * 1000).format('MMM DD HH:mm')}</td>
                <td className='w-40 currency'>
                  <span className='currency_icon '>{getCurIco(activeWallet)}</span>
                  <span className='bold'> {currencies[activeWallet].fullName} </span>
                  <p> {currencies[activeWallet].shortName} </p>
                </td>
                <td className='w-20'>{activityActions[type]}</td>
                <td className='w-14 bold text_right'>{curToFixed(activeWallet, amount, true)}</td>
                <td className='w-12 text_right'>
                  <Convert name={currencies[activeWallet].shortName} sum={amount} to={'USD'} /> $
                </td>
                <td className='w-0 text_right'>{/* <InfoIcon className='info' onClick={toggleDialog} /> */}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className='mob_table'>
        {prices.length > 0 &&
          activeWallet &&
          recentTransactions &&
          recentTransactions[isApp ? 'apps' : 'trans'].slice(0, 5).map(({amount, time, type}, idx) => (
            <div key={idx}>
              <div className='time'>
                <MobTimeIcon />
                {moment(time * 1000).format('MMM DD HH:mm')}
              </div>
              <div className='info'>
                <div>
                  <div className='currency'>
                    <div className='currency_icon'>{getCurIco(activeWallet)}</div>
                    <span>{currencies[activeWallet].fullName}</span>
                    <p>{currencies[activeWallet].shortName}</p>
                  </div>
                  <div className='action'>{activityActions[type]}</div>
                </div>

                <div className='amount'>
                  <span>{curToFixed(activeWallet, amount, true)}</span>
                  <p>
                    <Convert name={currencies[activeWallet].shortName} sum={amount} to={'USD'} /> $
                  </p>
                </div>
              </div>
              <div className='add_info'><InfoIcon className='info'  /></div>
            </div>
          ))}
      </div>
    </div>
  ) : (
    <div className='no_items'>
      <NoItemsIcon />
      <span>No recent activity</span>
    </div>
  );
};

const Table = () => {
  const dispatch = useDispatch();
  const {activeWallet, recentTransactions, prices} = useSelector(({wallets, recentTransactions, header}) => ({
    activeWallet: wallets.activeWallet,
    recentTransactions: recentTransactions.transactions,
    prices: header.prices
  }));
  const [tab, setTab] = useState('1');
  const [dialog, toggleDialog] = useToggle();

  /* useEffect(() => {
    dispatch(getPrices());
  }, []) */

  useEffect(() => {
    if (activeWallet !== '') {
      dispatch(getRecent(activeWallet));
      //dispatch(getRecent(activeWallet, 'test=1'))
      //console.log(prices.find(el => el.symbol.toLowerCase().includes(activeWallet)))
    }
  }, [activeWallet]);

  return (
    <section className='card-wrap table_block'>
      <div className='title'>Recent activity</div>
      <Tabs onTabClick={(e) => setTab(e)} defaultIndex='1'>
        <TabItem label='Transactions' index='1'>
          <TabInner isApp={false} />
        </TabItem>
        <TabItem label='Applications' index='2'>
          <Applications isMain={true} />
          {/* <TabInner isApp={true} /> */}
        </TabItem>
      </Tabs>
      <DialogMUI open={dialog} onClose={toggleDialog}>
        <div className='transaction_detail_dialog'>
          <h2>Transaction in detail</h2>
          <h4 className='mb-16'>
            <BitcoinIcon />
            <div className='wallet ml-12'>
              Bitcoin <span className='ml-4'>BTC</span>
            </div>
            <div className='info'>
              <p></p>Refill of the wallet
            </div>
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
            <div className='hash'>
              <div className='mb-11'>
                <HashIcon /> Hash ID
              </div>
              <span>a1075db55d416d3ca199f55b6084e2115b9345e16c5cf302fc80e9d5fbf5d48d4e2115b9345e16c5cf3</span>
            </div>
          </div>
        </div>
      </DialogMUI>
    </section>
  );
};

export default Table;
