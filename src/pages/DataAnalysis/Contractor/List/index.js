import React, { Fragment } from 'react';
import { Divider } from 'antd';
import TablePage from '@/jingan-components/Page/Table';
import { Select } from '@/jingan-components/Form';
import { Badge } from '@/jingan-components/View';
import { CATEGORIES, TYPES, STATUSES } from '../config';
import { isNumber } from '@/utils/utils';
// import styles from './index.less';

const ContractorList = ({ route, match, location }) => {
  const props = {
    route,
    match,
    location,
    transform({
      companyName,
      contractorName,
      contractorCategory,
      contractorType,
      certificateExpireStatus,
    }) {
      return {
        companyName: companyName && companyName.trim(),
        contractorName: contractorName && contractorName.trim(),
        contractorCategory,
        contractorType,
        certificateExpireStatus,
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
            },
          ]
        : []),
      {
        dataIndex: 'contractorName',
        title: '承包商单位名称',
      },
      {
        dataIndex: 'contractorCategory',
        title: '承包商类别',
        render: value =>
          isNumber(value) && (
            <Select
              list={CATEGORIES}
              value={`${value}`}
              mode="detail"
              empty={null}
              ellipsis={false}
            />
          ),
      },
      {
        dataIndex: 'contractorType',
        title: '承包商类型',
        render: value =>
          isNumber(value) && (
            <Select list={TYPES} value={`${value}`} mode="detail" empty={null} ellipsis={false} />
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
