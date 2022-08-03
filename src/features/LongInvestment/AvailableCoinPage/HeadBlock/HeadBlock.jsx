import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { ReactComponent as ArrowIcon } from '../../../../assets/images/arrow_back.svg';
import { ReactComponent as IIcon } from '../../../../assets/images/i_img.svg';
import { ReactComponent as TextIcon } from '../../../../assets/images/coin_text.svg';
import { ReactComponent as ArrowGreenIcon } from '../../../../assets/images/arrow_top_green.svg';
import { ReactComponent as ArrowRedIcon } from '../../../../assets/images/arrow_down_red.svg';
import { ReactComponent as LinkIcon } from '../../../../assets/images/copu_link.svg';
import './HeadBlock.scss';
import SelectComponent from '../../../../shared/SelectComponent';
import { ReactComponent as NonAvatar } from '../../../../assets/images/coin-non-avatar.svg';
import { ReactComponent as VectorIcon } from '../../../../assets/images/select_arrow.svg';
import { ReactComponent as SlIcon } from '../../../../assets/images/slesh.svg';
import { ReactComponent as WebsiteIcon } from '../../../../assets/images/website.svg';
import { ReactComponent as ExpIcon } from '../../../../assets/images/select_exp.svg';
import { ReactComponent as CommuninyIcon } from '../../../../assets/images/communiny.svg';
import CoinIcon from '../../../../assets/images/rep_coin.svg';
import useWindowDimensions from '../../../../helpers/useWindowDimensions';

import NP from 'number-precision';

import useWebSocket from 'react-use-websocket';
import { API_WS_URL } from '../../../../config';
import Convert from '../../../../helpers/Convert';
import { GlobixFixed } from '../../../../helpers/functions';
import { PropagateLoader } from 'react-spinners';

