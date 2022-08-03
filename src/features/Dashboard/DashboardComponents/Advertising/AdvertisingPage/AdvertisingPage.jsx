import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {getAdvertisingInner} from '../advertisingActions';
import './AdvertisingPage.scss';
import {Link, useHistory} from 'react-router-dom';
import {ReactComponent as ArrowIcon} from '../../../../../assets/images/arrow_back.svg';
import {ReactComponent as TelegramIcon} from '../../../../../assets/images/Telegram.svg';
import {ReactComponent as FacebookIcon} from '../../../../../assets/images/Facebook.svg';
import {ReactComponent as TwitterIcon} from '../../../../../assets/images/Twitter.svg';
import {ReactComponent as AllSocialIcon} from '../../../../../assets/images/all_social.svg';
import {ReactComponent as CloseSocialIcon} from '../../../../../assets/images/close_social.svg';
import {ReactComponent as GIcon} from '../../../../../assets/images/G+.svg';
import Slider from 'react-slick';
import moment from 'moment';
import {PropagateLoader} from 'react-spinners';

const AdvertisingPage = ({
                           match: {
                             params: {id}
                           }
                         }) => {
  const { advertisingInner , advertisingInnerLoad } = useSelector(({ advertising }) => (advertising));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAdvertisingInner(id));
  }, [id]);

  useEffect(() => {
  }, [advertisingInner]);

  const history = useHistory();

  const handleOpen = (id) => {
    history.push(`/main/dashboard/news/${id}`);
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true
        }
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true
        }
      },
      {
        breakpoint: 450,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true
        }
      }
    ]
  };

  const [openBlock, setOpenBlock] = useState(false);

  const OpenBlock = () => {
    setOpenBlock(true);
  };
  const CloseBlock = () => {
    setOpenBlock(false);
  };
  return (
    <>
      {!advertisingInnerLoad ?
        <div className='advertising_page'>
          <div className='breadcrumbs'>
            <Link className='good-hover' to={'/main/dashboard'}>Dashboard</Link>
            <ArrowIcon/>
            <Link className='good-hover' to={'/main/dashboard/news'}>News</Link>
            <ArrowIcon/>
            <span dangerouslySetInnerHTML={{ __html: advertisingInner.title }} />
          </div>
          <div className='content'>
            <div className='icon'>
              <img src={advertisingInner.large_image} alt="image"/>
            </div>
            <div className='text_wrapper'>
              <div className="social_mob">
                <div className={openBlock ? 'btn' : 'btn open'}>
                  {openBlock ?
                    <span onClick={CloseBlock}><AllSocialIcon/></span>
                    :
                    <span onClick={OpenBlock}><CloseSocialIcon/></span>
                  }
                  <div className='social'>
                    <div>
                      <button
                        style={{ background: '#3C5B97' }}
                        onClick={() => {
                          window.open(
                            `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}&quote=${advertisingInner.title}`,
                            "_blank",
                            "width=560,height=600,scrollbars=1"
                          );
                          return false;
                        }}
                      >
                        <FacebookIcon/>
                      </button>
                      <span>share</span>
                    </div>
                    <div>
                      <button
                        style={{ background: '#45AEE4' }}
                        onClick={() => {
                          window.open(
                            `https://t.me/share/url?url=${window.location.href}&text=${advertisingInner.title}`,
                            "_blank",
                            "width=560,height=600,scrollbars=1"
                          );
                          return false;
                        }}
                      >
                        <TelegramIcon/>
                      </button>
                      <span>share</span>
                    </div>
                    <div>
                      <button
                        style={{ background: '#2AA3EF' }}
                        onClick={() => {
                          window.open(
                            `https://twitter.com/intent/tweet?text=${advertisingInner.title}&url=${window.location.href}`,
                            "_blank",
                            "width=560,height=600,scrollbars=1"
                          );
                          return false;
                        }}
                      >
                        <TwitterIcon/>
                      </button>
                      <span>share</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className='inner'>
                <div className="types">
                  {advertisingInner && advertisingInner.types && advertisingInner.types.map(({ id, name }) => (
                    <div key={id}>{name}</div>
                  ))}
                </div>
                <div className='title'>{advertisingInner.title}</div>
                <div className='info'>
                  <span>{advertisingInner.author}</span>
                  <p>{moment(advertisingInner.created_date).fromNow()}</p>
                </div>
                <div className='text' dangerouslySetInnerHTML={{ __html: advertisingInner.text }}></div>
              </div>
            </div>
          </div>
          {advertisingInner.related_posts.length < 1
            ? null
            :
          <div className='related_news'>
            <span>Related news</span>
            <Slider {...settings}>
                {advertisingInner && advertisingInner.related_posts && advertisingInner.related_posts.map(({author, id, small_image, title}) => (
                  <div className='slider_items' key={id} onClick={() => handleOpen(id)}>
                    <div className='slider_content'>
                      <div className='icon'><img src={small_image} alt="icon"/></div>
                      <div className='chapter'>{author}</div>
                      <div className='title'>{title}</div>
                    </div>
                  </div>
                ))}
              </Slider>
          </div>
          }
        </div>

        :
        <div className='load_page'>
          <PropagateLoader color={'#3579FC'} />
        </div>
      }
    </>
  );
};

export default AdvertisingPage;
