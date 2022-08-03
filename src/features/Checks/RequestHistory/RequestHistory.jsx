import React, { useEffect, useState } from 'react';
import Pagination from '../../../shared/Pagination';
import SelectComponent from '../../../shared/SelectComponent';
import { Controller, useForm } from 'react-hook-form';
import { Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getRisk } from '../../Checks/checksActions';
import { PropagateLoader } from 'react-spinners';
import { ReactComponent as MediumRisk } from '../../../assets/images/Medium_risk.svg';
import { ReactComponent as LowRisk } from '../../../assets/images/Low_risk.svg';
import { ReactComponent as HighRisk } from '../../../assets/images/High_risk.svg';
import { ReactComponent as CopyIcon, ReactComponent as CopyRisk } from '../../../assets/images/copy.svg';
import { ReactComponent as VectorIcon } from '../../../assets/images/arrow_d.svg';
import { ReactComponent as LinkIcon } from '../../../assets/images/link_info.svg';
import { ReactComponent as NoCheckIcon } from '../../../assets/images/no_check.svg';
import './RequestHistory.scss';
import moment from 'moment';
import CopyToClipboard from 'react-copy-to-clipboard';
import { ToListStart } from '../../../helpers/functions';


const RequestHistory = () => {
  const { risk, riskLoad } = useSelector(({ checks }) => (checks));

  const [activePage, setActivePage] = useState(0);

  const dispatch = useDispatch();

  const { control } = useForm();

  const setPage = ({ selected }, isReload) => {
    setActivePage(selected)
    if (isReload) doRequest(selected);
  };

  const doRequest = page => {
    let url = [`page=${page + 1}`];
    for (let key in parameters) {
      if (parameters[key] !== null && parameters[key] !== '') {
        url.push(`${key}=${parameters[key].value ? parameters[key].value : parameters[key]}`);
      }
    }
    dispatch(getRisk(url.join('&')))
  };

  const optionsPage = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 30, label: '30' },
    { value: 50, label: '50' }
  ];

  const [parameters, setParameters] = useState({
    page_size: 5,
  });

  const DropdownIndicator = props => {
    return (
      <DropdownIndicator {...props}>
        <VectorIcon />
      </DropdownIndicator>
    );
  };

  useEffect(() => {
    setPage({ selected: 0 }, true);
  }, [parameters]);

  useEffect(() => {
  }, [risk]);

  const [copyStatus, setCopyStatus] = useState(false);

  const isReady = (data, key) => data.data && data.data.signals && data.data.signals[key];

  return (
    <section className='card-wrap request_history'>
      {riskLoad ?
        <section className="reports_table loading">
          <div className="card-wrap">
            <PropagateLoader color={'#3579FC'} />
          </div>
        </section>
        : risk ?
          <div>
            <div className="filter">
              <div className="left">Request history</div>
              <div className="right">
                <span>Showing{' '}
                  {(+activePage * +parameters.page_size) + 1}
                  {' '}-{' '}
                  {
                    (+activePage * +parameters.page_size) + parameters.page_size >= risk.count
                      ? risk.count
                      : (+activePage * +parameters.page_size) + parameters.page_size
                  }
                  {' '}out of{' '}
                  {risk.count}</span>
                <Controller
                  name='select'
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <SelectComponent
                      // menuIsOpen
                      onChange={(e => setParameters({ ...parameters, page_size: e.value }))}
                      onBlur={onBlur}
                      value={optionsPage.find(el => el.value === parameters.page_size)}
                      options={optionsPage}
                      components={{ DropdownIndicator }}
                    />
                  )}
                />
              </div>
            </div>
            <div className='request_content'>
              {risk && risk.results.map(({ id, currency_code, created_date, data, hash }) => (
                <div className='items' key={id}>
                  <div className='top'>
                    <div className='info'>
                      <div>
                        <span>Date & Time:</span>
                        {moment(created_date).format('MMM DD HH:mm')}
                      </div>
                      <div>
                        <span>ID:</span>
                        <p>{id}</p>
                      </div>
                    </div>
                    <div className='address'>
                      <span>{currency_code} address:</span>
                      <p>{data.data.address}</p>
                      <CopyToClipboard
                        text={hash !== '' ? hash : ''}
                        onCopy={() => setCopyStatus(true)}
                      >
                        <button className='good-hover'><CopyIcon /></button>
                      </CopyToClipboard>
                    </div>
                    <div className='score'>Risk Score: {data.data.riskscore ? data.data.riskscore : 'Not found'}</div>
                    <div className='risk'>
                      {!data.data.riskscore
                        ? <span>No risk data found for address 👍</span>
                        : data.data.riskscore >= 25 && data.data.riskscore <= 74 ? <span>Medium risk address<MediumRisk /></span>
                          : data.data.riskscore >= 75 && data.data.riskscore <= 100 ? <span>High risk address<HighRisk /></span>
                            : <span>Low risk address<LowRisk /></span>}
                    </div>
                  </div>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={
                        <div className='arrow_accordion'>
                          <span>Details</span>
                          <VectorIcon />
                        </div>
                      }
                    >

                      {data.data.riskscore ?
                        <div
                          className='color'
                          onClick={(event) => event.stopPropagation()}
                        >

                          {isReady(data, 'miner') && data.data.signals.miner !== 0 ? <span className='miner' style={{ width: `${100 / data.data.riskscore * data.data.signals.miner}` + '%' }} /> : null}
                          {isReady(data, 'payment') && data.data.signals.payment !== 0 ? <span className='payment' style={{ width: `${100 / data.data.riskscore * data.data.signals.payment}` + '%' }} /> : null}
                          {isReady(data, 'wallet') && data.data.signals.wallet !== 0 ? <span className='wallet' style={{ width: `${100 / data.data.riskscore * data.data.signals.wallet}` + '%' }} /> : null}
                          {isReady(data, 'exchange_mlrisk_low') && data.data.signals.exchange_mlrisk_low !== 0 ? <span className='exchange_mlrisk_low' style={{ width: `${100 / data.data.riskscore * data.data.signals.exchange_mlrisk_low}` + '%' }} /> : null}
                          {isReady(data, 'p2p_exchange_mlrisk_low') && data.data.signals.p2p_exchange_mlrisk_low !== 0 ? <span className='p2p_exchange_mlrisk_low' style={{ width: `${100 / data.data.riskscore * data.data.signals.p2p_exchange_mlrisk_low}` + '%' }} /> : null}

                          {isReady(data, 'p2p_exchange_mlrisk_high') && data.data.signals.p2p_exchange_mlrisk_high !== 0 ? <span className='p2p_exchange_mlrisk_high' style={{ width: `${100 / data.data.riskscore * data.data.signals.p2p_exchange_mlrisk_high}` + '%' }} /> : null}
                          {isReady(data, 'exchange_mlrisk_moderate') && data.data.signals.exchange_mlrisk_moderate !== 0 ? <span className='exchange_mlrisk_moderate' style={{ width: `${100 / data.data.riskscore * data.data.signals.exchange_mlrisk_moderate}` + '%' }} /> : null}
                          {isReady(data, 'exchange_mlrisk_high') && data.data.signals.exchange_mlrisk_high !== 0 ? <span className='exchange_mlrisk_high' style={{ width: `${100 / data.data.riskscore * data.data.signals.exchange_mlrisk_high}` + '%' }} /> : null}
                          {isReady(data, 'exchange_mlrisk_veryhigh') && data.data.signals.exchange_mlrisk_veryhigh !== 0 ? <span className='exchange_mlrisk_veryhigh' style={{ width: `${100 / data.data.riskscore * data.data.signals.exchange_mlrisk_veryhigh}` + '%' }} /> : null}

                          {isReady(data, 'mixer') && data.data.signals.mixer !== 0 ? <span className='mixer' style={{ width: `${100 / data.data.riskscore * data.data.signals.mixer}` + '%' }} /> : null}
                          {isReady(data, 'scam') && data.data.signals.scam !== 0 ? <span className='scam' style={{ width: `${100 / data.data.riskscore * data.data.signals.scam}` + '%' }} /> : null}
                          {isReady(data, 'dark_market') && data.data.signals.dark_market !== 0 ? <span className='dark_market' style={{ width: `${100 / data.data.riskscore * data.data.signals.dark_market}` + '%' }} /> : null}
                          {isReady(data, 'gambling') && data.data.signals.gambling !== 0 ? <span className='gambling' style={{ width: `${100 / data.data.riskscore * data.data.signals.gambling}` + '%' }} /> : null}
                          {isReady(data, 'exchange_fraudulent') && data.data.signals.exchange_fraudulent !== 0 ? <span className='exchange_fraudulent' style={{ width: `${100 / data.data.riskscore * data.data.signals.exchange_fraudulent}` + '%' }} /> : null}
                        </div>
                        :
                        <div className='no_line' />
                      }

                    </AccordionSummary>
                    <AccordionDetails >
                      <div className='inner'>
                        <div className='title_score'>Low risk</div>
                        <div className='info_score'>
                          <div>
                            <div>
                              <span style={{ background: '#DEF1D6' }} />
                              <div>
                                <p>Miner</p>
                              </div>
                            </div>
                            <p>{isReady(data, 'miner') ? `${data.data.signals.miner}%` : '-'}</p>
                          </div>
                          <div>
                            <div>
                              <span style={{ background: '#B7E2A4' }} />
                              <div>
                                <p>Payment</p>
                              </div>
                            </div>
                            <p>{isReady(data, 'payment') ? `${data.data.signals.payment}%` : '-'}</p>
                          </div>
                          <div>
                            <div>
                              <span style={{ background: '#97CC77' }} />
                              <div>
                                <p>Wallet</p>
                              </div>
                            </div>
                            <p>{isReady(data, 'wallet') ? `${data.data.signals.wallet}%` : '-'}</p>
                          </div>
                          <div>
                            <div>
                              <span style={{ background: '#6DBA37' }} />
                              <div>
                                <p>Exchange</p>
                                <span>ML Risk Low</span>
                              </div>
                            </div>
                            <p>{isReady(data, 'exchange_mlrisk_low') ? `${data.data.signals.exchange_mlrisk_low}%` : '-'}</p>
                          </div>
                          <div>
                            <div>
                              <span style={{ background: '#4A9727' }} />
                              <div>
                                <p>P2P Exchange</p>
                                <span>ML Risk Low</span>
                              </div>
                            </div>
                            <p>{isReady(data, 'p2p_exchange_mlrisk_low') ? `${data.data.signals.p2p_exchange_mlrisk_low}%` : '-'}</p>
                          </div>
                        </div>

                        <div className='title_score'>Medium risk</div>
                        <div className='info_score'>
                          <div>
                            <div>
                              <span style={{ background: '#FFCD80' }} />
                              <div>
                                <p>P2P Exchange</p>
                                <span>ML Risk High</span>
                              </div>
                            </div>
                            <p>{isReady(data, 'p2p_exchange_mlrisk_high') ? `${data.data.signals.p2p_exchange_mlrisk_high}%` : '-'}</p>
                          </div>
                          <div>
                            <div>
                              <span style={{ background: '#FFA926' }} />
                              <div>
                                <p>Exchange</p>
                                <span>ML Risk Moderate</span>
                              </div>
                            </div>
                            <p>{isReady(data, 'exchange_mlrisk_moderate') ? `${data.data.signals.exchange_mlrisk_moderate}%` : '-'}</p>
                          </div>
                          <div>
                            <div>
                              <span style={{ background: '#FF8E00' }} />
                              <div>
                                <p>Exchange</p>
                                <span>ML Risk High</span>
                              </div>
                            </div>
                            <p>{isReady(data, 'exchange_mlrisk_high') ? `${data.data.signals.exchange_mlrisk_high}%` : '-'}</p>
                          </div>
                          <div>
                            <div>
                              <span style={{ background: '#F36D00' }} />
                              <div>
                                <p>Exchange</p>
                                <span>ML Risk Very High</span>
                              </div>
                            </div>
                            <p>{isReady(data, 'exchange_mlrisk_veryhigh') ? `${data.data.signals.exchange_mlrisk_veryhigh}%` : '-'}</p>
                          </div>
                        </div>

                        <div className='title_score'>Low risk</div>
                        <div className='info_score'>
                          <div>
                            <div>
                              <span style={{ background: '#E7918C' }} />
                              <div>
                                <p>Mixer</p>
                              </div>
                            </div>
                            <p>{isReady(data, 'mixer') ? `${data.data.signals.mixer}%` : '-'}</p>
                          </div>
                          <div>
                            <div>
                              <span style={{ background: '#D96761' }} />
                              <div>
                                <p>Scam</p>
                              </div>
                            </div>
                            <p>{isReady(data, 'scam') ? `${data.data.signals.scam}%` : '-'}</p>
                          </div>
                          <div>
                            <div>
                              <span style={{ background: '#C22A25' }} />
                              <div>
                                <p>Dark Market</p>
                              </div>
                            </div>
                            <p>{isReady(data, 'dark_market') ? `${data.data.signals.dark_market}%` : '-'}</p>
                          </div>
                          <div>
                            <div>
                              <span style={{ background: '#E0331A' }} />
                              <div>
                                <p>Gambling</p>
                              </div>
                            </div>
                            <p>{isReady(data, 'gambling') ? `${data.data.signals.gambling}%` : '-'}</p>
                          </div>
                          <div>
                            <div>
                              <span style={{ background: '#D2281B' }} />
                              <div>
                                <p>Exchange</p>
                                <span>Fraudulent</span>
                              </div>
                            </div>
                            <p>{isReady(data, 'exchange_fraudulent') ? `${data.data.signals.exchange_fraudulent}%` : '-'}</p>
                          </div>
                        </div>

                        <Link className='good-hover link' to={`/main/checks/risk`}>
                          <LinkIcon />How to read the risk analysis metrics
                        </Link>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </div>
              ))}
            </div>
            {risk.count > parameters.page_size && <>
              <Pagination
                active={activePage}
                pageCount={Math.ceil(risk.count / parameters.page_size)}
                onChange={(page) => setPage(page, true)}
              />
              <ToListStart element='.request_history' counter={activePage} breakpoint={null} />
            </>}
          </div>
          :
          <div className='no_items'>
            <h2>Request history</h2>
            <div>
              <NoCheckIcon />
              <span>There are no checks</span>
            </div>
          </div>
      }
    </section>
  );
};

export default RequestHistory;
