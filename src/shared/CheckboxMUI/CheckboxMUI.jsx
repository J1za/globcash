import React from 'react';
import {Checkbox} from '@material-ui/core';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import PropTypes from 'prop-types';

import './CheckboxMUI.scss';

const CheckboxMUI = ({
  className = '',
  checked,
  checkedIcon = <CheckBoxIcon />,
  color = 'default',
  disabled = false,
  disableRipple = false,
  defaultChecked,
  icon = <CheckBoxOutlineBlankIcon />,
  id,
  indeterminate = false,
  indeterminateIcon = <IndeterminateCheckBoxIcon />,
  inputProps,
  inputRef,
  onChange,
  padding = false,
  required = false,
  size = 'medium',
  value,
  ...props
}) => {
  return (
    <Checkbox
      className={className}
      classes={{
        root: `checkbox-mui${padding ? ' checkbox-mui--padding' : ''}`,
        checked: 'checkbox-mui--checked',
        disabled: 'checkbox-mui--disabled',
        indeterminate: 'checkbox-mui--indeterminate',
        colorPrimary: 'checkbox-mui-color--primary',
        colorSecondary: 'checkbox-mui-color--secondary'
      }}
      checked={checked}
      checkedIcon={checkedIcon}
      color={color}
      disabled={disabled}
      disableRipple={disableRipple}
      defaultChecked={defaultChecked}
      icon={icon}
      id={id}
      indeterminate={indeterminate}
      indeterminateIcon={indeterminateIcon}
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

CheckboxMUI.propTypes = {
  checked: PropTypes.bool,
  checkedIcon: PropTypes.node,
  className: PropTypes.string,
  color: PropTypes.oneOf(['default', 'primary', 'secondary']),
  defaultChecked: PropTypes.bool,
  disableRipple: PropTypes.bool,
  disabled: PropTypes.bool,
  icon: PropTypes.node,
  id: PropTypes.string,
  indeterminate: PropTypes.bool,
  indeterminateIcon: PropTypes.node,
  inputProps: PropTypes.object,
  inputRef: PropTypes.any,
  onChange: PropTypes.func,
  padding: PropTypes.bool,
  required: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium']),
  value: PropTypes.any,
};

export default CheckboxMUI;
