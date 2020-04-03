import React, { Component, Fragment } from 'react';
import { Card, Table, Button, Divider, message, Popconfirm } from 'antd';
import { connect } from 'dva';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import { STATUSES } from './Setting';
import ParkModal from './ParkModal';
import styles from './index.less';

@connect(({ licensePlateRecognitionSystem, loading }) => ({
  licensePlateRecognitionSystem,
  tableLoading: loading.effects['licensePlateRecognitionSystem/getParkList'],
}))
export default class ParkSetting extends Component {

  state = {
    modalVisible: false,
    modalType: 'add', // 'view' 'add' 'edit'
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

  // 点击查看
  handleView = detail => {
    this.setState({ detail, modalVisible: true, modalType: 'view' });
  }

  // 点击打开设置弹窗
  handleViewEdit = detail => {
    this.setState({ detail, modalVisible: true, modalType: 'edit' });
  }

  handleSubmitOk = (success) => {
    if (success) {
      this.setState({ modalVisible: false });
      this.handleQuery();
    }
  }

  handleViewAdd = () => {
    this.setState({ modalVisible: true, detail: {}, modalType: 'add' });
  }

  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'licensePlateRecognitionSystem/deletePark',
      payload: { id },
      callback: (success, msg) => {
        if (success) {
          message.success('删除成功！');
          this.handleQuery();
        } else {
          message.error(msg || '删除失败！');
        }
      },
    });
  }

  render () {
    const {
      tableLoading,
      licensePlateRecognitionSystem: {
        parkList: {
          list,
        },
      },
      ...resProps
    } = this.props;
    const { modalVisible, detail, modalType } = this.state;
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
        render: (_, row) => (
          <Fragment>
            <a onClick={() => this.handleView(row)}>查看</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleViewEdit(row)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm
              title="你确定要删除吗?"
              onConfirm={() => this.handleDelete(row.id)}
            >
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];
    const modalProps = {
      visible: modalVisible,
      onCancel: () => { this.setState({ modalVisible: false }) },
      onOk: this.handleSubmitOk,
      detail,
      modalType,
      ...resProps,
    };
    return (
      <Card>
        <div className={styles.tableToolBar}>
          <div className={styles.option}>
            <Button type="primary" onClick={this.handleViewAdd}>新增车厂</Button>
          </div>
        </div>
        <Table
          rowKey="id"
          dataSource={list}
          columns={columns}
          pagination={false}
          loading={tableLoading}
        />
        <ParkModal
          {...modalProps}
        />
      </Card>
    )
  }
}
