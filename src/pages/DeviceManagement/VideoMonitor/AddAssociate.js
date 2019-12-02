import { Component, Fragment } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import { connect } from 'dva';
import { Card, Button, Form, Row, Col, Table, message, Input, Select } from 'antd';
import router from 'umi/router';

const FormItem = Form.Item;

const title = '新增关联';
const colWrapper = { lg: 8, md: 12, sm: 24, xs: 24 };
const formItemStyle = { style: { margin: '0', padding: '4px 0' } };
const defaultPageSize = 10;

@Form.create()
@connect(({ videoMonitor, sensor, device }) => ({
  videoMonitor,
  sensor,
  device,
}))
export default class AddAssociate extends Component {
  state = {
    selectedRowKeys: [], // 表格中选中的信标
  };

  componentDidMount () {
    const {
      dispatch,
      match: {
        params: { id, type },
      },
      location: {
        query: { companyId },
      },
    } = this.props;
    // 如果是人员定位
    if (type === 'position') {
      // 获取系统列表
      dispatch({
        type: 'videoMonitor/fetchSystemList',
        payload: { companyId },
      });
      this.fetchVideoBeaconsAvailable({
        payload: { id, companyId, pageNum: 1, pageSize: defaultPageSize },
      });
    } else if (type === 'monitor') {
      this.fetchMonitoringDeviceTypes();
      this.fetchMonitoringDevice({
        payload: { pageNum: 1, pageSize: defaultPageSize, bindVideoStatus: 0, bindVideoId: id, companyId },
      })
    } else if (type === 'fire') {
      // 如果是火灾报警
      // 获取筛选栏数据
      dispatch({
        type: 'videoMonitor/fetchFireFilterList',
        payload: { companyId },
      });
      // 获取设施系统类型
      dispatch({
        type: 'videoMonitor/fetchDictList',
        payload: { key: 'facilitySystemList', type: 'systemcode' },
      });
      // 如果是火灾报警
      this.fetchUnBindedFireDevice({
        payload: { videoId: id, companyId, pageNum: 1, pageSize: defaultPageSize },
      });
    }
  }

  // 获取未绑定设备（人员定位）
  fetchVideoBeaconsAvailable = actions => {
    const { dispatch } = this.props;
    dispatch({
      type: 'videoMonitor/fetchVideoBeaconsAvailable',
      ...actions,
    });
  };

  // 获取当前摄像头未绑定的报警点位(火灾报警系统)
  fetchUnBindedFireDevice = actions => {
    const { dispatch } = this.props;
    dispatch({
      type: 'videoMonitor/fetchUnBindedFireDevice',
      ...actions,
    });
  };

  // 获取设备类型--监测设备类型列表
  fetchMonitoringDeviceTypes = () => {
    const { dispatch } = this.props
    dispatch({ type: 'device/fetchMonitoringDeviceTypes' })
  }

  // 获取监测设备列表
  fetchMonitoringDevice = actions => {
    const { dispatch } = this.props;
    dispatch({
      type: 'device/fetchMonitoringDevice',
      ...actions,
    })
  }

  // 点击保存
  handleSave = () => {
    const {
      dispatch,
      match: {
        params: { id, type },
      },
      location: {
        query: { companyId, name },
      },
    } = this.props;
    const { selectedRowKeys } = this.state;
    if (!selectedRowKeys || selectedRowKeys.length === 0) {
      message.warning('请选择设备！');
      return;
    }
    const error = () => {
      message.error('新增关联设备失败！');
    };
    const success = () => {
      message.success('新增关联成功！');
      router.push(
        `/device-management/video-monitor/associate/${type}/${id}?name=${name}&&companyId=${companyId}`
      );
    };
    if (type === 'position') {
      dispatch({
        type: 'videoMonitor/bindBeacon',
        payload: { videoId: id, beaconIds: selectedRowKeys.join(',') },
        success,
        error,
      });
    } else if (type === 'monitor') {
      dispatch({
        type: 'device/bindVideoAndMonitorEquipment',
        payload: { videoId: id, deviceIds: selectedRowKeys.join(',') },
        success,
        error,
      });
    } else if (type === 'fire') {
      dispatch({
        type: 'videoMonitor/bindedFirerDevice',
        payload: { videoId: id, fireIds: selectedRowKeys.join(',') },
        success,
        error,
      });
    }
  };

