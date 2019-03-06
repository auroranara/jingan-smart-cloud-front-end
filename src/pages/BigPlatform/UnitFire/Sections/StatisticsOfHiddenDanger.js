import React, { PureComponent, Fragment } from 'react';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import { Col } from 'antd';
import Section from '../components/Section/Section.js';
import Switcher, { Pagination } from '../components/Switcher/Switcher';
import styles from './StatisticsOfHiddenDanger.less';

const triangleIcon = 'http://data.jingan-china.cn/v2/big-platform/fire-control/com/triangle.png';

/**
 * 隐患统计
 */
export default class StatisticsOfHiddenDanger extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: 0, // 右侧日期页码
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
    const { handleClickChat } = this.props
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
    chart.on('mouseover', ({ dataIndex, seriesIndex }) => {
      clearInterval(this.hiddenDangerTimer);
      this.hiddenDangerTimer = null;
      if (dataIndex !== this.currentHiddenDangerIndex && seriesIndex === 0) {
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
          dataIndex: dataIndex,
        });
        this.currentHiddenDangerIndex = dataIndex;
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
    chart.on('click', handleClickChat)
  }

  /**
 * 隐患巡查上一页分页按钮
 */
  handlePrev = () => {
    this.setState(({ currentIndex }) => ({
      currentIndex: currentIndex - 1,
    }));
  }

  /**
  * 隐患巡查下一页分页按钮
  */
  handleNext = () => {
    this.setState(({ currentIndex }) => ({
      currentIndex: currentIndex + 1,
    }));
  }

  renderSwitchers() {
    const { type, onSwitch } = this.props;
    const { currentIndex } = this.state;
    const year = moment().year()
    const monthsList = [
      { label: '1月', value: `${year}-01` },
      { label: '2月', value: `${year}-02` },
      { label: '3月', value: `${year}-03` },
      { label: '4月', value: `${year}-04` },
      { label: '5月', value: `${year}-05` },
      { label: '6月', value: `${year}-06` },
      { label: '7月', value: `${year}-07` },
      { label: '8月', value: `${year}-08` },
      { label: '9月', value: `${year}-09` },
      { label: '10月', value: `${year}-10` },
      { label: '11月', value: `${year}-11` },
      { label: '12月', value: `${year}-12` },
    ]
    // 当前月份 0-11
    const currentMonth = moment().get('month');
    const list = [...monthsList.slice(0, currentMonth), { label: '本月', value: moment().format('YYYY-MM') }, { label: '实时', value: 'realTime' }].reverse();

    const pageSize = 4;
    // 总页数
    const pageCount = Math.max(Math.ceil(list.length / pageSize), 1);
    // 是否为第一页
    const isFirst = currentIndex === 0;
    // 是否为最后一页
    const isLast = currentIndex === (pageCount - 1);
    // 当前页的第一个元素
    const currentFirstIndex = currentIndex * pageSize;

    return (
      <div className={styles.switcherContainer}>
        {list.map(({ label, value }, index) => {
          if (index < currentFirstIndex || index >= currentFirstIndex + pageSize) {
            return null;
          }
          const isSelected = type === value;
          return (
            <Switcher
              style={{ top: (index - currentFirstIndex) * 56, zIndex: isSelected ? (pageSize + 1) : (pageSize + currentFirstIndex - index) }}
              isSelected={isSelected}
              content={label}
              key={index}
              onClick={() => { onSwitch(value); }} />
          );
        })}
        {pageCount > 1 && (
          <Pagination
            style={{ top: Math.min(pageSize, (list.length - currentFirstIndex) || 1) * 56, zIndex: 0 }}
            onNext={this.handleNext}
            onPrev={this.handlePrev}
            isFirst={isFirst}
            isLast={isLast} />
        )}
      </div>
    );
  }

  render() {
    const {
      zfjd = 0,
      qyzc = 0,
      wbjc = 0,
      cqwzg = 0,
      dfc = 0,
      dzg = 0,
      ygb = 0,
      type,
      handleClickChat,
    } = this.props;
    const legendInfo = type === 'realTime' ? [
      { label: '已超期', value: cqwzg, iconColor: '#D16772', status: 7 },
      { label: '待复查', value: dfc, iconColor: '#2787D5', status: 3 },
      { label: '未超期', value: dzg, iconColor: '#DEAD5C', status: 2 },
    ] : [
        { label: '已超期', value: cqwzg, iconColor: '#D16772', status: 7 },
        { label: '待复查', value: dfc, iconColor: '#2787D5', status: 3 },
        { label: '未超期', value: dzg, iconColor: '#DEAD5C', status: 2 },
        { label: '已关闭', value: ygb, iconColor: '#A9B2BE', status: 4 },
      ]
    const option = {
      /* legend: {
        selectedMode:false,
        orient: 'vertical',
        right: 10,
        top: '25%',
        padding: 5,
        zlevel: 0,
        itemGap: 15,
        formatter: name => `{label|${name}}${legendInfo[name]}`,
        textStyle: {
          color: 'white',
          rich: {
            label: {
              width: 70,
              textAlign: 'left',
            },
          },
        },
        data: [
          { name: '超期未整改', icon: 'circle' },
          { name: '待复查', icon: 'circle' },
          { name: '待整改', icon: 'circle'},
          { name: '已关闭', icon: 'circle'},
        ],
      }, */
      series: [
        {
          type: 'pie',
          center: ['50%', '50%'],
          radius: ['55%', '40%'],
          hoverOffset: 0,
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              color: '#fff',
              fontSize: 14,
              lineHeight: 20,
              align: 'center',
              formatter: ({ value, percent }) => `{a|数量${value}\n占比${percent}%}`,
              rich: {
                a: {
                  fontSize: 13,
                  color: 'white',
                },
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
          data: type === 'realTime' ? [
            { value: cqwzg, name: '已超期', itemStyle: { color: '#D16772' }, status: 7 },
            { value: dfc, name: '待复查', itemStyle: { color: '#2787D5' }, status: 3 },
            { value: dzg, name: '未超期', itemStyle: { color: '#DEAD5C' }, status: 2 },
          ] : [
              { value: cqwzg, name: '已超期', itemStyle: { color: '#D16772' }, status: 7 },
              { value: dfc, name: '待复查', itemStyle: { color: '#2787D5' }, status: 3 },
              { value: dzg, name: '未超期', itemStyle: { color: '#DEAD5C' }, status: 2 },
              { value: ygb, name: '已关闭', itemStyle: { color: '#A9B2BE' }, status: 4 },
            ],
        },
        {
          type: 'pie',
          center: ['50%', '50%'],
          radius: '30%',
          hoverOffset: 0,
          hoverAnimation: true,
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
            { value: wbjc, name: '维保检查', itemStyle: { color: '#00ABC9' }, source_type: 2 },
            { value: qyzc, name: '企业自查', itemStyle: { color: '#E86767' }, source_type: 3 },
            { value: zfjd, name: '政府监督', itemStyle: { color: '#2787D5' }, source_type: 4 },
          ],
        },
      ],
    };

    return (
      <Section title="隐患统计" fixedContent={(
        <Fragment>
          <div className={styles.hiddenDangerChartLegend}>
            {/* <div className={styles.hiddenDangerChartLegendLeft}>
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
            </div> */}
            <div className={styles.firstLine}>
              <div style={{ backgroundImage: `url(${triangleIcon})`, backgroundSize: '100%' }}></div>
              <div>隐患来源</div>
            </div>
            <div className={styles.content}>
              <div className={styles.item}>
                <div className={styles.iconContainer}>
                  <div className={styles.blueIcon}></div>
                </div>
                <div className={styles.text}>
                  <div><span>政府监督</span></div>
                  <div><span>{zfjd}</span></div>
                </div>
              </div>
              <div className={styles.item}>
                <div className={styles.iconContainer}>
                  <div className={styles.redIcon}></div>
                </div>
                <div className={styles.text}>
                  <div><span>企业自查</span></div>
                  <div><span>{qyzc}</span></div>
                </div>
              </div><div className={styles.item}>
                <div className={styles.iconContainer}>
                  <div className={styles.ligntBlueIcon}></div>
                </div>
                <div className={styles.text}>
                  <div><span>维保检查</span></div>
                  <div><span>{wbjc}</span></div>
                </div>
              </div>
            </div>
          </div>
          {this.renderSwitchers()}
        </Fragment>
      )}>
        <div className={styles.hiddenDangerChartContainer}>
          <Col span={16} style={{ height: '100%' }}>
            <ReactEcharts
              option={option}
              style={{ width: '100%', height: '100%' }}
              onChartReady={chart => {
                this.handleChartReady(chart, option);
              }}
            />
          </Col>
          <Col span={8} className={styles.legendContainer}>
            {legendInfo.map(({ label, value, iconColor, status }, i) => (
              <div key={i} className={styles.line} onClick={() => handleClickChat({ data: { status, name: label } })}>
                <div className={styles.icon} style={{ backgroundColor: iconColor }}></div>
                <div className={styles.label}>{label}</div>
                <div className={styles.value}>{value}</div>
              </div>
            ))}
          </Col>
          {/* <Col span={24} style={{ height: '100%' }}>
            <ReactEcharts
              option={option}
              style={{ width: '100%', height: '100%' }}
              onChartReady={chart => {
                this.handleChartReady(chart, option);
              }}
            />
            <div className={styles.legendContainer}>
              {legendInfo.map(({ label, value, iconColor, status }, i) => (
                <div key={i} className={styles.line} onClick={() => handleClickChat({ data: { status, name: label } })}>
                  <div className={styles.icon} style={{ backgroundColor: iconColor }}></div>
                  <div className={styles.label}>{label}</div>
                  <div className={styles.value}>{value}</div>
                </div>
              ))}
            </div>
          </Col> */}
        </div>
      </Section>
    );
  }
}
