import React, { Component, Fragment } from 'react';
import { message, Spin, Row, Col, Card, DatePicker } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import classNames from 'classnames';
import iconAlarm from './imgs/icon-alarm.png';
import iconNormal from './imgs/icon-normal.png';
import iconRealTime from './imgs/icon-real-time.png';
import iconHistory from './imgs/icon-history.png';
import iconMajorHazard from './imgs/icon-major-hazard.png';
import iconTankArea from './imgs/icon-tank-area.png';
import iconTank from './imgs/icon-tank.png';
import iconStorageHouse from './imgs/icon-storage-house.png';
import iconStorageArea from './imgs/icon-storage-area.png';
import iconProcessUnit from './imgs/icon-process-unit.png';
import iconGasometer from './imgs/icon-gasometer.png';
import iconHighRiskProcess from './imgs/icon-high-risk-process.png';
import styles from './index.less';

export const PERIODS = [
  {
    key: '0',
    value: '最近一周',
  },
  {
    key: '1',
    value: '最近一个月',
  },
  {
    key: '2',
    value: '最近三个月',
  },
  {
    key: '3',
    value: '最近一年',
  },
];
export const getRange = (key) => {
  switch(key) {
    case '0':
      return [moment().subtract(7, 'days'), moment()];
    case '1':
      return [moment().subtract(1, 'months'), moment()];
    case '2':
      return [moment().subtract(3, 'months'), moment()];
    case '3':
      return [moment().subtract(1, 'years'), moment()];
    default:
      return;
  }
};
export const TABS = [
  {
    key: '0',
    tab: '实时监测',
  },
  {
    key: '1',
    tab: '历史统计',
  },
];
const LIST = [
  { title: '储罐区监测', icon: iconTankArea, label: '储罐区（个）', normalLabel: '正常罐区（个）', alarmLabel: '报警罐区（个）', realTimeUrl: '/iot/major-hazard/tank-area/real-time/index', historyUrl: '/iot/major-hazard/tank-area/history' },
  { title: '储罐监测', icon: iconTank, label: '储罐（个）', normalLabel: '正常储罐（个）', alarmLabel: '报警储罐（个）', realTimeUrl: '/iot/major-hazard/tank/real-time/index', historyUrl: '/iot/major-hazard/tank/history' },
  { title: '库区监测', icon: iconStorageHouse, label: '库区（个）', normalLabel: '正常库区（个）', alarmLabel: '报警库区（个）', realTimeUrl: '/iot/major-hazard/storage-area/real-time/index', historyUrl: '/iot/major-hazard/storage-area/history' },
  { title: '库房监测 ', icon: iconStorageArea, label: '库房（间）', normalLabel: '正常库房（间）', alarmLabel: '报警库房（间）', realTimeUrl: '/iot/major-hazard/storage-house/real-time/index', historyUrl: '/iot/major-hazard/storage-house/history' },
  { title: '生产装置监测', icon: iconProcessUnit, label: '生产装置（套）', normalLabel: '正常装置（套）', alarmLabel: '报警装置（套）', realTimeUrl: '/iot/major-hazard/process-unit/real-time/index', historyUrl: '/iot/major-hazard/process-unit/history' },
  { title: '气柜监测', icon: iconGasometer, label: '气柜（套）', normalLabel: '正常气柜（套）', alarmLabel: '报警气柜（套）', realTimeUrl: '/iot/major-hazard/gasometer/real-time/index', historyUrl: '/iot/major-hazard/gasometer/history' },
  { title: '高危工艺监测', icon: iconHighRiskProcess, label: '高危工艺（套）', normalLabel: '正常工艺（套）', alarmLabel: '报警工艺（套）', realTimeUrl: '/iot/major-hazard/high-risk-process/real-time/index' },
];
const GET_REAL_TIME = 'majorHazardMonitor/getRealTime';
const GET_HISTORY = 'majorHazardMonitor/getHistory';
const TITLE = '重大危险源监测';
const BREADCRUMB_LIST = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '物联网监测',
    name: '物联网监测',
  },
  {
    title: TITLE,
    name: TITLE,
  },
];
const SPAN = {
  xl: 8,
  md: 12,
  sm: 24,
  xs: 24,
};

@connect(({
  user,
  majorHazardMonitor: {
    realTime,
    history,
  },
}) => ({
  user,
  realTime,
  history,
}), dispatch => ({
  getRealTime(payload, callback) {
    dispatch({
      type: GET_REAL_TIME,
      payload,
      callback,
    });
  },
  getHistory(payload, callback) {
    dispatch({
      type: GET_HISTORY,
      payload,
      callback,
    });
  },
}))
export default class MajorHazard extends Component {
  state = {
    period: undefined,
    range: undefined,
    tabActiveKey: undefined,
    loading: false,
  }

  realTimer = null;

  componentDidMount() {
    this.onTabChange(TABS[1].key);
    this.setRealTimer();
  }

  getRealTime = () => {
    const { getRealTime } = this.props;
    getRealTime(undefined, (successful) => {
      if (!successful) {
        message.error('获取实时监测数据失败，请稍后重试或联系管理人员！');
      }
      this.hideLoading();
    });
  }

  getHistory = () => {
    const { getHistory } = this.props;
    const { range: [startTime, endTime] } = this.state;
    getHistory({
      startTime,
      endTime,
    }, (successful) => {
      if (!successful) {
        message.error('获取历史统计数据失败，请稍后重试或联系管理人员！');
      }
      this.hideLoading();
    });
  }

  setRealTimer = () => {
    setTimeout(() => {
      this.getRealTime();
      this.setRealTimer();
    }, 1 * 60 * 1000);
  }

