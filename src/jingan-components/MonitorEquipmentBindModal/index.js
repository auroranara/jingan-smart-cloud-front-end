import React, { Component } from 'react';
import { Modal, Table, Spin, Input, message, Popconfirm, Empty } from 'antd';
import CustomForm from '@/jingan-components/CustomForm';
import { connect } from 'dva';
import { getModalPageSize, setModalPageSize } from '@/utils/utils';
import styles from './index.less';

const LIST_API = 'common/getMonitorEquipmentList';
const SET_BIND_STATUS_API = 'common/setMonitorEquipmentBindStatus';

@connect(
  ({ common: { monitorEquipmentList }, loading }) => ({
    list: monitorEquipmentList,
    loading: loading.effects[LIST_API],
    setting: loading.effects[SET_BIND_STATUS_API],
  }),
  dispatch => ({
    getList(payload, callback) {
      dispatch({
        type: LIST_API,
        payload: {
          pageNum: 1,
          pageSize: getModalPageSize(),
          ...payload,
        },
        callback: (success, data) => {
          if (!success) {
            message.error('获取监测设备列表失败，请稍后重试！');
          }
          callback && callback(success, data);
        },
      });
    },
    setBindStatus(payload, callback) {
      dispatch({
        type: SET_BIND_STATUS_API,
        payload,
        callback: (success, data) => {
          const isBind = payload.bindStatus === 1;
          if (success) {
            message.success(isBind ? '绑定成功！' : '解绑成功！');
          } else {
            message.error(isBind ? '绑定失败，请稍后重试！' : '解绑失败，请稍后重试！');
          }
          callback && callback(success, data);
        },
      });
    },
  })
)
export default class MonitorEquipmentBindModal extends Component {
  state = {
    bindIdList: [], // 选中的监测设备的id列表
  };

  prevValues = {};

  componentDidUpdate({ visible: prevVisible }) {
    const { visible } = this.props;
    if (!prevVisible && visible) {
      const { type, data, getList } = this.props;
      this.prevValues = {};
      getList({
        companyId: data.companyId,
        ...(type
          ? {
              targetId: data.id,
            }
          : {
              bindTargetId: data.id,
              bindTargetStatus: 0,
            }),
      });
      this.form && this.form.resetFields();
      if (!type) {
        this.setState({
          bindIdList: [],
        });
      }
    }
  }

  setFormReference = form => {
    this.form = form;
  };

  // 重新加载当前页码的表格数据
  reload = () => {
    const {
      list: { pagination: { pageNum = 1, pageSize = getModalPageSize() } = {} } = {},
      type,
      data,
      getList,
    } = this.props;
    getList({
      ...this.prevValues,
      pageNum,
      pageSize,
      companyId: data.companyId,
      ...(type
        ? {
            targetId: data.id,
          }
        : {
            bindTargetId: data.id,
            bindTargetStatus: 0,
          }),
    });
    this.form && this.form.setFieldsValue(this.prevValues);
  };

  handleSearch = values => {
    const {
      list: { pagination: { pageSize = getModalPageSize() } = {} } = {},
      type,
      data,
      getList,
    } = this.props;
    this.prevValues = values;
    getList({
      ...values,
      pageSize,
      companyId: data.companyId,
      ...(type
        ? {
            targetId: data.id,
          }
        : {
            bindTargetId: data.id,
            bindTargetStatus: 0,
          }),
    });
  };

  handleReset = values => {
    this.handleSearch(values);
    this.setState({
      bindIdList: [],
    });
  };

  handleTableChange = ({ current, pageSize }) => {
    const {
      list: { pagination: { pageSize: prevPageSize = getModalPageSize() } = {} } = {},
      type,
      data,
      getList,
    } = this.props;
    getList({
      ...this.prevValues2,
      pageNum: prevPageSize !== pageSize ? 1 : current,
      pageSize,
      companyId: data.companyId,
      ...(type
        ? {
            targetId: data.id,
          }
        : {
            bindTargetId: data.id,
            bindTargetStatus: 0,
          }),
    });
    this.form && this.form.setFieldsValue(this.prevValues);
    prevPageSize !== pageSize && setModalPageSize(pageSize);
  };

