import React, { Component } from 'react';
import { Spin, Select, message, Card, Row, Col, Table, Badge, Icon } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Ellipsis from '@/components/Ellipsis';
import { MiniArea } from '@/components/Charts';
import CustomEmpty from '@/jingan-components/CustomEmpty';
import ReactEcharts from 'echarts-for-react';
import Range from '../../../components/Range';
import MonitorDataTrend from './MonitorDataTrend';
import { connect } from 'dva';
import router from 'umi/router';
import classNames from 'classnames';
import { isNumber, toFixed } from '@/utils/utils';
import {
  TITLE as GRAND_TITLE,
  URL,
  TANK_AREA_REAL_TIME_URL,
  DURATION_LABELS,
} from '../../../index';
import {
  TITLE as PARENT_TITLE,
  TANK_AREA_DETAIL_URL,
} from '../index';
import iconTankArea from '../../../imgs/icon-tank-area.png';
import iconIsMajorHazard from '../../../imgs/icon-is-major-hazard.png';
import iconAddress from '../../../imgs/icon-address.png';
import iconPoint from '../../../imgs/icon-point.png';
import iconAlarmDuration from '../../../imgs/icon-alarm-duration.png';
import iconAlarmCount from '../../../imgs/icon-alarm-count.png';
import styles from './index.less';

const { Option } = Select;

