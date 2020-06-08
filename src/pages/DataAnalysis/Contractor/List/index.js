import React, { Fragment } from 'react';
import { Divider } from 'antd';
import TablePage from '@/jingan-components/Page/Table';
import { Select } from '@/jingan-components/Form';
import { Badge, EmptyText } from '@/jingan-components/View';
import { CATEGORIES, TYPES, STATUSES, COMPANY_FIELDNAMES, COMPANY_MAPPER } from '../config';
import { isNumber } from '@/utils/utils';
// import styles from './index.less';

const ContractorList = ({ route, match, location }) => {
  const props = {
    route,
    match,
    location,
    transform({
      isUnit,
      unitId,
      companyId,
      contractorName,
      contractorCategory,
      contractorType,
      certificateExpireStatus,
    }) {
      return {
        companyId: isUnit ? unitId : companyId,
        contractorName: contractorName && contractorName.trim(),
        contractorCategory,
        contractorType,
        certificateExpireStatus,
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
        name: 'contractorCategory',
        label: '承包商类别',
        component: 'Select',
        props: {
          list: CATEGORIES,
          allowClear: true,
        },
      },
      {
        name: 'contractorType',
        label: '承包商类型',
        component: 'Select',
        props: {
          list: TYPES,
          allowClear: true,
        },
      },
      {
        name: 'certificateExpireStatus',
        label: '资质证书状态',
        component: 'Select',
        props: {
          list: STATUSES,
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
        dataIndex: 'contractorCategory',
        title: '承包商类别',
        render: value =>
          isNumber(value) ? (
            <Select list={CATEGORIES} value={`${value}`} mode="detail" ellipsis={false} />
          ) : (
            <EmptyText />
          ),
      },
      {
        dataIndex: 'contractorType',
        title: '承包商类型',
        render: value =>
          isNumber(value) ? (
            <Select list={TYPES} value={`${value}`} mode="detail" ellipsis={false} />
          ) : (
            <EmptyText />
          ),
      },
      {
        dataIndex: 'certificateExpireStatus',
        title: '资质证书状态',
        render: value => <Badge list={STATUSES} value={`${value}`} />,
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

export default ContractorList;
