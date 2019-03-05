import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import ReactEcharts from 'echarts-for-react';

import Section from '../Section';
import styles from './FireDevice.less';

function callback(key) {
  console.log(key);
}

const TabPane = Tabs.TabPane;

export default class FireDevice extends PureComponent {
  getOption = () => {
    const option = {
      tooltip: {
        formatter: '{a} <br/>{c} {b}',
      },
      series: [
        {
          name: '速度',
          type: 'gauge',
          min: '',
          max: '',
          splitNumber: 5,
          radius: '100%',
          axisLine: {
            // 坐标轴线
            lineStyle: {
              // 属性lineStyle控制线条样式
              color: [[0.09, '#ff4400'], [0.82, '#1e90fe'], [1, '#ff4400']],
              width: 1,
            },
          },
          axisLabel: {
            // 坐标轴小标记
            textStyle: {
              // 属性lineStyle控制线条样式
              color: '#fff',
            },
          },
          axisTick: {
            // 坐标轴小标记
            length: 8, // 属性length控制线长
            lineStyle: {
              // 属性lineStyle控制线条样式
              color: 'auto',
            },
          },
          splitLine: {
            // 分隔线
            length: 2, // 属性length控制线长
            lineStyle: {
              // 属性lineStyle（详见lineStyle）控制线条样式
              width: 1,
              color: '#fff',
            },
          },
          pointer: {
            // 分隔线
            shadowColor: '#fff', //默认透明
            shadowBlur: 2,
          },
          detail: {
            borderColor: '#fff',
            shadowColor: '#fff', //默认透明
            shadowBlur: 2,
            offsetCenter: [0, '50%'], // x, y，单位px
            textStyle: {
              // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              fontWeight: 'bolder',
              color: '#fff',
              fontSize: 16,
            },
          },
          data: [{ value: 40 }],
        },
      ],
    };
    return option;
  };
  render() {
    // const {
    //   // onClick,
    // } = this.props;

    return (
      <Section title="水系统">
        <div className={styles.container}>
          <Tabs defaultActiveKey="1" onChange={callback}>
            <TabPane tab="消火栓系统" key="1">
              <div className={styles.gauge}>
                <ReactEcharts
                  option={this.getOption()}
                  style={{ width: '100px', height: '100px' }}
                  className="echarts-for-echarts"
                />
                <ReactEcharts
                  option={this.getOption()}
                  style={{ width: '100px', height: '100px' }}
                  className="echarts-for-echarts"
                />
              </div>
            </TabPane>
            <TabPane tab="自动喷淋系统" key="2">
              2
            </TabPane>
            <TabPane tab="水池/水箱" key="3">
              3
            </TabPane>
          </Tabs>
        </div>
      </Section>
    );
  }
}
