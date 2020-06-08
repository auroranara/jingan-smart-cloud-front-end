import React from 'react';
import FormPage from '@/jingan-components/Page/Form';
import Content from '../components/Content';
import { CLASSIFICATIONS } from '../config';
import { isNumber } from '@/utils/utils';
// import styles from './index.less';

const ContractorForm = ({
  route,
  match,
  location,
  match: {
    params: { id },
  },
}) => {
  const props = {
    key: id,
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
      companyName,
      standardTitle,
      applyScope,
      standardType,
      passScore,
      examProject,
      contentList,
    }) {
      return {
        company: companyId ? { key: companyId, value: companyId, label: companyName } : undefined,
        standardTitle: standardTitle || undefined,
        applyScope: applyScope || undefined,
        standardType: isNumber(standardType) ? `${standardType}` : undefined,
        passScore: passScore || undefined,
        examProject: examProject || undefined,
        contentList: contentList || undefined,
      };
    },
    transform({
      isUnit,
      unitId,
      company,
      standardTitle,
      applyScope,
      standardType,
      passScore,
      examProject,
      contentList,
    }) {
      return {
        companyId: isUnit ? unitId : company && company.key,
        standardTitle,
        applyScope,
        standardType,
        passScore,
        examProject,
        contentList,
      };
    },
    fields: [
      {
        name: 'company',
        label: '单位名称',
        component: 'Select',
        props({ mode }) {
          return {
            preset: 'company',
            labelInValue: true,
            disabled: mode === 'edit',
          };
        },
        hide({ isUnit }) {
          return isUnit;
        },
        enableDefaultRules: true,
      },
      {
        name: 'standardTitle',
        label: '标准标题',
        component: 'TextArea',
        props: {
          maxLength: 50,
        },
        enableDefaultRules: true,
      },
      {
        name: 'applyScope',
        label: '适用范围',
        component: 'TextArea',
        props: {
          maxLength: 50,
        },
        enableDefaultRules: true,
      },
      {
        name: 'standardType',
        label: '标准分类',
        component: 'Select',
        props: {
          list: CLASSIFICATIONS,
        },
        enableDefaultRules: true,
      },
      {
        name: 'passScore',
        label: '合格分数（分）',
        component: 'InputNumber',
        props: {
          min: 0,
          max: 100,
          precision: 0,
        },
        enableDefaultRules: true,
      },
      {
        name: 'examProject',
        label: '考核项目',
        component: 'Input',
        props: {
          maxLength: 25,
        },
        enableDefaultRules: true,
      },
      {
        name: 'contentList',
        label: '考核内容',
        component: Content,
        wrapperCol: { span: 18 },
      },
    ],
  };
  return <FormPage {...props} />;
};

export default ContractorForm;
