import React, { Fragment } from 'react';
import { Divider } from 'antd';
import TablePage from '@/jingan-components/Page/Table';
import { Badge } from '@/jingan-components/View';
import moment from 'moment';
import { RESULTS, FORMAT } from '../config';
// import styles from './index.less';

const ContractorEvaluationList = ({ route, match, location }) => {
  const props = {
    route,
    match,
    location,
    transform({ isUnit, unitId, companyName, contractorName, range, assessResult }) {
      const [assessDateStart, assessDateEnd] = range || [];
      return {
        companyId: isUnit ? unitId : undefined,
        companyName: companyName && companyName.trim(),
        contractorName: contractorName && contractorName.trim(),
        assessDateStart: assessDateStart && assessDateStart.format(FORMAT),
        assessDateEnd: assessDateEnd && assessDateEnd.format(FORMAT),
        assessResult,
        beAssessType: '1',
      };
    },
    fields: [
      {
        name: 'companyName',
        label: '单位名称',
        component: 'Input',
        hide({ isUnit }) {
          return isUnit;
        },
      },
      {
        name: 'contractorName',
        label: '被考核承包商',
        component: 'Input',
      },
      {
        name: 'range',
        label: '考核日期',
        component: 'RangePicker',
        props: {
          allowClear: true,
        },
      },
      {
        name: 'assessResult',
        label: '考核结果',
        component: 'Select',
        props: {
          list: RESULTS,
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
        title: '被考核承包商',
      },
      {
        dataIndex: 'assessTitle',
        title: '考核记录标题',
      },
      {
        dataIndex: 'assessDate',
        title: '考核日期',
        render: value => value && moment(value).format(FORMAT),
      },
      {
        dataIndex: 'assessResult',
        title: '考核结果',
        render: value => <Badge list={RESULTS} value={`${value}`} />,
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

export default ContractorEvaluationList;
