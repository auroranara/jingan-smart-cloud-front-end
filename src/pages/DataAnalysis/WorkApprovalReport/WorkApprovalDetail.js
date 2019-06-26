import { PureComponent, Fragment } from 'react';
import { Card, Button, Row, Col, Form, Steps } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import DescriptionList from '@/components/DescriptionList';
import Ellipsis from '@/components/Ellipsis';
import Lightbox from 'react-images';
import moment from 'moment';
import hiddenIcon from '@/assets/hiddenIcon.png';

const { Step } = Steps
const { Description } = DescriptionList;

const title = '详情页'
/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};
const fieldsConfig = {
  '0': ['申请人', '申请部门', '申请时间', '危险化学品', '重量(吨)', '是否合格', '供货方信息', '货主或相关人员', '身份证号', '车牌号', '使用单位', '卸货监护人', '受训人员认识', '图片', '车间主任审批', '安全科审批', '抄送人'],
  '1': ['申请人', '申请部门', '申请时间', '作业级别', '作业证编号', '作业开始时间', '作业结束时间', '动火地点', '动火人', '图片', '属地负责人审批', '安全管理部门审批', '动火审批人审批', '抄送人'],
  '2': ['申请人', '申请部门', '申请时间', '作业证编号', '作业空间名称', '作业开始时间', '作业结束时间', '完工验收时间', '作业人', '图片', '申请单位审批', '受限空间所属单位审批', '审批单位审批', '抄送人'],
  '3': ['申请人', '申请部门', '申请时间', '作业证编号', '盲板编号', '作业开始时间', '作业结束时间', '作业人', '图片', '生产车间审批', '作业单位审批-2', '审批单位审批', '抄送人'],
  '4': ['申请人', '申请部门', '申请时间', '作业类别', '作业证编号', '作业开始时间', '作业结束时间', '完工验收时间', '作业地点', '作业人', '图片', '生产单位作业负责人审批', '作业单位负责人审批-2', '审核部门审批', '抄送人'],
  '5': ['申请人', '申请部门', '申请时间', '作业类别', '作业证编号', '作业开始时间', '作业结束时间', '作业地点', '作业人', '图片', '生产单位安全部门负责人审批', '生产单位负责人审批', '作业单位安全部门负责人审批', '作业单位负责人审批-4', '审批部门审批-5', '抄送人'],
  '6': ['申请人', '申请部门', '申请时间', '作业证编号', '作业地点', '作业人', '作业开始时间', '作业结束时间', '完工验收时间', '图片', '作业单位审批-1', '配送店单位审批', '审批部门审批-3', '抄送人'],
  '7': ['申请人', '申请部门', '申请时间', '作业证编号', '作业地点', '作业开始时间', '作业结束时间', '完工验收时间', '图片', '申请单位审批', '作业单位审批-2', '有关水、电、汽、工艺、消防、安全等部门审批', '审批部门审批-4', '抄送人'],
  '8': ['申请人', '申请部门', '申请时间', '作业证编号', '作业开始时间', '作业结束时间', '完工验收时间', '图片', '申请单位审批', '作业单位审批-2', '有关水、电、汽、工艺、消防、安全等部门审批', '审批部门审批-4', '抄送人'],
}
const TYPE_LABEL = {
  '0': '准卸证',
  '1': '动火作业',
  '2': '受限空间作业',
  '3': '盲板抽堵作业',
  '4': '高处作业',
  '5': '吊装作业',
  '6': '临时用电作业',
  '7': '动土作业',
  '8': '断路作业',
}
const APPROVALS = [
  ['车间主任审批', '安全科审批'],
  ['属地负责人审批', '安全管理部门审批', '动火审批人审批'],
  ['申请单位审批', '受限空间所属单位审批', '审批单位审批'],
  ['生产车间审批', '作业单位审批', '审批单位审批'],
  ['生产单位安全部门负责人审批', '生产单位负责人审批', '作业单位安全部门负责人审批', '作业单位负责人审批', '审批部门审批'],
  ['作业单位审批', '配送店单位审批', '审批部门审批'],
  ['申请单位审批', '作业单位审批', '有关水、电、汽、工艺、消防、安全等部门审批', '审批部门审批'],
  ['申请单位审批', '作业单位审批', '有关水、电、汽、工艺、消防、安全等部门审批', '审批部门审批'],
]
const contentStyle = { fontSize: '14px', color: 'rgba(0, 0, 0, 0.65)', paddingTop: '8px' }

@Form.create()
@connect(({ dataAnalysis }) => ({
  dataAnalysis,
}))
export default class WorkApprovalDetail extends PureComponent {

