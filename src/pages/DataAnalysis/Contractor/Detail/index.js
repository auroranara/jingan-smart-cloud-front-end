import React, { useEffect, useRef } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { Spin } from 'antd';
import Form from '@/jingan-components/Form';
import { connect } from 'dva';
import router from 'umi/router';
import locales from '@/locales/zh-CN';
import moment from 'moment';
import { CATEGORIES, TYPES, COMPANY_FIELDNAMES, COMPANY_MAPPER } from '../config';
import styles from './index.less';

const ContractorDetail = props => {
  const {
    match: {
      params: { id },
    },
    breadcrumbList,
    mode,
    isUnit,
    unitId,
    getDetail,
    loading,
  } = props;
  const form = useRef(null);
  useEffect(
    () => {
      if (id) {
        getDetail(undefined, (success, data) => {
          if (success) {
            const {
              companyId,
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
      component: 'DatePicker',
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
  return (
    <PageHeaderLayout
      title={breadcrumbList[breadcrumbList.length - 1].title}
      breadcrumbList={breadcrumbList}
    >
      <Spin spinning={loading}>
        <Form ref={form} mode={mode} fields={fields} showOperation={false} />
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
      loading: {
        effects: { [`${namespace}/${gd}`]: loading },
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
    };
  }
)(ContractorDetail);
