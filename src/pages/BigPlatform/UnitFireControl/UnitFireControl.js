import React, { PureComponent, Fragment } from 'react';
import { Row, Col, Icon } from 'antd';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import Header from './components/Header/Header';
import Section from './components/Section/Section';
import Ellipsis from '../../../components/Ellipsis';

import styles from './UnitFireControl.less';

const prefix = 'http://data.jingan-china.cn/v2/big-platform/fire-control/com/';
const fireIcon = `${prefix}fire_hj.png`;
const faultIcon = `${prefix}fire_gz.png`;
const positionBlueIcon = `${prefix}fire_position_blue.png`;
const positionRedIcon = `${prefix}fire_position_red.png`;
const triangleIcon = `${prefix}triangle.png`;
const dfcIcon = `${prefix}fire_dfc.png`;
const wcqIcon = `${prefix}fire_wcq.png`;
const ycqIcon = `${prefix}fire_ycq.png`;
const splitIcon = `${prefix}split.png`;
const splitHIcon = `${prefix}split_h.png`;
/* 待处理信息项 */
const PendingInfoItem = ({ id, isFire, time, position, pointName, monitor }) => {
  return (
    <div key={id} className={styles.pendingInfoItem} style={{ color: isFire?'#FF6464':'#00ADFF' }}>
      <div style={{ backgroundImage: `url(${isFire?fireIcon:faultIcon})` }}>{isFire?'火警':'故障'}<div className={styles.pendingInfoItemTime}>{time}</div></div>
      <div>{pointName}</div>
      <div>{monitor}</div>
      <div style={{ backgroundImage: `url(${isFire?positionRedIcon:positionBlueIcon})` }}>{position}</div>
    </div>
  );
};

/**
 * 隐患巡查记录项
 */
const HiddenDangerRecord = ({ id, status, image, description, sbr, sbsj, zgr, zgsj, fcr }) => {
  const { badge, icon, color } = getIconByStatus(status);
  return (
    <div className={styles.hiddenDangerRecord} key={id}>
      <div className={styles.hiddenDangerRecordBadge} style={{ backgroundImage: `url(${badge})` }}></div>
      <div>
        <div style={{ position: 'relative', width: '100%' }}>
          <img src={image} alt="暂无图片" style={{ display: 'block', width: '100%' }} />
          <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(0, 168, 255, 0.3)' }} />
        </div>
      </div>
      <div>
        <div style={{ backgroundImage: `url(${icon})`, color }}><Ellipsis lines={2} tooltip>{description}</Ellipsis></div>
        <div><span>上报：</span><Ellipsis lines={1}><span style={{ marginRight: '16px' }}>{sbr}</span>{sbsj}</Ellipsis></div>
        <div><span>整改：</span><Ellipsis lines={1}><span style={{ marginRight: '16px' }}>{zgr}</span><span style={{ color: '#FF6464' }}>{zgsj}</span></Ellipsis></div>
        <div><span>复查：</span><Ellipsis lines={1}><span>{fcr}</span></Ellipsis></div>
      </div>
    </div>
  );
}

/**
 * 切换开关
 */
const Switcher = ({ content, style={}, color, onClick }) => {
  return (
    <div className={styles.switcher} style={{ backgroundColor: color, ...style }} onClick={onClick}>
      <div style={{ borderRightColor: color }}></div>
      <div style={{ borderRightColor: color }}></div>
      {content}
    </div>
  );
}

/**
 * 分页按钮
 */
const Pagination = ({ isFirst, isLast, style={}, onNext, onPrev }) => {
  return (
    <div className={styles.switcher} style={{ cursor: 'auto',  ...style }}>
      <div></div>
      <Icon
        type="caret-up"
        style={{
          fontSize: 12,
          color: isFirst ? '#00438a' : '#FFF',
          cursor: isFirst ? 'not-allowed' : 'pointer',
        }}
        onClick={() => {
          !isFirst && onPrev();
        }}
      />
      <Icon
        type="caret-down"
        style={{
          fontSize: 12,
          color: isLast ? '#00438a' : '#FFF',
          cursor: isLast ? 'not-allowed' : 'pointer',
        }}
        onClick={() => {
          !isLast && onNext();
        }}
      />
    </div>
  );
}

/**
 * 根据status获取对应的标记
 */
