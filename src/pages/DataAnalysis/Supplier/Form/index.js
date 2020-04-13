import React from 'react';
import FormPage from '@/jingan-components/Page/Form';
import moment from 'moment';
import { FORMAT, YES_OR_NO } from '../config';
import { COMPANY_FIELDNAMES, COMPANY_MAPPER } from '../../Contractor/config';
import { phoneReg, postcodeReg } from '@/utils/validate';
import { isNumber } from '@/utils/utils';
// import styles from './index.less';

const SupplierForm = ({ route, match, location }) => {
  const props = {
    route,
    match,
    location,
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 12,
    },
    initialize({
      companyId,
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
    }) {
      return {
        companyId: companyId || undefined,
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
        certificateExpireDate: certificateExpireDate ? moment(certificateExpireDate) : undefined,
      };
    },
    transform({
      isUnit,
      unitId,
      companyId,
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
    }) {
      return {
        companyId: isUnit ? unitId : companyId,
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
        certificateGetDate: certificateGetDate && certificateGetDate.format(FORMAT),
        certificateExpireDate: certificateExpireDate && certificateExpireDate.format(FORMAT),
      };
    },
    fields: [
      {
        name: 'companyId',
        label: '单位名称',
        component: 'Select',
        props({ mode }) {
          return {
            fieldNames: COMPANY_FIELDNAMES,
            mapper: COMPANY_MAPPER,
            showSearch: true,
            filterOption: false,
            disabled: mode === 'edit',
          };
        },
        hide({ isUnit }) {
          return isUnit;
        },
        enableDefaultRules: true,
      },
      {
        name: 'supplierName',
        label: '供应商公司名称',
        component: 'Input',
        enableDefaultRules: true,
      },
      {
        name: 'contractorCategory',
        label: '供应商类型',
        component: 'Input',
      },
      {
        name: 'contractorType',
        label: '供应商类别',
        component: 'Input',
      },
      {
        name: 'riskLevel',
        label: '供应商风险评级',
        component: 'Input',
      },
      {
        name: 'businessScope',
        label: '经营范围',
        component: 'Input',
      },
      {
        name: 'supplierDesc',
        label: '公司描述',
        component: 'Input',
      },
      {
        name: 'supplierAddress',
        label: '公司地址',
        component: 'Input',
      },
      {
        name: 'supplierPostal',
        label: '邮政编码',
        component: 'Input',
        rules: [{ pattern: postcodeReg, message: '邮政编码格式不正确' }],
      },
      {
        name: 'supplierContact',
        label: '联系人',
        component: 'Input',
      },
      {
        name: 'supplierContactPhone',
        label: '联系人电话',
        component: 'Input',
        rules: [{ pattern: phoneReg, message: '联系人电话格式不正确' }],
      },
      {
        name: 'certificateName',
        label: '证书名称',
        component: 'Input',
      },
      {
        name: 'certificateCode',
        label: '证书编号',
        component: 'Input',
      },
      {
        name: 'certificateExpireType',
        label: '是否有有效期',
        component: 'Radio',
        props: {
          list: YES_OR_NO,
        },
        enableDefaultRules: true,
      },
      {
        name: 'certificateGetDate',
        label: '取证日期',
        component: 'DatePicker',
        dependencies: ['certificateExpireType'],
        hide({ certificateExpireType }) {
          return certificateExpireType !== YES_OR_NO[0].key;
        },
        enableDefaultRules: true,
      },
      {
        name: 'certificateExpireDate',
        label: '到期日期',
        component: 'DatePicker',
        dependencies: ['certificateExpireType', 'certificateGetDate'],
        rules: [
          ({ getFieldValue }) => ({
            validator(rule, value) {
              const date = getFieldValue('certificateGetDate');
              if (!value || !date || +value.startOf('day') >= +date.startOf('day')) {
                return Promise.resolve();
              }
              return Promise.reject('到期日期必须晚于取证日期');
            },
          }),
        ],
        hide({ certificateExpireType }) {
          return certificateExpireType !== YES_OR_NO[0].key;
        },
        enableDefaultRules: true,
      },
    ],
  };
  return <FormPage {...props} />;
};

export default SupplierForm;
