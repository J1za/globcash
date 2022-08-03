import React from 'react';
import { DialogMUI } from '../../../../shared';
import './VideoModal.scss';

const VideoModal = ({ open, close, children }) => {
  return (
    <DialogMUI open={open} onClose={close} className={'staking-video-dialog-wrapper'}>
      <div className={`dialog staking-video-dialog`}>
        {children}
      </div>
    </DialogMUI>
  );
};

export default VideoModal;
