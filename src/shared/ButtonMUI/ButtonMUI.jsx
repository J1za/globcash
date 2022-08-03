import React from 'react';
import {Button, CircularProgress} from '@material-ui/core';
import PropTypes from 'prop-types';

import './ButtonMUI.scss';

const ButtonMUI = ({
  children,
  className = '',
  color = 'default',
  component = 'button',
  disabled = false,
  noShadow = false,
  endIcon,
  fullWidth = false,
  href,
  size = 'medium',
  startIcon,
  variant = 'contained',
  formAction = false,
  onClick,
  loading = false,
  ...props
}) => {
  return (
    <Button
      className={className}
      classes={{
        root: 'button-mui',
        contained: 'button-mui--contained',
        containedPrimary: 'button-mui--contained-primary',
        containedSecondary: 'button-mui--contained-secondary',
        outlined: 'button-mui--outlined',
        outlinedPrimary: 'button-mui--outlined-primary',
        outlinedSecondary: 'button-mui--outlined-secondary',
        text: 'button-mui--text',
        textPrimary: 'button-mui--text-primary',
        textSecondary: 'button-mui--text-secondary',
        sizeSmall: 'button-mui--small',
        sizeLarge: 'button-mui--large',
        startIcon: 'button-mui__start-icon',
        endIcon: 'button-mui__end-icon',
      }}
      color={color}
      component={component}
      disabled={disabled}
      disableElevation={noShadow}
      endIcon={endIcon}
      fullWidth={fullWidth}
      href={href}
      size={size}
      startIcon={startIcon}
      variant={variant}
      type={formAction ? 'submit' : 'button'}
      onClick={onClick}
      {...props}
    >
      {loading ? <CircularProgress size={24} color='inherit' /> : children}
    </Button>
  );
};

ButtonMUI.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  color: PropTypes.oneOf(['default', 'primary', 'secondary']),
  component: PropTypes.elementType,
  disabled: PropTypes.bool,
  endIcon: PropTypes.node,
  formAction: PropTypes.bool,
  fullWidth: PropTypes.bool,
  href: PropTypes.string,
  loading: PropTypes.bool,
  noShadow: PropTypes.bool,
  onClick: PropTypes.func,
  size: PropTypes.oneOf(['large', 'medium', 'small']),
  startIcon: PropTypes.node,
  variant: PropTypes.oneOf(['contained', 'outlined', 'text']),
};

export default ButtonMUI;
