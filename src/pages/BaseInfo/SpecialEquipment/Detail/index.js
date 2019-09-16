import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './index.less';

@connect(({ specialEquipment, loading }) => ({
  specialEquipment,
  loading: loading.models.specialEquipment,
}))
export default class SpecialEquipmentDetail extends Component {
  render() {
    const {
      specialEquipment,
    } = this.props;

    return (
      <div>
        123
      </div>
    );
  }
}
