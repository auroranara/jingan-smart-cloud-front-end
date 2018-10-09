import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Button } from 'antd';
import FooterToolbar from '@/components/FooterToolbar';
import { routerRedux } from 'dva/router';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Ellipsis from '@/components/Ellipsis';

const { Description } = DescriptionList;

/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

@connect(({ videoMonitor, loading }) => ({
  videoMonitor,
  loading: loading.models.videoMonitor,
}))
@Form.create()
export default class VideoMonitorDetail extends PureComponent {
  state = {};

  /* 生命周期函数 */
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;

    // 获取视频设备信息详情
    dispatch({
      type: 'videoMonitor/fetchVideoDetail',
      payload: {
        id,
      },
    });
  }

  // 跳转到编辑页面
  goToEdit = id => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/device-management/video-monitor/edit/${id}`));
  };

  // 渲染单位详情
  renderUnitInfo() {
    const {
      videoMonitor: {
        detail: {
          data: { deviceId, keyId, name, rtspAddress, photoAddress, isInspection, xNum, yNum },
        },
      },
    } = this.props;

    return (
      <Card title="视频设备信息详情" bordered={false}>
        <DescriptionList col={3}>
          <Description term="设备ID">{deviceId || getEmptyData()}</Description>
          <Description term="摄像头ID">{keyId || getEmptyData()}</Description>
          <Description term="视频所属区域">{name || getEmptyData()}</Description>
          <Description term="视频URL">
            <Ellipsis tooltip lines={1}>
              {rtspAddress || getEmptyData()}
            </Ellipsis>
          </Description>

          <Description term="图片地址">{photoAddress || getEmptyData()}</Description>
          <Description term="是否用于查岗">
            {isInspection === 1 ? '是' : '否' || getEmptyData()}
          </Description>
          <Description term="四色图坐标-X">{xNum || getEmptyData()}</Description>
          <Description term="四色图坐标-Y">{yNum || getEmptyData()}</Description>
        </DescriptionList>
      </Card>
    );
  }

  /* 渲染底部工具栏 */
  renderFooterToolbar() {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    return (
      <FooterToolbar>
        <Button
          size="large"
          type="primary"
          onClick={() => {
            this.goToEdit(id);
          }}
        >
          编辑
        </Button>
      </FooterToolbar>
    );
  }

  render() {
    const {
      videoMonitor: {
        detail: {
          data: { name, companyId, companyName },
        },
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
        title: '设备管理',
        name: '设备管理',
      },
      {
        title: '视频监控',
        name: '视频监控',
        href: '/device-management/video-monitor/list',
      },
      {
        title: '视频监控列表',
        name: '视频监控列表',
        href: `/device-management/video-monitor/video-equipment/${companyId}?name=${companyName}`,
      },
      {
        title: '视频设备详情',
        name: '视频设备详情',
      },
    ];
    return (
      <PageHeaderLayout title={name} breadcrumbList={breadcrumbList}>
        {this.renderUnitInfo()}
        {this.renderFooterToolbar()}
      </PageHeaderLayout>
    );
  }
}
