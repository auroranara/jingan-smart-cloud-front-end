import React, { useState, useMemo, useEffect } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Form from '@/jingan-components/Form';
import { Spin, Button } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import { TYPES, STATUSES, FORMAT } from '../List';
import styles from './index.less';

const NAMESPACE = 'change';
const DETAIL_API = `${NAMESPACE}/getDetail`;
const ADD_API = `${NAMESPACE}/add`;
const EDIT_API = `${NAMESPACE}/edit`;
const APPROVE_API = `${NAMESPACE}/approve`;
const LIST_PATH = '/risk-control/change/list';
const EDIT_PATH = '/risk-control/change/edit';
const APPROVE_PATH = '/risk-control/change/approve';
const BREADCRUMB_LIST = [
  { title: '首页', name: '首页', href: '/' },
  { title: '风险分级管控', name: '风险分级管控' },
  { title: '变更管理', name: '变更管理', href: '/risk-control/change/list' },
  { title: '变更申请', name: '变更申请' },
];
const TAB_LIST = [{ key: '1', tab: '申请信息' }, { key: '2', tab: '验收信息' }];
const LABEL_COL = { span: 6 };
const WRAPPER_COL = { span: 12 };
const RESULTS = [{ key: '1', value: '通过' }, { key: '0', value: '不通过' }];

