import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';
import styles from '../Government.less';

const riskTitles = ['红色风险点', '橙色风险点', '黄色风险点', '蓝色风险点', '未评级风险点'];
const lightGray = {
  type: 'linear',
  x: 0,
  y: 0,
  x2: 0,
  y2: 1,
  colorStops: [
    {
      offset: 0,
      color: 'rgba(255, 255, 255, 1)', // 0% 处的颜色
    },
    {
      offset: 1,
      color: 'rgba(97, 97, 97, 1)', // 100% 处的颜色
    },
  ],
  globalCoord: false, // 缺省为 false
};
const gradientsRed = {
  type: 'linear',
  x: 0,
  y: 0,
  x2: 0,
  y2: 1,
  colorStops: [
    {
      offset: 0,
      color: '#e81c02', // 0% 处的颜色
    },
    {
      offset: 1,
      color: '#7e1001', // 100% 处的颜色
    },
  ],
  globalCoord: false, // 缺省为 false
};
const gradientsOrange = {
  type: 'linear',
  x: 0,
  y: 0,
  x2: 0,
  y2: 1,
  colorStops: [
    {
      offset: 0,
      color: '#ea760a', // 0% 处的颜色
    },
    {
      offset: 1,
      color: '#793d05', // 100% 处的颜色
    },
  ],
  globalCoord: false, // 缺省为 false
};
const gradientsYel = {
  type: 'linear',
  x: 0,
  y: 0,
  x2: 0,
  y2: 1,
  colorStops: [
    {
      offset: 0,
      color: '#e9e517', // 0% 处的颜色
    },
    {
      offset: 1,
      color: '#7e7c0d', // 100% 处的颜色
    },
  ],
  globalCoord: false, // 缺省为 false
};
const gradientsBlue = {
  type: 'linear',
  x: 0,
  y: 0,
  x2: 0,
  y2: 1,
  colorStops: [
    {
      offset: 0,
      color: '#1a52d9', // 0% 处的颜色
    },
    {
      offset: 1,
      color: '#0f307f', // 100% 处的颜色
    },
  ],
  globalCoord: false, // 缺省为 false
};
const gradientsGray = {
  type: 'linear',
  x: 0,
  y: 0,
  x2: 0,
  y2: 1,
  colorStops: [
    {
      offset: 0,
      color: '#4f6793', // 0% 处的颜色
    },
    {
      offset: 1,
      color: '#28344a', // 100% 处的颜色
    },
  ],
  globalCoord: false, // 缺省为 false
};
class RiskBar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillUnmount() {}

  // 风险点统计
  getHdBarOption() {
    const {
      countDangerLocation: {
        red = 0,
        red_abnormal = 0,
        red_company = 0,
        orange = 0,
        orange_abnormal = 0,
        orange_company = 0,
        yellow = 0,
        yellow_abnormal = 0,
        yellow_company = 0,
        blue = 0,
        blue_abnormal = 0,
        blue_company = 0,
        not_rated = 0,
        not_rated_abnormal = 0,
        not_rated_company = 0,
      },
    } = this.props;
    const colorList = [gradientsRed, gradientsOrange, gradientsYel, gradientsBlue, gradientsGray];
    const comMap = [red_company, orange_company, yellow_company, blue_company, not_rated_company];
    const option = {
      legend: {
        show: false,
      },
      textStyle: {
        color: '#fff',
      },
      grid: {
        top: '20px',
        left: '35px',
        right: '10px',
        bottom: '25px',
        // containLabel: false,
      },
      tooltip: {
        show: 'true',
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
          shadowStyle: {
            color: 'rgba(46,78,111,0.5)',
            opacity: 0.6,
          },
        },
        backgroundColor: 'rgba(46,78,111,0.5)',
        padding: [5, 15, 5, 15],
        formatter: function(params) {
          const icon = `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#bfbfbf;"></span>`;
          return `<span style="color:${params[0].color};font-weight: bold;">单位数：${
            comMap[params[0].dataIndex]
          }</span><br />${params[0].marker}风险点: ${params[0].data}<br />${icon}异常: ${
            params[1].data
          }`;
        },
      },
      yAxis: {
        type: 'value',
        axisTick: { show: false },
        splitLine: {
          show: true,
          lineStyle: {
            color: ['rgb(2,28,66)'],
            width: 2,
          },
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: ['rgb(2,28,66)'],
            width: 2,
          },
        },
        axisLabel: {
          formatter: function(value, index) {
            if (parseInt(value, 10) !== value) return '';
            return parseInt(value, 10);
          },
        },
      },
      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          axisLine: {
            show: true,
            lineStyle: {
              color: ['rgb(2,28,66)'],
              width: 2,
            },
          },
          axisLabel: {
            color: '#fff',
            fontSize: 14,
          },
          data: ['红', '橙', '黄', '蓝', '未评级'],
        },
        {
          type: 'category',
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { show: false },
          splitArea: { show: false },
          splitLine: { show: false },
          data: ['红', '橙', '黄', '蓝', '未评级'],
        },
      ],
      series: [
        {
          name: '风险点',
          type: 'bar',
          xAxisIndex: 0,
          itemStyle: {
            normal: {
              show: true,
              borderWidth: 0,
              borderColor: '#333',
              color: function(params) {
                // build a color map as your need.
                return colorList[params.dataIndex];
              },
            },
          },
          barGap: '0%',
          barWidth: '36%',
          barCategoryGap: '50%',
          data: [red, orange, yellow, blue, not_rated],
        },
        {
          name: '异常',
          type: 'bar',
          xAxisIndex: 1,
          itemStyle: {
            normal: {
              show: true,
              borderWidth: 0,
              color: lightGray,
              borderColor: '#333',
            },
          },
          barGap: '0%',
          barWidth: '25%',
          barCategoryGap: '50%',
          data: [red_abnormal, orange_abnormal, yellow_abnormal, blue_abnormal, not_rated_abnormal],
        },
      ],
    };
    return option;
  }

  onHdAreaReadyCallback = chart => {
    if (!chart) return;
    const { handleParentChange } = this.props;
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
      // 显示 tooltip
      chart.dispatchAction({
        type: 'showTip',
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
        dispatch,
        goComponent,
        countDangerLocation: {
          red = 0,
          red_abnormal = 0,
          red_company = 0,
          orange = 0,
          orange_abnormal = 0,
          orange_company = 0,
          yellow = 0,
          yellow_abnormal = 0,
          yellow_company = 0,
          blue = 0,
          blue_abnormal = 0,
          blue_company = 0,
          not_rated = 0,
          not_rated_abnormal = 0,
          not_rated_company = 0,
        },
      } = this.props;
      const risks = [
        {
          risk: red,
          abnormal: red_abnormal,
          company: red_company,
        },
        {
          risk: orange,
          abnormal: orange_abnormal,
          company: orange_company,
        },
        {
          risk: yellow,
          abnormal: yellow_abnormal,
          company: yellow_company,
        },
        {
          risk: blue,
          abnormal: blue_abnormal,
          company: blue_company,
        },
        {
          risk: not_rated,
          abnormal: not_rated_abnormal,
          company: not_rated_company,
        },
      ];
      dispatch({
        type: 'bigPlatform/fetchDangerLocationCompanyData',
        payload: {
          riskLevel: params.dataIndex + 1,
        },
      });
      goComponent('riskColors');
      handleParentChange({
        riskColorSummary: {
          riskColorTitle: riskTitles[params.dataIndex],
          risk: risks[params.dataIndex].risk,
          abnormal: risks[params.dataIndex].abnormal,
          company: risks[params.dataIndex].company,
        },
      });
    });
  };

  render() {
    return (
      <section className={styles.sectionWrapper} style={{ height: 'calc(50% - 6px)' }}>
        <div className={styles.sectionWrapperIn}>
          <div className={styles.sectionTitle}>
            <span className={styles.titleBlock} />
            风险点统计
          </div>
          <div className={styles.sectionMain} style={{ display: 'flex', flexDirection: 'column' }}>
            <div className={styles.hdArea} id="hdArea">
              <ReactEcharts
                option={this.getHdBarOption()}
                style={{ height: '100%', width: '100%' }}
                className="echarts-for-echarts"
                onChartReady={this.onHdAreaReadyCallback}
              />
            </div>
            <div className={styles.hdBarLegend}>
              <div className={styles.legendItem}>
                <span className={styles.legendIcon} style={{ backgroundColor: '#fc1f02' }} />
                红色风险点
                <span style={{ opacity: 0 }}>点</span>
              </div>

              <div className={styles.legendItem}>
                <span className={styles.legendIcon} style={{ backgroundColor: '#ed7e12' }} />
                橙色风险点
                <span style={{ opacity: 0 }}>点</span>
              </div>

              <div className={styles.legendItem}>
                <span className={styles.legendIcon} style={{ backgroundColor: '#fbf719' }} />
                黄色风险点
                <span style={{ opacity: 0 }}>点</span>
              </div>

              <div className={styles.legendItem}>
                <span className={styles.legendIcon} style={{ backgroundColor: '#1e60ff' }} />
                蓝色风险点
                <span style={{ opacity: 0 }}>点</span>
              </div>

              <div className={styles.legendItem}>
                <span className={styles.legendIcon} style={{ backgroundColor: '#4f6793' }} />
                未评级风险点
              </div>

              <div className={styles.legendItem}>
                <span className={styles.legendIcon} style={{ backgroundColor: '#bfbfbf' }} />
                异常状态
                <span style={{ opacity: 0 }}>点点</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default RiskBar;
