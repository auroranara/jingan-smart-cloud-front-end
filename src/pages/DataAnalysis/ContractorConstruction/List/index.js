import React, { Fragment } from 'react';
import { Divider } from 'antd';
import TablePage from '@/jingan-components/Page/Table';
import { Badge, EmptyText } from '@/jingan-components/View';
import moment from 'moment';
import { YES_OR_NO, FORMAT } from '../config';
import { COMPANY_FIELDNAMES, COMPANY_MAPPER } from '../../Contractor/config';
// import styles from './index.less';

const ContractorConstructionList = ({ route, match, location }) => {
  const props = {
    route,
    match,
    location,
    transform({ isUnit, unitId, companyId, contractorName, range, blacklistStatus }) {
      const [enteringDateStart, enteringDateEnd] = range || [];
      return {
        companyId: isUnit ? unitId : companyId,
        contractorName: contractorName && contractorName.trim(),
        enteringDateStart: enteringDateStart && enteringDateStart.format(FORMAT),
        enteringDateEnd: enteringDateEnd && enteringDateEnd.format(FORMAT),
        blacklistStatus,
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
        label: '进厂日期',
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
              render: value => value || <EmptyText />,
            },
          ]
        : []),
      {
        dataIndex: 'contractorName',
        title: '承包商单位名称',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'expireDate',
        title: '责任书到期日期',
        render: value => (value ? moment(value).format(FORMAT) : <EmptyText />),
      },
      {
        dataIndex: 'enteringDate',
        title: '进厂日期',
        render: value => (value ? moment(value).format(FORMAT) : <EmptyText />),
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
