import { PureComponent, Fragment } from 'react';
import { Card, Form, Steps, Spin } from 'antd';
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
  '1': ['申请人', '申请部门', '申请时间', '作业级别', '作业证编号', '作业开始时间', '作业结束时间', '动火地点', '动火人', '完工验收时间', '图片', '属地负责人审批', '安全管理部门审批', '动火审批人审批', '抄送人'],
  '2': ['申请人', '申请部门', '申请时间', '作业证编号', '作业空间名称', '作业开始时间', '作业结束时间', '完工验收时间', '作业人', '图片', '申请单位审批', '受限空间所属单位审批', '审批单位审批', '抄送人'],
  '3': ['申请人', '申请部门', '申请时间', '作业证编号', '盲板编号', '作业开始时间', '作业结束时间', '作业人', '图片', '生产车间审批', '作业单位审批-2', '审批单位审批', '抄送人'],
  '4': ['申请人', '申请部门', '申请时间', '作业类别', '作业证编号', '作业开始时间', '作业结束时间', '完工验收时间', '作业地点', '作业人', '图片', '生产单位作业负责人审批', '作业单位负责人审批-2', '审核部门审批', '审批部门审批-4', '抄送人'],
  '5': ['申请人', '申请部门', '申请时间', '作业级别', '作业证编号', '作业开始时间', '作业结束时间', '作业地点', '吊装人', '图片', '生产单位安全部门负责人审批', '生产单位负责人审批', '作业单位安全部门负责人审批', '作业单位负责人审批-4', '审批部门审批-5', '抄送人'],
  '6': ['申请人', '申请部门', '申请时间', '作业证编号', '作业地点', '作业人', '作业开始时间', '作业结束时间', '完工验收时间', '图片', '作业单位审批-1', '配送电单位审批', '审批部门审批-3', '抄送人'],
  '7': ['申请人', '申请部门', '申请时间', '作业证编号', '作业地点', '作业开始时间', '作业结束时间', '完工验收时间', '图片', '申请单位审批', '作业单位审批-2', '有关水、电、汽、工艺、设备、消防、安全等部门审批', '审批部门审批-4', '抄送人'],
  '8': ['申请人', '申请部门', '申请时间', '作业证编号', '作业开始时间', '作业结束时间', '完工验收时间', '图片', '申请单位审批', '作业单位审批-2', '有关水、电、汽、工艺、设备、消防、安全等部门审批', '审批部门审批-4', '抄送人'],
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
  ['车间主任', '安全科'], // 准卸证
  ['属地负责人', '安全管理部门', '动火审批人'], // 动火作业
  ['申请单位', '受限空间所属单位', '审批单位'], // 受限空间作业
  ['生产车间', '作业单位', '审批单位'],        // 盲板抽堵作业
  ['生产单位作业负责人', '作业单位负责人', '审核部门', '审批部门'],  // 高处作业
  ['生产单位安全部门负责人', '生产单位负责人', '作业单位安全部门负责人', '作业单位负责人', '审批部门'],      // 吊装作业
  ['作业单位', '配送电单位', '审批部门'],    //  // 临时用电作业
  ['申请单位', '作业单位', '有关水、电、汽、工艺、设备、消防、安全等部门', '审批部门'], // 动土作业
  ['申请单位', '作业单位', '有关水、电、汽、工艺、设备、消防、安全等部门', '审批部门'], // 断路作业
]
const contentStyle = { fontSize: '14px', color: 'rgba(0, 0, 0, 0.65)', paddingTop: '8px' }

