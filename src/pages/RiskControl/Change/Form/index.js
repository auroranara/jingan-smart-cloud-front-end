import React, { useState, useMemo, useEffect } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Form from '@/jingan-components/Form';
import { Spin, Button } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import { isNumber } from '@/utils/utils';
import { TYPES, STATUSES, FORMAT } from '../List';
import styles from './index.less';

const NAMESPACE = 'change';
const DETAIL_API = `${NAMESPACE}/getDetail`;
const ADD_API = `${NAMESPACE}/add`;
const EDIT_API = `${NAMESPACE}/edit`;
const APPROVE_API = `${NAMESPACE}/approve`;
const APPROVE_DETAIL_API = `${NAMESPACE}/getApproveDetail`;
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
const TRANSFORM = ({ company, applyPerson, applyPart, ...rest }) => ({
  ...rest,
  companyId: company && company.key,
  applyPerson: applyPerson && applyPerson.key,
  applyPart: applyPart && applyPart.key,
});
const TRANSFORM2 = ({
  approvePart,
  approveDate,
  approvePersonPart,
  changeCommunicatePart,
  ...rest
}) => ({
  ...rest,
  approvePart: approvePart && approvePart.key,
  approveDate: approveDate && approveDate.format(FORMAT),
  approvePersonPart: approvePersonPart && approvePersonPart.key,
  changeCommunicatePart: changeCommunicatePart && changeCommunicatePart.key,
});

