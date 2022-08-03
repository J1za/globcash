import React from 'react';
import BlockHead from './../BlockHead/BlockHead';
import { ReactComponent as CurrencyIcon } from '../../../../assets/images/currency_pairs.svg';
import { ReactComponent as DailyIcon } from '../../../../assets/images/daily_pnl.svg';
import {ReactComponent as TradingIcon} from '../../../../assets/images/tradeng_mini.svg';
import {ReactComponent as CoinIcon} from '../../../../assets/images/Coin TICKERS.svg';
import {ReactComponent as SpreadIcon} from '../../../../assets/images/spread_mini.svg';

import './../ReportsInnerPage.scss';

const TrendVIP = ({data}) => {
  return (
    <>
      <BlockHead data={data} />
      <div className="block_inner_mini">
        <div>
          <div className='top'>
            <div className="icon" style={{ background: '#0066FF' }}><CurrencyIcon/></div>
            <div className="title">Coins  per trading session</div>
          </div>
          <div className='bottom'>
            <div className="total">{data.data.number_coin}</div>
            {/* <span className={info.coin_percent > 0 ? 'green' : 'red'}>
            {info.coin_percent > 0 ?
              <p><ArrowGreenIcon /><p>+{info.coin_percent}%</p></p>
              : <p><ArrowRedIcon /><p>{info.coin_percent}%</p></p>
            }
          </span> */}
          </div>
        </div>
        <div>
          <div className='top'>
            <div className="icon" style={{ background: '#10B981' }}><TradingIcon/></div>
            <div className="title">Number of Trading Exchanges</div>
          </div>
          <div className='bottom'>
            <div className="total">{data.data.number_of_trade}</div>
            {/* <span className={info.trading_percent > 0 ? 'green' : 'red'}>
            {info.trading_percent > 0 ?
              <p><ArrowGreenIcon /><p>+{info.trading_percent}%</p></p>
              : <p><ArrowRedIcon /><p>{info.trading_percent}%</p></p>
            }
          </span> */}
          </div>
        </div>
        <div>
          <div className="icon_wrapper">
            <div className='top'>
              <div className="icon" style={{ background: '#8B5CF6' }}><SpreadIcon/></div>
              <p>Excluding comissions</p>
            </div>
            <div className="title">Total spread</div>
          </div>
          <div className='bottom'>
            <div className="total">{data.data.total_spread}%</div>
            {/* <span className={info.trades_percent > 0 ? 'green' : 'red'}>
            {info.trades_percent > 0 ?
              <p><ArrowGreenIcon /><p>+{info.trades_percent}%</p></p>
              : <p><ArrowRedIcon /><p>{info.trades_percent}%</p></p>
            }
          </span> */}
          </div>
        </div>
        <div>
          <div className='top'>
           <div className="icon" style={{ background: '#F43F5E' }}><DailyIcon/></div>
           <div className="title">CLEAN PNL</div>
         </div>
          <div className='bottom'>
          <div className="total">{data.data.clean_pnl}%</div>
          {/* <span className={info.pnl_percent > 0 ? 'green' : 'red'}>
            {info.pnl_percent > 0 ?
              <p><ArrowGreenIcon /><p>+{info.pnl_percent}%</p></p>
              : <p><ArrowRedIcon /><p>{info.pnl_percent}%</p></p>
            }
          </span> */}
        </div>
        </div>
        <div>
          <div className='top'>
            <div className="icon" style={{ background: '#FE9E18' }}><CoinIcon/></div>
            <div className="title">Coin TICKERS</div>
          </div>
          <div className='bottom'>
            <div className="total">{data.data.coin_ticker}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrendVIP;
