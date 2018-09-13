
import React, { PureComponent } from 'react';
import moment from 'moment'
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { Button, Card, Table, Select, Form, Input, DatePicker, Pagination, Modal, Tooltip } from 'antd';
// import styles from './HistoryRecord.less';
import Ellipsis from '@/components/Ellipsis';

const FormItem = Form.Item;
const Option = Select.Option
const RangePicker = DatePicker.RangePicker
const title = "历史纪录"

// 警情状态列表
const alertStatusList = [{ id: '0', label: '全部' }, { id: '1', label: '火警' }, { id: '2', label: '故障' }, { id: '3', label: '联动' }, { id: '4', label: '监管' }, { id: '5', label: '屏蔽' }, { id: '6', label: '反馈' }]

@connect(({ fireAlarm, loading }) => ({
  fireAlarm,
  loading: loading.models.fireAlarm,
}),
  dispatch => ({
    fetchHistoryRecord(action) {
      dispatch({
        type: 'fireAlarm/fetchCompanyHistories',
        ...action,
      })
    },
    fetchOptions(action) {
      dispatch({
        type: 'fireAlarm/fetchOptions',
        ...action,
      })
    },
    fetchHistoryDetail(action) {
      dispatch({
        type: 'fireAlarm/fetchHistoryDetail',
        ...action,
      })
    },
  })
)
@Form.create()
export default class HistoryRecord extends PureComponent {
  state = {
    visible: false,
  }
  componentDidMount() {
    const { match: { params: { companyId } }, fetchOptions } = this.props
    fetchOptions({
      payload: companyId,
    })
    this.queryueryHistories()
  }

  // 点击搜索
  handleQueryHistories = () => {
    this.queryueryHistories()
  }

