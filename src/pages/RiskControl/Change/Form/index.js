import React, { useState, useEffect } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Form from '@/jingan-components/Form';
import { Spin } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import { TYPES, FORMAT } from '../List';
import styles from './index.less';

const NAMESPACE = 'change';
const DETAIL_API = `${NAMESPACE}/getDetail`;
const ADD_API = `${NAMESPACE}/add`;
const EDIT_API = `${NAMESPACE}/edit`;
const APPROVE_API = `${NAMESPACE}/approve`;
const LIST_PATH = '/risk-control/change/list';
const EDIT_PATH = '/risk-control/change/edit';
const BREADCRUMB_LIST = [
  { title: '首页', name: '首页', href: '/' },
  { title: '风险分级管控', name: '风险分级管控' },
  { title: '变更管理', name: '变更管理', href: '/risk-control/change/list' },
  { title: '变更申请', name: '变更申请' },
];
const LABEL_COL = { span: 6 };
const WRAPPER_COL = { span: 12 };

export default connect(
  state => state,
  null,
  (
    {
      user: {
        currentUser: { permissionCodes },
      },
      [NAMESPACE]: { detail },
      loading: {
        effects: {
          [DETAIL_API]: loading,
          [ADD_API]: adding,
          [EDIT_API]: editing,
          [APPROVE_API]: approving,
        },
      },
    },
    { dispatch },
    {
      route: { name },
      match: {
        params: { id },
      },
      ...ownProps
    }
  ) => {
    return {
      ...ownProps,
      id,
      detail,
      loading,
      getDetail(payload, callback) {
        dispatch({
          type: DETAIL_API,
          payload: {
            ...payload,
            id,
          },
          callback,
        });
      },
      submitting: adding || editing || approving || false,
      submit(payload, callback) {
        dispatch({
          type: { add: ADD_API, edit: EDIT_API, approve: APPROVE_API }[name],
          payload: {
            ...payload,
            id,
          },
          callback,
        });
      },
      mode: name,
      hasEditAuthority: permissionCodes.includes('riskControl.change.edit'),
    };
  },
  {
    areStatesEqual: () => false,
    areOwnPropsEqual: () => false,
    areStatePropsEqual: () => false,
    areMergedPropsEqual: (props, nextProps) => {
      return (
        props.detail === nextProps.detail &&
        props.loading === nextProps.loading &&
        props.submitting === nextProps.submitting &&
        props.id === nextProps.id &&
        props.mode === nextProps.mode
      );
    },
  }
)(({ id, detail, loading = false, getDetail, submitting, submit, hasEditAuthority, mode }) => {
  // 表单初始值
  const [initialValues, setInitialValues] = useState(undefined);
  // 数据初始化
  useEffect(
    () => {
      if (id) {
        getDetail(undefined, (success, data) => {
          if (success) {
            const { project } = data;
            setInitialValues({
              project: project || undefined,
            });
          } else {
            setInitialValues();
          }
        });
      }
    },
    [id, mode]
  );
  return (
    <PageHeaderLayout
      className={styles.layout}
      breadcrumbList={BREADCRUMB_LIST}
      title={BREADCRUMB_LIST[BREADCRUMB_LIST.length - 1].title}
    >
      <Spin spinning={loading}>
        <Form
          fields={[
            {
              name: 'project',
              label: '变更项目',
              component: 'Input',
              props: {
                maxLength: 200,
              },
              enableDefaultRules: true,
            },
          ]}
          initialValues={initialValues}
          mode={mode}
          hasEditAuthority={hasEditAuthority}
          editPath={`${EDIT_PATH}/${id}`}
          listPath={LIST_PATH}
          onSubmit={values => {
            submit(
              {
                ...values,
              },
              success => {
                if (success) {
                  router.push(LIST_PATH);
                }
              }
            );
          }}
          submitting={submitting}
          // showEditButton={hasEditAuthority && }
          labelCol={LABEL_COL}
          wrapperCol={WRAPPER_COL}
        />
      </Spin>
    </PageHeaderLayout>
  );
});
