import React from 'react';
import {Link, useLocation} from 'react-router-dom';
import {authPath} from '../../routes/paths';
import AuthRoutes from '../../routes/AuthRoutes';
import logoImg from '../../assets/images/logo_auth.svg';
import {ReactComponent as ArrowBlackIcon} from '../../assets/icons/arrow-black.svg';
import './AuthContainer.scss';

const AuthContainer = () => {
  const location = useLocation();

  return (
    <main className='auth-page'>
      <div className='auth-page__bg' />
      <div className='auth-page__logo-wrap'>
        {location.pathname === authPath.confirmation && (
          <Link className='auth-page__backlink good-hover' to={authPath.signIn} aria-label='Backlink'>
            <ArrowBlackIcon />
          </Link>
        )}
        <img className='auth-page__logo' src={logoImg} alt='Logo image' />
      </div>
      <AuthRoutes />
    </main>
  );
};

export default AuthContainer;
