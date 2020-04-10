import React, { useEffect, useRef } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { Spin, Card } from 'antd';
import Form from '@/jingan-components/Form';
import { Table } from '@/jingan-components/View';
import DueDate from '../../Contractor/components/DueDate';
import { connect } from 'dva';
import locales from '@/locales/zh-CN';
import moment from 'moment';
import { FORMAT, STATUSES, YES_OR_NO } from '../config';
import { getPageSize, setPageSize } from '@/utils/utils';
import { isNumber } from '@/utils/utils';
import styles from './index.less';

const SupplierDetail = props => {
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
    detail: { companyName },
    evaluationList,
    getEvaluationList,
    loadingList,
  } = props;
  const form = useRef(null);
  useEffect(
    () => {
      if (id) {
        getDetail(undefined, (success, data) => {
          if (success) {
            const {
              supplierName,
              contractorCategory,
              contractorType,
              riskLevel,
              businessScope,
              supplierDesc,
              supplierAddress,
              supplierPostal,
              supplierContact,
              supplierContactPhone,
              certificateName,
              certificateCode,
              certificateExpireType,
              certificateGetDate,
              certificateExpireDate,
            } = data;
            form.current.setFieldsValue({
              supplierName: supplierName || undefined,
              contractorCategory: contractorCategory || undefined,
              contractorType: contractorType || undefined,
              riskLevel: riskLevel || undefined,
              businessScope: businessScope || undefined,
              supplierDesc: supplierDesc || undefined,
              supplierAddress: supplierAddress || undefined,
              supplierPostal: supplierPostal || undefined,
              supplierContact: supplierContact || undefined,
              supplierContactPhone: supplierContactPhone || undefined,
              certificateName: certificateName || undefined,
              certificateCode: certificateCode || undefined,
              certificateExpireType: isNumber(certificateExpireType)
                ? `${certificateExpireType}`
                : undefined,
              certificateGetDate: certificateGetDate ? moment(certificateGetDate) : undefined,
              certificateExpireDate: certificateExpireDate
                ? moment(certificateExpireDate)
                : undefined,
            });
          }
        });
        getEvaluationList();
      }
      window.scrollTo(0, 0);
    },
    [id]
  );
  const fields = [
    {
      name: 'supplierName',
      label: '供应商公司名称',
      component: 'Input',
      col: {
        span: 8,
      },
    },
    {
      name: 'contractorCategory',
      label: '供应商类型',
      component: 'Input',
      col: {
        span: 8,
      },
    },
    {
      name: 'contractorType',
      label: '供应商类别',
      component: 'Input',
      col: {
        span: 8,
      },
    },
    {
      name: 'riskLevel',
      label: '供应商风险评级',
      component: 'Input',
      col: {
        span: 8,
      },
    },
    {
      name: 'supplierDesc',
      label: '公司描述',
      component: 'Input',
      col: {
        span: 8,
      },
    },
    {
      name: 'supplierAddress',
      label: '公司地址',
      component: 'Input',
      col: {
        span: 8,
      },
    },
    {
      name: 'supplierPostal',
      label: '邮政编码',
      component: 'Input',
      col: {
        span: 8,
      },
    },
    {
      name: 'supplierContact',
      label: '联系人',
      component: 'Input',
      col: {
        span: 8,
      },
    },
    {
      name: 'supplierContactPhone',
      label: '联系人电话',
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
      name: 'certificateName',
      label: '证书名称',
      component: 'Input',
      col: {
        span: 8,
      },
    },
    {
      name: 'certificateCode',
      label: '证书编号',
      component: 'Input',
      col: {
        span: 8,
      },
    },
    {
      name: 'certificateExpireType',
      label: '是否有有效期',
      component: 'Radio',
      props: {
        list: YES_OR_NO,
      },
      col: {
        span: 8,
      },
    },
    {
      name: 'certificateGetDate',
      label: '取证日期',
      component: 'DatePicker',
      dependencies: ['certificateExpireType'],
      hide({ certificateExpireType }) {
        return certificateExpireType !== YES_OR_NO[0].key;
      },
      col: {
        span: 8,
      },
    },
    {
      name: 'certificateExpireDate',
      label: '到期日期',
      component: DueDate,
      dependencies: ['certificateExpireType'],
      props({ certificateExpireStatus }) {
        return {
          list: STATUSES,
          status: certificateExpireStatus,
        };
      },
      hide({ certificateExpireType }) {
        return certificateExpireType !== YES_OR_NO[0].key;
      },
      col: {
        span: 8,
      },
    },
  ];
  const list = evaluationList;
  const columns = [
    {
      dataIndex: 'createTime',
      title: '创建时间',
      render: value => value && moment(value).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      dataIndex: 'assessDepartmentName',
      title: '考核部门',
    },
    {
      dataIndex: 'assessDate',
      title: '考核日期',
      render: value => value && moment(value).format(FORMAT),
    },
    {
      dataIndex: 'assessScore',
      title: '总分',
    },
    {
      dataIndex: 'assessResult',
      title: '考核结果',
    },
  ];
  return (
    <PageHeaderLayout
      title={breadcrumbList[breadcrumbList.length - 1].title}
      breadcrumbList={breadcrumbList}
      content={!isUnit && companyName}
    >
      <Spin spinning={loading}>
        <Form ref={form} mode={mode} fields={fields} showOperation={false} params={detail} />
        <Card className={styles.card} title="考核记录">
          <Table
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
              getEvaluationList(payload);
              pageSize !== prevPageSize && setPageSize(pageSize);
            }}
            // onReload={() => {
            //   const { pagination: { pageNum = 1, pageSize = getPageSize() } = {} } = list || {};
            //   const payload = {
            //     pageNum,
            //     pageSize,
            //   };
            //   getEvaluationList(payload);
            // }}
          />
        </Card>
      </Spin>
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
      supplierEvaluation: { list: evaluationList, detail: evaluationDetail },
      loading: {
        effects: {
          [`${namespace}/${gd}`]: loading,
          'supplierEvaluation/getList': loadingEvaluationList,
          'supplierEvaluation/getDetail': loadingEvaluationDetail,
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
      evaluationList,
      evaluationDetail,
      loadingList: loadingEvaluationList || false,
      loadingDetail: loadingEvaluationDetail || false,
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
      getEvaluationList(payload, callback) {
        dispatch({
          type: 'supplierEvaluation/getList',
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
          type: 'supplierEvaluation/getDetail',
          payload,
          callback,
        });
      },
    };
  }
)(SupplierDetail);
