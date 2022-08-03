import React, {Fragment, useEffect, useRef} from 'react';
import {Scrollbars} from 'react-custom-scrollbars';
import moment from 'moment';
import './Chat.scss';
import {useDispatch, useSelector} from 'react-redux';

const Messages = ({tickets, handleScroll, scrollTo, setScrollTo, last_message, loading}) => {
  const scrollbarRef = useRef(null);

  // useEffect(() => {
  //   scrollbarRef.current.scrollToBottom();
  //   document.getElementById('unread') && document.getElementById('unread').scrollIntoView();
  // }, []);

  useEffect(() => {
    scrollbarRef.current.scrollToBottom();
  }, [last_message]);

  useEffect(() => {
    !loading && tickets.previous === null && scrollbarRef.current.scrollToBottom();
  }, []);

  useEffect(() => {
    scrollbarRef.current.scrollToBottom();
    document.getElementById('unread') && document.getElementById('unread').scrollIntoView();
    setTimeout(document.getElementById('unread') && document.getElementById('unread').scrollIntoView(), 2000);
  }, [loading]);

  const handleUpdate = () => {
    if (scrollTo) {
      scrollbarRef.current.scrollTop(scrollbarRef.current.getScrollHeight() - scrollTo);
      setScrollTo(undefined);
    }
  };

  const {
    tickets: {chat},
    header: {
      userInfo: {username}
    }
  } = useSelector(({tickets, header}) => ({tickets, header}));

  return (
    <Scrollbars onScroll={handleScroll} hideTracksWhenNotNeeded ref={scrollbarRef} onUpdate={handleUpdate}>
      <div className='chat_page'>
        <div className='chat_page__messages'>
          {chat &&
            chat
              .slice(0)
              .reverse()
              .map(({id, your, text, created_at, client, image, seen, tickets}, i, arr) => {
                const lastIndex = chat.length - 1;
                const timeNow = moment(created_at).format('YYYY:MM:DD');
                let timeNext = timeNow;
                const today = moment().format('YYYY-MM-DD');
                const isToday = today === created_at;
                if (i + 1 <= lastIndex) {
                  timeNext = moment(chat[i + 1].created_at).format('YYYY:MM:DD');
                }
                let unread = chat.findIndex((el) => el.seen === true);
                if ((!unread || unread === -1) && !seen) unread = chat.length - 1;
                return (
                  <Fragment key={i}>
                    {unread !== 0 && i === unread && (
                      <div className='unread_message' id='unread'>
                        <span>New messages</span>
                      </div>
                    )}
                    {image ? (
                      <p key={id} className={client !== username ? 'message image' : 'message message--your image'}>
                        <img src={image} alt='attach' />
                        <span className='message__time'>
                          {moment(created_at).format('HH:mm')}
                          {your && <span className='message__status read' aria-label='Статус сообщения' />}
                        </span>
                      </p>
                    ) : (
                      <p key={id} className={client !== username ? 'message' : 'message message--your'}>
                        {text}
                        <span className='message__time'>
                          {moment(created_at).format('HH:mm')}
                          {your && <span className='message__status read' aria-label='Статус сообщения' />}
                        </span>
                      </p>
                    )}

                    {moment(arr[i].created_at).format('YYYY:MM:DD') !==
                    moment(arr[i - 1 < 0 ? i : i - 1].created_at).format('YYYY:MM:DD') ? (
                      <div className='time_separator'>
                        {isToday ? 'Today' : moment(created_at).format('DD.MM.YYYY')}
                      </div>
                    ) : null}
                  </Fragment>
                );
              })}
        </div>
      </div>
    </Scrollbars>
  );
};

export default Messages;
