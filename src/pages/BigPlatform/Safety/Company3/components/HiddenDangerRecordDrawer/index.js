import React, { Component } from 'react';
import CustomDrawer from '@/jingan-components/CustomDrawer';
import HiddenDangerCard from '@/jingan-components/HiddenDangerCard';
import ImagePreview from '@/jingan-components/ImagePreview';
import styles from './index.less';

const FIELDNAMES = {
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
  actualRectificationPerson: 'real_rectify_user_name', // 实际整改人
  actualRectificationTime: 'real_rectify_time', // 实际整改时间
  designatedReviewPerson: 'review_user_name', // 指定复查人
};

/**
 * 隐患记录抽屉
 */
export default class HiddenDangerRecordDrawer extends Component {
  state = {
    images: null,
  }

  componentDidUpdate({ visible: prevVisible }) {
    const { visible } = this.props;
    if (!prevVisible && visible) {
      this.scroll && this.scroll.scrollTop();
    }
  }

  setScrollReference = (scroll) => {
    this.scroll = scroll && scroll.dom || scroll;
  }

  /**
   * 显示图片详情
   */
  handleShow = (images) => {
    this.setState({ images: images.map(src => src) });
  }

  handleClick = () => {
    window.open('/#/control-measures-follow-up/hidden-danger-report/list');
  }

  render() {
    const {
      visible,
      loading,
      onClose,
      list,
    } = this.props;
    const { images } = this.state;

    return (
      <CustomDrawer
        title="隐患记录"
        visible={visible}
        onClose={onClose}
        sectionProps={{
          scrollProps: { ref: this.setScrollReference, className: styles.scroll },
          spinProps: { loading },
        }}
      >
        <div className={styles.list}>
          {list && list.length > 0 ? list.map((item) => (
            <HiddenDangerCard
              className={styles.item}
              key={item.id}
              data={item}
              fieldNames={FIELDNAMES}
              onClickImage={this.handleShow}
            />
          )) : (
            <div className={styles.empty} />
          )}
          <div className={styles.bottom}>
            <div>查看更多隐患记录</div>
            <div onClick={this.handleClick}>隐患报表>></div>
          </div>
        </div>
        <ImagePreview
          images={images}
        />
      </CustomDrawer>
    );
  }
}
