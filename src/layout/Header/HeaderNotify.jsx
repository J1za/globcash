import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { mainPath } from '../../routes/paths';
import { ReactComponent as CloseIcon } from '../../assets/images/close_not.svg';
import { ReactComponent as QuestionIcon } from '../../assets/images/question.svg';

import './Header.scss';

import { API_WS_URL } from '../../config';
import useWebSocket from 'react-use-websocket';
import { setAlert } from './headerActions';

//const ws = new WebSocket(`${API_WS_URL}/notifications/?token=${localStorage.getItem('token')}`);

const HeaderNotify = () => {
  const dispatch = useDispatch();
  const { header_alert } = useSelector(({ header }) => header);
  const socketUrl = `${API_WS_URL}/notifications/`;

  useWebSocket(socketUrl, {
    onOpen: () => console.log('opened'),
    onMessage: e => dispatch(setAlert({ ...JSON.parse(e.data) })),
    shouldReconnect: (closeEvent) => true,
    queryParams: {
      token: localStorage.getItem('token')
    }
  });

  return header_alert.id === null ? null : (
    <div className={`notifications_headers`}>
      <div>
        <QuestionIcon />
        <div className="text">
          {header_alert.text}
        </div>
      </div>
      <div>
        {window.location.pathname !== mainPath.notifications &&
          <Link className='good-hover view-all' to={mainPath.notifications}>
            See more
          </Link>
        }
        <button className='close good-hover' onClick={() => dispatch(setAlert({ id: null, text: '' }))}><CloseIcon /></button>
      </div>
    </div>
  );
};

export default HeaderNotify;
