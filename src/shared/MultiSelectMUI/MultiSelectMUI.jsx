import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { Input, ListItemText, MenuItem, Select, TextField } from '@material-ui/core';
import CheckboxMUI from '../CheckboxMUI';

import AutoSizer from "react-virtualized-auto-sizer";
import { List } from "react-virtualized";
import "react-virtualized/styles.css";

import './MultiSelectMUI.scss';

import { ReactComponent as ArrowIcon } from './icons/chevron-down.svg';

const searchFunc = (arr, str) =>
  str.length > 0
    ? arr.filter(el => Object.keys(el)
      .filter(elFilterStr => /* typeof elFilterStr === 'string' */elFilterStr === 'code' || elFilterStr === 'name')
      .some(elStr => el[elStr].toLowerCase().includes(str.toLowerCase()))
    )
    : arr

const MultiSelectMUI = ({
  className = '',
  items,
  label = 'Label',
  maxItems = 3,
  onChange,
  placeholder = 'Select...',
  value,
  isSearchable
}) => {
  const [inputValue, setInputVal] = useState('');
  let arr = value.length > 0
    ? [
      ...items.filter((el) => value.some(elem => el.id === elem.id)),
      ...searchFunc(items.filter((el) => !value.some(elem => el.id === elem.id)), inputValue)
    ]
    : [...searchFunc(items, inputValue)];

  function rowRenderer({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }) {
    let el = arr[index];

    return (<>
      <MenuItem className='row multi-select-mui__list' key={`${key}${value.some(elem => el.id === elem.id) ? '_selected' : ''}`} value={el} style={{ ...style }} onClick={() => onChange(el)}>
        <CheckboxMUI className='multi-select-mui__checkbox' checked={value.some(elem => el.id === elem.id)}>
          {value.some(elem => el.id === elem.id) && <span />}
        </CheckboxMUI>
        <img src={el.icon} className={`list-icon`} alt="list icon" />
        <ListItemText classes={{ primary: 'multi-select-mui__list-item' }} primary={el.name} />
      </MenuItem>
      {value.length > 0 && value.length === index && <div className='line-check row' style={{ ...style, height: '1px', width: '80%' }} key={key + 0.5} />}
    </>)
  };

  useEffect(() => {
    console.log(inputValue)
  }, [inputValue])

  return (
    <div className={`multi-select-mui${className && ` ${className}`}`}>
      {label && <label className='multi-select-mui__label'>{label}</label>}
      {value.length === 0 && <span className='multi-select-mui__placeholder'>{placeholder}</span>}
      <Select
        className='multi-select-mui__select-wrap'
        classes={{
          icon: 'multi-select-mui__icon',
          select: 'multi-select-mui__select',
        }}
        labelId='multiple-checkbox-label'
        id='multiple-checkbox'
        multiple
        value={value}
        //onChange={onChange}
        input={<Input />}
        IconComponent={ArrowIcon}
        renderValue={(selected) => {
          selected = selected.map(el => el.name);
          if (selected.length <= maxItems) {
            return selected.join(', ');
          }
          return `${[...Array(maxItems).keys()].map(el => selected[el]).join(', ')} + more ${selected.length - maxItems}`;
        }}
        MenuProps={{
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left'
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'left'
          },
          getContentAnchorEl: null,
          classes: {
            paper: `custom_multi_menu${isSearchable ? ' search_enable' : ''}`
          }
        }}
      >
        <>
          {
            isSearchable
              ? <TextField
                classes={{
                  root: 'multi_menu_search'
                }}
                placeholder={'Search'}
                onChange={({target: {value}}) => setInputVal(value)}
              />
              : null
          }
          <AutoSizer disableHeight>
            {({ width }) => (
              <List
                width={width}
                height={270}
                rowCount={arr.length}
                rowHeight={30}
                rowRenderer={rowRenderer}
              />
            )}
          </AutoSizer>
        </>
      </Select>
    </div>
  );
};

MultiSelectMUI.propTypes = {
  className: PropTypes.string,
  items: PropTypes.array.isRequired,
  label: PropTypes.string,
  maxItems: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.array.isRequired
};

export default MultiSelectMUI;
