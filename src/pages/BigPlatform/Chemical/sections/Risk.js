import React, { PureComponent, Fragment } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Section2 as CustomSection } from '@/jingan-components/CustomSection';
import { TabTitle } from '../components/Components';
// 引入样式文件
import styles from './Risk.less';

const LABELS = ['风险分级', '风险分类'];
const TITLE_STYLE = { marginLeft: 10 };
const COLORS = [
  '#00BAFF',
  '#DF8B6F',
  '#02BECD',
  '#E86767',
  '#847BE6',
  '#F6B54E',
  '#BCBCBD',
  '#E589E6',
  '#729CDB',
  '#8AA57D',
  '#584CDF',
  '#278DFF',
  '#9E9D74',
];
const classifyData = [
  { name: '危险化学品', value: 11 },
  { name: '爆炸性粉尘', value: 14 },
  { name: '重大危险源', value: 6 },
  { name: '受限空间', value: 10 },
  { name: '涉氨场所', value: 11 },
  { name: '生产系统', value: 15 },
  // { name: '危险化学品', value: 18 },
  // { name: '危险化学品', value: 7 },
  // { name: '危险化学品', value: 4 },
  // { name: '危险化学品', value: 11 },
];
export default class Risk extends PureComponent {
  state = { active: 0 };

  gradeOption = () => {
    const option = {
      textStyle: {
        fontSize: 14,
        color: '#fff',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        // formatter: '{b}：{c}',
      },
      grid: {
        left: '3%',
        right: '8%',
        top: '10%',
        bottom: '5%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
        axisLabel: {
          textStyle: {
            color: '#405e83',
          },
        },
        axisTick: {
          show: true,
        },
        splitLine: {
          show: false,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#405e83',
            width: 2,
          },
        },
      },
      yAxis: {
        type: 'category',
        data: ['重大风险', '较大风险', '一般风险', '低风险'].reverse(),
        axisLabel: {
          interval: 0,
          rotate: 60,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#405e83',
            width: 2,
          },
        },
      },
      series: [
        {
          // name: '物资分类',
          type: 'bar',
          barWidth: 12,
          data: [
            {
              name: '重大风险',
              value: 17,
              itemStyle: {
                color: '#af313a',
                barBorderRadius: 10,
              },
            },
            {
              name: '较大风险',
              value: 22,
              itemStyle: {
                color: '#e38450',
                barBorderRadius: 10,
              },
            },
            {
              name: '一般风险',
              value: 28,
              itemStyle: {
                color: '#d6e581',
                barBorderRadius: 10,
              },
            },
            {
              name: '低风险',
              value: 15,
              itemStyle: {
                color: '#04fdff',
                barBorderRadius: 10,
              },
            },
          ].reverse(),
        },
      ],
    };
    return option;
  };

  classifyOption = () => {
    const option = {
      textStyle: {
        fontSize: 14,
        color: '#fff',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '3%',
        right: '8%',
        top: '10%',
        bottom: '5%',
        containLabel: true,
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
        axisLabel: {
          textStyle: {
            color: '#405e83',
          },
        },
        axisTick: {
          show: true,
        },
        splitLine: {
          show: false,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#405e83',
            width: 2,
          },
        },
      },
      xAxis: {
        type: 'category',
        data: classifyData.map(item => item.name),
        axisLabel: {
          interval: 0,
          rotate: 20,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#405e83',
            width: 2,
          },
        },
      },
      series: [
        {
          type: 'bar',
          barWidth: 12,
          data: classifyData.map((item, index) => ({
            name: item.name,
            value: item.value,
            itemStyle: {
              color: COLORS[index % COLORS.length],
              barBorderRadius: 10,
            },
          })),
        },
      ],
    };
    return option;
  };

  handleClickTab = i => {
    this.setState({ active: i });
  };

  render() {
    const { active } = this.state;

    return (
      <CustomSection className={styles.container} title="风险情况统计">
        <TabTitle
          index={active}
          labels={LABELS}
          handleClickTab={this.handleClickTab}
          style={TITLE_STYLE}
        />
        <ReactEcharts
          option={active === 0 ? this.gradeOption() : this.classifyOption()}
          style={{ height: 'calc(100% - 30px)', width: '100%' }}
          notMerge={true}
        />
      </CustomSection>
    );
  }
}
