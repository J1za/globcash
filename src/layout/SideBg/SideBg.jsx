import React from 'react';
import {Link} from 'react-router-dom';
import {authPath} from '../../routes/paths';

import './SideBg.scss';

import {ReactComponent as AuthLogo} from '../../assets/images/logo.svg';

const SideBg = () => {
  return (
    <div className='side-bg'>
      <Link className='side-bg__link good-hover' to={authPath.signIn}>
        <AuthLogo className='side-bg__logo' />
      </Link>
    </div>
  );
};

export default SideBg;
