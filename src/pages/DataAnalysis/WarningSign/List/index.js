import React, { Fragment } from 'react';
import { Divider } from 'antd';
import TablePage from '@/jingan-components/Page/Table';
import { Select } from '@/jingan-components/Form';
import { FileList, EmptyText } from '@/jingan-components/View';
import { CATEGORIES } from '../config';
import { COMPANY_FIELDNAMES, COMPANY_MAPPER } from '../../Contractor/config';
import { isNumber } from '@/utils/utils';
// import styles from './index.less';

const WarningSignList = ({ route, match, location }) => {
  const props = {
    route,
    match,
    location,
    transform({ isUnit, unitId, companyId, name, category }) {
      return {
        companyId: isUnit ? unitId : companyId,
        name: name && name.trim(),
        category,
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
        name: 'name',
        label: '警示牌名称',
        component: 'Input',
      },
      {
        name: 'category',
        label: '警示牌类别',
        component: 'Select',
        props: {
          list: CATEGORIES,
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
        dataIndex: 'name',
        title: '警示牌名称',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'category',
        title: '警示牌类别',
        render: value =>
          isNumber(value) ? (
            <Select list={CATEGORIES} value={`${value}`} mode="detail" ellipsis={false} />
          ) : (
            <EmptyText />
          ),
      },
      {
        dataIndex: 'area',
        title: '配备地点',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'signFileList',
        title: '图片',
        render: value => <FileList value={value && value.slice(0, 1)} type="picture" />,
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

export default WarningSignList;
