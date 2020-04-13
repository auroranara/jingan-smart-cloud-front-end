import React from 'react';
import FormPage from '@/jingan-components/Page/Form';
import moment from 'moment';
import { RESULTS, DEPARTMENT_FIELDNAMES, DEPARTMENT_MAPPER, FORMAT } from '../config';
import { COMPANY_FIELDNAMES, COMPANY_MAPPER } from '../../Contractor/config';
import { CONTRACTOR_FIELDNAMES, CONTRACTOR_MAPPER } from '../../ContractorConstruction/config';
import { isNumber } from '@/utils/utils';
// import styles from './index.less';

const ContractorEvaluationForm = ({ route, match, location }) => {
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
      assessTitle,
      beAssessId,
      contractorPlant,
      contractorPlantStatus,
      approveBeforeType,
      approveConfirmType,
      assessDepartmentId,
      assessDate,
      assessScore,
      assessResult,
    }) {
      return {
        companyId: companyId || undefined,
        assessTitle: assessTitle || undefined,
        beAssessId: beAssessId || undefined,
        contractorPlant: contractorPlant || undefined,
        contractorPlantStatus: contractorPlantStatus || undefined,
        approveBeforeType: approveBeforeType || undefined,
        approveConfirmType: approveConfirmType || undefined,
        assessDepartmentId: assessDepartmentId || undefined,
        assessDate: assessDate ? moment(assessDate) : undefined,
        assessScore: assessScore || undefined,
        assessResult: isNumber(assessResult) ? `${assessResult}` : undefined,
      };
    },
    transform({
      isUnit,
      unitId,
      companyId,
      assessTitle,
      beAssessId,
      contractorPlant,
      contractorPlantStatus,
      approveBeforeType,
      approveConfirmType,
      assessDepartmentId,
      assessDate,
      assessScore,
      assessResult,
    }) {
      return {
        companyId: isUnit ? unitId : companyId,
        assessTitle,
        beAssessId,
        contractorPlant,
        contractorPlantStatus,
        approveBeforeType,
        approveConfirmType,
        assessDepartmentId,
        assessDate: assessDate && assessDate.format(FORMAT),
        assessScore,
        assessResult,
        beAssessType: '1',
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
        name: 'assessTitle',
        label: '考核记录标题',
        component: 'Input',
      },
      {
        name: 'beAssessId',
        label: '被考核承包商',
        component: 'Select',
        dependencies: ['companyId'],
        props({ mode, isUnit, unitId, companyId }) {
          const key = isUnit ? unitId : companyId;
          return {
            fieldNames: CONTRACTOR_FIELDNAMES,
            mapper: CONTRACTOR_MAPPER,
            showSearch: true,
            filterOption: false,
            params: {
              companyId: key,
            },
            disabled: mode === 'edit',
            key,
          };
        },
        hide({ isUnit, companyId }) {
          return !isUnit && !companyId;
        },
        enableDefaultRules: true,
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
        dependencies: ['companyId'],
        props({ isUnit, unitId, companyId }) {
          const key = isUnit ? unitId : companyId;
          return {
            fieldNames: DEPARTMENT_FIELDNAMES,
            mapper: DEPARTMENT_MAPPER,
            params: {
              companyId: key,
            },
            key, // 注意这里很关键，由于Select和TreeSelect的限制，在params发生变化时不会触发更新，所以通过key来强制渲染
          };
        },
        hide({ isUnit, companyId }) {
          return !isUnit && !companyId;
        },
      },
      {
        name: 'assessDate',
        label: '实际考核日期',
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
        component: 'Radio',
        props: {
          list: RESULTS,
        },
        enableDefaultRules: true,
      },
    ],
  };
  return <FormPage {...props} />;
};

export default ContractorEvaluationForm;
