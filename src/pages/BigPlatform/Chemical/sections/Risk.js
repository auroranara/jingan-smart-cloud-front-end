import React, { PureComponent, Fragment } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Section2 as CustomSection } from '@/jingan-components/CustomSection';
import { TabTitle } from '../components/Components';
// 引入样式文件
import styles from './Risk.less';

const LABELS = ['风险分级', '风险分类'];
const TITLE_STYLE = { marginLeft: 10 };

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
          option={this.gradeOption()}
          style={{ height: 'calc(100% - 30px)', width: '100%' }}
        />
      </CustomSection>
    );
  }
}
