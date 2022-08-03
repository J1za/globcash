import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import * as yup from 'yup';
import {Controller, useForm} from 'react-hook-form';
import DialogMUI from '../../../../shared/DialogMUI';
import {useToggle} from '../../../../helpers/hooks';
import SelectComponent from '../../../../shared/SelectComponent';
import {ReactComponent as AddIcon} from '../../../../assets/images/add.svg';
import {ReactComponent as WalletsIcon} from '../../../../assets/images/wallets_icon.svg';
import {ReactComponent as VectorIcon} from '../../../../assets/images/Vector.svg';
import {ReactComponent as PurseIcon} from '../../../../assets/images/purse.svg';
import {ReactComponent as CopyIcon} from '../../../../assets/images/copy.svg';
import {ReactComponent as DepositIcon} from '../../../../assets/images/Deposit.svg';
import {getWallets, setActiveWallet, checkWalletswithdraw} from './walletActions';
import {setTransactionsLoading} from '../Table/tableActions';
import {curToFixed, getCurIco, currencies} from '../../../../helpers/currencyNaming';
import Convert, {ConvertBalance} from '../../../../helpers/Convert';
import QRCode from 'react-qr-code';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import TooltipMUI from '../../../../shared/TooltipMUI';

import {GlobixFixed} from '../../../../helpers/functions';

import './Wallet.scss';
import {ReactComponent as BotIcon} from '../../../../assets/images/bot.svg';

const DropdownIndicator = (props) => {
  return (
    <DropdownIndicator {...props}>
      <VectorIcon />
    </DropdownIndicator>
  );
};

const UserIcon = ({first_name, last_name, t_photo_url}) => {
  return (
    <div className={`user-photo wrapper ${t_photo_url ? 'photo' : 'text'}`}>
      {t_photo_url ? (
        <img src={t_photo_url} />
      ) : (
        <p>
          {first_name && first_name[0] ? first_name[0] : ''}
          {last_name && last_name[0] ? last_name[0] : ''}
        </p>
      )}
    </div>
  );
};

