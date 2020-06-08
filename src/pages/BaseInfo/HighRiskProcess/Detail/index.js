import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Card } from 'antd';
import { connect } from 'dva';

import { renderSections } from '@/pages/SafetyKnowledgeBase/MSDS/utils';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { handleDetail } from '../utils';
import router from 'umi/router';

const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '基本信息', name: '基本信息' },
  { title: '工艺流程', name: '工艺流程', href: '/major-hazard-info/high-risk-process/list' },
  { title: '详情', name: '详情' },
];

@Form.create()
@connect(({ majorHazardInfo, user }) => ({
  majorHazardInfo,
  user,
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

  handleEdit = () => {
    const { match: { params: { id } } } = this.props;
    router.push(`/major-hazard-info/high-risk-process/edit/${id}`);
  };

  goBack = () => {
    window.close();
  };

  render() {
    const {
      user: { isCompany },
      form: { getFieldDecorator },
      majorHazardInfo,
    } = this.props;

    const fields = handleDetail(majorHazardInfo, isCompany);
    return (
      <PageHeaderLayout title="详情" breadcrumbList={breadcrumbList}>
        <Card style={{ marginBottom: 15 }}>
          {renderSections(fields, getFieldDecorator)}
          <div style={{ textAlign: 'center' }}>
            <Button type="primary" style={{ marginRight: 10 }} onClick={this.handleEdit}>编辑</Button>
            <Button onClick={this.goBack}>返回</Button>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
