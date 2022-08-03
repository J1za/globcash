import React, { Component } from 'react';
import { ReactComponent as ArrowDown } from '../../../../assets/images/arrow_down_top_block.svg';
import { ReactComponent as ArrowUp } from '../../../../assets/images/arrow_up_top_block.svg';
import { ReactComponent as YoutubeIcon } from '../../../../assets/images/youtube-icon.svg';
import { ReactComponent as PlusIcon } from '../../../../assets/images/rounded-plus.svg';
import { ReactComponent as InvestorDesktopFaces } from '../../../../assets/images/investor-desktop-faces.svg';
import { ReactComponent as InvestorMobileFaces } from '../../../../assets/images/investor-mobile-faces.svg';
import { ReactComponent as RateIcon } from '../../../../assets/images/rate_icon.svg';
import { ReactComponent as StakingWarningIcon } from '../../../../assets/images/staking-warning-icon.svg';
import './TopBlock.scss';
import bg from '../../../../assets/images/bg_top_block.png';
import mob_bg from '../../../../assets/images/bg_mob_top_block.png';
import { connect } from 'react-redux';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import VideoModal from './VideoModal';
import { ButtonMUI, DialogMUI } from '../../../../shared';
import StakingInvestDialog from '../../StakingPage/StakingComponents/StakingInvestDialog/StakingInvestDialog';
import { getWallets } from '../../../Dashboard/DashboardComponents/Wallet/walletActions';
import { getDescriptions } from '../../StakingPage/StakingPageActions';
import { GlobixFixed } from '../../../../helpers/functions';
import { Link } from 'react-router-dom';
import { mainPath } from '../../../../routes/paths';
class TopBlock extends Component {
  constructor(props) {
    super(props)
    this.state = {
      video: false,
      menuIsOpen: false,
      btnLoad: false,
      selectedStaking: null,
      selectedStakingInfo: null,
      selectedWallet: null,
      dialogInvest: false,
    };
    this.isInv = props.type.includes('inv');
    this.currency = this.isInv ? props.type.split('inv')[1].toUpperCase() : 'USDT';
  }

  investInit = async () => {
    const { type, getWallets, getDescriptions, staking_info } = this.props;
    this.setState(({ btnLoad }) => ({ btnLoad: !btnLoad }));
    await getWallets().then((getWalletResponse) => {
      if (getWalletResponse.payload && getWalletResponse.payload.status && getWalletResponse.payload.status === 200) {
        getDescriptions(type).then((getDescriptionsResponse) => {
          if (
            getDescriptionsResponse.payload &&
            getDescriptionsResponse.payload.status &&
            getDescriptionsResponse.payload.status === 200
          ) {
            this.setState(({ btnLoad }) => ({
              selectedStaking: staking_info[type],
              selectedStakingInfo: getDescriptionsResponse.payload.data,
              selectedWallet: getWalletResponse.payload.data[this.isInv ? this.currency.toLowerCase() : 'usdterc'],
              dialogInvest: true,
              btnLoad: !btnLoad
            }))
          }
        });
      }
    });
  };

  openMenu = () => {
    this.setState(({ menuIsOpen }) => ({
      menuIsOpen: !menuIsOpen
    }));
  };

  handleOpenMenu = () => {
    setTimeout(() => {
      this.setState({
        menuIsOpen: false
      });
    }, 100);
  };

  renderVideo = (hash) => <div className="staking-video" >
    <iframe
      width={'100%'}
      height={'100%'}
      src={`https://www.youtube.com/embed/${hash}?autoplay=1`}
      title="Presentation Globix"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  </div >

