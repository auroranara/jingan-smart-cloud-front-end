import React, { Component } from 'react';
import { message, Spin, Badge } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Ellipsis from '@/components/Ellipsis';
import {
  RealTime,
  History,
} from './sections';
import { connect } from 'dva';
import { toFixed } from '@/utils/utils';
import styles from './index.less';

export const TITLE = '重大危险源监测';
export const URL = '/iot/major-hazard/index';
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
export const DURATIONS = [
  {
    title: '安全',
    dataIndex: 'safeDuration',
  },
  {
    title: '预警',
    dataIndex: 'warningDuration',
  },
  {
    title: '报警',
    dataIndex: 'alarmDuration',
  },
];
export const COLUMNS = [
  {
    title: '',
    dataIndex: 'index',
    width: 26,
    render: (value, data, index) => <Badge count={index+1} style={{ backgroundColor: index < 3 ? '#faad14' : '#d9d9d9' }} />,
  },
  {
    title: '监测对象名称',
    dataIndex: 'name',
    render: (value) => value && <Ellipsis length={6} tooltip>{value}</Ellipsis>,
  },
  {
    title: '监测点位置',
    dataIndex: 'address',
    render: (value) => value && <Ellipsis length={5} tooltip>{value}</Ellipsis>,
  },
  {
    title: '预警次数',
    dataIndex: 'warningCount',
    render: (value) => value >= 0 && <Ellipsis length={8} tooltip>{`${value}`}</Ellipsis>,
    sorter: (a, b) => a.warningCount - b.warningCount,
    sortDirections: ['descend'],
  },
  {
    title: '报警次数',
    dataIndex: 'alarmCount',
    render: (value) => value >= 0 && <Ellipsis length={8} tooltip>{`${value}`}</Ellipsis>,
    sorter: (a, b) => a.alarmCount - b.alarmCount,
    sortDirections: ['descend'],
  },
];
export const DELAY = 1 * 60 * 1000;
const GET_REAL_TIME = 'majorHazardMonitor/getRealTime';
const GET_HISTORY = 'majorHazardMonitor/getHistory';
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

@connect(({
  user,
  majorHazardMonitor,
}) => ({
  user,
  majorHazardMonitor,
}), dispatch => ({
  getRealTime(payload, callback) { // 获取实时数据
    dispatch({
      type: GET_REAL_TIME,
      payload,
      callback,
    });
  },
  getHistory(payload, callback) { // 获取历史数据
    dispatch({
      type: GET_HISTORY,
      payload,
      callback,
    });
  },
}))
export default class MajorHazard extends Component {
  state = {
    tabActiveKey: undefined,
    loading: false,
  }

  componentDidMount() {
    this.handleTabChange(TABS[0].key);
  }

  /**
   * 获取实时数据
   */
  getRealTime = () => {
    const { getRealTime } = this.props;
    getRealTime({}, (success) => {
      if (!success) {
        message.error('获取实时监测数据失败，请稍后重试或联系管理人员！');
      }
      this.hideLoading();
    });
  }

  /**
   * 获取历史数据
   */
  getHistory = (payload) => {
    const { getHistory } = this.props;
    getHistory(payload, (success) => {
      if (!success) {
        message.error('获取历史统计数据失败，请稍后重试或联系管理人员！');
      }
      this.hideLoading();
    });
  }

  /**
   * 格式化饼图图例
   */
  getPieLegendFormatter = (index) => {
    const {
      majorHazardMonitor: {
        history={},
      },
    } = this.props;
    const {
      safeDuration,
      warningDuration,
      alarmDuration,
    } = history;
    const total = (safeDuration || 0) + (alarmDuration || 0) + (warningDuration || 0);
    const { title, dataIndex } = DURATIONS[index] || {};
    const value = history[dataIndex];
    return `{a|${title}}{b|${value ? toFixed(value / total * 100) : 0}%}{c|${value}h}`;
  }

