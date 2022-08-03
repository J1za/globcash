import PropTypes from 'prop-types';
import React from 'react';
import {KeyboardDatePicker} from '@material-ui/pickers';

import './DatePickerMUI.scss';

const DatePickerMUI = ({
                         autoOk = true,
                         className = '',
                         clearable,
                         disableFuture = false,
                         disablePast = false,
                         disableToolbar = false,
                         disabled,
                         emptyLabel = '',
                         format = 'DD/MM/YYYY',
                         inputVariant = 'outlined',
                         label,
                         maxDate,
                         maxDateMessage = 'Greater than maximum date',
                         minDate,
                         minDateMessage = 'Less minimum date',
                         onChange,
                         openTo,
                         orientation = 'portrait',
                         readOnly,
                         value,
                         variant = 'dialog',
                         views = ['year', 'month', 'date']
                       }) => {
  return (
    <KeyboardDatePicker
      autoOk={autoOk}
      className={`date-picker-mui${className && ` ${className}`}`}
      clearable={clearable}
      disableFuture={disableFuture}
      disablePast={disablePast}
      disableToolbar={disableToolbar}
      disabled={disabled}
      emptyLabel={emptyLabel}
      format={format}
      inputVariant={inputVariant}
      label={label}
      maxDate={maxDate}
      maxDateMessage={maxDateMessage}
      minDate={minDate}
      minDateMessage={minDateMessage}
      onChange={onChange}
      openTo={openTo}
      orientation={orientation}
      readOnly={readOnly}
      value={value}
      variant={variant}
      views={views}
    />
  );
};

DatePickerMUI.propTypes = {
  autoOk: PropTypes.bool,
  className: PropTypes.string,
  clearable: PropTypes.bool,
  disableFuture: PropTypes.bool,
  disablePast: PropTypes.bool,
  disableToolbar: PropTypes.bool,
  disabled: PropTypes.bool,
  emptyLabel: PropTypes.string,
  format: PropTypes.string,
  inputVariant: PropTypes.oneOf(['standard', 'outlined', 'filled']),
  label: PropTypes.string,
  maxDate: PropTypes.any,
  maxDateMessage: PropTypes.string,
  minDate: PropTypes.any,
  minDateMessage: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  openTo: PropTypes.oneOf(['date', 'year', 'month']),
  orientation: PropTypes.oneOf(['portrait', 'landscape']),
  readOnly: PropTypes.bool,
  value: PropTypes.any,
  variant: PropTypes.oneOf(['dialog', 'inline', 'static']),
  views: PropTypes.arrayOf(PropTypes.string)
};

export default DatePickerMUI;
