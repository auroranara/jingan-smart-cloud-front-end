import { PureComponent, Fragment } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, Button, Input, Row, Col, Select, Divider, Table, Tag, message } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import { AuthButton, AuthA, AuthLink } from '@/utils/customAuth';
import codes from '@/utils/codes';
import { dataProcessingType } from '@/utils/dict'; // 数据处理设备类型枚举
import router from 'umi/router';
import moment from 'moment';

const FormItem = Form.Item;

const {
  deviceManagement: {
    dataProcessing: {
      device: {
        add: addCode,
        edit: editCode,
        delete: deleteCode,
        bindSensor: bindSensorCode,
        // unbindSensor: unbindSensorCode,
      },
    },
    newSensor: {
      add: addSensorCode,
    },
  },
} = codes
const defaultPageSize = 10;
const colWrapper = { lg: 8, md: 12, sm: 24, xs: 24 }
const formItemStyle = { style: { margin: '0', padding: '4px 0' } }
const tagSetting = [
  { color: 'orange', label: '即将过期' },
  { color: 'red', label: '已过期' },
]

@Form.create()
@connect(({ device, loading }) => ({
  device,
  tableLoading: loading.effects['device/fetchEquipmentsForPage'],
}))
export default class NVR extends PureComponent {

  /**
  * 搜索列表数据
  */
  handleQuery = (pageNum = 1, pageSize = defaultPageSize) => {
    const {
      dispatch,
      form: { getFieldsValue },
      match: { params: { type } },
      location: { query: { companyId } },
    } = this.props
    const values = getFieldsValue()
    dispatch({
      type: 'device/fetchEquipmentsForPage',
      payload: { pageNum, pageSize, companyId, equipmentType: type, ...values },
    })
  }

  /**
  * 重置列表数据
  */
  handleReset = () => {
    const {
      form: { resetFields },
    } = this.props
    resetFields()
    this.handleQuery()
  }

  /**
 * 跳转到新增设备页面
 */
  jumpToAddPage = () => {
    const {
      match: { params: { type } },
      location: { query: { companyId } },
    } = this.props
    router.push(`/device-management/data-processing/${type}/add?companyId=${companyId}`)
  }

  /**
   * 渲染筛选栏
   */
  renderFilter = () => {
    const {
      form: { getFieldDecorator },
    } = this.props
    return (
      <Card>
        <Form>
          <Row gutter={16}>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('code')(
                  <Input placeholder="设备编号" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('name')(
                  <Input placeholder="设备名称" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('areaLocation')(
                  <Input placeholder="区域位置" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                <Button onClick={() => this.handleQuery()} style={{ marginRight: '10px' }} type="primary">查询</Button>
                <Button onClick={this.handleReset} style={{ marginRight: '10px' }}>重置</Button>
                <AuthButton onClick={this.jumpToAddPage} code={addCode} type="primary">新增设备</AuthButton>
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
      match: { params: { type } },
      device: {
        equipment: {
          list = [],
          pagination: { total, pageNum, pageSize },
        },
      },
    } = this.props
    const columns = [
      {
        title: '基本信息',
        dataIndex: 'a',
        align: 'center',
        width: 200,
        render: (val, { equipmentTypeName, brandName, name, code }) => (
          <div style={{ textAlign: 'left' }}>
            <div>类型：{equipmentTypeName}</div>
            <div>品牌：{brandName}</div>
            <div>设备名称：{name}</div>
            <div>设备编号：{code}</div>
          </div>
        ),
      },
      {
        title: '有效期至',
        key: '有效期至',
        align: 'center',
        width: 200,
        render: (val, { expireStatus, expireDate }) => expireDate && (
          <Fragment>
            {[1, 2].includes(expireStatus) && (
              <Tag color={tagSetting[expireStatus - 1].color}>{tagSetting[expireStatus - 1].label}</Tag>
            )}
            {moment(expireDate).format('YYYY.MM.DD')}
          </Fragment>
        ),
      },
      {
        title: '区域位置',
        key: '区域位置',
        align: 'center',
        width: 200,
        render: (val, { area, location }) => `${area || ''}${location || ''}`,
      },
      {
        title: '网关设备',
        key: '网关设备',
        align: 'center',
        width: 250,
        render: (val, { connectGateway, gatewayEquipment }) => connectGateway ? (
          <div style={{ textAlign: 'left' }}>
            <div>已接入</div>
            <div>网关设备编号：{gatewayEquipment}</div>
          </div>
        ) : '--',
      },
      {
        title: '已绑定传感器',
        dataIndex: 'sensorCount',
        align: 'center',
        width: 120,
        render: (val, row) => (
          <a onClick={() => { }}>{val}</a>
        ),
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        fixed: 'right',
        render: (val, row) => (
          <Fragment>
            <AuthLink code={editCode} to={`/device-management/data-processing/${type}/edit/${row.id}?companyId=${row.companyId}`}>编辑</AuthLink>
            <Divider type />
            <AuthA code={deleteCode}>删除</AuthA>
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
              // pageSizeOptions: ['5', '10', '15', '20'],
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
      match: { params: { type } },
      location: { query: { companyName = '' } },
      device: {
        equipment: { pagination: { total = 0 } },
      },
    } = this.props
    const title = dataProcessingType[type]
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '物联设备管理', name: '物联设备管理' },
      { title: '数据处理设备', name: '数据处理设备', href: '/device-management/data-processing/list' },
      { title, name: title },
    ]
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={(
          <Fragment>
            <div>企业名称：{companyName}</div>
            <div>
              <span style={{ marginRight: '30px' }}>设备总数：{total}</span>
              <span>已导入点位：{'TODO'}</span>
            </div>
          </Fragment>
        )}
      >
        {this.renderFilter()}
      </PageHeaderLayout>
    )
  }
}
