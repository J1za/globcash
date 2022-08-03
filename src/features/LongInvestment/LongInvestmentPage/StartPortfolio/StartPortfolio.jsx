import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NP from 'number-precision';
import ButtonMUI from '../../../../shared/ButtonMUI';
import DialogMUI from '../../../../shared/DialogMUI';
import InputMUI from '../../../../shared/InputMUI';
import { PropagateLoader } from 'react-spinners';

import st_bg_mob from '../../../../assets/images/st_bg_mob.png';
import st_bg from '../../../../assets/images/st_bg.png';
import { ReactComponent as CopyIcon } from '../../../../assets/images/copy.svg';

import { ReactComponent as ArrowRedIcon } from '../../../../assets/images/arrow_down_red.svg';
import { ReactComponent as ArrowGreenIcon } from '../../../../assets/images/arrow_top_green.svg';
import { ReactComponent as InvestedIcon } from '../../../../assets/images/invested.svg';
import { ReactComponent as RefreshIcon } from '../../../../assets/images/refresh.svg';
import { ReactComponent as NoInvestingIcon } from '../../../../assets/images/no_investing.svg';
import { ReactComponent as DepositBtn } from '../../../../assets/images/deposit_btn.svg';
import { ReactComponent as WithdrawBtn } from '../../../../assets/images/withdraw_btn.svg';
import { ReactComponent as DepositSucsses } from '../../../../assets/images/DepositSucsses.svg';
import { ReactComponent as WithdrawSucces } from '../../../../assets/images/WithdrawSucces.svg';

import './StartPortfolio.scss';

import { css } from '@emotion/react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useWindowDimensions from '../../../../helpers/useWindowDimensions';
import * as yup from 'yup';

import { getStatistic, doCustomStatisticLoad, depositLongWallet, getCoinCommission, getDepositWallet, checkWithdrawalInfo } from '../LongIActions';
import { getWallets } from '../../../Dashboard/DashboardComponents/Wallet/walletActions';

import NoData from '../no_data';

import WithdrawForm from './WithdrawForm';
import TooltipMUI from '../../../../shared/TooltipMUI';
import { GlobixFixed } from '../../../../helpers/functions';
import QRCode from 'react-qr-code';
import CopyToClipboard from 'react-copy-to-clipboard';
import { getCurIco } from '../../../../helpers/currencyNaming';

