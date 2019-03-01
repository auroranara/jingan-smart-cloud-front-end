import React, { PureComponent } from 'react';
import { Icon } from 'antd'
import moment from 'moment';
// 引入样式文件
import styles from './TrailBack.less';

/**
 * 1.播放
 * 2.暂停
 * 3.加速
 * 4.减速
 * 5.鼠标移到时间轴上显示鼠标所在的时间节点
 * 6.鼠标点击时间轴跳转到鼠标所在的时间节点
 * 7.点击左侧列表中的时间节点将时间轴跳转到对应的时间节点
 * 8.点位图上的时间节点将时间轴跳转到对应的时间节点
 * 9.点位点击
 */

// 时间转换格式
const DEFAULT_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
// 最小速率
const MIN_SPEED = 1;
// 最大速率
const MAX_SPEED = 16;
// 默认state
const defaultState = {
  // 是否正在播放
  playing: false,
  // 当前时间戳
  currentTimeStamp: undefined,
  // 播放速率
  speed: 1,
  // 提示框
  tooltip: {},
  // 当前的时间节点，-1代表人员不在任何一个时间节点上即还未进入
  currentIndex: -1,
  // 数据源
  divIcons: [],
};
// 报警状态字典
const alarmStatusDict = {
  1: 'SOS',
  2: '越界',
  3: '长时间不动',
};

/**
 * 获取人员对象
 */
function getDivIcon(data) {
  const { userName, xarea, yarea, sos, tlong, overstep } = data;
  // 是否为报警状态
  const isAlarm = sos || tlong || overstep;
  // 人员名称
  const name = userName || '访客';
  return {
    name,
    latlng: { lat: yarea, lng: xarea },
    iconProps: {
      // iconSize: [38, 58],
      // iconAnchor: [],
      className: styles.personContainer,
      html: `
        <div class="${styles.personName}">${userName || '访客'}</div>
        <div class="${styles[`${isAlarm?'red':(userName?'blue':'green')}Person`]}"></div>
      `,
    },
  };
}

/**
 * description: 历史轨迹播放
 */
export default class HistoryPlay extends PureComponent {
  // 组件内仓库
  state = {
    ...defaultState,
  }

  // requestAnimationFrame
  frameTimer = null;

  // 点击播放时的精确时间戳
  frameStart = null;

  // 点击播放时的时间戳
  playingStart = null;

  /**
   * 更新后
   */
  componentDidUpdate({ data: prevData }) {
    const { data, startTime } = this.props;
    // 判断源数据是否发生变化
    if (data !== prevData) {
      this.setState(({ speed }) => ({
        // 重置播放设置
        ...defaultState,
        // 保留播放播放速率
        speed,
        // 设置初始时间节点
        currentIndex: this.getCurrentIndex(startTime),
      }));
    }
  }

  /**
   * 销毁前
   */
  componentWillUnmount() {
    this.unsetFrameTimer();
  }

  /**
   * 设置请求动画帧函数定时器
   */
  setFrameTimer = () => {
    this.frameTimer = window.requestAnimationFrame(this.frameCallback);
  }

  /**
   * 清除请求动画帧函数定时器
   */
  unsetFrameTimer = () => {
    window.cancelAnimationFrame(this.frameTimer);
    this.frameStart = null;
    this.playingStart = null;
  }

  /**
   * 请求动画帧函数回调
   * 说明：
   * 1.重置时间条
   * 2.重置点位
   * 3.当前时间大于等于结束时间时，停止移动
   * 4.当前时间为undefined时，默认为起始时间
   */
  frameCallback = (timestamp) => {
    const { startTime, endTime } = this.props;
    const { currentTimeStamp, currentIndex, speed } = this.state;
    if (!this.frameStart) {
      this.frameStart = timestamp;
      this.playingStart = currentTimeStamp || startTime;
      this.setFrameTimer();
      return;
    }
    // 获取当前时间戳
    const nextCurrentTimeStamp = this.playingStart + (timestamp - this.frameStart) * speed;
    if (nextCurrentTimeStamp >= endTime) {
      this.unsetFrameTimer();
      this.setState({
        playing: false,
        currentTimeStamp: endTime,
        currentIndex: this.getCurrentIndex(endTime, currentIndex),
      });
    }
    else {
      this.setFrameTimer();
      this.setState({
        currentTimeStamp: nextCurrentTimeStamp,
        currentIndex: this.getCurrentIndex(nextCurrentTimeStamp, currentIndex),
      });
    }
  }

