import React, {useEffect, useState} from 'react';
import {DialogMUI} from '../../../../shared';
import {getStatistic} from '../LongIActions';
import {useDispatch, useSelector} from 'react-redux';

import {ReactComponent as СongratulationsIcon} from '../../../../assets/images/Сongratulations.svg';

import './AvailableCoins.scss';

import useWebSocket from 'react-use-websocket';
import {API_WS_URL} from '../../../../config';
import {GlobixFixed} from '../../../../helpers/functions';

import BuyCoinForm from './BuyCoinForm';

const BuyCoinModal = ({dialog, toggleDialog}) => {
  const socketUrl = `${API_WS_URL}/portfolio/currency/price/`;

  const [firstStep, setFirstStep] = useState(true);

  const [amountField, setAmountField] = useState(null);

  const dispatch = useDispatch();

  const {
    longInvestment: {investmentRequestTimeout}
  } = useSelector(({longInvestment}) => ({
    longInvestment
  }));

  const {sendJsonMessage} = useWebSocket(socketUrl, {
    onOpen: () => console.log('opened'),
    onMessage: (e) => {
      dialog.info.price = [...JSON.parse(e.data)][0].price;
      //dispatch(setActualPrice([ ...JSON.parse(e.data) ]));
    },
    shouldReconnect: (/* closeEvent */) => true,
    queryParams: {
      token: localStorage.getItem('token')
    }
  });

  useEffect(() => {
    dispatch(getStatistic());
    if (dialog?.info?.id) sendJsonMessage({currencies_ids: [dialog.info.id]});
  }, [dialog.info.id]);

  const closeDialog = () => {
    toggleDialog((prev) => ({...prev, status: false}));
    setTimeout(() => setFirstStep(true), 100);
  };

  return (
    <DialogMUI open={dialog.status} onClose={closeDialog}>
      <div className={`dialog dialog_${firstStep ? 'buy' : 'congratulations'}`}>
        <div className='title'>{firstStep ? 'Buy a coin' : 'Сongratulations'}</div>
        <div className='descriptions'>
          {firstStep ? (
            'Market info'
          ) : (
            <>
              An application to buy {amountField} {dialog.info.code} has been generated and will be processed within{' '}
              {investmentRequestTimeout} minutes.
            </>
          )}
        </div>
        {firstStep ? (
          <>
            <div className='market'>
              <div className='left'>
                {dialog.info.icon !== null ? <img src={dialog.info.icon} alt='icon' /> : <span />}
                <div>
                  <span>{dialog.info.name}</span>
                  <p>{dialog.info.code}</p>
                </div>
              </div>
              <div className='right'>
                <span>Market price</span>
                <p>{dialog.info.price ? GlobixFixed(dialog.info.price) : '-'} USDT</p>
              </div>
            </div>
            <BuyCoinForm isModalInner setFirstStep={setFirstStep} dialog={dialog} setOuterAmount={setAmountField} />
          </>
        ) : (
          <>
            <div className='color'>
              {amountField} {dialog.info.code}
            </div>
            <СongratulationsIcon />
          </>
        )}
      </div>
    </DialogMUI>
  );
};

export default BuyCoinModal;
