import React from 'react';
import FormPage from '@/jingan-components/Page/Form';
import moment from 'moment';
import { SUPPLIER_FIELDNAMES, SUPPLIER_MAPPER, FORMAT } from '../config';
import { COMPANY_FIELDNAMES, COMPANY_MAPPER } from '../../Contractor/config';
import { DEPARTMENT_FIELDNAMES, DEPARTMENT_MAPPER } from '../../ContractorEvaluation/config';
// import styles from './index.less';

const SupplierEvaluationForm = ({ route, match, location }) => {
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
      beAssessId,
      assessDepartmentId,
      assessDate,
      assessScore,
      assessResult,
    }) {
      return {
        companyId: companyId || undefined,
        beAssessId: beAssessId || undefined,
        assessDepartmentId: assessDepartmentId || undefined,
        assessDate: assessDate ? moment(assessDate) : undefined,
        assessScore: assessScore || undefined,
        assessResult: assessResult || undefined,
      };
    },
    transform({
      isUnit,
      unitId,
      companyId,
      beAssessId,
      assessDepartmentId,
      assessDate,
      assessScore,
      assessResult,
    }) {
      return {
        companyId: isUnit ? unitId : companyId,
        beAssessId,
        assessDepartmentId,
        assessDate: assessDate && assessDate.format(FORMAT),
        assessScore,
        assessResult,
        beAssessType: '2',
      };
    },
    initialValues: {
      assessDate: moment(),
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
        onChange() {
          return {
            beAssessId: undefined,
            assessDepartmentId: undefined,
          };
        },
        enableDefaultRules: true,
      },
      {
        name: 'beAssessId',
        label: '被考核供应商',
        component: 'Select',
        dependencies: ['companyId'],
        props({ mode, isUnit, unitId, companyId, beAssessId, supplierName }) {
          const key = isUnit ? unitId : companyId;
          return {
            fieldNames: SUPPLIER_FIELDNAMES,
            mapper: SUPPLIER_MAPPER,
            showSearch: true,
            filterOption: false,
            params: {
              companyId: key,
            },
            disabled: mode === 'edit',
            extraList: [
              {
                id: beAssessId,
                supplierName,
              },
            ],
            key,
          };
        },
        hide({ isUnit, companyId }) {
          return !isUnit && !companyId;
        },
        enableDefaultRules: true,
      },
      {
        name: 'assessDepartmentId',
        label: '考核部门',
        component: 'TreeSelect',
        dependencies: ['companyId'],
        props({ isUnit, unitId, companyId }) {
          const key = isUnit ? unitId : companyId;
          return {
            fieldNames: DEPARTMENT_FIELDNAMES,
            mapper: DEPARTMENT_MAPPER,
            params: {
              companyId: key,
            },
            key,
          };
        },
        hide({ isUnit, companyId }) {
          return !isUnit && !companyId;
        },
      },
      {
        name: 'assessDate',
        label: '考核日期',
        component: 'DatePicker',
        enableDefaultRules: true,
      },
      {
        name: 'assessScore',
        label: '总分',
        component: 'Input',
        enableDefaultRules: true,
      },
      {
        name: 'assessResult',
        label: '考核结果',
        component: 'TextArea',
      },
    ],
  };
  return <FormPage {...props} />;
};

export default SupplierEvaluationForm;
