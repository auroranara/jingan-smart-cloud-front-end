import React, { PureComponent } from 'react';
import { Select, Tooltip } from 'antd';
import classNames from 'classnames';
import Lightbox from 'react-images';
import HiddenDangerCard from '@/components/HiddenDangerCard'; // 隐患卡片
import LoadMore from '@/components/LoadMore'; // 加载更多按钮
import Section from '../Section'; // 滚动条容器
import defaultHiddenDanger from '@/assets/default_hidden_danger.png';
import { hiddenDangerCheckStatus as dict } from '@/utils/dict';
// 引入样式文件
import styles from './index.less';
import selectStyles from '../../select.less';
const { Option } = Select;
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
  actualRectificationPerson: 'rectify_user_name', // 实际整改人
  actualRectificationTime: 'real_rectify_time', // 实际整改时间
  designatedReviewPerson: 'review_user_name', // 指定复查人
};

/**
 * description: 当前隐患
 */
export default class CurrentHiddenDanger extends PureComponent {
  state = {
    // 当前选中的状态
    selectedStatus: '全部',
    // 当前显示的图片
    images: null,
    currentImage: 0,
  }

  refScroll = (scroll) => {
    this.scroll = scroll;
  }

  /**
   * 下拉框选择事件
   */
  handleSelect = (selectedStatus) => {
    const { onClick } = this.props;
    // 触发点击事件
    onClick({ status: dict[selectedStatus] });
    // 修改下拉框选中项
    this.setState({
      selectedStatus,
    });
    // 移到最顶部
    this.scroll.dom.scrollTop();
  }

  /**
   * 加载更多
   */
  handleLoadMore = () => {
    const { onClick, data: { pagination: { pageNum=1 }={} }={} } = this.props;
    const { selectedStatus } = this.state;
    onClick({ pageNum: pageNum + 1, status: dict[selectedStatus] });
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

  /**
   * 下拉框
   */
  renderSelect() {
    const {
      count: { total=0, ycq=0, wcq=0, dfc=0 }={},
    } = this.props;
    const { selectedStatus } = this.state;
    const list = [
      {
        key: '全部',
        value: `全部 ${total}`,
      },
      {
        key: '已超期',
        value: `已超期 ${ycq}`,
      },
      {
        key: '未超期',
        value: `未超期 ${wcq}`,
      },
      {
        key: '待复查',
        value: `待复查 ${dfc}`,
      },
    ];
    return total > 0 ? (
      <Select
        value={selectedStatus}
        onSelect={this.handleSelect}
        className={classNames(selectStyles.select, styles.select)}
        dropdownClassName={selectStyles.dropdown}
      >
        {list.map(({ key, value }) => (
          <Option
            key={key}
            value={key}
          >
            {value}
          </Option>
        ))}
      </Select>
    ) : null;
  }

  render() {
    const {
      data: {
        list=[],
        pagination: {
          total=0,
          pageNum=0,
          pageSize=0,
        }={},
      }={},
      loading,
    } = this.props;

    return (
      <Section
        refScroll={this.refScroll}
        title="当前隐患"
        action={this.renderSelect()}
        className={styles.sectionContainer}
        contentClassName={styles.sectionContent}
        spinProps={{ loading }}
      >
        <div className={styles.container}>
          {list.length > 0 ? list.map(item => (
            <HiddenDangerCard
              className={styles.card}
              key={item.id}
              data={item}
              fieldNames={FIELDNAMES}
              onClickImage={this.handleShow}
            />
          )) : <div className={styles.empty} style={{ backgroundImage: `url(${defaultHiddenDanger})` }} />}
          {pageNum * pageSize < total && (
            <div className={styles.loadMoreWrapper}>
              <Tooltip placement="top" title="加载更多">
                <LoadMore onClick={this.handleLoadMore} />
              </Tooltip>
            </div>
          )}
          {this.renderImageDetail()}
        </div>
      </Section>
    );
  }
}
