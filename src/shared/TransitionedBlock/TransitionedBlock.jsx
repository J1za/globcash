import React from 'react';
import PropTypes from 'prop-types';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';


import './TransitionedBlock.scss';

const TransitionedBlock = ({children, className = '', tag = 'div'}) => (
  <CSSTransitionGroup
    transitionName='block-animation'
    component={tag}
    className={className}
    transitionAppear
    transitionAppearTimeout={900}
    transitionEnterTimeout={700}
    transitionLeaveTimeout={500}
  >
    {children}
  </CSSTransitionGroup>
);

TransitionedBlock.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  tag: PropTypes.string,
};

export default TransitionedBlock;
