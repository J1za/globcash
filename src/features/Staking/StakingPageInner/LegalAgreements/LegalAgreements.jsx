import React from 'react';
import {ReactComponent as TimeIcon} from '../../../../assets/images/time_icon.svg';
import './LegalAgreements.scss';


const LegalAgreements = () => {
  return (
    <div className='legal_agreements_block'>
      <div className="title">Legal agreements</div>
      <div className="descriptions">term of deposit</div>
      <div className="time"> <TimeIcon/> 23.10.2021 - 23.04.2022</div>
      <div className="block">
        <div className='info'>
          <div>
            <span>Refill amount (USDT)</span>
            <span>1252.50 </span>
          </div>
          <div>
            <span>Rate of Interests (%)</span>
            <span>1.2% per day</span>
          </div>
          <div>
            <span>Tax (%)</span>
            <span>4,55</span>
          </div>
        </div>
        <div className='amount'>
          <span>Aggregate amount</span>
          <p>2156.54 USDT</p>
        </div>
      </div>

      {/*<div className="btn_download">*/}
      {/*  <button>*/}
      {/*    <DownloadIcon/>*/}
      {/*    Download legal contract*/}
      {/*  </button>*/}

      {/*</div>*/}
    </div>
  );
};

export default LegalAgreements;