const Wallet = () => {
  const dispatch = useDispatch();
  const {
    wallets: {wallets, activeWallet, walletsCount},
    header: {userInfo, prices}
  } = useSelector(({wallets, header}) => ({wallets, header}));
  const [dialog, toggleDialog] = useToggle();
  const [options, setOptions] = useState([]);
  const [selectedConvert, setConvert] = useState('');
  const [selectedWallet, selectWallet] = useState('');
  const [copyStatus, setCopyStatus] = useState(false);
  const [walletKeys, setWalletKeys] = useState([]);

  const schema = yup.object({
    // select: yup.object().required('Field is required')
  });
  const {control} = useForm();

  const openDialog = (cur) => {
    selectWallet(cur);
    toggleDialog();
  };

  useEffect(() => {
    dispatch(getWallets()).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 200) {
        dispatch(checkWalletswithdraw());
        let firstSelected = {};
        setOptions([
          ...Object.keys(res.payload.data).map((el, idx) => {
            let target = res.payload.data[el];
            if (target.short_name === 'USDT') firstSelected = {label: target.long_name, value: target.short_name};
            return {
              label: target.long_name,
              value: target.short_name
            };
          })
        ]);
        setConvert({...firstSelected});
      }
    });
  }, []);

  useEffect(() => {
    if (copyStatus) setTimeout(() => setCopyStatus(false), 1000);
  }, [copyStatus]);

  useEffect(() => {
    let tempArr = Object.keys(wallets);
    tempArr.splice(
      0,
      0,
      tempArr.splice(
        tempArr.findIndex((el) => el === 'usdterc'),
        1
      )[0]
    );
    setWalletKeys(tempArr);
  }, [wallets]);

  return (
    <section className=' wallets_block'>
      <div className='card-wrap mb-24'>
        <div className='user'>
          {UserIcon(userInfo)}
          <div className='user--info'>
            <div className='user--name'>
              {userInfo.first_name} {userInfo.last_name}
            </div>
            <div className='user--id_mail'>
              ID: {userInfo.telegram_id} • <p>@{userInfo.username}</p>
            </div>
          </div>
        </div>
        <div className='wallets '>
          <div className='wallets--money'>
            {prices.length > 0 && walletKeys.length > 0 ? (
              <>
                <div>
                  <PurseIcon />
                  <span className='mr-12'>
                    {selectedConvert.value && <ConvertBalance selectedConvert={selectedConvert.value} />}
                  </span>
                </div>
                <Controller
                  name='select'
                  control={control}
                  render={({field: {onBlur}}) => (
                    <SelectComponent
                      // menuIsOpen
                      value={selectedConvert}
                      onChange={(e) => setConvert(e)}
                      onBlur={onBlur}
                      options={options}
                      components={{DropdownIndicator}}
                    />
                  )}
                />
              </>
            ) : null}
          </div>
        </div>
      </div>
      <div className='coin card-wrap'>
        <div className='coin--info mt-10'>
          <WalletsIcon />
          {walletsCount} {walletsCount < 2 ? 'Wallet' : 'Wallets'}
        </div>
        <div className='items_wrapper'>
          {prices.length > 0 &&
            walletKeys.length > 0 &&
            walletKeys.map((el, idx) => {
              let {long_name, short_name, balance, address} = wallets[el];
              return (
                <div
                  key={idx}
                  className={`items${activeWallet === el ? ' active' : ''}`}
                  onClick={() => {
                    if (activeWallet === el) {
                      if (window.innerWidth <= 1500) {
                        openDialog(el);
                      }
                    } else {
                      dispatch(setTransactionsLoading(true));
                      dispatch(setActiveWallet(el));
                    }
                  }}
                >
                  <div className={`left-side`}>
                    {getCurIco(el)}
                    <div>
                      <span>{long_name}</span>
                      <p>{short_name}</p>
                    </div>
                  </div>
                  <div className='add'>
                    {window.innerWidth > 1500 && <AddIcon onClick={() => openDialog(el)} />}
                    <div>
                      <span>{GlobixFixed(balance, currencies[el].fixed)}</span>
                      {short_name !== 'USDT' && (
                        <p>
                          <Convert name={short_name} sum={balance} to={'USDT'} /> USDT
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <DialogMUI open={dialog} onClose={toggleDialog}>
        <div className='deposit_dialog'>
          {selectedWallet === 'glbx' ? (
            <div className='glbx'>
              <h2>Deposit of funds</h2>
              <div className='descriptions'>
                To replenish your GLBX wallet, go to the bot and exchange your funds from USDT to GLBX
              </div>
              <DepositIcon />
              <a target='_blank' href='https://t.me/GlobixCashBot' className='good-hover'>
                <BotIcon /> Open the bot
              </a>
            </div>
          ) : (
            <>
              <h2>Deposit of funds</h2>
              <div className='descriptions mb-8'>
                To replenish your account, please use this QR code or the address below.
              </div>
              <div className='descriptions mb-40'>
                Funds will be credited after {activeWallet === 'btc' ? '2' : '10'} confirmations!
              </div>
              <div className='cod mb-32'>
                <QRCode value={selectedWallet !== '' && wallets[selectedWallet].address} />
              </div>
              <div className='mb-24 mt-32 address'>
                {selectedWallet !== '' && getCurIco(selectedWallet)} Your{' '}
                {selectedWallet !== '' && wallets[selectedWallet].short_name} address
              </div>
              <div className='copy'>
                <span>{selectedWallet !== '' && wallets[selectedWallet].address}</span>
                <TooltipMUI open={copyStatus} title='Copied!'>
                  <CopyToClipboard
                    text={selectedWallet !== '' ? wallets[selectedWallet].address : ''}
                    onCopy={() => setCopyStatus(true)}
                  >
                    <button className='good-hover'>
                      <CopyIcon />
                    </button>
                  </CopyToClipboard>
                </TooltipMUI>
              </div>
            </>
          )}
        </div>
      </DialogMUI>
    </section>
  );
};

export default Wallet;