  handleOk = () => {
    const { data, setBindStatus, onClose } = this.props;
    const { bindIdList } = this.state;
    setBindStatus(
      {
        bindStatus: 1,
        targetId: data.id,
        equipmentIdList: bindIdList,
      },
      success => {
        if (success) {
          onClose && onClose(true);
        }
      }
    );
  };

  handleCancel = () => {
    const {
      list: { pagination: { total } = {} },
      type,
      data,
      onClose,
    } = this.props;
    onClose && onClose(type && total !== data.monitorEquipmentCount);
  };

  // 解绑
  handleClick = id => {
    const { data, setBindStatus } = this.props;
    setBindStatus(
      {
        bindStatus: 0,
        targetId: data.id,
        equipmentIdList: [id],
      },
      success => {
        if (success) {
          this.reload();
        }
      }
    );
  };

  handleBindIdListChange = bindIdList => {
    this.setState({
      bindIdList,
    });
  };

  render() {
    const {
      list: { list, pagination: { total, pageNum, pageSize } = {} } = {},
      loading,
      setting,
      type,
      visible,
    } = this.props;
    const { bindIdList } = this.state;
    const fields = [
      {
        id: 'name',
        label: '监测设备名称',
        transform: value => value.trim(),
        render: ({ handleSearch }) => (
          <Input placeholder="请输入监测设备名称" onPressEnter={handleSearch} maxLength={50} />
        ),
      },
      {
        id: 'code',
        label: '监测设备编码',
        transform: value => value.trim(),
        render: ({ handleSearch }) => (
          <Input placeholder="请输入监测设备编码" onPressEnter={handleSearch} maxLength={50} />
        ),
      },
    ];
    const columns = [
      {
        title: '监测设备名称',
        dataIndex: 'name',
        align: 'center',
      },
      {
        title: '监测设备编码',
        dataIndex: 'code',
        align: 'center',
      },
      {
        title: '监测设备类型',
        dataIndex: 'equipmentTypeName',
        align: 'center',
      },
      ...(type
        ? [
            {
              title: '操作',
              dataIndex: 'id',
              width: 88,
              fixed: list && list.length > 0 ? 'right' : false,
              render: id => (
                <Popconfirm title="你确定要解绑吗?" onConfirm={() => this.handleClick(id)}>
                  <span className={styles.operation}>解绑</span>
                </Popconfirm>
              ),
              align: 'center',
            },
          ]
        : []),
    ];

    return (
      <Modal
        title={type ? '已绑定监测设备' : '绑定监测设备'}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={type ? null : undefined}
        confirmLoading={!type && setting}
        width="60%"
        zIndex={1009}
        okButtonProps={{
          disabled: !(bindIdList && bindIdList.length),
        }}
      >
        <CustomForm
          className={styles.form}
          fields={fields}
          onSearch={this.handleSearch}
          onReset={this.handleReset}
          ref={this.setFormReference}
        />
        <Spin spinning={loading || (type && setting) || false}>
          {list && list.length > 0 ? (
            <Table
              className={styles.table}
              dataSource={list}
              columns={columns}
              rowKey="id"
              scroll={{
                x: true,
              }}
              onChange={this.handleTableChange}
              pagination={{
                current: pageNum,
                pageSize,
                total,
                pageSizeOptions: ['5', '10', '15', '20'],
                showTotal: total => `共 ${total} 条`,
                showQuickJumper: true,
                showSizeChanger: true,
              }}
              rowSelection={
                type
                  ? undefined
                  : {
                      selectedRowKeys: bindIdList,
                      onChange: this.handleBindIdListChange,
                    }
              }
            />
          ) : (
            <Empty />
          )}
        </Spin>
      </Modal>
    );
  }
}
