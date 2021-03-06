import React, { PureComponent } from 'react';
// import { connect } from 'dva';
import router from 'umi/router';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, message } from 'antd';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { renderSections } from '@/pages/SafetyKnowledgeBase/MSDS/utils';
import { BREADCRUMBLIST, EDIT_FORMITEMS, LIST, LIST_URL } from './utils';

@Form.create()
export default class Edit extends PureComponent {
  componentDidMount() {
    const {
      match: { params: { id } },
    } = this.props;
    id && this.getDetail();
  }

  getDetail = () => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setTimeout(() => setFieldsValue(LIST[0]), 0.3);
  };

  handleSubmit = () => {
    const {
      form: { validateFields },
    } = this.props;

    validateFields((errors, values) => {
      if (!errors) {
        message.success('操作成功');
        router.push(LIST_URL);
      }
    });
  };

  isDetail = () => {
    const { match: { url } } = this.props;
    return url && url.includes('detail');
  };

  render() {
    const {
      match: { params: { id } },
      form: { getFieldDecorator },
    } = this.props;

    const isDet = this.isDetail();
    const title = isDet ? '详情' : id ? '编辑' : '新增';
    const breadcrumbList = Array.from(BREADCRUMBLIST);
    breadcrumbList.push({ title, name: title });
    const handleSubmit = isDet ? null : this.handleSubmit;

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
      >
        <Card style={{ marginBottom: 15 }}>
          {renderSections(EDIT_FORMITEMS, getFieldDecorator, handleSubmit, LIST_URL)}
        </Card>
      </PageHeaderLayout>
    );
  }
}
