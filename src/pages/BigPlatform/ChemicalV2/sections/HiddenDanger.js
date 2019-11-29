import React, { PureComponent, Fragment } from 'react';
import { Row, Col } from 'antd';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';
import { Section2 as CustomSection } from '@/jingan-components/CustomSection';
// 引入样式文件
import styles from './HiddenDanger.less';

import hdYellow from '../imgs/hd-yellow.png';
import hdRed from '../imgs/hd-red.png';

const percent = 93;
const checkData = [
  { label: '待检查', color: '#0f98d8', value: 20 },
  { label: '待整改', color: '#e38450', value: 4 },
  { label: '待复查', color: '#f6b54e', value: 6 },
  { label: '已关闭', color: '#8491a1', value: 300 },
];

export default class HiddenDanger extends PureComponent {
  state = {};

  getOption = () => {
    const option = {
      title: {
        text: '整改完成率',
        left: 'center',
        bottom: '10%',
        textStyle: {
          color: '#fff',
          fontSize: 14,
        },
      },
      tooltip: {
        show: false,
      },
      series: [
        {
          name: '',
          type: 'pie',
          silent: true,
          center: ['50%', '40%'],
          avoidLabelOverlap: false,
          hoverAnimation: false,
          data: [
            {
              value: 100,
              itemStyle: {
                color: new echarts.graphic.RadialGradient(0.5, 0.5, 0.5, [
                  {
                    offset: 0.5,
                    color: 'transparent',
                  },
                  {
                    offset: 0.84,
                    color: '#033069',
                  },
                  {
                    offset: 1,
                    color: '#0068b9',
                  },
                ]),
              },
              label: { show: false },
            },
          ],
        },
        {
          name: '',
          type: 'pie',
          radius: ['55%', '75%'],
          center: ['50%', '40%'],
          avoidLabelOverlap: false,
          hoverAnimation: false,
          label: {
            normal: {
              show: true,
              position: 'center',
              textStyle: {
                fontSize: '15',
                color: '#fff',
              },
              formatter: '{d}%',
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          data: [
            {
              value: percent,
              itemStyle: {
                color: '#01bffe',
              },
            },
            {
              value: 100 - percent,
              itemStyle: {
                opacity: 0,
              },
              label: { show: false },
            },
          ],
        },
      ],
    };
    return option;
  };

  render() {
    return (
      <CustomSection className={styles.container} title={`隐患统计（${30}）`}>
        <Row gutter={10} style={{ height: '57.04%' }}>
          <Col span={8} style={{ height: '100%' }}>
            <div className={styles.lvlWrapper}>
              <div
                className={styles.lvlIcon}
                style={{ background: `url(${hdRed}) center center / 100% 100% no-repeat` }}
              />
              <div className={styles.label}>重大隐患</div>
              <div className={styles.number}>{10}</div>
            </div>
          </Col>
          <Col span={8} style={{ height: '100%' }}>
            <div className={styles.lvlWrapper}>
              <div
                className={styles.lvlIcon}
                style={{ background: `url(${hdYellow}) center center / 100% 100% no-repeat` }}
              />
              <div className={styles.label}>一般隐患</div>
              <div className={styles.number}>{20}</div>
            </div>
          </Col>
          <Col span={8} style={{ height: '100%' }}>
            <ReactEcharts
              option={this.getOption()}
              style={{ height: '100%', width: '100%' }}
              notMerge={true}
              ref={e => {
                this.echarts = e;
              }}
            />
          </Col>
        </Row>
        <Row gutter={6} style={{ height: '42.96%', borderTop: '1px solid #04397a' }}>
          {checkData.map((item, index) => {
            const { label, color, value } = item;
            return (
              <Col key={index} span={6} className={styles.checkCol}>
                <div className={styles.checkItem}>
                  <div className={styles.label} style={{ backgroundColor: color }}>
                    {label}
                  </div>
                  <div className={styles.triangle} style={{ borderTop: `6px solid ${color}` }} />
                  <div className={styles.dot} style={{ backgroundColor: color }} />
                  <div className={styles.number}>{value}</div>
                </div>
              </Col>
            );
          })}
        </Row>
      </CustomSection>
    );
  }
}
