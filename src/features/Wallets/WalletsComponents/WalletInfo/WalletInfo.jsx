import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {TabItem, Tabs} from '../../../../shared/Tabs';
import {ReactComponent as IncomeIcon} from '../../../../assets/images/Income.svg';
import {ReactComponent as ExpenseIcon} from '../../../../assets/images/Expense.svg';
import {ReactComponent as WithdrawIcon} from '../../../../assets/images/Withdraw.svg';
import {ReactComponent as BotIcon} from '../../../../assets/images/bot.svg';
import {Controller, useForm} from 'react-hook-form';
import InputMUI from '../../../../shared/InputMUI';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ButtonMUI from '../../../../shared/ButtonMUI';
import {ReactComponent as CopyIcon} from '../../../../assets/images/copy.svg';
import {currencies, getCurIco, curToFixed, activityActions} from '../../../../helpers/currencyNaming';
import Convert from '../../../../helpers/Convert';
import {getRecent} from '../../../Dashboard/DashboardComponents/Table/tableActions';
import {getUsersWallets} from './sendToWalletActions';
import QRCode from 'react-qr-code';
import CopyToClipboard from 'react-copy-to-clipboard';
import {TooltipMUI, SelectComponent} from '../../../../shared';
import './WalletInfo.scss';
import {PropagateLoader} from 'react-spinners';
import SendingConfirmationDialog from './SendingConfirmationDialog';
import moment from 'moment';
import {GlobixFixed, replaceComas} from '../../../../helpers/functions';
import WithdrawalTab from './WithdrawalTab';
import {getBinancePrice} from '../../../LongInvestment/LongInvestmentPage/LongIActions';
import {getWithdrawalUSDT, updateSalesContract} from '../../../Dashboard/DashboardComponents/Wallet/walletActions';
import {ReactComponent as ExchangeICO} from '../../../../assets/icons/exchange.svg';
import WithdrawalDialog from './WithdrawalDialog';
import {ReactComponent as Upload} from '../../../../assets/icons/upload.svg';
import {ReactComponent as File} from '../../../../assets/icons/file.svg';
import {ReactComponent as Remove} from '../../../../assets/icons/remove.svg';
import bankICON from '../../../../assets/icons/bank_icon.png';
import {Link} from 'react-router-dom';
import {putWithdrawalUSDT} from '../../../Dashboard/DashboardComponents/Wallet/walletActions';
import {notifyError} from '../../../../helpers/notifySnack';
import {saveAs} from 'file-saver';
import ContactForm from '../../../Staking/StakingPage/StakingComponents/Contact/ContactForm';
import {useToggle} from '../../../../helpers/hooks';

