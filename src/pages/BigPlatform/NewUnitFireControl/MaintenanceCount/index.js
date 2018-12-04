import React, { PureComponent } from 'react';
import { Select } from 'antd';
import ReactEcharts from 'echarts-for-react';
import Section from '../Section';

const { Option } = Select

// 总维保数颜色
const totalColor = '#2A8BD5';
// 已维保颜色
const repairedColor = '#05D2DA';
// 待维保颜色
const unrepairedColor = '#FF4848';
// 维保中颜色
const repairingColor = '#F6B54E';
// 下拉框值
const list = [
  {
    label: '近7天',
    value: 6,
  },
  {
    label: '本月',
    value: 3,
  },
  {
    label: '本季度',
    value: 4,
  },
  {
    label: '本年度',
    value: 5,
  },
];

/**
 * description: 维保统计
 * author: sunkai
 * date: 2018年12月03日
 */
export default class App extends PureComponent {
  state = {
    value: 6,
  };


  componentDidMount() {

  }

  handleSelect = (value) => {
    const { getMaintenanceCount } = this.props;
    this.setState({
      value,
    });
    getMaintenanceCount && getMaintenanceCount(value);
  }

  renderSelect() {
    const { value } = this.state;
    return (
      <Select value={value} onSelect={this.handleSelect} size="small">
        {list.map(({ label, value }) => (
          <Option value={value} key={value}>{label}</Option>
        ))}
      </Select>
    );
  }

  render() {
    const {
      model,
    } = this.props;

    // 配置项
    const option = {
      color: [totalColor, repairedColor, unrepairedColor, repairingColor],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        textStyle: {
          color: '#fff',
        },
        icon: 'circle',
      },
      textStyle: {
        color: '#fff',
      },
      grid: {
        top: '60',
        left: '10',
        right: '10',
        bottom: '10',
        borderColor: '#2d344a',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: ['晶安智慧', '本单位'],
        interval: 1,
        splitLine: {
          show: true,
          lineStyle: {
            color: '#04e9eb',
            type: 'dashed',
            width: 2,
          },
        },
        axisLine: {
          lineStyle: {
            color: '#3f5d79',
            width: 2,
          },
        },
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        axisLine: {
          lineStyle: {
            color: '#3f5d79',
            width: 2,
          },
        },
        splitLine: {
          lineStyle: {
            color: '#3f5d79',
            width: 2,
          },
        },
      },
      series: [
        {
          name: '总维保数',
          type: 'bar',
          data: [0, 0],
          label: {
            normal: {
              show: true,
              color: '#fff',
              position: 'top',
            },
          },
        },
        {
          name: '已维保',
          type: 'bar',
          data: [0, 0],
          label: {
            normal: {
              show: true,
              color: '#fff',
              position: 'top',
            },
          },
        },
        {
          name: '待维保',
          type: 'bar',
          data: [0, 0],
          label: {
            normal: {
              show: true,
              color: '#fff',
              position: 'top',
            },
          },
        },
        {
          name: '维保中',
          type: 'bar',
          data: [0, 0],
          label: {
            normal: {
              show: true,
              color: '#fff',
              position: 'top',
            },
          },
        },
      ],
    };

    return (
      <Section title="维保统计">
        {this.renderSelect()}
        <ReactEcharts
          option={option}
          style={{ width: '100%', height: '100%' }}
        />
      </Section>
    );
  }
}
