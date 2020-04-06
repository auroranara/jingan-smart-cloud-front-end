import React, { Fragment, useRef } from 'react';
import { Divider } from 'antd';
import TablePage from '@/jingan-components/Page/Table';
import { Select } from '@/jingan-components/Form';
import { CATEGORIES, TYPES, STATUSES, COMPANY_FIELDNAMES, COMPANY_MAPPER } from '../config';
import styles from './index.less';

const ContractorList = ({ route, match, location }) => {
  const formRef = useRef(null);
  const props = {
    route,
    match,
    location,
    transform(values) {
      console.log(values);
      console.log(formRef);
      return {
        name: values.companyName,
      };
    },
    fields: [
      {
        name: 'companyName',
        label: '单位名称',
        component: 'Input',
        // props: {
        //   fieldNames: COMPANY_FIELDNAMES,
        //   mapper: COMPANY_MAPPER,
        //   showSearch: true,
        //   filterOption: false,
        //   allowClear: true,
        // },
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
        name: 'category',
        label: '承包商类别',
        component: 'Select',
        props: {
          list: CATEGORIES,
          allowClear: true,
        },
        dependencies: ['contractorName'],
        hide({ contractorName }) {
          return !contractorName;
        },
      },
      {
        name: 'type',
        label: '承包商类型',
        component: 'Select',
        props: {
          list: TYPES,
          allowClear: true,
        },
      },
      {
        name: 'status',
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
        dataIndex: 'category',
        title: '承包商类别',
        render: value => value && <Select list={CATEGORIES} value={`${value}`} mode="detail" />, // 这里注意一下value的类型
      },
      {
        dataIndex: 'type',
        title: '承包商类型',
        render: value => value && <Select list={TYPES} value={`${value}`} mode="detail" />, // 这里注意一下value的类型
      },
      {
        dataIndex: 'category',
        title: '资质证书状态',
        render: value => value && <Select list={STATUSES} value={`${value}`} mode="detail" />, // 这里注意一下value的类型
      },
      {
        dataIndex: '操作',
        title: '操作',
        fixed: 'right',
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
    formProps: {
      expandable: true,
      ref: formRef,
    },
  };
  return <TablePage {...props} />;
};

export default ContractorList;
