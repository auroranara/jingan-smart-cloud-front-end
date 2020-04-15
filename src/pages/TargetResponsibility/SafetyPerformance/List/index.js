import React, { Fragment } from 'react';
import { Divider } from 'antd';
import TablePage from '@/jingan-components/Page/Table';
import { Select } from '@/jingan-components/Form/';
import moment from 'moment';
import {
  COMPANY_FIELDNAMES,
  COMPANY_MAPPER,
  DEPARTMENT_FIELDNAMES,
  DEPARTMENT_MAPPER,
  RESULTS,
  FORMAT,
} from '../config';
import { isNumber } from '@/utils/utils';
import styles from './index.less';

const List = ({ route, match, location }) => {
  const props = {
    route,
    match,
    location,
    transform({ isUnit, unitId, companyId, departmentId, result }) {
      return {
        companyId: isUnit ? unitId : companyId,
        departmentId,
        result,
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
        name: 'departmentId',
        label: '被考核部门',
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
        name: 'result',
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
        dataIndex: 'title',
        title: '考核标题',
      },
      {
        dataIndex: 'date',
        title: '考核日期',
        render: value => value && moment(value).format(FORMAT),
      },
      {
        dataIndex: 'result',
        title: '考核结果',
        render: value =>
          isNumber(value) && (
            <Select list={RESULTS} value={`${value}`} mode="detail" empty={null} ellipsis={false} />
          ),
      },
      {
        dataIndex: 'score',
        title: '总分',
      },
      {
        dataIndex: 'departmentName',
        title: '被考核部门',
      },
      {
        dataIndex: '填报人',
        title: '填报人',
        render: (_, { person, departmentName, date }) => (
          <Fragment>
            <div className={styles.fieldWrapper}>
              <div>姓名：</div>
              <div>{person}</div>
            </div>
            <div className={styles.fieldWrapper}>
              <div>部门：</div>
              <div>{departmentName}</div>
            </div>
            <div className={styles.fieldWrapper}>
              <div>填报日期：</div>
              <div>{date && moment(date).format(FORMAT)}</div>
            </div>
          </Fragment>
        ),
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

export default List;
