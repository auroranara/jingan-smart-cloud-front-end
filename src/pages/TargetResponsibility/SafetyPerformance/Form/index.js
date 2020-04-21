import React from 'react';
import FormPage from '@/jingan-components/Page/Form';
import moment from 'moment';
import {
  COMPANY_FIELDNAMES,
  COMPANY_MAPPER,
  DEPARTMENT_FIELDNAMES,
  DEPARTMENT_MAPPER,
  RESULTS,
  FORMAT,
} from '../config';
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
      title,
      date,
      departmentId,
      departmentId2,
      person,
      standard,
      score,
      result,
      attachment,
      remark,
    }) {
      return {
        companyId: companyId || undefined,
        title: title || undefined,
        date: date ? moment(date) : undefined,
        departmentId: departmentId || undefined,
        departmentId2: departmentId2 || undefined,
        person: person || undefined,
        score: score || undefined,
        result: isNumber(result) ? result : undefined,
        attachment: attachment
          ? attachment.map((item, index) => ({
              ...item,
              uid: -1 - index,
              status: 'done',
              name: item.fileName,
              url: item.webUrl,
            }))
          : undefined,
        remark: remark || undefined,
      };
    },
    transform({
      isUnit,
      unitId,
      companyId,
      title,
      date,
      departmentId,
      departmentId2,
      person,
      standard,
      score,
      result,
      attachment,
      remark,
    }) {
      return {
        companyId: isUnit ? unitId : companyId,
        title,
        date: date && date.format(FORMAT),
        departmentId,
        departmentId2,
        person,
        standard,
        score,
        result,
        attachment,
        remark,
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
        label: '考核标题',
        component: 'TextArea',
        enableDefaultRules: true,
      },
      {
        name: 'date',
        label: '考核日期',
        component: 'DatePicker',
        enableDefaultRules: true,
      },
      {
        name: 'departmentId',
        label: '考核部门',
        component: 'TreeSelect',
        dependencies: ['companyId'],
        props({ isUnit, unitId, companyId, departmentId, departmentName, mode }) {
          const key = isUnit ? unitId : companyId;
          return {
            fieldNames: DEPARTMENT_FIELDNAMES,
            mapper: DEPARTMENT_MAPPER,
            params: {
              companyId: key,
            },
            key,
            data:
              mode !== 'add'
                ? {
                    key: departmentId,
                    value: departmentId,
                    label: departmentName,
                  }
                : undefined,
          };
        },
        hide({ isUnit, companyId }) {
          return !isUnit && !companyId;
        },
        enableDefaultRules: true,
      },
      {
        name: 'departmentId2',
        label: '被考核部门',
        component: 'TreeSelect',
        dependencies: ['companyId'],
        props({ isUnit, unitId, companyId, departmentId2, departmentName, mode }) {
          const key = isUnit ? unitId : companyId;
          return {
            fieldNames: DEPARTMENT_FIELDNAMES,
            mapper: DEPARTMENT_MAPPER,
            params: {
              companyId: key,
            },
            key,
            data:
              mode !== 'add'
                ? {
                    key: departmentId2,
                    value: departmentId2,
                    label: departmentName,
                  }
                : undefined,
          };
        },
        hide({ isUnit, companyId }) {
          return !isUnit && !companyId;
        },
        enableDefaultRules: true,
      },
      {
        name: 'person',
        label: '填报人',
        component: 'PersonModal',
        props: {
          title: '选择填报人',
        },
        enableDefaultRules: true,
      },
      {
        name: 'score',
        label: '总分（分）',
        component: 'InputNumber',
        enableDefaultRules: true,
      },
      {
        name: 'result',
        label: '考核结果',
        component: 'Radio',
        props: {
          list: RESULTS,
        },
        enableDefaultRules: true,
      },
      {
        name: 'attachment',
        label: '附件',
        component: 'Upload',
      },
      {
        name: 'remark',
        label: '备注',
        component: 'TextArea',
      },
    ],
  };
  return <FormPage {...props} />;
};

export default ContractorForm;