  state = {
    images: [], // 图片列表
    currentImage: 0,// 当前图片索引
  }

  componentDidMount() {
    const {
      dispatch,
      match: { params: { id } },
    } = this.props
    dispatch({
      type: 'dataAnalysis/fetchWorkApprovalDetail',
      payload: { id },
    })
  }

  // 附件图片的点击翻入上一页
  handlePrevImage = () => {
    let { currentImage } = this.state;
    if (currentImage <= 0) return;
    this.setState({ currentImage: --currentImage });
  };

  // 附件图片的点击翻入下一页
  handleNextImage = () => {
    let { currentImage, imgUrl } = this.state;
    if (currentImage >= imgUrl.length - 1) return;
    this.setState({ currentImage: ++currentImage });
  };

  // 附件图片点击下方缩略图
  handleSwitchImage = i => {
    const { currentImage } = this.state;
    if (currentImage === i) return;
    this.setState({ currentImage: i });
  };

  handleClose = () => {
    this.setState({
      images: [],
    });
  };

  renderDesscription = (name, time) => {
    return (
      <Fragment>
        <div style={{ marginTop: '5px', color: 'rgba(0, 0, 0, 0.65)' }}>{name}</div>
        <div style={{ color: 'rgba(0, 0, 0, 0.65)' }}>{time}</div>
      </Fragment>
    )
  }

  /**
   * 渲染流程进度
   */
  renderProgress = () => {
    const {
      match: { params: { type } },
      dataAnalysis: {
        workApprovalDetail: {
          jobApproveHistories = [],
          approveStatus, // 审批状态 2：通过
        },
      },
    } = this.props
    const length = jobApproveHistories.length
    const approvals = APPROVALS[+type] // 当前type下所有审批
    // 当最后一个审批状态为已通过，且当前type下还有剩余审批，则显示下一级审批
    const hasNext = +approveStatus === 2 && (length < approvals.length + 1)
    return (
      <Card title="流程进度">
        <Steps progressDot current={length - 1}>
          {jobApproveHistories.map(({ approveStatusName, userName, approveTime, id }, index) => (
            <Step key={id} title={index === 0 ? approveStatusName : approvals[index - 1] + approveStatusName} description={this.renderDesscription(userName, moment(approveTime).format('YYYY-MM-DD HH-mm'))} />
          ))}
          {hasNext && (<Step key={approvals[length - 1]} title={approvals[length - 1]} />)}
        </Steps>
      </Card>
    )
  }

  renderText = value => (
    <Ellipsis tooltip={!!value} lines={1} style={{ height: 22 }}>
      {value || getEmptyData()}
    </Ellipsis>
  )


  /**
   * 渲染审批人
   */
  renderApproval = (allApproverUsers, level) => {
    const item = allApproverUsers.find(item => +item.level === level) || {}
    const approveUsers = item.approveUsers || []
    const value = approveUsers.map(val => val.userName).join('、')
    return this.renderText(value)
  }

  handleViewImage = (arr, index) => {
    const images = arr.map(({ webUrl }) => ({ src: webUrl }))
    this.setState({ images, currentImage: index })
  }


