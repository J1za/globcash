import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';

import './DialogMUI.scss';

import {ReactComponent as CloseIcon} from './../../assets/images/close_dialog.svg';

const DialogMUI = ({open, onClose, className = '', children, fullScreen = false}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      className={className}
      classes={{
        root: 'dialog-mui',
        paper: 'dialog-mui__paper'
      }}
      fullScreen={fullScreen}
    >
      <div className='dialog-mui__content'>
        <button onClick={onClose} className='dialog-mui__close-button' aria-label='Close dialog button'>
          <CloseIcon className='dialog-mui__close-icon' />
        </button>
        {children}
      </div>
    </Dialog>
  );
};

DialogMUI.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  fullScreen: PropTypes.bool,
  onClose: PropTypes.func,
  open: PropTypes.bool
};

export default DialogMUI;
