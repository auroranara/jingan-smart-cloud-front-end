import React, { PureComponent, Fragment } from 'react';
import { Col } from 'antd';
import moment from 'moment';
import DrawerContainer from '../components/DrawerContainer';
import ImageCard from '@/components/ImageCard';
import ReactEcharts from 'echarts-for-react';
import styles from './CurrentHiddenDanger.less';

const redColor = '#E96767'; // 红
const yellowColor = '#F6B54E'; // 黄
const blueColor = '#2A8BD5'; // 蓝

export default class CurrentHiddenDanger extends PureComponent {
  constructor(props) {
    super(props);
    // 隐患高亮索引
    this.currentHiddenDangerIndex = -1;
    // echats定时器
    this.hiddenDangerTimer = null;
  }

  componentWillUnmount() {
    clearInterval(this.hiddenDangerTimer);
  }

  handleStatusPhoto = status => {
    //2未超期   3待复查, 7  已超期
    switch (+status) {
      case 2:
        return 'http://data.jingan-china.cn/v2/big-platform/safety/com/wcq.png';
      case 3:
        return 'http://data.jingan-china.cn/v2/big-platform/safety/com/dfc.png';
      case 7:
        return 'http://data.jingan-china.cn/v2/big-platform/safety/com/ycq.png';
      default:
        return '';
    }
  };

  handleChartReady = (chart, option) => {
    const { onClickChat } = this.props;
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
    // 绑定click事件
    chart.on('click', onClickChat);
  };

  render() {
    const {
      visible,
      onClose,
      onCardClick, // 点击小块查看详情
      overRectifyNum: ycq,
      rectifyNum: wcq,
      reviewNum: dfc,
      totalNum: total,
      list = [],
    } = this.props;
    const legendInfo = {
      已超期: ycq,
      未超期: wcq,
      待复查: dfc,
    };
    const option = {
      tooltip: {
        show: false,
      },
      legend: {
        left: '18%',
        top: '82%',
        itemGap: 20,
        itemWidth: 25,
        selectedMode: false,// 禁选
        formatter: name => `${name} ${legendInfo[name]}`,
        data: [
          { name: '已超期', icon: 'circle' },
          { name: '未超期', icon: 'circle' },
          { name: '待复查', icon: 'circle' },
        ],
        textStyle: {
          fontSize: 14,
          color: 'white',
        },
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          hoverOffset: 5,
          center: ['50%', '41%'],
          radius: ['40%', '60%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            color: '#fff',
            align: 'left',
            formatter: params => `{label|${params.name}}\n{value|${params.value}}`,
            emphasis: {
              show: true,
            },
            rich: {
              label: {
                fontSize: 14,
                lineHeigt: 25,
              },
              value: {
                color: 'white',
                fontSize: 25,
                lineHeight: 40,
              },
            },
          },
          labelLine: {
            length: 30,
            lineStyle: {
              color: '#fff',
            },
          },
          data: [
            {
              value: ycq,
              name: '已超期',
              itemStyle: { color: `${redColor}` },
              labelLine: {
                lineStyle: { color: `${redColor}` },
              },
              label: {
                color: { color: `${redColor}` },
              },
            },
            {
              value: wcq,
              name: '未超期',
              itemStyle: { color: `${yellowColor}` },
              labelLine: {
                lineStyle: { color: `${yellowColor}` },
              },
              label: {
                color: { color: `${yellowColor}` },
              },
            },
            {
              value: dfc,
              name: '待复查',
              itemStyle: { color: `${blueColor}` },
              labelLine: {
                lineStyle: { color: `${blueColor}` },
              },
              label: {
                color: { color: `${blueColor}` },
              },
            },
          ],
        },
      ],
    };
    return (
      <DrawerContainer
        title="当前隐患"
        visible={visible}
        onClose={onClose}
        width={470}
        destroyOnClose={true}
        left={
          <div className={styles.currentHiddenDanger}>
            <div className={styles.chartContainer}>
              <ReactEcharts
                style={{ width: '100%', height: '100%' }}
                option={option}
                onChartReady={chart => {
                  this.handleChartReady(chart, option);
                }}
              />
              <div className={styles.total}>
                <div className={styles.num}>{total}</div>
                <div className={styles.label}>总数</div>
              </div>
            </div>
            <div className={styles.mainContainer}>
              {list.map((item, index) => {
                const {
                  desc,
                  report_user_name,
                  report_time,
                  rectify_user_name,
                  real_rectify_time,
                  plan_rectify_time,
                  item_name,
                  status,
                  hiddenDangerRecordDto,
                } = item;
                return (
                  <Col key={index} style={{ padding: '5px 0' }} span={24}>
                    <ImageCard
                      showRightIcon={true}
                      showStatusLogo={true}
                      isCardClick={true}
                      onCardClick={() => onCardClick(item)}
                      contentList={[
                        { label: '隐患描述', value: desc || '暂无数据' },
                        {
                          label: '上报',
                          value: (
                            <Fragment>
                              {report_user_name}
                              <span className={styles.text}>
                                {moment(+report_time).format('YYYY-MM-DD')}
                              </span>
                            </Fragment>
                          ),
                        },
                        {
                          label: +status === 3 ? '实际整改' : '计划整改',
                          value:
                            +status === 3 ? (
                              <Fragment>
                                {rectify_user_name}
                                <span className={styles.text}>
                                  {moment(+real_rectify_time).format('YYYY-MM-DD')}
                                </span>
                              </Fragment>
                            ) : (
                                <Fragment>
                                  {rectify_user_name}
                                  <span className={+status === 7 ? styles.warningText : styles.text}>
                                    {moment(+plan_rectify_time).format('YYYY-MM-DD')}
                                  </span>
                                </Fragment>
                              ),
                        },
                        { label: '检查点', value: <span>{item_name || '暂无数据'}</span> },
                      ]}
                      statusLogo={this.handleStatusPhoto(status)}
                      photo={hiddenDangerRecordDto[0].fileWebUrl.split(',')[0]}
                    />
                  </Col>
                );
              })}
            </div>
          </div>
        }
      />
    );
  }
}
