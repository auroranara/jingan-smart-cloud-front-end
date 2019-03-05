import { Component } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import { connect } from 'dva';
import { Card, Button, Form, Row, Col, Table, message, Input, Select } from 'antd';
import router from 'umi/router';

const FormItem = Form.Item;

const title = '新增关联'
const colWrapper = { lg: 8, md: 12, sm: 24, xs: 24 }
const formItemStyle = { style: { margin: '0', padding: '4px 0' } }
const defaultPageSize = 10;

@Form.create()
@connect(({ videoMonitor }) => ({
  videoMonitor,
}))
export default class AddAssociate extends Component {

  state = {
    selectedRowKeys: [], // 表格中选中的信标
  }

  componentDidMount() {
    const {
      dispatch,
      match: { params: { id } },
      location: { query: { companyId } },
    } = this.props
    // 获取系统列表
    dispatch({
      type: 'videoMonitor/fetchSystemList',
      payload: { companyId },
    })
    this.fetchVideoBeaconsAvailable({ payload: { id, companyId, pageNum: 1, pageSize: defaultPageSize } })
  }

  fetchVideoBeaconsAvailable = (actions) => {
    const {
      dispatch,
    } = this.props
    dispatch({
      type: 'videoMonitor/fetchVideoBeaconsAvailable',
      ...actions,
    })
  }

  handleLoadMore = (pageNum, pageSize) => {
    const {
      match: { params: { id } },
      location: { query: { companyId } },
    } = this.props
    this.fetchVideoBeaconsAvailable({
      payload: { id, companyId, pageNum, pageSize },
    })
  }

  // 点击保存
  handleSave = () => {
    const {
      dispatch,
      match: { params: { id } },
      location: { query: { companyId } },
    } = this.props
    const { selectedRowKeys } = this.state
    if (!selectedRowKeys || selectedRowKeys.length === 0) {
      message.warning('请选择信标！')
      return
    }
    dispatch({
      type: 'videoMonitor/bindBeacon',
      payload: { videoId: id, beaconIds: selectedRowKeys.join(',') },
      success: () => {
        message.success('新增关联成功！')
        router.push(`/device-management/video-monitor/associate/${id}?name=${name}&&companyId=${companyId}`)
      },
      error: () => { message.error('新增关联失败！') },
    })
  }

  // 点击查询
  handleQuery = () => {
    const {
      form: { getFieldsValue },
      match: { params: { id } },
      location: { query: { companyId } },
    } = this.props
    const values = getFieldsValue()
    this.fetchVideoBeaconsAvailable({ payload: { id, companyId, pageNum: 1, pageSize: defaultPageSize, ...values } })
  }

  handleReset = () => {
    const {
      form: { resetFields },
      match: { params: { id } },
      location: { query: { companyId } },
    } = this.props
    resetFields()
    this.fetchVideoBeaconsAvailable({ payload: { id, companyId, pageNum: 1, pageSize: defaultPageSize } })
  }

  handleToBack = () => {
    const {
      match: { params: { id } },
      location: { query: { companyId } },
    } = this.props
    router.push(`/device-management/video-monitor/associate/${id}?name=${name}&&companyId=${companyId}`)
  }

  render() {
    const {
      match: { params: { id } },
      form: { getFieldDecorator },
      location: { query: { name, companyId } },
      videoMonitor: {
        videoBeacon: {
          availableList = [],
          availablePagination: {
            pageNum = 1,
            pageSize = 10,
            total = 0,
          },
        },
        systemList = [],
      },
    } = this.props
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
        href: `/device-management/video-monitor/associate/${id}?name=${name}&&companyId=${companyId}`,
      },
      {
        title,
        name: title,
      },
    ]

    const columns = [
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
        render: (val, row) => (<span>（{row.xarea},{row.yarea},{row.zarea}）</span>),
      },
    ]

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        this.setState({
          selectedRowKeys,
        })
      },
      getCheckboxProps: record => ({
        // disabled: record.name === 'Disabled User',
        name: record.id,
      }),
    }

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
      >
        <div>
          <Card>
            <Form>
              <Row gutter={16}>
                <Col {...colWrapper}>
                  <FormItem {...formItemStyle}>
                    {getFieldDecorator('code')(
                      <Input placeholder="请输入编号" />
                    )}
                  </FormItem>
                </Col>
                <Col {...colWrapper}>
                  <FormItem {...formItemStyle}>
                    {getFieldDecorator('sysId')(
                      <Select placeholder="所属系统" >
                        {systemList.map(item => (<Select.Option key={item.id} value={item.id}>{item.sysName}</Select.Option>))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col {...colWrapper}>
                  <FormItem {...formItemStyle}>
                    <Button style={{ marginRight: '10px' }} type="primary" onClick={this.handleQuery}>查询</Button>
                    <Button onClick={this.handleReset}>重置</Button>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Card>
          <Card style={{ marginTop: '24px' }}>
            <Table
              rowKey="id"
              dataSource={availableList}
              columns={columns}
              pagination={{
                current: pageNum,
                pageSize,
                total,
                showQuickJumper: true,
                showSizeChanger: true,
                onChange: this.handleLoadMore,
                onShowSizeChange: (num, size) => { this.handleLoadMore(1, size); },
              }}
              rowSelection={rowSelection}
            />
          </Card>
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Button style={{ marginRight: '24px' }} onClick={this.handleToBack}>取消</Button>
            <Button type="primary" onClick={this.handleSave}>保存</Button>
          </div>
        </div>
      </PageHeaderLayout>
    )
  }
}
