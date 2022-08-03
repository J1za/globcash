import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from "@material-ui/core/Modal";
import { rootAuthPath } from '../../routes/paths';
import useWindowDimensions from '../../helpers/useWindowDimensions';
import { ReactComponent as YouTubeIcon } from '../../assets/icons/youtube.svg';
import { ReactComponent as AuthIcon } from '../../assets/icons/stub-auth.svg';
import { ReactComponent as TextIcon } from '../../assets/images/stub_text.svg';
import { ReactComponent as LogoIcon } from '../../assets/images/logo_stub.svg';
import { ReactComponent as TextMobIcon } from '../../assets/images/stub_text_mob.svg';
import ImageStub from '../../assets/images/stub-img.png';
import './StubPage.scss';

const StubPage = () => {
  const [open, setOpen] = useState(false);
  const handleOpenClose = () => setOpen(!open);
  const {width} = useWindowDimensions();

  return (
    <section className='stub'>
      <div className="stub__inner">
        <div className="stub__info">

          <div className="stub__info-logo">
            <LogoIcon/>
            {width > 768 ?
              <TextIcon/>
              :
              <TextMobIcon/>
            }

          </div>
          <Link to={rootAuthPath} className="stub__info-auth">
            <AuthIcon />
          </Link>
          <h2>Start Globix 2.0 January - March 2022</h2>
          <h1>Globix 2.0 opens horizons</h1>
          <ul className='stub__list'>
            <li><span>More than 7000 successful trading sessions</span></li>
            <li><span>Active clients 2 500</span></li>
            <li><span>More than 26 million USDT dividends paid in 2021</span></li>
          </ul>
          <div className="stub__video">
            <div className="stub__video-play" onClick={handleOpenClose}>
              <span></span>
              <YouTubeIcon />
            </div>
            <Modal
              open={open}
              onClose={handleOpenClose}
            >
              <iframe className="stub__video-iframe" src="https://www.youtube-nocookie.com/embed/XSiEJmRy1HY?controls=0&autoplay=1" title="Presentation Globix" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </Modal>
            <p>Presentation</p>
          </div>
          <Link to={rootAuthPath} className="stub__auth">
            <p>Log In / Sign Up</p>
          </Link>
          <div >
          </div>
        </div>
        <div className="stub__image">
          <img src={ImageStub} />
        </div>
      </div>

      <div className="stub__footerText">
        <p>Globix Cash as a software product is the property of BVI Miracle World Ventures Ltd. And acts on the basis of the laws of the registered jurisdiction.</p>
        <p>All rights to this product are reserved and belong to BVI Miracle World Ventures Ltd.</p>
        <p className="stub__copyright">© 2022 «Globix» All rights reserved</p>
      </div>
    </section>
  );
};

export default StubPage;
