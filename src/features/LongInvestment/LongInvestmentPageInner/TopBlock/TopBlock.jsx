import React, {useEffect, useState} from 'react';
import {ReactComponent as InfoIcon} from '../../../../assets/images/info_yellow.svg';
import {ReactComponent as InfoMiniIcon} from '../../../../assets/images/info_mini.svg';
import {ReactComponent as ArrowGreenIcon} from '../../../../assets/images/arrow_top_green.svg';
import {ReactComponent as ArrowRedIcon} from '../../../../assets/images/arrow_down_red.svg';

import {useDispatch, useSelector} from 'react-redux';
import './TopBlock.scss';
import {getStatisticInner} from '../../LongInvestmentPage/LongIActions';
import {PropagateLoader} from 'react-spinners';
import NP from 'number-precision';

import useWebSocket from 'react-use-websocket';
import {API_WS_URL} from '../../../../config';
import Convert from '../../../../helpers/Convert';
import {GlobixFixed} from '../../../../helpers/functions';

const TopBlock = ({id}) => {
  const dispatch = useDispatch();
  const socketUrl = `${API_WS_URL}/portfolio/currency/price/`;
  const [rateFluctuations, setRateFluctuations] = useState(null);
  const {
    longInvestment: {statisticInner, statisticLoad}
  } = useSelector(({longInvestment}) => ({longInvestment}));

  const [currency, setCur] = useState({...statisticInner.currency});

  const {sendJsonMessage} = useWebSocket(socketUrl, {
    onOpen: () => console.log('opened'),
    onMessage: (e) => {
      let target = [...JSON.parse(e.data)][0];

      currency.price_usdt = target.price;
      currency.price_usd = <Convert name={'USDT'} sum={target.price} />;
    },
    shouldReconnect: (closeEvent) => true,
    queryParams: {
      token: localStorage.getItem('token')
    }
  });

  useEffect(() => {
    dispatch(getStatisticInner(id)).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 200) {
        setCur({...res.payload.data.currency});
        if (res.payload.data.currency.price_usdt) sendJsonMessage({currencies_ids: [res.payload.data.currency.id]});
      }
    });
  }, [id]);

  useEffect(() => {
    const ratePercentInterval = (statisticInner.currency.high - statisticInner.currency.low) / 100;
    const rateFindInterval = statisticInner.currency.price_usdt - statisticInner.currency.low;
    setRateFluctuations(rateFindInterval / ratePercentInterval);
  }, [statisticInner]);

  return (
    <div className='top_block_long_inner'>
      <div className={`wrapper_block ${statisticLoad ? '_loading' : ''}`}>
        {statisticLoad ? (
          <PropagateLoader color={'#3579FC'} />
        ) : (
          <>
            <div className='value_block'>
              <div>
                <div className='name'>
                  <img src={currency.icon} />
                  <span>{currency.name}</span>
                  <p>{currency.code}</p>
                </div>
                {currency.cmc_rank && <div className='rank'>Rank #{currency.cmc_rank}</div>}
              </div>
              <div>
                <div>{currency.price_usdt && GlobixFixed(currency.price_usdt)} USDT</div>
                <span>
                  {currency.price_usd && currency.price_usd} $
                  <p className={`${currency.price_change_percent >= 0 ? 'green' : 'red'}`}>
                    {+currency.price_change_percent > 0 ? (
                      <>
                        <ArrowGreenIcon />
                      </>
                    ) : (
                      <>
                        <ArrowRedIcon />
                      </>
                    )}
                    {currency.price_change_percent && Number(currency.price_change_percent).toFixed(2)}%
                  </p>
                </span>
              </div>
            </div>
            <div className='block'>
              <div className='volume'>
                <div className='time'>
                  Volume <span>24h</span>
                </div>
                <div className='info'>
                  {currency.volume_24h_usd && GlobixFixed(currency.volume_24h_usd)} USDT
                  {/* <p className={`${currency.percent_change_24h >= 0 ? 'green' : 'red'}`}>
                    {currency.percent_change_24h > 0 ? (
                      <>
                        <ArrowGreenIcon />
                      </>
                    ) : (
                      <>
                        <ArrowRedIcon />
                      </>
                    )}
                    {currency.percent_change_24h && GlobixFixed(currency.percent_change_24h)}%
                  </p> */}
                </div>
                <div className='time'>
                  rate fluctuations <span>24h</span>
                </div>
                <div className='rate'>
                  <span>
                    Low: <p>${currency.low && GlobixFixed(currency.low)}</p>
                  </span>
                  <div>
                    <span style={{width: `${rateFluctuations <= 0 ? 0 : rateFluctuations}%`}}></span>
                  </div>
                  <span>
                    High: <p>${currency.high && GlobixFixed(currency.high)}</p>
                  </span>
                </div>
              </div>
              <div className='other_info'>
                <div className='coin'>
                  <span>Other info</span>
                  <p>
                    <InfoMiniIcon /> CoinMarketCap
                  </p>
                </div>
                <div>
                  <span>Market Cap: </span>
                  <p>$ {currency.market_cap ? GlobixFixed(currency.market_cap) : '-'}</p>
                </div>
                <div>
                  <span>Circulating Supply</span>
                  <p>
                    {currency.circulating_supply ? GlobixFixed(currency.circulating_supply) : '-'} {currency.code}
                  </p>
                </div>
                <div>
                  <span>Max Supply:</span>
                  <p>
                    {currency.max_supply ? GlobixFixed(currency.max_supply) : '-'} {currency.code}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <div className='text'>
        <InfoIcon /> The company does not guarantee income from buying currency in the event of a fall in the rate.
      </div>
    </div>
  );
};

export default TopBlock;
