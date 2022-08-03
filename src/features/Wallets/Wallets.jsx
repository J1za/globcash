import React from 'react';
import WalletValue from "./WalletsComponents/WalletValue/WalletValue"
import WalletInfo from "./WalletsComponents/WalletInfo/WalletInfo"
import Cash from "./WalletsComponents/Cash/Cash"
import LeftSideBar from '../../layout/LeftSideBar/LeftSideBar';
import './Wallets.scss';
import Notifications from '../Dashboard/DashboardComponents/Notifications';

const Wallets = () => {
  return (
    <LeftSideBar>
      <>
        <WalletInfo />
        <WalletValue />
        <Cash />
        {window.innerWidth <= 1360 && <Notifications />}

      </>
    </LeftSideBar>
  );
};

export default Wallets;
