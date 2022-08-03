import React, { useEffect } from 'react';
import './Footer.scss';
import { Link } from 'react-router-dom';
import { ReactComponent as LogoFooterIcon } from '../../assets/images/logo_footer.svg';
import { ReactComponent as FooterIcon } from '../../assets/images/footer_icon.svg';
import { ReactComponent as FooterIconMob } from '../../assets/images/FooterIconMob.svg';
import { ReactComponent as AppleMob } from '../../assets/images/Apple icon.svg';
import { ReactComponent as PlayMob } from '../../assets/images/Play icon.svg';
import MobIcon from '../../assets/images/mob_footer_icon.png';
import { mainPath } from '../../routes/paths';
import ContactForm from '../../features/Staking/StakingPage/StakingComponents/Contact/ContactForm';
import { useToggle } from '../../helpers/hooks';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { getNews } from '../../features/News/newsActions';

const Footer = () => {
  const [dialog, toggleDialog] = useToggle();
  const { news } = useSelector(({ news }) => (news));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getNews('page_size=1'));
  }, []);

  return (
    <footer className='footer'>
      <div className="new_block">
        <div className='left'>
          <img src={MobIcon} alt="MobIcon" />
          <div>
            <span className='text'>
              Multicurrency wallet in your pocket soon <br /> We start the app in May-June 2022
            </span>
            <p></p>
          </div>
        </div>
        <div className='btn_new'>
          <button>
            <PlayMob />
            <div>
              <span>GET IT ON</span>
              <p>Google Play</p>
            </div>
          </button>

          <button>
            <AppleMob />
            <div>
              <span>Download on the</span>
              <p>App Store</p>
            </div>
          </button>
        </div>
      </div>
      <div className='footer__container'>
        <div className='footer__logo'>
          <LogoFooterIcon />
          <span>© {moment().format('YYYY')} Globix. All Rights Reserved.</span>
        </div>
        <div className='footer__nav'>
          {/* <span>Sitemap</span> */}
          <div>
            <Link className='good-hover' to={mainPath.wallets}>
              Wallets
            </Link>
            <Link className='good-hover' to={mainPath.staking}>
              Staking
            </Link>
            {/* <Link className='good-hover' to={mainPath.longInvestment}>Long investment</Link> */}
            <Link className='good-hover' to={mainPath.reports}>
              Reports
            </Link>
          </div>
          <div>
            {/* <Link className='good-hover' to={mainPath.dashboard}>Terms&Conditions</Link> */}
            <button className='good-hover' onClick={toggleDialog}>
              Help
            </button>
            <Link className='good-hover' to={mainPath.settings}>
              Settings
            </Link>
            {news?.results?.length > 0
              ? <Link className='good-hover' to={mainPath.news}>
                News
              </Link>
              : null
            }
          </div>
        </div>
        <div className='footer__telegram'>
          <span className='mob'>
            <FooterIconMob />
          </span>
          <FooterIcon />
          <div>
            <span>GlobixCash is already in Telegram!</span>
            <p>Manage finances without leaving the messenger</p>
            <a target='_blank' href='https://t.me/GlobixCashBot'>
              Open in Telegram
            </a>
          </div>
          <p>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </p>
        </div>
      </div>
      <ContactForm dialog={dialog} toggleDialog={toggleDialog} />
    </footer>
  );
};

export default Footer;
