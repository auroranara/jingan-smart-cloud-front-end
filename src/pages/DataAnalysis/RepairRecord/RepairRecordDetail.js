import React, { PureComponent } from 'react';
// import moment from 'moment';
import { connect } from 'dva';
import { Card, Form, Divider, Row, Spin } from 'antd';
import router from 'umi/router'
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles from './RepairRecordDetail.less'
import moment from 'moment';
import Lightbox from 'react-images';

// 状态戳 已处理 已关闭 待处理
import processed from '@/assets/processed.png';
import processing from '@/assets/processing.png';
import toBeProcessed from '@/assets/to-be-processed.png';

const FormItem = Form.Item;
const title = "报修记录详情"
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 21 },
  },
};
// const ICON_STYLE = {
//   position: 'absolute',
//   fontSize: 25,
//   color: '#fff',
// };
const reportInfo = [
  { label: '工单编号', key: 'work_order', status: 'report' },
  { label: '报修单位', key: 'company_name', status: 'report' },
  { label: '报修时间', key: 'create_date', status: 'report' },
  { label: '报修人员', key: 'createByName', status: 'report' },
  { label: '联系电话', key: 'createByPhone', status: 'report' },
  { label: 'divider', key: 'divider', status: 'report' },
  { label: '系统类型', key: 'systemTypeValue', status: 'report' },
  { label: '设备名称', key: 'device_name', status: 'report' },
  { label: '详细位置', key: 'device_address', status: 'report' },
  { label: '故障描述', key: 'report_desc', status: 'report' },
  { label: '上报照片', key: 'reportPhotos', status: 'report' },
]

const repairInfo = [
  { label: '维修单位', key: 'unit_name', status: 'repair' },
  { label: '维修人员', key: 'executor_name', status: 'repair' },
  { label: '联系电话', key: 'phone', status: 'repair' },
  { label: '开始时间', key: 'start_date', status: 'repair' },
  { label: '结束时间', key: 'end_date', status: 'repair' },
  { label: '维修描述', key: 'disaster_desc', status: 'repair' },
  { label: '维修照片', key: 'sitePhotos', status: 'repair' },
]

@connect(({ dataAnalysis, loading }) => ({
  dataAnalysis,
  loading: loading.models.dataAnalysis,
}))
export default class RepairRecordDetail extends PureComponent {
  state = {
    modalVisible: false,
    currentImage: 0,
    imageFiles: [],
  }
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props
    dispatch({
      type: 'dataAnalysis/fetchRepairRecordDetail',
      payload: { workOrder: id },
    })
  }

  handleToBack = () => {
    router.push('/data-analysis/repair-record/list')
  }


  // 显示图片
  handleClickImg = (i, imageFiles) => {
    const newFiles = imageFiles.map(item => {
      return {
        src: item,
      }
    })
    this.setState({ modalVisible: true, currentImage: i, imageFiles: newFiles });
  };

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

  // 暂无数据
  hasNoContent = () => (<span style={{ fontSize: '16px' }}>暂无数据</span>)

  // 渲染照片
  renderPhotos = (photos) => {
    if (photos && photos.length) {
      return (
        photos.map((item, i) => (
          <div
            key={i}
            className={styles.imgSection}
            style={{
              backgroundImage: `url(${item})`,
              backgroundSize: 'cover',
            }}
            onClick={() => this.handleClickImg(i, photos)}
          />
        ))
      )
    } else return this.hasNoContent()
  }

  renderFormItem = (item, realStatus, value, content = value) => (
    <FormItem key={item.key} label={item.label} {...formItemLayout}>
      {!value || value.length === 0 || (realStatus !== '已处理' && item.status === 'repair' && item.key !== 'unit_name') ? this.hasNoContent() : (<span className={styles.formContent}>{content}</span>)}
    </FormItem>
  )

  // 渲染信息
  renderInfo = (list) => {
    // list为reportInfo或repairInfo数组，用来配置
    const {
      dataAnalysis: {
        repairRecordDetail,
        repairRecordDetail: { realStatus },
      },
    } = this.props
    return list.map(item => {
      if (item.key === "reportPhotos" || item.key === "sitePhotos") {
        return (
          <FormItem key={item.key} label={item.label} {...formItemLayout}>
            <Row>{this.renderPhotos(repairRecordDetail[item.key])}</Row>
          </FormItem>
        )
      } else if (item.key === "create_date" || item.key === "start_date" || item.key === "end_date") {
        const content = moment(repairRecordDetail[item.key]).format("YYYY-MM-DD HH:mm:ss")
        return this.renderFormItem(item, realStatus, repairRecordDetail[item.key], content)
      } else if (item.key === "divider") {
        return (<Divider key="divider" />)
      } else return this.renderFormItem(item, realStatus, repairRecordDetail[item.key])
    })
  }

  render() {
    const {
      loading,
      dataAnalysis: {
        repairRecordDetail: {
          realStatus,
        },
      },
    } = this.props
    const { currentImage, modalVisible, imageFiles = [] } = this.state
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '数据分析', name: '数据分析' },
      { title: '报修记录', name: '报修记录', href: '/data-analysis/repair-record/list' },
      { title, name: title },
    ]
    const statusLogo = (realStatus === "已处理" && processed) || (realStatus === "处理中" && processing) || (realStatus === "待处理" && toBeProcessed) || null
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
      >
        <Spin spinning={loading} delay={200}>
          <Card title="报修内容" className={styles.RepairRecordDetailCard}>
            <Form>
              {this.renderInfo(reportInfo)}
            </Form>
            <div
              className={styles.statusLogo}
              style={{ backgroundImage: `url(${statusLogo})` }}
            ></div>
          </Card>
          <Card title="维修内容" style={{ marginTop: '10px' }} className={styles.RepairRecordDetailCard}>
            <Form>
              {this.renderInfo(repairInfo)}
            </Form>
          </Card>
        </Spin>
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
