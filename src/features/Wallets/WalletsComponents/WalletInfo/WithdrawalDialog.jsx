import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DialogMUI from '../../../../shared/DialogMUI';
import { ButtonMUI } from '../../../../shared';

import { toast } from 'react-toastify';
import bankIco from '../../../../assets/icons/bank-ico.svg';
import { ReactComponent as CurrencyICO } from '../../../../assets/icons/currency-ico.svg';
import { ReactComponent as Pending } from '../../../../assets/icons/pending.svg';
import { getWithdrawalUSDT } from '../../../Dashboard/DashboardComponents/Wallet/walletActions';
import { withdrawalUSDT } from '../../../Dashboard/DashboardComponents/Wallet/walletActions';
import { ReactComponent as WithdrawSucces } from '../../../../assets/images/WithdrawSucces.svg';
import { GlobixFixed } from '../../../../helpers/functions';
import { Link } from 'react-router-dom';
import { ReactComponent as File } from '../../../../assets/icons/file.svg';
import { saveAs } from 'file-saver';

const WithdrawalDialog = ({ step, setStep, dialog, toggleDialog, usdt, docs, euro, full_name, status, iban, reset }) => {
  const dispatch = useDispatch();
  const requestBody = {
    full_name: full_name,
    iban: iban,
    amount: usdt
  };
  const [ID, setID] = useState(10001);
  return (
    <DialogMUI open={dialog} onClose={toggleDialog}>
      <div className='deposit_dialog'>
        <h2>
          {step === 2 ? 'Withdrawal of funds' : step === 3 ? 'Funds withdrawn successfully' : 'Withdrawal detail'}
        </h2>

        {step === 2 ? (
          <>
            <div className='exchange-transaction'>
              <div className='exchange-transaction-row'>
                <div className='exchange-transaction-txtbox'>
                  <CurrencyICO />
                  <span className='exchange-transaction--abbr'>Tether (ERC-20)</span>
                  <span className='exchange-transaction--currency'>USDT</span>
                  <span>●</span>
                  <span className='exchange-transaction--type'>Withdrawal to fiat</span>
                </div>
              </div>
              <div className='exchange-transaction-row'>
                <img src={bankIco} alt='ico' />
                <div className='exchange-transaction-box'>
                  <span>{full_name}</span>
                  <span className='left'>{iban}</span>
                </div>
              </div>
            </div>
            <p className='attention'>Withdrawal request will be processed within 4 to 5 business days</p>
            <div className='transaction_value'>
              <p className='transaction_value-txt'>Value</p>
              <div className='transaction_value-box'>
                <span>{Number(usdt).toFixed(2)} USDT</span>
                <span>{Number(euro).toFixed(2)} EUR</span>
              </div>
            </div>
            <div className={`button-group mt-40`}>
              <ButtonMUI
                variant='outlined'
                onClick={() => {
                  toggleDialog();
                  setStep(0);
                  reset()
                }}
              >
                Cancel
              </ButtonMUI>
              <ButtonMUI
                onClick={() => {
                  dispatch(withdrawalUSDT(requestBody)).then((res) => {
                    if (res.payload && res.payload.status && res.payload.status === 201) {
                      setStep(3);
                      setID(res.payload.data.id);
                      dispatch(getWithdrawalUSDT());
                    } else {
                      Object.values(res.error.response.data)
                        .flat()
                        .forEach((el) => toast.error(el, {}));
                    }
                  });
                }}
              >
                confirm
              </ButtonMUI>
            </div>
          </>
        ) : (
          step === 3 && (
            <>
              <p className='transaction_value-p'>
                We are already processing your application, on average, the transfer of funds takes 4-5 business days.
              </p>

              <p className='transaction_value-p'>Funds will be frozen until the application is considered.</p>

              <div className='color'>{GlobixFixed(usdt)} USDT</div>

              <WithdrawSucces className='transaction_image' />
            </>
          )
        )}
        {step === 4 && (
          <>
            {' '}
            <div className='exchange-transaction'>
              <div className='exchange-transaction-row'>
                <div className='exchange-transaction-txtbox'>
                  <CurrencyICO />
                  <span className='exchange-transaction--abbr'>Tether (ERC-20)</span>
                  <span className='exchange-transaction--currency'>USDT</span>
                  <span>●</span>
                  <span className='exchange-transaction--type'>Withdrawal to fiat</span>
                </div>
              </div>
              <div className='exchange-transaction-row'>
                <img src={bankIco} alt='ico' />
                <div className='exchange-transaction-box'>
                  <span>{full_name}</span>
                  <span>{iban}</span>
                </div>
              </div>
            </div>
            <div className='exchange-transaction rounded'>
              {Array.isArray(docs) ? <>
                {!!docs[0] &&
                  <div className='exchange-transaction__download'>
                    <div className='exchange-transaction__boxImg'>
                      <File />
                      <p>Purchase Agreement</p>
                    </div>
                    <span className='exchange-file__link padding'>
                      {' '}
                      <a download onClick={() => saveAs(docs[0], 'Purchase Agreement')}>
                        Download
                      </a>
                    </span>
                  </div>}
                {!!docs[1] && <div className='exchange-transaction__download'>
                  <div className='exchange-transaction__boxImg'>
                    <File />
                    <p>Payment document</p>
                  </div>
                  <span className='exchange-file__link padding'>
                    {' '}
                    <a download onClick={() => saveAs(docs[1], 'Payment document')}>
                      Download
                    </a>
                  </span>
                </div>}
              </> : null}
            </div>
            <div className='exchange-transaction'>
              <div className='transaction_value'>
                <p className='transaction_value-txt'>Status</p>
                <div
                  className={
                    status === 'approved'
                      ? 'withdrawal-status green'
                      : status === 'rejected'
                        ? 'withdrawal-status red'
                        : status === 'processing'
                          ? 'withdrawal-status purple'
                          : 'withdrawal-status orange'
                  }
                >
                  {status}
                </div>
              </div>
              <div className='transaction_value'>
                <p className='transaction_value-txt'>Net ammount</p>
                <div className='transaction_value-box'>
                  <span>{Number(usdt).toFixed(2)} USDT</span>
                  <span>{Number(euro).toFixed(2)} EUR</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DialogMUI>
  );
};

export default WithdrawalDialog;
