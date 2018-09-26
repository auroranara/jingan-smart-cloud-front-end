import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Button } from 'antd';
import FooterToolbar from '@/components/FooterToolbar';
import { routerRedux } from 'dva/router';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import codesMap from '@/utils/codes';
import { AuthButton } from '@/utils/customAuth';

const { Description } = DescriptionList;

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
  },
  {
    title: '视频监控列表',
    name: '视频监控列表',
    href: '/device-management/video-monitor/company-video/:companyId',
  },
  {
    title: '视频设备详情',
    name: '视频设备详情',
  },
];

/* 获取无数据 */
// const getEmptyData = () => {
//   return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
// };

@connect(({ videoMonitor, loading }) => ({
  videoMonitor,
  loading: loading.models.videoMonitor,
}))
@Form.create()
export default class VideoMonitorDetail extends PureComponent {
  state = {};

  /* 生命周期函数 */
  componentDidMount() {
    // const {
    //   dispatch,
    //   match: {
    //     params: { id },
    //   },
    // } = this.props;
    // // 获取视频设备信息详情
    // dispatch({});
  }

  // 跳转到编辑页面
  goToEdit = id => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/device-management/video-monitor/edit/${id}`));
  };

  // 渲染单位详情
  renderUnitInfo() {
    // const {
    //   videoMonitor: { detail: data },
    // } = this.props;

    return (
      <Card title="视频设备信息详情" bordered={false}>
        <DescriptionList col={3}>
          <Description term="设备ID" />
          <Description term="摄像头ID" />
          <Description term="视频所属区域" />
          <Description term="视频状态" />
          <Description term="视频URL" />
          <Description term="图片地址" />
          <Description term="是否用于查岗" />
          <Description term="四色图坐标-X" />
          <Description term="四色图坐标-Y" />
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
          style={{ fontSize: 20 }}
        >
          编辑
        </Button>
      </FooterToolbar>
    );
  }

  render() {
    return (
      <PageHeaderLayout title="一栋一层东南角前台" breadcrumbList={breadcrumbList}>
        {this.renderUnitInfo()}
        {this.renderFooterToolbar()}
      </PageHeaderLayout>
    );
  }
}
