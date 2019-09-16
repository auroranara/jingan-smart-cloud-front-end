import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './index.less';

@connect(({ materials, loading }) => ({
  materials,
  loading: loading.models.materials,
}))
export default class MaterialsDetail extends Component {
  render() {
    const {
      materials,
    } = this.props;

    return (
      <div>
        123
      </div>
    );
  }
}
