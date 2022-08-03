import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import DialogMUI from '../../../../../shared/DialogMUI';
import {useToggle} from '../../../../../helpers/hooks';
import {Link} from 'react-router-dom';
import moment from 'moment';
import Convert from '../../../../../helpers/Convert';
import StakingInvestDialog from '../../StakingComponents/StakingInvestDialog/StakingInvestDialog';
import {GlobixFixed} from '../../../../../helpers/functions';
import TooltipMUI from '../../../../../shared/TooltipMUI';
import {ReactComponent as BotIcon} from '../../../../../assets/images/bot.svg';
import {ReactComponent as Clock} from '../../../../../assets/images/staking_clock.svg';
import {ReactComponent as ArrowRedIcon} from '../../../../../assets/images/arrow_down_red.svg';
import {ReactComponent as ArrowGreenIcon} from '../../../../../assets/images/arrow_top_green.svg';
import {ReactComponent as AddIcon} from '../../../../../assets/images/add.svg';
import {ReactComponent as InvestmentIcon} from '../../../../../assets/images/investment_dialog.svg';
import {ReactComponent as StakingWarningIcon} from '../../../../../assets/images/staking-warning-icon.svg';
import st_bg from '../../../../../assets/images/st_bg.png';
import st_bg_mob from '../../../../../assets/images/st_bg_mob.png';
import StakingChart from '../../../../Dashboard/DashboardComponents/Staking/Charts/StakingChart';
import {mainPath} from '../../../../../routes/paths';

import './StakingBlock.scss';
import {ReactComponent as LinkIcon} from '../../../../../assets/images/link_info.svg';

export const emptyStakingDialog = (dialog, toggleDialog) => (
  <DialogMUI open={dialog} onClose={toggleDialog}>
    <div className='dialog investment_dialog'>
      <div className='title'>Investment procedure</div>
      <InvestmentIcon />
      <span style={{marginTop: '20px'}}>Please make this action using the bot.</span>
      <a target='_blank' href='https://t.me/GlobixCashBot' className='good-hover'>
        <BotIcon /> Open the bot
      </a>
    </div>
  </DialogMUI>
);

export const endDateRender = (date, isInner) =>
  !!date && (
    <div className={`date-end${isInner ? ' inner' : ''}`}>
      {isInner ? (
        <>
          <p>End date</p>
          <Clock />
          <p>{moment(date).format('DD.MM.YY')}</p>
        </>
      ) : (
        <>
          <Clock />
          <p>End date: {moment(date).format('DD.MM.YY')}</p>
        </>
      )}

      {date - Number(new Date()) < 1000 * 7 * 24 * 60 * 60 && <span className='end-in-week'>(ends in a week)</span>}
    </div>
  );