export default connect(
  state => state,
  null,
  (
    {
      user: {
        currentUser: { unitId, unitType, permissionCodes },
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
      loading: loading || false,
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
      unitId,
      isUnit: unitType === 4,
      hasEditAuthority: permissionCodes.includes('riskControl.change.edit'),
      hasApproveAuthority: permissionCodes.includes('riskControl.change.approve'),
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
)(
  ({
    id,
    detail: { approveDate, status } = {},
    loading,
    getDetail,
    submitting,
    submit,
    mode,
    unitId,
    isUnit,
    hasEditAuthority,
    hasApproveAuthority,
  }) => {
    // 表单初始值
    const [initialValues, setInitialValues] = useState(undefined);
    // 当前选中的标签键值
    const [tabActiveKey, setTabActiveKey] = useState(TAB_LIST[+(mode === 'approve')].key);
    // 表单配置对象
    const fields = useMemo(
      () => {
        return tabActiveKey === TAB_LIST[0].key
          ? [
              ...(!isUnit
                ? [
                    {
                      name: 'company',
                      label: '申请单位',
                      component: 'Select',
                      props: {
                        preset: 'company',
                        labelInValue: true,
                        allowClear: true,
                      },
                    },
                  ]
                : []),
              {
                name: '变更项目',
                label: '变更项目',
                component: 'Input',
                props: {
                  maxLength: 100,
                },
                enableDefaultRules: true,
              },
              {
                name: '变更类别',
                label: '变更类别',
                component: 'Radio',
                props: {
                  list: TYPES,
                },
                enableDefaultRules: true,
              },
              {
                name: '申请人',
                label: '申请人',
                component: 'Select',
                dependencies: ['company'],
                props({ company }) {
                  return {
                    preset: 'employee',
                    labelInValue: true,
                    params: {
                      companyId: isUnit ? unitId : company && company.key,
                    },
                    allowClear: true,
                  };
                },
              },
              {
                name: '申请人职务',
                label: '申请人职务',
                component: 'Input',
                props: {
                  maxLength: 50,
                  allowClear: true,
                },
              },
              {
                name: 'department',
                label: '申请人部门',
                component: 'TreeSelect',
                dependencies: ['company'],
                props({ company }) {
                  return {
                    preset: 'department',
                    labelInValue: true,
                    params: {
                      companyId: isUnit ? unitId : company && company.key,
                    },
                    allowClear: true,
                  };
                },
              },
              {
                name: '申请内容描述',
                label: '申请内容描述',
                component: 'TextArea',
                props: {
                  maxLength: Infinity,
                },
                enableDefaultRules: true,
              },
              {
                name: '变更原因',
                label: '变更原因',
                component: 'Input',
                props: {
                  maxLength: 50,
                  allowClear: true,
                },
              },
              {
                name: '危害识别风险评估结果',
                label: '危害识别风险评估结果',
                component: 'TextArea',
                props: {
                  maxLength: Infinity,
                  allowClear: true,
                },
              },
              {
                name: '风险分析及控制措施',
                label: '风险分析及控制措施',
                component: 'TextArea',
                props: {
                  maxLength: 250,
                  allowClear: true,
                },
              },
              {
                name: '变更方案',
                label: '变更方案',
                component: 'Upload',
              },
              {
                name: '部门领导意见',
                label: '部门领导意见',
                component: 'TextArea',
                props: {
                  maxLength: 250,
                  allowClear: true,
                },
              },
              {
                name: '主管领导意见',
                label: '主管领导意见',
                component: 'TextArea',
                props: {
                  maxLength: 250,
                  allowClear: true,
                },
              },
              {
                name: '实施人员意见',
                label: '实施人员意见',
                component: 'TextArea',
                props: {
                  maxLength: 250,
                  allowClear: true,
                },
              },
              {
                name: '公司领导意见',
                label: '公司领导意见',
                component: 'TextArea',
                props: {
                  maxLength: 250,
                  allowClear: true,
                },
              },
            ]
          : [
              {
                name: '组织验收部门',
                label: '组织验收部门',
                component: 'TreeSelect',
                dependencies: ['company'],
                props({ company }) {
                  return {
                    preset: 'department',
                    labelInValue: true,
                    params: {
                      companyId: isUnit ? unitId : company && company.key,
                    },
                    allowClear: true,
                  };
                },
              },
              {
                name: '验收日期',
                label: '验收日期',
                component: 'DatePicker',
                props: {
                  format: FORMAT,
                },
                enableDefaultRules: true,
              },
              {
                name: '验收人员',
                label: '验收人员',
                component: 'Input',
                props: {
                  maxLength: 100,
                },
                enableDefaultRules: true,
              },
              {
                name: '验收人员所在部门',
                label: '验收人员所在部门',
                component: 'TreeSelect',
                dependencies: ['company'],
                props({ company }) {
                  return {
                    preset: 'department',
                    labelInValue: true,
                    params: {
                      companyId: isUnit ? unitId : company && company.key,
                    },
                    allowClear: true,
                  };
                },
              },
              {
                name: '验收人员职务',
                label: '验收人员职务',
                component: 'Input',
                props: {
                  maxLength: 50,
                  allowClear: true,
                },
              },
              {
                name: '验收结果',
                label: '验收结果',
                component: 'Radio',
                props: {
                  list: RESULTS,
                },
                enableDefaultRules: true,
              },
              {
                name: '验收意见',
                label: '验收意见',
                component: 'TextArea',
                props: {
                  maxLength: 100,
                },
                enableDefaultRules: true,
              },
              {
                name: '验收报告',
                label: '验收报告',
                component: 'Upload',
              },
              {
                name: '主管部门意见',
                label: '主管部门意见',
                component: 'TextArea',
                props: {
                  maxLength: 100,
                  allowClear: true,
                },
              },
              {
                name: '变更结果需要沟通部门',
                label: '变更结果需要沟通部门',
                component: 'TreeSelect',
                dependencies: ['company'],
                props({ company }) {
                  return {
                    preset: 'department',
                    labelInValue: true,
                    params: {
                      companyId: isUnit ? unitId : company && company.key,
                    },
                    allowClear: true,
                  };
                },
              },
              {
                name: '沟通部门意见',
                label: '沟通部门意见',
                component: 'TextArea',
                props: {
                  maxLength: 250,
                  allowClear: true,
                },
              },
              {
                name: '部门领导意见',
                label: '部门领导意见',
                component: 'TextArea',
                props: {
                  maxLength: 250,
                  allowClear: true,
                },
              },
              {
                name: '主管领导意见',
                label: '主管领导意见',
                component: 'TextArea',
                props: {
                  maxLength: 250,
                  allowClear: true,
                },
              },
              {
                name: '公司领导意见',
                label: '公司领导意见',
                component: 'TextArea',
                props: {
                  maxLength: 250,
                  allowClear: true,
                },
              },
              {
                name: '附件',
                label: '附件',
                component: 'Upload',
              },
            ];
      },
      [tabActiveKey]
    );
    // 数据初始化
    useEffect(
      () => {
        if (id) {
          getDetail(undefined, (success, data) => {
            if (success) {
              const { project, departmentId, departmentName } = data;
              setInitialValues({
                project: project || undefined,
                department: departmentId
                  ? { key: departmentId, value: departmentId, label: departmentName }
                  : undefined,
              });
            } else {
              setInitialValues();
            }
          });
        }
      },
      [id, mode]
    );
    let realMode = mode;
    if (mode === 'edit') {
      if (tabActiveKey === TAB_LIST[0].key) {
        realMode = 'edit';
      } else {
        realMode = 'detail';
      }
    } else if (mode === 'approve') {
      if (tabActiveKey === TAB_LIST[0].key) {
        realMode = 'detail';
      } else {
        realMode = 'edit';
      }
    }
    return (
      <PageHeaderLayout
        className={styles.layout}
        breadcrumbList={BREADCRUMB_LIST}
        title={BREADCRUMB_LIST[BREADCRUMB_LIST.length - 1].title}
        tabList={approveDate || mode === 'approve' ? TAB_LIST : undefined}
        tabActiveKey={tabActiveKey}
        onTabChange={setTabActiveKey}
      >
        <Spin spinning={loading}>
          <Form
            fields={fields}
            initialValues={initialValues}
            mode={realMode}
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
            showEditButton={
              mode === 'detail' &&
              tabActiveKey === TAB_LIST[0].key &&
              `${status}` !== STATUSES[1].key
            }
            addonBefore={
              mode === 'detail' &&
              tabActiveKey === TAB_LIST[1].key &&
              `${status}` === STATUSES[0].key && (
                <Button
                  type="primary"
                  href={`${APPROVE_PATH}/${id}`}
                  disabled={!hasApproveAuthority}
                >
                  去验收
                </Button>
              )
            }
            labelCol={LABEL_COL}
            wrapperCol={WRAPPER_COL}
          />
        </Spin>
      </PageHeaderLayout>
    );
  }
);
