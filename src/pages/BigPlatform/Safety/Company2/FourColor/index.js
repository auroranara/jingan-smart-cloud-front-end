import React, { PureComponent } from 'react';
import { Select, Tooltip, Avatar } from 'antd';
import classnames from 'classnames';
import MonitorBall from '@/components/MonitorBall';
import Ellipsis from '@/components/Ellipsis';
import RiskImg from '../../Components/RiskImg';
import RiskImgPosition from '../../Components/RiskImgPosition';
import VideoPlay from '../../../FireControl/section/VideoPlay';
import videoPointIcon from '../../img/videoPoint.png';
import gray from '@/assets/gray_new.png';
import exceptionGray from '@/assets/exception_gray.png';
import pointIcon from '@/assets/card-name.png';
import statusIcon from '@/assets/card-status.png';
import checkPersonIcon from '@/assets/card-check-person.png';
import checkTimeIcon from '@/assets/card-check-time.png';
import areaIcon from '@/assets/card-area.png';
import accidentTypeIcon from '@/assets/card-type.png';
import riskLevelIcon from '@/assets/card-level.png';

import styles from './index.less';
const { Option } = Select;

/* 图片地址前缀 */
const iconPrefix = 'http://data.jingan-china.cn/v2/big-platform/safety/com/';
/* 图片 */
const red = `${iconPrefix}red_new.png`;
const orange = `${iconPrefix}orange_new.png`;
const yellow = `${iconPrefix}yellow_new.png`;
const blue = `${iconPrefix}blue_new.png`;
const exceptionRed = `${iconPrefix}exception_red.png`;
const exceptionOrange = `${iconPrefix}exception_orange.png`;
const exceptionYellow = `${iconPrefix}exception_yellow.png`;
const exceptionBlue = `${iconPrefix}exception_blue.png`;
const selected = `${iconPrefix}selected.png`;
/* 风险告知卡背景 */
const infoBg = `${iconPrefix}info_border.png`;

// 选中后的点位的底座高度
const selectedHeight = 180;
const selectedWidth = 64;

// 获取风险告知卡状态字段的颜色和status
const getStatusLabel = status => {
  switch (+status) {
    case 1:
    return <span style={{ color: '#fff' }}>正常</span>;
    case 2:
    return <span style={{ color: '#FF4848' }}>异常</span>;
    case 3:
    return <span style={{ color: '#fff' }}>待检查</span>;
    case 4:
    return <span style={{ color: '#FF4848' }}>已超时</span>;
    default:
    return <span style={{ color: '#fff' }}></span>;
  }
};

