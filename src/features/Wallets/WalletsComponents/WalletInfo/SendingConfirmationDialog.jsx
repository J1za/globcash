import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DialogMUI from '../../../../shared/DialogMUI';
import { ButtonMUI } from '../../../../shared';
import { ReactComponent as BillIcon } from '../../../../assets/images/bill.svg';
import { sendToWallet } from './sendToWalletActions';
import { getWallets, doWithdraw } from '../../../Dashboard/DashboardComponents/Wallet/walletActions';
import { WalletRow } from './WithdrawalTab';
import { notifyError } from '../../../../helpers/notifySnack';

import { curToFixed } from '../../../../helpers/currencyNaming';

const SendingConfirmationDialog = ({ dialog, toggleDialog, amount, isWithdraw, withdrawData }) => {
  const dispatch = useDispatch();
  const {
    wallets: { wallets, activeWallet, withdrawal_check },
    sendToWallet: { userWallet }
  } = useSelector(({ wallets, sendToWallet }) => ({
    wallets,
    sendToWallet
  }));
  const [isSuccess, setSuccess] = useState(false);

  const sendAmount = () => {
    dispatch(
      isWithdraw ? doWithdraw(activeWallet, withdrawData) : sendToWallet(activeWallet, userWallet.id, { amount: amount })
    ).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 200) {
        setSuccess(res.payload && res.payload.status && res.payload.status === 200);
        dispatch(getWallets());
      } else {
        notifyError(res.error.response.data.error);
      }
    });
  };

  useEffect(() => {
    setSuccess(false);
  }, [dialog])

  return (
    <DialogMUI open={dialog} onClose={toggleDialog}>
      <div className='deposit_dialog'>
        <h2>
          {isSuccess
            ? isWithdraw
              ? 'Funds withdrawn successfully'
              : 'Money was sent successfully'
            : isWithdraw
              ? 'Withdrawal of funds'
              : 'Send to user'}
        </h2>
        <div className={`descriptions no_opacity mb-${isWithdraw ? '20' : '40'}`}>
          {isSuccess ? (
            isWithdraw ? (
              <>
                After the manager's approval and confirming three blocks in the blockchain network the funds will be
                delivered to the recipient's wallet.
              </>
            ) : (
              <>
                After confirming three blocks in the blockchain network, <span>@{userWallet.username}</span> will
                receive{' '}
                <span>
                  {curToFixed(activeWallet, amount, true)} {wallets[activeWallet].short_name}
                </span>{' '}
                from you.
              </>
            )
          ) : isWithdraw ? (
            <>
              Please confirm sending{' '}
              <span>
                {curToFixed(activeWallet, withdrawData.amount - withdrawal_check[activeWallet].commission, true)} {wallets[activeWallet].short_name}
              </span>{' '}
              to the address:
            </>
          ) : (
            <>
              Please confirm sending{' '}
              <span>
                {curToFixed(activeWallet, amount, true)} {wallets[activeWallet].short_name}
              </span>{' '}
              to user <span>@{userWallet.username}</span>.
            </>
          )}
        </div>
        {isSuccess ? (
          <div className='bill'>
            <div className='bill-amount'>
              <p>
                {curToFixed(activeWallet, isWithdraw ? withdrawData.amount - withdrawal_check[activeWallet].commission : amount, true)} {wallets[activeWallet].short_name}
              </p>
              <span className='triangle' />
            </div>
            <BillIcon />
          </div>
        ) : (
          <>
            {isWithdraw && <WalletRow address={withdrawData.wallet} />}
            <div className={`button-group${isWithdraw ? ' mt-40' : ''}`}>
              <ButtonMUI variant='outlined' onClick={toggleDialog}>
                BACK
              </ButtonMUI>
              <ButtonMUI onClick={sendAmount}>confirm</ButtonMUI>
            </div>
          </>
        )}
      </div>
    </DialogMUI>
  );
};

export default SendingConfirmationDialog;
