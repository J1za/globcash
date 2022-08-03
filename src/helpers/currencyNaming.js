import {ReactComponent as BTC} from '../assets/images/btc_icon.svg';
import {ReactComponent as ETH} from '../assets/images/eth_icon.svg';
import {ReactComponent as USDT} from '../assets/images/usdt_icon.svg';
import {ReactComponent as BIP} from '../assets/images/bip_icon.svg';
import {ReactComponent as GLBX} from '../assets/images/glbx-coin.svg';
import {GlobixFixed} from './functions';

export const currencies = {
  btc: {
    fullName: 'Bitcoin',
    shortName: 'BTC',
    tousdt: '',
    img: <BTC />,
    fixed: 8
  },
  eth: {
    fullName: 'Ethereum',
    shortName: 'ETH',
    tousdt: '',
    img: <ETH />,
    fixed: 8
  },
  usdterc: {
    fullName: 'Tether(ERC-20)',
    shortName: 'USDT',
    tousdt: '',
    img: <USDT />,
    fixed: 2
  },
  minter: {
    fullName: 'Minter',
    shortName: 'BIP',
    tousdt: '',
    img: <BIP />,
    fixed: 2
  },
  glbx: {
    fullName: 'Globix Coin',
    shortName: 'GLBX',
    tousdt: '',
    img: <GLBX />,
    fixed: 2
  }
};

export const activityActions = {
  cancel_order: 'Cancel order',
  order_out_fiat: 'Withdrawal to fiat',
  order_out: 'Withdrawal request',
  in_btc: 'Deposit',
  u2u: 'User-to-user transfer',
  pump_fee: 'Accrual of interest on Trend Follower deposit',
  pum2_fee: 'Accrual of interest on Trend Follower VIP deposit',
  swap_fee: 'Accrual of interest on a Liquitidy Pool Arbitrage deposit',
  defi_fee: 'Accrual of interest on a Defi deposit',
  defi2_fee: 'Accrual of interest on a Defi 2.1 deposit',
  defi3_fee: 'Accrual of interest on a Defi 2.2 deposit',
  trade_fee: 'Accrual of interest on a Altcoin Arbitrage deposit',
  inv_fee: 'Accrual of interest on a BTC/ETH Arbitrage deposit',
  btc_fee: 'Accrual of interest on a BTC Staking deposit',
  eth_fee: 'Accrual of interest on a ETH Staking deposit',
  ref_defi_dep: 'Referral program accrual on a Defi deposit',
  ref_defi2_dep: 'Referral program accrual on a Defi 2.1 deposit',
  ref_defi3_dep: 'Referral program accrual on a Defi 2.2 deposit',
  ref_swap_dep: 'Referral program accrual on a Liquitidy Pool Arbitrage deposit',
  ref_pump_dep: 'Referral program accrual on a Trend Follower deposit',
  ref_pum2_dep: 'Referral program accrual on a Trend Follower VIP deposit',
  ref_inv_dep: 'Referral program accrual on a BTC/ETH Arbitrage deposit',
  ref_trade_dep: 'Referral program accrual on a Altcoin Arbitrage deposit',
  in_usdt: 'Deposit',
  exchange: 'Exchange',
  in_eth: 'Deposit',
  add_referal_swap: 'Referral program accrual on a Liquitidy Pool Arbitrage deposit',
  add_referal_pump: 'Referral program accrual on a Trend Follower deposit',
  add_referal_pum2: 'Referral program accrual on a Trend Follower VIP deposit',
  add_referal_defi: 'Referral program accrual on a Defi deposit',
  add_referal_defi2: 'Referral program accrual on a Defi 2.1 deposit',
  add_referal_defi3: 'Referral program accrual on a Defi 2.2 deposit',
  long_replenish: 'Transfer to the long deposit',
  long_withdraw: 'Withdrawal from the long deposit'
};

export const curToFixed = (cur, num, isFormat) =>
  (num.toString().includes('+') ? '+' : '') +
  (isFormat ? GlobixFixed(num, currencies[cur].fixed) : Number(num).toFixed(currencies[cur].fixed));

export const getCurIco = (cur) => currencies[cur] && currencies[cur].img && currencies[cur].img;
