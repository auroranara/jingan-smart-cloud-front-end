import { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import router from 'umi/router';
import AssociatePersonnelPosition from './AssociatePersonnelPosition.js';
import AssociateMonitor from './AssociateMonitor.js';
import AssociateFire from './AssociateFire.js';

const title = "关联设备"
const tabList = [
  {
    key: 'fire',
    tab: '火灾报警',
  },
  {
    key: 'monitor',
    tab: '动态监测',
  },
  {
    key: 'position',
    tab: '人员定位',
  },
]

@connect(({ videoMonitor, user, loading }) => ({
  videoMonitor,
  user,
  loading: loading.effects['videoMonitor/fetchVideoBeacons'] || loading.effects['videoMonitor/fetchBindedMonitorDevice'] || loading.effects['videoMonitor/fetchBindedFireDevice'] || false,
}))
export default class AssociateDevice extends Component {

  state = {
    tabActiveKey: null, // 页头上得tab得key
  }

  componentDidMount () {
    const {
      match: { params: { type } },
    } = this.props
    this.setState({ tabActiveKey: type })
  }

  // 切换标签
  handleTabChange = tabActiveKey => {
    const {
      dispatch,
      match: { params: { id } },
      location: { query: { name, companyId } },
    } = this.props
    dispatch({
      type: 'videoMonitor/saveVideoDevice',
      payload: { list: [] },
    })
    router.push(`/device-management/video-monitor/associate/${tabActiveKey}/${id}?name=${name}&&companyId=${companyId}`)
    this.setState({ tabActiveKey })
  }

  render () {
    const {
      loading,
      match: { params: { id, type } },
      location: { query: { name, companyId } },
    } = this.props
    const { tabActiveKey } = this.state

    const breadcrumbList = [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '物联设备管理',
        name: '物联设备管理',
      },
      {
        title: '监控摄像头',
        name: '监控摄像头',
        href: '/device-management/video-monitor/list',
      },
      {
        title: '监控摄像头列表',
        name: '监控摄像头列表',
        href: `/device-management/video-monitor/video-equipment/${companyId}?name=${name}`,
      },
      {
        title,
        name: title,
      },
    ]
    const data = {
      companyId,
      id,
      name,
      type,
    }

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        tabList={tabList}
        tabActiveKey={tabActiveKey}
        onTabChange={this.handleTabChange}
      >
        <Spin spinning={loading}>
          {/* 火灾报警 */}
          {tabActiveKey === tabList[0].key && <AssociateFire data={data} />}
          {/* 动态监测 */}
          {tabActiveKey === tabList[1].key && <AssociateMonitor data={data} />}
          {/* 人员定位 */}
          {tabActiveKey === tabList[2].key && <AssociatePersonnelPosition data={data} />}
        </Spin>
      </PageHeaderLayout>
    )
  }
}