const WalletInfo = () => {
  const dispatch = useDispatch();
  const {
    wallets: {wallets, activeWallet, walletsCount, withdrawal_check, successWithdraw, fiat},
    header: {userInfo, prices, loading},
    recentTransactions: {transactions, transactionsLoad},
    sendToWallet: {userWallet, successSendToUser},
    longInvestment: {exchangePAIR}
  } = useSelector(({wallets, recentTransactions, header, sendToWallet, longInvestment}) => ({
    wallets,
    header,
    recentTransactions,
    longInvestment,
    sendToWallet
  }));
  const [walletActivity, setActivity] = useState({
    chart: [0, 0],
    incomeUSDT: 0,
    incomeUSD: 0,
    expenseUSDT: 0,
    expenseUSD: 0
  });

  const [amountField, setAmountField] = useState('');
  const [addressField, setAddressField] = useState('');
  const [buttonLoad, setLoad] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [dialogWithdrawal, setDialogWithdrawal] = useState(false);
  const [copyStatus, setCopyStatus] = useState(false);
  const [iban, setIBAN] = useState('');
  const [fullName, setFullName] = useState('');
  const [amountValue, setAmount] = useState(null);
  const [step, setStep] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);
  const [file, setFile] = useState(null);
  const [dialogContact, toggleDialogContact] = useToggle();

  useEffect(() => {
    if (copyStatus) setTimeout(() => setCopyStatus(false), 1000);
  }, [copyStatus]);

  const doActivity = (target) => {
    let income = target
        .filter((el) => !el.amount.includes('-'))
        .reduce((tempSum, el) => tempSum + Number(el.amount), 0),
      expense = target.filter((el) => el.amount.includes('-')).reduce((tempSum, el) => tempSum + Number(el.amount), 0),
      total = income + -expense,
      incomePer = (income * 100) / total,
      expensePer = (-expense * 100) / total - 1,
      incomeUSDT = <Convert name={wallets[activeWallet].short_name} sum={income} to={'USDT'} />,
      incomeUSD = <Convert name={wallets[activeWallet].short_name} sum={income} to={'USD'} />,
      expenseUSDT = <Convert name={wallets[activeWallet].short_name} sum={expense} to={'USDT'} />,
      expenseUSD = <Convert name={wallets[activeWallet].short_name} sum={expense} to={'USD'} />;
    setActivity({
      chart: [incomePer, expensePer < 0 ? 0 : expensePer],
      incomeUSDT: incomeUSDT,
      incomeUSD: incomeUSD,
      expenseUSDT: expenseUSDT,
      expenseUSD: expenseUSD
    });
  };

  useEffect(() => {
    if (activeWallet !== '') dispatch(getRecent(activeWallet));
    //if (activeWallet !== '') dispatch(getRecent(activeWallet, 'test=1'))
    /* .then(res => {
      if (res.payload && res.payload.status && res.payload.status === 200) {
        doActivity(res.payload.data[Object.keys(res.payload.data)[0]]);
      }
    }) */
  }, [activeWallet, successSendToUser, successWithdraw]);

  const schema = yup.object(
    tabIndex !== 4
      ? {
          address: yup
            .string()
            .min(9, 'Min 9 characters')
            .required('Field is required')
            .test(true, 'No such wallet address or id', () => {
              return userWallet.hasOwnProperty('id');
            })
            .test(true, 'Can`t send to yourself', () => {
              return userWallet.hasOwnProperty('id') && Number(userWallet.id) !== Number(userInfo.telegram_id);
            }),

          amount: yup
            .number()
            .typeError('you must specify an amount')
            .required('Field is required')
            .test(true, 'Out of balance', () => {
              return amountField <= Number(wallets[activeWallet].balance);
            })
        }
      : {
          amountUSDT: yup
            .number()
            .typeError('you must specify an amount')
            .required('Field is required')
            .test(true, `Out of balance`, () => {
              return amountValue <= Number(wallets[activeWallet].balance);
            }),
          full_name: yup
            .string()
            .required('Please enter the required field')
            .min(3, 'The Full name shoul contain more than 3 characters')
            .matches(/^[aA-zZ\s]+$/, 'Name can only contain Latin letters '),
          iban: yup
            .string()
            .required('Field is required')
            .min(15, 'The IBAN EURO should contain more than 15 characters')
            .max(40, 'The IBAN EURO should contain less than 40 characters')
        }
  );

  const {
    control,
    handleSubmit,
    setError,
    register,
    formState: {errors, isValid},
    setValue,
    getValues,
    reset
  } = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
    shouldFocusError: true,
    defaultValues: {
      address: '',
      amount: 1,
      amountUSDT: '',
      iban: '',
      full_name: ''
    }
  });

  useEffect(() => {
    dispatch(getWithdrawalUSDT());
    dispatch(getBinancePrice('EURUSDT'));
  }, []);

  useEffect(() => {
    if (!loading) {
      doActivity(transactions.trans);
    }
  }, [activeWallet, transactions, prices]);

  const filterTransactions = (list) => {
    return list;
  };

  const RenderList = (list) => {
    let slicedList = filterTransactions(list);
    return (
      <p>
        (
        {moment(
          Math.max.apply(
            Math,
            slicedList.map(function (item) {
              return item.time;
            })
          ) * 1000
        ).format('MMM DD')}
        -
        {moment(
          Math.min.apply(
            Math,
            slicedList.map(function (item) {
              return item.time;
            })
          ) * 1000
        ).format('MMM DD')}
        )
      </p>
    );
  };

  const handleFile = (e) => {
    e.persist();

    let file = e.target.files[0];
    const newUrl = URL.createObjectURL(file);
    const data = new FormData();

    setFile(file);

    data.append('sales_contract', file);

    dispatch(updateSalesContract(fiat && fiat.id && fiat.id, data)).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 200) {
        dispatch(getWithdrawalUSDT());
      } else {
        notifyError(res.error.response.data.error);
      }
    });
  };

  const removeFile = (e) => {
    const data = new FormData();
    data.append('sales_contract', '');

    dispatch(updateSalesContract(fiat && fiat.id && fiat.id, data)).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 200) {
        dispatch(getWithdrawalUSDT());
        setFile(null);
      } else {
        notifyError(res.error.response.data.error);
      }
    });
  };

  return (
    <section className={`wallet_info_block${loading || transactionsLoad ? ' loading' : ''}`}>
      {loading || transactionsLoad ? (
        <PropagateLoader color={'#3579FC'} />
      ) : (
        <>
          <div className='left'>
            <div className='info'>
              <div className='coin'>
                {!loading && getCurIco(activeWallet)}
                <div>
                  <span>{wallets[activeWallet].long_name}</span>
                  <p>{wallets[activeWallet].short_name}</p>
                </div>
              </div>
              <div className='price'>
                <div>{GlobixFixed(wallets[activeWallet].balance, currencies[activeWallet].fixed)}</div>
                {wallets[activeWallet].short_name !== 'USDT' && (
                  <span>
                    <Convert name={wallets[activeWallet].short_name} sum={wallets[activeWallet].balance} to={'USDT'} />{' '}
                    USDT
                  </span>
                )}
              </div>
            </div>
            <div className='activity'>
              <div className='descriptions mb-8'>
                <span className='mr-8'>Wallet activity</span>
                <p>{RenderList(transactions.trans)}</p>
              </div>
              <div className='line'>
                <div
                  style={{
                    width: `${walletActivity.chart[0]}%`,
                    borderRadius: `${walletActivity.chart[0] === 100 ? '4px' : '4px 0 0 4px'}`
                  }}
                />
                {!walletActivity.chart.some((el) => el === 100) && <span />}
                <p
                  style={{
                    width: `${walletActivity.chart[1]}%`,
                    borderRadius: `${walletActivity.chart[1] === 100 ? '4px' : '0 4px 4px 0'}`
                  }}
                />
              </div>
              <div className='block'>
                <div>
                  <span>Income</span>
                  <div>
                    <IncomeIcon />
                    <div>
                      <span>{walletActivity.incomeUSDT} USDT</span>
                      <p>{walletActivity.incomeUSD} $</p>
                    </div>
                  </div>
                </div>
                <hr />
                <div>
                  <span>Expense</span>
                  <div>
                    <ExpenseIcon />
                    <div>
                      <span>{walletActivity.expenseUSDT} USDT</span>
                      <p>{walletActivity.expenseUSD} $</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='right'>
            <div className='title_mob'>Actions</div>
            <Tabs defaultIndex='1'>
              <TabItem label='Deposit' index='1'>
                {activeWallet === 'glbx' ? (
                  <div className='block withdraw'>
                    <WithdrawIcon />
                    <div>
                      To replenish your GLBX wallet, go to the bot
                      <br />
                      and exchange your funds from USDT to GLBX
                    </div>
                    <a target='_blank' href='https://t.me/GlobixCashBot' className='good-hover'>
                      <BotIcon /> Open the bot
                    </a>
                  </div>
                ) : (
                  <div className='block deposit'>
                    <div className='info'>
                      <div>
                        <span className='mb-12'>
                          To replenish your account, please use this QR code or the address below.
                        </span>
                        <span>Funds will be credited after {activeWallet === 'btc' ? '2' : '10'} confirmations!</span>
                      </div>
                      <QRCode value={activeWallet !== '' && wallets[activeWallet].address} size={140} />
                    </div>
                    <div className='copy'>
                      <span>{activeWallet !== '' && wallets[activeWallet].address}</span>
                      <TooltipMUI open={copyStatus} title='Copied!'>
                        <CopyToClipboard
                          text={activeWallet !== '' ? wallets[activeWallet].address : ''}
                          onCopy={() => setCopyStatus(true)}
                        >
                          <button className='good-hover'>
                            <CopyIcon />
                          </button>
                        </CopyToClipboard>
                      </TooltipMUI>
                    </div>
                  </div>
                )}
              </TabItem>
              <TabItem label='Sent to user' index='2'>
                <form
                  onSubmit={handleSubmit(() => {
                    setLoad(true);
                    setDialog(!dialog);
                  })}
                  className='block sent_to_user'
                >
                  <div className='block'>
                    <span>Wallet address or id</span>
                    <div>
                      <Controller
                        name='address'
                        control={control}
                        render={({field}) => (
                          <>
                            <InputMUI
                              className='auth-box__input'
                              type='text'
                              fullWidth
                              error={errors.address?.message}
                              inputProps={field}
                              placeholder='Enter the address of the wallet or telegram id'
                              onChange={(e) => {
                                setAddressField(e.target.value);
                                dispatch(getUsersWallets(activeWallet, e.target.value));
                              }}
                            />
                          </>
                        )}
                      />
                    </div>
                  </div>
                  <div className='block'>
                    <span>Transfer amount</span>
                    <div>
                      <Controller
                        name='amount'
                        control={control}
                        render={({field}) => (
                          <InputMUI
                            className='auth-box__input'
                            type='text'
                            fullWidth
                            error={errors.amount?.message}
                            control={control}
                            inputProps={field}
                            placeholder='Amount'
                            isFixed
                            stateSetter={setAmountField}
                            setValue={setValue}
                          />
                        )}
                      />

                      <p
                        className='good-hover'
                        onClick={() => {
                          setValue('amount', curToFixed(activeWallet, wallets[activeWallet].balance));
                          setAmountField(curToFixed(activeWallet, wallets[activeWallet].balance));
                        }}
                      >
                        MAX
                      </p>
                    </div>
                  </div>
                  <ButtonMUI fullWidth disabled={!isValid || buttonLoad} loading={buttonLoad} formAction>
                    SEND
                    {!amountField ? <div> 0.0 </div> : <div>{amountField}</div>}
                    {wallets[activeWallet].short_name}
                  </ButtonMUI>
                </form>
                <SendingConfirmationDialog
                  dialog={dialog}
                  toggleDialog={() => {
                    setLoad(false);
                    setDialog(!dialog);
                  }}
                  amount={amountField}
                />
              </TabItem>
              <TabItem label='Withdraw' index='3'>
                <>
                  {Object.keys(withdrawal_check).includes(activeWallet) ? (
                    <WithdrawalTab />
                  ) : (
                    <div className='block withdraw'>
                      <WithdrawIcon />
                      <div>
                        {activeWallet === 'glbx' ? (
                          'Withdrawal will be available from May 20, 2022'
                        ) : (
                          <>
                            At the moment you can make a withdrawal <br /> from the wallet using our telegram bot
                          </>
                        )}
                      </div>
                      <a target='_blank' href='https://t.me/GlobixCashBot' className='good-hover'>
                        <BotIcon /> Open the bot
                      </a>
                    </div>
                  )}
                </>
              </TabItem>
              <TabItem
                label='Withdrawal to fiat'
                index='4'
                hidden={activeWallet === 'usdterc' && userInfo.can_withdrawal_to_fiat ? false : true}
              >
                {fiat && (
                  <div className='block sent_to_user'>
                    {fiat.status === 'pending' ? (
                      <p className='exchange-transaction-paragraph'>
                        We are already processing your application. Expect notification!
                      </p>
                    ) : (
                      fiat.status === 'processing' && (
                        <p className='exchange-transaction-paragraph'>Your funds are on the way!</p>
                      )
                    )}

                    <div className='transaction_value gray'>
                      <div className='transaction_value-col'>
                        <div className='transaction_value-row'>
                          <img src={bankICON} alt='color' />
                          <div className='transaction_value-txtBox'>
                            <span>{fiat.full_name}</span>
                            <span>{fiat.iban}</span>
                          </div>
                        </div>

                        <div className='transaction_value-pending black'>
                          <p className='transaction_value-pending-time'>
                            {moment(fiat.created_date).format('MMM DD HH:mm')}
                          </p>
                        </div>
                      </div>

                      <div className='transaction_value-box'>
                        <span>{Number(fiat.amount).toFixed(2)} USDT</span>
                        <span>{Number(+fiat.amount / +exchangePAIR.price).toFixed(2)} EUR</span>
                        <div
                          className={
                            'withdrawal-status ' +
                            (fiat.status === 'pending'
                              ? 'orange'
                              : fiat.status === 'processing'
                              ? 'purple'
                              : fiat.status === 'approved'
                              ? 'green'
                              : 'red')
                          }
                        >
                          {fiat && fiat.status && fiat.status}
                        </div>{' '}
                      </div>
                    </div>

                    {!file && fiat.sales_contract && !fiat.is_download_sales_contract && (
                      <div className='exchange-file__block'>
                        <div className='exchange-file__column'>
                          <p>
                            You need to sign a{' '}
                            <span className='exchange-file__link'>
                              <a download onClick={() => saveAs(fiat.sales_contract, 'Sales contract')}>
                                sales contract
                              </a>
                            </span>{' '}
                            and upload the signed document
                          </p>
                        </div>

                        <div className='exchange-file__column'>
                          <input
                            type='file'
                            onChange={(e) => {
                              handleFile(e);
                            }}
                            name='uploadfile'
                            id='img'
                            style={{display: 'none'}}
                          />
                          <label className='exchange-file__column' for='img'>
                            <Upload />
                            <p>Upload file</p>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {fiat &&
                  fiat.is_download_sales_contract &&
                  fiat.is_download_sales_contract &&
                  !fiat.payment_document &&
                  fiat.status !== 'approved' && (
                    <div className='exchange-file__wrapper'>
                      <div className='exchange-file__container'>
                        <div className='exchange-file__box'>
                          <File />

                          <div className='exchange-file__Txtbox'>
                            <p>Sales contract </p>
                            <span>Processed by the manager</span>
                          </div>
                        </div>
                        <button onClick={() => removeFile()}>
                          <Remove />
                        </button>
                      </div>
                    </div>
                  )}

                {!file && fiat && fiat.status && fiat.status === 'approved' && (
                  <div className='exchange-file__wrapper'>
                    <div className='exchange-file__container'>
                      <div className='exchange-file__box'>
                        <File />

                        <div className='exchange-file__Txtbox'>
                          <p>Payment document </p>
                          <span className='exchange-file__link'>
                            {' '}
                            <a onClick={() => saveAs(fiat.payment_document, 'Payment document')} download>
                              Download
                            </a>
                          </span>
                        </div>
                      </div>

                      {
                        <ButtonMUI
                          onClick={() =>
                            dispatch(putWithdrawalUSDT(fiat && fiat.id && fiat.id)).then((res) => {
                              if (
                                (res.payload && res.payload.status && res.payload.status === 200) ||
                                res.payload.status === 201
                              ) {
                                dispatch(getWithdrawalUSDT());
                                setStep(0);
                              } else {
                                Object.values(res.error.response.data)
                                  .flat()
                                  .forEach((el) => toast.error(el, {}));
                              }
                            })
                          }
                          className='exchange-file__btnOK'
                          fullWidth={false}
                        >
                          OK
                        </ButtonMUI>
                      }
                    </div>
                  </div>
                )}

                {!file && fiat && fiat.status && fiat.status === 'rejected' && (
                  <div className='exchange-file__wrapper'>
                    <div className='exchange-file__container orange'>
                      <div className='exchange-file__box'>
                        <div className='exchange-file__Txtbox'>
                          <p>
                            Your application has been rejected. For more info, you can contact{' '}
                            <span className='exchange-file__link'>
                              {' '}
                              <button onClick={toggleDialogContact}>support.</button>
                            </span>
                          </p>
                        </div>
                      </div>

                      <ButtonMUI
                        className='exchange-file__btnOK'
                        onClick={() =>
                          dispatch(putWithdrawalUSDT(fiat && fiat.id && fiat.id)).then((res) => {
                            if (
                              (res.payload && res.payload.status && res.payload.status === 200) ||
                              res.payload.status === 201
                            ) {
                              dispatch(getWithdrawalUSDT());
                              setStep(0);
                            } else {
                              Object.values(res.error.response.data)
                                .flat()
                                .forEach((el) => toast.error(el, {}));
                            }
                          })
                        }
                        fullWidth={false}
                      >
                        OK
                      </ButtonMUI>
                    </div>
                  </div>
                )}

                {step === 0 && !fiat && (
                  <div className='block sent_to_user'>
                    <div className='block'>
                      <span>IBAN EURO</span>
                      <div>
                        <Controller
                          name='iban'
                          control={control}
                          render={({field}) => (
                            <>
                              <InputMUI
                                className='auth-box__input'
                                type='text'
                                fullWidth
                                error={errors.iban?.message}
                                inputProps={field}
                                placeholder='Enter the IBAN'
                                onChange={(e) => {
                                  setIBAN(e.target.value);
                                  setTabIndex(4);
                                }}
                              />
                            </>
                          )}
                        />
                      </div>
                    </div>
                    {console.log(errors)}
                    <div className='block'>
                      <span>Full name</span>
                      <div>
                        <Controller
                          name='full_name'
                          control={control}
                          render={({field}) => (
                            <>
                              <InputMUI
                                className='auth-box__input'
                                type='text'
                                fullWidth
                                error={errors.full_name?.message}
                                inputProps={field}
                                placeholder='Enter the full name'
                                onChange={(e) => {
                                  setFullName(e.target.value);
                                }}
                              />
                            </>
                          )}
                        />
                      </div>
                    </div>

                    <ButtonMUI
                      fullWidth
                      disabled={
                        iban.length >= 41 ||
                        iban.length <= 14 ||
                        !fullName ||
                        (errors && errors.full_name) ||
                        buttonLoad
                      }
                      loading={buttonLoad}
                      onClick={() => setStep(1)}
                    >
                      NEXT
                    </ButtonMUI>
                  </div>
                )}
                {step !== 0 && (
                  <form
                    onSubmit={handleSubmit(() => {
                      setDialog(!dialogWithdrawal);
                      setStep(2);
                    })}
                  >
                    <div className='block sent_to_user'>
                      <p className='attention'>
                        The withdrawal amount in EUR may differ from that indicated depending on the exchange rate.
                      </p>
                      <div className='block'>
                        <span>Ammount (USDT)</span>
                        <div className='exchange-input'>
                          <Controller
                            name='amountUSDT'
                            control={control}
                            render={({field}) => (
                              <>
                                <InputMUI
                                  className='auth-box__input'
                                  type='number'
                                  fullWidth
                                  error={errors.amountUSDT?.message}
                                  inputProps={field}
                                  placeholder='Enter the amount'
                                  onChange={(e) => {
                                    setAmount(e.target.value);
                                  }}
                                />
                              </>
                            )}
                          />
                          <div className='exchange-block'>
                            <ExchangeICO />
                            <span>
                              {(+amountValue / +(exchangePAIR && exchangePAIR.price && exchangePAIR.price)).toFixed(2)}{' '}
                              EUR
                            </span>
                          </div>
                        </div>
                      </div>

                      <ButtonMUI fullWidth disabled={!isValid || buttonLoad} loading={buttonLoad} formAction>
                        Withdraw {Number(amountValue).toFixed(2)} USDT
                      </ButtonMUI>
                    </div>
                  </form>
                )}

                <WithdrawalDialog
                  dialog={dialog}
                  step={step}
                  reset={reset}
                  setStep={setStep}
                  usdt={amountValue}
                  full_name={fullName || (fiat && fiat.full_name && fiat.full_name)}
                  iban={iban || (fiat && fiat.iban && fiat.iban)}
                  euro={+amountValue / +(exchangePAIR && exchangePAIR.price && exchangePAIR.price)}
                  toggleDialog={() => {
                    setLoad(false);
                    setDialog(!dialog);
                    setStep(0);
                  }}
                />
              </TabItem>
            </Tabs>
          </div>
        </>
      )}
      <ContactForm dialog={dialogContact} toggleDialog={toggleDialogContact} />
    </section>
  );
};

export default WalletInfo;
