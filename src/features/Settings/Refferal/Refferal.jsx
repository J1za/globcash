import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from '../../../shared/Pagination';
import { getRefferals, getRefferalsStaking, getRefferalsAccruals } from '../settingsActions';
import { getDashboardStaking } from '../../Dashboard/DashboardComponents/Staking/stakingActions';
import { getDescriptions } from '../../Staking/StakingPage/StakingPageActions';
import { ReactComponent as ReffersalIcon } from '../../../assets/images/reffersal.svg';
import './Refferal.scss';

import moment from 'moment';

import { GlobixFixed, ToListStart } from '../../../helpers/functions';

const Refferal = () => {
  const dispatch = useDispatch();
  const {
    header: {
      userInfo: { telegram_id }
    },
    settings: {
      refferals: { refferals_list, accruals, staking }
    },
    staking: { dashboardStaking },
    stakingPage: { staking_desc }
  } = useSelector(({ header, settings, staking, stakingPage }) => ({ header, settings, staking, stakingPage }));

  const [tab, setTab] = useState('2');
  const [isFirst, setIsFirst] = useState(true);
  const [activePage, setActivePage] = useState(0);

  const setPage = ({ selected }, isReload) => {
    setActivePage(selected)
    if (isReload) doRequest(selected);
  };

  const doRequest = page => {
    let url = [`page=${page + 1}`];
    dispatch(getRefferalsStaking(url.join('&')))
  };

  useEffect(() => {
    if (isFirst) {
      dispatch(getDescriptions());
      //await dispatch(getRefferalsStaking());
      dispatch(getDashboardStaking(false));
      setIsFirst(false);
    };
    dispatch(getRefferalsStaking());
    //if (tab === '1') await dispatch(getRefferals());
  }, [tab])

  return !!staking_desc && Array.isArray(staking_desc) && (
    <div className='refferal_block'>
      <div className="title_block">
        <div className='title_text'>
          <span>Referral program</span>
          {/* <p>(Attracted 45 referrals)</p> */}
        </div>
      </div>
      <div className="refferal_program">
        {Object.keys(staking).length > 0 &&
          Object.keys(staking).map((el, idx) => {
            let stakeInfoTarget = el === 'inv' ? staking_desc.find(elem => elem.type === 'stake') : staking_desc.find(elem => elem.type === el);
            return (
              <div key={idx}>
                <div>
                  <span><img src={stakeInfoTarget?.image} /></span>
                  <span>{el === 'inv' ? dashboardStaking?.stake?.name : dashboardStaking[el] && dashboardStaking[el]?.name}</span>
                </div>
                <p>{GlobixFixed(staking[el].total, 2)} USDT</p>
              </div>
            )
          })}
      </div>
      <div>
        <div className="title_block">
          <div className="title_text"><span>Accruals</span></div>
        </div>
        <table className='table desc full-width'>
          <thead>
            <tr>
              <th className='w-25'>Date & time</th>
              {/* <th className='w-25'>User id</th> */}
              <th className='w-50'>Staking type</th>
              <th className='w-25'>Ammount (USDT)</th>
            </tr>
          </thead>
          {accruals && accruals.result && accruals.result.length > 0 ?
            <tbody>
              {accruals.result.map(({ time, type, amount }) => (
                <tr className='accruals_tr'>
                  <td className='w-25 date'><span>{moment(time).format('DD.MM.YYYY')}</span> <p>{moment(time).format('HH:mm')}</p></td>
                  {/* <td className='w-25 user'>
                          <span /> {number}
                        </td> */}
                  <td className='w-50'>{type === 'inv' ? dashboardStaking.stake && dashboardStaking.stake.name : dashboardStaking[type] && dashboardStaking[type].name}</td>
                  <td className='w-25'>{GlobixFixed(amount, 2)}</td>
                </tr>
              ))}
            </tbody>
            :
            <tbody>
              <tr>
                <td />
                <td className='no_items'>
                  <div>
                    <ReffersalIcon />
                    <span>No referrals found... <br />Correct your search query if it’s necessary</span>
                  </div>
                </td>
                <td />
              </tr>
            </tbody>
          }
        </table>
        <div className="mob_table">
          {accruals && accruals.result && accruals.result.length > 0 ?
            <div className='items'>
              {accruals.result.map(({ time, type, amount }) => (
                <div className='accruals_tr_mob'>
                  <div className='left'>
                    <p>{moment(time).format('DD.MM.YYYY')} {moment(time).format('HH:mm')}</p>
                    {/* <div>
                            <span />ID: {number}
                          </div> */}
                  </div>
                  <div className='right'>
                    <span>{GlobixFixed(amount, 2)} USDT</span>
                    <p>{type === 'inv' ? dashboardStaking.stake && dashboardStaking.stake.name : dashboardStaking[type] && dashboardStaking[type].name}</p>
                  </div>
                </div>
              ))}
            </div>
            :
            <div className="no_items">
              <div>
                <ReffersalIcon />
                <span>No referrals found... <br />Correct your search query if it’s necessary</span>
              </div>
            </div>
          }
        </div>
        {accruals.all_page > 1 && <>
          <Pagination
            active={activePage}
            onChange={(page) => setPage(page, true)}
            pageCount={accruals.all_page}
          />
          <ToListStart element='.refferal_block' counter={activePage} />
          </>}
      </div>

    </div>
  );
};

export default Refferal;
