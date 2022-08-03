import React from 'react';
import {Switch} from '@material-ui/core';
import PropTypes from 'prop-types';

import './SwitchMUI.scss';

const SwitchMUI = ({
  className = '',
  checked,
  checkedIcon = <span className='MuiSwitch-thumb switch-mui__thumb' />,
  color = 'default',
  disabled = false,
  disableRipple = false,
  defaultChecked = false,
  edge = false,
  icon = <span className='MuiSwitch-thumb switch-mui__thumb' />,
  id,
  inputProps,
  inputRef,
  onChange,
  required = false,
  size = 'medium',
  value,
  ...props
}) => {
  return (
    <Switch
      className={className}
      classes={{
        root: 'switch-mui',
        edgeStart: 'switch-mui--edge-start',
        edgeEnd: 'switch-mui--edge-end',
        switchBase: 'switch-mui__base',
        colorPrimary: 'switch-mui__base--primary',
        colorSecondary: 'switch-mui__base--secondary',
        sizeSmall: 'switch-mui--small',
        checked: 'switch-mui__base--checked',
        disabled: 'switch-mui__base--disabled',
        input: 'switch-mui__input',
        thumb: 'switch-mui__thumb',
        track: 'switch-mui__track',
      }}
      checked={checked}
      checkedIcon={checkedIcon}
      color={color}
      disabled={disabled}
      disableRipple={disableRipple}
      defaultChecked={defaultChecked}
      edge={edge}
      icon={icon}
      id={id}
      inputProps={inputProps}
      inputRef={inputRef}
      onChange={onChange}
      required={required}
      size={size}
      value={value}
      {...props}
    />
  );
};

SwitchMUI.propTypes = {
  checked: PropTypes.bool,
  checkedIcon: PropTypes.node,
  className: PropTypes.string,
  color: PropTypes.oneOf(['default', 'primary', 'secondary']),
  defaultChecked: PropTypes.bool,
  disableRipple: PropTypes.bool,
  disabled: PropTypes.bool,
  edge: PropTypes.oneOf(['end', 'start', false]),
  icon: PropTypes.node,
  id: PropTypes.string,
  inputProps: PropTypes.object,
  inputRef: PropTypes.any,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  size: PropTypes.oneOf(['medium', 'small']),
  value: PropTypes.any,
};

export default SwitchMUI;