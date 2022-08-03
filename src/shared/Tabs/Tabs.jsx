import React, {useState} from 'react';

import './Tabs.scss';

export const TabItem = (props) => <div {...props} />;

export const Tabs = ({className = '', defaultIndex = '0', onTabClick, children, changeTabIndex}) => {
  const [bindIndex, setBindIndex] = useState(defaultIndex);

  const changeTab = (newIndex) => {
    if (typeof onTabClick === 'function') onTabClick(newIndex);
    setBindIndex(newIndex);
  };

  //const items = children.filter((item) => item.type.name === 'TabItem');
  const items = children;
  //console.log(items)
  return (
    <div className={`tabs${className && ` ${className}`}`}>
      <div className='tabs__menu'>
        <div>
          {items.map(
            ({props: {index, label, hidden}}) =>
              !hidden && (
                <button
                  key={`tab-btn-${index}`}
                  className={`tabs__btn${bindIndex === index ? ' tabs__btn--active' : ''}`}
                  type='button'
                  role='tab'
                  onClick={() => {
                    changeTab(index), changeTabIndex();
                  }}
                >
                  {label}
                </button>
              )
          )}
        </div>
      </div>
      <div className='tabs__panel'>
        {items.map(({props}) =>
          bindIndex === props.index ? (
            <div
              {...props}
              key={`tab-item-${props.index}`}
              className={`tabs__item${bindIndex === props.index ? ' tabs__item--active' : ''}`}
            />
          ) : null
        )}
      </div>
    </div>
  );
};
