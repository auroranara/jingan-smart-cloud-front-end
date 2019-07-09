import React, { PureComponent, Fragment } from 'react';
import { Col, Table } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import moment from 'moment';
import ImageCard from '@/components/ImageCard';
import Lightbox from 'react-images';
import styles from './PointPositionName.less';
import HiddenDangerCard from '@/jingan-components/HiddenDangerCard';
import DrawerContainer from '../components/DrawerContainer';
// import PointError from '../imgs/hasDanger.png';
// import lastCheckPoint from '../imgs/lastCheckPoint.png';
// import normalCheckPoint from '../imgs/normalCheckPoint.png';
// import waitCheckPoint from '../imgs/waitCheckPoint.png';
import hasDanger from '../imgs/hasDanger.png';
import noDanger from '../imgs/noDanger.png';

const isVague = false;
function nameToVague(str) {
  let newStr = '';
  if (str && str.length === 1) return str;
  else if (str && str.length === 2) {
    newStr = str.substr(0, 1) + '*';
  } else if (str && str.length > 2) {
    newStr = str.substr(0, 1) + '*' + str.substr(-1);
  } else return str;
  return newStr;
}

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

const columns = [
  {
    title: '巡查日期',
    dataIndex: 'check_date',
    key: 'check_date',
    align: 'center',
    render: time => {
      return moment(time).format('YYYY-MM-DD');
    },
  },
  {
    title: '巡查人',
    dataIndex: 'check_user_names',
    key: 'check_user_names',
    align: 'center',
    render: val => {
      return (
        <Ellipsis length={5} tooltip>
          {isVague ? nameToVague(val) : val}
        </Ellipsis>
      );
    },
  },
  {
    title: '巡查状态',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    render: val => {
      return +val === 1 ? <span>正常</span> : <span style={{ color: '#ff4848' }}>异常</span>;
    },
  },
  {
    title: '处理结果',
    dataIndex: 'data',
    key: 'data',
    align: 'center',
    width: '50',
    render: val => {
      const { finish, overTime, rectifyNum, reviewNum } = val;
      const resultStatus = ['已超期', '待整改', '待复查', '已关闭'];
      const nums = [overTime, rectifyNum, reviewNum, finish];
      return (
        <div className={+val.status === 1 ? null : styles.resultError}>
          <Ellipsis length={5} tooltip>
            {resultStatus
              .map((data, index) => {
                return nums[index] ? `${data} ${nums[index]}` : '';
              })
              .filter(data => data)
              .join('/')}
          </Ellipsis>
        </div>
      );
    },
  },
];

export default class PointPositionName extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hoverIndex: -1,
      images: [],
      currentImage: 0,
      lightBoxVisible: false,
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
      handlePointDangerDetail,
      ...restProps
    } = this.props;
    const { images, currentImage, lightBoxVisible } = this.state;

    const dangerList = list.filter(item => item.item_id === checkItemId);

    const currentStatus = dangerList.length > 0 ? hasDanger : noDanger;

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

    const left = (
      <div className={styles.container}>
        <div className={styles.circleContainer}>
          <Col span={10} className={styles.currentTitle}>
            <span>当前状态</span>
          </Col>
          <Col span={14} className={styles.statusIcon}>
            <div
              className={styles.icon}
              style={{
                backgroundImage: `url(${currentStatus})`,
              }}
            >
              {dangerList.length > 0 ? (
                <span className={styles.hasDangerTitle}>有隐患</span>
              ) : (
                <span className={styles.noDangerTitle}>无隐患</span>
              )}
            </div>
          </Col>
        </div>

        {dangerList.length > 0 && (
          <div className={styles.cardsTitle}>
            <p className={styles.titleP}>
              当前隐患
              <span className={styles.titleSpan}>({dangerList.length})</span>
            </p>
          </div>
        )}

        {dangerList.length > 0 && (
          <div className={styles.cards}>
            <div className={styles.cardsMain}>
              {dangerList.length ? (
                cards
              ) : (
                <div style={{ textAlign: 'center', color: '#fff' }}>{'暂无数据'}</div>
              )}
            </div>
          </div>
        )}

        <div className={styles.recordTitle}>
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
        </div>
      </div>
    );

    return (
      <Fragment>
        <DrawerContainer
          title={checkPointName}
          destroyOnClose={true}
          zIndex={1050}
          width={485}
          visible={visible}
          left={left}
          placement="right"
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
