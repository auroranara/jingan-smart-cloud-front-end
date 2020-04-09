import React, { Fragment } from 'react';
import { Divider } from 'antd';
import TablePage from '@/jingan-components/Page/Table';
import { Badge } from '@/jingan-components/View';
import moment from 'moment';
import { STATUSES, FORMAT } from '../config';
import styles from './index.less';

const SupplierList = ({ route, match, location }) => {
  const props = {
    route,
    match,
    location,
    transform({ companyName, supplierName, certificateExpireStatus }) {
      return {
        companyName: companyName && companyName.trim(),
        supplierName: supplierName && supplierName.trim(),
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
        name: 'supplierName',
        label: '供应商公司名称',
        component: 'Input',
      },
      {
        name: 'certificateExpireStatus',
        label: '证书是否到期',
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
        dataIndex: 'supplierName',
        title: '供应商公司名称',
      },
      {
        dataIndex: '证书',
        title: '证书',
        render: (_, { certificateName, certificateExpireDate, certificateExpireStatus }) => (
          <Fragment>
            <div className={styles.fieldWrapper}>
              <div>证书名称：</div>
              <div>{certificateName}</div>
            </div>
            {certificateExpireDate && (
              <Fragment>
                <div className={styles.fieldWrapper}>
                  <div>到期日期：</div>
                  <div>
                    {moment(certificateExpireDate).format(FORMAT)}
                    <span className={styles.badgeWrapper}>
                      <Badge list={STATUSES} value={`${certificateExpireStatus}`} />
                    </span>
                  </div>
                </div>
              </Fragment>
            )}
          </Fragment>
        ),
      },
      {
        dataIndex: '最近考核',
        title: '最近考核',
        render: (_, { lastAssess }) =>
          lastAssess && (
            <Fragment>
              <div className={styles.fieldWrapper}>
                <div>考核日期：</div>
                <div>{lastAssess.assessDate && moment(lastAssess.assessDate).format(FORMAT)}</div>
              </div>
              <div className={styles.fieldWrapper}>
                <div>总分：</div>
                <div>{lastAssess.assessScore}</div>
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

export default SupplierList;
