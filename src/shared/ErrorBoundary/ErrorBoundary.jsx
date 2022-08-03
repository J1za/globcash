import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ServerDown from '../../features/ServerDown/ServerDown'
import {API_BUILD_TYPE} from '../../config';

import './ErrorBoundary.scss';

class ErrorBoundary extends Component {
  state = {
    error: null,
    errorInfo: null,
  };

  componentDidCatch(error, errorInfo) {
    // Catch errors in any WalletsComponents below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    const {className, children} = this.props;
    const {error, errorInfo} = this.state;

    if (errorInfo) {
      return (
        <div>
          {API_BUILD_TYPE === 'PROD' ?
            <ServerDown/>
            :
            <div className={`error-boundary${className ? ` ${className}` : ''}`}>
              <h2 className='error-boundary__title'>Something went wrong!</h2>
              <details className='error-boundary__details'>
                <summary className='error-boundary__summary'>Details</summary>
                <div className='error-boundary__desc'>
                  <div className='error-boundary__desc--inner'>
                    {error && error.toString()}
                    <br />
                    {errorInfo.componentStack}
                  </div>
                </div>
              </details>
            </div>
          }
        </div>
      );
    }
    // Normally, just render children
    return children;
  }
}

ErrorBoundary.propTypes = {
  className: PropTypes.string,
};

export default ErrorBoundary;
