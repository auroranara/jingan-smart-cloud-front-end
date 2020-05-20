import React, { Component } from 'react';
import { Modal, Table, Spin, Input, message, Empty, Button } from 'antd';
import CustomForm from '@/jingan-components/CustomForm';
import classNames from 'classnames';
import { connect } from 'dva';
import { getModalPageSize, setModalPageSize } from '@/utils/utils';
import styles from './index.less';

const API = 'licensePlateRecognitionSystem/getVehicleList';
const FIELDS = [
  {
    id: 'queryCompanyName',
    label: '所属单位',
    transform: value => value.trim(),
    render: ({ handleSearch }) => (
      <Input placeholder="请输入所属单位" onPressEnter={handleSearch} maxLength={50} />
    ),
  },
  {
    id: 'carNumber',
    label: '车牌号',
    transform: value => value.trim(),
    render: ({ handleSearch }) => (
      <Input placeholder="请输入车牌号" onPressEnter={handleSearch} maxLength={50} />
    ),
  },
];
const COLUMNS = [
  {
    title: '车牌号',
    dataIndex: 'carNumber',
    align: 'center',
  },
  {
    title: '所属单位',
    dataIndex: '所属单位',
    align: 'center',
    render: (_, { ownerType, ownerCompanyName }) => (+ownerType ? ownerCompanyName : '本单位'),
  },
];

@connect(
  ({ licensePlateRecognitionSystem: { vehicleList }, loading }) => ({
    vehicleList,
    loading: loading.effects[API],
  }),
  (dispatch, { unitId }) => ({
    getVehicleList(payload, callback) {
      dispatch({
        type: API,
        payload: {
          companyId: unitId,
          pageNum: 1,
          pageSize: getModalPageSize(),
          ...payload,
        },
        callback: (success, data) => {
          if (!success) {
            message.error('获取车辆列表失败，请稍后重试！');
          }
          callback && callback(success, data);
        },
      });
    },
  })
)
export default class MonitorEquipmentBindModal extends Component {
  state = {
    visible: false,
    bindList: [], // 选中的监测设备的id列表
  };

  prevValues = null;

  componentDidMount() {
    const { getVehicleList } = this.props;
    getVehicleList();
  }

  componentDidUpdate(_, { visible: prevVisible }) {
    const { value } = this.props;
    const { visible } = this.state;
    if (visible && !prevVisible && value) {
      this.setState({
        bindList: [value],
      });
    }
  }

  setFormReference = form => {
    this.form = form;
  };

  handleAfterClose = () => {
    const { getVehicleList } = this.props;
    getVehicleList();
    this.prevValues = null;
    this.form && this.form.resetFields();
    this.setState({
      bindList: [],
    });
  };

  handleSearch = values => {
    const {
      vehicleList: { pagination: { pageSize = getModalPageSize() } = {} } = {},
      getVehicleList,
    } = this.props;
    this.prevValues = values;
    getVehicleList({
      ...values,
      pageSize,
    });
  };

  handleReset = values => {
    this.handleSearch(values);
    this.setState({
      bindList: [],
    });
  };

  handleTableChange = ({ current, pageSize }) => {
    const {
      vehicleList: { pagination: { pageSize: prevPageSize = getModalPageSize() } = {} } = {},
      getVehicleList,
    } = this.props;
    getVehicleList({
      ...this.prevValues,
      pageNum: prevPageSize !== pageSize ? 1 : current,
      pageSize,
    });
    this.form &&
      (this.prevValues ? this.form.setFieldsValue(this.prevValues) : this.form.resetFields());
    prevPageSize !== pageSize && setModalPageSize(pageSize);
  };

  handleSelect = () => {
    const { onChange } = this.props;
    const { bindList } = this.state;
    onChange && onChange(bindList[0]);
    this.hideModal();
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  hideModal = () => {
    this.setState({
      visible: false,
    });
  };

  handleChange = record => {
    this.setState({
      bindList: [record],
    });
  };

  render() {
    const {
      className,
      style,
      value,
      vehicleList: { list, pagination: { total, pageNum, pageSize } = {} } = {},
      loading = false,
      type,
    } = this.props;
    const { visible, bindList } = this.state;
    const label = (value && value.carNumber) || undefined;

    return type !== 'span' ? (
      <div className={classNames(styles.container, className)} style={style}>
        <Input
          value={label}
          placeholder="请选择承运车辆"
          disabled
          addonAfter={
            <Button type="primary" onClick={this.showModal}>
              选择
            </Button>
          }
        />
        <Modal
          title="选择承运车辆"
          visible={visible}
          onCancel={this.hideModal}
          footer={null}
          width="60%"
          zIndex={1009}
        >
          <CustomForm
            className={styles.form}
            fields={FIELDS}
            onSearch={this.handleSearch}
            onReset={this.handleReset}
            action={
              <Button
                type="primary"
                disabled={!(bindList && bindList.length)}
                onClick={this.handleSelect}
              >
                选择
              </Button>
            }
            ref={this.setFormReference}
          />
          <Spin spinning={loading}>
            {list && list.length > 0 ? (
              <Table
                className={styles.table}
                dataSource={list}
                columns={COLUMNS}
                rowKey="id"
                scroll={{
                  x: true,
                }}
                onChange={this.handleTableChange}
                pagination={{
                  current: pageNum,
                  pageSize,
                  total,
                  // pageSizeOptions: ['5', '10', '15', '20'],
                  showTotal: total => `共 ${total} 条`,
                  showQuickJumper: true,
                  showSizeChanger: true,
                }}
                rowSelection={{
                  type: 'radio',
                  selectedRowKeys: bindList ? bindList.map(({ id }) => id) : [],
                  onSelect: this.handleChange,
                }}
              />
            ) : (
              <Empty />
            )}
          </Spin>
        </Modal>
      </div>
    ) : (
      <span>{label}</span>
    );
  }
}
