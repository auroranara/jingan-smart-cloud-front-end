import React, { Fragment } from 'react';
import { Divider } from 'antd';
import TablePage from '@/jingan-components/Page/Table';
import moment from 'moment';
import { FORMAT } from '../config';
import { COMPANY_FIELDNAMES, COMPANY_MAPPER } from '../../Contractor/config';
// import styles from './index.less';

const ContractorViolationRecordList = ({ route, match, location }) => {
  const props = {
    route,
    match,
    location,
    transform({ isUnit, unitId, companyId, contractorName, range }) {
      const [violationDateStart, violationDateEnd] = range || [];
      return {
        companyId: isUnit ? unitId : companyId,
        contractorName: contractorName && contractorName.trim(),
        violationDateStart: violationDateStart && violationDateStart.format(FORMAT),
        violationDateEnd: violationDateEnd && violationDateEnd.format(FORMAT),
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
        name: 'contractorName',
        label: '承包商单位名称',
        component: 'Input',
      },
      {
        name: 'range',
        label: '违章日期',
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
        dataIndex: 'contractorName',
        title: '承包商单位名称',
      },
      {
        dataIndex: 'projectName',
        title: '项目名称',
      },
      {
        dataIndex: 'violationDate',
        title: '违章日期',
        render: value => value && moment(value).format(FORMAT),
      },
      {
        dataIndex: 'violators',
        title: '违章人姓名',
        render: value => value && value.split(',').join('、'),
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

export default ContractorViolationRecordList;
