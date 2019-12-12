import React, { Component, Fragment } from 'react';
import { message, Card, DatePicker, Spin } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import DescriptionList from '@/components/DescriptionList';
import CustomEmpty from '@/jingan-components/CustomEmpty';
import ReactEcharts from 'echarts-for-react';
import { connect } from 'dva';
import moment from 'moment';
import { isNumber } from '@/utils/utils';
import { kebabCase } from 'lodash';
import locales from '@/locales/zh-CN';
import styles from './index.less';

const { Description } = DescriptionList;
const Empty = () => <span className={styles.empty}>暂无数据</span>;

@connect((state, { route: { name, code, path } }) => {
  const { breadcrumbList } = code.split('.').reduce((result, item, index, list) => {
    const key = `${result.key}.${item}`;
    const title = locales[key];
    result.key = key;
    result.breadcrumbList.push({
      title,
      name: title,
      href: index === list.length - 2 ? path.replace(new RegExp(`${kebabCase(name)}.*`), 'list') : undefined,
    });
    return result;
  }, {
    breadcrumbList: [
      { title: '首页', name: '首页', href: '/' },
    ],
    key: 'menu',
  });
  const namespace = code.replace(/.*\.(.*)\..*/, '$1');
  const {
    [namespace]: {
      deviceDetail,
      monitorTrend,
    },
    loading: {
      effects: {
        [`${namespace}/getDeviceDetail`]: loading,
        [`${namespace}/getMonitorTrend`]: loadingMonitorTrend,
      },
    },
  } = state;
  return {
    deviceDetail,
    monitorTrend,
    loading,
    loadingMonitorTrend,
    breadcrumbList,
  };
}, (dispatch, { match: { params: { id } }, route: { code } }) => {
  const namespace = code.replace(/.*\.(.*)\..*/, '$1');
  return {
    getDeviceDetail(payload, callback) {
      dispatch({
        type: `${namespace}/getDeviceDetail`,
        payload: {
          id,
          ...payload,
        },
        callback: (success, data) => {
          if (!success) {
            message.error('获取详情失败，请稍后重试或联系管理人员！');
          }
          callback && callback(success, data);
        },
      });
    },
    getMonitorTrend(payload, callback) {
      dispatch({
        type: `${namespace}/getMonitorTrend`,
        payload: {
          id,
          ...payload,
        },
        callback: (success, data) => {
          if (!success) {
            message.error('获取监测趋势失败，请稍后重试或联系管理人员！');
          }
          callback && callback(success, data);
        },
      });
    },
  };
})
export default class AlarmWorkOrderMonitorTrend extends Component {
  state = {
    date: moment().startOf('day'),
    paramId: undefined,
  }

  componentDidMount() {
    const { getDeviceDetail, getMonitorTrend } = this.props;
    const { date } = this.state;
    getDeviceDetail();
    getMonitorTrend({
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
   * date的change事件
   */
  handleDateChange = (date) => {
    const { getMonitorTrend } = this.props;
    getMonitorTrend({
      date,
    });
    this.setState({
      date,
    });
  }

  /**
   * paramId的change事件（在我的想象中，获取接口会返回所有参数，paramId只控制显示哪个参数）
   */
  handleParamIdChange = (paramId) => {
    this.setState({
      paramId,
    });
  }

  renderBasicInfo() {
    const {
      deviceDetail: {
        monitorTypeName,
        monitorEquipmentName,
        areaLocation,
        monitorObject,
      }={},
    } = this.props;

    return (
      <Card className={styles.card}>
        <DescriptionList className={styles.descriptionList} gutter={24}>
          <Description term="监测类型">
            {monitorTypeName || <Empty />}
          </Description>
          <Description term="监测设备名称">
            {monitorEquipmentName || <Empty />}
          </Description>
        </DescriptionList>
        <DescriptionList className={styles.descriptionList} gutter={24}>
          <Description term="区域位置">
            {areaLocation || <Empty />}
          </Description>
          <Description term="监测对象">
            {monitorObject || <Empty />}
          </Description>
        </DescriptionList>
      </Card>
    );
  }

  renderMonitorDataTrend() {
    const {
      monitorTrend=[],
      loadingMonitorTrend=false,
    } = this.props;
    const { date, paramId } = this.state;
    const paramList = Array.isArray(monitorTrend) ? monitorTrend : [];
    const { history, unit, normalUpper, largeUpper, normalLower, smallLower, maxValue, minValue } = paramList.find(({ id }) => id === paramId) || {};
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
        text: [warning && `{a|预警阈值：}{b|${warning}}`, warning && `{a|报警阈值：}{b|${alarm}}`].filter(v => v).join('\n'),
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
        top: 48,
        left: 0,
        right: 20,
        bottom: 6,
        containLabel: true,
      },
      xAxis: {
        type: 'time',
        maxInterval: 60 * 60 * 1000,
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
        className={styles.monitorDataTrendContainer}
        title="监测数据趋势"
        extra={(
          <div className={styles.extraContainer}>
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
        tabList={paramList.map(({ id, name }) => ({ key: id, tab: name }))}
        activeTabKey={paramId}
        onTabChange={this.handleParamIdChange}
      >
        <Spin spinning={loadingMonitorTrend}>
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
            <CustomEmpty className={styles.customEmpty} />
          )}
        </Spin>
      </Card>
    );
  }

  render() {
    const {
      breadcrumbList,
      loading=false,
    } = this.props;

    return (
      <PageHeaderLayout
        title={breadcrumbList[breadcrumbList.length - 1].title}
        breadcrumbList={breadcrumbList}
      >
        <Spin spinning={loading}>
          {this.renderBasicInfo()}
          {this.renderMonitorDataTrend()}
        </Spin>
      </PageHeaderLayout>
    );
  }
}
