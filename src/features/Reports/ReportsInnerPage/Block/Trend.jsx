import React from 'react';
import BlockHead from './../BlockHead/BlockHead';
import { ReactComponent as TotalIcon } from '../../../../assets/images/total_num.svg';
import { ReactComponent as CurrencyIcon } from '../../../../assets/images/currency_pairs.svg';
import { ReactComponent as AmountIcon } from '../../../../assets/images/amount_trades.svg';
import { ReactComponent as DailyIcon } from '../../../../assets/images/daily_pnl.svg';
import {ReactComponent as ArrowGreenIcon} from '../../../../assets/images/arrow_top_green.svg';
import {ReactComponent as ArrowRedIcon} from '../../../../assets/images/arrow_down_red.svg';
import {ReactComponent as TradingIcon} from '../../../../assets/images/tradeng_mini.svg';
import {ReactComponent as CoinIcon} from '../../../../assets/images/Coin TICKERS.svg';
import {ReactComponent as SpreadIcon} from '../../../../assets/images/spread_mini.svg';

import './../ReportsInnerPage.scss';

const Trend = ({data}) => {

  const info = {

    coin:'1',
    coin_percent:'-2.5',

    trading:'3',
    trading_percent:'14.67',

    trades:'0.98',
    trades_percent:'-2.5',

    pnl:'0.84%',
    pnl_percent:'14.67',

    tickers:'SKL',


  };

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
            <div className="total">{info.coin}</div>
            <span className={info.coin_percent > 0 ? 'green' : 'red'}>
            {info.coin_percent > 0 ?
              <p><ArrowGreenIcon /><p>+{info.coin_percent}%</p></p>
              : <p><ArrowRedIcon /><p>{info.coin_percent}%</p></p>
            }
          </span>
          </div>
        </div>
        <div>
          <div className='top'>
            <div className="icon" style={{ background: '#10B981' }}><TradingIcon/></div>
            <div className="title">Number of Trading Exchanges</div>
          </div>
          <div className='bottom'>
            <div className="total">{info.trading}%</div>
            <span className={info.trading_percent > 0 ? 'green' : 'red'}>
            {info.trading_percent > 0 ?
              <p><ArrowGreenIcon /><p>+{info.trading_percent}%</p></p>
              : <p><ArrowRedIcon /><p>{info.trading_percent}%</p></p>
            }
          </span>
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
            <div className="total">{info.trades}</div>
            <span className={info.trades_percent > 0 ? 'green' : 'red'}>
            {info.trades_percent > 0 ?
              <p><ArrowGreenIcon /><p>+{info.trades_percent}%</p></p>
              : <p><ArrowRedIcon /><p>{info.trades_percent}%</p></p>
            }
          </span>
          </div>
        </div>
        <div>
          <div className='top'>
            <div className="icon" style={{ background: '#F43F5E' }}><DailyIcon/></div>
            <div className="title">CLEAN PNL</div>
          </div>
          <div className='bottom'>
            <div className="total">{info.pnl} %</div>
            <span className={info.pnl_percent > 0 ? 'green' : 'red'}>
            {info.pnl_percent > 0 ?
              <p><ArrowGreenIcon /><p>+{info.pnl_percent}%</p></p>
              : <p><ArrowRedIcon /><p>{info.pnl_percent}%</p></p>
            }
          </span>
          </div>
        </div>
        <div>
          <div className='top'>
            <div className="icon" style={{ background: '#FE9E18' }}><CoinIcon/></div>
            <div className="title">Coin TICKERS</div>
          </div>
          <div className='bottom'>
            <div className="total">{info.tickers}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Trend;
