import React, { PureComponent, Fragment } from 'react';
import { Spin } from 'antd';
import classNames from 'classnames';
import { Scroll } from 'react-transform-components';
import CustomCarousel from '@/components/CustomCarousel';
import SectionDrawer from '../SectionDrawer';
import HiddenDanger from '../HiddenDanger';
import Inspection from '../Inspection';
import RiskCard from '../RiskCard';
// 暂无隐患图片
import defaultHiddenDanger from '@/assets/default_hidden_danger.png';
// 暂无巡查图片
import defaultInspection from '@/assets/default_inspection.png';
// 引入样式文件
import styles from './index.less';

// 默认state
const DEFAULT_STATE = {
  tabKey: 'hiddenDanger',
  subTabKey: undefined,
};

/**
 * 风险点详情抽屉
 */
export default class RiskPointDetailDrawer extends PureComponent {
  state = {
    ...DEFAULT_STATE,
  }

  componentDidUpdate({ visible: prevVisible }, { subTabKey: prevSubTabKey, tabKey: prevTabKey }) {
    const { visible } = this.props;
    const { subTabKey, tabKey } = this.state;
    if (!prevVisible && visible) {
      this.setState({ ...DEFAULT_STATE });
      this.carousel.goTo(0, true);
      this.hiddenDangerScroll && this.hiddenDangerScroll.scrollTop();
      this.inspectionScroll && this.inspectionScroll.scrollTop();
    }
    if (prevSubTabKey !== subTabKey || prevTabKey !== tabKey) {
      this.hiddenDangerScroll && this.hiddenDangerScroll.scrollTop();
      this.inspectionScroll && this.inspectionScroll.scrollTop();
    }
  }

  setCarouselReference = (carousel) => {
    this.carousel = carousel;
  }

  setHiddenDangerScrollReference = (scroll) => {
    this.hiddenDangerScroll = scroll && scroll.dom;
  }

