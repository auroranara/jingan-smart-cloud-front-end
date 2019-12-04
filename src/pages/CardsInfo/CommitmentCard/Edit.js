import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import { Card, Form, message } from 'antd';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { renderSections } from '@/pages/SafetyKnowledgeBase/MSDS/utils';
import { BREADCRUMBLIST, EDIT_FORMITEMS, LIST_URL, handleDetails } from './utils';

@connect(({ cardsInfo, loading }) => ({
  cardsInfo,
  loading: loading.models.cardsInfo,
}))
@Form.create()
export default class Edit extends PureComponent {
  componentDidMount() {
    const {
      match: { params: { id } },
    } = this.props;
    id && this.getDetail(id);
  }

  getDetail = id => {
    const {
      dispatch,
      form: { setFieldsValue },
    } = this.props;
    dispatch({
      type: 'cardsInfo/getCommitCard',
      payload: id,
      callback: detail => {
        setFieldsValue(handleDetails(detail));
      },
    });
  };

  handleSubmit = e => {
    const {
      dispatch,
      form: { validateFields },
      match: { params: { id } },
    } = this.props;

    e.preventDefault();
    validateFields((errors, values) => {
      if (errors)
        return;

      const vals = { ...values, companyId: values.companyId.key, time: +values.time };
      dispatch({
        type: `cardsInfo/${id ? 'edit' : 'add'}CommitCard`,
        payload: id ? { id, ...vals } : vals,
        callback: (code, msg) => {
          if (code === 200) {
            message.success('操作成功');
            router.push(LIST_URL);
          } else
            message.error(msg);
        },
      });
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