const HeadBlock = ({ headInfo, coinLoad }) => {
  const socketUrl = `${API_WS_URL}/portfolio/currency/price/`;
  const [prices, setPrices] = useState({ price_usdt: '', price_usd: '' });

  const [soketLoad, setSoketLoad] = useState(true);

  const [rateFluctuations, setRateFluctuations] = useState(null);

  const { sendJsonMessage } = useWebSocket(socketUrl, {
    onOpen: () => console.log('opened'),
    onMessage: (e) => {
      let target = [...JSON.parse(e.data)][0];

      prices.price_usdt = target.price;
      prices.price_usd = <Convert name={'USDT'} sum={target.price} />;

      setSoketLoad(false);
    },
    shouldReconnect: (closeEvent) => true,
    queryParams: {
      token: localStorage.getItem('token')
    }
  });

  useEffect(() => {
    if (headInfo.id) sendJsonMessage({ currencies_ids: [headInfo.id] });
  }, [headInfo.id]);

  const { width } = useWindowDimensions();
  const right = {
    pnl_percent: '123',
    market_cap: '$329,902,972,450',
    circulating_supply: '119,412,687.37 ETH',
    total_supply: '119,412,687',
    max_supply: '100,000,000'
  };

  const middle = {
    volume: '24',
    percent: '24',
    price_all: '43550.45 USDT',
    price: '23548.50 $',
    rateFluctuations: '25',
    low: '$43550',
    high: '$44154'
  };

  const left = {
    percent: '20',
    price: '23548.50 $',
    price_all: '4550.45 USDT',
    rank: '2',
    coin: 'Ethereum',
    cod: 'ETH',
    coin_icon: <img src={CoinIcon} alt='' />
  };

  const [parameters, setParameters] = useState({
    code: '24',
    website: '1',
    explorers: '1',
    community: '1'
  });

  const optionsWebsite =
    headInfo && headInfo.info && headInfo.info.website
      ? headInfo.info.website.map((el) => ({
        value: el,
        label: (
          <div onClick={() => window.open(el)} href={el} className='label'>
            <WebsiteIcon />
            <span>{el.slice(8, el.length - 1)}</span>
          </div>
        )
      }))
      : [];

  const optionsExplorers =
    headInfo && headInfo.info && headInfo.info.explorers
      ? headInfo.info.explorers.map((el) => ({
        value: el,
        label: (
          <div onClick={() => window.open(el)} className='label'>
            <ExpIcon />
            <span>{el.slice(8, el.length).slice(0, el.slice(8, el.length).indexOf('/'))}</span>
          </div>
        )
      }))
      : [];

  const optionsCommunity =
    headInfo && headInfo.info && headInfo.info.community
      ? headInfo.info.community.map((el) => ({
        value: el,
        label: (
          <div onClick={() => window.open(el)} className='label'>
            <CommuninyIcon />
            <span href={el}>{el.slice(8, el.length).slice(0, el.slice(8, el.length).indexOf('/'))}</span>
          </div>
        )
      }))
      : [];

  const initial = [
    {
      value: 1,
      label: (
        <div className='label'>
          <WebsiteIcon />
          <span>Website</span>
        </div>
      )
    },
    {
      value: 2,
      label: (
        <div className='label'>
          <ExpIcon />
          <span>Explorers</span>
        </div>
      )
    },
    {
      value: 3,
      label: (
        <div className='label'>
          <CommuninyIcon />
          <span>Community</span>
        </div>
      )
    }
  ];

  const optionsVolume = [
    { value: '24', label: '24' },
    { value: '48', label: '48' },
    { value: '72', label: '72' }
  ];

  const [openBlock, setOpenBlock] = useState(false);

  const OpenBlock = () => {
    setOpenBlock(true);
  };
  const CloseBlock = () => {
    setOpenBlock(false);
  };

  useEffect(() => {
    console.log(headInfo)
    const ratePercentInterval = (headInfo.high - headInfo.low) / 100;
    const rateFindInterval = headInfo.price_usdt - headInfo.low;
    setRateFluctuations(rateFindInterval / ratePercentInterval);
  }, [headInfo, prices]);

  return (
    <div className='head_block'>
      <div className='breadcrumbs'>
        <Link className='good-hover' to={'/main/long-investment'}>
          Long investment
        </Link>
        <ArrowIcon />
        <span>{headInfo.name}</span>
      </div>
      <div className={`content ${soketLoad || coinLoad ? '_loading' : ''}`}>
        {soketLoad || coinLoad ? (
          <PropagateLoader color={'#3579FC'} />
        ) : (
          <>
            <div className='left'>
              <div className='top'>
                <div className='coin'>
                  {headInfo.icon
                    ? <img className='coin_icon' src={headInfo && headInfo.icon && headInfo.icon} alt='' />
                    : <NonAvatar className='coin_icon' />
                  }
                  <div>
                    <div>
                      <span>{headInfo.name}</span>
                      <p>{headInfo.code}</p>
                    </div>
                    <span>Rank # {headInfo.cmc_rank ? headInfo.cmc_rank : '-'}</span>
                  </div>
                </div>
                <div className='price'>
                  <span>{GlobixFixed(prices.price_usdt)} USDT</span>
                  <div>
                    <div className={`${headInfo.price_change_percent > 0 ? 'green' : 'red'}`}>
                      {headInfo.price_change_percent ? (
                        +headInfo.price_change_percent > 0 ? (
                          <>
                            <ArrowGreenIcon />
                          </>
                        ) : (
                          <>
                            <ArrowRedIcon />
                          </>
                        )
                      ) : null}
                      {headInfo && headInfo.price_change_percent
                        ? Math.abs(Number(headInfo.price_change_percent)).toFixed(2)
                        : '- '}
                      %
                    </div>
                    <p>{headInfo.price_usd && prices.price_usd} $</p>
                  </div>
                </div>
              </div>
              <div className='bottom'>
                <div className='wrapper_select'>
                  {optionsWebsite.length > 0 ? (
                    <SelectComponent
                      options={optionsWebsite}
                      value={initial[0]}
                      components={<VectorIcon />}
                      placeholder='Website'
                    />
                  ) : null}
                  {optionsExplorers.length > 0 ? (
                    <SelectComponent
                      options={optionsExplorers}
                      value={initial[1]}
                      components={<VectorIcon />}
                      placeholder='Select the currency'
                    />
                  ) : null}
                  {optionsCommunity.length > 0 ? (
                    <SelectComponent
                      options={optionsCommunity}
                      value={initial[2]}
                      components={<VectorIcon />}
                      placeholder='Select the currency'
                    />
                  ) : null}
                </div>
                <div className='link'>
                  {headInfo && headInfo.info && headInfo.info.source_code.length > 0 && (
                    <a
                      href={headInfo && headInfo.info && headInfo.info.source_code[0]}
                      target='_blank'
                      className='good-hover'
                    >
                      <SlIcon />
                      <span>Source code</span>
                      <LinkIcon />
                    </a>
                  )}
                  {headInfo && headInfo.info && headInfo.info.whitepaper.length > 0 && (
                    <a
                      href={headInfo && headInfo.info && headInfo.info.whitepaper[0]}
                      target='_blank'
                      className='good-hover'
                    >
                      <SlIcon />
                      <span>Whitepaper</span>
                      <LinkIcon />
                    </a>
                  )}
                </div>
              </div>
            </div>
            <div className='middle'>
              <div className='descriptions'>
                Volume <span>24h</span>
              </div>
              {width > 767 && (
                <div className='info'>
                  <p>{headInfo.volume_24h_usdt && GlobixFixed(headInfo.volume_24h_usdt)} USDT</p>
                  {/* <div className={`${headInfo.percent_change_24h > 0 ? 'green' : 'red'}`}>
                {headInfo.percent_change_24h ? (
                  +headInfo.percent_change_24h > 0 ? (
                    <>
                      <ArrowGreenIcon />
                    </>
                  ) : (
                    <>
                      <ArrowRedIcon />
                    </>
                  )
                ) : null}
                {headInfo && headInfo.percent_change_24h
                  ? NP.strip(
                      headInfo.percent_change_24h > 0
                        ? GlobixFixed(headInfo.percent_change_24h)
                        : GlobixFixed(
                            headInfo.percent_change_24h
                              .toString()
                              .split('')
                              .slice(1, headInfo.percent_change_24h.length)
                              .join('')
                          )
                    )
                  : '- '}
                %
              </div> */}
                </div>
              )}

              {width < 767 && (
                <div className='info mob'>
                  <div>
                    <p>{middle.price_all}</p>
                    <span>
                      {middle.price}
                      <div className={`${middle.percent > 0 ? 'green' : 'red'}`}>
                        {+middle.percent > 0 ? (
                          <>
                            <ArrowGreenIcon /> +
                          </>
                        ) : (
                          <>
                            <ArrowRedIcon />
                          </>
                        )}
                        {middle.percent}%
                      </div>
                    </span>
                  </div>
                </div>
              )}
              <div className='period'>
                <span>Low/high</span>

                <span className='period_hour'>24h</span>
              </div>
              <div className='rate'>
                <span>
                  Low:
                  <p>${headInfo.low && GlobixFixed(headInfo.low)}</p>
                </span>
                <div>
                  <span style={{ width: `${rateFluctuations <= 0 ? 0 : rateFluctuations}%` }}></span>
                </div>
                <span>
                  High: <p>${headInfo.high && GlobixFixed(headInfo.high)}</p>
                </span>
              </div>
              <button className={openBlock ? 'more_btn close_btn' : 'more_btn'} onClick={OpenBlock}>
                Show more
              </button>
            </div>
            <div className='right'>
              <div className='descriptions'>
                <p>Ohter info</p>
                <span>
                  <IIcon />
                  <TextIcon />
                </span>
              </div>
              <div className='text mb-12'>
                <div>
                  <span>Market Cap: </span>
                  <p>
                    ${headInfo.market_cap ? headInfo.market_cap.toLocaleString('ru', { maximumFractionDigits: 0 }) : ' -'}
                  </p>
                  {/* <div className={`${headInfo.percent_change_7d > 0 ? 'green' : 'red'}`}>
                {headInfo.percent_change_7d ? (
                  +headInfo.percent_change_7d > 0 ? (
                    <>
                      <ArrowGreenIcon />
                    </>
                  ) : (
                    <>
                      <ArrowRedIcon />
                    </>
                  )
                ) : null}
                {headInfo && headInfo.percent_change_7d
                  ? NP.strip(
                      headInfo.percent_change_7d > 0
                        ? GlobixFixed(headInfo.percent_change_7d)
                        : GlobixFixed(
                            headInfo.percent_change_7d &&
                              headInfo.percent_change_7d
                                .toString()
                                .split('')
                                .slice(1, headInfo.percent_change_7d.length)
                                .join('')
                          )
                    )
                  : '- '}
                %
              </div> */}
                </div>
                <div>
                  <span>Circulating Supply</span>
                  <p>
                    {headInfo.circulating_supply
                      ? headInfo.circulating_supply.toLocaleString('ru', {
                        maximumFractionDigits: 0
                      }) +
                      ' ' +
                      headInfo.code
                      : '- '}
                  </p>
                </div>
              </div>
              <div className='text'>
                <div>
                  <span>Max Supply:</span>
                  <p>
                    {headInfo.max_supply
                      ? headInfo.max_supply.toLocaleString('ru', { maximumFractionDigits: 0 }) + ' ' + headInfo.code
                      : '- '}
                  </p>
                </div>
                <div>
                  <span>Total Supply:</span>
                  <p>
                    {!headInfo.total_supply
                      ? '-'
                      : headInfo.total_supply.toLocaleString('ru', { maximumFractionDigits: 0 })}
                  </p>
                </div>
              </div>
            </div>
            {width < 767 && openBlock ? (
              <div className='mob_info'>
                <div className='right'>
                  <div className='descriptions'>
                    <p>Ohter info</p>
                    <span>
                      <IIcon />
                      <TextIcon />
                    </span>
                  </div>
                  <div className='text mb-12'>
                    <div>
                      <span>Market Cap: </span>
                      <p>{right.market_cap}</p>
                      <div className={`${right.pnl_percent > 0 ? 'green' : 'red'}`}>
                        {+right.pnl_percent > 0 ? (
                          <>
                            <ArrowGreenIcon /> +
                          </>
                        ) : (
                          <>
                            <ArrowRedIcon />
                          </>
                        )}
                        {right.pnl_percent}%
                      </div>
                    </div>
                    <div>
                      <span>Circulating Supply</span>
                      <p>{right.circulating_supply}</p>
                    </div>
                  </div>
                  <div className='text'>
                    <div>
                      <span>Max Supply:</span>
                      <p>{right.max_supply}</p>
                    </div>
                    <div>
                      <span>Total Supply:</span>
                      <p>{right.total_supply}</p>
                    </div>
                  </div>
                </div>
                <div className='mob_link'>
                  <p>Links</p>
                  <a href=''>
                    <WebsiteIcon />
                    <span className='mr-8 ml-8'>www.ethereum.org</span>
                    <LinkIcon />
                  </a>
                  <a href=''>
                    <WebsiteIcon />
                    <span className='mr-8 ml-8'>en.wikipedia.org/wiki/Et...</span>
                    <LinkIcon />
                  </a>
                  <a href=''>
                    <WebsiteIcon />
                    <span className='mr-8 ml-8'>Source code</span>
                    <LinkIcon />
                  </a>
                  <a href=''>
                    <WebsiteIcon />
                    <span className='mr-8 ml-8'>Whitepaper</span>
                    <LinkIcon />
                  </a>
                </div>
                <div className='mob_link'>
                  <p>Explorers</p>
                  <a href=''>
                    <span className='mr-8'>etherscan.io</span>
                    <LinkIcon />
                  </a>
                  <a href=''>
                    <span className='mr-8'>ethplorer.io</span>
                    <LinkIcon />
                  </a>
                  <a href=''>
                    <span className='mr-8'>blockchair.com</span>
                    <LinkIcon />
                  </a>
                  <a href=''>
                    <span className='mr-8'>bscscan.com</span>
                    <LinkIcon />
                  </a>
                  <a href=''>
                    <span className='mr-8'>eth.tokenview.com</span>
                    <LinkIcon />
                  </a>
                </div>
                <div className='mob_link'>
                  <p>Comminity</p>
                  <a href=''>
                    <CommuninyIcon />
                    <span className='mr-8 ml-8'>bitcointalk.org</span>
                    <LinkIcon />
                  </a>
                  <a href=''>
                    <CommuninyIcon />
                    <span className='mr-8 ml-8'>forum.ethereum.org</span>
                    <LinkIcon />
                  </a>
                  <a href=''>
                    <CommuninyIcon />
                    <span className='mr-8 ml-8'>ethresear.ch</span>
                    <LinkIcon />
                  </a>
                  <a href=''>
                    <CommuninyIcon />
                    <span className='mr-8 ml-8'>Twitter</span>
                    <LinkIcon />
                  </a>
                  <a href=''>
                    <CommuninyIcon />
                    <span className='mr-8 ml-8'>Reddit</span>
                    <LinkIcon />
                  </a>
                </div>
                <button className='less_btn' onClick={CloseBlock}>
                  Show Less
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default HeadBlock;