  hideLoading = () => {
    this.setState({
      loading: false,
    });
  }

  jumpTo = ({ target: { dataset: { url } } }) => {
    router.push(url);
  }

  onTabChange = (tabActiveKey) => {
    this.setState({
      tabActiveKey,
      loading: true,
    });
    if (tabActiveKey === '0') {
      this.getRealTime();
    } else {
      this.setState({
        period: PERIODS[0].key,
        range: getRange(PERIODS[0].key),
      }, this.getHistory);
    }
  }

  onPeriodChange = ({ target: { dataset: { period } } }) => {
    this.setState({
      period,
      range: getRange(period),
    }, this.getHistory);
  }

  onRangeChange = (range) => {
    this.setState({
      period: undefined,
      range,
    }, this.getHistory);
  }

  renderRealTime = () => {
    const {
      realTime=[],
    } = this.props;

    return (
      <Row gutter={24}>
        {realTime.map((item, index) => item && (
          <Col {...SPAN} key={LIST[index].title}>
            <div className={styles.monitorItem}>
              <div className={styles.monitorItemTitleWrapper}>
                <div className={styles.monitorItemTitle}>{LIST[index].title}</div>
                {LIST[index].realTimeUrl && <div className={styles.realTimeJumper} style={{ backgroundImage: `url(${iconRealTime})` }} data-url={LIST[index].realTimeUrl} onClick={this.jumpTo} title={`${LIST[index].title.slice(0, -2)}实时监测`} />}
                {LIST[index].historyUrl && <div className={styles.historyJumper} style={{ backgroundImage: `url(${iconHistory})` }} data-url={LIST[index].historyUrl} onClick={this.jumpTo} title={`${LIST[index].title.slice(0, -2)}历史统计`} />}
              </div>
              <div className={styles.monitorItemContent}>
                <div className={styles.monitorItemCountWrapper} style={{ backgroundImage: `url(${LIST[index].icon})` }}>
                  <div className={styles.monitorItemCountLabel}>{LIST[index].label}</div>
                  <div className={styles.monitorItemCountValue}>{item.normal + item.alarm}</div>
                </div>
                <div className={styles.monitorItemCountWrapper} style={{ backgroundImage: `url(${iconAlarm})` }}>
                  <div className={styles.monitorItemCountLabel}>{LIST[index].alarmLabel}</div>
                  <div className={styles.monitorItemCountValue}>{item.alarm}</div>
                </div>
                <div className={styles.monitorItemCountWrapper} style={{ backgroundImage: `url(${iconNormal})` }}>
                  <div className={styles.monitorItemCountLabel}>{LIST[index].normalLabel}</div>
                  <div className={styles.monitorItemCountValue}>{item.normal}</div>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    );
  }

  renderHistory = () => {
    const {
      history: {
        majorHazard,
        monitorHazard,
        alertRate,
        alerts,
        alarmTime,
        completeRate,
      }={},
    } = this.props;
    const { period, range } = this.state;

    return (
      <Fragment>
        <Card className={styles.card} bordered={false}>
          <div className={styles.radioList} onClick={this.onPeriodChange}>
            {PERIODS.map(({ key, value }) => <div className={classNames(styles.radioItem, period === key && styles.active)} key={key} data-period={key}>{value}</div>)}
          </div>
          <DatePicker.RangePicker
            value={range}
            onChange={this.onRangeChange}
            allowClear={false}
          />
        </Card>
        <Card className={styles.card} bordered={false}>
          <div className={styles.countContainer}>
            <div>
              <div className={styles.countItem} style={{ backgroundImage: `url(${iconMajorHazard})` }}>
                <div className={styles.countLabel}>重大危险源</div>
                <div className={styles.countValue}>{majorHazard}</div>
              </div>
            </div>
            <div>
              <div className={styles.countItem}>
                <div className={styles.countLabel}>监测危险源（个）</div>
                <div className={styles.countValue}>{monitorHazard}</div>
              </div>
              <div className={styles.countItem}>
                <div className={styles.countLabel}>报警率</div>
                <div className={styles.countValue}>{`${Number.parseFloat(((alertRate || 0) * 100).toFixed(2))}%`}</div>
              </div>
              <div className={styles.countItem}>
                <div className={styles.countLabel}>报警次数（次）</div>
                <div className={styles.countValue}>{alerts}</div>
              </div>
              <div className={styles.countItem}>
                <div className={styles.countLabel}>报警时长（h）</div>
                <div className={styles.countValue}>{alarmTime}</div>
              </div>
              <div className={styles.countItem}>
                <div className={styles.countLabel}>工单完成率</div>
                <div className={styles.countValue}>{`${Number.parseFloat(((completeRate || 0) * 100).toFixed(2))}%`}</div>
              </div>
            </div>
          </div>
        </Card>
        <Row gutter={24}>
          <Col span={8}>
            <Card className={styles.card} bordered={false}>
              <div>安全状况时长占比</div>
            </Card>
          </Col>
          <Col span={16}>
            <Card className={styles.card} bordered={false}>
              <div>报警工单</div>
            </Card>
          </Col>
        </Row>
      </Fragment>
    );
  }

  render() {
    const { tabActiveKey, loading } = this.state;

    return (
      <PageHeaderLayout
        className={styles.container}
        title={TITLE}
        breadcrumbList={BREADCRUMB_LIST}
        tabList={TABS}
        tabActiveKey={tabActiveKey}
        onTabChange={this.onTabChange}
      >
        <Spin spinning={loading}>
          {(tabActiveKey === TABS[0].key ? this.renderRealTime : this.renderHistory)()}
        </Spin>
      </PageHeaderLayout>
    );
  }
}
