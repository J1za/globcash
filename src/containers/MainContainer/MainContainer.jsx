import React from 'react';
import Header from '../../layout/Header';
import Footer from '../../layout/Footer';
import MainRoutes from '../../routes/MainRoutes';
import {Link, useHistory} from 'react-router-dom';
import { ScrollToTop } from '../../helpers/functions';

const MainContainer = () => {
  const history = useHistory();
  return (
    <>
      <Header history={history} />
      <ScrollToTop />
      <MainRoutes />
      <Footer />
    </>
  );
};

export default MainContainer;
