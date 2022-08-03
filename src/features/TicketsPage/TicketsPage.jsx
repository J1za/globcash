import React, {useEffect, useState, useRef} from 'react';
import moment from 'moment';
import DialogMUI from '../../shared/DialogMUI';
import {ButtonMUI} from '../../shared';
import {useToggle} from '../../helpers/hooks';
import Messages from './Messages';
import * as yup from 'yup';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import InputMUI from '../../shared/InputMUI';
import useWindowDimensions from '../../helpers/useWindowDimensions';
import {ReactComponent as BackIcon} from '../../assets/images/arrow_back_left.svg';
import {ReactComponent as PlusIcon} from '../../assets/images/plus_ticket.svg';
import {ReactComponent as DeleteIcon} from '../../assets/images/delete_ticket.svg';
import {ReactComponent as WarningIcon} from '../../assets/images/warning_tickets.svg';
import {ReactComponent as VectorIcon} from '../../assets/images/Vector_tickets.svg';
import {ReactComponent as ResolvedIcon} from '../../assets/images/problem_resolved.svg';
import {ReactComponent as MassegeIcon} from '../../assets/images/no_massege.svg';
import {ReactComponent as ContentIcon} from '../../assets/images/no_content.svg';
import {ReactComponent as SendIcon} from '../../assets/images/send_chat.svg';
import {ReactComponent as AddIcon} from '../../assets/images/add_chat.svg';
import {ReactComponent as ArrowIcon} from '../../assets/images/ar_vector.svg';
import {ReactComponent as ClosedTicket} from '../../assets/images/closed.svg';
import './TicketsPage.scss';
import {useDispatch, useSelector} from 'react-redux';
import useWebSocket from 'react-use-websocket';
import {PropagateLoader} from 'react-spinners';
import {toast} from 'react-toastify';
import {API_WS_URL} from '../../config';

import {
  createTicket,
  getTicketsList,
  closeSingleTicket,
  sendFormData,
  openArchivedTicket,
  getSingleTicket,
  addMsgToChat,
  getMoreChatMessages,
  deleteTicket
} from './ticketActions';

