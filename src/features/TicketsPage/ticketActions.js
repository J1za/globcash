import {TICKET} from './ticketActionTypes';

// CREATE NEW TICKET

export function createTicket(data) {
  return {
    type: TICKET.CREATE_TICKET,
    payload: {
      client: 'owlab',
      request: {
        url: `/ticket/create-ticket/`,
        method: 'POST',
        data
      }
    }
  };
}

// REMOVE A SINGLE TICKET

export function deleteTicket(id) {
  return {
    type: TICKET.DELETE_TICKET,
    payload: {
      client: 'owlab',
      request: {
        url: `/ticket/delete-ticket/${id}/`,
        method: 'POST'
      }
    }
  };
}

// GET ALL TICKETS

export function getTicketsList() {
  return {
    type: TICKET.GET_TICKETS,
    payload: {
      client: 'owlab',
      request: {
        url: `/ticket/tickets-list/`,
        method: 'GET'
      }
    }
  };
}

// GET SINGLE TICKET BY ID

export function getSingleTicket(id) {
  return {
    type: TICKET.GET_SINGLE_TICKET,
    payload: {
      client: 'owlab',
      request: {
        url: `/ticket/history/${id}/`,
        method: 'GET'
      }
    }
  };
}

// CLOSE SINGLE TICKET

export function closeSingleTicket(id) {
  return {
    type: TICKET.CLOSE_SINGLE_TICKET,
    payload: {
      client: 'owlab',
      request: {
        url: `/ticket/close-ticket/${id}/`,
        method: 'POST'
      }
    }
  };
}

// OPEN ARCHIVED TICKET

export function openArchivedTicket(id) {
  return {
    type: TICKET.OPEN_ARCHIVED_TICKET,
    payload: {
      client: 'owlab',
      request: {
        url: `/ticket/open-ticket/${id}/`,
        method: 'POST'
      }
    }
  };
}

// SEND FORM DATA

export function sendFormData(id, data) {
  return {
    type: TICKET.SEND_MESSAGE,
    payload: {
      client: 'owlab',
      request: {
        url: `/ticket/${id}/attach/`,
        method: 'POST',
        data
      }
    }
  };
}

// GET MORE MESSAGES

export function getMoreChatMessages(url) {
  return {
    type: TICKET.GET_MORE_CHAT_MESSAGES,
    payload: {
      client: 'owlab',
      request: {
        url: `/${url}`,
        method: 'GET'
      }
    }
  };
}

// ADD MESSAGE TO CHAT

export function addMsgToChat(message) {
  return {
    type: TICKET.ADD_LAST_MESSAGE,
    payload: {
      client: 'owlab',
      request: {
        message
      }
    }
  };
}

// SET DATA FROM SOCKET LAST MESSAGE

export function setSocketData(message) {
  return {
    type: TICKET.SET_DATA_FROM_WEBSOCKET,
    message
  };
}
