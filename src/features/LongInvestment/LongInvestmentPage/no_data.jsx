import React from 'react';

import { ReactComponent as NoLong } from '../../../assets/images/no_long.svg';

const PortfolioNoData = ({ text }) => {
    return (
        <div className="no_data">
            <NoLong />
            <span>{text ? text : 'No data'}</span>
        </div>
    );
};

export default PortfolioNoData;