  /**
   * 时间条专用修改提示框
   * @param {event} e 鼠标事件对象
   */
  showTooltip = (e) => {
    const currentTime = moment(this.getCurrentTimeStamp(e)).format(DEFAULT_TIME_FORMAT);
    this.setState({
      tooltip: {
        visible: true,
        content: currentTime,
        left: e.clientX,
        top: e.clientY,
      },
    });
  }

  /**
   * 隐藏提示框
   */
  hideTooltip = () => {
    this.setState({
      tooltip: {},
    });
  }

  /**
   * 获取鼠标所在位置对应的时间戳
   * @param {event} e 鼠标事件对象
   * @return {number} 时间戳
   */
  getCurrentTimeStamp = (e) => {
    const { startTime, endTime } = this.props;
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const rate = (e.clientX - left) / width;
    return startTime + rate * (endTime - startTime);
  }

  /**
   * 获取当前时间节点(-1或者data.length代表不在时间节点上)
   * @param {number} currentTimeStamp 当期时间戳
   * @param {number} prevIndex 之前计算的时间节点
   * @return {number} 根据当前时间戳计算得到的时间节点
   */
  getCurrentIndex = (currentTimeStamp, prevIndex=-1) => {
    const { data=[] } = this.props;
    let currentIndex = prevIndex;
    // 循环数组找出已经经过的进入时间离当前时间戳最近的时间节点
    for(let i=prevIndex+1; i<data.length; i++) {
      if (data[i].intime <= currentTimeStamp) {
        currentIndex = i;
      }
      else {
        break;
      }
    }
    if (
      // 如果当前时间节点为最后一个时间节点，
      currentIndex === data.length - 1
      // 并且最后一个时间节点存在（即data的长度大于0），
      && data[currentIndex]
      // 并且最后一个时间节点的离开时间小于等于当前时间戳（即人员已经离开最后一个时间节点），
      && data[currentIndex].uptime <= currentTimeStamp
      // // 保证人员在最后一个时间节点至少1秒
      // && data[currentIndex].intime <= currentTimeStamp - 1000
    ) {
      // 则将当前时间节点设置为data.length（即不显示人员）
      currentIndex = data.length;
    }
    return currentIndex;
  }

  /**
   * 获取人员当前位置（不显示，在时间节点上，在两个时间节点之间）
   * @param {number} currentTimeStamp 当期时间戳
   * @param {object} currentData 当前时间节点对应的数据
   * @param {object} nextData 下个时间节点对应的数据
   * @return {object} { lat: 垂直方向百分比, lng: 水平方向百分比 }
   */
  getCurrentPosition = (currentTimeStamp, currentData, nextData) => {
    // 如果当前时间节点对应的数据不存在，则不返回位置，从而不显示人员
    if (!currentData) {
      return;
    }
    // 如果下个时间节点对应的数据不存在（即当前为最后一个时间节点），
    // 或者当前时间戳小于当前时间节点的离开时间（即人员还没有从当前时间节点离开），
    // 则返回当前时间节点的位置，从而使人员显示在当前时间节点的位置
    const { xPx: x1, yPx: y1, uptime: out1 } = currentData;
    if (!nextData || currentTimeStamp < out1) {
      return {
        lat: y1,
        lng: x1,
      };
    }
    // 如果下个时间节点对应的数据存在，
    // 并且当前时间戳大于当前时间节点的离开时间（即人员已经离开当前时间节点，在去往下个时间节点的路上），
    // 则假设人员的移动速度是固定的，从而计算出当前位置
    else {
      const { xPx: x2, yPx: y2, intime: in2 } = nextData;
      const percent = (currentTimeStamp - out1) / (in2 - out1);
      return {
        lat: x1 + (x2-x1)*percent,
        lng: y1 + (y2-y1)*percent,
      };
    }
  }

