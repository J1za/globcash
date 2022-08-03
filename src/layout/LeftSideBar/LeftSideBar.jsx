import React from 'react';
import Wallet from "../../features/Dashboard/DashboardComponents/Wallet"
import Notifications from "../../features/Dashboard/DashboardComponents/Notifications"
import TransitionedBlock from '../../shared/TransitionedBlock';
import Questions from '../../features/Staking/StakingPage/StakingComponents/Questions/Questions';
import { useSelector } from 'react-redux';
import Advertising from '../../features/Dashboard/DashboardComponents/Advertising';


const LeftSideBar = (props) => {

  const { location } = useSelector(({ router }) => router);

  return (
    <TransitionedBlock>
      <main className="page wallets_page">
        <div className='wrapper_left'>
          <Wallet />
          {window.innerWidth <= 1360 && <Advertising />}
          {location.pathname === "/main/wallets"
            ? window.innerWidth > 1360
              ? <Notifications />
              : null
            : <Notifications />}
        </div>
        <div className="wrapper">
          {props.children}
        </div>
        {location.pathname === "/main/wallets" && <Questions isWalletsPage />}
      </main>

    </TransitionedBlock>
  );
};

export default LeftSideBar;
