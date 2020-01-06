import React, { Component, Fragment } from 'react';
import { Tooltip } from 'antd';
import InputOrSpan from '@/jingan-components/InputOrSpan';
import RadioOrSpan from '@/jingan-components/RadioOrSpan';
import CustomUpload from '@/jingan-components/CustomUpload';
import TablePage from '@/templates/TablePage';
import moment from 'moment';
import styles from './index.less';

export const DEFAULT_FORMAT = 'YYYY-MM-DD';
export const RESULTS = [{ key: '0', value: '符合' }, { key: '1', value: '不符合' }];

export default class AlarmMessage extends Component {
  getFields = ({ unitId }) => [
    {
      id: 'lawName',
      label: '法律法规标准名称',
      transform: value => value.trim(),
      render: ({ handleSearch }) => (
        <InputOrSpan
          placeholder="请输入法律法规标准名称"
          onPressEnter={handleSearch}
          maxLength={50}
        />
      ),
    },
    ...(!unitId
      ? [
          {
            id: 'companyName',
            label: '单位名称',
            transform: value => value.trim(),
            render: ({ handleSearch }) => (
              <InputOrSpan
                placeholder="请输入单位名称"
                onPressEnter={handleSearch}
                maxLength={50}
              />
            ),
          },
        ]
      : []),
  ];

  getAction = ({ renderAddButton }) => <Fragment>{renderAddButton()}</Fragment>;

  getColumns = ({ list, renderDetailButton, renderEditButton, renderDeleteButton }) => [
    {
      title: '法律法规标准名称',
      dataIndex: 'lawName',
      align: 'center',
    },
    {
      title: '文号',
      dataIndex: 'number',
      align: 'center',
    },
    {
      title: '公布日期',
      dataIndex: 'publishDate',
      render: time => time && moment(time).format(DEFAULT_FORMAT),
      align: 'center',
    },
    {
      title: '实施日期',
      dataIndex: 'enforceDate',
      render: time => time && moment(time).format(DEFAULT_FORMAT),
      align: 'center',
    },
    {
      title: '内容摘要',
      dataIndex: 'content',
      render: value =>
        value && (
          <Tooltip title={<div className={styles.preWrapText}>{value}</div>}>
            <div
              className={styles.ellipsis}
              style={{ maxWidth: Math.min(value.split('\n')[0].length + 1, 11) * 14 }}
            >
              {value}
            </div>
          </Tooltip>
        ),
      align: 'center',
    },
    {
      title: '对应活动',
      dataIndex: 'activity',
      render: value =>
        value && (
          <Tooltip title={<div className={styles.preWrapText}>{value}</div>}>
            <div
              className={styles.ellipsis}
              style={{ maxWidth: Math.min(value.split('\n')[0].length + 1, 11) * 14 }}
            >
              {value}
            </div>
          </Tooltip>
        ),
      align: 'center',
    },
    {
      title: '评价结果',
      dataIndex: 'evaluatResult',
      render: value => <RadioOrSpan type="span" list={RESULTS} value={value} />,
      align: 'center',
    },
    {
      title: '内容附件',
      dataIndex: 'otherFileList',
      render: value => <CustomUpload type="span" value={value} />,
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: '操作',
      width: 164,
      fixed: list && list.length > 0 ? 'right' : false,
      render: (_, data) => (
        <Fragment>
          {renderDetailButton(data)}
          {renderEditButton(data)}
          {renderDeleteButton(data)}
        </Fragment>
      ),
      align: 'center',
    },
  ];

  render() {
    const props = {
      fields: this.getFields,
      action: this.getAction,
      columns: this.getColumns,
      ...this.props,
    };

    return <TablePage {...props} />;
  }
}