  /**
   * 格式化折线图tooltip
   */
  getLineToolTipFormatter = (params) => {
    const [{ name }] = params;
    return `${name}<br/>${params.map(({ marker, seriesName, value }) => `${marker}${seriesName}：${value}%`).join('<br />')}`
  }

  /**
   * 隐藏加载动画
   */
  hideLoading = () => {
    this.setState({
      loading: false,
    });
  }

  /**
   * tabActiveKey的change事件
   */
  handleTabChange = (tabActiveKey) => {
    this.setState({
      tabActiveKey,
      loading: true, // 每次切换tab显示加载动画
    });
  }

  // renderHistory = () => {
  //   const {
  //     history: {
  //       majorHazard,
  //       monitorHazard,
  //       alertRate,
  //       alerts,
  //       alarmTime,
  //       completeRate,
  //       rankList,
  //     }={},
  //   } = this.props;
  //   const { period, range, numberType } = this.state;

  //   return (
  //     <Fragment>
  //       <Card className={styles.card}>
  //         <div className={styles.radioList} onClick={this.onPeriodChange}>
  //           {PERIODS.map(({ key, value }) => <div className={classNames(styles.radioItem, period === key && styles.active)} key={key} data-period={key}>{value}</div>)}
  //         </div>
  //         <DatePicker.RangePicker
  //           value={range}
  //           onChange={this.handleRangeChange}
  //           allowClear={false}
  //         />
  //       </Card>
  //       <Card className={styles.card}>
  //         <div className={styles.countContainer}>
  //           <div>
  //             <div className={styles.countItem} style={{ backgroundImage: `url(${iconMajorHazard})` }}>
  //               <div className={styles.countLabel}>重大危险源</div>
  //               <div className={styles.countValue}>{majorHazard}</div>
  //             </div>
  //           </div>
  //           <div>
  //             <div className={styles.countItem}>
  //               <div className={styles.countLabel}>监测危险源（个）</div>
  //               <div className={styles.countValue}>{monitorHazard}</div>
  //             </div>
  //             <div className={styles.countItem}>
  //               <div className={styles.countLabel}>报警率</div>
  //               <div className={styles.countValue}>{`${Number.parseFloat(((alertRate || 0) * 100).toFixed(2))}%`}</div>
  //             </div>
  //             <div className={styles.countItem}>
  //               <div className={styles.countLabel}>报警次数（次）</div>
  //               <div className={styles.countValue}>{alerts}</div>
  //             </div>
  //             <div className={styles.countItem}>
  //               <div className={styles.countLabel}>报警时长（h）</div>
  //               <div className={styles.countValue}>{alarmTime}</div>
  //             </div>
  //             <div className={styles.countItem}>
  //               <div className={styles.countLabel}>工单完成率</div>
  //               <div className={styles.countValue}>{`${Number.parseFloat(((completeRate || 1) * 100).toFixed(2))}%`}</div>
  //             </div>
  //           </div>
  //         </div>
  //       </Card>
  //       <Row gutter={24}>
  //         <Col span={8}>
  //           <Card className={styles.card}>
  //             <div>安全状况时长占比</div>
  //             {this.renderPie()}
  //           </Card>
  //         </Col>
  //         <Col span={16}>
  //           <Card className={styles.card}>
  //             <div className={styles.lineChartTitle}>
  //               报警工单
  //               <div className={styles.lineChartSwitch}>
  //                 <Radio.Group value={numberType} size="small" onChange={this.handleNumberTypeChange}>
  //                   {NUMBER_TYPES.map(({ key, value }) => <Radio.Button value={key} key={key}>{value}</Radio.Button>)}
  //                 </Radio.Group>
  //               </div>
  //             </div>
  //             {this.renderLine()}
  //           </Card>
  //         </Col>
  //       </Row>
  //       <Row gutter={24}>
  //         <Col span={15}>
  //           <Card className={styles.card}>
  //             <div>预警/报警次数趋势</div>
  //             {this.renderLine2()}
  //           </Card>
  //         </Col>
  //         <Col span={9}>
  //           <Card className={styles.card}>
  //             <div>监测点报警/预警排名</div>
  //             <div className={styles.tableWrapper}>
  //               <Table
  //                 className={styles.table}
  //                 columns={COLUMNS}
  //                 dataSource={rankList}
  //                 rowKey="id"
  //                 pagination={false}
  //               />
  //             </div>
  //           </Card>
  //         </Col>
  //       </Row>
  //     </Fragment>
  //   );
  // }

