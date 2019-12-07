import React, { PureComponent, Fragment } from 'react';
import { Row, Col } from 'antd';
import ReactEcharts from 'echarts-for-react';
import { Section2 as CustomSection } from '@/jingan-components/CustomSection';
import { TabTitle } from '../components/Components';
// 引入样式文件
import styles from './Emergency.less';

const LABELS = ['预案', '装备', '物资', '演练'];
const TITLE_STYLE = { marginLeft: 10 };
const data1 = [
  { value: 10, name: '综合预案' },
  { value: 5, name: '专项预案' },
  { value: 15, name: '现场预案' },
  { value: 25, name: '其他预案' },
];
const data2In = [
  { value: 335, name: '救援车辆' },
  { value: 679, name: '通信设备' },
  { value: 1548, name: '侦检装备' },
];
const data2Out = [
  { value: 335, name: '装备车' },
  { value: 310, name: '应急平台终端' },
  { value: 234, name: '移动电话' },
  { value: 135, name: '对讲机' },
  { value: 1048, name: '探险机器人' },
  { value: 251, name: '热成像仪' },
  { value: 147, name: '蛇眼探测仪' },
  { value: 102, name: '呼吸校验仪' },
];

const data3In = [
  { value: 335, name: '防护用品' },
  { value: 729, name: '生命救助' },
  { value: 1588, name: '救援运载' },
];
const data3Out = [
  { value: 335, name: '卫生防疫' },
  { value: 360, name: '外伤' },
  { value: 234, name: '海滩' },
  { value: 135, name: '高空坠落' },
  { value: 1048, name: '防疫' },
  { value: 251, name: '空投' },
  { value: 187, name: '通用' },
  { value: 102, name: '医疗救生船' },
];

const data4 = [
  { value: 6, name: '应急演练计划' },
  { value: 4, name: '应急演练过程' },
  { value: 4, name: '应急演练评估' },
];

export default class Emergency extends PureComponent {
  state = { active: 0 };

