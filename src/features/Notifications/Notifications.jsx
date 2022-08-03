import React from 'react';
import TransitionedBlock from '../../shared/TransitionedBlock';
import NotificationsBlock from './NotificationsBlock/NotificationsBlock';
import { ReactComponent as BackIcon } from '../../assets/images/arrow_back_left.svg';
import './Notifications.scss';

const Notifications = (props) => {
  return (
    <TransitionedBlock className='notifications_page'>
      <div className='good-hover back'>
        <div onClick={() => props.history.length > 1 ? props.history.goBack() : props.history.push('/main/dashboard')}><BackIcon />{props.history.length > 1 ? 'Back' : 'To dashboard'}</div>
      </div>
      <NotificationsBlock history={props.history} />
    </TransitionedBlock>

  );
};

export default Notifications;