  // 获取历史纪录列表
  queryueryHistories = (pageNum = 1, pageSize = 10) => {
    const { match: { params: { companyId } }, form: { getFieldsValue }, fetchHistoryRecord } = this.props
    const { dateRange, ...data } = getFieldsValue()
    let query = {
      companyId: companyId,
      pageNum,
      pageSize,
      ...data,
      startTime: dateRange && dateRange.length ? dateRange[0].format('YYYY-MM-DD HH:mm:ss') : null,
      endTime: dateRange && dateRange.length ? dateRange[1].format('YYYY-MM-DD HH:mm:ss') : null,
    }
    fetchHistoryRecord({
      payload: query,
    })
  }
  // 打开弹窗查看详情
  handleViewDetail = (rows) => {
    const { match: { params: { companyId } }, fetchHistoryDetail } = this.props
    console.log('rows', rows);
    this.setState({ visible: true })
    fetchHistoryDetail({
      payload: { companyId: companyId, detailId: rows.detailId },
    })
  }
  // 关闭弹窗
  handleCloseModal = () => {
    this.setState({ visible: false })
  }
  // 表格改变触发，包含分页变动
  handleTableChange = (pageNum, pageSize) => {
    this.queryueryHistories(pageNum, pageSize)
  }
  /* 搜索栏 */
  renderQuery() {
    const { form: { getFieldDecorator }, fireAlarm: { deviceCodes, dictDataList } } = this.props
    return (
      <Card style={{ marginBottom: '20px' }}>
        <Form layout="inline">
          <FormItem>
            {getFieldDecorator('alertStatus')(
              <Select
                allowClear
                placeholder="警情状态"
                style={{ width: 130 }}
              >
                {alertStatusList.map(item => (
                  <Option value={item.id} key={item.id}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('deviceCode')(
              <Select
                allowClear
                placeholder="主机编号"
                style={{ width: 130 }}
              >
                {deviceCodes.map(item => (
                  <Option value={item} key={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('unitType')(
              <Select
                allowClear
                placeholder="设施部件类型"
                style={{ width: 200 }}
                dropdownMatchSelectWidth={false}
              >
                {dictDataList.map(item => (
                  <Option value={item.value} key={item.id}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('specificLocation')(
              <Input
                placeholder="请输入具体位置"
                style={{ width: 150 }} />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('dateRange')(
              <RangePicker
                showTime={{
                  hideDisabledOptions: true,
                  defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                }}
                style={{ width: 220 }} />
            )}
          </FormItem>
          <FormItem style={{ float: 'right' }}>
            <Button type="primary" onClick={this.handleQueryHistories}>搜索</Button>
          </FormItem>
        </Form>
      </Card>
    )
  }

  // Modal底部按钮
  ModalFooter() {
    return (
      <Button type="primary" onClick={this.handleCloseModal}>确定</Button>
    )
  }

  render() {
    const { visible } = this.state
    const { loading, match: { params: { companyId } }, fireAlarm: { historyData: { list, pagination }, historyDetail } } = this.props
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '火灾自动报警系统', name: '火灾自动报警系统', href: '/dynamic-monitoring/fire-alarm/index' },
      { title: '单位页面', name: '单位页面', href: `/dynamic-monitoring/fire-alarm/company/${companyId}` },
      { title: '历史纪录', name: '历史纪录' },
    ]
    const columns = [
      { title: '警情状态', dataIndex: 'status', key: "警情状态", width: 130, align: 'center', render: (val, rows) => <Ellipsis tooltip lines={1}>{val}</Ellipsis> },
      { title: '发生时间', dataIndex: 'createTime', key: "发生时间", width: 180, align: 'center', render: (val, rows) => <Ellipsis tooltip lines={1}>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</Ellipsis> },
      { title: '主机编号', dataIndex: 'clientAddr', key: "主机编号", width: 120, align: 'center', render: (val, rows) => <Ellipsis tooltip lines={1}>{val}</Ellipsis> },
      { title: '回路故障号', dataIndex: 'failureCode', key: "回路故障号", width: 130, align: 'center', render: (val, rows) => <Ellipsis tooltip lines={1}>{val}</Ellipsis> },
      { title: '设施部件类型', dataIndex: 'type', key: "设施部件类型", width: 150, align: 'center', render: (val, rows) => <Ellipsis tooltip lines={1}>{val}</Ellipsis> },
      { title: '具体位置', dataIndex: 'installAddress', key: "具体位置", width: 250, align: 'center', render: (val, rows) => <Ellipsis tooltip lines={1}>{val}</Ellipsis> },
      { title: '操作', width: 100, key: '操作', align: 'center', render: (val, rows) => (<a style={{ width: '90px' }} onClick={() => this.handleViewDetail(rows)}>查看</a>) },
    ]

    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    };

    const { pageNum, pageSize, total } = pagination

    // const test = [{ clientAddr: 1, createTime: 1531984858000, detailId: "UhSVBF2yaJStjEW22-pvYw", failureCode: "0号回路0号", installAddress: "5号5楼消防展示厅啊大大大碗大碗的迪瓦地区气温顶顶顶顶顶顶顶顶顶顶顶顶顶", status: "故障(主电故障)", type: "用户信息传输装置d1q234e12431" }]

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList} >
        {this.renderQuery()}
        <Card>
          <Table rowKey="detailId" bordered loading={loading} columns={columns} dataSource={list} pagination={false} />
          <Pagination style={{ marginTop: '20px' }}
            showQuickJumper
            showSizeChanger
            pageSize={pageSize}
            current={pageNum}
            total={total}
            onChange={this.handleTableChange}
            onShowSizeChange={this.handleTableChange}
            showTotal={total => `共 ${total} 条`} />
        </Card>
        <Modal
          title="详情信息"
          visible={visible}
          onCancel={this.handleCloseModal}
          footer={this.ModalFooter()}
        >
          <Form layout="vertical" style={{ textAlign: 'left', marginLeft: '30px' }}>
            <FormItem {...formItemLayout} label="单位名称：">{historyDetail.name}</FormItem>
            <FormItem {...formItemLayout} label="发生时间：">{moment(historyDetail.time).format('YYYY-MM-DD HH:mm:ss')}</FormItem>
            <FormItem {...formItemLayout} label="主机编号：">{historyDetail.code}</FormItem>
            <FormItem {...formItemLayout} label="回路故障号：">{historyDetail.failureCode}</FormItem>
            <FormItem {...formItemLayout} label="设施部件类型：">{historyDetail.type}</FormItem>
            <FormItem {...formItemLayout} label="具体位置：">{historyDetail.position}</FormItem>
            <FormItem {...formItemLayout} label="警情状态：">{historyDetail.alarmStatus}</FormItem>
            <FormItem {...formItemLayout} label="安全负责人：">{historyDetail.safetyName}</FormItem>
            <FormItem {...formItemLayout} label="联系电话：">{historyDetail.safetyPhone}</FormItem>
          </Form>
        </Modal>
      </PageHeaderLayout>
    )
  }
}