const getIconByStatus = (status) => {
  switch(status) {
    case 1:
    return {
      color: '#00ADFF',
      badge: dfcIcon,
      icon: 'http://data.jingan-china.cn/v2/big-platform/safety/com/description_blue.png',
    };
    case 2:
    return {
      color: '#00ADFF',
      badge: wcqIcon,
      icon: 'http://data.jingan-china.cn/v2/big-platform/safety/com/description_blue.png',
    };
    default:
    return {
      color: '#FF6464',
      badge: ycqIcon,
      icon: 'http://data.jingan-china.cn/v2/big-platform/safety/com/description_red.png',
    };
  };
}

/**
 * 单位消防大屏
 */
export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // 当前选中的日期
      currentSelectedDate: '今日',
      // 当前选中的月份
      currentSeelctedMonth: '本月',
      // 当前隐患巡查月份按钮所在页数
      currentIndex: 0,
    };
    // 当前高亮的图标索引
    this.currentFireControlIndex = -1;
    // 消防图表定时器
    this.fireControlTimer = null;
    // 隐患高亮索引
    this.currentHiddenDangerIndex = -1;
    // 隐患定时器
    this.hiddenDangerTimer = null;
  }

  /**
   * 挂载后声明周期函数
   */
  componentDidMount() {
    const { match: { params: { unitId } } } = this.props;
  }

  /**
   * 消防数据统计图标加载完成事件
   */
  handleFireControlPieChartReady = (chart, option) => {
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
   * 隐患巡查统计图表加载完毕
   */
  handleHiddenDangerChartReady = (chart, option) => {
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
   * 消防数据统计模块开关点击事件
   */
  handleClickFireControlSwitcher = (content) => {
    this.setState({
      currentSelectedDate: content,
    });
  }

  /**
   * 隐患巡查统计模块开关点击事件
   */
  handleClickHiddenDangerSwitcher = (content) => {
    this.setState({
      currentSeelctedMonth: content,
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

  /**
   * 消防数据统计模块开关
   */
  renderFireControlCountSectionSwitcher() {
    const { currentSelectedDate } = this.state;

    return (
      <div className={styles.fireControlPieChartSwitcherContainer}>
        {['今日', '本周', '本月', '本年'].map((item, index) => {
          return <Switcher style={{ right: 0, top: index*56, zIndex: currentSelectedDate===item?5:(4-index) }} color={currentSelectedDate===item?'#0967D3':'#173867'} content={item} key={item} onClick={() => {this.handleClickFireControlSwitcher(item);}} />;
        })}
      </div>
    );
  }

  /**
   * 隐患巡查统计模块开关
   */
  renderHiddenDangerSwitcher() {
    const { currentSeelctedMonth, currentIndex } = this.state;
    const months = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
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
      <div className={styles.fireControlPieChartSwitcherContainer}>
        {list.map((item, index) => {
          if (index < currentFirstIndex || index >= currentFirstIndex+pageSize) {
            return null;
          }
          return (
            <Switcher style={{ right: 0, top: (index-currentFirstIndex)*56, zIndex: currentSeelctedMonth===item?(pageSize+1):(pageSize+currentFirstIndex-index) }} color={currentSeelctedMonth===item?'#0967D3':'#173867'} content={item} key={item} onClick={() => {this.handleClickHiddenDangerSwitcher(item);}} />
          );
        })}
        <Pagination style={{ right: 0, top: Math.min(pageSize, currentMonth+1-currentFirstIndex)*56, zIndex: 0 }} onNext={this.handleNext} onPrev={this.handlePrev} isFirst={isFirst} isLast={isLast} />
      </div>
    );
  }

  /**
   * 渲染所有统计信息块
   */
  renderAllCountSection() {
    const one = 0;
    const two = 0;
    const three = 0;
    const four = 0;
    const five = 0;
    const six = 0;

    return (
      <Section>
        <div className={styles.countContainer}>
          <Row className={styles.countContainerRow}>
            <Col span={8} className={styles.countContainerColumn}>
              <div className={styles.countValue} style={{ color: '#FF6464' }}>{one}</div>
              <div className={styles.countName}>待处理火警</div>
            </Col>
            <Col span={8} className={styles.countContainerColumn}>
              <div className={styles.countValue}>{two}</div>
              <div className={styles.countName}>待处理故障</div>
            </Col>
            <Col span={8} className={styles.countContainerColumn}>
              <div className={styles.countValue}>{three}</div>
              <div className={styles.countName}>超期未整改隐患</div>
            </Col>
          </Row>
          <Row className={styles.countContainerRow}>
          <Col span={8} className={styles.countContainerColumn}>
              <div className={styles.countValue}>{four}</div>
              <div className={styles.countName}>待整改隐患</div>
            </Col>
            <Col span={8} className={styles.countContainerColumn}>
              <div className={styles.countValue}>{five}</div>
              <div className={styles.countName}>待维保任务</div>
            </Col>
            <Col span={8} className={styles.countContainerColumn}>
              <div className={styles.countValue}>{six}</div>
              <div className={styles.countName}>待巡查任务</div>
            </Col>
          </Row>
          <div className={styles.firstVerticalLine}><img src={splitIcon} alt=""/></div>
          <div className={styles.secondVerticalLine}><img src={splitIcon} alt=""/></div>
          <div className={styles.horizontalLine}><img src={splitHIcon} alt=""/></div>
        </div>
      </Section>
    );
  }

  /**
   * 渲染消防数据统计块
   */
  renderFireControlCountSection() {
    const real = 0;
    const misinformation = 1;
    const pending = 0;
    const fire = real+misinformation+pending;
    const fault = 2;
    const shield = 3;
    const linkage = 4;
    const supervise = 5;
    const feedback = 6;

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
          {this.renderFireControlCountSectionSwitcher()}
        </Fragment>
      )}>
        <div className={styles.fireControlPieChartContainer}>
          <ReactEcharts
            option={option}
            style={{ height: '100%' }}
            onChartReady={chart => {
              this.handleFireControlPieChartReady(chart, option);
            }}
          />
        </div>
      </Section>
    );
  }

  /**
   * 隐患巡查统计模块
   */
  renderHiddenDangerCountSection() {
    const ssp = 1;
    const fxd = 2;
    const cqwzg = 3;
    const dfc = 4;
    const dzg = 5;
    const ygb = 6;

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
          {this.renderHiddenDangerSwitcher()}
        </Fragment>
      )}>
        <div className={styles.hiddenDangerChartContainer}>
          <ReactEcharts
            option={option}
            style={{ height: '100%' }}
            onChartReady={chart => {
              this.handleHiddenDangerChartReady(chart, option);
            }}
          />
        </div>
      </Section>
    );
  }

  /**
   * 渲染函数
   */
  render() {
    // 从props中获取单位名称
    // const {  } = this.props;

    // 临时的单位名称，对接接口以后替换为真实数据
    const tempUnitName = "无锡晶安智慧科技有限公司";

    return (
      <div className={styles.main}>
        <Header title="晶安智慧消防云平台" extraContent={tempUnitName} />
        <div className={styles.mainBody}>
          <Row gutter={16} style={{ marginBottom: 16, height: 'calc(48.92% - 16px)' }}>
            <Col span={6} style={{ height: '100%' }}>
              <Section isScroll isCarousel>
                {[...Array(10).keys()].map((item) => (
                  <PendingInfoItem key={item} id={item} isFire time={'2018-08-24'} position={'风险点位置'} pointName={'风险点名称'} monitor={'监控信息'} />
                ))}
              </Section>
            </Col>
            <Col span={12} style={{ height: '100%' }}>
              {this.renderAllCountSection()}
            </Col>
            <Col span={6} style={{ height: '100%' }}>
              <Section />
            </Col>
          </Row>
          <Row gutter={16} style={{ height: '51.08%' }}>
            <Col span={6} style={{ height: '100%' }}>
              <Section isScroll isCarousel title="隐患巡查记录">
                {[...Array(10).keys()].map((item) => (
                  <HiddenDangerRecord
                    key={item}
                    id={item}
                    status={1}
                    image=""
                    description="提示信息"
                    sbr="陆华"
                    sbsj="2018-07-03"
                    zgr="陆华"
                    zgsj="2018-07-03"
                    fcr="陆华"
                  />
                ))}
              </Section>
            </Col>
            <Col span={6} style={{ height: '100%' }}>
              {this.renderFireControlCountSection()}
            </Col>
            <Col span={6} style={{ height: '100%' }}>
              {this.renderHiddenDangerCountSection()}
            </Col>
            <Col span={6} style={{ height: '100%' }}>
              <Section />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
