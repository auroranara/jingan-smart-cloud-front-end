import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import { connect } from 'dva';
import Lightbox from 'react-images';
import CustomCarousel from '@/components/CustomCarousel';
import HiddenDangerCard from '@/jingan-components/HiddenDangerCard';
// 引入样式文件
import styles from './index.less';

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
  designatedReviewPerson: ({ _review_user_name, real_review_user_name, status }) => +status !== 4 ? _review_user_name : real_review_user_name, // 指定复查人
  reviewTime: '_review_time', // 复查时间
};

/**
 * 巡查结果
 */
@connect(({ unitSafety }) => ({
  unitSafety,
}))
export default class InspectionResult extends PureComponent {
  state = {
    images: null,
    currentImage: 0,
    showClose: false,
  }

  onMouseEnter = () => {
    this.setState({ showClose: true });
  }

  onMouseLeave = () => {
    this.setState({ showClose: false });
  }

  /**
   * 关闭本身
   */
  handleCloseSelf = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'unitSafety/save',
      payload: {
        inspectionRecordData: {},
      },
    });
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
      unitSafety: {
        inspectionRecordData: {
          hiddenData=[],
        }={},
      },
    } = this.props;
    const { showClose } = this.state;
    const closeStyle = { opacity: +showClose };
    return hiddenData && hiddenData.length > 0 && (
      <div className={styles.container} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
        <CustomCarousel
          carouselProps={{
            arrows: true,
            arrowsAutoHide: true,
            closable: true,
          }}
        >
          {hiddenData.map(item => (
            <div className={styles.hack} key={item._id}>
              <HiddenDangerCard
                key={item._id}
                data={item}
                fieldNames={HIDDEN_DANGER_FIELDNAMES}
                onClickImage={this.handleShow}
              />
            </div>
          ))}
        </CustomCarousel>
        <div className={styles.closeButton} style={closeStyle} onClick={this.handleCloseSelf}><Icon type="close" /></div>
        {this.renderImageDetail()}
      </div>
    );
  }
}
