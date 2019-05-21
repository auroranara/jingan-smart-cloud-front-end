import React, { PureComponent, Fragment } from 'react';
import { Empty } from 'antd';
import { connect } from 'dva';
import Lightbox from 'react-images';
import CustomCarousel from '@/components/CustomCarousel';
import HiddenDangerCard from '@/components/HiddenDangerCard'; // 隐患卡片
import SectionDrawer from '../SectionDrawer';
import RiskCard from '../RiskCard';
// 暂无隐患图片
import defaultHiddenDanger from '@/assets/default_hidden_danger.png';
// 暂无卡片
import defaultCard from '@/assets/default_risk_point.png';
// 引入样式文件
import styles from './index.less';

// 隐患字段
const HIDDEN_DANGER_FIELDNAMES = {
  status: 'hiddenStatus', // 隐患状态
  type: 'business_type', // 隐患类型
  description: '_desc', // 隐患描述
  images(item) {
    let { path } = item;
    path = (path || '').split(',');
    return path;
  }, // 图片地址
  name: 'object_title', // 点位名称
  source: 'report_source', // 来源
  reportPerson: '_report_user_name', // 上报人
  reportTime: '_report_time', // 上报时间
  planRectificationPerson: '_rectify_user_name', // 计划整改人
  planRectificationTime: '_plan_rectify_time', // 计划整改时间
  actualRectificationPerson: '_rectify_user_name', // 实际整改人
  actualRectificationTime: '_real_rectify_time', // 实际整改时间
  designatedReviewPerson: '_review_user_name', // 指定复查人
};

/**
 * 巡查点位详情抽屉
 */
@connect(({ unitSafety, loading }) => ({
  unitSafety,
  loading: loading.models.unitSafety,
}))
export default class InspectionDetailDrawer extends PureComponent {
  state = {
    images: null,
    currentImage: 0,
  };

  componentDidUpdate({ visible: prevVisible }) {
    const { visible } = this.props;
    if (!prevVisible && visible) {
      this.carousel && this.carousel.goTo(0, true);
      this.scroll && this.scroll.scrollTop();
    }
  }

  setCarouselReference = (carousel) => {
    this.carousel = carousel;
  }

  setScrollReference = (scroll) => {
    this.scroll = scroll && scroll.dom;
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
        inspectionPointData: {
          data=[],
          hiddenData=[],
        }={},
      },
      loading,
    } = this.props;
    return (
      <SectionDrawer
        drawerProps={{
          title: '巡查点位详情',
          visible,
          onClose,
        }}
        sectionProps={{
          refScroll: this.setScrollReference,
          scrollProps: { className: styles.scrollContainer },
          spinProps: { loading },
          fixedContent: (
            <Fragment>
              <div className={styles.titleWrapper}>
                <div className={styles.title}>基本信息</div>
              </div>
              <div className={styles.carouselContainer}>
                {data.length > 0 ? (
                  <CustomCarousel
                    carouselProps={{
                      ref: this.setCarouselReference,
                      arrows: true,
                      arrowsAutoHide: true,
                    }}
                  >
                    {data.map(item => (
                      <RiskCard
                        key={item.id || item.item_id}
                        data={item}
                      />
                    ))}
                  </CustomCarousel>
                ) : (
                  <Empty
                    image={defaultCard}
                  />
                )}
              </div>
              <div className={styles.titleWrapper}>
                <div className={styles.title}>隐患详情（{hiddenData.length}）</div>
              </div>
            </Fragment>
          ),
        }}
      >
        <div className={styles.container}>
          {hiddenData.length > 0 ? hiddenData.map(item => (
            <HiddenDangerCard
              className={styles.card}
              key={item._id}
              data={item}
              fieldNames={HIDDEN_DANGER_FIELDNAMES}
              onClickImage={this.handleShow}
            />
          )) : <div className={styles.defaultHiddenDanger} style={{ backgroundImage: `url(${defaultHiddenDanger})` }} />}
          {this.renderImageDetail()}
        </div>
      </SectionDrawer>
    );
  }
}