  /**
   * 渲染作业审批信息
   */
  renderApprovalInfo = () => {
    const {
      match: { params: { type } },
      dataAnalysis: {
        workApprovalDetail,
        workApprovalDetail: {
          photoList = [],
        },
      },
    } = this.props
    const allFields = {
      '申请人': {
        dataIndex: 'applyUserName',
        term: '申请人',
      },
      '申请部门': {
        dataIndex: 'applyDepartmentName',
        term: '申请部门',
      },
      '申请时间': {
        dataIndex: 'applyTime',
        term: '申请时间',
      },
      '危险化学品': {
        term: '危险化学品',
        render: ({ unloadCertificate: { chemicalName } = {} }) => this.renderText(chemicalName),
      },
      '重量(吨)': {
        term: '重量(吨)',
        render: ({ unloadCertificate: { weight } = {} }) => this.renderText(weight),
      },
      '是否合格': {
        term: '是否合格',
        render: ({ unloadCertificate: { qualified } = {} }) => this.renderText(qualified),
      },
      '供货方信息': {
        term: '供货方信息',
        render: ({ unloadCertificate: { supplyCompany } = {} }) => this.renderText(supplyCompany),
      },
      '货主或相关人员': {
        term: '货主或相关人员',
        render: ({ unloadCertificate: { supplyPerson } = {} }) => this.renderText(supplyPerson),
      },
      '身份证号': {
        term: '身份证号',
        render: ({ unloadCertificate: { idNumber } = {} }) => this.renderText(idNumber),
      },
      '车牌号': {
        term: '车牌号',
        render: ({ unloadCertificate: { carNumber } = {} }) => this.renderText(carNumber),
      },
      '使用单位': {
        term: '使用单位',
        render: ({ unloadCertificate: { useCompany } = {} }) => this.renderText(useCompany),
      },
      '卸货监护人': {
        term: '卸货监护人',
        render: ({ unloadCertificate: { guardian } = {} }) => this.renderText(guardian),
      },
      '受训人员认识': {
        term: '受训人员认识',
        render: ({ unloadCertificate: { trainee } = {} }) => this.renderText(trainee),
      },
      '图片': {
        term: '图片',
        colWrapper: { xs: 24 },
        render: () => photoList.length > 0
          ? photoList.map(({ id, webUrl }, index) => (
            <img
              src={webUrl}
              key={id}
              alt=""
              style={{ marginRight: 10, width: 30, height: 40, cursor: 'pointer' }}
              onClick={() => { this.handleViewImage(photoList, index) }}
            />
          ))
          : getEmptyData(),
      },
      '车间主任审批': {
        term: '车间主任审批',
        render: ({ allApproverUsers = [] }) => this.renderApproval(allApproverUsers, 1),
      },
      '安全科审批': {
        term: '安全科审批',
        render: ({ allApproverUsers = [] }) => this.renderApproval(allApproverUsers, 2),
      },
      '抄送人': {
        dataIndex: 'csr',
        term: '抄送人',
        render: ({ allApproverUsers = [] }) => this.renderApproval(allApproverUsers, 0),
      },
      '作业级别': {
        dataIndex: 'levelName',
        term: '作业级别',
      },
      '作业证编号': {
        dataIndex: 'code',
        term: '作业证编号',
      },
      '作业开始时间': {
        dataIndex: 'startTime',
        term: '作业开始时间',
      },
      '作业结束时间': {
        dataIndex: 'endTime',
        term: '作业结束时间',
      },
      '动火地点': {
        dataIndex: 'address',
        term: '动火地点',
      },
      '动火人': {
        dataIndex: 'jobUsers',
        term: '动火人',
      },
      '属地负责人审批': {
        term: '属地负责人审批',
        render: ({ allApproverUsers = [] }) => this.renderApproval(allApproverUsers, 1),
      },
      '安全管理部门审批': {
        term: '安全管理部门审批',
        render: ({ allApproverUsers = [] }) => this.renderApproval(allApproverUsers, 2),
      },
      '动火审批人审批': {
        term: '动火审批人审批',
        render: ({ allApproverUsers = [] }) => this.renderApproval(allApproverUsers, 3),
      },
      '作业空间名称': {
        dataIndex: 'adress',
        term: '作业空间名称',
      },
      '完工验收时间': {
        dataIndex: 'jobFinishTime',
        term: '完工验收时间',
      },
      '作业人': {
        dataIndex: 'jobUsers',
        term: '作业人',
      },
      '生产车间审批': {
        term: '生产车间审批',
        render: ({ allApproverUsers = [] }) => this.renderApproval(allApproverUsers, 1),
      },
      '作业单位审批-1': {
        term: '作业单位审批',
        render: ({ allApproverUsers = [] }) => this.renderApproval(allApproverUsers, 1),
      },
      '作业单位审批-2': {
        term: '作业单位审批',
        render: ({ allApproverUsers = [] }) => this.renderApproval(allApproverUsers, 2),
      },
      '作业类别': {
        dataIndex: 'typeName',
        term: '作业类别',
      },
      '作业地点': {
        dataIndex: 'address',
        term: '作业地点',
      },
      '配送店单位审批': {
        term: '配送店单位审批',
        render: ({ allApproverUsers = [] }) => this.renderApproval(allApproverUsers, 2),
      },
      '审批部门审批-3': {
        term: '审批部门审批',
        render: ({ allApproverUsers = [] }) => this.renderApproval(allApproverUsers, 3),
      },
      '审批部门审批-4': {
        term: '审批部门审批',
        render: ({ allApproverUsers = [] }) => this.renderApproval(allApproverUsers, 4),
      },
      '审批部门审批-5': {
        term: '审批部门审批',
        render: ({ allApproverUsers = [] }) => this.renderApproval(allApproverUsers, 5),
      },
      '申请单位审批': {
        term: '申请单位审批',
        render: ({ allApproverUsers = [] }) => this.renderApproval(allApproverUsers, 1),
      },
      '受限空间所属单位审批': {
        term: '受限空间所属单位审批',
        render: ({ allApproverUsers = [] }) => this.renderApproval(allApproverUsers, 2),
      },
      '审批单位审批': {
        key: 'spdwsp',
        term: '审批单位审批',
        render: ({ allApproverUsers = [] }) => this.renderApproval(allApproverUsers, 3),
      },
      '有关水、电、汽、工艺、消防、安全等部门审批': {
        term: '有关水、电、汽、工艺、消防、安全等部门审批',
        render: ({ allApproverUsers = [] }) => this.renderApproval(allApproverUsers, 3),
      },
      '盲板编号': {
        dataIndex: 'mbbh',
        term: '盲板编号',
      },
      '生产单位作业负责人审批': {
        term: '生产单位作业负责人审批',
        render: ({ allApproverUsers = [] }) => this.renderApproval(allApproverUsers, 1),
      },
      '作业单位负责人审批-2': {
        term: '作业单位负责人审批',
        render: ({ allApproverUsers = [] }) => this.renderApproval(allApproverUsers, 2),
      },
      '作业单位负责人审批-4': {
        term: '作业单位负责人审批',
        render: ({ allApproverUsers = [] }) => this.renderApproval(allApproverUsers, 4),
      },
      '审核部门审批': {
        term: '审核部门审批',
        render: ({ allApproverUsers = [] }) => this.renderApproval(allApproverUsers, 3),
      },
      '生产单位安全部门负责人审批': {
        term: '生产单位安全部门负责人审批',
        render: ({ allApproverUsers = [] }) => this.renderApproval(allApproverUsers, 1),
      },
      '生产单位负责人审批': {
        term: '生产单位负责人审批',
        render: ({ allApproverUsers = [] }) => this.renderApproval(allApproverUsers, 2),
      },
      '作业单位安全部门负责人审批': {
        term: '作业单位安全部门负责人审批',
        render: ({ allApproverUsers = [] }) => this.renderApproval(allApproverUsers, 3),
      },
    }
    const fields = fieldsConfig[type].map(item => allFields[item])
    return (
      <Card style={{ marginTop: '24px' }} title="作业审批信息">
        <DescriptionList style={{ marginBottom: 16 }}>
          {fields.map((item) => {
            const { term, render = null, colWrapper = null, dataIndex } = item
            return (
              <Description term={term} key={term} colWrapper={colWrapper} >
                {render ? render(workApprovalDetail) : (
                  <Ellipsis tooltip={!!workApprovalDetail[dataIndex]} lines={1} style={{ height: 22 }}>
                    {workApprovalDetail[dataIndex] || getEmptyData()}
                  </Ellipsis>
                )}
              </Description>
            )
          })}
        </DescriptionList>
      </Card>
    )
  }

