import React, { PureComponent, Fragment } from 'react';
import { Tooltip, Carousel, Icon } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import ReactEcharts from "echarts-for-react";
import { connect } from 'dva';
import moment from 'moment';
import { Section2 as Section } from '@/jingan-components/CustomSection';
import alarmDistributionBoxTop from './assets/alarm-distribution-box-top.png';
import alarmDistributionBoxBottom from './assets/alarm-distribution-box-bottom.png';
import lossDistributionBoxTop from './assets/loss-distribution-box-top.png';
import lossDistributionBoxBottom from './assets/loss-distribution-box-bottom.png';
import normalDistributionBoxTop from './assets/normal-distribution-box-top.png';
import normalDistributionBoxBottom from './assets/normal-distribution-box-bottom.png';
import distributionBoxIcon from './assets/distribution-box-icon.png';
import alarmIcon from './assets/alarm-icon.png';
import lossBackground from './assets/loss-background.png';
import styles from './index.less';

function formatTime(time) {
  const diff = moment().diff(moment(time));
  if (diff >= 2 * 24 * 60 * 60 * 1000) {
    return moment(time).format('YYYY-MM-DD HH:mm:ss');
  } else if (diff >= 24 * 60 * 60 * 1000) {
    return moment(time).format('昨日 HH:mm:ss');
  } else if (diff >= 60 * 60 * 1000) {
    return moment(time).format('今日 HH:mm:ss');
  } else if (diff >= 60 * 1000) {
    return `${moment.duration(diff).minutes()}分钟前`;
  } else {
    return '刚刚';
  }
}

/* 电气火灾监测 */
@connect(({ gasStation }) => ({
  gasStation,
}))
export default class ElectricalFireMonitoring extends PureComponent {
  state = {
    currentIndex: 0,
  }

  componentDidMount() {
    this.getDistributionBoxClassification();
  }

  getDistributionBoxClassification () {
    const { dispatch, companyId } = this.props;
    dispatch({
      type: 'gasStation/fetchDistributionBoxClassification',
      payload: {
        companyId,
        type: 1,
      },
    });
  }

  setCarouselReference = (carousel) => {
    this.carousel = carousel;
  }

  getOption = ({ name, value, unit, min, max, normalMin, normalMax, status }) => {
    const color = status > 0 ? '#f83329' : '#fff';
    return {
      series: [
        {
          name,
          type: 'gauge',
          radius: '90%',
          min,
          max,
          axisLine: {
            lineStyle: {
              color: status < 0 ? [[1, '#ccc']] : [
                !isNaN(normalMin) && [(normalMin - min) / (max - min), '#ff1e00'],
                !isNaN(normalMax) ? [(normalMax - min) / (max - min), '#1e90ff'] : [1, '#1e90ff'],
                !isNaN(normalMax) && [1, '#ff1e00'],
              ].filter(v => v),
              width: 15,
            },
          },
          splitLine: {
            length: 15,
          },
          axisLabel: {
            color: '#c2c2c2',
          },
          title : {
            color: '#c2c2c2',
          },
          pointer: {
            width: 4,
          },
          detail: {
            formatter: `{a|${status < 0 || isNaN(value) ? '--' : value}}\n{b|${name}}`,
            offsetCenter: [0, '65%'],
            rich: {
              a: {
                lineHeight: 48,
                fontSize: 24,
                color,
              },
              b: {
                lineHeight: 14,
                fontSize: 14,
                color,
              },
            },
          },
          data: [
            { value, name: unit },
          ],
        },
      ],
    };
  }

  handleMultipleClick = (e) => {
    const { onMultipleClick } = this.props;
    const label = e.currentTarget.getAttribute('data-label');
    onMultipleClick && onMultipleClick(label);
  }

  handleSingleClick = (data, paramName) => {
    const { onSingleClick } = this.props;
    onSingleClick && onSingleClick(data, paramName);
  }

  handleCarouselChange = (_, currentIndex) => {
    this.setState({
      currentIndex,
    });
  }

  handlePrev = (e) => {
    e.stopPropagation();
    this.carousel.prev();
  }

  handleNext = (e) => {
    e.stopPropagation();
    this.carousel.next();
  }

  handleStop = (e) => {
    e.stopPropagation()
  }