export default connect(
  state => state,
  null,
  (
    {
      user: {
        currentUser: { unitId, unitType, permissionCodes },
      },
      [NAMESPACE]: { detail, approveDetail },
      loading: {
        effects: {
          [DETAIL_API]: loading,
          [ADD_API]: adding,
          [EDIT_API]: editing,
          [APPROVE_API]: approving,
          [APPROVE_DETAIL_API]: loading2,
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
      approveDetail,
      loading: loading || loading2 || false,
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
      getApproveDetail(payload, callback) {
        dispatch({
          type: APPROVE_DETAIL_API,
          payload: {
            ...payload,
            applyId: id,
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
            ...(name !== 'approve' ? { id } : { applyId: id }),
          },
          callback,
        });
      },
      mode: name,
      isUnit: unitType === 4,
      unitId,
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
        props.approveDetail === nextProps.approveDetail &&
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
    detail: { companyId, isApprove, status } = {},
    loading,
    getDetail,
    getApproveDetail,
    submitting,
    submit,
    mode,
    isUnit,
    unitId,
    hasEditAuthority,
    hasApproveAuthority,
  }) => {
    // 表单初始值
    const [initialValues, setInitialValues] = useState(undefined);
    const [initialValues2, setInitialValues2] = useState(undefined);
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
                name: 'changeProject',
                label: '变更项目',
                component: 'Input',
                props: {
                  maxLength: 100,
                },
                enableDefaultRules: true,
              },
              {
                name: 'changeType',
                label: '变更类别',
                component: 'Radio',
                props: {
                  list: TYPES,
                },
                enableDefaultRules: true,
              },
              {
                name: 'applyPerson',
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
                name: 'applyPosition',
                label: '申请人职务',
                component: 'Input',
                props: {
                  maxLength: 50,
                  allowClear: true,
                },
              },
              {
                name: 'applyPart',
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
                name: 'applyContent',
                label: '申请内容描述',
                component: 'TextArea',
                props: {
                  maxLength: Infinity,
                },
                enableDefaultRules: true,
              },
              {
                name: 'changeReason',
                label: '变更原因',
                component: 'Input',
                props: {
                  maxLength: 50,
                  allowClear: true,
                },
              },
              {
                name: 'hazardRisk',
                label: '危害识别风险评估结果',
                component: 'TextArea',
                props: {
                  maxLength: Infinity,
                  allowClear: true,
                },
              },
              {
                name: 'riskMeasure',
                label: '风险分析及控制措施',
                component: 'TextArea',
                props: {
                  maxLength: 250,
                  allowClear: true,
                },
              },
              {
                name: 'changeFileList',
                label: '变更方案',
                component: 'Upload',
              },
              {
                name: 'departLeaderOpinion',
                label: '部门领导意见',
                component: 'TextArea',
                props: {
                  maxLength: 250,
                  allowClear: true,
                },
              },
              {
                name: 'directorOpinion',
                label: '主管领导意见',
                component: 'TextArea',
                props: {
                  maxLength: 250,
                  allowClear: true,
                },
              },
              {
                name: 'implementOpinion',
                label: '实施人员意见',
                component: 'TextArea',
                props: {
                  maxLength: 250,
                  allowClear: true,
                },
              },
              {
                name: 'unitLeaderOpinion',
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
                name: 'approvePart',
                label: '组织验收部门',
                component: 'TreeSelect',
                props: {
                  preset: 'department',
                  labelInValue: true,
                  params: {
                    companyId,
                  },
                  allowClear: true,
                },
              },
              {
                name: 'approveDate',
                label: '验收日期',
                component: 'DatePicker',
                props: {
                  format: FORMAT,
                },
                enableDefaultRules: true,
              },
              {
                name: 'approvePerson',
                label: '验收人员',
                component: 'Input',
                props: {
                  maxLength: 100,
                },
                enableDefaultRules: true,
              },
              {
                name: 'approvePersonPart',
                label: '验收人员所在部门',
                component: 'TreeSelect',
                props: {
                  preset: 'department',
                  labelInValue: true,
                  params: {
                    companyId,
                  },
                  allowClear: true,
                },
              },
              {
                name: 'approvePersonPosition',
                label: '验收人员职务',
                component: 'Input',
                props: {
                  maxLength: 50,
                  allowClear: true,
                },
              },
              {
                name: 'approveStatus',
                label: '验收结果',
                component: 'Radio',
                props: {
                  list: RESULTS,
                },
                enableDefaultRules: true,
              },
              {
                name: 'approveOpinion',
                label: '验收意见',
                component: 'TextArea',
                props: {
                  maxLength: 100,
                },
                enableDefaultRules: true,
              },
              {
                name: 'approveFileList',
                label: '验收报告',
                component: 'Upload',
              },
              {
                name: 'directorPartOpinion',
                label: '主管部门意见',
                component: 'TextArea',
                props: {
                  maxLength: 100,
                  allowClear: true,
                },
              },
              {
                name: 'changeCommunicatePart',
                label: '变更结果需要沟通部门',
                component: 'TreeSelect',
                props: {
                  preset: 'department',
                  labelInValue: true,
                  params: {
                    companyId,
                  },
                  allowClear: true,
                },
              },
              {
                name: 'communicatePartOpinion',
                label: '沟通部门意见',
                component: 'TextArea',
                props: {
                  maxLength: 250,
                  allowClear: true,
                },
              },
              {
                name: 'departLeaderOpinion',
                label: '部门领导意见',
                component: 'TextArea',
                props: {
                  maxLength: 250,
                  allowClear: true,
                },
              },
              {
                name: 'directorOpinion',
                label: '主管领导意见',
                component: 'TextArea',
                props: {
                  maxLength: 250,
                  allowClear: true,
                },
              },
              {
                name: 'unitLeaderOpinion',
                label: '公司领导意见',
                component: 'TextArea',
                props: {
                  maxLength: 250,
                  allowClear: true,
                },
              },
              {
                name: 'otherFileList',
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
              const {
                isApprove,
                companyId,
                companyName,
                changeProject,
                changeType,
                applyPerson,
                applyPersonName,
                applyPosition,
                applyPart,
                applyPartName,
                applyContent,
                changeReason,
                hazardRisk,
                riskMeasure,
                changeFileList,
                departLeaderOpinion,
                directorOpinion,
                implementOpinion,
                unitLeaderOpinion,
              } = data;
              setInitialValues({
                company: companyId
                  ? { key: companyId, value: companyId, label: companyName }
                  : undefined,
                changeProject: changeProject || undefined,
                changeType: isNumber(changeType) ? `${changeType}` : undefined,
                applyPerson: applyPerson
                  ? { key: applyPerson, value: applyPerson, label: applyPersonName }
                  : undefined,
                applyPosition: applyPosition || undefined,
                applyPart: applyPart
                  ? { key: applyPart, value: applyPart, label: applyPartName }
                  : undefined,
                applyContent: applyContent || undefined,
                changeReason: changeReason || undefined,
                hazardRisk: hazardRisk || undefined,
                riskMeasure: riskMeasure || undefined,
                changeFileList: changeFileList
                  ? changeFileList.map((item, index) => ({
                      ...item,
                      uid: -1 - index,
                      status: 'done',
                      name: item.fileName,
                      url: item.webUrl,
                    }))
                  : undefined,
                departLeaderOpinion: departLeaderOpinion || undefined,
                directorOpinion: directorOpinion || undefined,
                implementOpinion: implementOpinion || undefined,
                unitLeaderOpinion: unitLeaderOpinion || undefined,
              });
              if (isApprove) {
                getApproveDetail(undefined, (success, data) => {
                  if (success) {
                    const {
                      approvePart,
                      approvePartName,
                      approveDate,
                      approvePerson,
                      approvePersonPart,
                      approvePersonPartName,
                      approvePersonPosition,
                      approveStatus,
                      approveOpinion,
                      approveFileList,
                      directorPartOpinion,
                      changeCommunicatePart,
                      changeCommunicatePartName,
                      communicatePartOpinion,
                      departLeaderOpinion,
                      directorOpinion,
                      unitLeaderOpinion,
                      otherFileList,
                    } = data;
                    setInitialValues2({
                      approvePart: approvePart
                        ? { key: approvePart, value: approvePart, label: approvePartName }
                        : undefined,
                      approveDate: approveDate ? moment(approveDate) : undefined,
                      approvePerson: approvePerson || undefined,
                      approvePersonPart: approvePersonPart
                        ? {
                            key: approvePersonPart,
                            value: approvePersonPart,
                            label: approvePersonPartName,
                          }
                        : undefined,
                      approvePersonPosition: approvePersonPosition || undefined,
                      approveStatus: isNumber(approveStatus) ? `${approveStatus}` : undefined,
                      approveOpinion: approveOpinion || undefined,
                      approveFileList: approveFileList
                        ? approveFileList.map((item, index) => ({
                            ...item,
                            uid: -1 - index,
                            status: 'done',
                            name: item.fileName,
                            url: item.webUrl,
                          }))
                        : undefined,
                      directorPartOpinion: directorPartOpinion || undefined,
                      changeCommunicatePart: changeCommunicatePart
                        ? {
                            key: changeCommunicatePart,
                            value: changeCommunicatePart,
                            label: changeCommunicatePartName,
                          }
                        : undefined,
                      communicatePartOpinion: communicatePartOpinion || undefined,
                      departLeaderOpinion: departLeaderOpinion || undefined,
                      directorOpinion: directorOpinion || undefined,
                      unitLeaderOpinion: unitLeaderOpinion || undefined,
                      otherFileList: otherFileList
                        ? otherFileList.map((item, index) => ({
                            ...item,
                            uid: -1 - index,
                            status: 'done',
                            name: item.fileName,
                            url: item.webUrl,
                          }))
                        : undefined,
                    });
                  } else {
                    setInitialValues2();
                  }
                });
              }
            } else {
              setInitialValues();
              setInitialValues2();
            }
          });
        }
      },
      [id]
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
        tabList={isApprove || mode === 'approve' ? TAB_LIST : undefined}
        tabActiveKey={tabActiveKey}
        onTabChange={setTabActiveKey}
      >
        <Spin spinning={loading}>
          <Form
            fields={fields}
            initialValues={tabActiveKey === TAB_LIST[0].key ? initialValues : initialValues2}
            mode={realMode}
            hasEditAuthority={hasEditAuthority}
            editPath={`${EDIT_PATH}/${id}`}
            listPath={LIST_PATH}
            onSubmit={values => {
              submit(
                tabActiveKey === TAB_LIST[0].key ? TRANSFORM(values) : TRANSFORM2(values),
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
