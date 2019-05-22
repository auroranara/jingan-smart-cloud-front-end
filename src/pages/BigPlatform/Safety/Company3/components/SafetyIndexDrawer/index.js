import React, { PureComponent, Fragment } from 'react';
import { Row, Col, Tooltip } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';
import Lightbox from 'react-images';
import PointCard from '@/components/PointCard';
import HiddenDangerCard from '@/components/HiddenDangerCard';
import DeviceCard from '@/components/DeviceCard';
import FileCard from '@/components/FileCard';
import LoadMore from '@/components/LoadMore'; // 加载更多按钮
import SectionDrawer from '../SectionDrawer';
import Section from '../Section';
// 引入样式文件
import styles from './index.less';

// 构成
const COMPOSITION_LABELS = ['安全巡查', '隐患排查', '动态监测', '安全档案'];
const COMPOSITION_LABEL_STYLES = [
  { left: '-6em', top: '50%', marginLeft: -1, transform: 'translateY(-50%)' },
  { top: '-3em', left: '50%', marginTop: -1, transform: 'translateX(-50%)' },
  { bottom: '-3em', left: '50%', marginBottom: -1, transform: 'translateX(-50%)' },
  { top: '50%', right: '-6em', marginRight: -1, transform: 'translateY(-50%)' },
];
const COMPOSITION_ICON_STYLES = [
  { left: 0, top: '50%', marginLeft: -1, transform: 'translate(-50%, -50%)', backgroundColor: '#5586f4' },
  { top: 0, left: '50%', marginTop: -1, transform: 'translate(-50%, -50%)', backgroundColor: '#ff4848' },
  { bottom: 0, left: '50%', marginBottom: -1, transform: 'translate(-50%, 50%)', backgroundColor: '#f4b955' },
  { top: '50%', right: 0, marginRight: -1, transform: 'translate(50%, -50%)', backgroundColor: '#02fcfa' },
];
// 柱状图边界线样式
const lineStyle = { color: 'rgb(64, 95, 135)' };
// 获取偏移天数
const getOffsetDays = ({ nextCheckDate }) => {
  return nextCheckDate ? Math.abs(moment().diff(moment(+nextCheckDate), 'days')) : '';
};
// 默认每页显示数量
const DEFAULT_PAGE_SIZE = 10;

/**
 * 安全指数抽屉
 */
@connect(({ unitSafety, loading }) => ({
  unitSafety,
  loading: loading.models.unitSafety,
}))
export default class SafetyIndexDrawer extends PureComponent {
  state = {
    currentTabIndex: 0,
    images: null,
    currentImage: 0,
  };

  componentDidUpdate({ visible: prevVisible }, { currentTabIndex: lastTabIndex }) {
    const { visible } = this.props;
    const { currentTabIndex } = this.state;
    if (!prevVisible && visible) {
      this.leftScroll && this.leftScroll.dom.scrollTop();
      this.setState({ currentTabIndex: 0 });
    } else if (lastTabIndex !== currentTabIndex) {
      this.rightScroll && this.rightScroll.dom.scrollTop();
    }
  }

  refLeftScroll = scroll => {
    this.leftScroll = scroll;
  }

  refRightScroll = scroll => {
    this.rightScroll = scroll;
  }

  /**
   * 获取隐患列表
   */
  getHiddenDangerList = restProps => {
    const {
      companyId,
      dispatch,
    } = this.props;
    dispatch({
      type: 'unitSafety/fetchDangerList',
      payload: {
        pageNum: 1,
        pageSize: DEFAULT_PAGE_SIZE,
        status: 5,
        company_id: companyId,
        ...restProps,
      },
    });
  };

  /**
   * 获取安全档案
   */
  getFiles = () => {
    const {
      companyId,
      dispatch,
    } = this.props;
    dispatch({
      type: 'unitSafety/fetchSafeFiles',
      payload: {
        companyId,
      },
    });
  }

  /**
   * 获取动态监测
   */
  getMonitor() {
    const {
      companyId,
      dispatch,
    } = this.props;
    dispatch({
      type: 'unitSafety/fetchMonitorList',
      payload: {
        companyId,
      },
    });
  }

  /**
   * 点击tab
   */
  handleTabClick = (e) => {
    const { currentTabIndex: lastTabIndex } = this.state;
    const currentTabIndex = +e.target.getAttribute('data-index');
    if (lastTabIndex === currentTabIndex) {
      return;
    }
    if (currentTabIndex === 0) {
      // 由于安全巡查数据已经有了，所以不需要重新获取
    } else if (currentTabIndex === 1) {
      this.getHiddenDangerList();
    } else if (currentTabIndex === 2) {
      this.getMonitor();
    } else if (currentTabIndex === 3) {
      this.getFiles();
    }
    this.setState({ currentTabIndex });
  }

