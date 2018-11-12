import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Button, Card, Form, Input, DatePicker, Col, Table, Pagination, Select } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Lightbox from 'react-images';
import router from 'umi/router';
import styles from './RepairRecordList.less'

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Option = Select.Option

const title = "报修记录"
const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '数据分析', name: '数据分析' },
  { title, name: title },
]

// 维修状态配置
const statusList = [
  { value: 0, label: '处理中' },
  { value: 1, label: '已处理' },
  { value: 2, label: '待处理' },
]

@connect(({ dataAnalysis, user }) => ({
  dataAnalysis,
  user,
}))
@Form.create()
export default class RepairRecordList extends PureComponent {
  state = {
    modalVisible: false,
    imageFiles: [], // 附件图片列表
    currentImage: 0,// 展示附件大图下标
  }
  componentDidMount() {
    const {
      dispatch,
      dataAnalysis: {
        repairRecord: {
          pagination: {
            pageSize,
          },
        },
      },
    } = this.props

    // 获取报修记录列表
    dispatch({
      type: 'dataAnalysis/fetchRepairRecords',
      payload: { pageNum: 1, pageSize },
    })
  }

  // 点击查询
  handleQuery = () => {
    const {
      form: { getFieldsValue },
      dispatch,
      dataAnalysis: {
        repairRecord: {
          pagination: {
            pageSize,
          },
        },
      },
    } = this.props
    const data = getFieldsValue()
    const { time, ...query } = data
    if (time && time.length) {
      const [start, end] = time
      query.startTime = moment(start).format('YYYY-MM-DD HH:mm:ss')
      query.endTime = moment(end).format('YYYY-MM-DD HH:mm:ss')
    }
    dispatch({
      type: 'dataAnalysis/fetchRepairRecords',
      payload: { pageNum: 1, pageSize, ...query },
    })
  }

  // 点击重置
  handleReset = () => {
    const {
      form: { resetFields },
      dispatch,
      dataAnalysis: {
        repairRecord: {
          pagination: {
            pageSize,
          },
        },
      },
    } = this.props
    resetFields()
    dispatch({
      type: 'dataAnalysis/fetchRepairRecords',
      payload: { pageNum: 1, pageSize },
    })
  }

  // 查看详情
  handleViewDetail = (work_order) => {
    router.push(`/data-analysis/repair-record/detail/${work_order}`)
  }

  // 查看附件
  handleShowModal = (files) => {
    const newFiles = files.map(item => {
      return {
        src: item,
      }
    })
    this.setState({
      modalVisible: true,
      imageFiles: newFiles,
      currentImage: 0,
    })
  }

  // 关闭查看附件弹窗
  handleModalClose = () => {
    this.setState({
      modalVisible: false,
    })
  }

  // 附件图片的点击翻入上一页
  gotoPrevious = () => {
    let { currentImage } = this.state
    if (currentImage <= 0) return
    this.setState({ currentImage: --currentImage })
  }

  // 附件图片的点击翻入下一页
  gotoNext = () => {
    let { currentImage, imageFiles } = this.state
    if (currentImage >= imageFiles.length - 1) return
    this.setState({ currentImage: ++currentImage })
  }

  // 附件图片点击下方缩略图
  handleClickThumbnail = (i) => {
    const { currentImage } = this.state
    if (currentImage === i) return
    this.setState({ currentImage: i })
  }

  // 翻页
  onPageChange = (pageNum, pageSize) => {
    const {
      form: { getFieldsValue },
      dispatch,
    } = this.props
    const data = getFieldsValue()
    const { time, ...query } = data
    if (time && time.length) {
      const [start, end] = time
      query.startTime = moment(start).format('YYYY-MM-DD HH:mm:ss')
      query.endTime = moment(end).format('YYYY-MM-DD HH:mm:ss')
    }
    dispatch({
      type: 'dataAnalysis/fetchRepairRecords',
      payload: { pageNum, pageSize, ...query },
    })
  }