  render() {
    const {
      menuIsOpen,
      video,
      selectedStaking,
      selectedWallet,
      selectedStakingInfo,
      dialogInvest,
      btnLoad
    } = this.state;
    const {
      type,
      dashboardStaking,
      staking_desc,
      staking_info,
      stakingPercents,
      verified
    } = this.props;
    let stakeInfoTarget = Array.isArray(staking_desc) ? staking_desc.find(el => el.type === type) : staking_desc,
      dashboardTarget = dashboardStaking[type];

    return !!stakeInfoTarget && !!dashboardTarget && (
      <div className={`top_block_wrapper${Number(dashboardTarget?.balance) !== 0 ? '' : ' empty'}${!verified ? ' not-verified' : ''}`}>
        {Number(dashboardTarget?.balance) !== 0 && <>
          <img src={bg} alt="bg" className='desc_bg' />
          <img src={mob_bg} alt="bg" className='mob_bg' />
        </>}
        {!verified && <div className="staking-warning">
          <StakingWarningIcon />
          <span>
            Deposits in staking are available only for verified users.
            <Link to={`${mainPath.settings}#verification`}>Verify me</Link>
          </span>
        </div>}
        <div className="block">
          <div className='info'>
            <div>
              <p>
                <img src={stakeInfoTarget.image} />
              </p>
              <div className="name-wrap">
                <span>{stakeInfoTarget.name}</span>

                {stakeInfoTarget.type === 'invglbx' || stakeInfoTarget.type === 'trade' || stakeInfoTarget.type === 'stake' ?
                  <span className="active_status true">Active</span>
                  : dashboardTarget.hasOwnProperty('status') && (
                    <span className={`active_status ${dashboardTarget.status}`}>
                      {dashboardTarget.status ? 'Active' : 'Not active'}
                    </span>
                  )}
              </div>
            </div>
            <span>{stakeInfoTarget.title}</span>
          </div>
          <div className='text desc' >
            {stakeInfoTarget.text}
          </div>
          {menuIsOpen ? (
            <ClickAwayListener onClickAway={this.handleOpenMenu}>
              <div className='text mob' >
                {stakeInfoTarget.text}
              </div>
            </ClickAwayListener>
          ) : null}
        </div>
        <div className={`staking-video-wrapper${Number(dashboardTarget?.balance) !== 0 ? '' : ' empty'}`}>
          <div>
            {Object.keys(staking_info).includes(type)
              && staking_info[type].status
              && Number(dashboardTarget?.balance) === 0
              && window.innerWidth > 768
              && <>
                <ButtonMUI className={`invest-btn`} onClick={this.investInit} loading={btnLoad}>
                  <PlusIcon />Invest
                </ButtonMUI>
                <DialogMUI open={dialogInvest} onClose={() => this.setState(({ dialogInvest }) => ({ dialogInvest: !dialogInvest }))}>
                  <StakingInvestDialog
                    label={type}
                    selectedStaking={selectedStaking}
                    selectedWallet={selectedWallet}
                    selectedStakingInfo={selectedStakingInfo}
                  />
                </DialogMUI>
              </>}
            {stakeInfoTarget.youtube_video_id && <>
              <button className="staking-video good-hover" onClick={() => this.setState({ video: true })}>
                <YoutubeIcon />
                <span>Watch video instruction</span>
              </button>
              <VideoModal
                open={video}
                close={() => this.setState({ video: false })}
              >
                {this.renderVideo(stakeInfoTarget.youtube_video_id)}
              </VideoModal>
            </>}
          </div>
          <div>
            <div className="investors">
              {window.innerWidth <= 1024 ? <InvestorMobileFaces /> : <InvestorDesktopFaces />}
              <div>
                <span>Investors</span>
                <p>{stakeInfoTarget.investor_count}</p>
              </div>
            </div>
            <div className="rate">
              <RateIcon />
              <div>
                <span>interest rate</span>
                <p>{Number(dashboardTarget?.balance) <= 0
                  ? `${stakeInfoTarget.interest_rate}% daily`
                  : stakingPercents[type === 'stake' || type === 'inv' ? 'inv' : type]?.percent > 0
                    ? `${stakingPercents[type === 'stake' || type === 'inv' ? 'inv' : type]?.percent}% daily`
                    : 'float'}</p>
              </div>
            </div>
            {Object.keys(staking_info).includes(type)
              && staking_info[type].status
              && Number(dashboardTarget?.balance) === 0
              && window.innerWidth <= 768
              && <>
                <ButtonMUI className={`invest-btn`} onClick={this.investInit} loading={btnLoad}>
                  <PlusIcon />Invest
                </ButtonMUI>
                <DialogMUI open={dialogInvest} onClose={() => this.setState(({ dialogInvest }) => ({ dialogInvest: !dialogInvest }))}>
                  <StakingInvestDialog
                    label={type}
                    selectedStaking={selectedStaking}
                    selectedWallet={selectedWallet}
                    selectedStakingInfo={selectedStakingInfo}
                  />
                </DialogMUI>
              </>}
          </div>
        </div>
        <div className="mob_btn" onClick={this.openMenu}>
          {menuIsOpen === false ?
            <span>View description <ArrowDown /></span>
            :
            <span>Close <ArrowUp /></span>
          }
        </div>
      </div >
    );
  }
}

const mapStateToProps = ({ staking, stakingPage, header }) => {
  return {
    dashboardStaking: staking.dashboardStaking,
    staking_desc: stakingPage.staking_desc,
    staking_info: stakingPage.staking_info,
    stakingPercents: stakingPage.stakingPercents,
    verified: header.userInfo.verified
  };
};

const mapDispatchToProps = {
  getWallets,
  getDescriptions
};

export default connect(mapStateToProps, mapDispatchToProps)(TopBlock);


