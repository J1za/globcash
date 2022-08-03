import React from 'react';
import PropTypes from 'prop-types';
import {CircularProgress, LinearProgress} from '@material-ui/core';

import './LoaderMUI.scss';

const LoaderMUI = ({className = '', linear = false, color = 'primary', circleSize = 40, noBg = false, onClick}) => {
  if (!linear)
    return (
      <div
        className={`circular-loader-mui${!noBg ? ' circular-loader-mui--bg' : ''}${className && ` ${className}`}`}
        onClick={onClick}
      >
        <CircularProgress
          classes={{
            root: 'circular-loader-mui__root',
            colorPrimary: 'circular-loader-mui__root--color-primary',
            colorSecondary: 'circular-loader-mui__root--color-secondary',
          }}
          color={color}
          size={circleSize}
        />
      </div>
    );

  return (
    <LinearProgress
      className={className}
      classes={{
        root: 'linear-loader-mui',
        colorPrimary: 'linear-loader-mui--bg-primary',
        colorSecondary: 'linear-loader-mui--bg-secondary',
        barColorPrimary: 'linear-loader-mui__bar-primary',
        barColorSecondary: 'linear-loader-mui__bar-secondary',
      }}
      color={color}
    />
  );
};

LoaderMUI.propTypes = {
  className: PropTypes.string,
  color: PropTypes.oneOf(['primary', 'secondary']),
  circleSize: PropTypes.number,
  linear: PropTypes.bool,
  noBg: PropTypes.bool,
  onClick: PropTypes.func,
};

export default LoaderMUI;
