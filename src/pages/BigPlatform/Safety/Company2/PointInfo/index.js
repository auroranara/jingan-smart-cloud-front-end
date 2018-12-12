import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';
import Section from '@/components/Section';
import Ellipsis from '@/components/Ellipsis';
import splitLine from '@/assets/split-line.png';
import RiskPointPieLegend from '../../Components/RiskPointPieLegend';
import checkingIcon from '../../img/checkingIcon.png';
import abnormalIcon from '../../img/abnormalIcon.png';
import overIcon from '../../img/overIcon.png';

import styles from './index.less';

/* 图片地址前缀 */
const iconPrefix = 'http://data.jingan-china.cn/v2/big-platform/safety/com/';
/* 图片 */
const normalIcon = `${iconPrefix}normal-icon.png`;



/**
 * description: 风险点信息
 * author: sunkai
 * date: 2018年12月10日
 */
export default class PointInfo extends PureComponent {
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
      const { handleClickCount } = this.props;
      handleClickCount && handleClickCount('riskPoint', { riskPointType: { key: 'status', value: name } });
    });
  }

  render() {
    const {
      // 样式
      style,
      // 类名
      className,
      // 模型
      model: {
        countDangerLocation: {
          countDangerLocation: { red=0, orange=0, yellow=0, blue=0, not_rated=0, normal=0, checking=0, abnormal=0, over=0 }={},
        },
      },
      // 点击事件
      handleClickCount,
    } = this.props;
    // 正常统计是否可点击
    const isNormalClickable = normal > 0;
    // 待检查统计是否可点击
    const isCheckingClickable = checking > 0;
    // 异常统计是否可点击
    const isAbnormalClickable = abnormal > 0;
    // 已超时统计是否可点击
    const isOverClickable = over > 0;

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
      <Section className={className} style={style} title="风险点">
        <div className={styles.container}>
          <div className={styles.top} style={{ backgroundImage: `url(${splitLine})`, height: '50%' }}>
            {/* 饼图 */}
            <ReactEcharts
              option={option}
              style={{ height: '100%' }}
              onChartReady={this.handlePieChartReady}
              className="domPieChart"
            />
            {/* 图例 */}
            <RiskPointPieLegend
              style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)' }}
              data={legendData}
            />
          </div>
          {/* 统计信息 */}
          <div className={styles.bottom}>
            <div
              className={isNormalClickable ? styles.hoverable : undefined}
              style={{ backgroundImage: `url(${normalIcon})` }}
              onClick={isNormalClickable ? () => {handleClickCount('riskPoint', { riskPointType: { key: 'level', value: 'normal' } });} : undefined}
            >
              <div className={styles.countLabel} style={{ color: 'rgb(0, 161, 129)' }}><Ellipsis lines={1} /* tooltip */>正常</Ellipsis></div>
              <div className={styles.countValue}><Ellipsis lines={1} /* tooltip */>{normal}</Ellipsis></div>
            </div>

            <div
              className={isCheckingClickable ? styles.hoverable : undefined}
              style={{ backgroundImage: `url(${checkingIcon})` }}
              onClick={isCheckingClickable ? () => {handleClickCount('riskPoint', { riskPointType: { key: 'level', value: 'checking' } });} : undefined}
            >
              <div className={styles.countLabel} style={{ color: 'rgb(94, 190, 255)' }}><Ellipsis lines={1} /* tooltip */>待检查</Ellipsis></div>
              <div className={styles.countValue}><Ellipsis lines={1} /* tooltip */>{checking}</Ellipsis></div>
            </div>

            <div
              className={isAbnormalClickable ? styles.hoverable : undefined}
              style={{ backgroundImage: `url(${abnormalIcon})` }}
              onClick={isAbnormalClickable ? () => {handleClickCount('riskPoint', { riskPointType: { key: 'level', value: 'abnormal' } });} : undefined}
            >
              <div className={styles.countLabel} style={{ color: 'rgb(255, 72, 72)' }}><Ellipsis lines={1} /* tooltip */>异常</Ellipsis></div>
              <div className={styles.countValue}><Ellipsis lines={1} /* tooltip */>{abnormal}</Ellipsis></div>
            </div>

            <div
              className={isOverClickable ? styles.hoverable : undefined}
              style={{ backgroundImage: `url(${overIcon})` }}
              onClick={isOverClickable ? () => {handleClickCount('riskPoint', { riskPointType: { key: 'level', value: 'over' } });} : undefined}
            >
              <div className={styles.countLabel} style={{ color: 'rgb(255, 72, 72)' }}><Ellipsis lines={1} /* tooltip */>已超时</Ellipsis></div>
              <div className={styles.countValue}><Ellipsis lines={1} /* tooltip */>{over}</Ellipsis></div>
            </div>
          </div>
        </div>
      </Section>
    );
  }
}
