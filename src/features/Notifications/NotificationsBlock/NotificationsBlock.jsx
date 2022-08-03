import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './NotificationsBlock.scss';
import DialogMUI from '../../../shared/DialogMUI';
import moment from 'moment';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker, } from '@material-ui/pickers';
import { ReactComponent as BackIcon } from '../../../assets/images/arrow_back_left.svg';
import { ReactComponent as AddIcon } from '../../../assets/icons/notif_add.svg';
import ButtonMUI from '../../../shared/ButtonMUI';
import { getNotifications } from '../../Dashboard/DashboardComponents/Notifications/notifyActions';
import { useInterval } from '../../../helpers/functions';

let count = 0;
let offset = 10;
let dateLimit = {
  start_date: null,
  end_date: null
};

const NotificationsBlock = ({ history }) => {
  const dispatch = useDispatch();
  const { notify: { notifications, loading }, header: { header_alert } } = useSelector(({ notify, header }) => ({ notify, header }));

  const [dialog, toggleDialog] = useState({
    status: false,
  });

  const closeDialog = () => {
    toggleDialog(prev => ({ ...prev, status: false }));
  };

  const [selectedStart, setSelectedStart] = useState(null);
  const [selectedEnd, setSelectedEnd] = useState(null);
  const [mobTopStickyPosition, setMobTopStickyPosition] = useState(66);

  const handleDateChangeStart = (date) => {
    setSelectedStart(date);
  };
  const handleDateChangeEnd = (date) => {
    setSelectedEnd(date);
  };

  const ClearDate = () => {
    setSelectedStart(null);
    setSelectedEnd(null)
  };

  const unreadMessages = (text, key) => <><div className="no_read" key={`unread_${key}`}>{text}</div><hr /></>

  const messagesBlockDate = (date, key) => <div className='time' key={`date_block_start_from_${key}`}>{moment(date).format('DD.MM.YYYY')}</div>

  useEffect(() => {
    dateLimit = {
      start_date: selectedStart,
      end_date: selectedEnd
    };
    dispatch(getNotifications(10, 0, true, dateLimit, true)).then(res => {
      if (res.payload && res.payload.status && res.payload.status === 200) {
        /* document.querySelector('.notifications_content_wrapper').scrollTo({ top: document.querySelector('.notifications_content_wrapper').scrollHeight });*/
        document.querySelector('.notifications_wrapper').scrollIntoView({ block: 'end', behavior: "smooth" });
        count = res.payload.data.count;
        offset = res.payload.data.results.length;
      }
    })
  }, [selectedStart, selectedEnd])

  useEffect(() => {
    if (!loading) {
      /* document.querySelector('.notifications_content_wrapper').scrollTo({ top: document.querySelector('.notifications_content_wrapper').scrollHeight });*/
      document.querySelector('.notifications_wrapper').scrollIntoView({ block: 'end', behavior: "smooth" });
      document.querySelector('.notifications_content_wrapper').addEventListener('scroll', ({ target }) => {
        if ((target.scrollTop + target.clientHeight) >= target.scrollHeight && count > offset) {
          //let prevScroll = target.scrollHeight;
          dispatch(getNotifications(2, offset, true, dateLimit)).then(res => {
            if (res.payload && res.payload.status && res.payload.status === 200) {
              //target.scrollTo({ top: target.scrollHeight - prevScroll })
              count = res.payload.data.count;
              offset += res.payload.data.results.length;
            }
          })
        }
      })
    }
  }, [loading])

  useEffect(() => {
    if (header_alert.id === null) {
      setMobTopStickyPosition(66);
    } else {
      document.addEventListener('scroll', () => {
        let headerSize = document.querySelector('header').getBoundingClientRect();
        setMobTopStickyPosition(headerSize.height + headerSize.top);
      })
    }
  }, [header_alert])

  useInterval(() => {
    dispatch(getNotifications(offset, 0, true, dateLimit, true))
  }, 10000)

  return (
    <div className='notifications_info_block'>
      <div className='title_page'>Notifications</div>
      <div className="title_mob" style={{ top: `${mobTopStickyPosition}px` }}>
        <div>
          <div onClick={() => history.length > 1 ? history.goBack() : history.push('/main/dashboard')}><BackIcon /></div>
          <span>{history.length > 1 ? 'Back' : 'To dashboard'}</span>
        </div>
        <div>
          <div
            className={selectedStart !== null || selectedEnd !== null ? ' active' : ''}
            onClick={() => toggleDialog({ status: true })}
          >
            <AddIcon />
          </div>
          {selectedStart !== null || selectedEnd !== null ?
            <div className="clear_mob" onClick={ClearDate}>Clear</div>
            : null
          }
        </div>
      </div>
      <div className='notifications_wrapper card-wrap'>
        <div className='title'>
          <span>Time period</span>
          <div className="datepicker">
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="dd.MM.yyyy"
                margin="normal"
                id="date-picker-inline"
                value={selectedStart}
                placeholder={'Start date'}
                onChange={handleDateChangeStart}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                maxDate={selectedEnd ? selectedEnd : moment('2100-01-01')}
                autoOk={true}
              />
            </MuiPickersUtilsProvider>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="dd.MM.yyyy"
                margin="normal"
                id="date-picker-inline"
                value={selectedEnd}
                placeholder={'End date'}
                onChange={handleDateChangeEnd}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                minDate={selectedStart ? selectedStart : moment('1900-01-01')}
                autoOk={true}
              />
            </MuiPickersUtilsProvider>
            {selectedStart !== null || selectedEnd !== null ?
              <div className='clear_desc good-hover' onClick={ClearDate}>Clear</div>
              : null
            }
          </div>
        </div>
        <div className="wrapper">
          {notifications.results && (
            <div className='notifications_content_wrapper'>
              {notifications.results.map(({ text, created_date, unread, id }, idx) => (
                <>
                  {
                    notifications.results[idx - 1]
                      ? notifications.results[idx - 1].created_date.split('T')[0] !== created_date.split('T')[0]
                        ? messagesBlockDate(created_date.split('T')[0], id)
                        : null
                      : messagesBlockDate(created_date.split('T')[0], id)
                  }
                  {/* {unread && unreadMessages('Unread messages', id)} */}
                  <div className="notifications_content" key={idx}>
                    <div
                      className='content'
                      dangerouslySetInnerHTML={{ __html: text }}
                    />
                    <div className="date">{moment(created_date).format('DD.MM.YYYY HH:mm')}</div>
                  </div>
                </>
              ))}
              {notifications.results.length === notifications.count && unreadMessages('No more notifications')}
            </div>)}
        </div>
      </div>
      <DialogMUI open={dialog.status} onClose={closeDialog}>
        <div className='dialog_notifications'>
          <div className="title_dialog">Time period</div>
          <div className="descriptions_dialog">Select a date range to view messages for that time</div>
          <div className='mob_picker'>
            <span>Start date</span>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="dd.MM.yyyy"
                margin="normal"
                id="date-picker-inline"
                value={selectedStart}
                placeholder={'Start date'}
                onChange={handleDateChangeStart}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                maxDate={selectedEnd ? selectedEnd : moment('2100-01-01')}
                autoOk={true}
              />
            </MuiPickersUtilsProvider>
          </div>
          <div className='mob_picker'>
            <span>End date</span>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="dd.MM.yyyy"
                margin="normal"
                id="date-picker-inline"
                value={selectedEnd}
                placeholder={'End date'}
                onChange={handleDateChangeEnd}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                minDate={selectedStart ? selectedStart : moment('1900-01-01')}
                autoOk={true}
              />
            </MuiPickersUtilsProvider>
          </div>

          <ButtonMUI
            disabled={!selectedStart || !selectedEnd}
            onClick={closeDialog}
            variant='contained'
            fullWidth
          >
            Apply
          </ButtonMUI>
        </div>
      </DialogMUI>
    </div>

  );
};

export default NotificationsBlock;
