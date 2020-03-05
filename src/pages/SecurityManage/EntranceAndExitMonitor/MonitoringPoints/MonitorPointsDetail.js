import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, Button } from 'antd';
import { routerRedux } from 'dva/router';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
// import Ellipsis from '@/components/Ellipsis';
const { Description } = DescriptionList;

/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

@connect(({ securityManage, loading }) => ({
  securityManage,
  loading: loading.models.securityManage,
}))
@Form.create()
export default class MonitorPointsDetail extends PureComponent {
  state = {};

  /* 生命周期函数 */
  componentDidMount() {
    const {
      dispatch,
      location: {
        query: { monitorSceneId },
      },
    } = this.props;

    // 获取设备列表
    dispatch({
      type: 'securityManage/fetchMonitorDotList',
      payload: {
        monitorSceneId: monitorSceneId,
        pageSize: 18,
        pageNum: 1,
      },
    });
  }

  // 跳转到编辑页面
  goToEdit = () => {
    const {
      dispatch,
      match: {
        params: { id },
      },
      location: {
        query: { monitorSceneId, companyName, faceDataBaseId },
      },
    } = this.props;
    dispatch(
      routerRedux.push(
        `/security-manage/entrance-and-exit-monitor/monitoring-points-edit/${id}?id=${monitorSceneId}&&faceDataBaseId=${faceDataBaseId}&&companyName=${companyName}`
      )
    );
  };

  // 渲染单位详情
  renderUnitInfo() {
    const {
      securityManage: {
        monitorDotData: { list },
      },
      match: {
        params: { id },
      },
      location: {
        query: { monitorSceneId, companyName, faceDataBaseId },
      },
    } = this.props;

    const deatilList = list.find(item => item.id === id) || {};
    const { monitorDotName, monitorDotPlace, videoCameras = [] } = deatilList;
    const number = videoCameras.map(item => item.number).join(',');
    return (
      <Card title="监测点详情" bordered={false}>
        <DescriptionList col={3}>
          <Description term="名称">{monitorDotName || getEmptyData()}</Description>
          <Description term="位置">{monitorDotPlace || getEmptyData()}</Description>
          <Description term="摄像机编号">{number || getEmptyData()}</Description>
        </DescriptionList>
        <div style={{ textAlign: 'right', marginTop: 20 }}>
          <Button type="primary" size="large" onClick={this.goToEdit}>
            编辑
          </Button>
          <Button
            size="large"
            href={`#/security-manage/entrance-and-exit-monitor/monitoring-points-list/${monitorSceneId}?faceDataBaseId=${faceDataBaseId}&&companyName=${companyName}`}
            style={{ marginLeft: '10px' }}
          >
            返回
          </Button>
        </div>
      </Card>
    );
  }

  render() {
    const {
      location: {
        query: { monitorSceneId, companyName },
      },
    } = this.props;

    //面包屑
    const breadcrumbList = [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '出入口监测',
        name: '出入口监测',
        href: '/security-manage/entrance-and-exit-monitor/company-list',
      },
      {
        title: '监测点',
        name: '监测点',
        href: `/security-manage/entrance-and-exit-monitor/monitoring-points-list/${monitorSceneId}?companyName=${companyName}`,
      },
      {
        title: '监测点详情',
        name: '监测点详情',
      },
    ];
    return (
      <PageHeaderLayout title={companyName} breadcrumbList={breadcrumbList}>
        {this.renderUnitInfo()}
      </PageHeaderLayout>
    );
  }
}
