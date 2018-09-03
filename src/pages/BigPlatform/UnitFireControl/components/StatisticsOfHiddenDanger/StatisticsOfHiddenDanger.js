import React, { PureComponent, Fragment } from 'react';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import Section from '../Section/Section.js';
import Switcher, { Pagination } from '../Switcher/Switcher';
import styles from './StatisticsOfHiddenDanger.less';

const triangleIcon = 'http://data.jingan-china.cn/v2/big-platform/fire-control/com/triangle.png';

/**
 * 隐患巡查统计
 */
export default class StatisticsOfHiddenDanger extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: 0,
    }
    // 隐患高亮索引
    this.currentHiddenDangerIndex = -1;
    // 隐患定时器
    this.hiddenDangerTimer = null;
  }

  componentWillUnmount() {
    clearInterval(this.hiddenDangerTimer);
  }

    /**
   * 隐患巡查统计图表加载完毕
   */
  handleChartReady = (chart, option) => {
    const changeHighLight = () => {
      var length = option.series[0].data.length;
      // 取消之前高亮的图形
      chart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: this.currentHiddenDangerIndex,
      });
      this.currentHiddenDangerIndex = (this.currentHiddenDangerIndex + 1) % length;
      // 高亮当前图形
      chart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: this.currentHiddenDangerIndex,
      });
    };
    // 立即执行高亮操作
    changeHighLight();
    // 添加定时器循环
    this.hiddenDangerTimer = setInterval(changeHighLight, 2000);
    // 绑定mouseover事件
    chart.on('mouseover', params => {
      clearInterval(this.hiddenDangerTimer);
      this.hiddenDangerTimer = null;
      if (params.dataIndex !== this.currentHiddenDangerIndex) {
        // 取消之前高亮的图形
        chart.dispatchAction({
          type: 'downplay',
          seriesIndex: 0,
          dataIndex: this.currentHiddenDangerIndex,
        });
        // 高亮当前图形
        chart.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: params.dataIndex,
        });
        this.currentHiddenDangerIndex = params.dataIndex;
      }
    });
    // 绑定mouseout事件
    chart.on('mouseout', params => {
      // 高亮当前图形
      chart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: this.currentHiddenDangerIndex,
      });
      if (this.hiddenDangerTimer) {
        return;
      }
      // 添加定时器循环
      this.hiddenDangerTimer = setInterval(changeHighLight, 2000);
    });
  }

    /**
   * 隐患巡查上一页分页按钮
   */
  handlePrev = () => {
    this.setState(({currentIndex}) => ({
      currentIndex: currentIndex-1,
    }));
  }

   /**
   * 隐患巡查下一页分页按钮
   */
  handleNext = () => {
    this.setState(({currentIndex}) => ({
      currentIndex: currentIndex+1,
    }));
  }

  renderSwitchers() {
    const { type, onSwitch } = this.props;
    const { currentIndex } = this.state;
    const months = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
    const currentMonth = moment().get('month');
    const list = [...months.slice(0, currentMonth), '本月'].reverse();
    const pageSize = 4;
    // 页数
    const pageCount = Math.max(Math.ceil((currentMonth+1) / pageSize), 1);
    // 是否为第一页
    const isFirst = currentIndex === 0;
    // 是否为最后一页
    const isLast = currentIndex === pageCount - 1;
    // 当前页的第一个元素
    const currentFirstIndex = currentIndex * pageSize;

    return (
      <div className={styles.switcherContainer}>
        {list.map((item, index) => {
          if (index < currentFirstIndex || index >= currentFirstIndex+pageSize) {
            return null;
          }
          const isSelected = type === (list.length - 1 - index);
          return (
            <Switcher style={{ top: (index-currentFirstIndex)*56, zIndex: isSelected?(pageSize+1):(pageSize+currentFirstIndex-index) }} isSelected={isSelected} content={item} key={item} onClick={() => {onSwitch(list.length - 1 - index);}} />
          );
        })}
        <Pagination style={{ top: Math.min(pageSize, currentMonth+1-currentFirstIndex)*56, zIndex: 0 }} onNext={this.handleNext} onPrev={this.handlePrev} isFirst={isFirst} isLast={isLast} />
      </div>
    );
  }

  render() {
    const {
      ssp = 0,
      fxd = 0,
      cqwzg = 0,
      dfc = 0,
      dzg = 0,
      ygb = 0,
    } = this.props;

    const option = {
      series: [
        {
          type: 'pie',
          radius: ['65%', '50%'],
          hoverOffset: 0,
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              color: '#fff',
              fontSize: 14,
              lineHeight: 20,
              align: 'center',
              formatter: '{d}%\n{b}',
              rich: {

              },
            },
            emphasis: {
              show: true,
            },
          },
          labelLine: {
            length: 30,
            lineStyle: {
              color: '#fff',
            },
          },
          data: [
            { value: cqwzg, name: '超期未整改', itemStyle: { color: '#D16772' } },
            { value: dfc, name: '待复查', itemStyle: { color: '#2787D5' } },
            { value: dzg, name: '待整改', itemStyle: { color: '#DEAD5C' } },
            { value: ygb, name: '已关闭', itemStyle: { color: '#A9B2BE' } },
          ],
        },
        {
          type: 'pie',
          radius: '40%',
          hoverOffset: 0,
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              color: '#fff',
              fontSize: 14,
              lineHeight: 20,
              formatter: '{b}：{c}',
              position: 'inner',
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
            { value: ssp, name: '随手拍', itemStyle: { color: '#00ABC9' } },
            { value: fxd, name: '风险点', itemStyle: { color: '#E86767' } },
          ],
        },
      ],
    };

    return (
      <Section title="隐患巡查统计" fixedContent={(
        <Fragment>
          <div className={styles.hiddenDangerChartLegend}>
            <div className={styles.hiddenDangerChartLegendLeft}>
              <div><div style={{ backgroundImage: `url(${triangleIcon})` }}></div><div>隐患来源</div></div>
              <div>
                <div><div style={{ backgroundColor: '#00ABC9' }}></div><div>随手拍</div><div>{ssp}</div></div>
                <div><div style={{ backgroundColor: '#E86767' }}></div><div>风险点</div><div>{fxd}</div></div>
              </div>
            </div>
            <div className={styles.hiddenDangerChartLegendRight}>
              <div><div style={{ backgroundImage: `url(${triangleIcon})` }}></div><div>隐患状态</div></div>
              <div>
                <div><div style={{ backgroundColor: '#D16772' }}></div><div>超期未整改</div><div>{cqwzg}</div></div>
                <div><div style={{ backgroundColor: '#2787D5' }}></div><div>待复查</div><div>{dfc}</div></div>
                <div><div style={{ backgroundColor: '#DEAD5C' }}></div><div>待整改</div><div>{dzg}</div></div>
                <div><div style={{ backgroundColor: '#A9B2BE' }}></div><div>已关闭</div><div>{ygb}</div></div>
              </div>
            </div>
          </div>
          {this.renderSwitchers()}
        </Fragment>
      )}>
        <div className={styles.hiddenDangerChartContainer}>
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