  // renderPie() {
  //   const {
  //     history: {
  //       safeDuration,
  //       warningDuration,
  //       alarmDuration,
  //     }={},
  //   } = this.props;

  //   const option = {
  //     tooltip: {
  //       show: false,
  //     },
  //     legend: {
  //       orient: 'vertical',
  //       right: 0,
  //       top: 'center',
  //       icon: 'circle',
  //       itemWidth: 8,
  //       itemHeight: 8,
  //       textStyle: {
  //         color: 'rgba(0, 0, 0, 0.45)',
  //         rich: {
  //           a: {
  //             width: 24,
  //           },
  //           b: {
  //             width: 36,
  //             align: 'right',
  //           },
  //           c: {
  //             width: 36,
  //             align: 'right',
  //           },
  //         },
  //       },
  //       formatter: this.getPieLegendFormatter,
  //     },
  //     color: ['#52c41a', '#faad14', '#f5222d'],
  //     series : [
  //       {
  //         name: '安全状况时长占比',
  //         type: 'pie',
  //         center: ['25%', '50%'],
  //         radius : ['40%', '55%'],
  //         data: [
  //           safeDuration,
  //           warningDuration,
  //           alarmDuration,
  //         ].map((value, index) => ({
  //           name: `${index}`,
  //           value,
  //           label: index === 0 ? {
  //             normal: {
  //               position: 'center',
  //               formatter: `{a|${safeDuration+warningDuration+alarmDuration}}\n{b|h}`,
  //               rich: {
  //                 a: {
  //                   fontSize: 16,
  //                   lineHeight: 24,
  //                   color: 'rgba(0, 0, 0, 0.65)',
  //                 },
  //                 b: {
  //                   fontSize: 12,
  //                   lineHeight: 18,
  //                   color: 'rgba(0, 0, 0, 0.45)',
  //                 },
  //               },
  //             },
  //           } : {
  //             normal: {
  //               show: false,
  //             },
  //           },
  //         })),
  //         labelLine: {
  //           show: false,
  //         },
  //       },
  //     ],
  //   };

  //   return (
  //     <ReactEcharts
  //       style={{ height: 200 }}
  //       option={option}
  //     />
  //   );
  // }

  // renderLine() {
  //   const {
  //     history: {
  //       dateList,
  //       pendingList=[],
  //       processingList=[],
  //       processedList=[],
  //       pendingPercentList=[],
  //       processingPercentList=[],
  //       processedPercentList=[],
  //     }={},
  //   } = this.props;
  //   const { numberType } = this.state;