  render() {
    const {
      gasStation: {
        distributionBoxClassification: {
          alarm=[],
          loss=[],
          normal=[],
        }={}, // 配电箱分类
      }={},
    } = this.props;
    const { currentIndex } = this.state;
    const alarmCount = alarm.length;
    const lossCount = loss.length;
    const normalCount = normal.length;
    const length = alarmCount + lossCount + normalCount;
    let content;
    if (length === 1) { // 单个
      const data = alarm[0] || loss[0] || normal[0];
      let subContent;
      if (alarmCount === 1 || normalCount === 1) { // 报警或正常
        let { params } = data;
        params = (params || []).reduce((result, param) => {
          if (param.status > 0) {
            result.alarm.push(param);
          } else if (param.status < 0) {
            result.loss.push(param);
          } else {
            result.normal.push(param);
          }
          return result;
        }, { alarm: [], loss: [], normal: [] });
        params = params.alarm.concat(params.loss, params.normal); // 为了确保报警优先排序
        const isFirst = currentIndex === 0;
        const isLast = currentIndex === params.length - 1;
        subContent = params.length > 0 ? (
          <div className={styles.subContent}>
            <Carousel
              // afterChange={this.handleCarouselChange}
              beforeChange={this.handleCarouselChange}
              dots={false}
              ref={this.setCarouselReference}
            >
              {params.map((param, index) => (
                <div className={styles.carouselItem} key={param.name} onClick={() => this.handleSingleClick(data, param.name)}>
                  <ReactEcharts
                    className={styles.echarts}
                    option={this.getOption(param)}
                  />
                  {param.status > 0 && (
                    <div className={styles.alarmWrapper}>
                      <img className={styles.alarmIcon} src={alarmIcon} alt="报警" />
                      <span className={styles.alarmLabel}>报警</span>
                    </div>
                  )}
                  {params[index-1] && params[index-1].status > 0 && (
                    <div className={styles.prevAlarmName}>{params[index-1].name}</div>
                  )}
                  {params[index+1] && params[index+1].status > 0 && (
                    <div className={styles.nextAlarmName}>{params[index+1].name}</div>
                  )}
                </div>
              ))}
            </Carousel>
            <Tooltip
              title={isFirst ? '没有上一页' : params[currentIndex-1].name}
            >
              <Icon
                className={styles.prevButton}
                style={isFirst ? { color: 'rgba(0, 114, 224, 0.5)', cursor: 'auto' } : undefined}
                type="left"
                onClick={isFirst ? this.handleStop : this.handlePrev}
              />
            </Tooltip>
            <Tooltip
              title={isLast ? '没有下一页' : params[currentIndex+1].name}
            >
              <Icon
                className={styles.nextButton}
                style={isLast ? { color: 'rgba(0, 114, 224, 0.5)', cursor: 'auto' } : undefined}
                type="right"
                onClick={isLast ? this.handleStop : this.handleNext}
              />
            </Tooltip>
          </div>
        ) : (
          <div className={styles.emptyData}>
            <img src={lossBackground} alt="失联" />
            <span>暂无参数</span>
          </div>
        );
      } else { // 失联
        subContent = (
          <div className={styles.lossWrapper}>
            <img className={styles.lossIcon} src={lossBackground} alt="失联" />
            <span className={styles.lossLabel}>{formatTime(+data.updateTime)} 设备失联！</span>
          </div>
        );
      }
      content = (
        <div className={styles.singleContainer}>
          <div className={styles.titleWrapper}>
            <img className={styles.titleIcon} src={distributionBoxIcon} alt="配电箱图标" />
            <span className={styles.title}><Ellipsis lines={1} tooltip>{data.location}</Ellipsis></span>
          </div>
          <div className={styles.content}>
            {subContent}
          </div>
        </div>
      );
    } else if (length > 1) { // 多个
      const list = [
        {
          label: '报警',
          count: alarmCount,
          top: alarmDistributionBoxTop,
          bottom: alarmDistributionBoxBottom,
          color: 'rgb(248, 51, 41)',
        },
        {
          label: '失联',
          count: lossCount,
          top: lossDistributionBoxTop,
          bottom: lossDistributionBoxBottom,
          color: 'rgb(159, 159, 159)',
        },
        {
          label: '正常',
          count: normalCount,
          top: normalDistributionBoxTop,
          bottom: normalDistributionBoxBottom,
          color: 'rgb(0, 255, 255)',
        },
      ];
      content = (
        <div className={styles.list}>
          {list.map(({ top, bottom, color, count, label }) => (
            <div className={styles.itemWrapper} key={label}>
              <Tooltip
                title={
                  <Fragment>
                    <div>配电箱的数量</div>
                    <div>{`${label} ${count}个 (${Math.round(count / length * 100)}%)`}</div>
                  </Fragment>
                }
              >
                <div className={styles.item} data-label={label} onClick={this.handleMultipleClick}>
                  <div className={styles.itemTop}>
                    <img src={top} alt="" />
                  </div>
                  <div className={styles.itemBottom}>
                    <div className={styles.itemPercent} style={{ top: `${(1 - count / length) * 100}%`, backgroundImage: `linear-gradient(to top, ${color} 1%, rgb(3,46,100) 100%)` }} />
                    <img src={bottom} alt="" />
                    <div className={styles.itemCount}>{count}</div>
                  </div>
                  <div className={styles.itemLabel}>{label}</div>
                </div>
              </Tooltip>
            </div>
          ))}
        </div>
      );
    }

    return (
      <Section
        title="电气火灾监测"
        className={styles.container}
      >
        <div className={styles.wrapper}>
          {content}
        </div>
      </Section>
    );
  }
}
