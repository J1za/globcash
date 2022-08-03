import React from 'react';
import PropTypes from 'prop-types';

import './NotFound.scss';

import {ReactComponent as NotFoundIcon} from './images/404-error.svg';
import {ReactComponent as BoxIcon} from './images/box.svg';

const NotFound = ({
  className = '',
  color = '',
  icon,
  noData = false,
  small = false,
  title = 'Sorry, page not found',
}) => {
  let defIcon = <NotFoundIcon className='not-found__icon' alt='Page not found picture' />;
  if (noData) {
    defIcon = <BoxIcon className='not-found__icon' alt='Empty box picture' />;
    title = 'No data';
  }

  return (
    <div className={`not-found${small ? ` not-found--small` : ''}${className && ` ${className}`}`}>
      {icon ? icon : defIcon}
      {title && <h2 className={`not-found__title${color && ` not-found__title--color-${color}`}`}>{title}</h2>}
    </div>
  );
};

NotFound.propTypes = {
  className: PropTypes.string,
  color: PropTypes.oneOf(['primary', 'secondary']),
  icon: PropTypes.node,
  noData: PropTypes.bool,
  small: PropTypes.bool,
  text: PropTypes.string,
  title: PropTypes.string,
};

export default NotFound;
