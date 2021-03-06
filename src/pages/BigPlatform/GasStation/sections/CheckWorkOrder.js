import React, { Fragment, PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';

// import TabSection from './TabSection';
import { Section } from './Components';
import styles from './CheckWorkOrder.less';

const isTinyHeight = window.screen.availHeight < 650;

export default class CheckWorkOrder extends PureComponent {
  state = {
    type: 0, // 0 安全巡查 1 处理工单
  }

  componentDidMount() {
    if (this.circle)
      this.circle.style.width = `${this.circle.offsetHeight}px`;
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
        { value: finishNum, name: '已处理', itemStyle: { color: '#2A8BD5' } },
      ],
    ];
    const legendData = chartDatas[type].reduce((prev, next) => {
      const { name, value } = next;
      prev[name] = value;
      return prev;
    }, {});

    const option = {
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
          center: ['50%', '45%'],
          // radius: ['30%', '48%'],
          radius: ['50%', '68%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              position: 'center',
              show: false,
              formatter: '{b}\n{number|{c}}',
              rich: {
                number: {
                  fontSize: isTinyHeight ? 14 : 18,
                  color: '#fff',
                  align: 'center',
                },
              },
            },
            emphasis: {
              position: 'center',
              show: true,
              textStyle: {
                fontSize: isTinyHeight ? 12 : 13,
                fontWeight: 'bold',
                textShadowColor: '#01112e',
                textShadowBlur: 3,
              },
            },
          },
          labelLine: {
            normal: {
              show: false,
              length: 20,
              length2: 5,
            },
            emphasis: {
              show: true,
            },
          },
          data: chartDatas[type],
        },
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
        { value: finishNum, name: '已处理', color: '#2A8BD5' },
      ],
    ];

    return (
      <div className={styles.legendContainer}>
        {chartDatas[type].map((item, index) => {
          const { value, name, color } = item;
          return (
            <div
              className={styles.legend}
              onClick={() => {
                type === 0 ? checkClick(index) : workOrderClick(index);
              }}
              key={index}
            >
              <span className={styles.circle} style={{ backgroundColor: color }} />
              {name}
              <span className={styles.number}>{value}</span>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    const { coItemList } = this.props;
    let child = (
      <div className={styles.circleContainer}>
        <div className={styles.emptyCircle} ref={node => this.circle = node}>
          0
        </div>
      </div>
    );
    if ([1, 2, 3, 4].some(n => coItemList[`status${n}`] !== 0))
      child = (
        <Fragment>
          <ReactEcharts
            option={this.getPieOption()}
            style={{ height: '100%', width: '100%' }}
            className="echarts-for-echarts"
            notMerge={true}
            onChartReady={this.onChartReadyCallback}
          />
          {this.renderLegend()}
        </Fragment>
      );
    return (
      <Section title="安全巡查">
        <div className={styles.container}>
          {child}
        </div>
      </Section>
    );
  }
}
