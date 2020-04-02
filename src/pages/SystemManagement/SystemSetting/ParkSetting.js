import React, { Component } from 'react';
import { Card, Table } from 'antd';
import { connect } from 'dva';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import { STATUSES } from './Setting';
import ParkModal from './ParkModal';

@connect(({ licensePlateRecognitionSystem }) => ({
  licensePlateRecognitionSystem,
}))
export default class ParkSetting extends Component {

  state = {
    modalVisible: false,
    detail: {},
  };

  componentDidMount () {
    this.handleQuery();
  }

  // 查询列表
  handleQuery = () => {
    const {
      dispatch,
      location: { query: { companyId } },
    } = this.props;
    dispatch({
      type: 'licensePlateRecognitionSystem/getParkList',
      payload: {
        pageNum: 1,
        pageSize: 0,
        companyId,
      },
    })
  }

  // 点击打开设置弹窗
  handleViewSetting = (detail) => {
    this.setState({ detail, modalVisible: true });
  }

  handleSetting = (success) => {
    if (success) {
      this.setState({ modalVisible: false });
      this.handleQuery();
    }
  }

  render () {
    const {
      licensePlateRecognitionSystem: {
        parkList: {
          list,
        },
      },
      ...resProps
    } = this.props;
    const { modalVisible, detail } = this.state;
    const columns = [
      {
        title: '车场ID',
        dataIndex: 'parkId',
        align: 'center',
      },
      {
        title: '车场名称',
        dataIndex: 'parkName',
        align: 'center',
      },
      {
        title: '车场联系人',
        dataIndex: 'managerName',
        align: 'center',
      },
      {
        title: '联系电话',
        dataIndex: 'managerPhone',
        align: 'center',
      },
      {
        title: '车场状态',
        dataIndex: 'parkStatus',
        align: 'center',
        render: value => <SelectOrSpan list={STATUSES} value={`${value}`} type="span" />,
      },
      {
        title: '通道（个）',
        dataIndex: 'gateCount',
        align: 'center',
        render: value => value || 0,
      },
      {
        title: '操作',
        key: 'id',
        align: 'center',
        render: (_, row) => (<a onClick={() => this.handleViewSetting(row)}>设置</a>),
      },
    ];
    const modalProps = {
      visible: modalVisible,
      onCancel: () => { this.setState({ modalVisible: false }) },
      onOk: this.handleSetting,
      detail,
      ...resProps,
    };
    return (
      <Card>
        <Table
          rowKey="id"
          dataSource={list}
          columns={columns}
          pagination={false}
        />
        <ParkModal
          {...modalProps}
        />
      </Card>
    )
  }
}
