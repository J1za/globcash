import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';

import './IconButtonMUI.scss';

const IconButtonMUI = ({
  children,
  className = '',
  color = 'default',
  disabled = false,
  disableFocusRipple = false,
  disableRipple = false,
  edge = false,
  size = 'small',
  onClick,
}) => (
  <IconButton
    className={className}
    classes={{
      root: 'icon-button-mui',
      edgeStart: 'icon-button-mui--edge-start',
      edgeEnd: 'icon-button-mui--edge-end',
      colorPrimary: 'icon-button-mui--color-primary',
      colorSecondary: 'icon-button-mui--color-secondary',
      disabled: 'icon-button-mui--disabled',
      sizeSmall: 'icon-button-mui--size-small',
      label: 'icon-button-mui__label',
    }}
    color={color}
    disabled={disabled}
    disableFocusRipple={disableFocusRipple}
    disableRipple={disableRipple}
    edge={edge}
    size={size}
    onClick={onClick}
  >
    {children}
  </IconButton>
);

IconButtonMUI.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  color: PropTypes.oneOf(['default', 'primary', 'secondary']),
  disableFocusRipple: PropTypes.bool,
  disableRipple: PropTypes.bool,
  disabled: PropTypes.bool,
  edge: PropTypes.oneOf(['start', 'end', false]),
  onClick: PropTypes.func,
  size: PropTypes.oneOf(['small', 'medium']),
};

export default IconButtonMUI;
