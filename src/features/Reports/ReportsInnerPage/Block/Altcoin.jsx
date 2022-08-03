import React from 'react';
import BlockHead from './../BlockHead/BlockHead';
import { ReactComponent as TotalIcon } from '../../../../assets/images/total_num.svg';
import { ReactComponent as CurrencyIcon } from '../../../../assets/images/currency_pairs.svg';
import { ReactComponent as AmountIcon } from '../../../../assets/images/amount_trades.svg';
import { ReactComponent as DailyIcon } from '../../../../assets/images/daily_pnl.svg';
import './../ReportsInnerPage.scss';

const Altcoin = ({data}) => {

  const info = {

    total:'765',
    total_percent:'-2.5',

    currency:'10',
    currency_percent:'14.67',

    trades:'14239099',
    trades_percent:'14.67',

    daily:'065',
    daily_percent:'-2.5',

  };

  return (
    <>
      <BlockHead data={data} />
      <div className="block_inner_mini">
        <div>
          <div className='top'>
            <div className="icon" style={{ background: '#0066FF' }}><TotalIcon/></div>
            <div className="title">Total number of transactions</div>
          </div>
          <div className='bottom'>
            <div className="total">{data.data.number_of_transaction}</div>
            {/* <span className={info.total_percent > 0 ? 'green' : 'red'}>
            {info.total_percent > 0 ?
              <p><ArrowGreenIcon /><p>+{info.total_percent}%</p></p>
              : <p><ArrowRedIcon /><p>{info.total_percent}%</p></p>
            }
          </span> */}
          </div>
        </div>
        <div>
          <div className='top'>
            <div className="icon" style={{ background: '#10B981' }}><CurrencyIcon/></div>
            <div className="title">Number of currency pairs</div>
          </div>
          <div className='bottom'>
            <div className="total">{data.data.number_of_curency_pars}</div>
            {/* <span className={info.currency_percent > 0 ? 'green' : 'red'}>
            {info.currency_percent > 0 ?
              <p><ArrowGreenIcon /><p>+{info.currency_percent}%</p></p>
              : <p><ArrowRedIcon /><p>{info.currency_percent}%</p></p>
            }
          </span> */}
          </div>
        </div>
        <div>
          <div className='top'>
            <div className="icon" style={{ background: '#8B5CF6' }}><AmountIcon/></div>
            <div className="title">Amount of trades</div>
          </div>
          <div className='bottom'>
            <div className="total">{data.data.amount_of_trade} USDT</div>
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
            <div className="title">Daily PNL PNL</div>
          </div>

          <div className='bottom'>
            <div className="total">{data.data.daily_pnl}%</div>
            {/* <span className={info.daily_percent > 0 ? 'green' : 'red'}>
            {info.daily_percent > 0 ?
              <p><ArrowGreenIcon /><p>+{info.daily_percent}%</p></p>
              : <p><ArrowRedIcon /><p>{info.daily_percent}%</p></p>
            }
          </span> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Altcoin;
