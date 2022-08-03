import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdvertising } from './advertisingActions';
import { Link, useHistory } from 'react-router-dom';
import { ReactComponent as AdvertisingAllIcon } from '../../../../assets/images/advertising_all.svg';
import { ReactComponent as LinkIndicator } from '../../../../assets/images/link_indicator.svg';
import './Advertising.scss';

const Advertising = () => {
  const { advertising, advertisingLoad } = useSelector(({ advertising }) => (advertising));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAdvertising());
  }, []);

  const history = useHistory();

  const handleOpen = (id, source_link) => {
    if (source_link) {
      window.open(source_link, '_blank')
    } else {
      history.push(`dashboard/news/${id}`);
    }
  };

  return advertising?.title === '' ? null
    : (
      <div className='client_information_block card-wrap'>

        <div className='left'>
          <span>
            <img src={advertising.small_image} alt="icon" />
          </span>

          {advertising.try_now_link ?
            <a href={advertising.try_now_link} target='_blank'>
              <div>Try <br /> now</div>
            </a>
            : null
          }
        </div>
        <div className='right'>
          <div
            className="title"
            onClick={() =>
              handleOpen(advertising.id, advertising.source_link)
            }>
            {advertising.title}
            {advertising.source_link && <LinkIndicator />}
          </div>
          <div className='text'>
            <span dangerouslySetInnerHTML={{ __html: advertising.preview }} />
            <span className='good-hover link' onClick={() => handleOpen(advertising.id, advertising.source_link)}>More</span>
          </div>
          <div className='all'>
            <AdvertisingAllIcon />
            <Link className='good-hover' to={'/main/dashboard/news'}>View all news</Link>
          </div>
        </div>
      </div>
    );
};

export default Advertising;
