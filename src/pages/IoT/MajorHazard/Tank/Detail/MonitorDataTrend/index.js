import React, { Component, Fragment } from 'react';
import { Spin, Card, Select, DatePicker } from 'antd';
import CustomEmpty from '@/jingan-components/CustomEmpty';
import ReactEcharts from 'echarts-for-react';
import classNames from 'classnames';
import moment from 'moment';
import { isNumber } from '@/utils/utils';
import styles from './index.less';

const { Option } = Select;

/**
 * 储罐区详情-监测数据趋势
 */
export default class MonitorDataTrend extends Component {
  state = {
    pointId: undefined, // 选中的监测点位id
    date: undefined, // 选中的日期
    paramId: undefined, // 选中的参数id
  }

  componentDidUpdate({ majorHazardMonitor: { tankDetail: { id: prevId }={} } }) {
    const { majorHazardMonitor: { tankDetail: { id }={} } } = this.props;
    if (prevId !== id) {
      this.setState({
        date: moment().startOf('day'),
      }, this.getMonitorDataTrend);
    }
  }

  /**
   * 获取源数据
   */
  getMonitorDataTrend() {
    const { majorHazardMonitor: { tankDetail: { id }={} }, getMonitorDataTrend } = this.props;
    const { pointId, date } = this.state;
    getMonitorDataTrend({
      id,
      pointId,
      date,
    }, (success, paramList) => {
      if (success) {
        this.setState({
          paramId: Array.isArray(paramList) && paramList.length ? paramList[0].id : undefined,
        });
      }
    });
  }

  /**
   * pointId的change事件
   */
  handlePointIdChange = (pointId) => {
    this.setState({
      pointId,
    }, this.getMonitorDataTrend);
  }

  /**
   * date的change事件
   */
  handleDateChange = (date) => {
    this.setState({
      date,
    }, this.getMonitorDataTrend);
  }

  /**
   * paramId的change事件（在我的想象中，获取接口会返回所有参数，paramId只控制显示哪个参数）
   */
  handleParamIdChange = (paramId) => {
    this.setState({
      paramId,
    });
  }

