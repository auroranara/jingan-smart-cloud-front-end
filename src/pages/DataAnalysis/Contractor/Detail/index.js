import React, { Fragment, useEffect, useRef, useState } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { Spin, Card, Drawer } from 'antd';
import Form from '@/jingan-components/Form';
import { Table, Link, Badge, TextAreaEllipsis } from '@/jingan-components/View';
import DueDate from '../components/DueDate';
import { connect } from 'dva';
import locales from '@/locales/zh-CN';
import moment from 'moment';
import { CATEGORIES, TYPES, TAB_LIST, FORMAT, STATUSES } from '../config';
import { YES_OR_NO } from '../../ContractorConstruction/config';
import {
  DEPARTMENT_FIELDNAMES,
  DEPARTMENT_MAPPER,
  RESULTS,
} from '../../ContractorEvaluation/config';
import { getPageSize, setPageSize } from '@/utils/utils';
import { isNumber } from '@/utils/utils';
import styles from './index.less';

const ContractorDetail = props => {
  const {
    match: {
      params: { id },
    },
    breadcrumbList,
    mode,
    isUnit,
    getDetail,
    loading,
    detail,
    detail: { companyId, companyName },
    constructionList,
    getConstructionList,
    // constructionDetail,
    getConstructionDetail,
    evaluationList,
    getEvaluationList,
    // evaluationDetail,
    getEvaluationDetail,
    violationRecordList,
    getViolationRecordList,
    // violationRecordDetail,
    // getViolationRecordDetail,
    loadingList,
    loadingDetail,
  } = props;
  const form = useRef(null);
  const form2 = useRef(null);
  const [activeKey, setActiveKey] = useState(undefined);
  const [visible, setVisible] = useState(false);
  const handleTabChange = activeKey => {
    setActiveKey(activeKey);
    if (activeKey === TAB_LIST[0].key) {
      getConstructionList();
    } else if (activeKey === TAB_LIST[1].key) {
      getEvaluationList();
    } else if (activeKey === TAB_LIST[2].key) {
      getViolationRecordList();
    }
  };
  useEffect(
    () => {
      if (id) {
        getDetail(undefined, (success, data) => {
          if (success) {
            const {
              contractorName,
              contractorNature,
              contractorCategory,
              contractorType,
              businessScope,
              contractorPhone,
              contractorMail,
              qualificationCertificate,
              certificateCode,
              certificateExpireDate,
              certificateFileList,
            } = data;
            form.current.setFieldsValue({
              contractorName: contractorName || undefined,
              contractorNature: contractorNature || undefined,
              contractorCategory: contractorCategory ? `${contractorCategory}` : undefined,
              contractorType: contractorType ? `${contractorType}` : undefined,
              businessScope: businessScope || undefined,
              contractorPhone: contractorPhone || undefined,
              contractorMail: contractorMail || undefined,
              qualificationCertificate: qualificationCertificate || undefined,
              certificateCode: certificateCode || undefined,
              certificateExpireDate: certificateExpireDate
                ? moment(certificateExpireDate)
                : undefined,
              certificateFileList: certificateFileList
                ? certificateFileList.map((item, index) => ({
                    ...item,
                    uid: -1 - index,
                    status: 'done',
                    name: item.fileName,
                    url: item.webUrl,
                  }))
                : undefined,
            });
          }
        });
        handleTabChange(TAB_LIST[0].key);
      }
      window.scrollTo(0, 0);
    },
    [id]
  );
  const fields = [
    {
      name: 'contractorName',
      label: '承包商名称',
      component: 'Input',
      col: {
        span: 8,
      },
    },
    {
      name: 'contractorNature',
      label: '单位性质',
      component: 'Input',
      col: {
        span: 8,
      },
    },
    {
      name: 'contractorCategory',
      label: '承包商类别',
      component: 'Radio',
      props: {
        list: CATEGORIES,
      },
      col: {
        span: 8,
      },
    },
    {
      name: 'contractorType',
      label: '承包商类型',
      component: 'Radio',
      props: {
        list: TYPES,
      },
      col: {
        span: 8,
      },
    },
    {
      name: 'contractorPhone',
      label: '承包商电话',
      component: 'Input',
      col: {
        span: 8,
      },
    },
    {
      name: 'contractorMail',
      label: '邮箱',
      component: 'Input',
      col: {
        span: 8,
      },
    },
    {
      name: 'businessScope',
      label: '经营范围',
      component: 'Input',
      col: {
        span: 24,
      },
    },
    {
      name: 'qualificationCertificate',
      label: '承包商资质证书',
      component: 'Input',
      col: {
        span: 8,
      },
    },
    {
      name: 'certificateCode',
      label: '资质证书编号',
      component: 'Input',
      col: {
        span: 8,
      },
    },
    {
      name: 'certificateExpireDate',
      label: '资质证书到期日期',
      component: DueDate,
      props({ certificateExpireStatus }) {
        return {
          list: STATUSES,
          status: certificateExpireStatus,
        };
      },
      col: {
        span: 8,
      },
    },
    {
      name: 'certificateFileList',
      label: '上传资质证书附件',
      component: 'Upload',
      col: {
        span: 24,
      },
    },
  ];
  let list, columns, drawerTitle, rows;
  if (activeKey === TAB_LIST[0].key) {
    list = constructionList;
    columns = [
      {
        dataIndex: 'teamBusinessGrade',
        title: '施工队伍营业等级',
      },
      {
        dataIndex: 'workCompanyDesc',
        title: '施工单位简介',
        render: value => <TextAreaEllipsis value={value} length={20} />,
      },
      {
        dataIndex: '施工队伍',
        title: '施工队伍',
        render: (_, { teamManager, teamManagerPhone }) => (
          <Fragment>
            <div className={styles.fieldWrapper}>
              <div>负责人：</div>
              <div>{teamManager}</div>
            </div>
            <div className={styles.fieldWrapper}>
              <div>联系电话：</div>
              <div>{teamManagerPhone}</div>
            </div>
          </Fragment>
        ),
      },
      {
        dataIndex: '责任书',
        title: '责任书',
        render: (_, { signingDate, expireDate }) => (
          <Fragment>
            <div className={styles.fieldWrapper}>
              <div>签订日期：</div>
              <div>{signingDate && moment(signingDate).format(FORMAT)}</div>
            </div>
            <div className={styles.fieldWrapper}>
              <div>到期日期：</div>
              <div>{expireDate && moment(expireDate).format(FORMAT)}</div>
            </div>
          </Fragment>
        ),
      },
      {
        dataIndex: '操作',
        title: '操作',
        fixed: 'right',
        width: 60,
        render: (
          _,
          data // 这里要不要做权限是个问题
        ) => (
          <Link
            to="/"
            onClick={() => {
              setVisible(true);
              getConstructionDetail(data, (success, data) => {
                if (success) {
                  const {
                    teamBusinessGrade,
                    creditCode,
                    businessLicenseCode,
                    workCompanyDesc,
                    teamManager,
                    teamManagerPhone,
                    teamManagerCard,
                    safetyManager,
                    safetyManagerPhone,
                    safetyManagerCard,
                    specialEquipmentLicense,
                    signingDate,
                    expireDate,
                    enteringDate,
                    planAssessDate,
                    blacklistStatus,
                  } = data;
                  form2.current.setFieldsValue({
                    teamBusinessGrade: teamBusinessGrade || undefined,
                    creditCode: creditCode || undefined,
                    businessLicenseCode: businessLicenseCode || undefined,
                    workCompanyDesc: workCompanyDesc || undefined,
                    teamManager: teamManager || undefined,
                    teamManagerPhone: teamManagerPhone || undefined,
                    teamManagerCard: teamManagerCard || undefined,
                    safetyManager: safetyManager || undefined,
                    safetyManagerPhone: safetyManagerPhone || undefined,
                    safetyManagerCard: safetyManagerCard || undefined,
                    specialEquipmentLicense: specialEquipmentLicense || undefined,
                    signingDate: signingDate ? moment(signingDate) : undefined,
                    expireDate: expireDate ? moment(expireDate) : undefined,
                    enteringDate: enteringDate ? moment(enteringDate) : undefined,
                    planAssessDate: planAssessDate ? moment(planAssessDate) : undefined,
                    blacklistStatus: isNumber(blacklistStatus) ? `${blacklistStatus}` : undefined,
                  });
                }
              });
            }}
          >
            查看
          </Link>
        ),
      },
    ];
    drawerTitle = '施工记录详情';
    rows = [
      {
        fields: [
          {
            name: 'teamBusinessGrade',
            label: '施工队伍营业等级',
            component: 'Input',
          },
          {
            name: 'creditCode',
            label: '统一社会信用代码',
            component: 'Input',
          },
          {
            name: 'businessLicenseCode',
            label: '营业执照字号',
            component: 'Input',
          },
          {
            name: 'workCompanyDesc',
            label: '施工单位简介',
            component: 'TextArea',
          },
          {
            name: 'teamManager',
            label: '施工队伍负责人',
            component: 'Input',
          },
          {
            name: 'teamManagerPhone',
            label: '施工队伍负责人联系电话',
            component: 'Input',
          },
          {
            name: 'teamManagerCard',
            label: '施工队伍负责人身份证',
            component: 'Input',
          },
          {
            name: 'safetyManager',
            label: '安全负责人',
            component: 'Input',
          },
          {
            name: 'safetyManagerPhone',
            label: '安全负责人联系电话',
            component: 'Input',
          },
          {
            name: 'safetyManagerCard',
            label: '安全负责人身份证',
            component: 'Input',
          },
          {
            name: 'specialEquipmentLicense',
            label: '特种设备安装许可证',
            component: 'Input',
          },
          {
            name: 'signingDate',
            label: '责任书签订日期',
            component: 'DatePicker',
          },
          {
            name: 'expireDate',
            label: '责任书到期日期',
            component: 'DatePicker',
          },
          {
            name: 'enteringDate',
            label: '进厂日期',
            component: 'DatePicker',
          },
          {
            name: 'planAssessDate',
            label: '计划考核日期',
            component: 'DatePicker',
          },
          {
            name: 'blacklistStatus',
            label: '是否在黑名单',
            component: 'Radio',
            props: {
              list: YES_OR_NO,
            },
          },
        ],
        bordered: false,
      },
    ];
  } else if (activeKey === TAB_LIST[1].key) {
    list = evaluationList;
    columns = [
      {
        dataIndex: 'assessTitle',
        title: '考核记录标题',
      },
      {
        dataIndex: 'assessDepartmentName',
        title: '考核部门',
      },
      {
        dataIndex: 'assessDate',
        title: '实际考核日期',
        render: value => value && moment(value).format(FORMAT),
      },
      {
        dataIndex: 'assessScore',
        title: '总分',
      },
      {
        dataIndex: 'assessResult',
        title: '考核结果',
        render: value => <Badge list={RESULTS} value={`${value}`} />,
      },
      {
        dataIndex: '操作',
        title: '操作',
        fixed: 'right',
        width: 60,
        render: (
          _,
          data // 这里要不要做权限是个问题
        ) => (
          <Link
            to="/"
            onClick={() => {
              setVisible(true);
              getEvaluationDetail(data, (success, data) => {
                if (success) {
                  const {
                    assessTitle,
                    contractorPlant,
                    contractorPlantStatus,
                    approveBeforeType,
                    approveConfirmType,
                    assessDepartmentId,
                    assessDate,
                    assessScore,
                    assessResult,
                  } = data;
                  form2.current.setFieldsValue({
                    assessTitle: assessTitle || undefined,
                    contractorPlant: contractorPlant || undefined,
                    contractorPlantStatus: contractorPlantStatus || undefined,
                    approveBeforeType: approveBeforeType || undefined,
                    approveConfirmType: approveConfirmType || undefined,
                    assessDepartmentId: assessDepartmentId || undefined,
                    assessDate: assessDate ? moment(assessDate) : undefined,
                    assessScore: assessScore || undefined,
                    assessResult: isNumber(assessResult) ? `${assessResult}` : undefined,
                  });
                }
              });
            }}
          >
            查看
          </Link>
        ),
      },
    ];
    drawerTitle = '评定记录详情';
    rows = [
      {
        fields: [
          {
            name: 'assessTitle',
            label: '考核记录标题',
            component: 'Input',
          },
          {
            name: 'contractorPlant',
            label: '承包商所在厂区',
            component: 'Input',
          },
          {
            name: 'contractorPlantStatus',
            label: '承包商在厂状态',
            component: 'Input',
          },
          {
            name: 'approveBeforeType',
            label: '审批前类别',
            component: 'Input',
          },
          {
            name: 'approveConfirmType',
            label: '审批认定类别',
            component: 'Input',
          },
          {
            name: 'assessDepartmentId',
            label: '考核部门',
            component: 'TreeSelect',
            props: {
              fieldNames: DEPARTMENT_FIELDNAMES,
              mapper: DEPARTMENT_MAPPER,
              params: {
                companyId,
              },
            },
          },
          {
            name: 'assessDate',
            label: '实际考核日期',
            component: 'DatePicker',
          },
          {
            name: 'assessScore',
            label: '总分',
            component: 'Input',
          },
          {
            name: 'assessResult',
            label: '考核结果',
            component: 'Radio',
            props: {
              list: RESULTS,
            },
          },
        ],
        bordered: false,
      },
    ];
  } else if (activeKey === TAB_LIST[2].key) {
    list = violationRecordList;
    columns = [
      {
        dataIndex: 'projectName',
        title: '项目名称',
      },
      {
        dataIndex: 'violationDate',
        title: '违章日期',
        render: value => value && moment(value).format(FORMAT),
      },
      {
        dataIndex: 'violators',
        title: '违章人姓名',
        render: value => value && value.split(',').join('、'),
      },
      {
        dataIndex: 'processingResult',
        title: '处理结果',
        render: value => <TextAreaEllipsis value={value} length={20} />,
      },
    ];
    drawerTitle = '违章记录详情';
  }
  return (
    <PageHeaderLayout
      title={breadcrumbList[breadcrumbList.length - 1].title}
      breadcrumbList={breadcrumbList}
      content={!isUnit && companyName}
    >
      <Spin spinning={loading}>
        <Form ref={form} mode={mode} fields={fields} showOperation={false} params={detail} />
        <Card
          className={styles.card}
          tabList={TAB_LIST}
          activeTabKey={activeKey}
          onTabChange={handleTabChange}
        >
          {activeKey && (
            <Table
              key={activeKey}
              showCard={false}
              showAddButton={false}
              list={list}
              columns={columns}
              loading={!loading && loadingList}
              onChange={({ current, pageSize }) => {
                const {
                  pagination: { pageSize: prevPageSize },
                } = list;
                const payload = {
                  pageNum: pageSize !== prevPageSize ? 1 : current,
                  pageSize,
                };
                if (activeKey === TAB_LIST[0].key) {
                  getConstructionList(payload);
                } else if (activeKey === TAB_LIST[1].key) {
                  getEvaluationList(payload);
                } else if (activeKey === TAB_LIST[2].key) {
                  getViolationRecordList(payload);
                }
                pageSize !== prevPageSize && setPageSize(pageSize);
              }}
              // onReload={() => {
              //   const { pagination: { pageNum = 1, pageSize = getPageSize() } = {} } = list || {};
              //   const payload = {
              //     pageNum,
              //     pageSize,
              //   };
              //   if (activeKey === TAB_LIST[0].key) {
              //     getConstructionList(payload);
              //   } else if (activeKey === TAB_LIST[1].key) {
              //     getEvaluationList(payload);
              //   } else if (activeKey === TAB_LIST[2].key) {
              //     getViolationRecordList(payload);
              //   }
              // }}
            />
          )}
        </Card>
      </Spin>
      <Drawer
        title={drawerTitle}
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
        zIndex={1009}
        width="33%"
        forceRender
        bodyStyle={{ padding: 0 }}
      >
        <Spin spinning={loadingDetail}>
          {activeKey && (
            <Form key={activeKey} ref={form2} mode={mode} fields={rows} showOperation={false} />
          )}
        </Spin>
      </Drawer>
    </PageHeaderLayout>
  );
};

