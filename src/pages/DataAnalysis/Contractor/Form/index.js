import React from 'react';
import FormPage from '@/jingan-components/Page/Form';
import { CATEGORIES, TYPES, COMPANY_FIELDNAMES, COMPANY_MAPPER, FORMAT } from '../config';
import moment from 'moment';
import { phoneReg, emailReg } from '@/utils/validate';
// import styles from './index.less';

const ContractorForm = ({ route, match, location }) => {
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
    }) {
      return {
        companyId: companyId || undefined,
        contractorName: contractorName || undefined,
        contractorNature: contractorNature || undefined,
        contractorCategory: contractorCategory ? `${contractorCategory}` : undefined,
        contractorType: contractorType ? `${contractorType}` : undefined,
        businessScope: businessScope || undefined,
        contractorPhone: contractorPhone || undefined,
        contractorMail: contractorMail || undefined,
        qualificationCertificate: qualificationCertificate || undefined,
        certificateCode: certificateCode || undefined,
        certificateExpireDate: certificateExpireDate ? moment(certificateExpireDate) : undefined,
        certificateFileList: certificateFileList
          ? certificateFileList.map((item, index) => ({
              ...item,
              uid: -1 - index,
              status: 'done',
              name: item.fileName,
              url: item.webUrl,
            }))
          : undefined,
      };
    },
    transform({
      isUnit,
      unitId,
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
    }) {
      return {
        companyId: isUnit ? unitId : companyId,
        contractorName,
        contractorNature,
        contractorCategory,
        contractorType,
        businessScope,
        contractorPhone,
        contractorMail,
        qualificationCertificate,
        certificateCode,
        certificateExpireDate: certificateExpireDate && certificateExpireDate.format(FORMAT),
        certificateFileList,
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
        name: 'contractorName',
        label: '承包商单位名称',
        component: 'Input',
        enableDefaultRules: true,
      },
      {
        name: 'contractorNature',
        label: '单位性质',
        component: 'Input',
      },
      {
        name: 'contractorCategory',
        label: '承包商类别',
        component: 'Radio',
        props: {
          list: CATEGORIES,
        },
        enableDefaultRules: true,
      },
      {
        name: 'contractorType',
        label: '承包商类型',
        component: 'Radio',
        props: {
          list: TYPES,
        },
        enableDefaultRules: true,
      },
      {
        name: 'businessScope',
        label: '经营范围',
        component: 'Input',
      },
      {
        name: 'contractorPhone',
        label: '承包商电话',
        component: 'Input',
        rules: [{ pattern: phoneReg, message: '承包商电话格式不正确' }],
      },
      {
        name: 'contractorMail',
        label: '邮箱',
        component: 'Input',
        rules: [{ pattern: emailReg, message: '邮箱格式不正确' }],
      },
      {
        name: 'qualificationCertificate',
        label: '承包商资质证书',
        component: 'Input',
      },
      {
        name: 'certificateCode',
        label: '资质证书编号',
        component: 'Input',
        enableDefaultRules: true,
      },
      {
        name: 'certificateExpireDate',
        label: '资质证书到期日期',
        component: 'DatePicker',
        enableDefaultRules: true,
      },
      {
        name: 'certificateFileList',
        label: '上传资质证书附件',
        component: 'Upload',
      },
    ],
  };
  return <FormPage {...props} />;
};

export default ContractorForm;
