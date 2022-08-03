import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { mainPath } from '../../../../routes/paths';
import moment from 'moment';
import { ReactComponent as NotificationsIcon } from '../../../../assets/images/notifications.svg';
import { ReactComponent as LogoIcon } from '../../../../assets/images/logo_notif.svg';
import { ReactComponent as NoItemIcon } from '../../../../assets/images/no_notif.svg';
import { ReactComponent as OkNotify } from '../../../../assets/images/ok_notify.svg';

import './Notifications.scss';
import Slider from 'react-slick';

import { getNotifications, deleteNotifications } from './notifyActions';

const Notifications = () => {
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector(({ notify }) => notify);
  const [target, setTarget] = useState(0);

  const doRequest = () =>
    dispatch(getNotifications(2, notifications.hasOwnProperty('results') ? notifications.results.length : 0));

  const markAsRead = () => dispatch(deleteNotifications(target, notifications.results[target].id)).then((res) => {
    if (res.payload && res.payload.status && res.payload.status === 204) {
      doRequest();
    }
  });

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    adaptiveHeight: false,
    afterChange: (e) => {
      setTarget(e);
      if (e + 1 === notifications.results.length && notifications.results.length !== notifications.count) {
        doRequest();
      }
    }
  };

  useEffect(() => {
    doRequest();
  }, []);

  return (
    <section className='card-wrap notifications_block'>
      <div className='title_wrapper mb-24'>
        <div className='title'>
          <LogoIcon />
          <span>Recent notifications</span>
        </div>
        <Link className='good-hover view-all' to={mainPath.notifications}>
          <div className='notifications_block__icon'>
            <NotificationsIcon />
            {!loading && notifications.count > 0 ? <span>{notifications.count}</span> : null}
          </div>
          <span>View all</span>
        </Link>
      </div>
      {loading ? null : notifications.count > 0 ? (
        <div>
          <Slider {...settings}>
            {notifications.results &&
              notifications.results.map(({ text, created_date, id }) => (
                <div className='slider_items' key={id}>
                  <div className='slider_content'>
                    <div className={'content'} dangerouslySetInnerHTML={{ __html: text }} />
                    <div className='time'>{moment(created_date).format('DD.MM.YYYY HH:mm')}</div>
                  </div>
                </div>
              ))}
          </Slider>
          <button className={'mark-as-read'} onClick={() => markAsRead()}>
            <OkNotify />
            Mark as read
          </button>
        </div>
      ) : (
        <div className='no_items'>
          <NoItemIcon />
          <span>No notifications yet</span>
        </div>
      )}
    </section>
  );
};

export default Notifications;
