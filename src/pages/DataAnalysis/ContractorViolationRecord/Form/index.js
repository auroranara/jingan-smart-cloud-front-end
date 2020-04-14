import React from 'react';
import FormPage from '@/jingan-components/Page/Form';
import moment from 'moment';
import { FORMAT } from '../config';
import { COMPANY_FIELDNAMES, COMPANY_MAPPER } from '../../Contractor/config';
import { CONTRACTOR_FIELDNAMES, CONTRACTOR_MAPPER } from '../../ContractorConstruction/config';
// import styles from './index.less';

const ContractorViolationRecordForm = ({
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
      contractorId,
      projectName,
      violationDate,
      violators,
      processingResult,
    }) {
      return {
        companyId: companyId || undefined,
        contractorId: contractorId || undefined,
        projectName: projectName || undefined,
        violationDate: violationDate ? moment(violationDate) : undefined,
        violators: violators ? violators.split(',') : undefined,
        processingResult: processingResult || undefined,
      };
    },
    transform({
      isUnit,
      unitId,
      companyId,
      contractorId,
      projectName,
      violationDate,
      violators,
      processingResult,
    }) {
      return {
        companyId: isUnit ? unitId : companyId,
        contractorId,
        projectName,
        violationDate: violationDate && violationDate.format(FORMAT),
        violators: violators && violators.join(','),
        processingResult,
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
        onChange() {
          return {
            contractorId: undefined,
          };
        },
        enableDefaultRules: true,
      },
      {
        name: 'contractorId',
        label: '所属承包商',
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
        name: 'projectName',
        label: '项目名称',
        component: 'Input',
      },
      {
        name: 'violationDate',
        label: '违章日期',
        component: 'DatePicker',
        enableDefaultRules: true,
      },
      {
        name: 'violators',
        label: '违章人姓名',
        component: 'Select',
        props: {
          originalMode: 'tags',
          notFoundContent: null,
          showArrow: false,
          showSearch: true,
          separator: '、',
        },
        enableDefaultRules: true,
      },
      {
        name: 'processingResult',
        label: '处理结果',
        component: 'Input',
      },
    ],
  };
  return <FormPage {...props} />;
};

export default ContractorViolationRecordForm;
