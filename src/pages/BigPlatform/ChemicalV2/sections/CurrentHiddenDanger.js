import React, { PureComponent, Fragment } from 'react';
import { Col, Spin } from 'antd';
import moment from 'moment';
import DrawerContainer from '@/pages/BigPlatform/NewUnitFireControl/components/DrawerContainer';
import ImageCard from '@/components/ImageCard';
import HiddenDangerCard from '@/jingan-components/HiddenDangerCard'; // 隐患卡片
import LoadMore from '@/components/LoadMore';
import ReactEcharts from 'echarts-for-react';
import Lightbox from 'react-images';
import styles from './CurrentHiddenDanger.less';
import { DataList } from '../utils';

const FIELDNAMES = {
  status: 'status', // 隐患状态
  type: 'businessType', // 隐患类型
  id: 'id',
  description: 'description', // 隐患描述
  images: 'backgrounds', // 图片地址
  name: 'item_name', // 点位名称
  source: 'report_source', // 来源
  reportPerson: 'sbr', // 上报人
  reportTime: 'sbsj', // 上报时间
  planRectificationPerson: 'plan_zgr', // 计划整改人
  planRectificationTime: 'plan_zgsj', // 计划整改时间
  actualRectificationPerson: 'real_zgr', // 实际整改人
  actualRectificationTime: 'real_zgsj', // 实际整改时间
  designatedReviewPerson: 'fcr', // 指定复查人
};
const redColor = '#E96767'; // 红
const yellowColor = '#F6B54E'; // 黄
const blueColor = '#2A8BD5'; // 蓝

export default class CurrentHiddenDanger extends PureComponent {
  constructor(props) {
    super(props);
    // 隐患高亮索引
    // this.currentHiddenDangerIndex = -1;
    // echats定时器
    // this.hiddenDangerTimer = null;
    this.selectedDangerIndex = -1;
    // this.hoverIndex = -1;
    this.state = {
      hoverIndex: -1,
      images: [],
      currentImage: 0,
      lightBoxVisible: false,
    };
  }

