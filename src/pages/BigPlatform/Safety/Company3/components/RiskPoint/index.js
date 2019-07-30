import React, { PureComponent } from 'react';
import { connect } from 'dva';
import ReactEcharts from 'echarts-for-react';
import classNames from 'classnames';
import Section from '../Section';
import RiskPointPieLegend from '../../../Components/RiskPointPieLegend';
import splitLine from '@/assets/split-line.png';
import verticalSplitLine from '../../imgs/vertical-split-line.png';
// 引入样式文件
import styles from './index.less';

/**
 * description: 风险点
 */
@connect(({ unitSafety }) => ({
  unitSafety,
}))
export default class RiskPoint extends PureComponent {
  // 饼图实例
  pieChart = null
  // 当前选中的子项
  currentPieIndex = -1
  // 定时器
  pieTimer = null

  componentDidMount() {
    this.pieTimer = setInterval(this.showPieChartTip, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.pieTimer);
  }

  // 显示下一个子项
  showPieChartTip = () => {
    if (!this.pieTimer) {
      return;
    }
    var length = this.pieChart.getOption().series[0].data.length;
    // 取消之前高亮的图形
    this.pieChart.dispatchAction({
      type: 'downplay',
      seriesIndex: 0,
      dataIndex: this.currentPieIndex,
    });
    this.currentPieIndex = (this.currentPieIndex + 1) % length;
    // 高亮当前图形
    this.pieChart.dispatchAction({
      type: 'highlight',
      seriesIndex: 0,
      dataIndex: this.currentPieIndex,
    });
  }

  /**
   * 图标加载完毕
   */
  handlePieChartReady = (chart) => {
    if (document.querySelector('.domPieChart').getAttribute('_echarts_instance_') !== chart.id) {
      return;
    }
    this.pieChart = chart;
    // 绑定mouseover事件
    chart.on('mouseover', params => {
      // 如果当前移入的子项不是正选中的子项
      if (params.dataIndex !== this.currentPieIndex) {
        // 取消之前高亮的图形
        chart.dispatchAction({
          type: 'downplay',
          seriesIndex: 0,
          dataIndex: this.currentPieIndex,
        });
        // 高亮当前图形
        chart.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: params.dataIndex,
        });
        this.currentPieIndex = params.dataIndex;
      }
    });
    // 绑定mouseout事件
    chart.on('mouseout', params => {
      // 高亮当前图形
      chart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: this.currentPieIndex,
      });
      // // 清除定时器
      // clearInterval(this.pieTimer);
      // // 添加定时器
      // this.pieTimer = setInterval(this.showPieChartTip, 2000);
    });
    // 饼图点击事件
    chart.on('click', ({ name }) => {
      const { handleClick } = this.props;
      handleClick && handleClick('riskPoint', { riskPointType: { key: 'level', value: name } });
    });
  }

  render() {
    const {
      unitSafety: {
        points: {
          red=0,
          orange=0,
          yellow=0,
          blue=0,
          gray=0,
          overtime=0,
          risky=0,
        }={},
      },
      // 点击事件
      handleClick,
    } = this.props;

    let data, legendData=[
      {
        label: '红',
        color: '#E86767',
        value: red,
      },
      {
        label: '橙',
        color: '#FFB650',
        value: orange,
      },
      {
        label: '黄',
        color: '#F7E68A',
        value: yellow,
      },
      {
        label: '蓝',
        color: '#5EBEFF',
        value: blue,
      },
      {
        label: '未评级',
        color: '#4F6793',
        value: gray,
      },
    ];
    // 如果四色都为0的话，图标只显示总计即未评级
    if (red === 0 && orange === 0 && yellow === 0 && blue === 0) {
      data = [{ value: gray, name: '总计', itemStyle: { color: '#4F6793' } }];
      legendData = legendData.slice(4);
    } else {
      const valuedData = [
        { value: red, name: '红', itemStyle: { color: '#E86767' } },
        { value: orange, name: '橙', itemStyle: { color: '#FFB650' } },
        { value: yellow, name: '黄', itemStyle: { color: '#F7E68A' } },
        { value: blue, name: '蓝', itemStyle: { color: '#5EBEFF' } },
      ];
      // 如果四色有值，但未评级为0的话就只显示四色
      if (gray === 0) {
        data = valuedData;
        legendData = legendData.slice(0, 4);
      } else {
        data = valuedData.concat([{ value: gray, name: '未评级', itemStyle: { color: '#4F6793' } }]);
      }
    }
    // 图表选项
    const option = {
      series: [
        {
          type: 'pie',
          // 设置中心点
          center: ['35%', '50%'],
          radius: ['50%', '80%'],
          hoverOffset: 5,
          avoidLabelOverlap: false,
          legendHoverLink: false,
          label: {
            normal: {
              show: false,
              position: 'center',
              formatter: '{b}\n{c|{c}}',
              rich: {
                c: {
                  fontSize: 20,
                },
              },
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '16',
                fontWeight: 'bold',
              },
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          data,
        },
      ],
    };

    return (
      <Section title="风险点">
        <div className={styles.container}>
          <div className={styles.top}>
            {/* 饼图 */}
            <ReactEcharts
              option={option}
              style={{ height: '100%' }}
              onChartReady={this.handlePieChartReady}
              className="domPieChart"
            />
            {/* 图例 */}
            <RiskPointPieLegend
              style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}
              data={legendData}
            />
          </div>
          {/* 分割线 */}
          <div className={styles.splitLineWrapper}><div className={styles.splitLine} style={{ backgroundImage: `url(${splitLine})` }} /></div>
          {/* 统计信息 */}
          <div className={styles.bottom}>
            <div className={styles.bottomItem}>
              <div
                className={classNames(styles.bottomItemContent, risky && styles.enableClick)}
                onClick={() => {risky && handleClick('riskPoint', { riskPointType: { key: 'status', value: '有隐患' } });}}
              >
                <div className={styles.bottomItemContentTop}>{risky}</div>
                <div className={styles.bottomItemContentBottom}>有隐患</div>
              </div>
            </div>
            <div className={styles.verticalSplitLine} style={{ backgroundImage: `url(${verticalSplitLine})` }} />
            <div className={styles.bottomItem}>
              <div
                className={classNames(styles.bottomItemContent, overtime && styles.enableClick)}
                onClick={() => {overtime && handleClick('riskPoint', { riskPointType: { key: 'status', value: '已超时' } });}}
              >
                <div className={styles.bottomItemContentTop}>{overtime}</div>
                <div className={styles.bottomItemContentBottom}>超时未查</div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    );
  }
}