  /**
   * 获取当前时间节点和下个时间节点间的指向性箭头
   * @param {number} currentIndex 当前时间节点
   * @return {object} 箭头图片对象
   */
  getArrow(currentIndex) {
    const { data=[] } = this.props;
    const length = data.length;
    // 确保两个时间节点都存在，这样箭头才存在
    if (currentIndex + 1 >= length || currentIndex < 0) {
      return;
    }
    const { xPx: x1, yPx: y1, id } = data[currentIndex];
    const { xPx: x2, yPx: y2, locationStatusHistoryList } = data[currentIndex+1];
    const tX1 = x1 + (x2 - x1) * 0.1;
    const tY1 = y1 + (y2 - y1) * 0.1;
    const tX2 = x2 + (x1 - x2) * 0.1;
    const tY2 = y2 + (y1 - y2) * 0.1;
    // 当有警报信息时显示红色
    const color = locationStatusHistoryList && locationStatusHistoryList.length > 0 ? '#ff4848' : '#00a8ff';
    // 计算起点和终点坐标
    const lng1 = Math.min(x1, x2) - 0.1; // 左下角的横坐标
    const lat1 = Math.min(y1, y2) - 0.1; // 左下角的纵坐标
    const lng2 = Math.max(x1, x2) + 0.1; // 右上角的横坐标
    const lat2 = Math.max(y1, y2) + 0.1; // 右上角的纵坐标
    const pX1 = `${(tX1 - lng1) / (lng2 - lng1) * 100}%25`; // x1在图上转换以后的坐标
    const pY1 = `${(1 - (tY1 - lat1) / (lat2 - lat1)) * 100}%25`; // y1在图上转换以后的坐标
    const pX2 = `${(tX2 - lng1) / (lng2 - lng1) * 100}%25`; // x2在图上转换以后的坐标
    const pY2 = `${(1- (tY2 - lat1) / (lat2 - lat1)) * 100}%25`; // y2在图上转换以后的坐标
    return {
      id,
      url: `data:image/svg+xml;charset=utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='100%25'%20height='100%25'%3E%3Cdefs%3E%3Cmarker%20id='arrow'%20markerWidth='9'%20markerHeight='6'%20refX='0'%20refY='3'%20orient='auto'%20markerUnits='strokeWidth'%3E%3Cpath%20d='M0,0%20L0,6%20L9,3%20z'%20fill='${color}'%20/%3E%3C/marker%3E%3C/defs%3E%3Cline%20x1='${pX1}'%20y1='${pY1}'%20x2='${pX2}'%20y2='${pY2}'%20stroke='${color}'%20stroke-width='1'%20marker-end='url(#arrow)'%20/%3E%3C/svg%3E`,
      latlngs: [
        { lat: lat1, lng: lng1 },
        { lat: lat2, lng: lng1 },
        { lat: lat2, lng: lng2 },
        { lat: lat1, lng: lng2 },
      ],
    };
  }

  /**
   * 播放按钮点击事件
   */
  handlePlay = () => {
    const { onPlay, startTime, endTime } = this.props;
    if (startTime && endTime) {
      const { currentTimeStamp } = this.state;
      this.setState({
        // 显示暂停按钮
        playing: true,
        // 如果当前时间戳已经是结束时间，则重新开始播放
        ...(currentTimeStamp === endTime && { currentTimeStamp: startTime, currentIndex: this.getCurrentIndex(startTime) }),
      });
      // 继续之前的播放
      this.setFrameTimer();
      // 若有onPlay传参则调用
      if (onPlay) {
        onPlay();
      }
    }
  }

  /**
   * 暂停按钮点击事件
   */
  handlePause = () => {
    const { onPause } = this.props;
    // 显示播放按钮
    this.setState({ playing: false });
    // 暂停播放
    this.unsetFrameTimer();
    // 若有onPause传参则调用
    if (onPause) {
      onPause();
    }
  }

  /**
   * 加速按钮点击事件
   */
  handleAccelerate = () => {
    const { onAccelerate } = this.props;
    const { playing } = this.state;
    // 清除变量以方便按照新的速率重新计算
    this.unsetFrameTimer();
    this.setState(({ speed, tooltip }) => ({
      // 重置播放速率
      speed: speed * 2,
      // 重置速率提示
      tooltip: { ...tooltip, content: `加速，当前${speed * 2}x` },
    }), () => {
      // 根据是否在播放决定是否重置定时器
      if (playing) {
        this.setFrameTimer();
      }
    });
    // 若有onAccelerate传参则调用
    if (onAccelerate) {
      onAccelerate();
    }
  }

  /**
   * 减速按钮点击事件
   */
  handleDecelerate = () => {
    const { onDecelerate } = this.props;
    const { playing } = this.state;
    // 清除变量以方便按照新的速率重新计算
    this.unsetFrameTimer();
    this.setState(({ speed, tooltip }) => ({
      // 重置播放速率
      speed: speed / 2,
      // 重置速率提示
      tooltip: { ...tooltip, content: `减速，当前${speed / 2}x` },
    }), () => {
      // 根据是否在播放决定是否重置定时器
      if (playing) {
        this.setFrameTimer();
      }
    });
    // 若有onDecelerate传参则调用
    if (onDecelerate) {
      onDecelerate();
    }
  }

