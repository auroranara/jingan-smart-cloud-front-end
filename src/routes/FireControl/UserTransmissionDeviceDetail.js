import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
// import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import styles from './UserTransmissionDeviceDetail.less';

import DeviceDetailCard from './DeviceDetailCard';

@connect(({ transmission, loading }) => ({
  transmission,
  loading: loading.effects['transmission/fetchDetail'],
}))
export default class BasicProfile extends Component {
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    console.log(id);
    dispatch({
      type: 'transmission/fetchDetail',
      payload: { id },
    });
  }

  render() {
    const {
      transmission: { detailList },
      loading,
    } = this.props;
    console.log('detailList in render', detailList);
    console.log('transmission', this.props.transmission);
    const cards = detailList.map(list => (
      <DeviceDetailCard
        key={list.index}
        index={list.index}
        deviceData={list.deviceData}
        hostData={list.hostData}
      />
    ));

    return (
      <PageHeaderLayout title="用户传输装置详情页">
        <Spin spinning={loading}>{cards}</Spin>
      </PageHeaderLayout>
    );
  }
}
