import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import ReactEcharts from 'echarts-for-react';

import WaterCards from '../components/waterCards';
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
          radius: '85%',
          axisLine: {
            // 仪表盘轴线(轮廓线)
            lineStyle: {
              // 属性lineStyle控制线条样式
              color: [[0.09, '#ff4400'], [0.82, '#1e90fe'], [1, '#ff4400']],
              width: 1,
            },
          },
          axisLabel: {
            // 坐标轴小标记数字
            show: false,
          },
          axisTick: {
            // 刻度(线)样式
            length: 3,
            lineStyle: {
              color: 'auto',
            },
          },
          splitLine: {
            // 分隔线
            length: 8,
            lineStyle: {
              width: 1,
              color: '#fff',
            },
          },
          pointer: {
            // 指针
            width: 5,
            length: '70%',
          },
          title: {
            // 仪表盘标题
            offsetCenter: [0, '95%'],
            textStyle: {
              fontSize: 12,
              color: '#fff',
            },
          },
          detail: {
            // 仪表盘详情，用于显示数据
            offsetCenter: [0, '50%'], // x, y，单位px
            textStyle: {
              // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              fontWeight: 'bolder',
              color: '#fff',
              fontSize: 12,
            },
          },
          data: [{ value: 40, name: '点位名称' }],
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
              <div className={styles.gaugeContainer}>
                {[1, 2, 3, 4, 5].map(() => (
                  <div className={styles.gauge}>
                    <ReactEcharts
                      option={this.getOption()}
                      style={{ width: '90px', height: '90px' }}
                      className="echarts-for-echarts"
                    />
                  </div>
                ))}
              </div>
            </TabPane>
            <TabPane tab="自动喷淋系统" key="2">
              <div className={styles.gaugeContainer}>
                {[1, 2, 3, 4, 5, 6].map(() => (
                  <div className={styles.gauge}>
                    <ReactEcharts
                      option={this.getOption()}
                      style={{ width: '90px', height: '90px' }}
                      className="echarts-for-echarts"
                    />
                  </div>
                ))}
              </div>
            </TabPane>
            <TabPane tab="水池/水箱" key="3">
              <div className={styles.waterContainer}>
                <WaterCards />
                <WaterCards />
                <WaterCards />
              </div>
            </TabPane>
          </Tabs>
        </div>
      </Section>
    );
  }
}