  option1 = () => {
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)',
      },
      color: ['#f6676e', '#fcb05f', '#00baff', '#847be6'],
      legend: {
        top: 'middle',
        right: 10,
        orient: 'vertical',
        icon: 'circle',
        textStyle: {
          color: '#fff',
        },
        data: data1.map(item => item.name),
      },
      calculable: true,
      series: [
        {
          type: 'pie',
          radius: [0, 70],
          center: ['40%', '50%'],
          label: {
            normal: {
              show: false,
              formatter: '{b} :\n{c}（{d}%）',
              textStyle: {
                color: 'rgba(255,255,255,0.5)',
              },
            },
            emphasis: {
              show: true,
            },
          },
          lableLine: {
            normal: {
              show: false,
            },
            emphasis: {
              show: true,
            },
          },
          data: data1,
        },
      ],
    };
    return option;
  };

  option2 = () => {
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)',
      },
      legend: {
        top: 'middle',
        right: 10,
        orient: 'vertical',
        icon: 'circle',
        textStyle: {
          color: '#fff',
        },
        data: [
          '救援车辆',
          '装备车',
          '通信设备',
          '应急平台终端',
          '移动电话',
          '对讲机',
          '侦检装备',
          '探险机器人',
          '热成像仪',
          '蛇眼探测仪',
          '呼吸校验仪',
        ],
      },
      color: [
        '#f6b54e',
        '#bcbcbd',
        '#e589e6',
        '#318bbc',
        '#00baff',
        '#df8b6f',
        '#02becd',
        '#e86767',
        '#847be6',
        '#ce5291',
        '#0f89f5',
      ],
      calculable: true,
      series: [
        {
          type: 'pie',
          radius: [45, 70],
          center: ['25%', '50%'],
          label: {
            normal: {
              show: false,
              formatter: '{b} :\n{c}（{d}%）',
              textStyle: {
                color: 'rgba(255,255,255,0.5)',
              },
            },
            emphasis: {
              show: true,
            },
          },
          lableLine: {
            normal: {
              show: false,
            },
            emphasis: {
              show: true,
            },
          },
          data: data2Out,
        },
        {
          type: 'pie',
          radius: [15, 35],
          center: ['25%', '50%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              formatter: '{b} :\n{c}（{d}%）',
              textStyle: {
                color: 'rgba(255,255,255,0.5)',
              },
              position: 'center',
            },
            emphasis: {
              show: false,
            },
          },
          lableLine: {
            normal: {
              show: false,
            },
          },
          data: data2In,
        },
      ],
    };
    return option;
  };

  option3 = () => {
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)',
      },
      legend: {
        top: 'middle',
        right: 10,
        orient: 'vertical',
        icon: 'circle',
        textStyle: {
          color: '#fff',
          fontSize: 12,
        },
        data: [
          '防护用品',
          '卫生防疫',
          '生命救助',
          '外伤',
          '海滩',
          '高空坠落',
          '救援运载',
          '防疫',
          '空投',
          '通用',
          '医疗救生船',
        ],
      },
      color: [
        '#f6b54e',
        '#bcbcbd',
        '#e589e6',
        '#318bbc',
        '#00baff',
        '#df8b6f',
        '#02becd',
        '#e86767',
        '#847be6',
        '#ce5291',
        '#0f89f5',
      ],
      calculable: true,
      series: [
        {
          type: 'pie',
          radius: [45, 70],
          center: ['25%', '50%'],
          label: {
            normal: {
              show: false,
              formatter: '{b} :\n{c}（{d}%）',
              textStyle: {
                color: 'rgba(255,255,255,0.5)',
              },
            },
            emphasis: {
              show: true,
            },
          },
          lableLine: {
            normal: {
              show: false,
            },
            emphasis: {
              show: true,
            },
          },
          data: data3Out,
        },
        {
          type: 'pie',
          radius: [15, 35],
          center: ['25%', '50%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              formatter: '{b} :\n{c}（{d}%）',
              textStyle: {
                color: 'rgba(255,255,255,0.5)',
              },
              position: 'center',
            },
            emphasis: {
              show: false,
            },
          },
          lableLine: {
            normal: {
              show: false,
            },
          },
          data: data3In,
        },
      ],
    };
    return option;
  };

  handleClickTab = i => {
    this.setState({ active: i });
    if (i === 3) return;
    const echartsInstance = this.echarts.getEchartsInstance();
    const options = [this.option1(), this.option2(), this.option3()];
    echartsInstance.setOption(options[i], true);
  };

  onChartReadyCallback = chart => {
    if (!chart) return;
    let currentIndex = -1;
    const chartAnimate = () => {
      const dataLen = chart.getOption().series[0].data.length;
      // 取消之前高亮的图形
      chart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: currentIndex,
      });
      currentIndex = (currentIndex + 1) % dataLen;
      // 高亮当前图形
      chart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: currentIndex,
      });
    };
    // chartAnimate();
    setInterval(() => {
      chartAnimate();
    }, 5000);
  };

  render() {
    const { active } = this.state;

    return (
      <CustomSection className={styles.container} title="应急资源统计">
        <TabTitle
          index={active}
          labels={LABELS}
          handleClickTab={this.handleClickTab}
          style={TITLE_STYLE}
        />
        <ReactEcharts
          option={this.option1()}
          style={{
            height: 'calc(100% - 30px)',
            width: '100%',
            display: active !== 3 ? 'block' : 'none',
          }}
          onChartReady={this.onChartReadyCallback}
          notMerge={true}
          ref={e => {
            this.echarts = e;
          }}
        />
        <Row
          gutter={10}
          style={{ height: 'calc(100% - 30px)', display: active === 3 ? 'block' : 'none' }}
        >
          {data4.map((item, index) => (
            <Col span={8} key={index} className={styles.drillItem}>
              <div className={styles.number}>{item.value}</div>
              {item.name}
            </Col>
          ))}
        </Row>
      </CustomSection>
    );
  }
}
