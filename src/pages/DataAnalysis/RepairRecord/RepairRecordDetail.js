import React, { PureComponent } from 'react';
// import moment from 'moment';
import { connect } from 'dva';
import { Button, Card, Form, Divider, Row, Col, Icon } from 'antd';
import router from 'umi/router'
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Slider from '../../BigPlatform/FireControl/components/Slider';
import styles from './RepairRecordDetail.less'
import moment from 'moment';

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
const ICON_STYLE = {
  position: 'absolute',
  fontSize: 25,
  color: '#fff',
};
const reportInfo = [
  { label: '工单编号', key: 'work_order' },
  { label: '报修单位', key: 'company_name' },
  { label: '报修时间', key: 'create_date' },
  { label: '报修人员', key: 'createByName' },
  { label: '联系电话', key: 'createByPhone' },
  { label: 'divider', key: 'divider' },
  { label: '系统类型', key: 'systemTypeValue' },
  { label: '设备名称', key: 'device_name' },
  { label: '详细位置', key: 'device_address' },
  { label: '故障描述', key: 'report_desc' },
  { label: '上报照片', key: 'reportPhotos' },
]

const repairInfo = [
  { label: '维修单位', key: 'unit_name' },
  { label: '维修人员', key: 'executor_name' },
  { label: '联系电话', key: 'phone' },
  { label: '开始时间', key: 'start_date' },
  { label: '结束时间', key: 'end_date' },
  { label: '维修描述', key: 'disaster_desc' },
  { label: '维修照片', key: 'sitePhotos' },
]

@connect(({ dataAnalysis }) => ({
  dataAnalysis,
}))
export default class RepairRecordDetail extends PureComponent {
  state = {
    showImg: false,
    magIndex: 0,
    files: [],
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
  handleClickImg = (i, files) => {
    this.setState({ showImg: true, magIndex: i, files });
  };

  // 图片左移点击事件
  handleLeft = indexProp => {
    this.setState(state => ({ [indexProp]: state[indexProp] - 1 }));
  };

  // 图片右移点击事件
  handleRight = indexProp => {
    this.setState(state => ({ [indexProp]: state[indexProp] + 1 }));
  };

  // 关闭图片
  handleCloseImg = () => {
    this.setState({ showImg: false });
  };

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
    } else return (<span style={{ fontSize: '16px' }}>暂无数据</span>)
  }

  renderFormItem = (item, value, content = value) => (
    <FormItem key={item.key} label={item.label} {...formItemLayout}>
      {value && value !== '' ? (<span style={{ fontSize: '16px' }}>{content}</span>) :
        (<span style={{ fontSize: '16px' }}>暂无数据</span>)}
    </FormItem>
  )

  // 渲染信息
  renderInfo = (list) => {
    const {
      dataAnalysis: {
        repairRecordDetail,
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
        const content = moment(repairRecordDetail[item.key]).format("YYYY-MM-DD hh:mm:ss")
        return this.renderFormItem(item, repairRecordDetail[item.key], content)
      } else if (item.key === "divider") {
        return (<Divider key="divider" />)
      } else return this.renderFormItem(item, repairRecordDetail[item.key])
    })
  }

  renderViewImage = () => {
    const { magIndex, showImg, files = [] } = this.state
    const filesLength = files.length
    const isMagEnd = magIndex === (filesLength - 1)
    return (
      <div className={styles.magnify} style={{ display: showImg ? 'block' : 'none' }}>
        <div className={styles.center}>
          <Slider index={magIndex} length={filesLength} size={1}>
            {files.map((item, i) => (
              <div className={styles.magImg} key={i} style={{ backgroundImage: `url(${item})` }} />
            ))}
          </Slider>
        </div>
        <Icon
          type="close"
          onClick={this.handleCloseImg}
          style={{ right: 10, top: 10, cursor: 'pointer', ...ICON_STYLE }}
        />
        <Icon
          type="left"
          style={{
            left: 10,
            top: '50%',
            display: magIndex ? 'block' : 'none',
            cursor: magIndex ? 'pointer' : 'auto',

            ...ICON_STYLE,
          }}
          onClick={magIndex ? () => this.handleLeft('magIndex') : null}
        />
        <Icon
          type="right"
          style={{
            right: 10,
            top: '50%',
            display: isMagEnd ? 'none' : 'block',
            cursor: isMagEnd ? 'auto' : 'pointer',
            ...ICON_STYLE,
          }}
          onClick={isMagEnd ? null : () => this.handleRight('magIndex')}
        />
      </div>
    )
  }


  render() {
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '数据分析', name: '数据分析' },
      { title: '报修记录', name: '报修记录', href: '/data-analysis/repair-record/list' },
      { title, name: title },
    ]
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
      >
        <Card title="报修内容" className={styles.RepairRecordDetailCard}>
          <Form>
            {this.renderInfo(reportInfo)}
          </Form>
        </Card>
        <Card title="维修内容" style={{ marginTop: '10px' }} className={styles.RepairRecordDetailCard}>
          <Form>
            {this.renderInfo(repairInfo)}
          </Form>
        </Card>
        {this.renderViewImage()}
      </PageHeaderLayout>
    )
  }
}
