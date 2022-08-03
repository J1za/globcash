import {Link, NavLink, useHistory} from 'react-router-dom';
import {authPath, mainPath} from '../../routes/paths';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import {ReactComponent as HeaderLogo} from '../../assets/images/logo_main.svg';
import {ReactComponent as WalletsIcon} from '../../assets/images/wallets.svg';
import {ReactComponent as StakingIcon} from '../../assets/images/staking.svg';
import {ReactComponent as InvestmentIcon} from '../../assets/images/investment.svg';
import {ReactComponent as ControlsIcon} from '../../assets/images/controls.svg';
import {ReactComponent as LogoutIcon} from '../../assets/images/logout.svg';
import {ReactComponent as BurgerIcon} from '../../assets/images/burger.svg';
import {ReactComponent as CloseBurgerIcon} from '../../assets/images/close_burger.svg';
import {ReactComponent as CheckIcon} from '../../assets/images/chechs_icon.svg';
import {ReactComponent as RocketIcon} from '../../assets/icons/rocket.svg';
import {ReactComponent as TicketIcon} from '../../assets/images/ticket_head.svg';
import './Header.scss';
import {connect} from 'react-redux';
import React, {Component, useState} from 'react';
import {getUser, logOut, getPrices, getUSDTPrice, getGLBXPrice, setPrices} from './headerActions';
import {getWallets} from '../../features/Dashboard/DashboardComponents/Wallet/walletActions';
import {getCoinCommission} from '../../features/LongInvestment/LongInvestmentPage/LongIActions';
import {GlobixFixed} from '../../helpers/functions';
import HeaderNotify from './HeaderNotify';
import HeaderMessages from './HeaderMessages';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuIsOpen: false,
      rates: []
    };
    this.navigation = [
      {
        title: 'Wallets',
        ico: <WalletsIcon className='header__icon' />,
        path: mainPath.wallets,
        isBeta: false
      },
      {
        title: 'Staking',
        ico: <StakingIcon className='header__icon' />,
        path: mainPath.staking,
        isBeta: false
      },
      {
        title: 'Long investment',
        ico: <InvestmentIcon className='header__icon' />,
        path: mainPath.longInvestment,
        isBeta: true
      },
      {
        title: 'DAO Globix',
        ico: <RocketIcon className='header__icon' />,
        path: mainPath.daoGlobix,
        isBeta: false
      },
      {
        title: 'AML scan',
        ico: <CheckIcon className='header__icon' />,
        path: mainPath.checks,
        isBeta: false
      }
    ];
  }

  componentDidMount() {
    const {location, getWallets, getUser, userInfo, getCoinCommission} = this.props;

    if (Object.keys(userInfo).length < 1) {
      getUser();
    }
    if (
      (!location.pathname.includes(mainPath.dashboard) && !location.pathname.includes(mainPath.wallets)) ||
      location.pathname.includes(mainPath.news)
    ) {
      getWallets();
    }
    getCoinCommission();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.wallets !== this.props.wallets) {
      this.props.getGLBXPrice().then((glbxRes) => {
        this.props.getPrices().then((res) => {
          if (res.payload && res.payload.status && res.payload.status === 200) {
            this.props.getUSDTPrice().then((krakenResponse) => {
              if (krakenResponse.payload && krakenResponse.payload.status && krakenResponse.payload.status === 200) {
                this.props.setPrices([
                  ...res.payload.data
                    .filter((el) =>
                      Object.keys(this.props.wallets).some(
                        (elem) => el.symbol === `${this.props.wallets[elem].short_name}USDT`
                      )
                    )
                    .map((el) => ({...el, symbol: el.symbol.replace('USDT', '')})),
                  {symbol: 'USDT', price: krakenResponse.payload.data.result.USDTZUSD.c[0]},
                  {symbol: 'GLBX', price: glbxRes.payload.data.price}
                ]);
              }
            });
          }
        });
      });
    }
    if (this.state.menuIsOpen !== prevState.menuIsOpen) {
      if (this.state.menuIsOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }

  openMenu = () => {
    this.setState(({menuIsOpen}) => ({
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

  render() {
    const {menuIsOpen} = this.state;
    const {wallets, prices} = this.props;

    return (
      <header>
        <HeaderNotify />
        <div className='market_price'>
          <div>
            <div className='market_price_wrapper'>
              <div className='title'>Market price:</div>
              <div className='price'>
                {prices.length > 0 &&
                  Object.keys(wallets).length > 0 &&
                  prices.map((el, idx) => (
                    <div key={idx}>
                      <div>
                        {wallets[Object.keys(wallets).find((elem) => wallets[elem].short_name === el.symbol)].long_name}
                      </div>
                      <span>
                        {el.symbol === 'USDT' ? '$' : ''}
                        {GlobixFixed(el.price)}
                        {el.symbol === 'USDT' ? '' : ' USDT'}
                      </span>
                      {prices.length - 1 !== idx && <p></p>}
                    </div>
                  ))}
              </div>
            </div>
            <div className='language'>
              {/*<span>Language:</span>*/}
              {/*<p>English <LanguageIcon/></p>*/}
            </div>
          </div>
        </div>

        <div className='header'>
          <div className='header__container'>
            <div className='burger good-hover' onClick={this.openMenu}>
              <BurgerIcon />
            </div>
            <div>
              <NavLink className='good-hover my-auto header_logo_nav header__nav-link' to={mainPath.dashboard}>
                <HeaderLogo className='header__logo' />
              </NavLink>
              <nav className='header__nav'>
                {this.navigation.map(({title, ico, path, isBeta}, idx) => (
                  <NavLink key={idx} className='header__nav-link' to={path}>
                    {ico} <span>{title}</span> {isBeta && <span className='beta'>Beta</span>}
                  </NavLink>
                ))}
              </nav>
            </div>
            <div>
              <div className='header__controls good-hover'>
                <Link to={mainPath.settings}>
                  <ControlsIcon />
                </Link>
              </div>
              <HeaderMessages />

              <button
                onClick={() => {
                  this.props.logOut().then((res) => {
                    if (res.payload && res.payload.status && res.payload.status === 200) {
                      localStorage.removeItem('external_token');
                      localStorage.removeItem('token');
                      this.props.history.push('/');
                    }
                  });
                }}
                className='header__logout good-hover ml-20'
              >
                <LogoutIcon />
              </button>
            </div>
          </div>
        </div>
        {menuIsOpen ? (
          <ClickAwayListener onClickAway={this.handleOpenMenu}>
            <div className='menu'>
              <div>
                <div className='menu__title'>
                  <span>Menu</span>
                  <CloseBurgerIcon onClick={this.openMenu} />
                </div>
                <nav className='menu__nav'>
                  <NavLink className='menu__nav-link' to={mainPath.wallets} onClick={this.openMenu}>
                    <WalletsIcon />
                    Wallets
                  </NavLink>
                  <NavLink className='menu__nav-link' to={mainPath.staking} onClick={this.openMenu}>
                    <StakingIcon />
                    Staking
                  </NavLink>
                  <NavLink className='menu__nav-link' to={mainPath.longInvestment} onClick={this.openMenu}>
                    <InvestmentIcon />
                    Long investment
                    <span className='beta'>Beta</span>
                  </NavLink>
                  <NavLink className='menu__nav-link' to={mainPath.daoGlobix} onClick={this.openMenu}>
                    <RocketIcon />
                    DAO Globix
                  </NavLink>
                  <NavLink className='menu__nav-link' to={mainPath.checks} onClick={this.openMenu}>
                    <CheckIcon />
                    AML scan
                  </NavLink>
                </nav>
              </div>
              <div>
                <nav className='menu__nav'>
                  <NavLink className='menu__nav-link' to={mainPath.tickets} onClick={this.openMenu}>
                    <TicketIcon />
                    Tickets
                  </NavLink>

                  <NavLink className='menu__nav-link' to={mainPath.settings} onClick={this.openMenu}>
                    <ControlsIcon />
                    Options
                  </NavLink>
                </nav>
              </div>
              <div
                className='menu__logout'
                onClick={() =>
                  this.props.logOut().then((res) => {
                    if (res.payload && res.payload.status && res.payload.status === 200) {
                      this.openMenu();
                      localStorage.removeItem('external_token');
                      localStorage.removeItem('token');
                      this.props.history.push('/');
                    }
                  })
                }
              >
                <LogoutIcon />
                Log Out
              </div>
            </div>
          </ClickAwayListener>
        ) : null}
      </header>
    );
  }
}

const mapStateToProps = ({wallets, header, router, tickets}) => {
  return {
    wallets: wallets.wallets,
    prices: header.prices,
    userInfo: header.userInfo,
    location: router.location
  };
};

const mapDispatchToProps = {
  getPrices,
  getUSDTPrice,
  getGLBXPrice,
  setPrices,
  getWallets,
  getUser,
  logOut,
  getCoinCommission
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
