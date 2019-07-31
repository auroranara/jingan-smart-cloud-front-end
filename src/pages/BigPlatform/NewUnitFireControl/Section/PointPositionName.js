import React, { PureComponent, Fragment } from 'react';
import { Col } from 'antd';
// import Ellipsis from '@/components/Ellipsis';
import moment from 'moment';
// import LoadMore from '@/components/LoadMore';
import Lightbox from 'react-images';
import styles from './PointPositionName.less';
import HiddenDangerCard from '@/jingan-components/HiddenDangerCard';
import DrawerContainer from '../components/DrawerContainer';
import CheckedCard from '../components/CheckedCard';
import NoData from '../components/NoData';

import hasDanger from '../imgs/icon-hasDanger.png';
import noDanger from '../imgs/icon-noDanger.png';
import checkingImg from '../imgs/icon-checking.png';
import checkedImg from '../imgs/icon-checked.png';

const FIELDNAMES = {
  status: 'status', // 隐患状态
  type: 'business_type', // 隐患类型
  id: 'id',
  description: 'desc', // 隐患描述
  images: 'backgrounds', // 图片地址
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

const TABS = ['当前隐患', '巡查记录'];

const STATUS = ['已检查', '已检查', '待检查', '已超期'];

const getOffsetDays = ({ nextCheckDate }) => {
  return nextCheckDate
    ? Math.abs(
        moment()
          .startOf('day')
          .diff(moment(+nextCheckDate), 'days')
      )
    : '';
};

export default class PointPositionName extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hoverIndex: -1,
      images: [],
      currentImage: 0,
      lightBoxVisible: false,
      tabActive: 0,
    };
  }

  handleStatusPhoto = status => {
    //2待整改   3待复查, 7  超期未整改
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

  handleCloseDrawer = () => {
    const { onClose } = this.props;
    setTimeout(() => {
      this.setState({ tabActive: 0 });
    }, 200);
    onClose();
  };

  handleTabClick = index => {
    document.getElementById('checkScroll').scrollTop = 0;
    this.setState({ tabActive: index });
  };

  renderTabs = (numbers = []) => {
    const { tabActive } = this.state;
    return TABS.map((item, index) => (
      <div
        key={index}
        className={tabActive === index ? styles.active : styles.tab}
        onClick={() => this.handleTabClick(index)}
      >
        {item}({numbers[index] || 0})
      </div>
    ));
  };

  renderHiddenDanger = () => {
    const {
      currentHiddenDanger: { list = [] },
      checkItemId,
      handlePointDangerDetail,
    } = this.props;
    const dangerList = list.filter(item => item.item_id === checkItemId);
    const cards = dangerList.map((item, index) => {
      const { hiddenDangerRecordDto = [{ fileWebUrl: '' }] } = item;
      const newItem = {
        ...item,
        backgrounds: hiddenDangerRecordDto[0].fileWebUrl.split(','),
      };
      return (
        <HiddenDangerCard
          className={styles.card}
          key={item.id}
          data={newItem}
          fieldNames={FIELDNAMES}
          onClickImage={this.handleShow}
          onClick={() => handlePointDangerDetail(item)}
        />
      );
    });
    const overTime = dangerList.filter(item => +item.status === 7).length;
    const rectify = dangerList.filter(item => +item.status === 2).length;
    const review = dangerList.filter(item => +item.status === 3).length;
    const danger = [
      { name: '已超时', value: overTime },
      { name: '未超时', value: rectify },
      { name: '待复查', value: review },
    ];
    return dangerList.length > 0 ? (
      <Fragment>
        <div className={styles.tip}>
          共有
          {dangerList.length}
          条隐患，其中
          {danger
            .map(item => {
              const { name, value } = item;
              return value ? `${name}${value}条` : null;
            })
            .filter(item => !!item)
            .join('、')}
        </div>
        <div className={styles.cards}>
          <div className={styles.cardsMain}>{cards}</div>
        </div>
      </Fragment>
    ) : (
      <NoData />
    );
  };

  renderChecks = () => {
    const { pointRecordLists, checkAbnormal, count, handleCheckDangerDetail } = this.props;
    return pointRecordLists.length > 0 ? (
      <Fragment>
        <div className={styles.tip}>
          共巡查
          {count}
          次，其中异常
          {checkAbnormal}次
        </div>
        <div className={styles.cards}>
          {pointRecordLists.map(item => (
            <CheckedCard
              key={item.check_id}
              className={styles.card}
              data={item}
              fieldNames={{
                id: 'check_id', // 主键
                checkDate: 'check_date', // 巡查日期
                source: 'report_source', // 巡查来源
                checkusers: 'check_user_names', // 巡查人员
                status: 'status', // 巡查状态
                overTimeId: ({ data: { overTimeId } }) => overTimeId, // 已超时
                rectifyId: ({ data: { rectifyId } }) => rectifyId, // 未超时
                reviewId: ({ data: { reviewId } }) => reviewId, // 待复查
                finishId: ({ data: { finishId } }) => finishId, // 已关闭
                hiddenDangerClick: () => handleCheckDangerDetail, // 点击隐患数量
              }}
            />
          ))}
        </div>
      </Fragment>
    ) : (
      <NoData />
    );
  };

  render() {
    const {
      visible,
      pointRecordLists,
      checkAbnormal,
      count,
      checkStatus,
      currentHiddenDanger: { list = [] },
      checkItemId,
      checkPointName,
      points: { pointList = [] } = {},
      onClose,
      ...restProps
    } = this.props;
    const { images, currentImage, lightBoxVisible, tabActive } = this.state;

    const dangerList = list.filter(item => item.item_id === checkItemId);

    const dangerImg = dangerList.length > 0 ? hasDanger : noDanger;

    const pointInfo = pointList.find(item => item.item_id === checkItemId) || {};

    const pointStatus = pointInfo.status;

    const left = (
      <div className={styles.container}>
        <div className={styles.circleContainer}>
          <Col span={12}>
            <div
              className={styles.icon}
              style={{
                backgroundImage: `url(${dangerImg})`,
                borderColor: dangerList.length > 0 ? '#F83329' : '#0ff',
              }}
            >
              {dangerList.length > 0 ? (
                <div className={styles.abnormal}>有隐患</div>
              ) : (
                <div className={styles.normal}>无隐患</div>
              )}
            </div>
          </Col>
          <Col span={12}>
            <div
              className={styles.icon}
              style={{
                backgroundImage:
                  +pointStatus === 4
                    ? 'none'
                    : `url(${+pointStatus === 3 ? checkingImg : checkedImg})`,
                borderColor: +pointStatus === 4 ? '#F83329' : '#0ff',
              }}
            >
              {+pointStatus === 4 && (
                <div className={styles.overTime}>
                  <span style={{ fontSize: '30px' }}>{getOffsetDays(pointInfo)}</span>天
                </div>
              )}
              <div className={+pointStatus === 4 ? styles.abnormal : styles.normal}>
                {STATUS[pointStatus - 1]}
              </div>
            </div>
          </Col>
        </div>

        <div className={styles.tabsWrapper}>{this.renderTabs([dangerList.length, count])}</div>

        <div className={styles.scrollWrapper} id={'checkScroll'}>
          {tabActive === 0 ? this.renderHiddenDanger() : this.renderChecks()}
        </div>

        {/* <div className={styles.recordTitle}>
          <p className={styles.titleP}>
            巡查记录
            <span className={styles.titleSpan}>
              (共
              {count}
              次，异常
              {checkAbnormal}
              次)
            </span>
          </p>
        </div>
        <div className={styles.record}>
          <div className={styles.recordTable}>
            <Table rowKey="check_id" columns={columns} dataSource={pointRecordLists} pageSize="5" />
          </div>
        </div> */}
      </div>
    );

    return (
      <Fragment>
        <DrawerContainer
          title={`检查点——${checkPointName}`}
          destroyOnClose={true}
          zIndex={1050}
          width={535}
          visible={visible}
          left={left}
          placement="right"
          onClose={this.handleCloseDrawer}
          {...restProps}
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