@Form.create()
@connect(({ dataAnalysis, user }) => ({
  dataAnalysis,
  user,
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
    let { currentImage, images } = this.state;
    if (currentImage >= images.length - 1) return;
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

  renderDesscription = (name, time, remark) => {
    return (
      <Fragment>
        {remark && remark.replace(/\s/g, '') && (
          <Ellipsis tooltip={true} lines={1}>
            <span>（{remark}）</span>
          </Ellipsis>
        )}
        <div style={{ marginTop: '5px', color: 'rgba(0, 0, 0, 0.65)' }}>{name}</div>
        <div style={{ color: 'rgba(0, 0, 0, 0.65)' }}>{time}</div>
      </Fragment>
    )
  }

  formatDate = date => date ? moment(date).format('YYYY-MM-DD HH:mm') : ''

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
    // 当最后一个审批状态为已通过，且当前type下还有剩余审批，则显示剩余审批
    const hasNext = [1, 2].includes(+approveStatus) && (length - 1 < approvals.length)
    // 剩余申请步骤数组
    const resApprovals = approvals.slice(length - 1)
    // 当前所在步骤
    const current = length - 1
    return (
      <Card title="流程进度">
        <Steps progressDot current={current}>
          {jobApproveHistories.map(({ approveStatusName, userName, approveTime, id, remark = '' }, index) => (
            <Step
              key={id}
              title={index === 0 || (+approveStatus === 0 && index === length - 1) ? approveStatusName : approvals[index - 1] + approveStatusName}
              description={this.renderDesscription(userName, this.formatDate(approveTime), remark)}
            />
          ))}
          {hasNext && resApprovals.map(item => (
            <Step key={item} title={`${item}审批`} />
          ))}
        </Steps>
      </Card>
    )
  }

  renderText = value => value ? (
    <Ellipsis tooltip={true} lines={1} style={{ height: 22 }}>
      {value}
    </Ellipsis>
  ) : getEmptyData()


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
          applyTime = null,
          startTime = null,
          endTime = null,
          jobFinishTime = null,
          allApproverUsers = [],
          applyUserName = null,
          applyDepartmentName = null,
          levelName = null,
          address = null,
          jobUsers = null,
          code = null,
          typeName = null,
          mbbh = null,
        } = {},
      },
    } = this.props
    const unload = workApprovalDetail.unloadCertificate || {}
    const {
      chemicalName = null,
      weight = null,
      qualified = null,
      supplyCompanyName = null,
      supplyPerson = null,
      idNumber = null,
      carNumber = null,
      useCompanyName = null,
      guardian = null,
      trainee = null,
    } = unload
    const allFields = {
      '申请人': {
        term: '申请人',
        value: applyUserName,
      },
      '申请部门': {
        term: '申请部门',
        value: applyDepartmentName,
      },
      '申请时间': {
        term: '申请时间',
        render: () => this.renderText(this.formatDate(applyTime)),
      },
      '危险化学品': {
        term: '危险化学品',
        render: () => this.renderText(chemicalName),
      },
      '重量(吨)': {
        term: '重量(吨)',
        render: () => this.renderText(weight),
      },
      '是否合格': {
        term: '是否合格',
        render: () => this.renderText(+qualified === 1 ? '是' : '否'),
      },
      '供货方信息': {
        term: '供货方信息',
        render: () => this.renderText(supplyCompanyName),
      },
      '货主或相关人员': {
        term: '货主或相关人员',
        render: () => this.renderText(supplyPerson),
      },
      '身份证号': {
        term: '身份证号',
        render: () => this.renderText(idNumber),
      },
      '车牌号': {
        term: '车牌号',
        render: () => this.renderText(carNumber),
      },
      '使用单位': {
        term: '使用单位',
        render: () => this.renderText(useCompanyName),
      },
      '卸货监护人': {
        term: '卸货监护人',
        render: () => this.renderText(guardian),
      },
      '受训人员认识': {
        term: '受训人员认识',
        render: () => this.renderText(trainee),
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
        render: () => this.renderApproval(allApproverUsers, 1),
      },
      '安全科审批': {
        term: '安全科审批',
        render: () => this.renderApproval(allApproverUsers, 2),
      },
      '抄送人': {
        term: '抄送人',
        render: () => this.renderApproval(allApproverUsers, 0),
      },
      '作业级别': {
        term: '作业级别',
        value: levelName,
      },
      '作业证编号': {
        term: '作业证编号',
        value: code,
      },
      '作业开始时间': {
        term: '作业开始时间',
        render: () => this.renderText(this.formatDate(startTime)),
      },
      '作业结束时间': {
        term: '作业结束时间',
        render: () => this.renderText(this.formatDate(endTime)),
      },
      '动火地点': {
        term: '动火地点',
        value: address,
      },
      '动火人': {
        term: '动火人',
        value: jobUsers,
      },
      '属地负责人审批': {
        term: '属地负责人审批',
        render: () => this.renderApproval(allApproverUsers, 1),
      },
      '安全管理部门审批': {
        term: '安全管理部门审批',
        render: () => this.renderApproval(allApproverUsers, 2),
      },
      '动火审批人审批': {
        term: '动火审批人审批',
        render: () => this.renderApproval(allApproverUsers, 3),
      },
      '作业空间名称': {
        term: '作业空间名称',
        value: address,
      },
      '完工验收时间': {
        term: '完工验收时间',
        render: () => this.renderText(this.formatDate(jobFinishTime)),
      },
      '作业人': {
        term: '作业人',
        value: jobUsers,
      },
      '生产车间审批': {
        term: '生产车间审批',
        render: () => this.renderApproval(allApproverUsers, 1),
      },
      '作业单位审批-1': {
        term: '作业单位审批',
        render: () => this.renderApproval(allApproverUsers, 1),
      },
      '作业单位审批-2': {
        term: '作业单位审批',
        render: () => this.renderApproval(allApproverUsers, 2),
      },
      '作业类别': {
        term: '作业类别',
        value: levelName,
      },
      '作业地点': {
        term: '作业地点',
        value: address,
      },
      '配送电单位审批': {
        term: '配送电单位审批',
        render: () => this.renderApproval(allApproverUsers, 2),
      },
      '审批部门审批-3': {
        term: '审批部门审批',
        render: () => this.renderApproval(allApproverUsers, 3),
      },
      '审批部门审批-4': {
        term: '审批部门审批',
        render: () => this.renderApproval(allApproverUsers, 4),
      },
      '审批部门审批-5': {
        term: '审批部门审批',
        render: () => this.renderApproval(allApproverUsers, 5),
      },
      '申请单位审批': {
        term: '申请单位审批',
        render: () => this.renderApproval(allApproverUsers, 1),
      },
      '受限空间所属单位审批': {
        term: '受限空间所属单位审批',
        render: () => this.renderApproval(allApproverUsers, 2),
      },
      '审批单位审批': {
        key: 'spdwsp',
        term: '审批单位审批',
        render: () => this.renderApproval(allApproverUsers, 3),
      },
      '有关水、电、汽、工艺、设备、消防、安全等部门审批': {
        term: '有关水、电、汽、工艺、设备、消防、安全等部门审批',
        colWrapper: { xs: 16 },
        render: () => this.renderApproval(allApproverUsers, 3),
      },
      '盲板编号': {
        term: '盲板编号',
        value: code,
      },
      '生产单位作业负责人审批': {
        term: '生产单位作业负责人审批',
        render: () => this.renderApproval(allApproverUsers, 1),
      },
      '作业单位负责人审批-2': {
        term: '作业单位负责人审批',
        render: () => this.renderApproval(allApproverUsers, 2),
      },
      '作业单位负责人审批-4': {
        term: '作业单位负责人审批',
        render: () => this.renderApproval(allApproverUsers, 4),
      },
      '审核部门审批': {
        term: '审核部门审批',
        render: () => this.renderApproval(allApproverUsers, 3),
      },
      '生产单位安全部门负责人审批': {
        term: '生产单位安全部门负责人审批',
        render: () => this.renderApproval(allApproverUsers, 1),
      },
      '生产单位负责人审批': {
        term: '生产单位负责人审批',
        render: () => this.renderApproval(allApproverUsers, 2),
      },
      '作业单位安全部门负责人审批': {
        term: '作业单位安全部门负责人审批',
        render: () => this.renderApproval(allApproverUsers, 3),
      },
      '吊装人': {
        term: '吊装人',
        value: jobUsers,
      },

    }
    const fields = fieldsConfig[type].map(item => allFields[item])
    return (
      <Card style={{ marginTop: '24px' }} title="作业审批信息">
        <DescriptionList style={{ marginBottom: 16 }}>
          {fields.map((item) => {
            const { term, render = null, colWrapper = null, value = null } = item
            return (
              <Description term={term} key={term} colWrapper={colWrapper} >
                {render ? render() : (
                  <Ellipsis tooltip={!!value} lines={1} style={{ height: 22 }}>
                    {value || getEmptyData()}
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
   * 渲染图片弹窗
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
      user: { currentUser: { unitType } = {} },
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
            {unitType !== 4 && <div style={contentStyle}>单位名称：{companyName || '暂无数据'}</div>}
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
