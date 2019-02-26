import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';
import Section from '../Section';
import RiskPointPieLegend from '../../../Components/RiskPointPieLegend';
import splitLine from '@/assets/split-line.png';
import checkingIcon from '@/assets/icon_pending_inspection.png';
import abnormalIcon from '@/assets/icon_abnormal.png';
import overIcon from '@/assets/icon_overtime.png';
import normalIcon from '@/assets/icon_normal.png';
// 引入样式文件
import styles from './index.less';

/**
 * description: 风险点
 */
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
      // 模型
      model: {
        countDangerLocation: {
          countDangerLocation: { red=0, orange=0, yellow=0, blue=0, not_rated=0, normal=0, checking=0, abnormal=0, over=0 }={},
        },
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
        value: not_rated,
      },
    ];
    // 如果四色都为0的话，图标只显示总计即未评级
    if (red === 0 && orange === 0 && yellow === 0 && blue === 0) {
      data = [{ value: not_rated, name: '总计', itemStyle: { color: '#4F6793' } }];
      legendData = legendData.slice(4);
    } else {
      const valuedData = [
        { value: red, name: '红', itemStyle: { color: '#E86767' } },
        { value: orange, name: '橙', itemStyle: { color: '#FFB650' } },
        { value: yellow, name: '黄', itemStyle: { color: '#F7E68A' } },
        { value: blue, name: '蓝', itemStyle: { color: '#5EBEFF' } },
      ];
      // 如果四色有值，但未评级为0的话就只显示四色
      if (not_rated === 0) {
        data = valuedData;
        legendData = legendData.slice(0, 4);
      } else {
        data = valuedData.concat([{ value: not_rated, name: '未评级', itemStyle: { color: '#4F6793' } }]);
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
            <div
              className={normal?styles.hoverable:undefined}
              style={{ backgroundImage: `url(${normalIcon})` }}
              onClick={() => {normal && handleClick('riskPoint', { riskPointType: { key: 'status', value: '正常' } });}}
            >
              <div className={styles.countLabel}>正常<span style={{ opacity: 0 }}>隐藏</span></div>
              <div className={styles.countValue}>{normal}</div>
            </div>

            <div
              className={checking?styles.hoverable:undefined}
              style={{ backgroundImage: `url(${checkingIcon})` }}
              onClick={() => {checking && handleClick('riskPoint', { riskPointType: { key: 'status', value: '待检查' } });}}
            >
              <div className={styles.countLabel}>待检查<span style={{ opacity: 0 }}>隐</span></div>
              <div className={styles.countValue}>{checking}</div>
            </div>

            <div
              className={abnormal?styles.hoverable:undefined}
              style={{ backgroundImage: `url(${abnormalIcon})` }}
              onClick={() => {abnormal && handleClick('riskPoint', { riskPointType: { key: 'status', value: '异常' } });}}
            >
              <div className={styles.countLabel}>异常<span style={{ opacity: 0 }}>隐藏</span></div>
              <div className={styles.countValue}>{abnormal}</div>
            </div>

            <div
              className={over?styles.hoverable:undefined}
              style={{ backgroundImage: `url(${overIcon})` }}
              onClick={() => {over && handleClick('riskPoint', { riskPointType: { key: 'status', value: '已超时' } });}}
            >
              <div className={styles.countLabel}>已超时<span style={{ opacity: 0 }}>隐</span></div>
              <div className={styles.countValue}>{over}</div>
            </div>
          </div>
        </div>
      </Section>
    );
  }
}
