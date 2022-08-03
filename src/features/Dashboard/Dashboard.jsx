import React from 'react';
import Table from "./DashboardComponents/Table"
import Advertising from "./DashboardComponents/Advertising"
import Staking from "./DashboardComponents/Staking"
import Investment from "./DashboardComponents/Investment"
import LeftSideBar from '../../layout/LeftSideBar/LeftSideBar';
import './Dashboard.scss';
import useWindowDimensions from '../../helpers/useWindowDimensions';

const Dashboard = () => {
  const { width } = useWindowDimensions();

  return (
    <LeftSideBar>
      <>
        <Table />
        {width > 1360 &&
          <Advertising />
        }

        <Investment />
        <Staking />
      </>
    </LeftSideBar>
  );
};

export default Dashboard;
