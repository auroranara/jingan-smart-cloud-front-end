import React, { Fragment } from 'react';
import { Divider } from 'antd';
import TablePage from '@/jingan-components/Page/Table';
import { Select } from '@/jingan-components/Form/';
import moment from 'moment';
import { COMPANY_FIELDNAMES, COMPANY_MAPPER, CLASSIFICATIONS, FORMAT } from '../config';
import { isNumber } from '@/utils/utils';
import styles from './index.less';

const List = ({ route, match, location }) => {
  const props = {
    route,
    match,
    location,
    transform({ isUnit, unitId, companyId, title }) {
      return {
        companyId: isUnit ? unitId : companyId,
        title: title && title.trim(),
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
        name: 'title',
        label: '标准标题',
        component: 'Input',
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
        title: '标准标题',
      },
      {
        dataIndex: 'scope',
        title: '适用范围',
      },
      {
        dataIndex: 'scope',
        title: '适用范围',
      },
      {
        dataIndex: 'classification',
        title: '标准分类',
        render: value =>
          isNumber(value) && (
            <Select
              list={CLASSIFICATIONS}
              value={`${value}`}
              mode="detail"
              empty={null}
              ellipsis={false}
            />
          ),
      },
      {
        dataIndex: 'score',
        title: '合格分数（分）',
      },
      {
        dataIndex: 'project',
        title: '考核项目',
      },
      {
        dataIndex: '设定日志',
        title: '设定日志',
        render: (_, { person, departmentName, date }) => (
          <Fragment>
            <div className={styles.fieldWrapper}>
              <div>设定人：</div>
              <div>{person}</div>
            </div>
            <div className={styles.fieldWrapper}>
              <div>设定人部门：</div>
              <div>{departmentName}</div>
            </div>
            <div className={styles.fieldWrapper}>
              <div>设定日期：</div>
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