  // 点击查询
  handleQuery = (pageNum = 1, pageSize = defaultPageSize) => {
    const {
      form: { getFieldsValue },
      match: {
        params: { id, type },
      },
      location: {
        query: { companyId },
      },
    } = this.props;
    const values = getFieldsValue();
    if (type === 'position') {
      this.fetchVideoBeaconsAvailable({ payload: { id, companyId, pageNum, pageSize, ...values } });
    } else if (type === 'monitor') {
      this.fetchMonitoringDevice({
        payload: { pageNum: 1, pageSize: defaultPageSize, bindVideoStatus: 0, bindVideoId: id, companyId },
      })
    } else if (type === 'fire') {
      this.fetchUnBindedFireDevice({
        payload: { videoId: id, companyId, pageNum, pageSize, ...values },
      });
    }
  };

  handleReset = () => {
    const {
      form: { resetFields },
    } = this.props;
    resetFields();
    this.handleQuery();
    this.fetchSensorTypeDict({ payload: { monitoringTypeId: 0 } });
  };

  handleToBack = () => {
    const {
      match: {
        params: { id, type },
      },
      location: {
        query: { companyId },
      },
    } = this.props;
    // TODO：返回对应的tab
    router.push(
      `/device-management/video-monitor/associate/${type}/${id}?name=${name}&&companyId=${companyId}`
    );
  };

