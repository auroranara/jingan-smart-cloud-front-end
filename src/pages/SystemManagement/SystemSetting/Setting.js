import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
// 3D地图设置
import ThreeDMap from '@/pages/BaseInfo/Company/ThreeDMap';
// 车场设置
import ParkSetting from './ParkSetting';
// 实名制设置
import RealName from './RealName';
// 人员定位设置
import PersonPosition from './PersonPosition';

export const STATUSES = [{ key: '1', value: '启用' }, { key: '0', value: '停用' }];
const listPath = '/system-management/system-setting/list';

const title = '设置页面';
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '系统管理',
    name: '系统管理',
  },
  {
    title: '系统设置',
    name: '系统设置',
    href: listPath,
  },
  {
    title,
    name: title,
  },
];
// tab列表
const tabList = [
  {
    key: '0',
    tab: '实名制设置',
  },
  {
    key: '1',
    tab: '人员定位设置',
  },
  {
    key: '2',
    tab: '3D地图设置',
  },
  {
    key: '3',
    tab: '车场设置',
  },
];

@connect(({ majorHazardInfo, user, company, loading }) => ({
  majorHazardInfo,
  user,
  company,
}))
export default class SystemSetting extends PureComponent {
  state = {
    tabActiveKey: tabList[0].key,
  };

  /* tab列表点击变化 */
  handleTabChange = key => {
    this.setState({
      tabActiveKey: key,
    });
  };

  render() {
    const {
      loading = false,
      dispatch,
      location: {
        query: { companyId },
      },
      route,
      location,
      match,
    } = this.props;
    const { tabActiveKey } = this.state;
    const sectionProps = {
      route,
      location,
      match,
      listPath,
      dispatch,
    };
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        tabList={tabList}
        onTabChange={this.handleTabChange}
        tabActiveKey={tabActiveKey}
      >
        <Spin spinning={loading}>
          <div style={{ display: tabActiveKey === tabList[0].key ? 'block' : 'none' }}>
            <RealName {...sectionProps} />
          </div>
          <div style={{ display: tabActiveKey === tabList[1].key ? 'block' : 'none' }}>
            <PersonPosition {...sectionProps} />
          </div>
          <div style={{ display: tabActiveKey === tabList[2].key ? 'block' : 'none' }}>
            <ThreeDMap
              dispatch={dispatch}
              companyId={companyId}
              data={this.props.company.map}
              prePath={listPath}
              {...sectionProps}
            />
          </div>
          <div style={{ display: tabActiveKey === tabList[3].key ? 'block' : 'none' }}>
            <ParkSetting {...sectionProps} />
          </div>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
