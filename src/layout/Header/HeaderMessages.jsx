import React, {useEffect, useState} from 'react';
import useWebSocket from 'react-use-websocket';
import {API_WS_URL} from '../../config';
import {NavLink} from 'react-router-dom';
import {ReactComponent as TicketIcon} from '../../assets/images/ticket_head.svg';
import {mainPath} from '../../routes/paths';
import {setSocketData} from '../../../src/features/TicketsPage/ticketActions';
import {useDispatch, useSelector} from 'react-redux';

function HeaderMessages() {
  const socketUrl = `${API_WS_URL}/ticket-list/`;
  const dispatch = useDispatch();
  const {lastJsonMessage, sendJsonMessage, getWebSocket} = useWebSocket(socketUrl, {
    onOpen: () => console.log('connected ticket'),
    onMessage: (e) => {
      //console.log(JSON.parse(e.data));
    },
    shouldReconnect: (closeEvent) => true,
    share: true,
    queryParams: {
      token: localStorage.getItem('token')
    }
  });

  const sendMSG = () => sendJsonMessage({text: 'Happy start'});

  //POLLING FUNCTION ---START

  useEffect(() => {
    const timer = setInterval(sendMSG, 2000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    !!lastJsonMessage && dispatch(setSocketData(lastJsonMessage));
  }, [lastJsonMessage]);

  //POLLING FUNCTION ---END

  return (
    <div className='header__ticket  ml-20'>
      <NavLink to={mainPath.tickets}>
        <TicketIcon />
        {lastJsonMessage && lastJsonMessage.unread_ticket_messages !== 0 && (
          <span>
            {lastJsonMessage && lastJsonMessage.unread_ticket_messages > 9
              ? '9+'
              : lastJsonMessage && lastJsonMessage.unread_ticket_messages}
          </span>
        )}
      </NavLink>
    </div>
  );
}

export default HeaderMessages;
