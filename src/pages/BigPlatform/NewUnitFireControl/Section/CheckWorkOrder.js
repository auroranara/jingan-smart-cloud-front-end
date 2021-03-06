import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';
import Section from '../Section';
import TabSection from './TabSection';
import { filterChartValue } from '../utils.js';
import styles from './CheckWorkOrder.less';

/**
 * description: 安全巡查/处理工单
 */
const emptyIcon = 'http://data.jingan-china.cn/v2/big-platform/monitor/com/waterBg1.png';
const isTinyHeight = window.screen.availHeight < 650;

export default class CheckWorkOrder extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      type: 1, // 0 安全巡查 1 处理工单
    };
  }

  getPieOption() {
    const {
      coItemList: { status1 = 0, status2 = 0, status3 = 0, status4 = 0 },
      countAllFireAndFault: { finishNum = 0, processNum = 0, waitNum = 0 },
    } = this.props;
    const { type } = this.state;
    const chartDatas = [
      [
        { value: status4, name: '已超期', itemStyle: { color: '#F83329' } },
        { value: status3, name: '待检查', itemStyle: { color: '#FFB650' } },
        { value: status1 + status2, name: '已检查', itemStyle: { color: '#2A8BD5' } },
      ],
      [
        { value: waitNum, name: '待处理', itemStyle: { color: '#F83329' } },
        { value: processNum, name: '处理中', itemStyle: { color: '#FFB650' } },
        // { value: finishNum, name: '已处理', itemStyle: { color: '#2A8BD5' } },
      ],
    ];
    const legendData = chartDatas[type].reduce((prev, next) => {
      const { name, value } = next;
      prev[name] = value;
      return prev;
    }, {});

    const total = chartDatas[type].reduce((prev, next) => {
      return prev + next.value;
    }, 0);

    const option = {
      title: {
        text: total,
        textStyle: {
          color: '#fff',
          fontSize: 22,
          fontWeight: 400,
        },
        left: 'center',
        top: '40%',
      },
      legend: {
        show: false,
        data: chartDatas[type].map(item => item.name),
        icon: 'circle',
        formatter: name => {
          return `${name} ${legendData[name]}`;
        },
        bottom: 0,
        left: 'center',
        textStyle: { color: '#fff' },
        itemGap: 20,
      },
      color: ['#F83329', '#FFB650', '#2A8BD5'],
      series: [
        {
          type: 'pie',
          center: ['50%', '48%'],
          radius: ['40%', '48%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              // formatter: '{b}\n{number|{c} {d}%}',
              formatter: '{b}\n{c} ({d}%)',
              lineHeight: 24,
              textStyle: {
                color: '#fff',
                fontSize: isTinyHeight ? 12 : 14,
              },
              // rich: {
              //   number: {
              //     fontSize: isTinyHeight ? 14 : 18,
              //     color: '#fff',
              //     align: 'center',
              //   },
              // },
            },
            emphasis: {
              show: true,
            },
          },
          labelLine: {
            normal: {
              show: false,
              length: 12,
              length2: 12,
            },
            emphasis: {
              show: true,
            },
          },
          hoverAnimation: !!total,
          legendHoverLink: !!total,
          data: filterChartValue(chartDatas[type]),
        },
        // {
        //   type: 'pie',
        //   center: ['50%', '45%'],
        //   radius: ['40%', '48%'],
        //   avoidLabelOverlap: false,
        //   label: {
        //     normal: {
        //       show: false,
        //       position: 'center',
        //       formatter: '{c}',
        //       textStyle: {
        //         color: '#fff',
        //         fontSize: isTinyHeight ? 16 : 20,
        //       },
        //     },
        //     emphasis: {
        //       show: true,
        //     },
        //   },
        //   labelLine: {
        //     normal: {
        //       show: false,
        //       length: 20,
        //       length2: 5,
        //     },
        //     emphasis: {
        //       show: true,
        //     },
        //   },
        //   data: filterChartValue(chartDatas[type]),
        // },
      ],
    };
    return option;
  }

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

    chart.on('click', params => {
      const {
        countAllFireAndFault: { processNum = 0, waitNum = 0 },
      } = this.props;
      if (processNum + waitNum === 0) return null;
      const { checkClick, workOrderClick } = this.props;
      const { dataIndex } = params;
      const { type } = this.state;
      type === 0 ? checkClick(dataIndex) : workOrderClick(dataIndex);
    });
  };

  renderLegend = () => {
    const {
      coItemList: { status1 = 0, status2 = 0, status3 = 0, status4 = 0 },
      countAllFireAndFault: { finishNum = 0, processNum = 0, waitNum = 0 },
      checkClick,
      workOrderClick,
    } = this.props;
    const { type } = this.state;
    const chartDatas = [
      [
        { value: status4, name: '已超期', color: '#F83329' },
        { value: status3, name: '待检查', color: '#FFB650' },
        { value: status1 + status2, name: '已检查', color: '#2A8BD5' },
      ],
      [
        { value: waitNum, name: '待处理', color: '#F83329' },
        { value: processNum, name: '处理中', color: '#FFB650' },
        // { value: finishNum, name: '已处理', color: '#2A8BD5' },
      ],
    ];

    return (
      <div className={styles.legendContainer}>
        {chartDatas[type].map((item, index) => {
          const { value, name, color } = item;
          return !!value ? (
            <div
              className={styles.legend}
              onClick={() => {
                type === 0 ? checkClick(index) : workOrderClick(index);
              }}
              key={index}
            >
              <span className={styles.circle} style={{ backgroundColor: color }} />
              {name}
              {/* <span className={styles.number}>{value}</span> */}
            </div>
          ) : null;
        })}
      </div>
    );
  };

  render() {
    const {
      countAllFireAndFault: { finishNum = 0 },
      workOrderClick,
    } = this.props;

    const tabs = [
      // {
      //   title: '安全巡查',
      //   onClick: () => {
      //     this.setState({ type: 0 });
      //   },
      // },
      {
        title: '处理工单',
        onClick: () => {
          this.setState({ type: 1 });
        },
      },
    ];

    return (
      // <TabSection tabs={tabs}>
      <Section title="处理工单">
        <div className={styles.container}>
          <ReactEcharts
            option={this.getPieOption()}
            style={{ height: '100%', width: '100%' }}
            className="echarts-for-echarts"
            notMerge={true}
            onChartReady={this.onChartReadyCallback}
          />
          {this.renderLegend()}
          {!!finishNum && (
            <div className={styles.extra} onClick={() => workOrderClick(2)}>
              已处理
              <span className={styles.number}>{finishNum}</span>
            </div>
          )}
        </div>
      </Section>
      // </TabSection>
    );
  }
}
