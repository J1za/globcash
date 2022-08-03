import React from 'react';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';

import './Pagination.scss';

import {ReactComponent as PrevIcon} from './icons/prev.svg';
import {ReactComponent as NextIcon} from './icons/next.svg';

const Pagination = ({active, pageCount, onChange, count, pageLength}) => {
  return (
    <div className='pagination-container'>
      <ReactPaginate
        forcePage={active}
        onPageChange={onChange}
        pageCount={pageCount}
        pageRangeDisplayed={5}
        marginPagesDisplayed={1}
        previousLabel={<PrevIcon />}
        nextLabel={<NextIcon />}
        containerClassName='pagination-list'
        pageClassName='pagination-item'
        pageLinkClassName='pagination-link'
        activeLinkClassName='pagination-link-active'
        breakClassName='pagination-ellipsis'
      />

      {pageLength && (
        <span className='pagination-container__msg'>
          Displaying page {active + 1} of {pageCount}, items {3 * (active + 1) - 2} to {3 * active + pageLength} of{' '}
          {count}
        </span>
      )}
    </div>
  );
};

Pagination.propTypes = {
  active: PropTypes.number,
  count: PropTypes.number,
  onChange: PropTypes.func,
  pageCount: PropTypes.number.isRequired,
  pageLength: PropTypes.number,
};

export default Pagination;