  //   const option = {
  //     color: ['#faad14', '#f5222d', '#52c41a'],
  //     tooltip : {
  //       trigger: 'axis',
  //       backgroundColor: 'rgba(0, 0, 0, 0.75)',
  //       formatter: numberType === '1' ? this.getLineToolTipFormatter : undefined,
  //     },
  //     legend: {
  //       itemWidth: 8,
  //       itemHeight: 8,
  //       bottom: 0,
  //       left: 'center',
  //       icon: 'circle',
  //       textStyle: {
  //         color: 'rgba(0, 0, 0, 0.45)',
  //       },
  //     },
  //     grid: {
  //       top: 10,
  //       left: 10,
  //       right: 20,
  //       bottom: 30,
  //       containLabel: true,
  //     },
  //     xAxis: {
  //       type: 'category',
  //       data: dateList,
  //       boundaryGap: false,
  //       splitLine: {
  //         show: false,
  //       },
  //       axisLabel: {
  //         color: 'rgba(0, 0, 0, 0.65)',
  //       },
  //     },
  //     yAxis: {
  //       type: 'value',
  //       splitLine: {
  //         show: false,
  //       },
  //       axisLabel: {
  //         color: 'rgba(0, 0, 0, 0.65)',
  //         formatter: numberType === '1' ? '{value}%' : undefined,
  //       },
  //     },
  //     series: [
  //       {
  //         name: '待处理工单',
  //         type: 'line',
  //         areaStyle: {
  //           opacity: 1,
  //         },
  //         data: numberType === '0' ? pendingList : pendingPercentList,
  //       },
  //       {
  //         name: '处理中工单',
  //         type: 'line',
  //         areaStyle: {
  //           opacity: 1,
  //         },
  //         data: numberType === '0' ? processingList : processingPercentList,
  //       },
  //       {
  //         name: '已处理工单',
  //         type: 'line',
  //         areaStyle: {
  //           opacity: 1,
  //         },
  //         data: numberType === '0' ? processedList: processedPercentList,
  //       },
  //     ],
  // };

  //   return (
  //     <ReactEcharts
  //       key={numberType}
  //       style={{ height: 200 }}
  //       option={option}
  //     />
  //   );
  // }

  // renderLine2() {
  //   const {
  //     history: {
  //       dateList,
  //       warningList=[],
  //       alarmList=[],
  //     }={},
  //   } = this.props;

  //   const option = {
  //     color: ['#faad14', '#f5222d'],
  //     tooltip : {
  //       trigger: 'axis',
  //       backgroundColor: 'rgba(0, 0, 0, 0.75)',
  //     },
  //     legend: {
  //       itemWidth: 8,
  //       itemHeight: 8,
  //       bottom: 0,
  //       left: 'center',
  //       icon: 'circle',
  //       textStyle: {
  //         color: 'rgba(0, 0, 0, 0.45)',
  //       },
  //     },
  //     grid: {
  //       top: 10,
  //       left: 10,
  //       right: 20,
  //       bottom: 30,
  //       containLabel: true,
  //     },
  //     xAxis: {
  //       type: 'category',
  //       data: dateList,
  //       boundaryGap: false,
  //       splitLine: {
  //         show: false,
  //       },
  //       axisLabel: {
  //         color: 'rgba(0, 0, 0, 0.65)',
  //       },
  //     },
  //     yAxis: {
  //       type: 'value',
  //       splitLine: {
  //         show: false,
  //       },
  //       axisLabel: {
  //         color: 'rgba(0, 0, 0, 0.65)',
  //       },
  //     },
  //     series: [
  //       {
  //         name: '预警次数',
  //         type: 'line',
  //         data: warningList,
  //       },
  //       {
  //         name: '报警次数',
  //         type: 'line',
  //         data: alarmList,
  //       },
  //     ],
  // };

  //   return (
  //     <ReactEcharts
  //       style={{ height: 200 }}
  //       option={option}
  //     />
  //   );
  // }

  render() {
    const {
      majorHazardMonitor: {
        realTime,
        history,
      },
    } = this.props;
    const { tabActiveKey, loading } = this.state;
    const { Component, props } = ({
      [TABS[0].key]: {
        Component: RealTime,
        props: {
          data: realTime,
          getData: this.getRealTime,
        },
      },
      [TABS[1].key]: {
        Component: History,
        props: {
          data: history,
          getData: this.getHistory,
        },
      },
    })[tabActiveKey] || {};

    return (
      <PageHeaderLayout
        className={styles.container}
        title={TITLE}
        breadcrumbList={BREADCRUMB_LIST}
        tabList={TABS}
        tabActiveKey={tabActiveKey}
        onTabChange={this.handleTabChange}
      >
        <Spin spinning={loading}>
          {Component && <Component {...props} />}
        </Spin>
      </PageHeaderLayout>
    );
  }
}