  render() {
    const {
      className,
      majorHazardMonitor: {
        tankDetail: {
          pointList,
        }={},
        tankMonitorDataTrend,
      },
      loadingMonitorDataTrend,
    } = this.props;
    const { pointId, date, paramId } = this.state;
    const pointList2 = Array.isArray(pointList) ? pointList : [];
    const paramList2 = Array.isArray(tankMonitorDataTrend) ? tankMonitorDataTrend : [];
    const { history, name, unit, normalUpper, largeUpper, normalLower, smallLower, maxValue, minValue } = paramList2.find(({ id }) => id === paramId) || {};
    const isReserves = name === '实时储量';
    const warningUp = isNumber(normalUpper) && (isNumber(largeUpper) ? `${normalUpper}${unit}~${largeUpper}${unit}` : `≥${normalUpper}${unit}`);
    const warningDown = isNumber(normalLower) && (isNumber(smallLower) ? `${normalLower}${unit}~${smallLower}${unit}` : `≤${normalLower}${unit}`);
    const warning = [warningUp, warningDown].filter(v => v).join('，');
    const alarmUp = isNumber(largeUpper) && `≥${largeUpper}${unit}`;
    const alarmDown = isNumber(smallLower) && `≤${smallLower}${unit}`;
    const alarm = [alarmUp, alarmDown].filter(v => v).join('，');
    let { max, min } = history && history.reduce(({ max, min }, { value }) => {
      return {
        max: Math.max(max, value),
        min: Math.min(min, value),
      };
    }, { max: (history[0] || {}).value, min: (history[0] || {}).value }) || {};
    max = Math.max(isNumber(maxValue) ? maxValue : max, isNumber(normalUpper) ? normalUpper : max, isNumber(largeUpper) ? largeUpper : max, max);
    min = Math.min(isNumber(minValue) ? minValue : min, isNumber(normalLower) ? normalLower : min, isNumber(smallLower) ? smallLower : min, min);
    const option = {
      title: {
        text: [warning && `{a|预警阈值：}{b|${warning}}`, warning && `{a|报警阈值：}{b|${alarm}}`, isReserves && isNumber(maxValue) && `{a|最大储量：}{b|${maxValue}${unit}}`].filter(v => v).join('\n'),
        textStyle: {
          fontSize: 12,
          lineHeight: 18,
          rich: {
            a: {
              color: 'rgba(0, 0, 0, 0.45)',
            },
            b: {
              color: 'rgba(0, 0, 0, 0.65)',
            },
          },
        },
        padding: 0,
      },
      color: ['#1890ff'],
      tooltip : {
        trigger: 'axis',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        formatter(params) {
          const { seriesName, marker, value: [time, value] } = params[params.length - 1];
          return `${moment(time).format('HH:mm')}<br />${marker}${seriesName}：${value}${unit}`;
        },
      },
      grid: {
        top: isReserves && isNumber(maxValue) ? 64 : 48,
        left: 0,
        right: 20,
        bottom: 6,
        containLabel: true,
      },
      xAxis: {
        type: 'time',
        axisLine: {
          lineStyle: {
            color: 'rgba(0, 0, 0, 0.45)',
          },
        },
        axisLabel: {
          color: 'rgba(0, 0, 0, 0.65)',
          formatter(value) {
            return moment(value).format('HH:mm');
          },
        },
        splitLine: {
          show: false,
        },
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
        min,
        max,
      },
      series: [
        {
          name: '浓度数值',
          type: 'line',
          data: history && history.map(({ time, value }) => ({
            name: time,
            value: [
              time,
              value,
            ],
          })),
          markArea: {
            silent: true,
            data: [
              isNumber(smallLower) && [
                {
                  yAxis: min,
                  itemStyle: {
                    color: '#ffb6b2',
                  },
                },
                {
                  yAxis: smallLower,
                },
              ],
              isNumber(normalLower) && [
                {
                  yAxis: isNumber(smallLower) ? smallLower : min,
                  itemStyle: {
                    color: '#ffdfb2',
                  },
                },
                {
                  yAxis: normalLower,
                },
              ],
              [
                {
                  yAxis: Math.max(isNumber(normalLower) ? normalLower : min, isNumber(smallLower) ? smallLower : min, min),
                  itemStyle: {
                    color: '#ddffcc',
                  },
                },
                {
                  yAxis: Math.min(isNumber(normalUpper) ? normalUpper : max, isNumber(largeUpper) ? largeUpper : max, max),
                },
              ],
              isNumber(normalUpper) && [
                {
                  yAxis: normalUpper,
                  itemStyle: {
                    color: '#ffdfb2',
                  },
                },
                {
                  yAxis: isNumber(largeUpper) ? largeUpper : max,
                },
              ],
              isNumber(largeUpper) && [
                {
                  yAxis: largeUpper,
                  itemStyle: {
                    color: '#ffb6b2',
                  },
                },
                {
                  yAxis: max,
                },
              ],
            ].filter(v => v),
          },
        },
      ],
    };

    return (
      <Card
        className={classNames(styles.container, className)}
        title="监测数据趋势"
        extra={(
          <div className={styles.extraContainer}>
            {/* <div className={styles.extraWrapper}>
              <Select
                className={styles.select}
                placeholder="请选择监测点位"
                value={pointId}
                onChange={this.handlePointIdChange}
              >
                {pointList2.map(({ id, name }) => (
                  <Option key={id}>{name}</Option>
                ))}
              </Select>
            </div> */}
            <div className={styles.extraWrapper}>
              <DatePicker
                placeholder="请选择日期"
                value={date}
                onChange={this.handleDateChange}
                allowClear={false}
              />
            </div>
          </div>
        )}
        tabList={paramList2.map(({ id, name }) => ({ key: id, tab: name }))}
        activeTabKey={paramId}
        onTabChange={this.handleParamIdChange}
      >
        <Spin spinning={!!loadingMonitorDataTrend}>
          {history && history.length ? (
            <Fragment>
              <ReactEcharts
                option={option}
              />
              <div className={styles.legendList}>
                <div className={styles.legend}>
                  <div className={styles.legendIcon} />
                  <div className={styles.legendLabel}>安全数值区</div>
                </div>
                <div className={styles.legend}>
                  <div className={styles.legendIcon} />
                  <div className={styles.legendLabel}>预警数值区</div>
                </div>
                <div className={styles.legend}>
                  <div className={styles.legendIcon} />
                  <div className={styles.legendLabel}>报警数值区</div>
                </div>
                <div className={styles.legend}>
                  <div className={styles.legendIcon2}>
                    <div />
                  </div>
                  <div className={styles.legendLabel}>监测数值</div>
                </div>
              </div>
            </Fragment>
          ) : (
            <CustomEmpty className={styles.empty} />
          )}
        </Spin>
      </Card>
    );
  }
}
