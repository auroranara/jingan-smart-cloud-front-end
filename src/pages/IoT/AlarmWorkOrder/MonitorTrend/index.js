import React, { Component, Fragment } from 'react';
import { message, Card, DatePicker, Spin } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import DescriptionList from '@/components/DescriptionList';
import CustomEmpty from '@/jingan-components/CustomEmpty';
import NewVideoPlay from '@/pages/BigPlatform/NewFireControl/section/NewVideoPlay';
import ReactEcharts from 'echarts-for-react';
import { connect } from 'dva';
import moment from 'moment';
import { isNumber } from '@/utils/utils';
import { kebabCase } from 'lodash';
import locales from '@/locales/zh-CN';
import styles from './index.less';

const { Description } = DescriptionList;
const EmptyData = () => <span className={styles.empty}>暂无数据</span>;
const DEFAULT_FORMAT = 'YYYY-MM-DD';

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
    currentIndex: undefined,
    videoVisible: false,
    videoKeyId: undefined,
  }

  componentDidMount() {
    const { getDeviceDetail } = this.props;
    getDeviceDetail({}, (success) => {
      if (success) {
        this.handleCurrentIndexChange('0');
      }
    });
  }

  showVideo = () => {
    const {
      deviceDetail: {
        videoList=[],
      }={},
    } = this.props;

    this.setState({
      videoVisible: true,
      videoKeyId: videoList[0].key_id,
    });
  }

  hideVideo = () => {
    this.setState({
      videoVisible: false,
    });
  }

  /**
   * date的change事件
   */
  handleDateChange = (date) => {
    const {
      deviceDetail: {
        allMonitorParam,
      }={},
      getMonitorTrend,
    } = this.props;
    const { currentIndex } = this.state;
    if (allMonitorParam && allMonitorParam[currentIndex]) {
      const { sensorId, paramCode } = allMonitorParam[currentIndex];
      getMonitorTrend({
        sensorId,
        code: paramCode,
        queryDate: date.format(DEFAULT_FORMAT),
      });
    }
    this.setState({
      date,
    });
  }

  /**
   * paramId的change事件（在我的想象中，获取接口会返回所有参数，paramId只控制显示哪个参数）
   */
  handleCurrentIndexChange = (currentIndex) => {
    const {
      deviceDetail: {
        allMonitorParam,
      }={},
      getMonitorTrend,
    } = this.props;
    const { date } = this.state;
    if (allMonitorParam && allMonitorParam[currentIndex]) {
      const { sensorId, paramCode } = allMonitorParam[currentIndex];
      getMonitorTrend({
        sensorId,
        code: paramCode,
        queryDate: date.format(DEFAULT_FORMAT),
      });
    }
    this.setState({
      currentIndex,
    });
  }

  renderBasicInfo() {
    const {
      deviceDetail: {
        equipmentType,
        equipmentTypeName,
        name,
        areaLocation,
        beMonitorTargetName,
        videoList,
        unitTypeName,
        loopNumber,
        partNumber,
      }={},
    } = this.props;
    const isHost = +equipmentType === 1;

    return (
      <Card className={styles.card}>
        <DescriptionList className={styles.descriptionList} gutter={24}>
          <Description term="监测类型">
            {equipmentTypeName || <EmptyData />}
          </Description>
          {isHost ? (
            <Description term="消防主机">
              {name || <EmptyData />}
            </Description>
          ) : (
            <Description term="监测设备名称">
              <div className={styles.nameWrapper}>
                <div className={styles.name}>{name || <EmptyData />}</div>
                {videoList && videoList.length > 0 && <div className={styles.videoWrapper}><div className={styles.video} onClick={this.showVideo} /></div>}
              </div>
            </Description>
          )}
        </DescriptionList>
        <DescriptionList className={styles.descriptionList} gutter={24}>
          {isHost && (
            <Description term="部件类型">
              {unitTypeName || <EmptyData />}
            </Description>
          )}
          {isHost && (
            <Description term="回路号">
              <div className={styles.nameWrapper}>
                <div className={styles.name}>{loopNumber || partNumber ? `${loopNumber ? `${loopNumber}回路` : ''}${partNumber ? `${partNumber}号` : ''}` : <EmptyData />}</div>
                {videoList && videoList.length > 0 && <div className={styles.videoWrapper}><div className={styles.video} onClick={this.showVideo} /></div>}
              </div>
            </Description>
          )}
          <Description term="区域位置">
            {areaLocation || <EmptyData />}
          </Description>
          {!isHost && (
            <Description term="监测对象">
              {beMonitorTargetName || <EmptyData />}
            </Description>
          )}
        </DescriptionList>
      </Card>
    );
  }

  renderMonitorDataTrend() {
    const {
      deviceDetail: {
        allMonitorParam,
      }={},
      monitorTrend,
      loadingMonitorTrend=false,
    } = this.props;
    const { date, currentIndex } = this.state;
    const tabList = (allMonitorParam || []).map(({ paramDesc }, index) => ({ key: `${index}`, tab: paramDesc }));
    const { fixType, paramDesc } = (allMonitorParam || [])[currentIndex] || {};
    const isNotFire = +fixType !== 5;
    let option, visible = monitorTrend && monitorTrend.length > 0;
    if (isNotFire) {
      // 获取单位、范围（单位不存在的情况不知道需不需要考虑）
      const { paramUnit: unit, paramWarnStrategyList, rangeMax: maxValue, rangeMin: minValue } = (allMonitorParam || [])[currentIndex] || {};
      // 获取预警、告警值
      const { normalUpper, largeUpper, normalLower, smallLower } = (paramWarnStrategyList || []).reduce((result, { condition, limitValue, warnLevel }) => {
        if (condition === '>=') {
          if (+warnLevel === 1) {
            result.normalUpper = limitValue;
          } else if (+warnLevel === 2) {
            result.largeUpper = limitValue;
          }
        } else if (condition === '<=') {
          if (+warnLevel === 1) {
            result.normalLower = limitValue;
          } else if (+warnLevel === 2) {
            result.smallLower = limitValue;
          }
        }
        return result;
      }, {});
      // 预警上限文本
      const warningUp = isNumber(normalUpper) && (isNumber(largeUpper) ? `${normalUpper}${unit}~${largeUpper}${unit}` : `≥${normalUpper}${unit}`);
      // 预警下限文本
      const warningDown = isNumber(normalLower) && (isNumber(smallLower) ? `${smallLower}${unit}~${normalLower}${unit}` : `≤${normalLower}${unit}`);
      // // 预警上限文本
      // const warningUp = isNumber(normalUpper) && `≥${normalUpper}${unit}`;
      // // 预警下限文本
      // const warningDown = isNumber(normalLower) && `≤${normalLower}${unit}`;
      // 预警文本
      const warning = [warningUp, warningDown].filter(v => v).join('，');
      // 告警上限文本
      const alarmUp = isNumber(largeUpper) && `≥${largeUpper}${unit}`;
      // 告警下限文本
      const alarmDown = isNumber(smallLower) && `≤${smallLower}${unit}`;
      // 告警文本
      const alarm = [alarmUp, alarmDown].filter(v => v).join('，');
      // 获取列表中的最大值和最小值
      let { value: max, value: min } = (monitorTrend || []).find(({ value }) => isNumber(value)) || {};
      ({ max, min } = monitorTrend && monitorTrend.reduce(({ max, min }, { value }) => {
        return isNumber(value) ? {
          max: Math.max(max, value),
          min: Math.min(min, value),
        } : {
          max,
          min,
        };
      }, { max, min }) || {});
      // 计算实际上的最大值和最小值（所有值都不是数字的情况不知道需不需要考虑）
      max = Math.max.apply(null, [max, maxValue, largeUpper, normalUpper].filter(v => isNumber(v)));
      min = Math.min.apply(null, [min, minValue, smallLower, normalLower].filter(v => isNumber(v)));
      const text = [warning && `{a|预警范围：}{b|${warning}}`, alarm && `{a|告警范围：}{b|${alarm}}`].filter(v => v);
      option = {
        title: {
          text: text.join('\n'),
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
        color: ['#720EBC'],
        tooltip : {
          trigger: 'axis',
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          formatter(params) {
            const { seriesName, marker, value: [time, value] } = params[params.length - 1];
            return `${moment(time).format('HH:mm:ss')}<br />${marker}${seriesName}：${value}${unit}`;
          },
        },
        grid: {
          top: 12 + 18 * text.length,
          left: 0,
          right: 20,
          bottom: 6,
          containLabel: true,
        },
        xAxis: {
          type: 'time',
          min: +moment(date).startOf('day'),
          max: Math.min(+moment(date).endOf('day'), +moment()),
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
            name: '监测数值',
            type: 'line',
            data: monitorTrend && monitorTrend.map(({ time, value }) => ({
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
                      color: '#F5868E',
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
                      color: '#E8B176',
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
                      color: '#8FB4F2',
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
                      color: '#E8B176',
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
                      color: '#F5868E',
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
    } else {
      const start = +moment(date).startOf('day');
      const end = +moment(date).endOf('day');
      const { data, hasValue, hasPoint } = monitorTrend && monitorTrend.reduce((result, { time, value }, index) => {
        result.data.push({
          name: time,
          value: [
            time,
            value,
          ],
        });
        if (time < start) {
          if (isNumber(value)) {
            const next = monitorTrend[index + 1];
            if (!next || next.time !== start) { // 极限情况
              result.hasValue = true;
            }
          }
        } else if (time >= start && time <= end) {
          if (isNumber(value)) {
            result.hasValue = true;
            result.hasPoint = true;
          }
        }
        return result;
      }, {
        data: [],
        hasValue: false,
        hasPoint: false,
      });
      visible = hasValue;
      console.log(data);
      console.log(hasValue);
      console.log(hasPoint);
      if (data) {
        const last = data[data.length - 1];
        if(last && last.name <= end) { //这里很乱，理不清
          data.push({
            name: +moment(end).add(1, 'days'),
            value: [
              +moment(end).add(1, 'days'),
              last.value[1],
            ],
          });
        }
      }
      option = {
        color: ['#720EBC'],
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          formatter(params) {
            const { seriesName, marker, value: [time, value] } = params[params.length - 1];
            return `${!hasPoint ? date.format('YYYY-MM-DD') : moment(time).format('HH:mm:ss')}<br />${marker}${seriesName}：${+value ? '火警' : '正常'}`;
          },
        },
        grid: {
          top: 12,
          left: 0,
          right: 20,
          bottom: 6,
          containLabel: true,
        },
        xAxis: {
          type: 'time',
          min: +moment(date).startOf('day'),
          max: Math.min(+moment(date).endOf('day'), +moment()),
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
            formatter(value) {
              return +value ? '火警' : '正常';
            },
          },
          splitLine: {
            show: false,
          },
          min: 0,
          max: 1,
          minInterval: 1,
        },
        series: [
          {
            name: '状态',
            type: 'line',
            step: 'end',
            data,
          },
        ],
      };
    }

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
        tabList={tabList}
        activeTabKey={currentIndex}
        onTabChange={this.handleCurrentIndexChange}
      >
        <Spin spinning={loadingMonitorTrend}>
          {paramDesc && visible ? (
            <Fragment>
              <ReactEcharts
                key={paramDesc}
                option={option}
              />
              {isNotFire && (
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
                    <div className={styles.legendLabel}>告警数值区</div>
                  </div>
                  <div className={styles.legend}>
                    <div className={styles.legendIcon2}>
                      <div />
                    </div>
                    <div className={styles.legendLabel}>监测数值</div>
                  </div>
                </div>
              )}
            </Fragment>
          ) : (
            <CustomEmpty className={styles.customEmpty} />
          )}
        </Spin>
      </Card>
    );
  }

  renderVideo() {
    const {
      deviceDetail: {
        videoList=[],
      }={},
    } = this.props;
    const { videoVisible, videoKeyId } = this.state;

    return (
      <NewVideoPlay
        style={{ zIndex: 9999, position: 'fixed' }}
        videoList={videoList}
        visible={videoVisible}
        showList={true}
        keyId={videoKeyId}
        handleVideoClose={this.hideVideo}
      />
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
          {this.renderVideo()}
        </Spin>
      </PageHeaderLayout>
    );
  }
}
