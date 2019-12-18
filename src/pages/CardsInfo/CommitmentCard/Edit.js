import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
// import moment from 'moment';
import { Button, Card, Form, message } from 'antd';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { renderSections } from '@/pages/SafetyKnowledgeBase/MSDS/utils';
import { BREADCRUMBLIST, LIST_URL, handleDetails } from './utils';
import { isCompanyUser } from '@/pages/RoleAuthorization/Role/utils';
import styles from '@/pages/CardsInfo/EmergencyCard/TableList.less';

@connect(({ user, cardsInfo, loading }) => ({
  user,
  cardsInfo,
  loading: loading.models.cardsInfo,
}))
@Form.create()
export default class Edit extends PureComponent {
  componentDidMount() {
    const {
      match: { params: { id } },
      form: { setFieldsValue },
      user: { currentUser: { unitType, companyId, companyName } },
    } = this.props;
    if (id)
      this.getDetail(id);
    else if (isCompanyUser(+unitType))
      setFieldsValue({ companyId: { key: companyId, label: companyName } });
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
    return url && url.includes('view');
  };

  render() {
    const {
      loading,
      match: { params: { id } },
      form: { getFieldDecorator },
      user: { currentUser: { unitType } },
    } = this.props;

    const isDet = this.isDetail();
    const title = isDet ? '详情' : id ? '编辑' : '新增';
    const breadcrumbList = Array.from(BREADCRUMBLIST);
    breadcrumbList.push({ title, name: title });
    const handleSubmit = isDet ? null : this.handleSubmit;
    const isComUser = isCompanyUser(+unitType);

    const formItems = [
      { name: 'companyId', label: '单位名称', type: 'companyselect', disabled: isComUser, wrapperClassName: isComUser ? styles.disappear : undefined },
      { name: 'name', label: '承诺卡名称' },
      { name: 'content', label: '承诺卡内容', type: 'text' },
      { name: 'acceptor', label: '承诺人' },
      { name: 'time', label: '时间', type: 'datepicker' },
      { name: 'section', label: '风险分区', type: 'select', required: false },
  ];

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
      >
        <Card style={{ marginBottom: 15 }}>
          {renderSections(formItems, getFieldDecorator, handleSubmit, LIST_URL, loading)}
          {isDet ? (
            <Button
              type="primary"
              style={{ marginLeft: '45%' }}
              onClick={e => router.push(`/cards-info/commitment-card/edit/${id}`)}
            >
              编辑
            </Button>
          ) : null}
        </Card>
      </PageHeaderLayout>
    );
  }
}
