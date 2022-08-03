import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ReactComponent as WalletValueNoItems} from '../../../../assets/images/WalletValueNoItems.svg';
import './WalletValue.scss';
import {getWallets, getWalletChartInfo, setWalletsLoading} from './walletChartActions';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
import {PropagateLoader} from 'react-spinners';

import Options from './chartOptions';

import {currencies} from '../../../../helpers/currencyNaming';

const WalletValue = () => {
  const dispatch = useDispatch();
  const {
    wallets: {wallets, activeWallet},
    walletChart: {loadingWallets, loadingChart, walletsInfo, walletChartInfo},
    header: {loading},
    recentTransactions: {transactionsLoad}
  } = useSelector(({header, recentTransactions, wallets, walletChart}) => ({
    header,
    recentTransactions,
    wallets,
    walletChart
  }));

  const periods = [
    {value: '1d', label: '1D'},
    {value: '1m', label: '1M'},
    {value: '3m', label: '3M'},
    {value: '1y', label: '1Y'},
    {value: null, label: 'All'}
  ];
  const [activePeriod, setActivePeriod] = useState({value: null, label: 'All'});
  const [localLoad, setLocalLoad] = useState(true);

  useEffect(() => {
    console.log(walletChartInfo);
  }, [walletChartInfo]);

  useEffect(() => {
    dispatch(getWallets());
  }, []);

  useEffect(() => {
    if (!loadingWallets && activeWallet !== '')
      dispatch(
        getWalletChartInfo(
          walletsInfo.find((el) => el.currency_code.toLowerCase() === wallets[activeWallet].short_name.toLowerCase())
            .id,
          activePeriod.value
        )
      );
  }, [activeWallet, activePeriod, loadingWallets]);

  return (
    <section className=' wallet_value_block'>
      <div className='title mb-28'>
        <h3>Wallet value</h3>
        {loadingWallets || loading || transactionsLoad ? null : (
          <div className='btn_chart'>
            {periods.map((el, idx) => (
              <button
                className={`good-hover${el.value === activePeriod.value ? ' active' : ''}`}
                onClick={() => {
                  dispatch(setWalletsLoading('loadingChart', true));
                  setActivePeriod(el);
                }}
                key={idx}
              >
                {el.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {loadingWallets || loadingChart || loading || transactionsLoad ? (
        <div className='no_items'>
          <PropagateLoader color={'#3579FC'} />
        </div>
      ) : walletChartInfo.length < 1 || walletChartInfo.every((el) => el.y === 0) ? (
        <div className='no_items'>
          <WalletValueNoItems />
          <span>Your wallet is empty</span>
        </div>
      ) : (
        <div className='chart'>
          <HighchartsReact
            highcharts={Highcharts}
            options={Options(walletChartInfo, currencies[activeWallet].fixed)}
            className='highchart'
          />
        </div>
      )}
    </section>
  );
};

export default WalletValue;