  // 获取品牌类型列表
  fetchSensorTypeDict = actions => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sensor/fetchSensorTypeDict',
      ...actions,
    });
  };

  // 筛选栏检测类型改变
  handlemonitoringTypeChange = id => {
    const {
      form: { resetFields },
    } = this.props;
    resetFields(['optionalDesc']);
    resetFields(['modelDesc']);
    this.fetchSensorTypeDict({ payload: { monitoringTypeId: id } });
  };

  render () {
    const {
      match: {
        params: { id, type },
      },
      form: { getFieldDecorator },
      location: {
        query: { name, companyId },
      },
      videoMonitor: {
        associateDevice: {
          availableList = [],
          availablePagination,
        },
        systemList = [],
        // 监测类型列表
        classTypeList = [],
        // 消控主机
        deviceCodes = [],
        // 设施部件类型
        dictDataList = [],
        // 设施系统类型
        facilitySystemList = [],
      },
      device: {
        monitoringDeviceTypes,
        monitoringDevice,
      },
    } = this.props;

    const breadcrumbList = [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '设备管理',
        name: '设备管理',
      },
      {
        title: '视频监控',
        name: '视频监控',
        href: '/device-management/video-monitor/list',
      },
      {
        title: '视频监控列表',
        name: '视频监控列表',
        href: `/device-management/video-monitor/video-equipment/${companyId}?name=${name}`,
      },
      {
        title: '关联设备',
        name: '关联设备',
        href: `/device-management/video-monitor/associate/${type}/${id}?name=${name}&&companyId=${companyId}`,
      },
      {
        title,
        name: title,
      },
    ];

    const positionColumns = [
      {
        title: '信标编号',
        dataIndex: 'beaconCode',
        align: 'center',
      },
      {
        title: '所属系统',
        dataIndex: 'sysName',
        align: 'center',
      },
      {
        title: '坐标',
        key: '坐标',
        align: 'center',
        render: (val, row) => (
          <span>
            （{row.xarea},{row.yarea},{row.zarea}）
          </span>
        ),
      },
    ];
    const monitorColumns = [
      {
        title: '名称',
        dataIndex: 'name',
        align: 'center',
      },
      {
        title: '编号',
        dataIndex: 'code',
        align: 'center',
      },
      {
        title: '设备类型',
        dataIndex: 'equipmentTypeName',
        align: 'center',
      },
    ];
    const fireColumns = [
      {
        title: '消防主机编号',
        dataIndex: 'fireCode',
        align: 'center',
      },
      {
        title: '设施系统类型',
        dataIndex: 'systemType',
        align: 'center',
        render: val => {
          const item = facilitySystemList.find(item => +item.value === +val) || { label: '' };
          return <span>{item.label}</span>;
        },
      },
      {
        title: '设施部件类型',
        dataIndex: 'unitType',
        align: 'center',
        render: val => {
          const item = dictDataList.find(item => +item.value === +val) || { label: '' };
          return <span>{item.label}</span>;
        },
      },
      {
        title: '回路号',
        dataIndex: 'loopNumber',
        align: 'center',
      },
      {
        title: '部位号',
        dataIndex: 'partNumber',
        align: 'center',
      },
      {
        title: '安装位置',
        dataIndex: 'installAddress',
        align: 'center',
      },
    ];
    const columns =
      (type === 'position' && positionColumns) ||
      (type === 'monitor' && monitorColumns) ||
      (type === 'fire' && fireColumns);
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys,
        });
      },
    };
    const list = type === 'monitor' ? monitoringDevice.list : availableList;
    const pagination = type === 'monitor' ? monitoringDevice.pagination : availablePagination;

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        <div>
          <Card>
            <Form>
              <Row gutter={16}>
                {type === 'position' && (
                  <Fragment>
                    <Col {...colWrapper}>
                      <FormItem {...formItemStyle}>
                        {getFieldDecorator('code')(<Input placeholder="请输入编号" />)}
                      </FormItem>
                    </Col>
                    <Col {...colWrapper}>
                      <FormItem {...formItemStyle}>
                        {getFieldDecorator('sysId')(
                          <Select placeholder="所属系统">
                            {systemList.map(item => (
                              <Select.Option key={item.id} value={item.id}>
                                {item.sysName}
                              </Select.Option>
                            ))}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Fragment>
                )}
                {type === 'monitor' && (
                  <Fragment>
                    <Col {...colWrapper}>
                      <FormItem {...formItemStyle}>
                        {getFieldDecorator('companyName')(
                          <Input placeholder="单位名称" />
                        )}
                      </FormItem>
                    </Col>
                    <Col {...colWrapper}>
                      <FormItem {...formItemStyle}>
                        {getFieldDecorator('equipmentType')(
                          <Select placeholder="设备类型">
                            {monitoringDeviceTypes.map(({ id, name }) => (
                              <Select.Option key={id} value={id}>{name}</Select.Option>
                            ))}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Fragment>
                )}
                {type === 'fire' && (
                  <Fragment>
                    <Col {...colWrapper}>
                      <FormItem {...formItemStyle}>
                        {getFieldDecorator('fireCode')(
                          <Select placeholder="请选择消控主机">
                            {deviceCodes.map((item, i) => (
                              <Select.Option key={i} value={item}>
                                {item}
                              </Select.Option>
                            ))}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col {...colWrapper}>
                      <FormItem {...formItemStyle}>
                        {getFieldDecorator('systemType')(
                          <Select placeholder="设施系统类型">
                            {facilitySystemList.map((item, i) => (
                              <Select.Option key={i} value={item.value}>
                                {item.label}
                              </Select.Option>
                            ))}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col {...colWrapper}>
                      <FormItem {...formItemStyle}>
                        {getFieldDecorator('unitType')(
                          <Select placeholder="设施部件类型">
                            {dictDataList.map(item => (
                              <Select.Option key={item.id} value={item.value}>
                                {item.label}
                              </Select.Option>
                            ))}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col {...colWrapper}>
                      <FormItem {...formItemStyle}>
                        {getFieldDecorator('loopNumber')(<Input placeholder="请输入回路号" />)}
                      </FormItem>
                    </Col>
                    <Col {...colWrapper}>
                      <FormItem {...formItemStyle}>
                        {getFieldDecorator('partNumber')(<Input placeholder="请输入部位号" />)}
                      </FormItem>
                    </Col>
                    <Col {...colWrapper}>
                      <FormItem {...formItemStyle}>
                        {getFieldDecorator('location')(<Input placeholder="请输入安装位置" />)}
                      </FormItem>
                    </Col>
                  </Fragment>
                )}
                <Col {...colWrapper}>
                  <FormItem {...formItemStyle}>
                    <Button
                      style={{ marginRight: '10px' }}
                      type="primary"
                      onClick={() => this.handleQuery()}
                    >
                      查询
                    </Button>
                    <Button onClick={this.handleReset}>重置</Button>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Card>
          <Card style={{ marginTop: '24px' }}>
            <Table
              rowKey="id"
              dataSource={list}
              columns={columns}
              pagination={{
                current: pagination.pageNum,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showQuickJumper: true,
                showSizeChanger: true,
                onChange: this.handleQuery,
                onShowSizeChange: (num, size) => this.handleQuery(1, size),
              }}
              rowSelection={rowSelection}
            />
          </Card>
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Button style={{ marginRight: '24px' }} onClick={this.handleToBack}>
              取消
            </Button>
            <Button type="primary" onClick={this.handleSave}>
              保存
            </Button>
          </div>
        </div>
      </PageHeaderLayout>
    );
  }
}
