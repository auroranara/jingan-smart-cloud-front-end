import React, { Fragment } from 'react';
import { Divider } from 'antd';
import TablePage from '@/jingan-components/Page/Table';
import { Badge } from '@/jingan-components/View';
import moment from 'moment';
import { YES_OR_NO, FORMAT } from '../config';
// import styles from './index.less';

const ContractorConstructionList = ({ route, match, location }) => {
  const props = {
    route,
    match,
    location,
    transform({ companyName, contractorName, range, blacklistStatus }) {
      const [enteringDateStart, enteringDateEnd] = range || [];
      return {
        companyName: companyName && companyName.trim(),
        contractorName: contractorName && contractorName.trim(),
        enteringDateStart: enteringDateStart && enteringDateStart.format(FORMAT),
        enteringDateEnd: enteringDateEnd && enteringDateEnd.format(FORMAT),
        blacklistStatus,
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
        label: '承包商单位名称',
        component: 'Input',
      },
      {
        name: 'range',
        label: '进场日期',
        component: 'RangePicker',
        props: {
          allowClear: true,
        },
      },
      {
        name: 'blacklistStatus',
        label: '是否在黑名单',
        component: 'Select',
        props: {
          list: YES_OR_NO,
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
        dataIndex: 'expireDate',
        title: '责任书到期日期',
        render: value => value && moment(value).format(FORMAT),
      },
      {
        dataIndex: 'enteringDate',
        title: '进场日期',
        render: value => value && moment(value).format(FORMAT),
      },
      {
        dataIndex: 'blacklistStatus',
        title: '是否在黑名单',
        render: value => <Badge list={YES_OR_NO} value={`${value}`} />,
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

export default ContractorConstructionList;