const GET_TANK_AREA_DETAIL = 'majorHazardMonitor/getTankAreaDetail';
const GET_TANK_AREA_LIST = 'majorHazardMonitor/getTankAreaList';
const GET_TANK_AREA_DETAIL_DATA_STATISTICS = 'majorHazardMonitor/getTankAreaDetailDataStatistics';
const GET_TANK_AREA_PARAM_LIST = 'majorHazardMonitor/getTankAreaParamList';
const TITLE = '储罐区详情';
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
    title: GRAND_TITLE,
    name: GRAND_TITLE,
    href: URL,
  },
  {
    title: PARENT_TITLE,
    name: PARENT_TITLE,
    href: TANK_AREA_REAL_TIME_URL,
  },
  {
    title: TITLE,
    name: TITLE,
  },
];
const getAlarmRateIcon = (rate) => {
  const percent = isNumber(rate) ? toFixed(rate * 100) : 0;
  return `data:image/svg+xml,${encodeURIComponent([
    '<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56">',
    '<defs><style>.cls{transform-origin: 50% 50%;transform: rotate(-90.0deg);}</style></defs>',
    `<circle class="cls" cx="28" cy="28" r="26" stroke="#2EA9E1" stroke-width="4" fill="none" />`,
    `<circle class="cls" cx="28" cy="28" r="26" stroke="#9CDD70" stroke-width="4" fill="none" stroke-dasharray="${2 * Math.PI * 26 * percent / 100}, 224" />`,
    `<text dominant-baseline="central" text-anchor="middle" x="28" y="28" fill="#fff" font-size="16">${percent}%</text>`,
    '</svg>',
  ].join(''))}`;
};
const COLUMNS = [
  {
    title: '',
    dataIndex: 'index',
    width: 26,
    render: (value, data, index) => <Badge count={index+1} style={{ backgroundColor: index < 3 ? '#faad14' : '#d9d9d9' }} />,
  },
  {
    title: '监测点',
    dataIndex: 'name',
    render: (value) => value && <Ellipsis length={6} tooltip>{value}</Ellipsis>,
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
const COMPARE_LABELS = [
  '同比上周',
  '同比上月',
  '同比上季度',
  '同比去年',
];

@connect(({
  user,
  majorHazardMonitor,
  loading,
}) => ({
  user,
  majorHazardMonitor,
  loading: loading.effects[GET_TANK_AREA_DETAIL],
  loadingDataStatistics: loading.effects[GET_TANK_AREA_DETAIL_DATA_STATISTICS],
  loadingParamList: loading.effects[GET_TANK_AREA_PARAM_LIST],
}), dispatch => ({
  getTankAreaDetail(payload, callback) { // 获取储罐区详情
    dispatch({
      type: GET_TANK_AREA_DETAIL,
      payload,
      callback,
    });
  },
  getTankAreaList(payload, callback) { // 获取储罐区列表
    dispatch({
      type: GET_TANK_AREA_LIST,
      payload,
      callback,
    });
  },
  getTankAreaDetailDataStatistics(payload, callback) { // 获取储罐区数据统计
    dispatch({
      type: GET_TANK_AREA_DETAIL_DATA_STATISTICS,
      payload,
      callback,
    });
  },
  getTankAreaParamList(payload, callback) { // 获取监测数据趋势
    dispatch({
      type: GET_TANK_AREA_PARAM_LIST,
      payload,
      callback,
    });
  },
}))
export default class TankAreaDetail extends Component { // 储罐区详情
  state = {
    range: undefined, // 时间范围
    period: undefined, // 周期
  }

  componentDidMount() {
    this.getDetail();
    this.getList();
  }

  componentDidUpdate({ match: { params: { id: prevId } } }) {
    const { match: { params: { id } } } = this.props;
    if (prevId !== id) { // 储罐区id发生变化时重新获取详情数据
      this.getDetail();
    }
  }

  getDetail = () => { //获取详情
    const {
      match: {
        params: {
          id,
        },
      },
      getTankAreaDetail,
    } = this.props;
    getTankAreaDetail({
      id,
    }, (success) => {
      if (!success) {
        message.error('获取储罐区详情失败，请稍后重试或联系管理人员！');
      }
    });
  }

  getList = () => { // 获取列表
    const {
      getTankAreaList,
    } = this.props;
    getTankAreaList({}, (success) => {
      if (!success) {
        message.error('获取储罐区列表失败，请稍后重试或联系管理人员！');
      }
    });
  }

  getDataStatistics = () => { // 获取数据统计
    const {
      match: {
        params: {
          id,
        },
      },
      getTankAreaDetailDataStatistics,
    } = this.props;
    const { range: [startDate, endDate]=[] } = this.state;
    getTankAreaDetailDataStatistics({
      id,
      startDate,
      endDate,
    }, (success) => {
      if (!success) {
        message.error('获取储罐区数据统计失败，请稍后重试或联系管理人员！');
      }
    });
  }

  /**
   * 获取监测数据趋势
   */
  getParamList = (payload, callback) => {
    const {
      match: {
        params: {
          id,
        },
      },
      getTankAreaParamList,
    } = this.props;
    getTankAreaParamList({
      id,
      ...payload,
    }, callback);
  }

  getPieToolTipFormatter = (index) => {
    const {
      majorHazardMonitor: {
        tankAreaDetail: {
          safeDuration,
          warningDuration,
          alarmDuration,
        }={},
      },
    } = this.props;
    const total = safeDuration + alarmDuration + warningDuration;
    const value = [safeDuration, warningDuration, alarmDuration][index];
    const label = DURATION_LABELS[index];
    return `{a|${label}}{b|${value ? Math.round(value / total * 100) : 0}%}{c|${value}h}`;
  }

  handleTankAreaIdChange = (id) => { // 切换储罐区
    router.replace(`${TANK_AREA_DETAIL_URL}/${id}`);
  }

  handleRangeChange = (range) => { // 切换日期范围
    this.setState({
      range,
    }, this.getDataStatistics);
  }

  handlePeriodChange = (period) => {
    this.setState({
      period,
    });
  }

  renderBasicInfo() { // 基础信息
    const {
      majorHazardMonitor: {
        tankAreaDetail: {
          name,
          status,
          isMajorHazard,
          address,
          storage,
          tankCount,
        }={},
      },
    } = this.props;

    return (
      <Card className={styles.card}>
        <div className={styles.basicInfoContainer} style={{ backgroundImage: `url(${iconTankArea})` }}>
          <div className={styles.nameWrapper}>
            <div className={styles.name}>{name}</div>
            {status > 0 && <div className={styles.alarmMarker}>报警</div>}
            {isMajorHazard > 0 && <div className={styles.majorHazard} style={{ backgroundImage: `url(${iconIsMajorHazard})` }}>构成重大危险源</div>}
          </div>
          <div className={styles.address} style={{ backgroundImage: `url(${iconAddress})` }}>{address}</div>
          <div className={styles.tankCount}><span className={styles.label}>存放储罐：</span>{tankCount}</div>
          <div className={styles.storage}><span className={styles.label}>存储物质：</span>{storage}</div>
        </div>
      </Card>
    );
  }

  renderDataStatistics() { // 数据统计
    const {
      majorHazardMonitor: {
        tankAreaDetailDataStatistics: {
          pointNumber, // 点位数量
          alarmRate, // 报警率
          alarmDuration, // 报警时长
          alarmCount, // 报警次数
        }={},
        tankAreaDetail: {
          leakageCount,
        }={},
      },
      loadingDataStatistics,
    } = this.props;
    const { range } = this.state;

    return (
      <Spin spinning={!!loadingDataStatistics}>
        <Card className={styles.card} title="数据统计" extra={(
          <Range value={range} onChange={this.handleRangeChange} onClick={this.handlePeriodChange} />
        )}>
          {/* 统计卡片 */}
          <Row gutter={24}>
            <Col xs={24} sm={12} xl={6}>
              <div className={styles.statisticalCard}>
                <div className={styles.statisticalCardIcon} style={{ backgroundImage: `url(${iconPoint})` }} />
                <div className={styles.statisticalCardContent}>
                  <div className={styles.statisticalCardContentLabel}>监测点位</div>
                  <div className={styles.statisticalCardContentValue}>{pointNumber}</div>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} xl={6}>
              <div className={classNames(styles.statisticalCard, styles.alarmRateCard)}>
                <div className={styles.statisticalCardIcon} style={{ backgroundImage: `url('${getAlarmRateIcon(alarmRate)}')` }} />
                <div className={styles.statisticalCardContent}>
                  <div className={styles.statisticalCardContentLabel}>点位报警率</div>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} xl={6}>
              <div className={classNames(styles.statisticalCard, styles.alarmDurationCard)}>
                <div className={styles.statisticalCardIcon} style={{ backgroundImage: `url(${iconAlarmDuration})` }} />
                <div className={styles.statisticalCardContent}>
                  <div className={styles.statisticalCardContentLabel}>报警时长（h）</div>
                  <div className={styles.statisticalCardContentValue}>{alarmDuration}</div>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} xl={6}>
              <div className={classNames(styles.statisticalCard, styles.alarmCountCard)}>
                <div className={styles.statisticalCardIcon} style={{ backgroundImage: `url(${iconAlarmCount})` }} />
                <div className={styles.statisticalCardContent}>
                  <div className={styles.statisticalCardContentLabel}>报警次数</div>
                  <div className={styles.statisticalCardContentValue}>{alarmCount}</div>
                </div>
              </div>
            </Col>
          </Row>
          {/* 统计图表 */}
          <Row className={styles.chartRow} gutter={24}>
            <Col xs={24} sm={24} md={24} xl={16}>
              <div className={styles.statisticalChartWrapper}>
                <div className={styles.statisticalChartTitle}>预警/报警次数趋势</div>
                <div className={styles.statisticalChartContent}>
                  {this.renderTrendChart()}
                </div>
              </div>
            </Col>
            <Col xs={24} sm={24} md={12} xl={8}>
              <div className={styles.statisticalChartWrapper}>
              <div className={styles.statisticalChartTitle}>罐区监测点报警/预警排名</div>
                <div className={styles.statisticalChartContent}>
                  {this.renderRankTable()}
                </div>
              </div>
            </Col>
            <Col xs={24} sm={24} md={12} xl={8}>
              <div className={styles.statisticalChartWrapper}>
                <div className={styles.statisticalChartTitle}>安全状况时长占比</div>
                <div className={styles.statisticalChartContent}>
                  {this.renderPie()}
                </div>
              </div>
            </Col>
            <Col xs={24} sm={24} md={24} xl={16}>
              <div className={styles.statisticalChartWrapper}>
              <div className={styles.statisticalChartTitle}>储罐泄露情况</div>
                <div className={styles.statisticalChartContent}>
                  {isNumber(leakageCount) ? (
                    <Row>
                      <Col span={10}>
                        {this.renderCompareChart()}
                      </Col>
                      <Col span={14}>
                        {this.renderCountPie()}
                      </Col>
                    </Row>
                  ) : (
                    <CustomEmpty />
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      </Spin>
    );
  }

  renderTrendChart = () => { // 预警/报警次数趋势
    const {
      majorHazardMonitor: {
        tankAreaDetail: {
          dateList=[],
          warningList=[],
          alarmList=[],
        }={},
      },
    } = this.props;

    const option = {
      color: ['#faad14', '#f5222d'],
      tooltip : {
        trigger: 'axis',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
      },
      legend: {
        itemWidth: 8,
        itemHeight: 8,
        bottom: 0,
        left: 'center',
        icon: 'circle',
        textStyle: {
          color: 'rgba(0, 0, 0, 0.45)',
        },
      },
      grid: {
        top: 10,
        left: 10,
        right: 20,
        bottom: 30,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: dateList,
        boundaryGap: false,
        splitLine: {
          show: false,
        },
        axisLabel: {
          color: 'rgba(0, 0, 0, 0.65)',
        },
      },
      yAxis: {
        type: 'value',
        splitLine: {
          show: false,
        },
        axisLabel: {
          color: 'rgba(0, 0, 0, 0.65)',
        },
      },
      series: [
        {
          name: '预警次数',
          type: 'line',
          data: warningList,
        },
        {
          name: '报警次数',
          type: 'line',
          data: alarmList,
        },
      ],
  };

    return dateList && dateList.length > 0 ? (
      <ReactEcharts
        style={{ height: '100%' }}
        option={option}
      />
    ) : (
    <CustomEmpty />
    );
  }

  renderRankTable = () => {
    const {
      majorHazardMonitor: {
        tankAreaDetail: {
          rankList=[],
        }={},
      },
    } = this.props;

    return rankList && rankList.length > 0 ? (
      <Table
        className={styles.table}
        columns={COLUMNS}
        dataSource={rankList}
        rowKey="id"
        pagination={false}
      />
    ) : (
      <CustomEmpty />
    );
  }

  renderPie() { // 安全状况时长占比
    const {
      majorHazardMonitor: {
        tankAreaDetail: {
          safeDuration,
          warningDuration,
          alarmDuration,
        }={},
      },
    } = this.props;

    const option = {
      tooltip: {
        show: false,
      },
      legend: {
        orient: 'vertical',
        right: 0,
        top: 'center',
        icon: 'circle',
        itemWidth: 8,
        itemHeight: 8,
        textStyle: {
          color: 'rgba(0, 0, 0, 0.45)',
          rich: {
            a: {
              width: 24,
            },
            b: {
              width: 36,
              align: 'right',
            },
            c: {
              width: 36,
              align: 'right',
            },
          },
        },
        formatter: this.getPieToolTipFormatter,
      },
      color: ['#52c41a', '#faad14', '#f5222d'],
      series : [
        {
          name: '安全状况时长占比',
          type: 'pie',
          center: ['25%', '50%'],
          radius : ['40%', '55%'],
          data: [
            safeDuration,
            warningDuration,
            alarmDuration,
          ].map((value, index) => ({
            name: `${index}`,
            value,
            label: index === 0 ? {
              normal: {
                position: 'center',
                formatter: `{a|${safeDuration+warningDuration+alarmDuration}}\n{b|h}`,
                rich: {
                  a: {
                    fontSize: 16,
                    lineHeight: 24,
                    color: 'rgba(0, 0, 0, 0.65)',
                  },
                  b: {
                    fontSize: 12,
                    lineHeight: 18,
                    color: 'rgba(0, 0, 0, 0.45)',
                  },
                },
              },
            } : {
              normal: {
                show: false,
              },
            },
          })),
          labelLine: {
            show: false,
          },
        },
      ],
    };

    return isNumber(safeDuration) || isNumber(warningDuration) || isNumber(alarmDuration) ? (
      <ReactEcharts
        style={{ height: '100%' }}
        option={option}
      />
    ) : (
      <CustomEmpty />
    );
  }

  renderCompareChart = () => { // 储罐泄露次数（次）
    const {
      majorHazardMonitor: {
        tankAreaDetail: {
          leakageCount,
          compare,
          dateList,
          leakageList,
        }={},
      },
    } = this.props;
    const { period } = this.state;
    let color, icon, visible = true;
    if (compare > 0) {
      color = '#f5222d';
      icon = 'caret-up';
    } else if (compare < 0) {
      color = '#52c41a';
      icon = 'caret-down';
    } else {
      visible = false;
    }
    const data = dateList ? dateList.map((date, index) => ({ x: date, y: leakageList[index]})) : [];

    return (
      <div className={styles.compareChartWrapper}>
        <div className={styles.compareChartInfo}>
          <div className={styles.compareChartTitle}>储罐泄露次数（次）</div>
          <div className={styles.compareChartValue}>{isNumber(leakageCount) ? leakageCount : 0}</div>
          {visible && (
            <div className={styles.compareChartTrend}>
              <Icon className={styles.compareChartTrendIcon} type={icon} style={{ color }} />
              <div className={styles.compareChartTrendValue} style={{ color }}>{`${Math.abs(compare * 100)}%`}</div>
              <div className={styles.compareChartTrendDescription}>{COMPARE_LABELS[period]}</div>
            </div>
          )}
        </div>
        <MiniArea
          line
          height={64}
          data={data}
        />
      </div>
    );
  }

  renderCountPie = () => { // 物料泄露次数占比（次）
    const {
      majorHazardMonitor: {
        tankAreaDetail: {
          leakageCountList,
        }={},
      },
    } = this.props;

    const option = {
      title: {
        text: '物料泄露次数占比（次）',
        padding: 0,
        textStyle: {
          fontSize: 12,
          fontWeight: 'normal',
          lineHeight: 18,
          color: 'rgba(0, 0, 0, 0.65)',
        },
      },
      tooltip: {
        show: false,
      },
      color: ['#2DB7F5', '#808BC6', '#7DC856', '#5D6977', '#F9BF00'],
      series : [
        {
          name: '物料泄露次数占比（次）',
          type: 'pie',
          center: ['50%', '55%'],
          radius : '50%',
          data: leakageCountList,
          label: {
            formatter: '{a|{b}}\n{b|{d}% {c}}',
            rich: {
              a: {
                fontSize: 12,
                lineHeight: 18,
                color: 'rgba(0, 0, 0, 0.45)',
              },
              b: {
                fontSize: 14,
                lineHeight: 21,
                color: 'rgba(0, 0, 0, 0.65)',
              },
            },
          },
        },
      ],
    };

    return (
      <div className={styles.leakageCountChartWrapper}>
        <ReactEcharts
          style={{ height: 200 }}
          option={option}
        />
      </div>
    );
  }

  /**
   * 监测数据趋势
   */
  renderMonitorDataTrend() {
    const {
      majorHazardMonitor: {
        tankAreaDetail: {
          pointList,
        }={},
        tankAreaParamList,
      },
      loadingParamList,
    } = this.props;

    return (
      <MonitorDataTrend
        className={styles.card}
        pointList={pointList}
        paramList={tankAreaParamList}
        loading={loadingParamList}
        getParamList={this.getParamList}
      />
    );
  }

  render() {
    const {
      match: {
        params: {
          id,
        },
      },
      majorHazardMonitor: {
        tankAreaList=[],
      },
      loading,
    } = this.props;

    return (
      <PageHeaderLayout
        className={styles.container}
        title={TITLE}
        breadcrumbList={BREADCRUMB_LIST}
        action={(
          <Select
            placeholder="请选择储罐区"
            value={id}
            onChange={this.handleTankAreaIdChange}
          >
            {Array.isArray(tankAreaList) && tankAreaList.map(({ id, name }) => (
              <Option key={id}>{name}</Option>
            ))}
          </Select>
        )}
      >
        <Spin spinning={!!loading}>
          {this.renderBasicInfo()}
          {this.renderDataStatistics()}
          {this.renderMonitorDataTrend()}
        </Spin>
      </PageHeaderLayout>
    );
  }
}
