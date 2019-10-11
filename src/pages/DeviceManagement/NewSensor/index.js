import { Component, Fragment } from 'react';
import { Card, Form, Input, Button, Table, Row, Col, Divider, Popconfirm, Select, message, TreeSelect } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { hasAuthority, AuthA, AuthLink, AuthPopConfirm } from '@/utils/customAuth';
import codes from '@/utils/codes';

const FormItem = Form.Item;
const { TreeNode } = TreeSelect;

const title = '传感器管理（新）'
const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '设备管理', name: '设备管理' },
  { title, name: title },
]
const noAuthStyle = { style: { color: 'rgba(0, 0, 0, 0.25)', cursor: 'not-allowed' } }
const colWrapper = { lg: 8, md: 12, sm: 24, xs: 24 }
const formItemStyle = { style: { margin: '0', padding: '4px 0' } }
const {
  deviceManagement: {
    newSensor: {
      edit: editSensorCode,
      delete: deleteSensorCode,
      realTimeData: realTimeDataCode,
    },
  },
} = codes
/* 渲染树节点 */
const renderTreeNodes = data => {
  return data.map(item => {
    const { id, name, child } = item;
    if (child) {
      return (
        <TreeNode title={name} key={id} value={id}>
          {renderTreeNodes(child)}
        </TreeNode>
      );
    }
    return <TreeNode title={name} key={id} value={id} />;
  });
};

@Form.create()
@connect(({ device, resourceManagement, user, loading }) => ({
  device,
  resourceManagement,
  user,
  tableLoading: loading.effects['device/fetchSensors'],
}))
export default class NewSensorList extends Component {

  componentDidMount() {
    this.handleQuery()
    this.fetchMonitoringTypes()
  }

  /**
  * 搜索列表
  */
  handleQuery = (pageNum = 1, pageSize = 10) => {
    const {
      dispatch,
      form: { getFieldsValue },
      location: { query: { dataExecuteEquipmentId } },
    } = this.props;
    const values = getFieldsValue()
    dispatch({
      type: 'device/fetchSensors',
      payload: { pageNum, pageSize, ...values, dataExecuteEquipmentId },
    })
  }

  /**
* 获取监测类型列表树
*/
  fetchMonitoringTypes = () => {
    const { dispatch } = this.props
    dispatch({ type: 'device/fetchMonitoringTypes' })
  }

  /**
   * 重置筛选
   */
  handleReset = () => {
    const {
      form: { resetFields },
    } = this.props
    resetFields()
    this.handleQuery()
  }


  /**
   * 删除传感器
   */
  handleDelete = (id) => {
    const { dispatch } = this.props
    dispatch({
      type: 'device/deleteSensor',
      payload: { id },
      success: () => {
        message.success('删除传感器成功')
        this.handleQuery()
      },
      error: (res) => { message.error(res ? res.msg : '删除传感器失败') },
    })
  }

  /**
   * 渲染筛选栏
   */
  renderFilter = () => {
    const {
      form: { getFieldDecorator },
      device: { monitoringType },
    } = this.props
    return (
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
                {getFieldDecorator('monitorType')(
                  <TreeSelect
                    placeholder="监测类型"
                    dropdownStyle={{ maxHeight: 600, overflow: 'auto' }}
                    allowClear
                  >
                    {renderTreeNodes(monitoringType)}
                  </TreeSelect>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('token')(
                  <Input placeholder="传感器Token" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                <Button style={{ marginRight: '10px' }} type="primary" onClick={() => this.handleQuery()}>查询</Button>
                <Button style={{ marginRight: '10px' }} onClick={this.handleReset}>重置</Button>
                {/* <Button type="primary" onClick={() => router.push('/device-management/new-sensor/add')}>新增传感器</Button> */}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }

  /**
  * 渲染表格
  */
  renderTable = () => {
    const {
      tableLoading,
      device: {
        sensor: {
          list = [],
          pagination: { total, pageNum, pageSize },
        },
      },
    } = this.props
    const columns = [
      {
        title: '单位名称',
        dataIndex: 'companyName',
        align: 'center',
        width: 400,
      },
      {
        title: '品牌',
        dataIndex: 'brandName',
        align: 'center',
        width: 150,
      },
      {
        title: '型号',
        dataIndex: 'modelName',
        align: 'center',
        width: 150,
      },
      {
        title: '传感器Token',
        dataIndex: 'token',
        align: 'center',
        width: 150,
      },
      {
        title: '所在区域',
        dataIndex: 'area',
        align: 'center',
        width: 150,
      },
      {
        title: '位置详情',
        dataIndex: 'location',
        align: 'center',
        width: 200,
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        fixed: 'right',
        width: 230,
        render: (val, row) => (
          <Fragment>
            <AuthA code={editSensorCode} onClick={() => router.push(`/device-management/new-sensor/edit/${row.id}`)}>编辑</AuthA>
            <Divider type="vertical" />
            <AuthPopConfirm
              code={deleteSensorCode}
              title="确认要删除该传感器吗？"
              onConfirm={() => this.handleDelete(row.id)}
            >
              删除
            </AuthPopConfirm>
            <Divider type />
            <AuthLink code={realTimeDataCode} to={`/device-management/new-sensor/real-time-data/${row.id}`}>查看实时数据</AuthLink>
          </Fragment>
        ),
      },
    ]
    return (
      <Card style={{ marginTop: '24px' }}>
        {list && list.length > 0 ? (
          <Table
            rowKey="id"
            loading={tableLoading}
            columns={columns}
            dataSource={list}
            bordered
            scroll={{ x: 'max-content' }}
            pagination={{
              current: pageNum,
              pageSize,
              total,
              showQuickJumper: true,
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '15', '20'],
              onChange: this.handleQuery,
              onShowSizeChange: (num, size) => {
                this.handleQuery(1, size);
              },
            }}
          />
        ) : (
            <div style={{ width: '100%', textAlign: 'center' }}><span>暂无数据</span></div>
          )}

      </Card>
    )
  }

  render() {
    const {
      device: {
        sensor: {
          pagination: { total = 0 },
        },
      },
    } = this.props
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={<span>传感器总数：{total}</span>}
      >
        {this.renderFilter()}
        {this.renderTable()}
      </PageHeaderLayout>
    )
  }
}
