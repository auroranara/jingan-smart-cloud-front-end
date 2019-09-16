import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './index.less';

@connect(({ emergencyPlan, loading }) => ({
  emergencyPlan,
  loading: loading.models.emergencyPlan,
}))
export default class EmergencyPlanList extends Component {
  render() {
    const {
      emergencyPlan,
    } = this.props;

    return (
      <div>
        123
      </div>
    );
  }
}
