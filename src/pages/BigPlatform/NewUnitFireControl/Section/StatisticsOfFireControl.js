import React, { PureComponent } from 'react';
import { Select } from 'antd';
import ReactEcharts from 'echarts-for-react';
import Section from '../Section';
import styles from './StatisticsOfFireControl.less';

/**
 * 消防数据统计
 */
const { Option } = Select;
const options = [
  { name: '今日', value: 1 },
  { name: '本周', value: 2 },
  { name: '本月', value: 3 },
  { name: '本年', value: 4 },
];
export default class StatisticsOfFireControl extends PureComponent {
  constructor(props) {
    super(props);
    // 当前高亮的图标索引
    this.currentFireControlIndex = -1;
    // 消防图表定时器
    this.fireControlTimer = null;
    this.state = {
      active: 0,
    };
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
  };

   handleSelect = (type, { props: { data } }) => {
    const { onSwitch } = this.props;
    this.setState({ active: options.map(item => item.value).indexOf(type) });
    onSwitch(type);
  };

  /**
   * 消防数据统计模块Select
   */
  renderSelect = () => {
    const { active } = this.state;
    return (
      <Select
        value={options[active].value || 1}
        onSelect={this.handleSelect}
        className={styles.select}
        dropdownClassName={styles.dropDown}
      >
        {options.map(item => {
          const { name, value } = item;
          return (
            <Option
              key={value}
              value={value}
              data={item}
              style={{
                color: options[active].value && options[active].value === value && '#00ffff',
              }}
            >
              {name}
            </Option>
          );
        })}
      </Select>
    );
  };

  render() {
    const {
      fireControlCount: {
        warnTrue = 0,
        warnFalse = 0,
        fire_state = 0,
        fault_state = 0,
        start_state = 0,
        shield_state = 0,
        feedback_state = 0,
        supervise_state = 0,
      },
      handleShowFireMonitor,
    } = this.props;

    const real = warnTrue,
      misinformation = warnFalse,
      pending = fire_state - warnTrue - warnFalse,
      fault = fault_state,
      shield = shield_state,
      linkage = start_state,
      supervise = supervise_state,
      feedback = feedback_state;
    const fire = real + misinformation + pending;

    const chartData = [
      {
        value: fire,
        name: '火警',
        label: { formatter: `真实：${real}\n误报：${misinformation}\n待处理：${pending}` },
      },
      { value: fault, name: '故障' },
      { value: shield, name: '屏蔽' },
      { value: linkage, name: '联动' },
      { value: supervise, name: '监管' },
      { value: feedback, name: '反馈' },
    ];

    const colors = ['#E86767', '#108EFF', '#847BE6', '#01B0D1', '#FFB13A', '#BBBBBC'];

    const option = {
      color: colors,
      series: [
        {
          type: 'pie',
          startAngle: 45,
          radius: '55%',
          hoverOffset: 0,
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              color: '#fff',
              fontSize: 12,
              lineHeight: 14,
              formatter: '{b}：{c}',
              rich: {},
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
          data: chartData,
        },
      ],
    };

    const extra = (
      <span
        className={styles.extra}
        onClick={() => {
          handleShowFireMonitor(0);
        }}
      >
        实时>>
      </span>
    );

    return (
      <Section title="消防主机监测" extra={extra}>
        <div className={styles.fireControlPieChartContainer}>
          <ReactEcharts
            option={option}
            style={{ height: '100%' }}
            onChartReady={chart => {
              this.handleChartReady(chart, option);
            }}
          />

          <div className={styles.fireControlPieChartLegend}>
            {chartData.map((item, index) => {
              const { name, value } = item;
              return (
                <div key={index}>
                  <div style={{ backgroundColor: colors[index] }} />
                  <div>{name}</div>
                  <div>{value}</div>
                </div>
              );
            })}
          </div>
          {this.renderSelect()}
        </div>
      </Section>
    );
  }
}
