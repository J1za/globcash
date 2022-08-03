import {TICKET} from './ticketActionTypes';

const INITIAL_STATE = {
  tickets: [],
  currentTicket: [],
  unreadMessages: null,
  activeTicket: null,
  chat: null,
  loading: false,
  requestError: null
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    //LOADING
    case TICKET.GET_TICKETS:
    case TICKET.DELETE_TICKET:
    case TICKET.CREATE_TICKET:
    //case TICKET.GET_SINGLE_TICKET:
    case TICKET.CLOSE_SINGLE_TICKET:
    case TICKET.OPEN_ARCHIVED_TICKET:
    case TICKET.SEND_MESSAGE:
    case TICKET.GET_MORE_CHAT_MESSAGES:
      return {...state, loading: true};

    //IF SUCCESS
    case TICKET.CREATE_TICKET_SUCCESS:
    case TICKET.DELETE_TICKET_SUCCESS:
    case TICKET.CLOSE_SINGLE_TICKET_SUCCESS:
    case TICKET.OPEN_ARCHIVED_TICKET_SUCCESS:
      return {...state, loading: false};
    case TICKET.GET_TICKETS_SUCCESS:
      let messages = action.payload.data.results;
      const sumAll = messages.map((item) => item.unread_messages_count).reduce((prev, curr) => prev + curr, 0);

      return {...state, loading: false, tickets: action.payload.data, unreadMessages: sumAll};

    case TICKET.SET_DATA_FROM_WEBSOCKET:
      return {
        ...state,
        tickets: action.message.tickets,
        unreadMessages: action.message.unread_ticket_messages,
        activeTickets: action.message.active_ticket_count
      };

    case TICKET.GET_SINGLE_TICKET_SUCCESS:
      return {...state, loading: false, currentTicket: action.payload.data, chat: action.payload.data.results};
    case TICKET.ADD_LAST_MESSAGE_SUCCESS:
      return {
        ...state,
        chat: [action.payload.config.message, ...state.chat]
      };
    case TICKET.GET_MORE_CHAT_MESSAGES_SUCCESS:
      return {
        ...state,
        loading: false,
        chat: state.chat.concat(action.payload.data.results),
        currentTicket: {
          ...action.payload.data,
          results: [...state.currentTicket.results, ...action.payload.data.results]
        }
      };

    //IF FAIL
    case TICKET.CREATE_TICKET_FAIL:
    case TICKET.GET_TICKETS_FAIL:
    case TICKET.DELETE_TICKET_FAIL:
    case TICKET.GET_SINGLE_TICKET_FAIL:
    case TICKET.CLOSE_SINGLE_TICKET_FAIL:
    case TICKET.OPEN_ARCHIVED_TICKET_FAIL:
    case TICKET.SEND_MESSAGE_FAIL:
    case TICKET.GET_MORE_CHAT_FAIL:
      return {...state, loading: false, requestError: action.error};

    default:
      return state;
  }
}
