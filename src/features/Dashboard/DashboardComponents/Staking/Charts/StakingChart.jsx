import React, { Component } from 'react';
import { connect } from 'react-redux';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
import '../Staking.scss';

import { ChartGenerate } from './ChartGenerate';

class StakingChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: {}
    };
    this.setOptions = (stakingChart) => this.setState({ options: { ...ChartGenerate(props.label, props.dashboardStaking, props.chart ? props.chart : stakingChart, props.isStakePage) } })
  }

  componentDidMount() {
    this.setOptions(this.props.stakingChart);
  }

  componentDidUpdate(prevProps) {
    if (this.props.stakingChartCounter !== prevProps.stakingChartCounter) {
      this.setOptions(this.props.stakingChart);
    }
  }

  render() {
    const { options } = this.state;

    return <HighchartsReact highcharts={Highcharts} options={options} className="highchart" />
  }
};

/* const StakingChart = props => {
  return <HighchartsReact highcharts={Highcharts} options={ChartGenerate(props.label, props.dashboardStaking, props[props.chart ? 'chart' : 'stakingChart'], props.isStakePage)} className="highchart" />
} */

const mapStateToProps = ({ staking }) => {
  return {
    dashboardStaking: staking.dashboardStaking,
    stakingChart: staking.stakingChart,
    stakingChartCounter: staking.stakingChartCounter
  };
};

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(StakingChart);