const TicketsPage = (props) => {
  const [activeTicket, setActiveTicket] = useState({id: null, is_active: null, ticket_number: null, created_at: null});

  const socketUrl = `${API_WS_URL}/chat/${activeTicket.id}/`;
  const [buttonLoad, setButtonLoad] = useState(false);
  const [messageTXT, setMessageTXT] = useState(null);
  const [messageFILE, setMessageFILE] = useState(null);
  const [scrollTo, setScrollTo] = useState(undefined);
  const dispatch = useDispatch();
  const [openTicket, setOpenTicket] = useState(0);
  const [dialogArchive, toggleDialogArchive] = useToggle();
  const [dialogLimit, toggleDialogLimit] = useToggle();
  const [dialogDelete, toggleDialogDelete] = useState({
    status: false,
    info: {
      number: null
    }
  });

  const [parameters, setParameters] = useState({
    ticket: null,
    open: 0
  });

  const {lastJsonMessage, sendJsonMessage, getWebSocket} = useWebSocket(socketUrl, {
    onOpen: () => console.log('opened chat'),
    onMessage: (e) => {
      //console.log(JSON.parse(e.data));
    },
    shouldReconnect: (closeEvent) => true,
    share: true,
    queryParams: {
      token: localStorage.getItem('token')
    }
  });

  const {
    tickets: {tickets, currentTicket, loading, chat, activeTickets},
    header: {
      userInfo: {username}
    }
  } = useSelector(({tickets, header}) => ({tickets, header}));

  useEffect(() => lastJsonMessage && dispatch(addMsgToChat({...lastJsonMessage, client: username})), [lastJsonMessage]);

  const {width} = useWindowDimensions();
  const ref = useRef();
  const resetFiled = () => {
    ref.current.value = '';
  };

  const UseTicket = (id) => {
    setParameters({
      ...parameters,
      ticket: id === parameters.ticket ? null : id,
      open: id === parameters.open ? null : id
    });
  };

  const closeDialogDelete = () => {
    toggleDialogDelete((prev) => ({...prev, status: false}));
  };

  const AllScrollTo = (scrollTo) => setScrollTo(scrollTo);

  const handleScroll = async (e) => {
    if (e.target.scrollTop === 0 && currentTicket.next) {
      const previousHeight = e.target.scrollHeight;
      let nextUrl = currentTicket.next.split('v0/')[1];
      dispatch(getMoreChatMessages(nextUrl));
      setScrollTo(previousHeight);
    }
  };

  const resetFile = () => {
    setMessageFILE(null);
    resetFiled();
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMessageFILE(file);
    }
  };

  const onSubmit = (data) => {
    setButtonLoad(true);

    sendJsonMessage({text: messageTXT}), setMessageTXT(null);
    reset();
    if (messageFILE) {
      const formData = new FormData();
      if (messageFILE.type.split('/')[0] === 'image') {
        formData.append('admin_image', messageFILE);
      } else {
        formData.append('admin_image', messageFILE);
      }
      return dispatch(sendFormData(activeTicket.id, formData)).then((res) => {
        if (res.payload && res.payload.status && res.payload.status === 201) {
          resetFile();
          setButtonLoad(false);
          dispatch(getSingleTicket(activeTicket.id));
          reset();
        } else {
          resetFile();
          setButtonLoad(false);
          reset();
          toast.error('Что-то пошло не так. Попробуй еще раз, пожалуйста!');
        }
      });
    }
  };

  const schema = yup.object({
    text: yup.string()
  });

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: {errors, isValid}
  } = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
    shouldFocusError: true,
    defaultValues: {
      text: '',
      file: ''
    }
  });

  useEffect(() => {
    dispatch(getTicketsList());
  }, []);

  useEffect(() => {
    lastJsonMessage && setButtonLoad(false);
  }, [lastJsonMessage]);

  useEffect(() => {
    activeTicket.id !== null &&
      dispatch(getSingleTicket(activeTicket.id)).then((res) => {
        if (res.payload && res.payload.status && res.payload.status === 200) {
          //dispatch(getTicketsList());
          resetFile();
          reset();
        } else {
          Object.values(res.error.response.data)
            .flat()
            .forEach((el) => toast.error(el, {}));
        }
      });
  }, [activeTicket]);

  return (
    <section
      className={
        width > 768
          ? 'tickets_page'
          : activeTicket.id === parameters.ticket
          ? 'tickets_page use_content'
          : 'tickets_page'
      }
    >
      <div className='back'>
        <div className='good-hover' onClick={() => props.history.goBack()}>
          <BackIcon />
          Back
        </div>
      </div>
      <div className='wrapper '>
        <div className='tickets_block'>
          {loading ? (
            <PropagateLoader color={'#3579FC'} />
          ) : (
            <>
              <div className='top'>
                <div>
                  <span>Tickets</span>
                  {activeTickets && activeTickets > 0 ? (
                    <div>
                      <p />
                      {activeTickets} active
                    </div>
                  ) : null}
                </div>
                <button
                  className='good-hover'
                  onClick={() =>
                    dispatch(createTicket({source: 'web', title: 'Test ticket'})).then((res) => {
                      if (res.payload && res.payload.status && res.payload.status === 201) {
                        //dispatch(getTicketsList());
                      } else {
                        Object.values(res.error.response.data)
                          .flat()
                          .forEach((el) => toast.error(el, {}));
                      }
                    })
                  }
                >
                  <PlusIcon />
                </button>
              </div>
              {tickets && tickets.length > 0 ? (
                <div className='ticket_items '>
                  {tickets &&
                    tickets.map(
                      ({id, is_active, ticket_number, last_message, created_at, text, unread_messages_count}, idx) => (
                        <div
                          key={idx}
                          onClick={() =>
                            setActiveTicket({
                              id: id,
                              is_active: is_active,
                              ticket_number: ticket_number,
                              created_at: created_at
                            })
                          }
                          className={id === parameters.ticket ? 'use' : ''}
                        >
                          <div
                            className={is_active ? 'active' : ''}
                            key={id}
                            onClick={() => {
                              UseTicket(id);
                              setOpenTicket(idx);
                            }}
                          >
                            <div className='info_ticket'>
                              <div>
                                {is_active ? <span /> : null}№{ticket_number}
                                {!is_active ? <p>(archived)</p> : null}
                              </div>
                              <div>{moment(created_at).format('HH:mm')}</div>
                            </div>
                            {last_message.image ? (
                              <div className='text_last'>
                                <AddIcon /> Attached file
                              </div>
                            ) : last_message.text ? (
                              <div className='text_last' dangerouslySetInnerHTML={{__html: last_message.text}} />
                            ) : (
                              <div className='text_last'>Describe your problem using one or more messages</div>
                            )}
                            {unread_messages_count ? <div className='new_messages'>{unread_messages_count}</div> : null}

                            <div
                              className='delete good-hover'
                              onClick={() => {
                                toggleDialogDelete({
                                  status: true,
                                  info: {
                                    number: id
                                  }
                                });
                              }}
                            >
                              <DeleteIcon />
                            </div>
                          </div>
                        </div>
                      )
                    )}
                </div>
              ) : (
                <div className='ticket_items'>
                  <div>
                    <div className='active no_items'>
                      <div className='info_ticket'>
                        <div>
                          <span />
                          Your first ticket
                        </div>
                        <div>{moment().format('HH:mm')}</div>
                      </div>
                      <div className='text_no'>
                        Create a ticket (chat) and describe your problem using one or more messages.
                      </div>
                      <div className='text_no'>
                        <WarningIcon />
                        In order to maintain efficiency and balance the employment of managers, you can have up to 3
                        active tickets at the same time
                      </div>
                      <button
                        className='good-hover'
                        onClick={() =>
                          dispatch(createTicket({source: 'web', title: 'Test ticket'})).then((res) => {
                            if (res.payload && res.payload.status && res.payload.status === 201) {
                              //dispatch(getTicketsList());
                            } else {
                              Object.values(res.error.response.data)
                                .flat()
                                .forEach((el) => toast.error(el, {}));
                            }
                          })
                        }
                      >
                        Create a ticket
                      </button>
                    </div>
                    <span>
                      <VectorIcon />
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        {tickets && tickets.length > 0 ? (
          <div className='wrapper_content'>
            {activeTicket.id === parameters.open ? (
              <div className='chat_wrapper'>
                <div className='head_chat'>
                  <div className='left'>
                    {width < 768 && (
                      <button onClick={() => UseTicket(activeTicket.id)}>
                        <ArrowIcon />
                      </button>
                    )}
                    <span />№ {activeTicket.ticket_number}
                  </div>

                  <div className='right'>
                    {activeTicket.is_active ? (
                      <div onClick={() => toggleDialogArchive()}>
                        <ResolvedIcon />
                        {width > 768 ? 'Problem ' : ''}
                        resolved
                      </div>
                    ) : (
                      <button
                        className='delete good-hover'
                        onClick={() =>
                          toggleDialogDelete({
                            status: true,
                            info: {
                              number: activeTicket.id
                            }
                          })
                        }
                      >
                        <DeleteIcon />
                        Delete ticket
                      </button>
                    )}
                  </div>
                </div>
                <div className='messages_wrapper'>
                  {chat && chat.length <= 1 ? (
                    <>
                      <span className='messages_empty-chat'>Describe your problem using one or more messages</span>
                    </>
                  ) : (
                    <Messages
                      loading={loading}
                      tickets={tickets}
                      handleScroll={handleScroll}
                      scrollTo={scrollTo}
                      setScrollTo={AllScrollTo}
                      last_message={lastJsonMessage}
                    />
                  )}
                </div>
                {!activeTicket.is_active ? (
                  <div className='closed-ticket'>
                    <ClosedTicket />
                    <p className='closed-ticket-txt'>
                      You closed this ticket
                      <span> {moment(activeTicket.created_at).format('MMM DD, YYYY HH:mm')}</span>
                    </p>
                    <button
                      className='closed-ticket-btn'
                      onClick={() =>
                        activeTickets && activeTickets > 3
                          ? toast.error('More than 3 chats are not allowed')
                          : dispatch(openArchivedTicket(activeTicket.id)).then((res) => {
                              if (res.payload && res.payload.status && res.payload.status === 200) {
                                setActiveTicket({...activeTicket, is_active: true});
                                //dispatch(getTicketsList());
                              } else
                                Object.values(res.error.response.data)
                                  .flat()
                                  .forEach((el) => toast.error(el, {}));
                            })
                      }
                    >
                      Continue this dialogue
                    </button>
                  </div>
                ) : (
                  <form className='form' onSubmit={handleSubmit(onSubmit)}>
                    <div className='btn_controller' style={{cursor: 'pointer'}}>
                      <div className='good-hover'>
                        <div>
                          <AddIcon />
                          {messageFILE && <span>1</span>}
                        </div>
                        <input
                          className='file-input'
                          id='file-input'
                          type='file'
                          ref={ref}
                          onChange={(e) => {
                            handleFile(e);
                          }}
                          accept='image/*'
                        />
                      </div>
                    </div>
                    <div className='block'>
                      <Controller
                        name='text'
                        control={control}
                        render={({field}) => (
                          <InputMUI
                            className='auth-box__input'
                            fullWidth
                            autoComplete='off'
                            error={errors.text?.message}
                            placeholder='Enter the message...'
                            inputProps={field}
                            onChange={(e) => setMessageTXT(e.target.value)}
                          />
                        )}
                      />
                    </div>

                    <div className='btn' style={{cursor: 'pointer'}}>
                      <ButtonMUI disabled={!messageFILE && !messageTXT} loading={buttonLoad} formAction>
                        <SendIcon />
                        {width > 768 ? <span>Send</span> : null}
                      </ButtonMUI>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <div className='no_chat'>
                <MassegeIcon />
                Select a chat to start messaging
              </div>
            )}
          </div>
        ) : (
          <div className='wrapper_no_content'>
            <ContentIcon />
            No open tickets yet
          </div>
        )}
      </div>
      <DialogMUI open={dialogArchive} onClose={toggleDialogArchive}>
        <div className='tickets_dialog'>
          <div className='title '>Archive ticket</div>
          <p>
            We are glad to hear that we were able to help you. After confirmation, this ticket will be moved to the
            archive.
          </p>
          <div className='btn'>
            <ButtonMUI variant='outlined' onClick={toggleDialogArchive}>
              CANCEL
            </ButtonMUI>
            <ButtonMUI
              onClick={() =>
                dispatch(closeSingleTicket(activeTicket.id)).then((res) => {
                  if (res.payload && res.payload.status && res.payload.status === 200) {
                    toggleDialogArchive();
                    setActiveTicket({...activeTicket, is_active: false});
                    //dispatch(getTicketsList());
                  } else
                    Object.values(res.error.response.data)
                      .flat()
                      .forEach((el) => toast.error(el, {}));
                })
              }
            >
              Archive
            </ButtonMUI>
          </div>
        </div>
      </DialogMUI>
      <DialogMUI open={dialogDelete.status} onClose={() => closeDialogDelete(true)}>
        <div className='tickets_dialog'>
          <div className='title '>Delete ticket</div>
          <p>
            After confirmation, ticket <span>№{activeTicket.ticket_number}</span> and its history will be permanently
            deleted.
          </p>
          <div className='btn'>
            <ButtonMUI variant='outlined' onClick={() => closeDialogDelete(false)}>
              CANCEL
            </ButtonMUI>
            <ButtonMUI
              onClick={() =>
                dispatch(deleteTicket(activeTicket.id)).then((res) => {
                  if (res.payload && res.payload.status && res.payload.status === 200) {
                    //dispatch(getTicketsList());
                    closeDialogDelete(true);
                  } else {
                    Object.values(res.error.response.data)
                      .flat()
                      .forEach((el) => toast.error(el, {}));
                  }
                })
              }
            >
              Delete
            </ButtonMUI>
          </div>
        </div>
      </DialogMUI>
      <DialogMUI open={dialogLimit} onClose={toggleDialogLimit}>
        <div className='tickets_dialog'>
          <div className='title '>Ticket limit</div>
          <p className='mb-8'>You have reached the maximum number of simultaneously active tickets.</p>
          <p>
            Please, review your previous submissions, perhaps some of them are out of date and can be moved to the
            archive.
          </p>
          <div className='btn solo'>
            <ButtonMUI onClick={toggleDialogLimit}>Continue</ButtonMUI>
          </div>
        </div>
      </DialogMUI>
    </section>
  );
};

export default TicketsPage;
