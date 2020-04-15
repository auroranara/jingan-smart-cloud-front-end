import React from 'react';
import FormPage from '@/jingan-components/Page/Form';
import Content from '../components/Content';
import { COMPANY_FIELDNAMES, COMPANY_MAPPER, CLASSIFICATIONS } from '../config';
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
    initialize({ companyId, title, scope, classification, score, project, content }) {
      return {
        companyId: companyId || undefined,
        title: title || undefined,
        scope: scope || undefined,
        classification: isNumber(classification) ? `${classification}` : undefined,
        score: score || undefined,
        project: project || undefined,
        content: content ? JSON.parse(content) : undefined,
      };
    },
    transform({
      isUnit,
      unitId,
      companyId,
      title,
      scope,
      classification,
      score,
      project,
      content,
    }) {
      return {
        companyId: isUnit ? unitId : companyId,
        title,
        scope,
        classification,
        score,
        project,
        content: content && JSON.stringify(content),
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
        name: 'title',
        label: '标准标题',
        component: 'TextArea',
        enableDefaultRules: true,
      },
      {
        name: 'scope',
        label: '适用范围',
        component: 'TextArea',
        enableDefaultRules: true,
      },
      {
        name: 'classification',
        label: '标准分类',
        component: 'Select',
        props: {
          list: CLASSIFICATIONS,
        },
        hide({ isUnit }) {
          return isUnit;
        },
        enableDefaultRules: true,
      },
      {
        name: 'score',
        label: '分值（分）',
        component: 'Input',
        enableDefaultRules: true,
      },
      {
        name: 'project',
        label: '考核项目',
        component: 'Input',
        enableDefaultRules: true,
      },
      {
        name: 'content',
        label: '考核内容',
        component: Content,
      },
    ],
  };
  return <FormPage {...props} />;
};

export default ContractorForm;