const StakingBlock = () => {
  const {
    wallets: {wallets, activeWallet},
    walletChart: {walletsInfo, loadingWallets},
    stakingPage: {transactions, stakeHistory, stakingPercents, staking_desc, staking_info},
    staking: {dashboardStaking},
    header: {
      userInfo: {verified}
    }
  } = useSelector(({stakingPage, staking, wallets, walletChart, header}) => ({
    stakingPage,
    staking,
    wallets,
    walletChart,
    header
  }));
  const [dialog, toggleDialog] = useToggle();
  const [dialogInvest, toggleDialogInvest] = useToggle();
  const [selectedLabel, setSelectedLabel] = useState();
  const [selectedStaking, setSelectedStaking] = useState();
  const [selectedWallet, setSelectedWallet] = useState();
  const [selectedStakingInfo, setSelectedStakingInfo] = useState();

  return (
    <main className='staking_block'>
      <div className='head'>
        <div className='staking_block__title'>Globix Staking is an innovative Globix automated trading system.</div>
        <div className='staking_block__descriptions'>
          We are continuosly developing the most effective automated strategies with varying degrees of risk for
          users/investors who do not have time to monitor the market. This is the easiest way to plunge into the world
          of cryptocurrencies.
        </div>
        <Link className='good-hover link' to={`/main/staking/reports`}>
          View Staking reports
        </Link>
        <img className='st_bg_mob' src={st_bg_mob} alt='' />
      </div>
      {Object.keys(dashboardStaking).length === Object.keys(stakeHistory).length && (
        <>
          <div className={`staking_block__info${verified ? '' : ' not-verified'}`}>
            {!verified && (
              <div className='staking-warning'>
                <StakingWarningIcon />
                <span>
                  Deposits in staking are available only for verified users.
                  <Link to={`${mainPath.settings}#verification`}>Verify me</Link>
                </span>
              </div>
            )}
            {Object.keys(stakeHistory).map((el, idx) => {
              let target = stakeHistory[el],
                dashboardTarget = dashboardStaking[el],
                stakeInfoTarget = Array.isArray(staking_desc)
                  ? staking_desc.find((elem) => elem.type === el)
                  : staking_desc,
                isInv = el.includes('inv'),
                currency = isInv ? el.split('inv')[1].toUpperCase() : 'USDT';
              return (
                <div className='wrapper_case' key={idx}>
                  {Number(target?.balance) !== 0 ? (
                    <Link className=' case' to={`/main/staking/${el}`}>
                      <div className='top'>
                        <div className='left'>
                          <div className='name'>
                            {stakeInfoTarget.image ? (
                              <div>
                                <img src={stakeInfoTarget.image && stakeInfoTarget.image} />
                              </div>
                            ) : null}
                            <div className='name-wrap'>
                              <span>{target.name}</span>
                              {el === 'invglbx' || el === 'trade' || el === 'stake' || el === 'inv' ? (
                                <span className={`true`}>Active</span>
                              ) : (
                                dashboardTarget.hasOwnProperty('status') && (
                                  <span className={`${dashboardTarget.status}`}>
                                    {dashboardTarget.status ? 'Active' : 'Not active'}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                          {endDateRender(dashboardTarget.close * 1000, false)}
                          <span>
                            {GlobixFixed(target.balance, 2)} {currency}
                          </span>
                          <p>{<Convert name={currency} sum={target.balance} to={'USD'} />} USD</p>
                        </div>
                        <div className='right'>
                          {Number(dashboardTarget?.balance) <= 0 ? (
                            <div className='daily'>
                              {/*{daily}*/}
                              <span>{stakeInfoTarget.interest_rate}%</span>
                              <br />
                              <p>Daily</p>
                            </div>
                          ) : stakingPercents[el === 'stake' || el === 'inv' ? 'inv' : el]?.percent > 0 ? (
                            <div className='daily'>
                              {/*{daily}*/}
                              <span>{stakingPercents[el === 'stake' || el === 'inv' ? 'inv' : el].percent}%</span>
                              <br />
                              <p>Daily</p>
                            </div>
                          ) : (
                            <div className='no_daily'>
                              <p className='blue'>Float</p>
                              <span>Interest</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className='bottom'>
                        {el === 'stake' || el === 'inv' || el === 'invglbx' || isInv ? (
                          <div className='price_first'>
                            <p>Earned yesterday:</p>
                            <div className={`${dashboardTarget.earned_yesterday < 0 ? 'red_bg' : 'green_bg'} `}>
                              {dashboardTarget.earned_yesterday >= 0 && '+'}
                              {GlobixFixed(
                                dashboardTarget.earned_yesterday,
                                el === 'invbtc' || el === 'inveth' ? 8 : 2
                              )}{' '}
                              {currency}
                            </div>
                          </div>
                        ) : (
                          <div className='price'>
                            <TooltipMUI title={'PNL per week'} position='right'>
                              <div>
                                {dashboardStaking[el].pnl_per_week_percent &&
                                dashboardStaking[el].pnl_per_week_percent !== 0 &&
                                dashboardStaking[el].pnl_per_week_percent !== undefined ? (
                                  <div
                                    className={`${
                                      dashboardStaking[el].pnl_per_week_percent < 0 ? 'red_bg' : 'green_bg'
                                    } `}
                                  >
                                    {dashboardStaking[el].pnl_per_week_percent < 0 ? (
                                      <ArrowRedIcon />
                                    ) : (
                                      <ArrowGreenIcon />
                                    )}
                                    {dashboardStaking[el].pnl_per_week_percent &&
                                      Number(dashboardStaking[el].pnl_per_week_percent).toFixed(2)}
                                    %
                                  </div>
                                ) : (
                                  <div className='grey_bg'>-%</div>
                                )}
                              </div>
                            </TooltipMUI>
                            <p>
                              {target.growth >= 0 && '+'}
                              {GlobixFixed(target.growth, 2)} {currency}
                            </p>
                          </div>
                        )}
                        <div className='chart'>
                          <StakingChart isStakePage={true} label={el} chart={target.chart} />
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <Link className='staking_no_items case' to={`/main/staking/${el}`} key={idx}>
                      <div className='inner'>
                        <div className='name'>
                          {stakeInfoTarget.image ? (
                            <div>
                              <img src={stakeInfoTarget && stakeInfoTarget.image && stakeInfoTarget.image} />
                            </div>
                          ) : null}
                          <span>{target.name}</span>
                        </div>
                        <div className='btn'>
                          {Object.keys(staking_info).includes(el) && staking_info[el].status && (
                            <button
                              className='good-hover'
                              onClick={(e) => {
                                e.preventDefault();
                                setSelectedLabel(el);
                                setSelectedStaking(staking_info[el]);
                                setSelectedStakingInfo(stakeInfoTarget);
                                setSelectedWallet(wallets[isInv ? currency.toLowerCase() : 'usdterc']);
                                toggleDialogInvest();
                              }}
                            >
                              <AddIcon />
                              <p>Invest</p>
                            </button>
                          )}
                          {Number(dashboardTarget?.balance) <= 0 ? (
                            <div>
                              <span className='blue'>{stakeInfoTarget.interest_rate}%</span>
                              <p>Interest</p>
                            </div>
                          ) : stakingPercents[el === 'stake' || el === 'inv' ? 'inv' : el]?.percent > 0 ? (
                            <div>
                              <span className='blue'>
                                {stakingPercents[el === 'stake' || el === 'inv' ? 'inv' : el].percent}%
                              </span>
                              <p>Interest</p>
                            </div>
                          ) : (
                            <div>
                              <span className='blue'>Float</span>
                              <p>Interest</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      <img className='st_bg' src={st_bg} alt='' />
      {emptyStakingDialog(dialog, toggleDialog)}

      <DialogMUI open={dialogInvest} onClose={toggleDialogInvest}>
        <StakingInvestDialog
          label={selectedLabel}
          selectedStaking={selectedStaking}
          selectedWallet={selectedWallet}
          selectedStakingInfo={selectedStakingInfo}
        />
      </DialogMUI>
    </main>
  );
};

export default StakingBlock;
