import React, { Fragment } from 'react';
import { Divider } from 'antd';
import TablePage from '@/jingan-components/Page/Table';
import { EmptyText, TextAreaEllipsis } from '@/jingan-components/View';
import moment from 'moment';
import { RESULTS, FORMAT } from '../config';
import { isNumber } from '@/utils/utils';
import styles from './index.less';

const List = ({ route, match, location }) => {
  const props = {
    route,
    match,
    location,
    transform({ isUnit, unitId, companyId, examedPart, examResult }) {
      return {
        companyId: isUnit ? unitId : companyId,
        examedPart,
        examResult,
      };
    },
    fields: [
      {
        name: 'companyId',
        label: '单位名称',
        component: 'Select',
        props: {
          preset: 'company',
          allowClear: true,
        },
        hide({ isUnit }) {
          return isUnit;
        },
      },
      {
        name: 'examedPart',
        label: '被考核部门',
        component: 'TreeSelect',
        dependencies: ['companyId'],
        props({ isUnit, unitId, companyId }) {
          return {
            preset: 'departmentTreeByCompany',
            params: {
              companyId: isUnit ? unitId : companyId,
            },
            allowClear: true,
          };
        },
      },
      {
        name: 'examResult',
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
              render: value => value || <EmptyText />,
            },
          ]
        : []),
      {
        dataIndex: 'examTitle',
        title: '考核标题',
        render: value => <TextAreaEllipsis value={value} />,
      },
      {
        dataIndex: 'examDate',
        title: '考核日期',
        render: value => (value ? moment(value).format(FORMAT) : <EmptyText />),
      },
      {
        dataIndex: 'examResult',
        title: '考核结果',
        render: value =>
          (RESULTS.find(item => item.key === `${value}`) || {}).value || <EmptyText />,
      },
      {
        dataIndex: 'totalScore',
        title: '总分',
        render: value => (isNumber(value) ? value : <EmptyText />),
      },
      {
        dataIndex: 'examedPartName',
        title: '被考核部门',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: '填报人',
        title: '填报人',
        render: (_, { writePersonName, writePersonPart, createTime }) => (
          <Fragment>
            <div className={styles.fieldWrapper}>
              <div>姓名：</div>
              <div>{writePersonName || <EmptyText />}</div>
            </div>
            <div className={styles.fieldWrapper}>
              <div>部门：</div>
              <div>{writePersonPart || <EmptyText />}</div>
            </div>
            <div className={styles.fieldWrapper}>
              <div>填报日期：</div>
              <div>{createTime ? moment(createTime).format(FORMAT) : <EmptyText />}</div>
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
