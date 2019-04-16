import React, { PureComponent, Fragment } from 'react';
import { Card, Steps, Spin, Table } from 'antd';
import { connect } from 'dva';
import debounce from 'lodash/debounce';
import moment from 'moment';
import Lightbox from 'react-images';
import classNames from 'classnames';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import DescriptionList from '@/components/DescriptionList';
import Ellipsis from '@/components/Ellipsis';
import urls from '@/utils/urls';
import titles from '@/utils/titles';
import hiddenIcon from '@/assets/hiddenIcon.png';

import styles from './HiddenDangerReportDetail.less';
const { Step } = Steps;
const { Description } = DescriptionList;
const {
  home: homeUrl,
  hiddenDangerReport: { list: listUrl },
} = urls;
const {
  home: homeTitle,
  hiddenDangerReport: { list: listTitle, menu: menuTitle, detail: title },
} = titles;

const crListTitle = '企业自查报表';
const crListUrl = '/data-analysis/company-report/list';
const crDetailtitle = '企业自查报表详情';

/* 头部标签列表 */
const tabList = [
  {
    key: '1',
    tab: '详情',
  },
  {
    key: '2',
    tab: '相关文书',
  },
];
/* 获取页面宽度 */
const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth;
/* 根据status获取名称 */
const getLabelByStatus = function(status) {
  switch (+status) {
    case 3:
      return '待复查';
    case 4:
      return '已关闭';
    case 7:
      return '已超期';
    default:
      return '待整改';
  }
};
/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};
/* 根据业务分类id获取label */
// const getLabelByBusinessType = function(business_type) {
//   switch (+business_type) {
//     case 1:
//       return '安全生产';
//     case 2:
//       return '消防';
//     case 3:
//       return '环保';
//     case 4:
//       return '卫生';
//     default:
//       return '';
//   }
// };

/**
 * 隐患排查报表详情
 */