  setInspectionScrollReference = (scroll) => {
    this.inspectionScroll = scroll && scroll.dom;
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
   * 隐患内容
   */
  renderHiddenDangerList() {
    const { loadingRiskPointHiddenDangerList, data: { hiddenDangerList=[], hiddenDangerCount: { total=0, overTimeRectify=0, review=0, rectify=0 } }={} } = this.props;
    const { subTabKey } = this.state;
    return (
      <Fragment>
        <div className={styles.subTabList}>
          <div
            className={classNames(styles.subTab, subTabKey===undefined?styles.activeSubTab:undefined)}
            onClick={() => {this.handleClickSubTab();}}
          >
            全部<span style={{ marginLeft: 8 }}>{total}</span>
          </div>
          <div
            className={classNames(styles.subTab, subTabKey===7?styles.activeSubTab:undefined)}
            onClick={() => {this.handleClickSubTab({ subTabKey: 7 });}}
          >
            已超期<span style={{ marginLeft: 8, color: '#f83329' }}>{overTimeRectify}</span>
          </div>
          <div
            className={classNames(styles.subTab, subTabKey===2?styles.activeSubTab:undefined)}
            onClick={() => {this.handleClickSubTab({ subTabKey: 2 });}}
          >
            未超期<span style={{ marginLeft: 8, color: '#ffb400' }}>{rectify}</span>
          </div>
          <div
            className={classNames(styles.subTab, subTabKey===3?styles.activeSubTab:undefined)}
            onClick={() => {this.handleClickSubTab({ subTabKey: 3 });}}
          >
            待复查<span style={{ marginLeft: 8, color: '#00a2f7' }}>{review}</span>
          </div>
        </div>
        <div className={styles.listContainer}>
          <Spin wrapperClassName={styles.spin} spinning={!!loadingRiskPointHiddenDangerList}>
            <div className={styles.list}>
              {hiddenDangerList.length > 0 ? (
                <Scroll ref={this.setHiddenDangerScrollReference} thumbStyle={{ backgroundColor: 'rgb(0, 87, 169)' }}>
                  <div className={styles.scrollContent}>
                    {hiddenDangerList.map(({
                      _id,
                      _report_user_name,
                      _report_time,
                      _rectify_user_name,
                      _plan_rectify_time,
                      _review_user_name,
                      business_type,
                      _desc,
                      path,
                      _real_rectify_time,
                      _review_time,
                      hiddenStatus,
                      report_source_name,
                    }) => (
                      <HiddenDanger
                        key={_id}
                        data={{
                          report_user_name: _report_user_name,
                          report_time: _report_time,
                          rectify_user_name: _rectify_user_name,
                          real_rectify_time: _real_rectify_time,
                          plan_rectify_time: _plan_rectify_time,
                          review_user_name: _review_user_name,
                          review_time: _review_time,
                          desc: _desc,
                          business_type,
                          status: hiddenStatus,
                          hiddenDangerRecordDto: [{ fileWebUrl: path }],
                          report_source_name,
                        }}
                      />
                    ))}
                  </div>
                </Scroll>
              ) : <div className={styles.defaultHiddenDanger} style={{ backgroundImage: `url(${defaultHiddenDanger})` }} />}
            </div>
          </Spin>
        </div>
      </Fragment>
    );
  }

  /**
   * 巡查内容
   */
  renderInspectionList() {
    const { loadingRiskPointInspectionList, data: { inspectionList=[], inspectionCount: { total=0, normal=0, abnormal=0 } }={} } = this.props;
    const { subTabKey } = this.state;
    return (
      <Fragment>
        <div className={styles.subTabList}>
          <div
            className={classNames(styles.subTab, subTabKey===undefined?styles.activeSubTab:undefined)}
            onClick={() => {this.handleClickSubTab();}}
          >
            全部<span style={{ marginLeft: 8 }}>{total}</span>
          </div>
          <div
            className={classNames(styles.subTab, subTabKey===1?styles.activeSubTab:undefined)}
            onClick={() => {this.handleClickSubTab({ subTabKey: 1 });}}
          >
            正常<span style={{ marginLeft: 8 }}>{normal}</span>
          </div>
          <div
            className={classNames(styles.subTab, subTabKey===2?styles.activeSubTab:undefined)}
            onClick={() => {this.handleClickSubTab({ subTabKey: 2 });}}
          >
            异常<span style={{ marginLeft: 8, color: '#f83329' }}>{abnormal}</span>
          </div>
        </div>
        <div className={styles.listContainer}>
          <Spin wrapperClassName={styles.spin} spinning={!!loadingRiskPointInspectionList}>
            <div className={styles.list}>
              {inspectionList.length > 0 ? (
                <Scroll ref={this.setInspectionScrollReference} thumbStyle={{ backgroundColor: 'rgb(0, 87, 169)' }}>
                  <div className={styles.scrollContent}>
                    {inspectionList.map((data) => (
                      <Inspection
                        key={data.check_id}
                        data={data}
                      />
                    ))}
                  </div>
                </Scroll>
              ) : <div className={styles.defaultHiddenDanger} style={{ backgroundImage: `url(${defaultInspection})` }} />}
            </div>
          </Spin>
        </div>
      </Fragment>
    );
  }

  render() {
    const {
      // 抽屉是否可见
      visible,
      // 抽屉关闭事件
      onClose,
      // 数据
      data: {
        cardList = [],
      }={},
    } = this.props;
    const { tabKey } = this.state;

    return (
      <SectionDrawer
        drawerProps={{
          title: '风险点详情',
          visible,
          onClose: () => {onClose('riskPointDetail');},
        }}
        sectionProps={{
          contentStyle: { paddingBottom: 16 },
        }}
      >
        <div className={styles.container}>
          <div className={styles.titleWrapper}>
            <div className={styles.title}>基本信息</div>
          </div>
          <div className={styles.carouselContainer}>
            {cardList.length > 0 ? (
              <CustomCarousel
                carouselProps={{
                  ref: this.setCarouselReference,
                  className: styles.carousel,
                  arrows: true,
                  arrowsAutoHide: true,
                }}
              >
                {cardList.map(item => (
                  <RiskCard
                    key={item.id}
                    data={item}
                  />
                ))}
              </CustomCarousel>
            ) : <div style={{ textAlign: 'center' }}>暂无信息</div>}
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
          {tabKey==='hiddenDanger' && this.renderHiddenDangerList()}
          {tabKey==='inspection' && this.renderInspectionList()}
        </div>
      </SectionDrawer>
    );
  }
}
