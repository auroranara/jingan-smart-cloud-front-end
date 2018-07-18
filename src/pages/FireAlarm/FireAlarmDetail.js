import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
// import Ellipsis from 'components/Ellipsis';
import DescriptionList from 'components/DescriptionList';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import { convertMsToDate } from './AutoFireAlarm';

const { Description } = DescriptionList;

const DETAIL_ITEMS = ['name', 'time', 'code', 'failureCode', 'type', 'position', 'alarmStatus', 'hostStatus', 'operateTime', 'safetyName', 'safetyPhone'];
const DETAIL_ITEMS_CHINESE = ['单位名称', '发生时间', '主机编号', '回路故障号', '设施部件类型', '具体位置', '警情状态', '主机状态', '复位/关机时间', '安全负责人', '联系电话'];

@connect(({ fireAlarm, loading }) => ({
  fireAlarm,
  loading: loading.models.fireAlarm,
}))
export default class AutoFireAlarm extends PureComponent {
  componentDidMount() {
    const { dispatch, match: { params: { companyId, detailId } } } = this.props;
    dispatch({ type: 'fireAlarm/fetchAlarmDetail', payload: { companyId, detailId } });
  }

  render() {
    const { match: { params: { companyId } }, fireAlarm: { alarmDetail } } = this.props;

    const breadcrumbList = [
      { title: '首页', href: '/' },
      { title: '火灾自动报警系统', href: '/fire-alarm/index' },
      { title: '单位页面', href: `/fire-alarm/company/${companyId}` },
      { title: '详情信息' },
    ];

    return (
      <PageHeaderLayout title="详情信息" breadcrumbList={breadcrumbList}>
        <Card style={{ margin: '0 20%' }} title={alarmDetail.name}>
          <DescriptionList>
            {DETAIL_ITEMS.map((item, index) => (
              <Description
                term={DETAIL_ITEMS_CHINESE[index]}
                key={item}
              >
                {alarmDetail[item] === null ? '暂无信息' : item.toLowerCase().includes('time') ? convertMsToDate(alarmDetail[item]) : alarmDetail[item]}
              </Description>
            ))}
          </DescriptionList>
        </Card>
      </PageHeaderLayout>
    );
  }
}
