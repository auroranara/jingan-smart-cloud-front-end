import React, { PureComponent, Fragment } from 'react';
import { Card, Steps, Spin } from 'antd';
import { connect } from 'dva';
import debounce from 'lodash/debounce';
import moment from 'moment';
import Lightbox from 'react-images';
import classNames from 'classnames';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import DescriptionList from '@/components/DescriptionList';
import urls from '@/utils/urls';
import titles from '@/utils/titles';
import hiddenIcon from '@/assets/hiddenIcon.png';

import styles from './HiddenDangerReportDetail.less';
const { Step } = Steps;
const { Description } = DescriptionList;
const { home: homeUrl, hiddenDangerReport: { list: listUrl } } = urls;
const { home: homeTitle, hiddenDangerReport: { list: listTitle, menu: menuTitle, detail: title } } = titles;
/* 面包屑 */
const breadcrumbList = [
  { title: homeTitle, name: homeTitle, href: homeUrl },
  { title: menuTitle, name: menuTitle },
  { title: listTitle, name: listTitle, href: listUrl },
  { title, name: title },
];
/* 头部标签列表 */
const tabList = [
  {
    key: "1",
    tab: '详情',
  },
  // {
  //   key: '2',
  //   tab: '相关文书',
  // },
];
/* 获取页面宽度 */
const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth;
/* 根据status获取名称 */
const getLabelByStatus = function(status) {
  switch(+status) {
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
const getLabelByBusinessType = function(business_type) {
  switch(+business_type) {
    case 1:
      return '安全生产';
    case 2:
      return '消防';
    case 3:
      return '环保';
    case 4:
      return '卫生';
    default:
      return '';
  }
};

/**
 * 隐患排查报表详情
 */
@connect(({hiddenDangerReport, user, loading}) => ({
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
    this.setStepDirection = debounce(this.setStepDirection, 200);
  }


  /**
   * 挂载后
   */
  componentDidMount() {
    const { dispatch, match: { params: { id } } } = this.props;

    // 获取隐患详情
    dispatch({
      type: 'hiddenDangerReport/fetchDetail',
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
  }

  /**
   * 切换头部标签
   */
  handleTabChange = (tab) => {
    this.setState({ tab });
  }

  /**
   * 切换图片
   */
  handleSwitchImage = (currentImage) => {
    this.setState({
      currentImage,
    });
  }

  /**
   * 切换上一张图片
   */
  handlePrevImage = () => {
    this.setState(({ currentImage }) => ({
      currentImage: currentImage-1,
    }));
  }

  /**
   * 切换下一张图片
   */
  handleNextImage = () => {
    this.setState(({ currentImage }) => ({
      currentImage: currentImage+1,
    }));
  }

  /**
   * 关闭图片详情
   */
  handleClose = () => {
    this.setState({
      images: null,
    });
  }

    /**
   * 图片详情
   */
  renderImageDetail() {
    const { images, currentImage } = this.state;
    return images && images.length > 0 && (
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
            source_type_name,
            // 点位名称
            item_name,
            // 业务分类
            business_type,
            // 隐患等级
            level_name,
            // 检查人
            report_user_name,
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
          },
          hiddenDangerRecord,
          timeLine,
          current,
        },
      },
      user: { currentUser: { unitType } },
      loading,
    } = this.props;
    const { stepDirection, tab } = this.state;
    /* 当前账号是否是企业 */
    const isCompany = unitType === 4;
    // 修改隐患图片
    const fileList = files && files.map(({ id: key, web_url: src }) => ({ key, src }));

    return (
      <PageHeaderLayout
        title={<Fragment>{`隐患编号：${code}`}{!isCompany && <div className={styles.content}>{`单位名称：${company_name}`}</div>}</Fragment>}
        logo={
          <img alt="" src={hiddenIcon} />
        }
        action={(
          <div>
            <div className={styles.textSecondary}>状态</div>
            <div className={styles.heading}>{getLabelByStatus(status)}</div>
          </div>
        )}
        tabList={tabList}
        tabActiveKey={tab}
        onTabChange={this.handleTabChange}
        breadcrumbList={breadcrumbList}
      >
        <Spin spinning={!!loading}>
          <Card title="流程进度" className={styles.card} bordered={false}>
            <Steps direction={stepDirection} progressDot={dot => dot} current={current}>
              {timeLine.map(({ id, time, type, user }) => (
                <Step key={id} title={type} description={time && user ? (
                  <div className={classNames(styles.textSecondary, styles.stepDescription)}>
                    {user}
                    <div>{time}</div>
                  </div>
                ) : undefined} />
              ))}
            </Steps>
          </Card>
          <Card title="隐患信息" className={styles.card} bordered={false}>
            <DescriptionList style={{ marginBottom: 16 }}>
              <Description term="隐患来源">{source_type_name || getEmptyData()}</Description>
              <Description term="点位名称">{item_name || getEmptyData()}</Description>
              <Description term="业务分类">{business_type ? getLabelByBusinessType(business_type) : getEmptyData()}</Description>
              <Description term="隐患等级">{level_name || getEmptyData()}</Description>
              <Description term="检查人">{report_user_name || getEmptyData()}</Description>
              <Description term="创建日期">{report_time ? moment(+report_time).format('YYYY-MM-DD') : getEmptyData()}</Description>
            </DescriptionList>
            <DescriptionList style={{ marginBottom: 16 }} col={1}>
              <Description term="检查内容">{flow_name || getEmptyData()}</Description>
              <Description term="隐患描述">{desc || getEmptyData()}</Description>
              <Description term="隐患图片">{fileList ? (
                fileList.map(({ key, src }, index) => (
                  <img
                    src={src}
                    key={key}
                    alt=""
                    style={{ marginRight: 10, width: 30, height: 40, cursor: 'pointer' }}
                    onClick={() => {this.setState({ images: fileList, currentImage: index });}}
                  />
                ))
              ) : getEmptyData()}</Description>
            </DescriptionList>
            <DescriptionList style={{ marginBottom: 16 }}>
              <Description term="指定整改人">{rectify_user_name || getEmptyData()}</Description>
              <Description term="计划整改日期">{plan_rectify_time ? moment(+plan_rectify_time).format('YYYY-MM-DD') : getEmptyData()}</Description>
            </DescriptionList>
            <DescriptionList style={{ marginBottom: 16 }} col={1}>
              <Description term="指定复查人">{review_user_name || getEmptyData()}</Description>
            </DescriptionList>
          </Card>
          {hiddenDangerRecord.map(({
            id,
            // 2是整改，3是复查
            type,
            // 人
            operator_name,
            // 时间
            create_time_str,
            // 金额
            money,
            // 措施
            operate_content,
            // 图片
            files,
            // 备注
            remark,
          }) => {
            const fileList = files && files.map(({ id: key, web_url: src }) => ({ key, src }));
            if (+type === 2) {
              return (
                <Card title="整改信息" className={styles.card} bordered={false} key={id}>
                  <DescriptionList style={{ marginBottom: 16 }}>
                    <Description term="整改人">{operator_name || getEmptyData()}</Description>
                    <Description term="实际整改日期">{create_time_str || getEmptyData()}</Description>
                    <Description term="整改金额">{money || getEmptyData()}</Description>
                  </DescriptionList>
                  <DescriptionList style={{ marginBottom: 16 }} col={1}>
                    <Description term="整改措施">{operate_content || getEmptyData()}</Description>
                    <Description term="整改图片">{fileList ? (
                      fileList.map(({ key, src }, index) => (
                        <img
                          src={src}
                          key={key}
                          alt=""
                          style={{ marginRight: 10, width: 30, height: 40, cursor: 'pointer' }}
                          onClick={() => {this.setState({ images: fileList, currentImage: index });}}
                        />
                      ))
                    ) : getEmptyData()}</Description>
                  </DescriptionList>
                </Card>
              );
            }
            else if (+type === 3) {
              return (
                <Card title="复查信息" className={styles.card} bordered={false} key={id}>
                  <DescriptionList style={{ marginBottom: 16 }}>
                    <Description term="复查人">{operator_name || getEmptyData()}</Description>
                    <Description term="复查日期">{create_time_str || getEmptyData()}</Description>
                  </DescriptionList>
                  <DescriptionList style={{ marginBottom: 16 }} col={1}>
                    <Description term="备注">{remark || getEmptyData()}</Description>
                    <Description term="复查图片">{fileList ? (
                      fileList.map(({ key, src }, index) => (
                        <img
                          src={src}
                          key={key}
                          alt=""
                          style={{ marginRight: 10, width: 30, height: 40, cursor: 'pointer' }}
                          onClick={() => {this.setState({ images: fileList, currentImage: index });}}
                        />
                      ))
                    ) : getEmptyData()}</Description>
                  </DescriptionList>
                </Card>
              );
            }
            return null;
          })}
          {this.renderImageDetail()}
        </Spin>
      </PageHeaderLayout>
    );
  }
}
