import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './index.less';

@connect(({ emergencyManagement, loading }) => ({
  emergencyManagement,
  loading: loading.models.emergencyManagement,
}))
export default class EmergencyEquipmentDetail extends Component {
  render() {
    const {
      emergencyManagement,
    } = this.props;

    return (
      <div>
        123
      </div>
    );
  }
}
