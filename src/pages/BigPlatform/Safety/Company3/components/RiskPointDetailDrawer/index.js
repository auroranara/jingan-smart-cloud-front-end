import React, { PureComponent, Fragment } from 'react';
import { Empty, Tooltip } from 'antd';
import { connect } from 'dva';
import classNames from 'classnames';
import Lightbox from 'react-images';
import CustomCarousel from '@/components/CustomCarousel';
import HiddenDangerCard from '@/jingan-components/HiddenDangerCard'; // 隐患卡片
import InspectionCard from '@/jingan-components/InspectionCard'; // 巡查卡片
import LoadMore from '@/components/LoadMore'; // 加载更多按钮
import SectionDrawer from '../SectionDrawer';
import RiskCard from '../RiskCard';
// 暂无隐患图片
import defaultHiddenDanger from '@/assets/default_hidden_danger.png';
// 暂无巡查图片
import defaultInspection from '@/assets/default_inspection.png';
// 暂无卡片
import defaultCard from '@/assets/default_risk_point.png';
// 引入样式文件
import styles from './index.less';

// 默认state
const DEFAULT_STATE = {
  tabKey: 'hiddenDanger',
  subTabKey: undefined,
};
// 隐患字段
const HIDDEN_DANGER_FIELDNAMES = {
  status: 'hiddenStatus', // 隐患状态
  type: 'business_type', // 隐患类型
  description: '_desc', // 隐患描述
  images: 'paths', // 图片地址
  name: 'object_title', // 点位名称
  source: 'report_source', // 来源
  reportPerson: '_report_user_name', // 上报人
  reportTime: '_report_time', // 上报时间
  planRectificationPerson: '_rectify_user_name', // 计划整改人
  planRectificationTime: '_plan_rectify_time', // 计划整改时间
  actualRectificationPerson: 'real_rectify_user_name', // 实际整改人
  actualRectificationTime: '_real_rectify_time', // 实际整改时间
  designatedReviewPerson: '_review_user_name', // 指定复查人
};
// 巡查字段
const INSPECTION_FIELDNAMES = {
  date: 'check_date', // 巡查日期
  source: 'report_source', // 巡查来源
  person: 'check_user_names', // 巡查人
  status: 'status', // 巡查结果
  result({
    data: {
      overTimeId=[],
      rectifyId=[],
      reviewId=[],
      finishId=[],
    }={},
  }) {
    return [overTimeId.length, rectifyId.length, reviewId.length, finishId.length];
  }, // 处理结果
};

/**
 * 风险点详情抽屉
 */
@connect(({ unitSafety, loading }) => ({
  unitSafety,
  loading1: loading.effects['unitSafety/fetchRiskPointHiddenDangerList'],
  loading2: loading.effects['unitSafety/fetchRiskPointInspectionList'],
  loading3: loading.effects['unitSafety/fetchRiskPointHiddenDangerCount'],
  loading4: loading.effects['unitSafety/fetchRiskPointInspectionCount'],
}))
export default class RiskPointDetailDrawer extends PureComponent {
  state = {
    ...DEFAULT_STATE,
    images: null,
    currentImage: 0,
  }

  componentDidUpdate({ visible: prevVisible }, { subTabKey: prevSubTabKey, tabKey: prevTabKey }) {
    const { visible } = this.props;
    const { subTabKey, tabKey } = this.state;
    if (!prevVisible && visible) {
      this.setState({ ...DEFAULT_STATE });
      this.carousel && this.carousel.goTo(0, true);
      this.scroll && this.scroll.scrollTop();
    } else if (prevSubTabKey !== subTabKey || prevTabKey !== tabKey) {
      this.scroll && this.scroll.scrollTop();
    }
  }

  setCarouselReference = (carousel) => {
    this.carousel = carousel;
  }

  setScrollReference = (scroll) => {
    this.scroll = scroll && scroll.dom || scroll;
  }

