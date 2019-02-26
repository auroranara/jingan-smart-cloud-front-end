import React, { PureComponent } from 'react';
import { Scroll } from 'react-transform-components';
import CustomCarousel from '@/components/CustomCarousel';
import SectionDrawer from '../SectionDrawer';
import HiddenDanger from '../HiddenDanger';
import RiskCard from '../RiskCard';
// 暂无隐患图片
import defaultHiddenDanger from '@/assets/default_hidden_danger.png';
// 引入样式文件
import styles from './index.less';

/**
 * 巡查点位详情抽屉
 */
export default class InspectionDetailDrawer extends PureComponent {
  componentDidUpdate({ visible: prevVisible }) {
    const { visible } = this.props;
    if (!prevVisible && visible) {
      this.carousel.goTo(0, true);
      this.scroll && this.scroll.scrollTop();
    }
  }

  setCarouselReference = (carousel) => {
    this.carousel = carousel;
  }

  setScrollReference = (scroll) => {
    this.scroll = scroll && scroll.dom;
  }

  render() {
    const {
      // 抽屉是否可见
      visible,
      // 抽屉关闭事件
      onClose,
      // 数据
      data: {
        data=[],
        hiddenData=[],
      }={},
    } = this.props;
    return (
      <SectionDrawer
        drawerProps={{
          title: '巡查点位详情',
          visible,
          onClose: () => {onClose('inspectionDetail');},
        }}
        sectionProps={{
          contentStyle: { paddingBottom: 16 },
          // scrollProps: { className: styles.scrollContainer },
        }}
      >
        <div className={styles.container}>
          <div className={styles.titleWrapper}>
            <div className={styles.title}>基本信息</div>
          </div>
          <div className={styles.carouselContainer}>
            {data.length > 0 ? (
              <CustomCarousel
                carouselProps={{
                  ref: this.setCarouselReference,
                  className: styles.carousel,
                  arrows: true,
                  arrowsAutoHide: true,
                }}
              >
                {data.map(item => (
                  <RiskCard
                    key={item.id}
                    data={item}
                  />
                ))}
              </CustomCarousel>
            ) : <div style={{ textAlign: 'center' }}>暂无信息</div>}
          </div>
          <div className={styles.titleWrapper}>
            <div className={styles.title}>隐患详情 ({hiddenData.length})</div>
          </div>
          <div className={styles.listContainer}>
            <div className={styles.list}>
              {hiddenData.length > 0 ? (
                <Scroll ref={this.setScrollReference} thumbStyle={{ backgroundColor: 'rgb(0, 87, 169)' }}>
                  <div className={styles.scrollContent}>
                    {hiddenData.map(({
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
          </div>
        </div>
      </SectionDrawer>
    );
  }
}
