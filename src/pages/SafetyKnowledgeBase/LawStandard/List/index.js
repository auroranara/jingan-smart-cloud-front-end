import React, { Component, Fragment } from 'react';
import { Tooltip, Input } from 'antd';
import InputOrSpan from '@/jingan-components/InputOrSpan';
// import RadioOrSpan from '@/jingan-components/RadioOrSpan';
import CustomUpload from '@/jingan-components/CustomUpload';
import TablePage from '@/templates/TablePage';
import { Scrollbars } from 'react-custom-scrollbars';
import moment from 'moment';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import styles from './index.less';

export const DEFAULT_FORMAT = 'YYYY-MM-DD';
export const RESULTS = [{ key: '0', value: '符合' }, { key: '1', value: '不符合' }];

// 分类字典
export const TYPEDICT = [
  { key: '0', value: '国家法律' },
  { key: '1', value: '行政法规' },
  { key: '2', value: '地方性法规' },
  { key: '3', value: '部门规章' },
  { key: '4', value: '标准与规范' },
  { key: '5', value: '废止法律法规' },
  { key: '6', value: '其他' },
]
// 判断字典
export const JUDGEDICT = [
  { key: '1', value: '是' },
  { key: '0', value: '否' },
]
// 强制程度字典
export const COERCIONDEGREEDICT = [
  { key: '1', value: '强制性' },
  { key: '0', value: '推荐性' },
]
// 评价结果字典
export const RESULTDICT = [
  { key: '1', value: '符合' },
  { key: '0', value: '不符合' },
];

export default class AlarmMessage extends Component {
  getFields = ({ unitId }) => [
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
    {
      id: 'classify',
      label: '分类',
      render: () => <SelectOrSpan placeholder="请选择分类" list={TYPEDICT} allowClear />,
    },
    {
      id: 'regulations',
      label: '现行法规',
      render: () => <SelectOrSpan placeholder="请选择是否现行法规" list={JUDGEDICT} allowClear />,
    },
    {
      id: 'coerciveProcedure',
      label: '强制程度',
      render: () => <SelectOrSpan placeholder="请选择强制程度" list={COERCIONDEGREEDICT} allowClear />,
    },
    {
      id: 'name',
      label: '文件名称',
      render: () => <Input placeholder="请输入文件名称" />,
    },
  ];

  getAction = ({ renderAddButton }) => <Fragment>{renderAddButton()}</Fragment>;

  // 转化毫秒为年-月-日
  formateDate = val => val ? moment(val).format('YYYY-MM-DD') : ''

  getColumns = ({ list, renderDetailButton, renderEditButton, renderDeleteButton }) => [
    // {
    //   title: '法律法规标准名称',
    //   dataIndex: 'lawName',
    //   align: 'center',
    // },
    // {
    //   title: '文号',
    //   dataIndex: 'number',
    //   align: 'center',
    // },
    // {
    //   title: '公布日期',
    //   dataIndex: 'publishDate',
    //   render: time => time && moment(time).format(DEFAULT_FORMAT),
    //   align: 'center',
    // },
    // {
    //   title: '实施日期',
    //   dataIndex: 'enforceDate',
    //   render: time => time && moment(time).format(DEFAULT_FORMAT),
    //   align: 'center',
    // },
    // {
    //   title: '内容摘要',
    //   dataIndex: 'content',
    //   render: this.renderEllipsis,
    //   align: 'center',
    // },
    // {
    //   title: '对应活动',
    //   dataIndex: 'activity',
    //   render: this.renderEllipsis,
    //   align: 'center',
    // },
    // {
    //   title: '评价结果',
    //   dataIndex: 'evaluatResult',
    //   render: value => <RadioOrSpan type="span" list={RESULTS} value={value} />,
    //   align: 'center',
    // },
    // {
    //   title: '内容附件',
    //   dataIndex: 'otherFileList',
    //   render: value => <CustomUpload type="span" value={value} />,
    //   align: 'center',
    // },
    {
      title: '文件名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '法规编号',
      dataIndex: 'code',
      align: 'center',
    },
    {
      title: '发布日期',
      dataIndex: 'releaseDate',
      align: 'center',
      render: value => this.formateDate(value),
    },
    {
      title: '启用日期',
      dataIndex: 'commissionDate',
      align: 'center',
      render: value => this.formateDate(value),
    },
    {
      title: '辨识日期',
      dataIndex: 'identifyDate',
      align: 'center',
      render: value => this.formateDate(value),
    },
    {
      title: '摘要',
      dataIndex: 'digest',
      align: 'center',
    },
    {
      title: '对应活动',
      dataIndex: 'correspondingActivities',
      align: 'center',
    },
    {
      title: '评价结果',
      dataIndex: 'result',
      align: 'center',
    },
    {
      title: '附件',
      dataIndex: 'accessoryDetails',
      align: 'center',
      render: value => <CustomUpload type="span" value={value} />,
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

  renderEllipsis = value =>
    value && (
      <Tooltip
        title={
          <Scrollbars className={styles.tooltipContent}>
            <div className={styles.preWrapText}>{value}</div>
          </Scrollbars>
        }
      >
        <div
          className={styles.ellipsis}
          style={{ maxWidth: Math.min(value.split('\n')[0].length + 1, 11) * 14 }}
        >
          {value}
        </div>
      </Tooltip>
    );

  render () {
    const props = {
      fields: this.getFields,
      action: this.getAction,
      columns: this.getColumns,
      ...this.props,
    };

    return <TablePage {...props} />;
  }
}