  // componentWillUnmount() {
  //   clearInterval(this.hiddenDangerTimer);
  // }
  getSnapshotBeforeUpdate(preProps) {
    return preProps.visible !== this.props.visible;
  }
  componentDidUpdate(preProps, preState, snapshot) {
    if (snapshot) {
      this.selectedDangerIndex = -1;
      this.setState({ hoverIndex: -1 });
    }
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

  onMouseOver = ({ dataIndex }, chart) => {
    this.setState({ hoverIndex: dataIndex });
    if (this.selectedDangerIndex >= 0) {
      chart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: this.selectedDangerIndex,
      });
    }
    chart.dispatchAction({
      type: 'highlight',
      seriesIndex: 0,
      dataIndex: dataIndex,
    });
  };

  onMouseOut = ({ dataIndex }, chart) => {
    this.setState({ hoverIndex: -1 });
    chart.dispatchAction({
      type: 'downplay',
      seriesIndex: 0,
      dataIndex: dataIndex,
    });
    chart.dispatchAction({
      type: 'highlight',
      seriesIndex: 0,
      dataIndex: this.selectedDangerIndex,
    });
  };

  generateShow = (key, hoverIndex) =>
    (this.selectedDangerIndex === key && [-1, key].includes(hoverIndex)) || hoverIndex === key;

  /**
   * 显示图片详情
   */
  handleShow = images => {
    this.setState({ images, currentImage: 0, lightBoxVisible: true });
  };

  /**
   * 切换图片
   */
  handleSwitchImage = currentImage => {
    this.setState({
      currentImage,
    });
  };

  /**
   * 切换上一张图片
   */
  handlePrevImage = () => {
    this.setState(({ currentImage }) => ({
      currentImage: currentImage - 1,
    }));
  };

  /**
   * 切换下一张图片
   */
  handleNextImage = () => {
    this.setState(({ currentImage }) => ({
      currentImage: currentImage + 1,
    }));
  };

  /**
   * 关闭图片详情
   */
  handleClose = () => {
    this.setState({
      images: [],
      lightBoxVisible: false,
    });
  };

  // dataIndex从0开始
  onChartClick = ({ dataIndex }, chart) => {
    const { onClickChat } = this.props;
    // 如果点击已选中的区块，取消筛选
    if (this.selectedDangerIndex === dataIndex) {
      this.selectedDangerIndex = -1;
      onClickChat({ dataIndex: -1 });
      chart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex,
      });
    } else {
      this.selectedDangerIndex = dataIndex;
      onClickChat({ dataIndex }, () => {
        chart.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: dataIndex,
        });
      });
    }
  };

  render() {
    const {
      visible,
      onClose,
      onCardClick, // 点击小块查看详情
      ycq = 0,
      wcq = 0,
      dfc = 0,
      total = 0,
      list = [],
      hiddenDangerList: {
        pagination: { total: listTotal, pageNum, pageSize },
        list: dataList,
      },
      fetchHiddenDangerList,
      loading,
    } = this.props;

    const { hoverIndex, images, currentImage, lightBoxVisible } = this.state;
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
        left: 'center',
        top: '82%',
        itemGap: 20,
        itemWidth: 25,
        selectedMode: false, // 禁选
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
          radius: ['40%', '58%'],
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
            length: 10,
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
                show: this.generateShow(0, hoverIndex),
                lineStyle: { color: `${redColor}` },
              },
              label: {
                show: this.generateShow(0, hoverIndex),
                color: { color: `${redColor}` },
              },
            },
            {
              value: wcq,
              name: '未超期',
              itemStyle: { color: `${yellowColor}` },
              labelLine: {
                show: this.generateShow(1, hoverIndex),
                lineStyle: { color: `${yellowColor}` },
              },
              label: {
                show: this.generateShow(1, hoverIndex),
                color: { color: `${yellowColor}` },
              },
            },
            {
              value: dfc,
              name: '待复查',
              itemStyle: { color: `${blueColor}` },
              labelLine: {
                show: this.generateShow(2, hoverIndex),
                lineStyle: { color: `${blueColor}` },
              },
              label: {
                show: this.generateShow(2, hoverIndex),
                color: { color: `${blueColor}` },
              },
            },
          ],
        },
      ],
    };

    return (
      <Fragment>
        <DrawerContainer
          title="当前隐患"
          visible={visible}
          onClose={onClose}
          width={535}
          destroyOnClose={true}
          zIndex={1333}
          left={
            <div className={styles.currentHiddenDanger}>
              <div className={styles.chartContainer}>
                <ReactEcharts
                  style={{ width: '100%', height: '100%' }}
                  option={option}
                  onEvents={{
                    mouseover: this.onMouseOver,
                    mouseout: this.onMouseOut,
                    click: this.onChartClick,
                  }}
                />
                <div className={styles.total}>
                  <div className={styles.num}>{total}</div>
                  <div className={styles.label}>总数</div>
                </div>
              </div>
              <div className={styles.mainContainer}>
                <Spin spinning={loading} wrapperClassName={styles.spin}>
                  {/* <CompanyRisk hiddenDangerListByDate={list} /> */}
                  {dataList && dataList.length ? (
                    dataList.map(item => (
                      <HiddenDangerCard
                        className={styles.card}
                        key={item.id}
                        data={item}
                        fieldNames={FIELDNAMES}
                        onClickImage={this.handleShow}
                        // onClick={() => onCardClick(item)}
                      />
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', color: '#fff' }}>暂无隐患</div>
                  )}
                  {pageNum * pageSize < listTotal && (
                    <div className={styles.loadMoreWrapper}>
                      <LoadMore onClick={() => fetchHiddenDangerList(pageNum + 1)} />
                    </div>
                  )}
                </Spin>
                {/* {list.map((item, index) => {
                const {
                  desc,
                  report_user_name,
                  report_time,
                  rectify_user_name,
                  real_rectify_time,
                  plan_rectify_time,
                  report_source_name,
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
                              {isVague ? nameToVague(report_user_name) : report_user_name}
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
                                {isVague ? nameToVague(rectify_user_name) : rectify_user_name}
                                <span className={styles.text}>
                                  {moment(+real_rectify_time).format('YYYY-MM-DD')}
                                </span>
                              </Fragment>
                            ) : (
                                <Fragment>
                                  {isVague ? nameToVague(rectify_user_name) : rectify_user_name}
                                  <span className={+status === 7 ? styles.warningText : styles.text}>
                                    {moment(+plan_rectify_time).format('YYYY-MM-DD')}
                                  </span>
                                </Fragment>
                              ),
                        },
                        { label: '检查点位', value: <span>{item_name || '暂无数据'}</span> },
                        { label: '来源', value: <span>{report_source_name || '暂无数据'}</span> },
                      ]}
                      statusLogo={this.handleStatusPhoto(status)}
                      photo={hiddenDangerRecordDto[0].fileWebUrl.split(',')[0]}
                    />
                  </Col>
                );
              })} */}
              </div>
            </div>
          }
        />
        <Lightbox
          images={images.map(src => ({ src }))}
          isOpen={lightBoxVisible}
          closeButtonTitle="关闭"
          currentImage={currentImage}
          onClickPrev={this.handlePrevImage}
          onClickNext={this.handleNextImage}
          onClose={this.handleClose}
          onClickThumbnail={this.handleSwitchImage}
          showThumbnails
        />
      </Fragment>
    );
  }
}
