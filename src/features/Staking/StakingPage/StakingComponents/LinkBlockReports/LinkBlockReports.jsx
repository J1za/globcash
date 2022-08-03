import React from 'react';
import {Link} from 'react-router-dom';
import './LinkBlockReports.scss';
import {ReactComponent as LinkIcon} from '../../../../../assets/images/st_link.svg';
import BgIcon from '../../../../../assets/images/ts_link_bg.png';

const LinkBlockReports = () => {

  return (
    <section className='link_block_reports'>
      <div className="card-wrap block">
        <div>
          <LinkIcon/>
          <div>
            <span>Staking reports</span>
            <p>Detailed reports for each period of time</p>
          </div>
        </div>
        <img src={BgIcon} alt=""/>
        <Link className='good-hover link' to={`/main/staking/reports`}>View Staking reports</Link>
      </div>
    </section>
  );
};

export default LinkBlockReports;
