import React, { Component } from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Card, Spin, Row, Col, Table, Badge } from 'antd';
import Range from '../../../components/Range';
import Ellipsis from '@/components/Ellipsis';
import { MiniArea } from '@/components/Charts';
import CustomEmpty from '@/jingan-components/CustomEmpty';
import ReactEcharts from 'echarts-for-react';
import classNames from 'classnames';
import { isNumber, toFixed } from '@/utils/utils';
import iconPoint from '../../../imgs/icon-point.png';
import iconAlarmDuration from '../../../imgs/icon-alarm-duration.png';
import iconAlarmCount from '../../../imgs/icon-alarm-count.png';
import styles from './index.less';

/**
 * 获取报警率百分比图标
 */
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
const DURATION_LABELS = [
  '安全时长',
  '预警时长',
  '报警时长',
];

/**
 * 库区详情-数据统计
 */
export default class DataStatistic extends Component {
  state = {
    range: undefined,
  }

  getDataStatistics = () => {
    const { getDataStatistics } = this.props;
    const { range: [startDate, endDate]=[] } = this.state;
    getDataStatistics({
      startDate,
      endDate,
    });
  }

  /**
   * 获取饼图图例格式化
   */
  getPieLegendFormatter = (index) => {
    const {
      majorHazardMonitor: {
        storageAreaDetail: {
          safeDuration,
          warningDuration,
          alarmDuration,
        }={},
      },
    } = this.props;
    const total = safeDuration + alarmDuration + warningDuration;
    const value = [safeDuration, warningDuration, alarmDuration][index];
    const label = DURATION_LABELS[index];
    return `{a|${label}}{b|${value ? toFixed(value / total * 100) : 0}%}{c|${value}h}`;
  }

  /**
   * 预警/报警次数趋势
   */
  renderTrendChart = () => {
    const {
      majorHazardMonitor: {
        storageAreaDetail: {
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
        left: 0,
        right: 20,
        bottom: 24,
        containLabel: true,
      },
      xAxis: {
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: 'rgba(0, 0, 0, 0.45)',
          },
        },
        axisLabel: {
          color: 'rgba(0, 0, 0, 0.65)',
        },
        splitLine: {
          show: false,
        },
        data: dateList,
      },
      yAxis: {
        axisLine: {
          lineStyle: {
            color: 'rgba(0, 0, 0, 0.45)',
          },
        },
        axisLabel: {
          color: 'rgba(0, 0, 0, 0.65)',
        },
        splitLine: {
          show: false,
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

  /**
   * 罐区监测点报警/预警排名
   */
  renderRankTable = () => {
    const {
      majorHazardMonitor: {
        storageAreaDetail: {
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

  /**
   * 安全状况时长占比
   */
  renderPie() {
    const {
      majorHazardMonitor: {
        storageAreaDetail: {
          safeDuration,
          warningDuration,
          alarmDuration,
        }={},
      },
    } = this.props;

    const option = {
      title: {
        text: `{a|${safeDuration+warningDuration+alarmDuration}}\n{b|h}`,
        textStyle: {
          rich: {
            a: {
              fontSize: 16,
              lineHeight: 20,
              color: 'rgba(0, 0, 0, 0.65)',
            },
            b: {
              fontSize: 12,
              lineHeight: 16,
              color: 'rgba(0, 0, 0, 0.45)',
            },
          },
        },
        textAlign: 'center',
        padding: 0,
        left: '25%',
        top: 'middle',
      },
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
              width: 48,
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
        formatter: this.getPieLegendFormatter,
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
            label: {
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

  /**
   * 物料泄露次数（次）
   */
  renderCompareChart = () => {
    const {
      majorHazardMonitor: {
        storageAreaDetail: {
          leakageCount,
          compare,
          dateList,
          leakageList,
        }={},
      },
    } = this.props;
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
          <div className={styles.compareChartTitle}>物料泄露次数（次）</div>
          <div className={styles.compareChartValue}>{isNumber(leakageCount) ? leakageCount : 0}</div>
          {visible && (
            <div className={styles.compareChartTrend}>
              <LegacyIcon className={styles.compareChartTrendIcon} type={icon} style={{ color }} />
              <div className={styles.compareChartTrendValue} style={{ color }}>{`${Math.abs(compare * 100)}%`}</div>
              <div className={styles.compareChartTrendDescription}>同比上周</div>
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

  /**
   * 物料泄露次数占比（次）
   */
  renderCountPie = () => {
    const {
      majorHazardMonitor: {
        storageAreaDetail: {
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

  handleRangeChange = (range) => {
    this.setState({
      range,
    }, this.getDataStatistics);
  }

  render() {
    const {
      className,
      majorHazardMonitor: {
        storageAreaDataStatistics: {
          pointNumber, // 点位数量
          alarmRate, // 报警率
          alarmDuration, // 报警时长
          alarmCount, // 报警次数
        }={},
        storageAreaDetail: {
          leakageCount,
        }={},
      },
      loadingDataStatistics,
    } = this.props;
    const { range } = this.state;

    return (
      <Card
        className={className}
        title="数据统计"
        extra={(
          <Range value={range} onChange={this.handleRangeChange} />
        )}
      >
        <Spin spinning={!!loadingDataStatistics}>
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
              <div className={styles.statisticalChartTitle}>库区监测点报警/预警排名</div>
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
              <div className={styles.statisticalChartTitle}>物料泄露情况</div>
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
        </Spin>
      </Card>
    );
  }
}