@connect(({ hiddenDangerReport, user, loading }) => ({
  hiddenDangerReport,
  user,
  loading: loading.models.hiddenDangerReport,
}))
export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // 步骤条方向
      stepDirection: 'horizontal',
      // 当前选中的tabKey
      tab: '1',
      // 图片地址
      images: null,
      // 当前选中图片索引
      currentImage: 0,
    };
    this.columns = [
      {
        title: '文书名称',
        dataIndex: 'docTypeName',
      },
      {
        title: '创建者',
        dataIndex: 'operatorName',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        render: text => moment(+text).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '操作',
        dataIndex: '',
        render: (text, { docPath }) =>
          docPath ? (
            <span
              style={{ cursor: 'pointer', color: '#1890ff' }}
              onClick={() => {
                this.setState({ images: docPath.split(',').map(src => ({ src })) });
              }}
            >
              查看
            </span>
          ) : (
            <span style={{ color: 'rgba(0,0,0,0.45)' }}>未上传</span>
          ),
      },
      // {
      //   title: '类型',
      //   dataIndex: 'docType',
      // },
    ];
    this.setStepDirection = debounce(this.setStepDirection, 200);
  }

  /**
   * 挂载后
   */
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;

    // 获取隐患详情
    dispatch({
      type: 'hiddenDangerReport/fetchDetail',
      payload: {
        id,
      },
    });
    // 获取文书列表
    dispatch({
      type: 'hiddenDangerReport/fetchDocumentList',
      payload: {
        id,
      },
    });
    this.setStepDirection();
    window.addEventListener('resize', this.setStepDirection, { passive: true });
  }

  /**
   * 销毁前
   */
  componentWillUnmount() {
    window.removeEventListener('resize', this.setStepDirection);
    this.setStepDirection.cancel();
  }

  /**
   * 设置步骤条的方向
   */
  setStepDirection = () => {
    const { stepDirection } = this.state;
    const w = getWindowWidth();
    if (stepDirection !== 'vertical' && w <= 576) {
      this.setState({
        stepDirection: 'vertical',
      });
    } else if (stepDirection !== 'horizontal' && w > 576) {
      this.setState({
        stepDirection: 'horizontal',
      });
    }
  };

  /**
   * 切换头部标签
   */
  handleTabChange = tab => {
    this.setState({ tab });
  };

  /**
   * 切换图片
   */
  handleSwitchImage = currentImage => {
    this.setState({
      currentImage,
    });
  };

  /**
   * 切换上一张图片
   */
  handlePrevImage = () => {
    this.setState(({ currentImage }) => ({
      currentImage: currentImage - 1,
    }));
  };

  /**
   * 切换下一张图片
   */
  handleNextImage = () => {
    this.setState(({ currentImage }) => ({
      currentImage: currentImage + 1,
    }));
  };

  /**
   * 关闭图片详情
   */
  handleClose = () => {
    this.setState({
      images: null,
    });
  };

  /**
   * 相关文书
   */
  renderDocumentList() {
    const {
      hiddenDangerReport: { documentList },
    } = this.props;

    return (
      <Card className={styles.card} bordered={false}>
        <Table
          dataSource={documentList}
          columns={this.columns}
          rowKey="createTime"
          pagination={false}
        />
      </Card>
    );
  }

  /**
   * 图片详情
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
        />
      )
    );
  }

  /**
   * 渲染函数
   */
  render() {
    const {
      hiddenDangerReport: {
        detail: {
          hiddenDanger: {
            // 隐患编号
            code,
            // 单位名称
            company_name,
            // 状态
            status,
            // 隐患来源
            report_source_name,
            // 点位名称
            item_name,
            // 业务分类
            business_type,
            // 隐患等级
            level_name,
            // 创建人
            report_user_name,
            // 检查人
            allCheckPersonNames,
            // 创建日期
            report_time,
            // 检查内容
            flow_name,
            // 隐患描述
            desc,
            // 隐患图片
            files,
            // 指定整改人
            rectify_user_name,
            // 计划整改日期
            plan_rectify_time,
            // 指定复查人
            review_user_name,
            // 上报途径
            source_type,
            // 检查类型
            inspectionType,
            // 隐患类型
            hiddenType,
            // 隐患部门
            hiddenDept,
            // 隐患地点
            location,
            // 指定整改单位
            rectifyCompanyName,
            // 指定复查单位
            reviewCompanyName,
            rectify_dept,
          },
          hiddenDangerRecord,
          timeLine,
          current,
        },
      },
      user: {
        currentUser: { unitType },
      },
      location: {
        query: {
          newId,
          checkId,
          checkResultName,
          object_title,
          check_date,
          check_user_name,
          companyName,
          itemTypeName,
        },
      },
      loading,
    } = this.props;
    const { stepDirection, tab } = this.state;
    /* 当前账号是否是企业 */
    const isCompany = unitType === 4;

    const crDetailUrl = `/data-analysis/company-report/detail/${checkId}?companyName=${companyName}&&object_title=${object_title}&&itemTypeName=${itemTypeName}&&check_user_name=${check_user_name}&&check_date=${check_date}&&checkResultName=${checkResultName}`;

    /* 面包屑 */
    const breadcrumbList = [
      { title: homeTitle, name: homeTitle, href: homeUrl },
      { title: menuTitle, name: menuTitle },
      {
        title: newId ? crListTitle : object_title ? crDetailtitle : listTitle,
        name: newId ? crListTitle : object_title ? crDetailtitle : listTitle,
        href: newId ? crListUrl : object_title ? crDetailUrl : listUrl,
      },
      { title, name: title },
    ];

    // 文件
    const fileList = files ? files.map(({ id: key, web_url: src }) => ({ key, src })) : [];
    // 隐患图片
    const images = [],
      audios = [];
    for (const file of fileList) {
      if (/(.jpg|.png)$/.test(file.src)) {
        images.push(file);
      } else {
        audios.push(file);
      }
    }

    return (
      <PageHeaderLayout
        title={
          <Fragment>
            {`隐患编号：${code}`}
            {!isCompany && <div className={styles.content}>{`单位名称：${company_name}`}</div>}
          </Fragment>
        }
        logo={<img alt="" src={hiddenIcon} />}
        action={
          <div>
            <div className={styles.textSecondary}>状态</div>
            <div className={styles.heading}>{getLabelByStatus(status)}</div>
          </div>
        }
        tabList={tabList}
        tabActiveKey={tab}
        onTabChange={this.handleTabChange}
        breadcrumbList={breadcrumbList}
      >
        <Spin spinning={!!loading}>
          {tab === '1' && (
            <Fragment>
              <Card title="流程进度" className={styles.card} bordered={false}>
                <Steps direction={stepDirection} progressDot={dot => dot} current={current}>
                  {timeLine.map(({ id, time, type, user }) => (
                    <Step
                      key={id}
                      title={type}
                      description={
                        time && user ? (
                          <div className={classNames(styles.textSecondary, styles.stepDescription)}>
                            {user}
                            <div>{time}</div>
                          </div>
                        ) : (
                          undefined
                        )
                      }
                    />
                  ))}
                </Steps>
              </Card>
              <Card title="隐患信息" className={styles.card} bordered={false}>
                <DescriptionList style={{ marginBottom: 16 }}>
                  <Description term="隐患来源">
                    <Ellipsis tooltip={!!report_source_name} lines={1} style={{ height: 22 }}>
                      {report_source_name || getEmptyData()}
                    </Ellipsis>
                  </Description>
                  <Description term="上报途径">
                    <Ellipsis tooltip={!!source_type} lines={1} style={{ height: 22 }}>
                      {+source_type === 2
                        ? '随手拍'
                        : +source_type === 3
                          ? '风险点上报'
                          : '监督点上报' || getEmptyData()}
                    </Ellipsis>
                  </Description>
                  <Description term="检查类型">
                    <Ellipsis tooltip={!!inspectionType} lines={1} style={{ height: 22 }}>
                      {inspectionType || getEmptyData()}
                    </Ellipsis>
                  </Description>
                  <Description term="点位名称">
                    <Ellipsis tooltip={!!item_name} lines={1} style={{ height: 22 }}>
                      {item_name || getEmptyData()}
                    </Ellipsis>
                  </Description>
                  <Description term="业务分类">
                    <Ellipsis tooltip={!!business_type} lines={1} style={{ height: 22 }}>
                      {business_type || getEmptyData()}
                    </Ellipsis>
                  </Description>
                  <Description term="隐患等级">
                    <Ellipsis tooltip={!!level_name} lines={1} style={{ height: 22 }}>
                      {level_name || getEmptyData()}
                    </Ellipsis>
                  </Description>
                  <Description term="隐患类型">
                    <Ellipsis tooltip={!!hiddenType} lines={1} style={{ height: 22 }}>
                      {hiddenType || getEmptyData()}
                    </Ellipsis>
                  </Description>
                  <Description term="隐患部门">
                    <Ellipsis tooltip={!!hiddenDept} lines={1} style={{ height: 22 }}>
                      {hiddenDept || getEmptyData()}
                    </Ellipsis>
                  </Description>
                  <Description term="隐患地点">
                    <Ellipsis tooltip={!!location} lines={1} style={{ height: 22 }}>
                      {location || getEmptyData()}
                    </Ellipsis>
                  </Description>
                  <Description term="检查人">
                    <Ellipsis tooltip={!!allCheckPersonNames} lines={1} style={{ height: 22 }}>
                      {allCheckPersonNames || getEmptyData()}
                    </Ellipsis>
                  </Description>
                  <Description term="创建日期">
                    <Ellipsis tooltip={!!report_time} lines={1} style={{ height: 22 }}>
                      {report_time ? moment(+report_time).format('YYYY-MM-DD') : getEmptyData()}
                    </Ellipsis>
                  </Description>
                </DescriptionList>
                <DescriptionList style={{ marginBottom: 16 }} col={1}>
                  <Description term="检查内容">
                    <Ellipsis tooltip={!!flow_name} lines={1} style={{ height: 22 }}>
                      {flow_name || getEmptyData()}
                    </Ellipsis>
                  </Description>
                  <Description term="隐患描述">
                    <Ellipsis tooltip={!!desc} lines={1} style={{ height: 22 }}>
                      {desc || getEmptyData()}
                    </Ellipsis>
                  </Description>
                  <Description term="隐患图片">
                    {images.length > 0
                      ? images.map(({ key, src }, index) => (
                          <img
                            src={src}
                            key={key}
                            alt=""
                            style={{ marginRight: 10, width: 30, height: 40, cursor: 'pointer' }}
                            onClick={() => {
                              this.setState({ images, currentImage: index });
                            }}
                          />
                        ))
                      : getEmptyData()}
                  </Description>
                  {audios.length > 0 && (
                    <Description term="隐患音频">
                      {audios.map(({ key, src }, index) => (
                        <div key={key}>
                          <a href={src} target="_blank" rel="noopener noreferrer">
                            {`隐患音频${index + 1}`}
                          </a>
                        </div>
                      ))}
                    </Description>
                  )}
                </DescriptionList>
                <DescriptionList style={{ marginBottom: 16 }}>
                  <Description term="指定整改单位">
                    <Ellipsis tooltip={!!rectifyCompanyName} lines={1} style={{ height: 22 }}>
                      {rectifyCompanyName || getEmptyData()}
                    </Ellipsis>
                  </Description>
                  <Description term="指定整改人">
                    <Ellipsis tooltip={!!rectify_user_name} lines={1} style={{ height: 22 }}>
                      {rectify_user_name || getEmptyData()}
                      {rectify_dept ? <span> ({rectify_dept || getEmptyData()}) </span> : ''}
                    </Ellipsis>
                  </Description>
                  <Description term="计划整改日期">
                    <Ellipsis tooltip={!!plan_rectify_time} lines={1} style={{ height: 22 }}>
                      {plan_rectify_time
                        ? moment(+plan_rectify_time).format('YYYY-MM-DD')
                        : getEmptyData()}
                    </Ellipsis>
                  </Description>
                </DescriptionList>
                {review_user_name &&
                  report_user_name !== review_user_name && (
                    <DescriptionList style={{ marginBottom: 16 }}>
                      <Description term="指定复查单位">
                        <Ellipsis tooltip={!!reviewCompanyName} lines={1} style={{ height: 22 }}>
                          {reviewCompanyName || getEmptyData()}
                        </Ellipsis>
                      </Description>
                      <Description term="指定复查人">
                        <Ellipsis tooltip={!!review_user_name} lines={1} style={{ height: 22 }}>
                          {review_user_name || getEmptyData()}
                        </Ellipsis>
                      </Description>
                    </DescriptionList>
                  )}
              </Card>
              {hiddenDangerRecord.map(
                ({
                  id,
                  type, // 2是整改，3是复查
                  operator_name, // 人
                  create_time_str, // 时间
                  money, // 金额
                  operate_content, // 措施
                  files, // 图片
                  remark, // 备注
                  companyName,
                  deptName, // 整改部门
                  analysis, // 原因分析
                }) => {
                  const fileList =
                    files && files.map(({ id: key, web_url: src }) => ({ key, src }));
                  // 隐患图片
                  const images = [],
                    audios = [];
                  for (const file of fileList) {
                    if (/(.jpg|.png)$/.test(file.src)) {
                      images.push(file);
                    } else {
                      audios.push(file);
                    }
                  }
                  if (+type === 2) {
                    return (
                      <Card title="整改信息" className={styles.card} bordered={false} key={id}>
                        <DescriptionList style={{ marginBottom: 16 }}>
                          <Description term="整改单位">
                            <Ellipsis tooltip={!!companyName} lines={1} style={{ height: 22 }}>
                              {companyName || getEmptyData()}
                            </Ellipsis>
                          </Description>
                          <Description term="整改部门">
                            <Ellipsis tooltip={!!deptName} lines={1} style={{ height: 22 }}>
                              {deptName || getEmptyData()}
                            </Ellipsis>
                          </Description>
                          <Description term="实际整改人">
                            <Ellipsis tooltip={!!operator_name} lines={1} style={{ height: 22 }}>
                              {operator_name || getEmptyData()}
                            </Ellipsis>
                          </Description>
                          <Description term="实际整改日期">
                            <Ellipsis tooltip={!!create_time_str} lines={1} style={{ height: 22 }}>
                              {create_time_str || getEmptyData()}
                            </Ellipsis>
                          </Description>
                          <Description term="原因分析">
                            <Ellipsis tooltip={!!analysis} lines={1} style={{ height: 22 }}>
                              {analysis || getEmptyData()}
                            </Ellipsis>
                          </Description>
                          <Description term="整改金额">
                            <Ellipsis tooltip lines={1} style={{ height: 22 }}>
                              {typeof money === 'number' ? money : 0}
                            </Ellipsis>
                          </Description>
                        </DescriptionList>
                        <DescriptionList style={{ marginBottom: 16 }} col={1}>
                          <Description term="整改措施">
                            <Ellipsis tooltip={!!operate_content} lines={1} style={{ height: 22 }}>
                              {operate_content || getEmptyData()}
                            </Ellipsis>
                          </Description>
                          <Description term="整改图片">
                            {images.length > 0
                              ? images.map(({ key, src }, index) => (
                                  <img
                                    src={src}
                                    key={key}
                                    alt=""
                                    style={{
                                      marginRight: 10,
                                      width: 30,
                                      height: 40,
                                      cursor: 'pointer',
                                    }}
                                    onClick={() => {
                                      this.setState({ images, currentImage: index });
                                    }}
                                  />
                                ))
                              : getEmptyData()}
                          </Description>
                          {audios.length > 0 && (
                            <Description term="整改音频">
                              {audios.map(({ key, src }, index) => (
                                <div key={key}>
                                  <a href={src} target="_blank" rel="noopener noreferrer">
                                    {`整改音频${index + 1}`}
                                  </a>
                                </div>
                              ))}
                            </Description>
                          )}
                        </DescriptionList>
                      </Card>
                    );
                  } else if (+type === 3) {
                    return (
                      <Card title="复查信息" className={styles.card} bordered={false} key={id}>
                        <DescriptionList style={{ marginBottom: 16 }}>
                          <Description term="复查单位">
                            <Ellipsis tooltip={!!companyName} lines={1} style={{ height: 22 }}>
                              {companyName || getEmptyData()}
                            </Ellipsis>
                          </Description>
                          <Description term="复查人">
                            <Ellipsis tooltip={!!operator_name} lines={1} style={{ height: 22 }}>
                              {operator_name || getEmptyData()}
                            </Ellipsis>
                          </Description>
                          <Description term="复查日期">
                            <Ellipsis tooltip={!!create_time_str} lines={1} style={{ height: 22 }}>
                              {create_time_str || getEmptyData()}
                            </Ellipsis>
                          </Description>
                        </DescriptionList>
                        <DescriptionList style={{ marginBottom: 16 }} col={1}>
                          <Description term="备注">
                            <Ellipsis tooltip={!!remark} lines={1} style={{ height: 22 }}>
                              {remark || getEmptyData()}
                            </Ellipsis>
                          </Description>
                          <Description term="复查图片">
                            {images.length > 0
                              ? images.map(({ key, src }, index) => (
                                  <img
                                    src={src}
                                    key={key}
                                    alt=""
                                    style={{
                                      marginRight: 10,
                                      width: 30,
                                      height: 40,
                                      cursor: 'pointer',
                                    }}
                                    onClick={() => {
                                      this.setState({ images, currentImage: index });
                                    }}
                                  />
                                ))
                              : getEmptyData()}
                          </Description>
                          {audios.length > 0 && (
                            <Description term="复查音频">
                              {audios.map(({ key, src }, index) => (
                                <div key={key}>
                                  <a href={src} target="_blank" rel="noopener noreferrer">
                                    {`复查音频${index + 1}`}
                                  </a>
                                </div>
                              ))}
                            </Description>
                          )}
                        </DescriptionList>
                      </Card>
                    );
                  }
                  return null;
                }
              )}
            </Fragment>
          )}
          {tab === '2' && this.renderDocumentList()}
          {this.renderImageDetail()}
        </Spin>
      </PageHeaderLayout>
    );
  }
}
