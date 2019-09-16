import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './index.less';

@connect(({ storehouse, loading }) => ({
  storehouse,
  loading: loading.models.storehouse,
}))
export default class StorehouseDetail extends Component {
  render() {
    const {
      storehouse,
    } = this.props;

    return (
      <div>
        123
      </div>
    );
  }
}
