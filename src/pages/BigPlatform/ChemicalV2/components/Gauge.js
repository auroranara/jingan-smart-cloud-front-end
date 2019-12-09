import React, { PureComponent, Fragment } from 'react';
import { Col, Icon } from 'antd';
import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import styles from './Gauge.less';

export default class Gauge extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getOption = ({ value, title, unit }) => {
    const color = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
      {
        offset: 0,
        color: '#183E79', // 0% 处的颜色
      },
      {
        offset: 0.2,
        color: '#1F90FE', // 100% 处的颜色
      },
      {
        offset: 0.6,
        color: '#2C82E7', // 100% 处的颜色
      },
      {
        offset: 1,
        color: '#F01C07', // 100% 处的颜色
      },
    ]);
    const colorSet = [[1, color]];
    const option = {
      title: {
        text: title,
        textStyle: {
          color: '#fff',
          fontSize: 14,
        },
        bottom: 25,
        left: 'center',
      },
      tooltip: {
        show: false,
        formatter: '{a} <br/>{b} : {c}%',
      },
      series: [
        {
          name: '浓度',
          type: 'gauge',
          axisLine: {
            show: true,
            lineStyle: {
              color: colorSet,
              width: 15,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              opacity: 1,
            },
          },
          splitLine: {
            show: true,
            length: 15,
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#c2c2c2',
            },
          },
          title: {
            show: true,
            textStyle: {
              color: '#c2c2c2',
            },
          },
          itemStyle: {
            color: value > 60 ? '#F83329' : '#1E90FF',
          },
          detail: {
            formatter: '{value}',
            textStyle: {
              color: value > 60 ? '#F83329' : '#fff',
              fontSize: 20,
            },
          },
          data: [{ value: value, name: unit }],
        },
      ],
    };
    return option;
  };

  render() {
    const { data, extra, style = {} } = this.props;
    console.log('extra', extra);
    return (
      <div className={styles.container} style={{ ...style }}>
        <ReactEcharts
          // option={this.getOption({ value: 68, title: '可燃气体浓度', unit: 'mg/m³' })}
          option={this.getOption(data)}
          style={{ height: '100%', width: '100%' }}
          notMerge={true}
        />
        {extra && (
          <div className={styles.tips}>
            <div className={styles.overVal}>
              <Icon type="caret-up" className={styles.icon} />
              {/* 26 */}
              {extra}
            </div>
            超过预警阈值
          </div>
        )}
      </div>
    );
  }
}