  /**
   * 渲染图片详情
   */
  renderImageDetail() {
    const { images, currentImage } = this.state;
    return (
      images &&
      images.length > 0 && (
        <Lightbox
          images={images}
          isOpen={true}
          currentImage={currentImage}
          onClickPrev={this.handlePrevImage}
          onClickNext={this.handleNextImage}
          onClose={this.handleClose}
          onClickThumbnail={this.handleSwitchImage}
          showThumbnails
          imageCountSeparator="/"
        />
      )
    );
  }

  render() {
    const {
      match: { params: { companyId, type } },
      location: { query: { companyName } },
      dataAnalysis: {
        workApprovalDetail: {
          approveStatusName = null,
          applyUserName = null,
        } = {},
      },
    } = this.props
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '数据分析', name: '数据分析' },
      { title: '作业审批报表', name: '作业审批报表', href: '/data-analysis/work-approval-report/list' },
      { title: '作业审批列表', name: '作业审批列表', href: `/data-analysis/work-approval-report/company/${companyId}/${type}?companyName=${companyName}` },
      { title, name: title },
    ]
    return (
      <PageHeaderLayout
        title={(
          <Fragment>
            {TYPE_LABEL[type]}
            <div style={contentStyle}>单位名称：{companyName || '暂无数据'}</div>
            <div style={contentStyle}>申请人：{applyUserName || '暂无数据'}</div>
          </Fragment>
        )}
        breadcrumbList={breadcrumbList}
        logo={<img alt="" src={hiddenIcon} />}
        action={(
          <Fragment>
            <div style={{ color: 'rgba(0, 0, 0, 0.45)' }}>状态</div>
            <div style={{ fontSize: '20px', color: 'rgba(0,0,0,0.85)' }}>{approveStatusName || '暂无数据'}</div>
          </Fragment>
        )}
      >
        {this.renderProgress()}
        {this.renderApprovalInfo()}
        {this.renderImageDetail()}
      </PageHeaderLayout>
    )
  }
}
