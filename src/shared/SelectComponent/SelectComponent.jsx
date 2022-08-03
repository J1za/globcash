import React from 'react';
import PropTypes from 'prop-types';
import Select, {components} from 'react-select';

import './SelectComponent.scss';

import {ReactComponent as ExpandIcon} from './icons/chevron-down.svg';

export const DropdownIndicator = (props) => {
  return (
    components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        <div className={props.selectProps.menuIsOpen ? 'select-indicator indicator-active' : 'select-indicator'}>
          <ExpandIcon alt='Expand icon' />
        </div>
      </components.DropdownIndicator>
    )
  );
};

const SelectComponent = ({
  id,
  input,
  menuIsOpen,
  className = '',
  reduxForm = false,
  value,
  onKeyDown,
  options,
  loading,
  loadingMessage = 'Loading filters...',
  onChange,
  onInputChange,
  onBlur,
  placeholder,
  isClearable,
  isSearchable = false,
  withSearchIcon,
  disabled
}) => (
  <Select
    {...input}
    inputId={id}
    menuIsOpen={menuIsOpen}
    className={`select-component${isSearchable ? ' select-component--searchable' : ''}${
      withSearchIcon ? ' select-component--search-icon' : ''
    }${className && ` ${className}`}`}
    classNamePrefix='select'
    isDisabled={disabled}
    isLoading={loading}
    isClearable={isClearable}
    isSearchable={isSearchable}
    value={value}
    options={options}
    onChange={reduxForm ? (value) => input.onChange(value) : onChange}
    onInputChange={onInputChange}
    onBlur={reduxForm ? () => input.onBlur(input.value) : onBlur}
    loadingMessage={() => loadingMessage}
    placeholder={placeholder}
    onKeyDown={onKeyDown}
    components={{DropdownIndicator}}
    noOptionsMessage={() => 'No options'}
  />
);

SelectComponent.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  input: PropTypes.object,
  isClearable: PropTypes.bool,
  isSearchable: PropTypes.bool,
  loading: PropTypes.bool,
  loadingMessage: PropTypes.string,
  menuIsOpen: PropTypes.bool,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  options: PropTypes.array.isRequired,
  placeholder: PropTypes.string,
  reduxForm: PropTypes.bool,
  value: PropTypes.string,
  withSearchIcon: PropTypes.bool
};

export default SelectComponent;
