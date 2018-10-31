import React, { PureComponent, Fragment } from 'react';
import { Card, Steps, Table, Icon } from 'antd';
import { connect } from 'dva';
import debounce from 'lodash/debounce';
import moment from 'moment';
import classNames from 'classnames';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import DescriptionList from '@/components/DescriptionList';
import urls from '@/utils/urls';
import titles from '@/utils/titles';

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
/* 表格字段 */
const columns = [
  {
    title: '操作类型',
    dataIndex: 'type',
  },
];
/* 卡片标签列表 */
const cardTabList = [
  {
    key: '1',
    tab: '操作日志一',
  },
  {
    key: '2',
    tab: '操作日志二',
  },
  {
    key: '3',
    tab: '操作日志三',
  },
];
/* 头部标签列表 */
const tabList = [
  {
    key: "1",
    tab: '详情',
  },
  {
    key: '2',
    tab: '规则',
  },
];
/* 获取页面宽度 */
const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth;

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
      stepDirection: 'horizontal',
      cardTab: "1",
      tab: '1',
    };
    this.setStepDirection = debounce(this.setStepDirection, 200);
  }


  /**
   * 挂载后
   */
  componentDidMount() {
    const { dispatch, match: { params: { id } } } = this.props;
    console.log(id);

    // // 获取隐患列表
    // dispatch({
    //   type: 'hiddenDangerReport/fetchList',
    //   payload: {

    //   },
    // });
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
   * 切换卡片标签
   */
  handleCardTabChange = (cardTab) => {
    this.setState({ cardTab });
  }

  /**
   * 切换头部标签
   */
  handleTabChange = (tab) => {
    this.setState({ tab });
  }

  /**
   * 渲染函数
   */
  render() {
    const { hiddenDangerReport: { detail: { id=248224024, status, unitName="无锡晶安科技有限公司" }, tempList=[] }, loading } = this.props;
    const { stepDirection, cardTab, tab } = this.state;
    // const current = status - 1;
    const current = 1;

    return (
      <PageHeaderLayout
        title={<Fragment>{`隐患编号：${id}`}<div className={styles.content}>{`单位名称：${unitName}`}</div></Fragment>}
        logo={
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        }
        action={(
          <div>
            <div className={styles.textSecondary}>状态</div>
            <div className={styles.heading}>待审批</div>
          </div>
        )}
        tabList={tabList}
        tabActiveKey={tab}
        onTabChange={this.handleTabChange}
        breadcrumbList={breadcrumbList}
      >
        <Card title="流程进度" style={{ marginBottom: 24 }} bordered={false}>
          <Steps direction={stepDirection} progressDot={dot => dot} current={current}>
            <Step title="隐患创建" description={(
              <div className={classNames(styles.textSecondary, styles.stepDescription)}>
                曲丽丽
                <div>2016-12-12 12:32</div>
              </div>
            )} />
            <Step title="隐患整改" description={(
              <div className={styles.stepDescription}>
                周毛毛
              </div>
            )} />
            <Step title="隐患复查" />
            <Step title="隐患关闭" />
          </Steps>
        </Card>
        <Card title="隐患信息" style={{ marginBottom: 24 }} bordered={false}>
          <DescriptionList style={{ marginBottom: 16 }}>
            <Description term="隐患来源">付小小</Description>
            <Description term="点位名称">32943898021309809423</Description>
            <Description term="业务分类">3321944288191034921</Description>
            <Description term="隐患等级">18112345678</Description>
            <Description term="检查人">曲丽丽</Description>
            <Description term="创建日期">曲丽丽</Description>
            <Description term="指定整改人">曲丽丽</Description>
            <Description term="计划整改日期">曲丽丽</Description>
          </DescriptionList>
          <DescriptionList style={{ marginBottom: 16 }} col={1}>
            <Description term="检查内容">付小小</Description>
          </DescriptionList>
          <DescriptionList style={{ marginBottom: 16 }} col={1}>
            <Description term="隐患描述">付小小</Description>
          </DescriptionList>
          <DescriptionList style={{ marginBottom: 16 }} col={1}>
            <Description term="隐患图片">付小小</Description>
          </DescriptionList>
        </Card>
        <Card title="整改信息" style={{ marginBottom: 24 }} bordered={false}>
          <div className={styles.noData}>
            <Icon type="frown-o" />
            暂无数据
          </div>
        </Card>
        <Card
          className={styles.tabsCard}
          bordered={false}
          tabList={cardTabList}
          activeTabKey={cardTab}
          onTabChange={this.handleCardTabChange}
        >
          <Table
            pagination={false}
            loading={loading}
            dataSource={tempList}
            columns={columns}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
