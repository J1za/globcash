import React from 'react';
import BlockHead from './../BlockHead/BlockHead';
import { ReactComponent as DailyIcon } from '../../../../assets/images/daily_pnl.svg';
import {ReactComponent as AllocationIcon} from '../../../../assets/images/Allocation.svg';
import {ReactComponent as ProtocolIcon} from '../../../../assets/images/Protocol ratio.svg';
import {ReactComponent as PairsIcon} from '../../../../assets/images/Pairs of liquidity.svg';
import {ReactComponent as AverageIcon} from '../../../../assets/images/Average Pnl.svg';

import './../ReportsInnerPage.scss';

const Defi = ({data}) => {
  return (
    <>
      <BlockHead data={data} />
      <div className="block_inner_mini">
        <div>
          <div className='top'>
            <div className="icon" style={{ background: '#0066FF' }}><AllocationIcon/></div>
            <div className="title">Allocation of liquidity</div>
          </div>
          <div className="chart_mini">
            <div>
              <span style={{ background: '#3579FC' }}/>
              Defi exchange:
              <p>{data.data.defi_exchange}%</p>
            </div>
            <div>
              <span style={{ background: '#FF927D' }}/>
              Defi credit:
              <p>{data.data.defi_credit}%</p>
            </div>
            <div>
              <span style={{ background: '#896AE3' }}/>
              Defi liquidity:
              <p>{data.data.defi_liquid}%</p>
            </div>
          </div>
        </div>
        <div>
          <div className='top'>
            <div className="icon" style={{ background: '#10B981' }}><ProtocolIcon/></div>
            <div className="title">Protocol ratio</div>
          </div>
          <div className="chart_mini">
            <div>
              <span style={{ background: '#46A8A5' }}/>
              ERC:
              <p>{data.data.sot_erc}%</p>
            </div>
            <div>
              <span style={{ background: '#D76AE3' }}/>
              BNB:
              <p>{data.data.sot_bnb}%</p>
            </div>
            <div>
              <span style={{ background: '#F9F871' }}/>
              TRX:
              <p>{data.data.sot_trx}%</p>
            </div>
          </div>
        </div>
        <div>
         <div className='top'>
           <div className="icon" style={{ background: '#8B5CF6' }}><PairsIcon/></div>
           <div className="title">Pairs of liquidity</div>
         </div>
          <div className='bottom'>
            <div className="total">{data.data.number_of_pars_liquid}</div>
            {/* <span className={info.pairs_percent > 0 ? 'green' : 'red'}>
            {info.pairs_percent > 0 ?
              <p><ArrowGreenIcon /><p>+{info.pairs_percent}%</p></p>
              : <p><ArrowRedIcon /><p>{info.pairs_percent}%</p></p>
            }
          </span> */}
          </div>
        </div>
        <div>
          <div className='top'>
            <div className="icon" style={{ background: '#F43F5E' }}><AverageIcon/></div>
            <div className="title">Average Pnl</div>
          </div>
          <div className='bottom'>
            <div className="total">{data.data.average_pnl}%</div>
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
            <div className="icon" style={{ background: '#FE9E18' }}><DailyIcon/></div>
            <div className="title">Net Pnl per session</div>
          </div>
          <div className='bottom'>
            <div className="total">{data.data.clean_pnl}%</div>
            {/* <span className={info.net_pnl_percent > 0 ? 'green' : 'red'}>
            {info.net_pnl_percent > 0 ?
              <p><ArrowGreenIcon /><p>+{info.net_pnl_percent}%</p></p>
              : <p><ArrowRedIcon /><p>{info.net_pnl_percent}%</p></p>
            }
          </span> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Defi;
