import { Component, Fragment } from 'react';
import { Card, Form, Input, Button, Table, Row, Col } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

const FormItem = Form.Item;

const title = '传感器管理'
const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '设备管理', name: '设备管理' },
  { title, name: title },
]
const colWrapper = { lg: 8, md: 12, sm: 24, xs: 24 }
const formItemStyle = { style: { margin: '0', padding: '4px 0' } }
const defaultPageSize = 10;

@Form.create()
@connect(({ sensor, resourceManagement, user, loading }) => ({
  sensor,
  resourceManagement,
  user,
}))
export default class SensorList extends Component {

  handleQuery = (pageNum = 1, pageSize = defaultPageSize) => { }

  handleReset = () => { }


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
                {getFieldDecorator('searchCompanyName')(
                  <Input placeholder="单位名称" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                <Button style={{ marginRight: '10px' }} type="primary" onClick={() => this.handleQuery()}>查询</Button>
                <Button style={{ marginRight: '10px' }} onClick={this.handleReset}>重置</Button>
                <Button type="primary" onClick={() => router.push('/device-management/sensor/add')}>新增传感器</Button>
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
      sensor: {
        list = [],
        pagination: {
          pageNum,
          pageSize,
          total,
        },
      },
    } = this.props
    const columns = [
      {
        title: '企业名称',
        dataIndex: 'name',
        align: 'center',
      },
      {
        title: '监测类型',
        dataIndex: 'type',
        align: 'center',
      },
      {
        title: '品牌',
        dataIndex: 'a',
        align: 'center',
      },
      {
        title: '传感器型号',
        dataIndex: 'as',
        align: 'center',
      },
      {
        title: '传感器名称',
        dataIndex: 'ax',
        align: 'center',
      },
      {
        title: '传感器ID',
        dataIndex: 'az',
        align: 'center',
      },
      {
        title: '所在区域',
        dataIndex: 'aq',
        align: 'center',
      },
      {
        title: '位置详情',
        dataIndex: 'aw',
        align: 'center',
      },
      {
        title: '位置详情',
        key: '操作',
        align: 'center',
      },
    ]
    return (
      <Card style={{ marginTop: '24px' }}>
        <Table
          rowKey="id"
          // loading={}
          columns={columns}
          dataSource={list}
          bordered
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
      </Card>
    )
  }

  render() {
    const {
      sensor: {
        pagination: { total = 0 },
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
