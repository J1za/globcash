import {ReactComponent as Finance} from '../../../../assets/images/finance.svg';
import {ReactComponent as Exchange} from '../../../../assets/images/Exchange.svg';
import {ReactComponent as Withdrawal} from '../../../../assets/images/Withdrawal.svg';
import {ReactComponent as Send} from '../../../../assets/images/Send.svg';
import {ReactComponent as Percent} from '../../../../assets/images/percent.svg';
import {ReactComponent as FiatIcon} from '../../../../assets/images/fiat.svg';

import {ReactComponent as SortDownIcon} from '../../../../assets/images/sort_down.svg';
import {ReactComponent as SortUpIcon} from '../../../../assets/images/sort_up.svg';
import {ReactComponent as VectorIcon} from '../../../../assets/images/arrow_d.svg';

export const initialParameters = {
  page_size: 10,
  ordering: '',
  filtering: ''
};

export const optionsPage = [
  {value: 10, label: '10'},
  {value: 20, label: '20'},
  {value: 30, label: '30'},
  {value: 50, label: '50'}
];

export const sortList = [
  {
    name: (
      <>
        <span>#</span>Date & Time
      </>
    ),
    value: 'time',
    width: 30,
    addClass: 'date'
  },
  {
    name: 'Action',
    value: null,
    width: 20,
    addClass: ''
  },
  {
    name: 'Amount',
    value: 'amount',
    width: 20,
    addClass: ''
  },
  {
    name: 'Equal in $',
    value: null,
    width: 30,
    addClass: ''
  }
  //  {
  //       name: '',
  //       value: null,
  //       width: 10,
  //       addClass: ''
  //   }
];

export const renderSortList = (parameters, setParameters, selfSort) =>
  [...(selfSort ? selfSort : sortList)].map((el, idx) => (
    <th className={`w-${el.width} ${el.addClass}`}>
      {el.value === null ? (
        el.name
      ) : (
        <button
          key={idx}
          className={`good-hover sort_btn${
            el.value
              ? el.value === (parameters.ordering.includes('-') ? parameters.ordering.slice(1) : parameters.ordering)
                ? el.value === parameters.ordering
                  ? ' up'
                  : ' down'
                : ''
              : ' no-sort'
          }`}
          onClick={() =>
            el.value &&
            setParameters({
              ...parameters,
              ordering:
                el.value === (parameters.ordering.includes('-') ? parameters.ordering.slice(1) : parameters.ordering)
                  ? el.value === parameters.ordering
                    ? `-${el.value}`
                    : el.value
                  : el.value
            })
          }
        >
          {el.name}
          <div>
            <SortUpIcon className='up_icon' />
            <SortDownIcon className='up_down' />
          </div>
        </button>
      )}
    </th>
  ));

export const getIco = (type) => {
  return type.includes('fee') ? (
    <Percent />
  ) : type === 'order_out_fiat' ? (
    <FiatIcon />
  ) : type.includes('in_') ? (
    <Finance />
  ) : type === 'exchange' ? (
    <Exchange />
  ) : type === 'order_out' ? (
    <Withdrawal />
  ) : type === 'u2u' ? (
    <Send />
  ) : (
    <Percent />
  );
};

export const DropdownIndicator = (props) => {
  return (
    <DropdownIndicator {...props}>
      <VectorIcon />
    </DropdownIndicator>
  );
};
