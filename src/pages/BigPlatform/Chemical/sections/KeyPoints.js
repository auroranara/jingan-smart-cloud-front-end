import React, { PureComponent, Fragment } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Section2 as CustomSection } from '@/jingan-components/CustomSection';
import { TabTitle } from '../components/Components';
// 引入样式文件
import styles from './KeyPoints.less';

const LABELS = ['重点监管危险化学品', '重点监管危险化工工艺'];
const TITLE_STYLE = { marginLeft: 10 };
const chemicalData = [
  { value: 10, name: '环氧乙烷' },
  { value: 5, name: '八氟丙烷' },
  { value: 15, name: '八溴联苯' },
  { value: 25, name: '氨基甲酸胺' },
  { value: 20, name: '氨基化钙' },
  { value: 35, name: '苯并呋喃' },
  { value: 30, name: '苯酚钠' },
  { value: 40, name: '苯基硫醇' },
];
const technologyData = [
  { value: 17, name: '烷基化工艺' },
  { value: 4, name: '过氧化工艺' },
  { value: 7, name: '氟化工艺' },
];

export default class KeyPoints extends PureComponent {
  state = { active: 0 };

  chemicalOption = () => {
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)',
      },
      color: [
        '#f6b54e',
        '#bcbcbd',
        '#e589e6',
        '#318bbc',
        '#00baff',
        '#df8b6f',
        '#02becd',
        '#e86767',
        '#847be6',
      ],
      calculable: true,
      series: [
        {
          type: 'pie',
          radius: [20, 80],
          roseType: 'area',
          label: {
            normal: {
              show: false,
              formatter: '{b} :\n{c}（{d}%）',
              textStyle: {
                color: 'rgba(255,255,255,0.5)',
              },
            },
            emphasis: {
              show: true,
            },
          },
          lableLine: {
            normal: {
              show: false,
            },
            emphasis: {
              show: true,
            },
          },
          data: chemicalData,
        },
      ],
    };
    return option;
  };

  technologyOption = () => {
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)',
      },
      color: ['#f6b54e', '#e589e6', '#02becd'],
      calculable: true,
      series: [
        {
          type: 'pie',
          radius: [20, 80],
          roseType: 'area',
          label: {
            normal: {
              show: false,
              formatter: '{b} :\n{c}（{d}%）',
              textStyle: {
                color: 'rgba(255,255,255,0.5)',
              },
            },
            emphasis: {
              show: true,
            },
          },
          lableLine: {
            normal: {
              show: false,
            },
            emphasis: {
              show: true,
            },
          },
          data: technologyData,
        },
      ],
    };
    return option;
  };

  handleClickTab = i => {
    this.setState({ active: i });
    const echartsInstance = this.echarts.getEchartsInstance();
    const options = [this.chemicalOption(), this.technologyOption()];
    echartsInstance.setOption(options[i], true);
  };

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
  };

  render() {
    const { active } = this.state;
    const datas = [chemicalData, technologyData];
    const total = datas[active].reduce((prev, next) => {
      const { value } = next;
      prev += value;
      return prev;
    }, 0);

    return (
      <CustomSection className={styles.container} title="两重点">
        <TabTitle
          index={active}
          labels={LABELS}
          handleClickTab={this.handleClickTab}
          style={TITLE_STYLE}
        />
        <ReactEcharts
          option={this.chemicalOption()}
          style={{ height: 'calc(100% - 30px)', width: '100%' }}
          onChartReady={this.onChartReadyCallback}
          notMerge={true}
          ref={e => {
            this.echarts = e;
          }}
        />
        <div className={styles.legend}>
          类型：
          {datas[active].length}
          <span>
            总数：
            {total}
          </span>
        </div>
      </CustomSection>
    );
  }
}