export default connect(
  (state, { route: { name, code }, location: { pathname } }) => {
    const namespace = code.split('.').slice(-2)[0];
    const d = 'detail';
    const gd = 'getDetail';
    const {
      user: {
        currentUser: { unitType, unitId },
      },
      [namespace]: { [d]: detail },
      contractorConstruction: { list: constructionList, detail: constructionDetail },
      contractorEvaluation: { list: evaluationList, detail: evaluationDetail },
      contractorViolationRecord: { list: violationRecordList, detail: violationRecordDetail },
      loading: {
        effects: {
          [`${namespace}/${gd}`]: loading,
          'contractorConstruction/getList': loadingConstructionList,
          'contractorConstruction/getDetail': loadingConstructionDetail,
          'contractorEvaluation/getList': loadingEvaluationList,
          'contractorEvaluation/getDetail': loadingEvaluationDetail,
          'contractorViolationRecord/getList': loadingViolationRecordList,
          'contractorViolationRecord/getDetail': loadingViolationRecordDetail,
        },
      },
    } = state;
    const isUnit = +unitType === 4;
    const { breadcrumbList } = code.split('.').reduce(
      (result, item, index, list) => {
        const key = `${result.key}.${item}`;
        const title = locales[key];
        result.key = key;
        result.breadcrumbList.push({
          title,
          name: title,
          href:
            index === list.length - 2
              ? pathname.replace(new RegExp(`${name}.*`), 'list')
              : undefined,
        });
        return result;
      },
      {
        breadcrumbList: [{ title: '首页', name: '首页', href: '/' }],
        key: 'menu',
      }
    );
    return {
      isUnit,
      unitId,
      breadcrumbList,
      detail: detail || {},
      loading: loading || false,
      mode: name,
      constructionList,
      constructionDetail,
      evaluationList,
      evaluationDetail,
      violationRecordList,
      violationRecordDetail,
      loadingList:
        loadingConstructionList || loadingEvaluationList || loadingViolationRecordList || false,
      loadingDetail:
        loadingConstructionDetail ||
        loadingEvaluationDetail ||
        loadingViolationRecordDetail ||
        false,
    };
  },
  (
    dispatch,
    {
      route: { code },
      match: {
        params: { id },
      },
    }
  ) => {
    const namespace = code.split('.').slice(-2)[0];
    const gd = 'getDetail';
    return {
      getDetail(payload, callback) {
        dispatch({
          type: `${namespace}/${gd}`,
          payload: {
            id,
            ...payload,
          },
          callback,
        });
      },
      getConstructionList(payload, callback) {
        dispatch({
          type: 'contractorConstruction/getList',
          payload: {
            contractorId: id,
            pageNum: 1,
            pageSize: getPageSize(),
            ...payload,
          },
          callback,
        });
      },
      getConstructionDetail(payload, callback) {
        dispatch({
          type: 'contractorConstruction/getDetail',
          payload,
          callback,
        });
      },
      getEvaluationList(payload, callback) {
        dispatch({
          type: 'contractorEvaluation/getList',
          payload: {
            beAssessId: id,
            pageNum: 1,
            pageSize: getPageSize(),
            ...payload,
          },
          callback,
        });
      },
      getEvaluationDetail(payload, callback) {
        dispatch({
          type: 'contractorEvaluation/getDetail',
          payload,
          callback,
        });
      },
      getViolationRecordList(payload, callback) {
        dispatch({
          type: 'contractorViolationRecord/getList',
          payload: {
            contractorId: id,
            pageNum: 1,
            pageSize: getPageSize(),
            ...payload,
          },
          callback,
        });
      },
      getViolationRecordDetail(payload, callback) {
        dispatch({
          type: 'contractorViolationRecord/getDetail',
          payload,
          callback,
        });
      },
    };
  }
)(ContractorDetail);
