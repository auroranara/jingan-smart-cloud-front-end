import React, { Component } from 'react';
import InputOrSpan from '@/jingan-components/InputOrSpan';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import TablePage from '@/templates/TablePage';
import ReevaluateModal from '../components/ReevaluateModal';
import moment from 'moment';
import styles from './index.less';

export const WARNING_STATUSES = [
  { key: '1', value: '已过期', color: '#f5222d' },
  { key: '2', value: '即将到期', color: '#faad14' },
  { key: '3', value: '未到期' },
];
export const DEFAULT_FORMAT = 'YYYY-MM-DD';

export default class ReevaluateWarningList extends Component {
  state = {
    visible: false,
    data: undefined,
  };

  setPageReference = page => {
    this.page = page && page.getWrappedInstance();
  };

  getFields = () => [
    {
      id: 'area',
      label: '区域名称',
      transform: value => value.trim(),
      render: ({ handleSearch }) => (
        <InputOrSpan placeholder="请输入区域名称" onPressEnter={handleSearch} maxLength={50} />
      ),
    },
    {
      id: 'status',
      label: '预警状态',
      render: () => (
        <SelectOrSpan placeholder="请选择预警状态" list={WARNING_STATUSES} allowClear />
      ),
    },
  ];

  getColumns = ({ list, renderHistoryButton, renderReevaluateButton }) => [
    {
      title: '区域名称',
      dataIndex: 'areaName',
      align: 'center',
    },
    {
      title: '区域编号',
      dataIndex: 'areaNumber',
      align: 'center',
    },
    {
      title: '所属图层',
      dataIndex: 'layer',
      align: 'center',
    },
    {
      title: '区域变更时间',
      dataIndex: 'updateTime',
      render: time => time && moment(time).format(DEFAULT_FORMAT),
      align: 'center',
    },
    {
      title: '复评周期（月）',
      dataIndex: 'period',
      align: 'center',
    },
    {
      title: '应复评时间',
      dataIndex: 'planTime',
      render: (time, { warningStatus }) => (
        <span
          style={{
            color: (WARNING_STATUSES.find(({ key }) => key === `${warningStatus}`) || {}).color,
          }}
        >
          {time && moment(time).format(DEFAULT_FORMAT)}
        </span>
      ),
      align: 'center',
    },
    {
      title: '预警状态',
      dataIndex: 'warningStatus',
      render: value => (
        <SelectOrSpan
          list={WARNING_STATUSES}
          value={`${value}`}
          type="span"
          style={{ color: (WARNING_STATUSES.find(({ key }) => key === `${value}`) || {}).color }}
        />
      ),
      align: 'center',
    },
    {
      title: '历史复评次数',
      dataIndex: 'historyCount',
      width: 116,
      fixed: list && list.length ? 'right' : undefined,
      render: (_, data) => <div className={styles.buttonWrapper}>{renderHistoryButton(data)}</div>,
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: '操作',
      width: 60,
      fixed: list && list.length ? 'right' : undefined,
      render: (_, data) => (
        <div className={styles.buttonWrapper}>{renderReevaluateButton(data)}</div>
      ),
      align: 'center',
    },
  ];

  handleOpen = data => {
    this.setState({
      visible: true,
      data,
    });
  };

  handleClose = () => {
    this.setState({
      visible: false,
    });
  };

  handleSubmit = () => {
    this.setState({
      visible: false,
    });
    this.page.reload();
  };

  render() {
    const { visible, data } = this.state;
    const props = {
      content({ list: { pagination: { total } = {} } = {} }) {
        return `共计：${total || 0} 条`;
      },
      fields: this.getFields,
      columns: this.getColumns,
      otherOperation: [
        {
          code: 'history',
          name({ historyCount }) {
            return +historyCount || 0;
          },
          disabled({ historyCount }) {
            return !+historyCount;
          },
        },
        {
          code: 'reevaluate',
          name: '复评',
          onClick: this.handleOpen,
        },
      ],
      ref: this.setPageReference,
      showTotal: false,
      ...this.props,
    };

    return (
      <TablePage {...props}>
        <ReevaluateModal
          visible={visible}
          data={data}
          onClose={this.handleClose}
          onSubmit={this.handleSubmit}
        />
      </TablePage>
    );
  }
}
