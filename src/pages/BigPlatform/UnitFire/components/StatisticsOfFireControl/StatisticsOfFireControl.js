import React, { PureComponent, Fragment } from 'react';
import ReactEcharts from 'echarts-for-react';
import Section from '../Section/Section.js';
import Switcher from '../Switcher/Switcher';
import styles from './StatisticsOfFireControl.less';

/**
 * 消防数据统计
 */
export default class App extends PureComponent {
  constructor(props) {
    super(props);
    // 当前高亮的图标索引
    this.currentFireControlIndex = -1;
    // 消防图表定时器
    this.fireControlTimer = null;
  }

  componentWillUnmount() {
    clearInterval(this.fireControlTimer);
  }

  /**
   * 消防数据统计图标加载完成事件
   */
  handleChartReady = (chart, option) => {
    const changeHighLight = () => {
      var length = option.series[0].data.length;
      // 取消之前高亮的图形
      chart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: this.currentFireControlIndex,
      });
      this.currentFireControlIndex = (this.currentFireControlIndex + 1) % length;
      // 高亮当前图形
      chart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: this.currentFireControlIndex,
      });
    };
    // 立即执行高亮操作
    changeHighLight();
    // 添加定时器循环
    this.fireControlTimer = setInterval(changeHighLight, 2000);
    // 绑定mouseover事件
    chart.on('mouseover', params => {
      clearInterval(this.fireControlTimer);
      this.fireControlTimer = null;
      if (params.dataIndex !== this.currentFireControlIndex) {
        // 取消之前高亮的图形
        chart.dispatchAction({
          type: 'downplay',
          seriesIndex: 0,
          dataIndex: this.currentFireControlIndex,
        });
        // 高亮当前图形
        chart.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: params.dataIndex,
        });
        this.currentFireControlIndex = params.dataIndex;
      }
    });
    // 绑定mouseout事件
    chart.on('mouseout', params => {
      // 高亮当前图形
      chart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: this.currentFireControlIndex,
      });
      if (this.fireControlTimer) {
        return;
      }
      // 添加定时器循环
      this.fireControlTimer = setInterval(changeHighLight, 2000);
    });
  }

  /**
   * 消防数据统计模块开关
   */
  renderSwitchers() {
    const { type, onSwitch } = this.props;

    return (
      <div className={styles.switcherContainer}>
        {['今日', '本周', '本月', '本年'].map((item, index) => {
          const isSelected = type===(index+1);
          return <Switcher style={{ top: index*56, zIndex: isSelected?5:(4-index) }} isSelected={isSelected} content={item} key={item} onClick={() => {onSwitch(index+1);}} />;
        })}
      </div>
    );
  }

  render() {
    const {
      real = 0,
      misinformation = 0,
      pending = 0,
      fault = 0,
      shield = 0,
      linkage = 0,
      supervise = 0,
      feedback = 0,
    } = this.props;

    const fire = real+misinformation+pending;

    const option = {
      color: ['#E86767', '#108EFF', '#847BE6', '#01B0D1', '#FFB13A', '#BBBBBC'],
      series: [
        {
          type: 'pie',
          radius: '55%',
          hoverOffset: 0,
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              color: '#fff',
              fontSize: 14,
              lineHeight: 20,
              formatter: '{b}：{c}',
              rich: {

              },
            },
            emphasis: {
              show: true,
            },
          },
          labelLine: {
            lineStyle: {
              color: '#fff',
            },
          },
          data: [
            { value: fire, name: '火警', label: { formatter: `真实：${real}\n误报：${misinformation}\n待处理：${pending}` } },
            { value: fault, name: '故障' },
            { value: shield, name: '屏蔽' },
            { value: linkage, name: '联动' },
            { value: supervise, name: '监管' },
            { value: feedback, name: '反馈' },
          ],
        },
      ],
    };

    return (
      <Section title="消防数据统计" fixedContent={(
        <Fragment>
          <div className={styles.fireControlPieChartLegend}>
            <div><div style={{ backgroundColor: '#E86767' }}></div><div>火警</div><div>{fire}</div></div>
            <div><div style={{ backgroundColor: '#108EFF' }}></div><div>故障</div><div>{fault}</div></div>
            <div><div style={{ backgroundColor: '#847BE6' }}></div><div>屏蔽</div><div>{shield}</div></div>
            <div><div style={{ backgroundColor: '#01B0D1' }}></div><div>联动</div><div>{linkage}</div></div>
            <div><div style={{ backgroundColor: '#FFB13A' }}></div><div>监管</div><div>{supervise}</div></div>
            <div><div style={{ backgroundColor: '#BBBBBC' }}></div><div>反馈</div><div>{feedback}</div></div>
          </div>
          {this.renderSwitchers()}
        </Fragment>
      )}>
        <div className={styles.fireControlPieChartContainer}>
          <ReactEcharts
            option={option}
            style={{ height: '100%' }}
            onChartReady={chart => {
              this.handleChartReady(chart, option);
            }}
          />
        </div>
      </Section>
    );
  }
}
