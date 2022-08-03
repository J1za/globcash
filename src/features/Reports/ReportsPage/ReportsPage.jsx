import React from 'react';
import TransitionedBlock from '../../../shared/TransitionedBlock';
import { ReactComponent as ArrowIcon } from '../../../assets/images/arrow_back.svg';
import ReportsTable from "./ReportsTable/ReportsTable"
import './ReportsPage.scss';
import { Link } from 'react-router-dom';

const ReportsPage = () => {
  return (
    <TransitionedBlock className={'loading'}>
      <main className="page reports_page">
        <div className='breadcrumbs'>
          <Link className='good-hover' to={'/main/staking'}>Staking</Link>
          <ArrowIcon />
          <span>Reports</span>
        </div>
        <ReportsTable />
      </main>
    </TransitionedBlock>

  );
};

export default ReportsPage;