  /**
   * 点击时间轴快速跳转
   */
  handleLocate = (e) => {
    const { onLocate } = this.props;
    const { playing } = this.state;
    const currentTimeStamp = this.getCurrentTimeStamp(e);
    const currentIndex = this.getCurrentIndex(currentTimeStamp);
    // 清除变量以方便重新计算
    this.unsetFrameTimer();
    this.setState({
      // 重置当前时间戳（即重置时间轴进度）
      currentTimeStamp,
      // 重置当前时间节点（即重置人员位置）
      currentIndex,
    }, () => {
      // 根据是否在播放决定是否重置定时器
      if (playing) {
        this.setFrameTimer();
      }
    });
    // 若有onLocate传参则调用
    if (onLocate) {
      onLocate();
    }
  }

  /**
   * 点击人员
   */
  handleClickPerson = () => {

  }

  /**
   * 渲染
   */
  render() {
    const {
      // 点位数据
      data=[],
      // // 点击播放按钮回调事件
      // onPlay,
      // // 点击暂停按钮回调事件
      // onPause,
      // // 点击加速按钮回调事件
      // onAccelerate,
      // // 点击减速按钮回调事件
      // onDecelerate,
      // // 点击时间轴事件
      // onLocate,
      // // 时间移动事件
      // onPass,
      // // 点位点击事件
      // onClick,
      // 起始时间
      startTime,
      // 结束时间
      endTime,
    } = this.props;
    const { playing, currentTimeStamp, currentIndex, speed, tooltip: { visible, left: tooltipLeft, top: tooltipTop, content } } = this.state;
    // 获取当前点位位置
    const currentData = this.getCurrentPosition(currentTimeStamp, data[currentIndex], data[currentIndex+1]);
    // 当前时间轴宽度
    const width = currentTimeStamp ? `${(currentTimeStamp - startTime) / (endTime - startTime) * 100}%` : 0;
    // 是否已经减速到最小速率
    const isMinSpeed = speed === MIN_SPEED;
    // 是否已经加速大最大速率
    const isMaxSpeed = speed === MAX_SPEED;

    return (
      <div className={styles.container}>
        {/* 控件容器 */}
        <div className={styles.controlWrapper}>
          {/* 时间轴 */}
          <div className={styles.timeBar} onClick={this.handleLocate} onMouseMove={this.showTooltip} onMouseLeave={this.hideTooltip}>
            {/* 当前时间轴 */}
            <div className={styles.currentTimeBar} style={{ width }} /* ref={currentTimeBar => this.currentTimeBar = currentTimeBar} */ />
          </div>
          {/* 按钮栏 */}
          <div className={styles.buttonBar}>
            {/* 起始时间 */}
            <div className={styles.startTime}>{startTime && moment(startTime).format(DEFAULT_TIME_FORMAT)}</div>
            {/* 结束时间 */}
            <div className={styles.endTime}>{endTime && moment(endTime).format(DEFAULT_TIME_FORMAT)}</div>
            {/* 减速按钮 */}
            <Icon
              type="step-backward"
              className={styles.button}
              style={isMinSpeed ? { color: '#999', cursor: 'not-allowed' } : undefined}
              onClick={isMinSpeed ? undefined: this.handleDecelerate}
              onMouseEnter={(e) => {this.showTooltip(`减速，当前${speed}x`, e);}}
              onMouseLeave={this.hideTooltip}
            />
            {/* 正在播放时显示暂停按钮，否则显示播放按钮 */}
            {playing ? (
              <Icon
                type="pause"
                className={styles.button}
                onClick={this.handlePause}
              />
            ) : (
              <Icon
                type="caret-right"
                className={styles.button}
                onClick={this.handlePlay}
              />
            )}
            {/* 加速按钮 */}
            <Icon
              type="step-forward"
              className={styles.button}
              style={isMaxSpeed ? { color: '#999', cursor: 'not-allowed' } : undefined}
              onClick={isMaxSpeed ? undefined: this.handleAccelerate}
              onMouseEnter={(e) => {this.showTooltip(`加速，当前${speed}x`, e);}}
              onMouseLeave={this.hideTooltip}
            />
          </div>
        </div>
        {/* tooltip */}
        {visible && <div className={styles.tooltip} style={{ left: tooltipLeft, top: tooltipTop }}>{content}</div>}
      </div>
    );
  }
}
