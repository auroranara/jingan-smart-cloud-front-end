import React, { Fragment } from 'react';
import { Divider } from 'antd';
import TablePage from '@/jingan-components/Page/Table';
import moment from 'moment';
import { FORMAT } from '../config';
import { COMPANY_FIELDNAMES, COMPANY_MAPPER } from '../../Contractor/config';
import { DEPARTMENT_FIELDNAMES, DEPARTMENT_MAPPER } from '../../ContractorEvaluation/config';
// import styles from './index.less';

const SupplierEvaluationList = ({ route, match, location }) => {
  const props = {
    route,
    match,
    location,
    transform({ isUnit, unitId, companyId, supplierName, queryAssessDepartmentId, range }) {
      const [assessDateStart, assessDateEnd] = range || [];
      return {
        companyId: isUnit ? unitId : companyId,
        supplierName: supplierName && supplierName.trim(),
        queryAssessDepartmentId,
        assessDateStart: assessDateStart && assessDateStart.format(FORMAT),
        assessDateEnd: assessDateEnd && assessDateEnd.format(FORMAT),
        beAssessType: '2',
      };
    },
    fields: [
      {
        name: 'companyId',
        label: '单位名称',
        component: 'Select',
        props: {
          fieldNames: COMPANY_FIELDNAMES,
          mapper: COMPANY_MAPPER,
          showSearch: true,
          filterOption: false,
          allowClear: true,
        },
        hide({ isUnit }) {
          return isUnit;
        },
      },
      {
        name: 'supplierName',
        label: '供应商公司名称',
        component: 'Input',
      },
      {
        name: 'queryAssessDepartmentId',
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
            allowClear: true,
            key,
          };
        },
        hide({ isUnit, companyId }) {
          return !isUnit && !companyId;
        },
      },
      {
        name: 'range',
        label: '考核日期',
        component: 'RangePicker',
        props: {
          allowClear: true,
        },
      },
    ],
    columns: ({ isUnit, renderDetailButton, renderEditButton, renderDeleteButton }) => [
      ...(!isUnit
        ? [
            {
              dataIndex: 'companyName',
              title: '单位名称',
            },
          ]
        : []),
      {
        dataIndex: 'supplierName',
        title: '供应商公司名称',
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
      {
        dataIndex: '操作',
        title: '操作',
        fixed: 'right',
        width: 150,
        render: (_, data) => (
          <Fragment>
            {renderDetailButton(data)}
            <Divider type="vertical" />
            {renderEditButton(data)}
            <Divider type="vertical" />
            {renderDeleteButton(data)}
          </Fragment>
        ),
      },
    ],
  };
  return <TablePage {...props} />;
};

export default SupplierEvaluationList;