// 风险告知卡
const RiskCard = function({
  // 相对位置，默认相对左边，即显示在右边
  base="left",
  // 是否为灰色
  isGray=false,
  // 源数据
  data,
  // 样式
  style,
}) {

  // 背景图片
  const background = isGray ? undefined : data && data.localPictureUrlList[0] && data.localPictureUrlList[0].webUrl;

  return (
    <div
      style={{
        position: 'absolute',
        [base]: 30,
        bottom: 0,
        width: 322,
        height: 216,
        fontSize: 18,
        lineHeight: '1',
        color: '#fff',
        textShadow: '2px 2px 2px #333',
        background: `url(${background}) no-repeat center / 100% 100%`,
        border: '30px solid transparent',
        borderWidth: '6px 10px',
        borderImageSource: `url(${infoBg})`,
        borderImageSlice: '12 21',
        transition: 'opacity 0.5s',
        whiteSpace: 'no-wrap',
        zIndex: 9,
        ...style,
      }}
    >
      {data ? (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 20px', height: '100%', background: 'rgba(8, 60, 120, 0.8)' }}>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', padding: '6px 0' }}>
            <Avatar src={pointIcon} size="small" style={{ flex: 'none', marginRight: '10px' }} title="风险点名称" />
            <Ellipsis lines={1} tooltip style={{ flex: 1 }}>{data.hdLetterInfo.pointName}</Ellipsis>
          </div>
          {!isGray  && (
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', padding: '6px 0' }}>
              <Avatar src={areaIcon} size="small" style={{ flex: 'none', marginRight: '10px' }} title="场所/环节/部位名称" />
              <Ellipsis lines={1} tooltip style={{ flex: 1 }}>{data.hdLetterInfo.areaName}</Ellipsis>
            </div>
          )}
          {!isGray && (
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', padding: '6px 0' }}>
              <Avatar src={accidentTypeIcon} size="small" style={{ flex: 'none', marginRight: '10px' }} title="易导致后果（风险）" />
              <Ellipsis lines={1} tooltip style={{ flex: 1 }}>{data.hdLetterInfo.accidentTypeName}</Ellipsis>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', padding: '6px 0' }}>
            <Avatar src={statusIcon} size="small" style={{ flex: 'none', marginRight: '10px' }} title="检查状态" />
            <Ellipsis lines={1} tooltip style={{ flex: 1 }}>{getStatusLabel(data.hdLetterInfo.status)}</Ellipsis>
          </div>
          {!isGray && (
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', padding: '6px 0' }}>
              <Avatar src={riskLevelIcon} size="small" style={{ flex: 'none', marginRight: '10px' }} title="风险等级" />
              <Ellipsis lines={1} tooltip style={{ flex: 1 }}>{data.hdLetterInfo.riskLevelName.desc}</Ellipsis>
            </div>
          )}
          {isGray && (
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', padding: '6px 0' }}>
              <Avatar src={checkPersonIcon} size="small" style={{ flex: 'none', marginRight: '10px' }} title="最近巡查人" />
              <Ellipsis lines={1} tooltip style={{ flex: 1 }}>{data.hdLetterInfo.lastCheckName}</Ellipsis>
            </div>
          )}
          {isGray && (
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', padding: '6px 0' }}>
              <Avatar src={checkTimeIcon} size="small" style={{ flex: 'none', marginRight: '10px' }} title="最近巡查时间" />
              <Ellipsis lines={1} tooltip style={{ flex: 1 }}>{data.hdLetterInfo.lastCheckDate && data.hdLetterInfo.lastCheckDate.slice(0, 10)}</Ellipsis>
            </div>
          )}
        </div>
      ) : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', backgroundColor: 'rgba(8, 60, 120, 0.8)' }}>暂无信息</div>}
    </div>
  );
};

/**
 * description: 安全风险四色图
 * author: sunkai
 * date: 2018年12月02日
 */
export default class FourColor extends PureComponent {
  state = {
    // 当前选中的四色图源数据
    selectedFourColorImg: {},
    // // 当前四色图上的点位列表
    // points: [],
    // 当前四色图上的视频列表
    videos: [],
    // 视频弹窗是否显示
    visible: false,
    // 视频弹窗播放的视频id
    keyId: undefined,
  }

  // 切换选中点位定时器
  alternateTimer = null;

  componentDidUpdate({ model: { companyMessage: { fourColorImg: prevFourColorImg } }, isMouseEnter: prevIsMouseEnter, currentHiddenDangerVisible: prevCurrentHiddenDangerVisible, inspectionPointVisible: prevInspectionPointVisible }) {
    const { model: { companyMessage: { fourColorImg } }, isMouseEnter, currentHiddenDangerVisible, handleClickPoint, points, selectedPointIndex, prevSelectedPointIndex, inspectionPointVisible } = this.props;
    // 1 当四色图源数据更新后，默认获取第一个四色图作为初始值
    if (fourColorImg !== prevFourColorImg) {
      this.changeSelectedFourColorImg(fourColorImg[0] || {});
    }
    // 2 如果鼠标移入隐患详情，则清除定时器，否则加上定时器
    if (prevIsMouseEnter !== isMouseEnter) {
      clearTimeout(this.alternateTimer);
      // 如果为未选中状态移出时，则自动获取之前保存的索引显示下一个
      if (!isMouseEnter) {
        const nextIndex = selectedPointIndex !== undefined ? (selectedPointIndex + 1) : (prevSelectedPointIndex + 1);
        this.alternateTimer = setTimeout(() => {this.handleClickPoint(points.length > nextIndex ? nextIndex : 0);}, 10000);
      }
    }
    // 3 如果点击当前隐患统计显示当前隐患弹窗框，则取消点位选中，并且移除定时器，否则如点击关闭按钮或点击点位，则选中点位并添加定时器
    if (prevCurrentHiddenDangerVisible !== currentHiddenDangerVisible) {
      clearTimeout(this.alternateTimer);
      if (currentHiddenDangerVisible) {
        handleClickPoint && handleClickPoint({ selectedPointIndex: undefined, prevSelectedPointIndex: selectedPointIndex !== undefined ? selectedPointIndex : prevSelectedPointIndex });
      }
      // 会执行一下语句，则意味着为点击关闭按钮隐藏隐患弹出框的
      else if (!inspectionPointVisible && prevSelectedPointIndex !== undefined){
        // const nextIndex = prevSelectedPointIndex + 1;
        // this.alternateTimer = setTimeout(() => {this.handleClickPoint(points.length > nextIndex ? nextIndex : 0);}, 10000);
        this.handleClickPoint(prevSelectedPointIndex);
      }
    }
    // 4.如果点击显示隐患点位弹窗框，则取消选中点位并移除定时器，否则如点击关闭按钮或点击点位，则选中点位并添加定时器
    if (prevInspectionPointVisible !== inspectionPointVisible) {
      clearTimeout(this.alternateTimer);
      if (inspectionPointVisible) {
        handleClickPoint && handleClickPoint({ selectedPointIndex: undefined, prevSelectedPointIndex: selectedPointIndex !== undefined ? selectedPointIndex : prevSelectedPointIndex });
      }
      else if (!currentHiddenDangerVisible && prevSelectedPointIndex !== undefined) {
        this.handleClickPoint(prevSelectedPointIndex);
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.alternateTimer);
  }

  /**
   * 设置选中的四色图并筛选出对应的点位和视频
   */
  changeSelectedFourColorImg = (selectedFourColorImg) => {
    const { id } = selectedFourColorImg;
    const { selectedFourColorImg: { id: selectedFourColorImgId } } = this.state;
    // 如果新选中的四色图与原来的一致，则不做任何操作
    if (selectedFourColorImgId === id) {
      return;
    }
    const {
      model: {
        companyMessage: {
          point=[],
        },
        videoList=[],
      },
    } = this.props;
    // 筛选出当前四色图对应的点位
    const points = point.filter(({ fixImgId }) => fixImgId === id);
    // 更新选中的四色图和对应视频列表
    this.setState({
      videos: videoList.filter(({ fix_img_id }) => fix_img_id === id),
      selectedFourColorImg,
    });
    // 选中第一个点位并更新点位列表
    this.handleClickPoint(0, points);
  }

  /**
   * 根据颜色筛选图片
   */
  getIconByColor = (color, isException) => {
    if (!isException) {
      switch (color) {
        case '红':
          return red;
        case '橙':
          return orange;
        case '黄':
          return yellow;
        case '蓝':
          return blue;
        default:
          return gray;
      }
    } else {
      switch (color) {
        case '红':
          return exceptionRed;
        case '橙':
          return exceptionOrange;
        case '黄':
          return exceptionYellow;
        case '蓝':
          return exceptionBlue;
        default:
          return exceptionGray;
      }
    }
  };

  /**
   * 下拉框选择事件
   */
  handleSelect = (id, { props: { data } }) => {
    this.changeSelectedFourColorImg(data);
  }

  /**
   * 点位点击事件
   * @param {number} index 当前选中的点位的索引
   * @param {array} points 当前四色图上的点位列表，如果有值，则为切换四色图的情况
   * 1. 当当前隐患弹出框显示时，点击点位则隐藏当前隐患
   */
  handleClickPoint = (index, points) => {
    // 取消之前的定时器
    clearTimeout(this.alternateTimer);
    const { points: prevPoints, handleClickPoint, selectedPointIndex: prevSelectedPointIndex, currentHiddenDangerVisible, inspectionPointVisible } = this.props;
    const extra = { rightQueue: [0] };
    // 如果points存在的话，则为切换四色图，需要更新points
    if (points) {
      extra.points = points;
    }
    // 如果当前隐患弹出框显示的话，则隐藏弹出框
    if (currentHiddenDangerVisible) {
      extra.currentHiddenDangerVisible = false;
    }
    // 如果隐患点位弹出框显示的话，则隐藏弹出框
    if (inspectionPointVisible) {
      extra.inspectionPointVisible = false;
    }
    // 获取points
    points = points || prevPoints;
    // 获取当前选中的点位
    const point = points[index];
    // 当切换四色图自动选中第一个点位但点位列表为空或者已选中第一个点位定时器自动选中下一个点位但点位列表只有一个时，点位不存在
    if (point) {
      // 是否点击的同一个点位
      const isUnselect = prevPoints[prevSelectedPointIndex] === point;
      // 如果点击同一个点位，则取消选中，并保留
      handleClickPoint && handleClickPoint(isUnselect ?
        { selectedPointIndex: undefined, prevSelectedPointIndex: index, ...extra } :
        { selectedPointIndex: index, prevSelectedPointIndex: undefined, ...extra });
      // 获取下一个点位的索引
      let nextIndex = 0;
      if (points.length === 1) {
        nextIndex = isUnselect ? 0 : (index + 1);
      }
      else {
        nextIndex = (index + 1) < points.length ? (index + 1) : 0;
      }
      // 重新设置定时器
      this.alternateTimer = setTimeout(() => {this.handleClickPoint(nextIndex);}, 10000);
    }
    else {
      handleClickPoint && handleClickPoint(extra);
    }
  }

  /**
   * 下拉框
   */
  renderSelect() {
    const {
      model: {
        // 企业信息中获取四色图
        companyMessage: { fourColorImg = [] }={},
      },
    } = this.props;
    //  从state中获取当前选中的四色图id
    const { selectedFourColorImg: { id: selectedFourColorImgId } } = this.state;
    // 当四色图的数量大于1时才显示下拉框
    return fourColorImg.length > 1 ? (
      <Select
        value={selectedFourColorImgId}
        onSelect={this.handleSelect}
        className={styles.fourColorImgSelect}
        dropdownClassName={styles.fourColorImgSelectDropDown}
      >
        {fourColorImg.map(item => {
          const { id, fileName = '未命名' } = item
          const isSelected = selectedFourColorImgId === id;
          return (
            <Option
              key={id}
              value={id}
              data={item}
              style={{ backgroundColor: isSelected && '#0967D3', color: isSelected && '#fff' }}
            >
              {fileName.split('.')[0]}
            </Option>
          );
        })}
      </Select>
    ) : null;
  }

  /**
   * 监控球
   */
  renderMonitorBall() {
    const {
      model: {
        // 监控球数据
        monitorData: { score = 0, count = 0, unnormal = 0 },
      },
      // 监控球数据是否正在加载中
      monitorDataLoading,
      // 监控球点击事件
      handleClickMonitorBall,
    } = this.props;
    // 当percent小于80或者报警时，显示异常颜色
    const color = +score < 80 || +unnormal > 0 ? '#ff7863' : '#00A8FF';
    // 当设备数为0时不显示监控球
    return +count !== 0 && !monitorDataLoading ? (
      <MonitorBall
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          zIndex: '9',
          boxShadow: `0 0 1em ${color}`,
        }}
        height={128}
        color={color}
        percent={score}
        title="安全监测"
        onClick={handleClickMonitorBall}
      />
    ) : null;
  }

  /**
   * 图例
   */
  renderLegend(red, orange, yellow, blue, gray, video) {
    return (
      <div className={styles.legendContainer}>
        {red > 0 && (
          <div className={styles.legend}>
            <span
              className={styles.legendIcon}
              style={{ backgroundColor: '#FC1F02' }}
            />
            <span>重大风险</span>
          </div>
        )}
        {orange > 0 && (
          <div className={styles.legend}>
            <span
              className={styles.legendIcon}
              style={{ backgroundColor: '#F17A0A' }}
            />
            <span>较大风险</span>
          </div>
        )}
        {yellow > 0 && (
          <div className={styles.legend}>
            <span
              className={styles.legendIcon}
              style={{ backgroundColor: '#FBF719' }}
            />
            <span>一般风险</span>
          </div>
        )}
        {blue > 0 && (
          <div className={styles.legend}>
            <span
              className={styles.legendIcon}
              style={{ backgroundColor: '#1E60FF' }}
            />
            <span>低风险</span>
          </div>
        )}
        {gray > 0 && (
          <div className={styles.legend}>
            <span
              className={styles.legendIcon}
              style={{ backgroundColor: '#4E6693' }}
            />
            <span>风险点</span>
          </div>
        )}
        {video > 0 && (
          <div className={styles.legend}>
            <span
              className={styles.legendIcon}
              style={{
                backgroundImage: `url(${videoPointIcon})`,
                boxShadow: 'none',
                border: 'none',
              }}
            />
            <span>视频监控</span>
          </div>
        )}
      </div>
    );
  }

  render() {
    const {
      // 容器样式
      style,
      // 容器类名
      className,
      // 选中的点位索引
      selectedPointIndex,
      // 当前四色图上的点位列表
      points,
      // 显示视频
      handleShowVideo,
    } = this.props;
    const { videos, selectedFourColorImg: { webUrl }, visible, keyId } = this.state;
    // 合并以后的容器类名
    const containerClassName = classnames(styles.container, className);
    // 红，橙，黄，蓝，未评级，视频计数
    let red = 0, orange = 0, yellow = 0, blue = 0, gray = 0;

    return (
      <div style={style} className={containerClassName}>
        {/* 标题 */}
        <div className={styles.title}>安全点位图</div>
        {/* 下拉框 */}
        {this.renderSelect()}
        {/* 监控球 */}
        {this.renderMonitorBall()}
        {/* 四色图 */}
        <RiskImg
          src={webUrl}
          rotate="30deg"
        >
          {points.map((item, index) => {
            const { itemId, xNum, yNum, info } = item;
            // 点位是否为异常状态
            const isAbnormal = info && +info.hdLetterInfo.status === 2;
            // 点位颜色
            const color = info && info.hdLetterInfo.riskLevelName.desc;
            // 当前点位是否被选中
            const isSelected = selectedPointIndex === index;

            // 点位是否为灰色
            let isGray = false;
            // 如果风险告知卡存在，则判断颜色并统计数量，否则默认为灰色
            switch (color) {
              case '红':
                red++;
                break;
              case '橙':
                orange++;
                break;
              case '黄':
                yellow++;
                break;
              case '蓝':
                blue++;
                break;
              default:
                gray++;
                isGray = true;
                break;
            }

            return (
              <RiskImgPosition
                key={itemId}
                position={{ x: xNum, y: yNum }}
              >
                {/* 风险点 */}
                <div
                  className={styles.point}
                  style={{
                    width: 32,
                    height: 35,
                    backgroundImage: `url(${this.getIconByColor(color, isAbnormal)})`,
                    bottom: isSelected ? selectedHeight : 0,
                    zIndex: isSelected ? 9 : 8,
                  }}
                  onClick={() => { this.handleClickPoint(index); }}
                />
                {/* 风险点底座 */}
                <div
                  className={styles.pointBase}
                  style={{
                    width: selectedWidth,
                    height: isSelected ? selectedHeight : 0,
                    backgroundImage: `url(${selected})`,
                    zIndex: isSelected ? 8 : 7,
                  }}
                />
                {/* 风险告知卡 */}
                <RiskCard
                  base={xNum < 0.5 ? 'left' : "right"}
                  isGray={isGray}
                  data={info}
                  style={{
                    display: isSelected ? 'block' : 'none',
                    // opacity: isSelected ? '1' : '0',
                  }}
                />
              </RiskImgPosition>
            );
          })}
          {videos.map(({ id, name, key_id: keyId, x_num, y_num }) => {
            return (
              <RiskImgPosition
                key={id}
                position={{ x: x_num, y: y_num }}
              >
                <Tooltip placement="top" title={name} overlayClassName={styles.tooltip}>
                  <div
                    className={styles.point}
                    style={{
                      width: 36,
                      height: 36,
                      backgroundImage: `url(${videoPointIcon})`,
                      borderRadius: '50%',
                      boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.35)',
                    }}
                    onClick={() => {handleShowVideo(keyId);}}
                  />
                </Tooltip>
              </RiskImgPosition>
            );
          })}
        </RiskImg>
        {/* 图例 */}
        {this.renderLegend(red, orange, yellow, blue, gray, videos.length)}
        {/* 视频播放 */}
        {/* <VideoPlay
          style={{ position: 'fixed', zIndex: 99999999 }}
          videoList={videos}
          visible={visible}
          showList={true}
          keyId={keyId}
          handleVideoClose={() => {this.setState({ visible: false });}}
        /> */}
      </div>
    );
  }
}
