import { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Spin,
  Form,
  Input,
  Button,
  Select,
  Row,
  Col,
  Table,
  Popconfirm,
  message,
} from 'antd';
import router from 'umi/router';
import codes from '@/utils/codes';
import { AuthPopConfirm, AuthButton } from '@/utils/customAuth';

const FormItem = Form.Item;

const {
  deviceManagement: {
    videoMonitor: { addAssociate: addAssociateCode, unBindBeacon: unBindBeaconCode },
  },
} = codes;

const colWrapper = { lg: 8, md: 12, sm: 24, xs: 24 };
const formItemStyle = { style: { margin: '0', padding: '4px 0' } };
const defaultPageSize = 10;

@Form.create()
@connect(({ videoMonitor, sensor, user, device }) => ({
  videoMonitor,
  sensor,
  user,
  device,
}))
export default class AssociatePersonnelPosition extends Component {
  componentDidMount () {
    this.handleQuery();
    this.fetchMonitoringDeviceTypes();
  }

  // 获取设备类型--监测设备类型列表
  fetchMonitoringDeviceTypes = () => {
    const { dispatch } = this.props
    dispatch({ type: 'device/fetchMonitoringDeviceTypes' })
  }


  // 点击查询
  handleQuery = (pageNum = 1, pageSize = defaultPageSize) => {
    const {
      dispatch,
      data: { id },
      form: { getFieldsValue },
    } = this.props;
    const values = getFieldsValue();
    dispatch({
      type: 'device/fetchMonitoringDevice',
      payload: { pageNum, pageSize, bindVideoStatus: 1, bindVideoId: id, ...values },
    })
  };

  // 点击重置
  handleReset = () => {
    const {
      form: { resetFields },
    } = this.props;
    resetFields();
    // 获取视屏绑定的信标
    this.handleQuery();
    this.fetchSensorTypeDict({ payload: { monitoringTypeId: 0 } });
  };

  handleToAdd = () => {
    const {
      data: { id, companyId, name },
    } = this.props;
    router.push(
      `/device-management/video-monitor/associate/${id}/add/monitor?name=${name}&&companyId=${companyId}`
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

  // 点击取消关联
  handleUnBindBeacon = id => {
    const {
      dispatch,
      data: { id: videoId },
    } = this.props;
    dispatch({
      type: 'device/unbindVideoAndMonitorEquipment',
      payload: { id, videoId },
      success: () => {
        message.success('取消关联成功！');
        // 获取视屏绑定的信标
        this.handleQuery();
      },
      error: () => {
        message.error('取消关联失败！');
      },
    });
  };

  render () {
    const {
      form: { getFieldDecorator },
      device: {
        monitoringDevice: {
          list = [],
          pagination: { pageNum = 1, pageSize = 10, total = 0 },
        },
      },
      device: {
        monitoringDeviceTypes, // 设备类型
      },
    } = this.props;

    const columns = [
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
      {
        title: '操作',
        key: '操作',
        align: 'center',
        render: (val, row) => (
          <Fragment>
            <AuthPopConfirm
              code={unBindBeaconCode}
              title="确认要取消关联吗？"
              onConfirm={() => this.handleUnBindBeacon(row.id)}
            >
              取消关联
            </AuthPopConfirm>
          </Fragment>
        ),
      },
    ];
    return (
      <Fragment>
        <Card>
          <Form>
            <Row gutter={16}>
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
              <Col {...colWrapper}>
                <FormItem {...formItemStyle}>
                  {getFieldDecorator('relationDeviceId')(<Input placeholder="请输入设备号" />)}
                </FormItem>
              </Col>
              <Col {...colWrapper}>
                <FormItem {...formItemStyle}>
                  <Button
                    style={{ marginRight: '10px' }}
                    type="primary"
                    onClick={() => this.handleQuery()}
                  >
                    查询
                  </Button>
                  <Button style={{ marginRight: '10px' }} onClick={this.handleReset}>
                    重置
                  </Button>
                  <AuthButton onClick={this.handleToAdd} type="primary" code={addAssociateCode}>
                    新增关联
                  </AuthButton>
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
              current: pageNum,
              pageSize,
              total,
              showQuickJumper: true,
              showSizeChanger: true,
              onChange: this.handleQuery,
              onShowSizeChange: (num, size) => this.handleQuery(1, size),
            }}
          />
        </Card>
      </Fragment>
    );
  }
}
