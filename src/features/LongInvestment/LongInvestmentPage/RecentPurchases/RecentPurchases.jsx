import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ReactComponent as DeleteIcon} from '../../../../assets/images/delete.svg';
import {ReactComponent as CoinIcon} from '../../../../assets/images/bitcoin.svg';
import DialogMUI from '../../../../shared/DialogMUI';
import './RecentPurchases.scss';
import moment from 'moment';
import ButtonMUI from '../../../../shared/ButtonMUI';
import NP from 'number-precision';

import {PropagateLoader} from 'react-spinners';

import {getRecentPurchases, deletePurchases} from '../LongIActions';
import NoData from '../no_data';
import { GlobixFixed } from '../../../../helpers/functions';

const RecentPurchases = () => {
  const dispatch = useDispatch();
  const {
    longInvestment: {recentPurchases, recentPurchasesLoad}
  } = useSelector(({longInvestment}) => ({longInvestment}));

  const [dialogDelete, toggleDialogDelete] = useState({
    status: false,
    info: {
      currency: null,
      usdt_invested: null,
      price: null,
      id: null
    }
  });

  const closeDialogDelete = () => {
    toggleDialogDelete((prev) => ({
      status: false,
      info: {
        currency: null,
        usdt_invested: null,
        id: null,
        price: null
      }
    }));
    reset();
  };
  const deleteItem = (id, idx) =>
    dispatch(deletePurchases(id, idx)).tnen((res) => {
      console.log(res);
      closeDialogDelete();
    });

  useEffect(() => {
    dispatch(getRecentPurchases());
  }, []);

  return (
    <main className='recent_purchases'>
      {recentPurchases.length >= 1 && (
        <div>
          <div className='recent_purchases__title'>Recent purchases</div>
          <div className='recent_purchases__wrapper'>
            {recentPurchasesLoad ? (
              <PropagateLoader color={'#3579FC'} />
            ) : recentPurchasesLoad === undefined ? (
              <NoData text={`Error getting recent purchases`} />
            ) : recentPurchases.length < 1 ? (
              <NoData text={`No recent purchases`} />
            ) : (
              recentPurchases.map(({created_date, currency, duration, end_date, id, price, usdt_invested}, idx) => (
                <div>
                  <div className='coin_info'>
                    <div className='coin'>
                      <img src={currency.icon} />
                    </div>
                    <div>
                      <div>
                        {currency.name} <span>{currency.code}</span>
                      </div>
                      <p>Request from {moment(created_date).format('DD.MM.YY')}</p>
                    </div>
                  </div>
                  <div className='info'>
                    <span>Purchase rate</span>
                    <div>{GlobixFixed(price)} USDT</div>
                  </div>
                  <div className='info'>
                    <span>Hold amount</span>
                    <div>{GlobixFixed(usdt_invested)} USDT</div>
                  </div>
                  <div className='info'>
                    <span>deposit term: {duration}</span>
                    <p>ends on {moment(end_date).format('DD.MM.YY')}</p>
                  </div>
                  <div className='status'>
                    {/* <div className={status === false ? "rejected" : status === true ? "approved" : "pending"}>
                      {status === false ? "rejected" : status === true ? "approved" : "pending"}
                    </div> */}
                    <div className={'pending'}>{'pending'}</div>
                  </div>
                  <div className='btn'>
                    <button
                      className='good-hover'
                      onClick={
                        //
                        () =>
                          toggleDialogDelete({
                            status: true,
                            info: {
                              currency: currency.code,
                              usdt_invested: usdt_invested,
                              price: price,
                              id: id
                            }
                          })
                      }
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                  <DialogMUI open={dialogDelete.status} onClose={closeDialogDelete}>
                    <div className='dialog dialog_sell'>
                      <div className='title'>Delete a sell application</div>
                      <div className='text'>
                        The application to sell{' '}
                        <b>{NP.strip(dialogDelete.info.usdt_invested / dialogDelete.info.price)}</b>{' '}
                        <b>{dialogDelete.info.currency}</b> =<b> {NP.strip(dialogDelete.info.usdt_invested)} USDT</b>{' '}
                        will be canceled.
                      </div>
                      <div className='btn-row-popup'>
                        <ButtonMUI variant='outlined' onClick={closeDialogDelete}>
                          BACK
                        </ButtonMUI>
                        <ButtonMUI onClick={() => deleteItem(dialogDelete.info.id, idx)}>Confirm</ButtonMUI>
                      </div>
                    </div>
                  </DialogMUI>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default RecentPurchases;
