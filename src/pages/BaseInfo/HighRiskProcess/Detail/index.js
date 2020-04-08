import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card } from 'antd';
import { connect } from 'dva';

import { renderSections } from '@/pages/SafetyKnowledgeBase/MSDS/utils';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { handleDetail } from '../utils';

const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '基本信息', name: '基本信息' },
  { title: '高危工艺流程', name: '高危工艺流程', href: '/major-hazard-info/high-risk-process/list' },
  { title: '详情', name: '详情' },
];

@Form.create()
@connect(({ majorHazardInfo }) => ({
  majorHazardInfo,
}))
export default class HighRiskProcessDetail extends Component {
  componentDidMount() {
    const {
      dispatch,
      match: { params: { id } },
    } = this.props;

    dispatch({
      type: 'majorHazardInfo/fetchHighRiskProcessDetail',
      payload: { id },
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
      majorHazardInfo,
    } = this.props;

    const fields = handleDetail(majorHazardInfo);
    return (
      <PageHeaderLayout title="详情" breadcrumbList={breadcrumbList}>
        <Card style={{ marginBottom: 15 }}>{renderSections(fields, getFieldDecorator)}</Card>
      </PageHeaderLayout>
    );
  }
}