  /**
   * 点击标签
   */
  handleClickTab = (tabKey) => {
    const { tabKey: prevTabKey } = this.state;
    if (prevTabKey !== tabKey) {
      this.setState({ tabKey });
      this.handleClickSubTab({ tabKey, flag: true });
      if (tabKey === 'hiddenDanger') {
        const { getRiskPointHiddenDangerCount } = this.props;
        getRiskPointHiddenDangerCount();
      }
      else if (tabKey === 'inspection') {
        const { getRiskPointInspectionCount } = this.props;
        getRiskPointInspectionCount();
      }
    }
  }

  /**
   * 点击子标签
   */
  handleClickSubTab = ({ tabKey = this.state.tabKey, subTabKey, flag }={}) => {
    const { subTabKey: prevSubTabKey } = this.state;
    if (prevSubTabKey !== subTabKey || flag) {
      this.setState({ subTabKey });
      if (tabKey === 'hiddenDanger') {
        const { getRiskPointHiddenDangerList } = this.props;
        getRiskPointHiddenDangerList({ status: subTabKey });
      }
      else if (tabKey === 'inspection') {
        const { getRiskPointInspectionList } = this.props;
        getRiskPointInspectionList({ checkStatus: subTabKey });
      }
    }
  }

  /**
   * 加载更多
   */
  handleLoadMore = () => {
    const { tabKey, subTabKey } = this.state;
    if (tabKey === 'hiddenDanger') {
      const { getRiskPointHiddenDangerList, unitSafety: { riskPointDetail: { hiddenDangerList: { pagination: { pageNum=1 }={} } } } } = this.props;
      getRiskPointHiddenDangerList({ status: subTabKey, pageNum: pageNum + 1 });
    }
    else if (tabKey === 'inspection') {
      const { getRiskPointInspectionList, unitSafety: { riskPointDetail: { inspectionList: { pagination: { pageNum=1 }={} } } } } = this.props;
      getRiskPointInspectionList({ checkStatus: subTabKey, pageNum: pageNum + 1 });
    }
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
  handleShow = (images) => {
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

  render() {
    const {
      // 抽屉是否可见
      visible,
      // 抽屉关闭事件
      onClose,
      // 数据
      unitSafety: {
        riskPointDetail: {
          cardList = [],
          hiddenDangerList: {
            list: hiddenDangerList=[],
            pagination: hiddenDangerPagination={},
          }={},
          hiddenDangerCount: {
            total: hiddenDangerTotal=0,
            overTimeRectify=0,
            review=0,
            rectify=0,
          },
          inspectionList: {
            list: inspectionList=[],
            pagination: inspectionPagination={},
          }={},
          inspectionCount: {
            total: inspectionTotal=0,
            normal=0,
            abnormal=0,
          },
        }={},
      },
      loading1,
      loading2,
      loading3,
      loading4,
    } = this.props;
    const { tabKey, subTabKey } = this.state;
    let subTabs, Item, list, fieldNames, key, restProps, backgroundImage, pageSize, pageNum, total;
    if (tabKey === 'hiddenDanger') { // 隐患
      subTabs = [
        {
          label: '全部',
          value: hiddenDangerTotal,
          onClick: () => this.handleClickSubTab(),
          className: classNames(styles.subTab, subTabKey===undefined?styles.activeSubTab:undefined),
          valueStyle: { marginLeft: '0.5em' },
        },
        {
          label: '已超期',
          value: overTimeRectify,
          onClick: () => this.handleClickSubTab({ subTabKey: 7 }),
          className: classNames(styles.subTab, subTabKey===7?styles.activeSubTab:undefined),
          valueStyle: { marginLeft: '0.5em', color: '#f83329' },
        },
        {
          label: '未超期',
          value: rectify,
          onClick: () => this.handleClickSubTab({ subTabKey: 2 }),
          className: classNames(styles.subTab, subTabKey===2?styles.activeSubTab:undefined),
          valueStyle: { marginLeft: '0.5em', color: '#ffb400' },
        },
        {
          label: '待复查',
          value: review,
          onClick: () => this.handleClickSubTab({ subTabKey: 3 }),
          className: classNames(styles.subTab, subTabKey===3?styles.activeSubTab:undefined),
          valueStyle: { marginLeft: '0.5em', color: '#00a2f7' },
        },
      ];
      Item = HiddenDangerCard;
      list = hiddenDangerList;
      fieldNames = HIDDEN_DANGER_FIELDNAMES;
      key = '_id';
      restProps = { onClickImage: this.handleShow };
      backgroundImage = defaultHiddenDanger;
      ({pageSize, pageNum, total} = hiddenDangerPagination);
    } else { // 巡查
      subTabs = [
        {
          label: '全部',
          value: inspectionTotal,
          onClick: () => this.handleClickSubTab(),
          className: classNames(styles.subTab, subTabKey===undefined?styles.activeSubTab:undefined),
          valueStyle: { marginLeft: '0.5em' },
        },
        {
          label: '正常',
          value: normal,
          onClick: () => this.handleClickSubTab({ subTabKey: 1 }),
          className: classNames(styles.subTab, subTabKey===1?styles.activeSubTab:undefined),
          valueStyle: { marginLeft: '0.5em' },
        },
        {
          label: '异常',
          value: abnormal,
          onClick: () => this.handleClickSubTab({ subTabKey: 2 }),
          className: classNames(styles.subTab, subTabKey===2?styles.activeSubTab:undefined),
          valueStyle: { marginLeft: '0.5em', color: '#f83329' },
        },
      ];
      Item = InspectionCard;
      list = inspectionList;
      fieldNames = INSPECTION_FIELDNAMES;
      key = 'check_id';
      backgroundImage = defaultInspection;
      ({pageSize, pageNum, total} = inspectionPagination);
    }

    return (
      <SectionDrawer
        drawerProps={{
          title: '风险点详情',
          visible,
          onClose,
        }}
        sectionProps={{
          refScroll: this.setScrollReference,
          scrollProps: { className: styles.scrollContainer },
          spinProps: { loading: loading1 || loading2 || loading3 || loading4 || false },
          fixedContent: (
            <Fragment>
              <div className={styles.titleWrapper}>
                <div className={styles.title}>基本信息</div>
              </div>
              <div className={styles.carouselContainer}>
                {cardList.length > 0 ? (
                  <CustomCarousel
                    carouselProps={{
                      ref: this.setCarouselReference,
                      arrows: true,
                      arrowsAutoHide: true,
                    }}
                  >
                    {cardList.map(item => (
                      <RiskCard
                        key={item.id || item.item_id}
                        data={item}
                      />
                    ))}
                  </CustomCarousel>
                ) : (
                  <Empty
                    image={defaultCard}
                    // imageStyle={{
                    //   height: 60,
                    // }}
                  />
                )}
              </div>
              <div className={styles.tabList}>
                <div
                  className={classNames(styles.tab, tabKey==='hiddenDanger'?styles.activeTab:undefined)}
                  onClick={() => {this.handleClickTab('hiddenDanger');}}
                >
                  <div className={styles.tabTitle}>隐患详情</div>
                </div>
                <div
                  className={classNames(styles.tab, tabKey==='inspection'?styles.activeTab:undefined)}
                  onClick={() => {this.handleClickTab('inspection');}}
                >
                  <div className={styles.tabTitle}>巡查详情</div>
                </div>
              </div>
              <div className={styles.subTabList}>
                {subTabs.map(({ className, onClick, valueStyle, label, value }) => (
                  <div
                    key={label}
                    className={className}
                    onClick={onClick}
                  >
                    {label}<span style={valueStyle}>{value}</span>
                  </div>
                ))}
              </div>
            </Fragment>
          ),
        }}
      >
        <div className={styles.container}>
          {list.length > 0 ? list.map(item => (
            <Item
              className={styles.card}
              key={item[key]}
              data={item}
              fieldNames={fieldNames}
              {...restProps}
            />
          )) : <div className={styles.defaultHiddenDanger} style={{ backgroundImage: `url(${backgroundImage})` }} />}
          {pageNum * pageSize < total && (
            <div className={styles.loadMoreWrapper}>
              <Tooltip placement="top" title="加载更多">
                <LoadMore onClick={this.handleLoadMore} />
              </Tooltip>
            </div>
          )}
          {this.renderImageDetail()}
        </div>
      </SectionDrawer>
    );
  }
}
