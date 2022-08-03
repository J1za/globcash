import React, {useEffect, useState, useRef} from 'react';
import {ReactComponent as EyeOpenIcon} from './icons/eye-open.svg';
import {ReactComponent as EyeCloseIcon} from './icons/eye-close.svg';
import {InputAdornment, TextField} from '@material-ui/core';
import './InputField.scss';

const InputField = ({
  id,
  className,
  label,
  placeholder,
  type,
  defaultValue,
  value,
  name,
  helperText,
  error,
  typePassword,
  showPasswordDefault,
  onChange,
  children,
  register,
  ...props
}) => {
  const classes = ['input-field'];
  if (className) classes.push(className);
  if (error) classes.push('input-field--error');
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prevState) => !prevState);

  const refElem = useRef();

  useEffect(() => {
    if (showPasswordDefault) setShowPassword(true);
  }, []);

  return (
    <div className={classes.join(' ')}>
      <label className='input-field__label' htmlFor={id ? id : name}>
        {label}
      </label>
      <span className='input-field__inner'>
        <TextField
          id={id ? id : name}
          className='input-field__input'
          type={typePassword && !showPassword ? 'password' : type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          value={value}
          name={name}
          onChange={onChange}
          ref={refElem}
          {...props}
        ></TextField>
        {typePassword && (
          <button
            className='input-field__pass-btn'
            type='button'
            aria-label='Password visibility'
            onClick={togglePassword}
          >
            {showPassword ? <EyeOpenIcon /> : <EyeCloseIcon />}
          </button>
        )}
      </span>
      {(helperText || error) && <span className='input-field__helper'>{helperText ? helperText : error}</span>}
      {children}
    </div>
  );
};

export default InputField;