  renderForm = () => {
    const {
      form: { getFieldDecorator },
      user: {
        currentUser: {
          unitType,
        } = {},
      },
    } = this.props
    return (
      <Card>
        <Form layout="inline" className={styles.repairRecordForm}>
          <Col span={18}>
            <Col span={8}>
              <FormItem className={styles.formItem}>
                {getFieldDecorator('workOrder', {
                  getValueFromEvent: e => e.target.value.trim(),
                })(
                  <Input placeholder="请输入工单编号"></Input>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem className={styles.formItem}>
                {getFieldDecorator('companyName', {
                  getValueFromEvent: e => e.target.value.trim(),
                })(
                  <Input placeholder="报修单位名称"></Input>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem className={styles.formItem}>
                {getFieldDecorator('unitName', {
                  getValueFromEvent: e => e.target.value.trim(),
                })(
                  <Input placeholder="维修单位名称"></Input>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem className={styles.formItem}>
                {getFieldDecorator('status')(
                  <Select placeholder="请选择维修状态">
                    {statusList.map(({ value, label }) => (<Option value={value} key={value} disabled={unitType === 4 && value === 2}>{label}</Option>))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem className={styles.formItem} >
                {getFieldDecorator('time')(
                  <RangePicker
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder={['开始时间', '结束时间']}
                    showTime={{
                      defaultValue: [moment('0:0:0', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                    }}
                  />
                )}
              </FormItem>
            </Col>
          </Col>
          <Col span={6}>
            <FormItem>
              <Button onClick={this.handleQuery} type="primary">查询</Button>
            </FormItem>
            <FormItem>
              <Button onClick={this.handleReset}>重置</Button>
            </FormItem>
          </Col>
        </Form>
      </Card>
    )
  }

  render() {
    const { modalVisible, imageFiles, currentImage } = this.state
    const {
      dataAnalysis: {
        repairRecord: {
          repairRecords,
          pagination: {
            pageNum, pageSize, total,
          },
        },
      },
    } = this.props
    const columns = [
      {
        title: '工单编号',
        dataIndex: 'work_order',
        key: 'work_order',
        align: 'center',
        width: 240,
      },
      {
        title: '报修单位',
        dataIndex: 'company_name',
        key: 'company_name',
        align: 'center',
        width: 350,
      },
      {
        title: '报修人员',
        dataIndex: 'createByName',
        key: 'createByName',
        align: 'center',
        width: 120,
      },
      {
        title: '联系电话',
        dataIndex: 'createByPhone',
        key: 'createByPhone',
        align: 'center',
        width: 140,
      },
      {
        title: '报修时间',
        dataIndex: 'create_date',
        key: 'create_date',
        align: 'center',
        width: 200,
        render: (val) => (
          <span>{moment(+val).format('YYYY-MM-DD HH:mm:ss')}</span>
        ),
      },
      {
        title: '报修附件',
        dataIndex: 'reportPhotos',
        key: 'reportPhotos',
        align: 'center',
        width: 120,
        render: (val, record) => {
          return (
            <Fragment>
              {record.reportPhotos && record.reportPhotos.length ? (
                <a onClick={() => this.handleShowModal(record.reportPhotos)}>
                  查看附件
                </a>
              ) : (
                  <span style={{ color: '#aaa' }}>查看附件</span>
                )}
            </Fragment>
          )
        },
      },
      {
        title: '维修单位',
        dataIndex: 'unit_name',
        key: 'unit_name',
        align: 'center',
        width: 350,
      },
      {
        title: '当前状态',
        dataIndex: 'realStatus',
        key: 'realStatus',
        align: 'center',
        width: 130,
        render: (val) => (
          <span style={{ color: `${(val === "已处理" && "#aaa") || (val === "待处理" && "red") || (val === "处理中" && "#1890FF")}` }}>{val}</span>
        ),
      },
      {
        title: '操作',
        dataIndex: '操作',
        key: '操作',
        align: 'center',
        fixed: 'right',
        width: 120,
        render: (val, record) => (
          <span>
            <a onClick={() => this.handleViewDetail(record.work_order)}>查看</a>
          </span>
        ),
      },
    ]
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={<span style={{ fontSize: '16px' }}>列表记录：{total}</span>}
      >
        {this.renderForm()}
        {repairRecords && repairRecords.length ? (
          <Card className={styles.repairRecordList}>
            <Table scroll={{ x: 1600 }} rowKey="id" columns={columns} dataSource={repairRecords} bordered pagination={false} />
            <Pagination
              style={{ marginTop: '20px', float: 'right' }}
              showQuickJumper
              showSizeChanger
              current={pageNum}
              pageSize={pageSize}
              pageSizeOptions={['5', '10', '15', '20']}
              total={total}
              onChange={this.onPageChange}
              onShowSizeChange={(num, size) => { this.onPageChange(1, size) }} />
          </Card>
        ) : (<Card className={styles.noRepairRecordList}><span >暂无数据</span></Card>)}
        <Lightbox
          images={imageFiles}
          isOpen={modalVisible}
          currentImage={currentImage}
          onClickPrev={this.gotoPrevious}
          onClickNext={this.gotoNext}
          onClose={this.handleModalClose}
          showThumbnails
          onClickThumbnail={this.handleClickThumbnail}
          imageCountSeparator="/"
        />
      </PageHeaderLayout>
    )
  }
}
