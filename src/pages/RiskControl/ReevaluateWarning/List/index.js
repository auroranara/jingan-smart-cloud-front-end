import React, { Component } from 'react';
import { Button, Input } from 'antd';
import InputOrSpan from '@/jingan-components/InputOrSpan';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import TablePage from '@/templates/TablePage';
import ReevaluateModal from '../components/ReevaluateModal';
import moment from 'moment';
import router from 'umi/router';
import { connect } from 'dva';
import styles from './index.less';

export const WARNING_STATUSES = [
  { key: '2', value: '已过期', color: '#f5222d' },
  { key: '1', value: '即将到期', color: '#faad14' },
  { key: '0', value: '未到期' },
];
export const DEFAULT_FORMAT = 'YYYY-MM-DD';

@connect(({ user }) => ({
  user,
}))
export default class ReevaluateWarningList extends Component {
  state = {
    visible: false,
    data: undefined,
  };

  setPageReference = page => {
    this.page = page && page.getWrappedInstance();
  };

  // 跳转到历史记录页面
  handleViewHistory = id => {
    const url = '/risk-control/reevaluate-warning/history';
    router.push(id ? `${url}?id=${id}` : url);
  }

  getFields = () => {
    const { user: { isCompany } } = this.props;
    return [
      ...isCompany ? [] : [{
        id: 'companyName',
        label: '单位名称',
        transform: value => value.trim(),
        render: () => (<Input placeholder="请输入单位名称" />),
      }],
      {
        id: 'zoneName',
        label: '区域名称',
        transform: value => value.trim(),
        render: ({ handleSearch }) => (
          <InputOrSpan placeholder="请输入区域名称" onPressEnter={handleSearch} maxLength={50} />
        ),
      },
      {
        id: 'paststatus',
        label: '预警状态',
        render: () => (
          <SelectOrSpan placeholder="请选择预警状态" list={WARNING_STATUSES} allowClear />
        ),
      },
    ];
  }

  getColumns = ({ list, renderHistoryButton, renderReevaluateButton }) => {
    const { user: { isCompany } } = this.props;
    return [
      ...isCompany ? [] : [
        {
          title: '单位名称',
          dataIndex: 'companyName',
          align: 'center',
        }],
      {
        title: '区域名称',
        dataIndex: 'zoneName',
        align: 'center',
      },
      {
        title: '区域编号',
        dataIndex: 'zoneCode',
        align: 'center',
      },
      {
        title: '所属图层',
        dataIndex: 'zoneType',
        align: 'center',
        render: (val) => val ? ['风险四色图'][+val] : '',
      },
      {
        title: '区域变更时间',
        dataIndex: 'changeDate',
        render: time => time && moment(time).format(DEFAULT_FORMAT),
        align: 'center',
      },
      {
        title: '复评周期（月）',
        dataIndex: 'checkCircle',
        align: 'center',
      },
      {
        title: '应复评时间',
        dataIndex: 'reviewDate',
        render: (time, { paststatus }) => (
          <span
            style={{
              color: (WARNING_STATUSES.find(({ key }) => key === `${paststatus}`) || {}).color,
            }}
          >
            {time && moment(time).format(DEFAULT_FORMAT)}
          </span>
        ),
        align: 'center',
      },
      {
        title: '预警状态',
        dataIndex: 'paststatus',
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
        dataIndex: 'historyReviewCount',
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
  }

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

  render () {
    const { visible, data } = this.state;
    const props = {
      content ({ list: { pagination: { total } = {} } = {} }) {
        return `共计：${total || 0} 条`;
      },
      fields: this.getFields,
      columns: this.getColumns,
      otherOperation: [
        {
          code: 'history',
          name ({ historyReviewCount }) {
            return +historyReviewCount || 0;
          },
          disabled ({ historyReviewCount }) {
            return !+historyReviewCount;
          },
          onClick: detail => {
            router.push({
              pathname: '/risk-control/reevaluate-warning/history',
              query: { zoneId: detail.zoneId },
            })
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
      action: (
        <Button type="primary" onClick={() => this.handleViewHistory()}>历史记录</Button>
      ),
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
