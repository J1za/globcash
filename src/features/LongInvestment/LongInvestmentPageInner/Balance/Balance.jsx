import React, {useEffect} from 'react';
import {ReactComponent as RefreshIcon} from '../../../../assets/images/refresh.svg';
import {ReactComponent as ArrowRedIcon} from '../../../../assets/images/arrow_down_red.svg';
import {ReactComponent as InactiveIcon} from '../../../../assets/images/inactive_balance.svg';
import {ReactComponent as ArrowGreenIcon} from '../../../../assets/images/arrow_top_green.svg';
import './Balance.scss';
import {useSelector} from 'react-redux';
import {PropagateLoader} from 'react-spinners';
import { GlobixFixed } from '../../../../helpers/functions';

let Active = {};

const Balance = () => {
  const {
    longInvestment: {
      statisticInner,
      statisticLoad,
      statisticInner: {
        total_pnl_usdt,
        closed,
        total_pnl_usd,
        total_pnl_percent,
        week_pnl_usdt,
        week_pnl_usd,
        week_pnl_percent,
        online_pnl_usdt,
        online_pnl_usd,
        online_pnl_percent,
        usdt_amount = undefined,
        usd_amount
      }
    }
  } = useSelector(({longInvestment}) => ({longInvestment}));

  return (
    <div className='balance_block'>
      {!closed ? null : (
        <div className='inactive'>
          <InactiveIcon />
          <div>
            <span>Сurrently is inactive</span>
            <p>funds on the deposit have been successfully paid</p>
          </div>
        </div>
      )}
      {statisticLoad ? (
        <div className='_loading'>
          <PropagateLoader color={'#3579FC'} />
        </div>
      ) : (
        <div>
          <div className='title'>Hold balance</div>
          <div className='descriptions'>{usdt_amount && GlobixFixed(usdt_amount)} USDT</div>
          <div className='info'>{usd_amount && GlobixFixed(usd_amount)} $</div>
        </div>
      )}

      {!Active ? (
        statisticLoad ? (
          <div className='_loading'>
            <PropagateLoader color={'#3579FC'} />
          </div>
        ) : (
          <div>
            <div className='title'>
              PNL Online{' '}
              <p>
                <RefreshIcon /> PNL Online
              </p>
            </div>
            <div className='descriptions'>{GlobixFixed(online_pnl_usdt)} USDT</div>
            <div className='info mb-6'>
              {GlobixFixed(online_pnl_usd)} $
              <p className={`${online_pnl_percent > 0 ? 'green' : 'red'}`}>
                {+online_pnl_percent > 0 ? (
                  <>
                    <ArrowGreenIcon /> +
                  </>
                ) : (
                  <>
                    <ArrowRedIcon />
                  </>
                )}
                {online_pnl_percent && Number(online_pnl_percent).toFixed(2)}%
              </p>
            </div>
          </div>
        )
      ) : null}
      {!Active ? (
        statisticLoad ? (
          <div className='_loading'>
            <PropagateLoader color={'#3579FC'} />
          </div>
        ) : (
          <div>
            <div className='title'>PNL per week</div>
            <div className='descriptions'>{GlobixFixed(week_pnl_usdt)} USDT</div>
            <div className='info mb-6'>
              {GlobixFixed(week_pnl_usd)} $
              <p className={`${week_pnl_percent > 0 ? 'green' : 'red'}`}>
                {+week_pnl_percent > 0 ? (
                  <>
                    <ArrowGreenIcon /> +
                  </>
                ) : (
                  <>
                    <ArrowRedIcon />
                  </>
                )}
                {week_pnl_percent && Number(week_pnl_percent).toFixed(2)}%
              </p>
            </div>
          </div>
        )
      ) : null}
      {statisticLoad ? (
        <div className='_loading'>
          <PropagateLoader color={'#3579FC'} />
        </div>
      ) : (
        <div>
          <div className='title'>PNL for all the time</div>
          <div className='descriptions'>{total_pnl_usdt && GlobixFixed(total_pnl_usdt)} USDT</div>
          <div className='info mb-6'>
            {total_pnl_usd && GlobixFixed(total_pnl_usd)} $
            <p className={`${total_pnl_percent > 0 ? 'green' : 'red'}`}>
              {+total_pnl_percent > 0 ? (
                <>
                  <ArrowGreenIcon /> +
                </>
              ) : (
                <>
                  <ArrowRedIcon />
                </>
              )}
              {total_pnl_percent && Number(total_pnl_percent).toFixed(2)}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Balance;