const StartPortfolio = () => {
  const dispatch = useDispatch();
  const {
    header: { loading },
    longInvestment: {
      coinCommission,
      statistic,
      depositWalletInfo,
      statisticLoad,
      statistic: {
        balance_usd,
        balance_usdt,
        invested_balance_usd,
        invested_balance_usdt,
        online_pnl_percent,
        online_pnl_usd,
        online_pnl_usdt,
        online_pnl_date,
        total_pnl_percent,
        total_pnl_usd,
        total_pnl_usdt,
        week_pnl_percent,
        week_pnl_usd,
        week_pnl_usdt,
        week_pnl_date
      }
    }
  } = useSelector(({ header, longInvestment }) => ({ header, longInvestment }));

  const {
    wallets: { wallets }
  } = useSelector(({ wallets }) => ({ wallets }));

  const [openDeposit, setOpenDeposit] = useState(false);
  const [copyStatus, setCopyStatus] = useState(false);
  useEffect(() => {
    if (copyStatus) setTimeout(() => setCopyStatus(false), 1000);
  }, [copyStatus]);

  const [openWithdraw, setOpenWithdraw] = useState(false);

  const [amountField, setAmountField] = useState(null);

  const { width } = useWindowDimensions();

  const schema = yup.object({
    amount: yup
      .number()
      .typeError('you must specify a number')

      .required('Field is required')
      .test(true, 'Out of balance', () => {
        return amountField <= wallets.usdterc.balance;
      })
      .min(+coinCommission.b_refill_min_limit)
      .max(+coinCommission.b_refill_max_limit)
    // .test(true, 'Out of limit', () => {
    //   return amount <= +coinCommission.b_refill_max_limit;
    // })
    // .test(true, 'Out of limit', () => {
    //   return amount >= +coinCommission.b_refill_min_limit;
    // })
  });

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
    reset,
    trigger,
    setValue
  } = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
    shouldFocusError: true,
    defaultValues: {
      amount: ''
    }
  });

  const sellAmount = () => {
    dispatch(
      depositLongWallet({
        type: 'refill',
        amount: +amountField
        // 'external-token': localStorage.getItem('external_token')
      })
    ).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 201) {
        reset();
        closeDialog();
        dispatch(getStatistic());
        dispatch(getWallets());
      } else {
        Object.values(res.error.response.data)
          .flat()
          .forEach((el) => toast.error(el, {}));
      }
    });
  };

  const isInvested = true;
  const doRequest = () => {
    dispatch(doCustomStatisticLoad(true));
    dispatch(getStatistic());
    dispatch(getWallets());
    dispatch(getDepositWallet());
    dispatch(checkWithdrawalInfo());
    //dispatch(getCoinCommission());
  };

  const closeDialog = () => {
    setAmountField(null);
    reset();
  };

  const closeDialogWithdraw = () => {
    setOpenWithdraw(false);
  };

  const extToken = localStorage.getItem('external_token');

  useEffect(() => {
    doRequest();
  }, []);

  const renderVideo = () => {
    let wideScreenPercent = (9 * 100 / 16),
      desktopWidth = 800,
      desktopHeight = wideScreenPercent * desktopWidth / 100,
      mobileWidth = wideScreenPercent * (window.innerWidth - 50) / 100;
    return <div className="long-investment-video" >
      <iframe
        width={window.innerWidth < 1024 ? window.innerWidth - 50 : 800}
        height={window.innerWidth < 1024 ? mobileWidth : desktopHeight}
        src="https://www.youtube.com/embed/XSiEJmRy1HY"
        title="Presentation Globix"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div >
  }

  return (
    <main className='start_portfolio'>
      <div className='head'>
        <div className='start_portfolio__title'>
          Start building your <br /> cryptocurrency portfolio
        </div>
        <div className='start_portfolio__descriptions'>
          Diversify your finances, buy coins and follow the forecasts of our experts <br /> in order to maximize profit
          from market changes
        </div>
        <img className='st_bg_mob' src={st_bg_mob} alt='' />
        {renderVideo()}
      </div>
      {renderVideo()}
      {isInvested ? (
        <div className='start_portfolio__wrapper'>
          {statisticLoad ? (
            <PropagateLoader color={'#3579FC'} />
          ) : statisticLoad === undefined ? (
            <NoData text={`Error getting statistics`} />
          ) : (
            <>
              {width > 1360 ? (
                <div>
                  <span>
                    Balance{' '}
                    <TooltipMUI
                      title={
                        'Deposit allows you to transfer funds from your USDT wallet to an internal investment balance'
                      }
                      position='top'
                    >
                      <p className='deposit__btn' onClick={() => setOpenDeposit(true)}>
                        <DepositBtn />
                        Deposit
                      </p>
                    </TooltipMUI>
                    <TooltipMUI
                      title={
                        'Withdrawal allows you to transfer funds from internal investment balance to your USDT wallet'
                      }
                      position='top'
                    >
                      <p className='deposit__btn' onClick={() => setOpenWithdraw(true)}>
                        <WithdrawBtn />
                        Withdrawal
                      </p>
                    </TooltipMUI>
                  </span>

                  <p>{GlobixFixed(balance_usdt)} USDT</p>
                  <div>{GlobixFixed(balance_usd)} $</div>
                </div>
              ) : (
                <div className='balance__wrapper'>
                  <div className='balance'>
                    <span>Balance </span>

                    <p>{GlobixFixed(balance_usdt)} USDT</p>
                    <div>{GlobixFixed(balance_usd)} $</div>
                  </div>

                  <div className='btn_wrapper'>
                    <div onClick={() => setOpenDeposit(true)}>
                      <p className='deposit__btn blue'>
                        <DepositBtn />
                      </p>
                      <span>Deposit</span>
                    </div>
                    <div onClick={() => setOpenWithdraw(true)}>
                      <p className='deposit__btn red'>
                        <WithdrawBtn />
                      </p>

                      <span>Withdraw</span>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <span>
                  <p className='invested'>
                    <InvestedIcon />
                  </p>
                  Invested balance
                </span>
                <p>{GlobixFixed(invested_balance_usdt)} USDT</p>
                <div>{GlobixFixed(invested_balance_usd)} $</div>
              </div>

              <div>
                <span>
                  PNL Online
                  <p className='refresh' onClick={doRequest}>
                    <RefreshIcon />
                  </p>
                  <p className='time'>{online_pnl_date}</p>
                </span>
                <p>{GlobixFixed(online_pnl_usdt)} USDT</p>
                <div>
                  {GlobixFixed(online_pnl_usd)} $
                  <span className={`${+online_pnl_percent > 0 ? 'green' : 'red'}`}>
                    <p>
                      {+online_pnl_percent > 0 ? <ArrowGreenIcon /> : <ArrowRedIcon />}
                      <p>{online_pnl_percent && Number(online_pnl_percent).toFixed(2)}%</p>
                    </p>
                  </span>
                </div>
              </div>

              <div>
                <span>
                  PNL per week
                  <p className='refresh' onClick={doRequest}>
                    <RefreshIcon />
                  </p>
                  <p className='time'>{week_pnl_date}</p>
                </span>
                <p>{GlobixFixed(week_pnl_usdt)} USDT</p>
                <div>
                  {GlobixFixed(week_pnl_usd)} $
                  <span className={`${+week_pnl_percent > 0 ? 'green' : 'red'}`}>
                    <p>
                      {+week_pnl_percent >= 0 ? <ArrowGreenIcon /> : <ArrowRedIcon />}
                      <p>{Number(week_pnl_percent).toFixed(2)}%</p>
                    </p>
                  </span>
                </div>
              </div>

              <div>
                <span>PNL for all the time</span>
                <p>{GlobixFixed(total_pnl_usdt)} USDT</p>
                <div>
                  {GlobixFixed(total_pnl_usd)} $
                  <span className={`${+total_pnl_percent > 0 ? 'green' : 'red'}`}>
                    <p>
                      {+total_pnl_percent > 0 ? <ArrowGreenIcon /> : <ArrowRedIcon />}
                      <p>{Number(total_pnl_percent).toFixed(2)}%</p>
                    </p>
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className='start_portfolio__wrapper no_items'>
          <div>
            <span>Balance</span>
            <p>45250.45 USDT</p>
            <div>5347.43 $</div>
          </div>
          <div>
            <div>
              <NoInvestingIcon />
            </div>
            <div className='text'>
              <span>Make your first investment with us</span>
              <p>Follow the experts and buy promising coins</p>
            </div>
            <ButtonMUI>Start investing</ButtonMUI>
          </div>
        </div>
      )}
      <img className='st_bg' src={st_bg} alt='' />
      {/* <DialogMUI open={openDeposit} onClose={closeDialog}>
        <div className='dialog dialog_deposit'>
          <div className='title'>Replenish the balance</div>
          <div className='descriptions'>From wallet:</div>
          <div className='market'>
            <div className='left'>
              <img src={CoinIcon} alt='icon' />
              <div>
                <span>Tether(ERC-20)</span>
                <p>USDT</p>
              </div>
            </div>
            <div className='right'>
              <span>Balance</span>
              <p>
                {wallets && wallets.usdterc && wallets.usdterc.balance && GlobixFixed(wallets.usdterc.balance)} USDT
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit(sellAmount)} className='block '>
            <div className='amount'>
              {width > 768 ? (
                <p>
                  How much you want to transfer to the internal <br />
                  investment balance?
                </p>
              ) : (
                <p>How much you want to transfer to the internal investment balance?</p>
              )}
              <div className='input_wrapper'>
                <div className='input_label'>
                  <span>Amount</span>
                  <span>
                    Min: {coinCommission.b_refill_min_limit} USDT Max: {coinCommission.b_refill_max_limit} USDT
                  </span>
                </div>

                <Controller
                  name='amount'
                  control={control}
                  render={({ field }) => (
                    <InputMUI
                      className='auth-box__input'
                      type='text'
                      fullWidth
                      error={errors.amount?.message}
                      inputProps={field}
                      value={amountField}

                      isFixed
                      stateSetter={setAmountField}
                      setValue={setValue}
                    />
                  )}
                />

                <p
                  className='good-hover max'
                  onClick={() => {
                    setValue(
                      'amount',
                      Number((coinCommission.b_refill_max_limit <= wallets.usdterc.balance
                        ? coinCommission.b_refill_max_limit
                        : wallets.usdterc.balance).toFixed(8))
                    );
                    setAmountField(
                      Number((coinCommission.b_refill_max_limit <= wallets.usdterc.balance
                        ? coinCommission.b_refill_max_limit
                        : wallets.usdterc.balance).toFixed(8))
                    );
                    trigger('amount');
                  }}
                >
                  MAX
                </p>
              </div>
              {amountField !== null && (
                <span>Fee: {GlobixFixed((amountField * coinCommission.b_refill_commission_percent) / 100)} USD</span>
              )}
            </div>
            <ButtonMUI fullWidth disabled={!isValid} formAction>
              TRANSFER
            </ButtonMUI>
          </form>
        </div>
      </DialogMUI> */}
      <WithdrawForm
        openWithdraw={openWithdraw}
        closeWithdraw={closeDialogWithdraw}
      />
      <DialogMUI open={openDeposit} onClose={() => setOpenDeposit(false)}>
        <div className='deposit_dialog'>

          <h2>Deposit of funds</h2>
          <div className='descriptions mb-8'>
            To replenish your long investment balance, please use this QR code or the address below.
          </div>
          <div className='descriptions mb-40'>
            Funds will be credited after 10 confirmations!
          </div>
          <div className='cod mb-32'>
            <QRCode value={depositWalletInfo.address} />
          </div>
          <div className='mb-24 mt-32 address'>
            {getCurIco('usdterc')} Your{' '}
            {depositWalletInfo.short_name} address
          </div>
          <div className='copy'>
            <span>{depositWalletInfo.address}</span>
            <TooltipMUI open={copyStatus} title='Copied!'>
              <CopyToClipboard
                text={depositWalletInfo.address}
                onCopy={() => setCopyStatus(true)}
              >
                <button className='good-hover'>
                  <CopyIcon />
                </button>
              </CopyToClipboard>
            </TooltipMUI>
          </div>
        </div>
      </DialogMUI>
      {/* <DialogMUI open={openWithdraw} onClose={closeDialogWithdraw}>
        <div className='dialog dialog_deposit'>
          <div className='title'>Withdraw to storage</div>
          <div className='descriptions'>internal investment balance</div>
          <div className='market'>
            <div className='left'>
              <img src={CoinIcon} alt='icon' />
              <div>
                <span>Tether(ERC - 20)</span>
                <p>USDT</p>
              </div>
            </div>
            <div className='right'>
              <span>Balance</span>
              <p>{balance_usdt} USDT</p>
            </div>
          </div>
          <div className='color_block'>Funds will be transfered to your Tether(ERC-20) Globix wallet.</div>
          <form onSubmit={handleSubmit(withdrawAmount)} className='block '>
            <div className='amount'>
              <p>How much do you want to withdraw?</p>

              <div className='input_wrapper'>
                <div className='input_label'>
                  <span>Amount</span>
                  <span>
                    Min: {coinCommission.transaction_min_limit} USDT Max: {coinCommission.transaction_max_limit} USDT
                  </span>
                </div>

                <Controller
                  name='amountWithdraw'
                  control={control}
                  render={({field}) => (
                    <InputMUI
                      className='auth-box__input'
                      type='text'
                      fullWidth
                      error={errors.amountWithdraw?.message}
                      inputProps={field}
                      value={withdrawField}

                      isFixed
                          stateSetter={setWithdrawField}
                          setValue={setValue}
                      //onChange={(e) => setWithdrawField(e.target.value)}
                    />
                  )}
                />

                <p
                  className='good-hover max'
                  onClick={() => {
                    // setValue('amount', dialogSell.info.amount / dialogSell.info.price);
                    // setAmountField(dialogSell.info.amount / dialogSell.info.price);
                  }}
                >
                  MAX
                </p>
              </div>
            </div>
            <ButtonMUI fullWidth disabled={false} loading={buttonLoad} formAction>
              TRANSFER
            </ButtonMUI>
          </form>
        </div>
      </DialogMUI> */}
    </main>
  );
};

export default StartPortfolio;
