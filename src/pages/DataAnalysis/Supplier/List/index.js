import React, { Fragment } from 'react';
import { Divider, Badge } from 'antd';
import TablePage from '@/jingan-components/Page/Table';
import { EmptyText } from '@/jingan-components/View';
import DueDate from '../../Contractor/components/DueDate';
import moment from 'moment';
import { isNumber } from '@/utils/utils';
import { STATUSES, FORMAT } from '../config';
import { COMPANY_FIELDNAMES, COMPANY_MAPPER } from '../../Contractor/config';
import styles from './index.less';

const SupplierList = ({ route, match, location }) => {
  const props = {
    route,
    match,
    location,
    transform({ isUnit, unitId, companyId, supplierName, certificateExpireStatus }) {
      return {
        companyId: isUnit ? unitId : companyId,
        supplierName: supplierName && supplierName.trim(),
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
              render: value => value || <EmptyText />,
            },
          ]
        : []),
      {
        dataIndex: 'supplierName',
        title: '供应商公司名称',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: '证书',
        title: '证书',
        render: (_, { certificateName, certificateExpireDate, certificateExpireStatus }) => (
          <Fragment>
            <div className={styles.fieldWrapper}>
              <div>证书名称：</div>
              <div>{certificateName || <EmptyText />}</div>
            </div>
            {certificateExpireDate && (
              <Fragment>
                <div className={styles.fieldWrapper}>
                  <div>到期日期：</div>
                  <div>
                    <DueDate
                      list={STATUSES}
                      value={moment(certificateExpireDate)}
                      status={certificateExpireStatus}
                      mode="detail"
                    />
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
          lastAssess ? (
            <Fragment>
              <div className={styles.fieldWrapper}>
                <div>考核日期：</div>
                <div>
                  {lastAssess.assessDate ? (
                    moment(lastAssess.assessDate).format(FORMAT)
                  ) : (
                    <EmptyText />
                  )}
                </div>
              </div>
              <div className={styles.fieldWrapper}>
                <div>总分：</div>
                <div>
                  {isNumber(lastAssess.assessScore) ? (
                    <Badge
                      text={`${lastAssess.assessScore}`}
                      status={lastAssess.assessScore >= 60 ? 'success' : 'error'}
                    />
                  ) : (
                    <EmptyText />
                  )}
                </div>
              </div>
            </Fragment>
          ) : (
            <EmptyText />
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
