import React, { Component } from 'react';
import { message, Spin, Card } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { connect } from 'dva';
import { NAMESPACE, MAP_API } from '../config';
import styles from './index.less';

@connect(
  (
    {
      [NAMESPACE]: { map },
      loading: {
        effects: { [MAP_API]: loading },
      },
    },
    { breadcrumbList }
  ) => ({
    map,
    loading,
    breadcrumbList,
  }),
  (dispatch, { unitId }) => ({
    getMap(payload, callback) {
      dispatch({
        type: MAP_API,
        payload: {
          companyId: unitId,
          ...payload,
        },
        callback: (success, data) => {
          if (!success) {
            message.error('获取地图数据失败，请稍后重试！');
          }
          callback && callback(success, data);
        },
      });
    },
  })
)
export default class WorkingBillList extends Component {
  componentDidMount() {
    const { getMap } = this.props;
    getMap();
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.map !== this.props.map || nextProps.loading !== this.props.loading;
  }

  render() {
    const { breadcrumbList, map, loading = false } = this.props;

    return (
      <PageHeaderLayout
        title={breadcrumbList[breadcrumbList.length - 1].title}
        breadcrumbList={breadcrumbList}
      >
        <Card className={styles.card}>123</Card>
        <Spin spinning={loading}>
          <Card className={styles.card}>123</Card>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
