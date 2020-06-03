import React, { Fragment } from 'react';
import { Divider } from 'antd';
import TablePage from '@/jingan-components/Page/Table';
import { EmptyText } from '@/jingan-components/View';
import moment from 'moment';
import { CLASSIFICATIONS, FORMAT } from '../config';
import { isNumber } from '@/utils/utils';
import styles from './index.less';

export default ({ route, match, location }) => {
  const props = {
    route,
    match,
    location,
    transform({ isUnit, unitId, companyId, standardTitle }) {
      return {
        companyId: isUnit ? unitId : companyId,
        standardTitle: standardTitle && standardTitle.trim(),
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
        name: 'standardTitle',
        label: '标准标题',
        component: 'Input',
        props: {
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
        dataIndex: 'standardTitle',
        title: '标准标题',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'applyScope',
        title: '适用范围',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'standardType',
        title: '标准分类',
        render: value =>
          (CLASSIFICATIONS.find(item => item.key === `${value}`) || {}).value || <EmptyText />,
      },
      {
        dataIndex: 'passScore',
        title: '合格分数（分）',
        render: value => (isNumber(value) ? value : <EmptyText />),
      },
      {
        dataIndex: 'examProject',
        title: '考核项目',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: '设定日志',
        title: '设定日志',
        render: (_, { createPerson, createPart, createTime }) => (
          <Fragment>
            <div className={styles.fieldWrapper}>
              <div>设定人：</div>
              <div>{createPerson || <EmptyText />}</div>
            </div>
            <div className={styles.fieldWrapper}>
              <div>设定人部门：</div>
              <div>{createPart || <EmptyText />}</div>
            </div>
            <div className={styles.fieldWrapper}>
              <div>设定日期：</div>
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