  /**
   * 加载更多隐患
   */
  handleLoadMoreHiddenDangers = () => {
    const {
      unitSafety: {
        dangerList: {
          pagination: {
            pageNum=1,
          }={},
        }={},
      },
    }= this.props;
    this.getHiddenDangerList({ pageNum: pageNum + 1 });
  }

  /**
   * 关闭图片详情
   */
  handleClose = () => {
    this.setState({
      images: null,
    });
  };

  /**
   * 显示图片详情
   */
  handleShowImageDetail = (images) => {
    this.setState({ images, currentImage: 0 });
  }

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
   * 图片详情
   */
  renderImageDetail() {
    const { images, currentImage } = this.state;
    return images && images.length > 0 && images[0] && (
      <Lightbox
        images={images.map((src) => ({ src }))}
        isOpen={true}
        closeButtonTitle="关闭"
        currentImage={currentImage}
        onClickPrev={this.handlePrevImage}
        onClickNext={this.handleNextImage}
        onClose={this.handleClose}
        onClickThumbnail={this.handleSwitchImage}
        showThumbnails
      />
    );
  }

  /**
   * 构成
   */
  renderComposition() {
    const {
      unitSafety: {
        safetyIndex,
      },
    } = this.props;
    const backgroundColor = safetyIndex >= 80 ? '#00a8ff' : '#ff4848';
    return (
      <div>
        <div className={styles.leftTitle}>构成</div>
        <div className={styles.compositionContainer}>
          <div className={styles.compositionWrapper}>
            <div className={styles.safetyIndex} style={{ backgroundColor }}><span>{safetyIndex}</span></div>
            {[...Array(4)].map((_, i) => (
              <Fragment key={COMPOSITION_LABELS[i]}>
                <div className={styles.compositionLabel} style={COMPOSITION_LABEL_STYLES[i]}>
                  {COMPOSITION_LABELS[i]}
                </div>
                <div className={styles.compositionIcon} style={COMPOSITION_ICON_STYLES[i]} />
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /**
   * 分值
   */
  renderScore() {
    const {
      unitSafety: {
        safetyIndexes=[],
      },
    } = this.props;
    const seriesData = COMPOSITION_LABELS.map((label, i) => ({ name: label, value: safetyIndexes[i] || 0, itemStyle: { color: COMPOSITION_ICON_STYLES[i].backgroundColor } }))
    const option = {
      textStyle: { color: '#fff' },
      grid: { left: 10, right: 10, top: 10, bottom: 10, containLabel: true },
      tooltip: { show: true },
      xAxis: {
        type: 'category',
        data: COMPOSITION_LABELS,
        axisLine: { lineStyle },
        // axisLabel: {
        //   rotate: -35,
        // },
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 100,
        axisLine: { lineStyle },
        splitLine: { lineStyle },
        // 小数标签不显示
        axisLabel: {
          formatter: function(value) {
            if (Number.parseInt(value, 10) !== value) return '';
            return Number.parseInt(value, 10);
          },
        },
      },
      series: [
        {
          type: 'bar',
          barWidth: 24,
          data: seriesData,
        },
      ],
    };
    return (
      <div>
        <div className={styles.leftTitle}>分值</div>
        <div className={styles.scoreContainer}>
          <ReactEcharts
            option={option}
            // style={{ height: 400 }}
          />
        </div>
      </div>
    );
  }

  /**
   * 标签
   */
  renderTabs() {
    const { currentTabIndex } = this.state;
    return (
      <div className={styles.tabList}>
        {COMPOSITION_LABELS.map((label, index) => (
          <div key={label} data-index={index} className={styles.tab} style={{ backgroundColor: currentTabIndex === index && 'rgb(5, 71, 149)' }} onClick={this.handleTabClick}>
            {label}
          </div>
        ))}
      </div>
    );
  }

  /**
   * 统计信息
   */
  renderCount() {
    const {
      unitSafety: {
        points: {
          abnormalPointList=[],
        }={},
        hiddenDangerCount: {
          total=0,
          ycq=0,
        }={},
        monitorList: {
          alarm=[],
          loss=[],
        }={},
        safeList=[],
      },
    } = this.props;
    const { currentTabIndex } = this.state;
    let count;
    switch(currentTabIndex) {
      case 0:
      count = `共有${abnormalPointList.length}个点位超时未查`;
      break;
      case 1:
      count = `共有${total}个隐患，其中${ycq}个已超期`;
      break;
      case 2:
      count = `共有${alarm.length}个报警设备，${loss.length}个失联设备`;
      break;
      case 3:
      count = `共有${safeList.length}个过期信息`;
      break;
      default:
      break;
    }
    return <div className={styles.count}>{count}</div>;
  }

  /**
   * 列表
   */
  renderList() {
    const {
      unitSafety: {
        points: {
          abnormalPointList=[],
        }={},
        dangerList: {
          list: hiddenDangerList=[],
          pagination: {
            pageNum: hiddenDangerPageNum=1,
            pageSize: hiddenDangerPageSize=DEFAULT_PAGE_SIZE,
            total: hiddenDangerTotal=0,
          }={},
        }={},
        monitorList: {
          alarm=[],
          loss=[],
        }={},
        safeList,
      },
    } = this.props;
    const { currentTabIndex } = this.state;
    let Item, list=[], fieldNames, key, action, restProps;
    switch(currentTabIndex) {
      case 0: // 注意排序
      Item = PointCard;
      key = 'item_id';
      list = abnormalPointList;
      fieldNames = {
        level: 'risk_level', // 风险等级
        name: 'object_title', // 点位名称
        lastCheckPerson: 'last_check_user_name', // 上次巡查人员
        lastCheckTime: 'last_check_date', // 上次巡查时间
        nextCheckTime: 'nextCheckDate', // 下次巡查时间
        extendedDays: getOffsetDays, // 超期天数
        expiryDays: getOffsetDays, // 距到期天数
        status: 'status', // 检查状态
        cycle: ({ checkCycleCode, check_cycle, cycle_type }) => +cycle_type === 1 ? checkCycleCode : check_cycle, // 检查周期
        type: 'item_type', // 点位类型
      };
      break;
      case 1: // 隐患有实时性问题需要考虑
      Item = HiddenDangerCard;
      key = 'id';
      list = hiddenDangerList;
      fieldNames = {
        status: 'status', // 隐患状态
        type: 'business_type', // 隐患类型
        description: 'desc', // 隐患描述
        images(item) {
          let { hiddenDangerRecordDto: [{ fileWebUrl }={}]=[] } = item;
          fileWebUrl = (fileWebUrl || '').split(',');
          return fileWebUrl;
        }, // 图片地址
        name: 'item_name', // 点位名称
        source: 'report_source', // 来源
        reportPerson: 'report_user_name', // 上报人
        reportTime: 'report_time', // 上报时间
        planRectificationPerson: 'rectify_user_name', // 计划整改人
        planRectificationTime: 'plan_rectify_time', // 计划整改时间
        actualRectificationPerson: 'rectify_user_name', // 实际整改人
        actualRectificationTime: 'real_rectify_time', // 实际整改时间
        designatedReviewPerson: 'review_user_name', // 指定复查人
      };
      action = (
        <Fragment>
          {hiddenDangerPageNum * hiddenDangerPageSize < hiddenDangerTotal && (
            <div className={styles.loadMoreWrapper}>
              <Tooltip placement="top" title="加载更多">
                <LoadMore onClick={this.handleLoadMoreHiddenDangers} />
              </Tooltip>
            </div>
          )}
          {this.renderImageDetail()}
        </Fragment>
      );
      restProps = { onClickImage: this.handleShowImageDetail };
      break;
      case 2:
      Item = DeviceCard;
      key = 'id';
      list = alarm.concat(loss);
      break;
      case 3:
      Item = FileCard;
      key = 'id';
      list = safeList;
      break;
      default:
      break;
    }
    return list && list.length > 0 ? (
      <div className={styles.list}>
        {list.map(data => <Item className={styles.item} key={data[key]} data={data} fieldNames={fieldNames} {...restProps} />)}
        {action}
      </div>
    ) : (
      <div className={styles.defaultBackground} />
    );
  }

  render() {
    let {
      // 抽屉是否可见
      visible,
      loading,
      // 抽屉关闭事件
      onClose,
    } = this.props;
    return (
      <SectionDrawer
        drawerProps={{
          title: '安全指数',
          visible,
          onClose,
          width: '1024',
          placement: 'left',
        }}
      >
        <Row className={styles.container}>
          <Col className={styles.left} span={12}>
            <Section
              className={styles.section}
              refScroll={this.refLeftScroll}
            >
              <div className={styles.content}>
                {this.renderComposition()}
                {this.renderScore()}
              </div>
            </Section>
          </Col>
          <Col className={styles.right} span={12}>
            <Section
              className={styles.section}
              refScroll={this.refRightScroll}
              fixedContent={<div className={styles.rightHeader}>{this.renderTabs()}{this.renderCount()}</div>}
              scrollProps={{ className: styles.scrollContainer }}
              spinProps={{ loading }}
            >
              <div className={styles.content}>
                {this.renderList()}
              </div>
            </Section>
          </Col>
        </Row>
      </SectionDrawer>
    );
  }
}
