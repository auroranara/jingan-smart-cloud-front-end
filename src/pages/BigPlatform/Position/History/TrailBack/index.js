import React, { PureComponent, Fragment } from 'react';
import { Icon } from 'antd'
import moment from 'moment';
import person from '../../imgs/person.png';
// 引入样式文件
import styles from './index.less';


/**
 * 1.播放
 * 2.暂停
 * 3.加速
 * 4.减速
 * 5.鼠标移到时间轴上显示鼠标所在的时间节点
 * 6.鼠标点击时间轴跳转到标所在的时间节点
 * 7.点位点击
 */

/**
 * 点和点之间的时间间隔为1s
 */

// 时间转换格式
const timeFormat = 'YYYY-MM-DD HH:mm:ss';
// 最小速率
const minSpeed = 1;
// 最大速率
const maxSpeed = 64;
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
  // 当前点所在的位置索引
  currentIndex: 0,
};

/**
 * description: 模板
 * author: sunkai
 * date: 2018年12月25日
 */
export default class Template extends PureComponent {
  // 组件内仓库
  state = {
    ...defaultState,
  }

  // 定时器
  playTimer = null

  // requestAnimationFrame
  frameTimer = null;

  // 点击播放时的精确时间戳
  frameStart = null;

  // 点击播放时的时间戳
  playingStart = null;

  /**
   * 挂载后
   */
  componentDidMount() {

  }

  /**
   * 更新后
   * 说明：
   * 1.data发生变化时，重置state
   */
  componentDidUpdate({ data: prevData }) {
    const { data } = this.props;
    if (data !== prevData) {
      this.setState(({ speed }) => ({ ...defaultState, speed }));
    }
  }

  /**
   * 销毁前
   */
  componentWillUnmount() {
    clearTimeout(this.playTimer);
    this.unsetFrameTimer();
  }

  /**
   * 请求动画帧函数回调
   * 说明：
   * 1.重置时间条
   * 2.重置点位
   * 3.当当前时间大于等于结束时间时，停止移动
   * 4.当当前时间为undefined是，默认为起始时间
   */
  frameCallback = (timestamp) => {
    const { startTime, endTime, data=[] } = this.props;
    const { currentTimeStamp, currentIndex, speed } = this.state;
    if (!this.frameStart) {
      this.frameStart = timestamp;
      this.playingStart = currentTimeStamp;
      this.setFrameTimer();
      return;
    }
    // 获取当前时间戳
    const nextCurrentTimeStamp = (this.playingStart || startTime) + (timestamp - this.frameStart) * speed;
    if (nextCurrentTimeStamp >= endTime) {
      this.unsetFrameTimer();
      this.setState({
        playing: false,
        currentTimeStamp: endTime,
        currentIndex: data.length - 1,
      });
    }
    else {
      this.setFrameTimer();
      this.setState({
        currentTimeStamp: nextCurrentTimeStamp,
        currentIndex: data[currentIndex+1] && data[currentIndex+1].time <= nextCurrentTimeStamp ? currentIndex+1 : currentIndex,
      });
    }
    // // 从点击继续到现在的时间
    // const offset = timestamp - this.frameStart;
    // // 已经播放的时间
    // const overlay =
    // // 总时长
    // const duration = endTime - startTime;
  }

  /**
   * 添加请求动画帧函数定时器
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
   * 显示提示框
   */
  showTooltip = (content, e) => {
    const { left, top } = e.target.getBoundingClientRect();
    this.setState({
      tooltip: {
        visible: true,
        content,
        left,
        top,
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
   * 时间条专用修改提示框
   */
  changeTooltip = (e) => {
    const currentTime = moment(this.getCurrentTimeStamp(e)).format(timeFormat);
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
   * 获取鼠标所在位置对应的时间戳
   */
  getCurrentTimeStamp = (e) => {
    const { startTime, endTime } = this.props;
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const rate = (e.clientX - left) / width;
    return startTime + rate * (endTime-startTime);
  }

  /**
   * 获取当前点位索引
   */
  getCurrentIndex = (currentTimeStamp) => {
    const { data=[] } = this.props;
    let currentIndex = 0;
    for(let i=0; i<data.length; i++) {
      if (data[i].time <= currentTimeStamp) {
        currentIndex = i;
      }
      else {
        break;
      }
    }
    return currentIndex;
  }

  /**
   * 播放按钮点击事件
   * 说明：
   * 1.显示暂停按钮
   * 2.继续之前的播放
   * 3.若有onPlay传参则调用
   * 4.如果之前的时间节点已经是结束时间，则重新开始播放
   */
  handlePlay = () => {
    const { onPlay, endTime } = this.props;
    const { currentTimeStamp } = this.state;
    const extra = currentTimeStamp === endTime ? { currentTimeStamp: undefined, currentIndex: 0 } : undefined;
    /* 第一步 */
    this.setState(({ tooltip }) => ({ playing: true, ...extra, tooltip: { ...tooltip, content: '暂停' } }));
    /* 第二步 */
    this.setFrameTimer();
    /* 第三步 */
    if (onPlay) {
      onPlay();
    }
  }

  /**
   * 暂停按钮点击事件
   * 说明：
   * 1.修改按钮状态
   * 2.移除播放定时器
   * 3.若有onPause传参则调用
   */
  handlePause = () => {
    const { onPause } = this.props;
    /* 第一步 */
    this.setState(({ tooltip }) => ({ playing: false, tooltip: { ...tooltip, content: '播放' } }));
    /* 第二步 */
    this.unsetFrameTimer();
    /* 第三步 */
    if (onPause) {
      onPause();
    }
  }

  /**
   * 加速按钮点击事件
   * 说明：
   * 1.重置速率
   * 2.若有onAccelerate传参则调用
   * 3.根据是否在播放决定是否重置定时器
   */
  handleAccelerate = () => {
    const { onAccelerate } = this.props;
    const { playing } = this.state;
    this.unsetFrameTimer();
    /* 第一步 */
    this.setState(({ speed, tooltip }) => ({ speed: speed * 2, tooltip: { ...tooltip, content: `加速，当前${speed * 2}x` } }), () => {
      /* 第三步 */
      if (playing) {
        this.setFrameTimer();
      }
    });
    /* 第二步 */
    if (onAccelerate) {
      onAccelerate();
    }
  }

  /**
   * 减速按钮点击事件
   * 说明：
   * 1.重置速率
   * 2.若有onDecelerate传参则调用
   * 3.根据是否在播放决定是否重置定时器
   */
  handleDecelerate = () => {
    const { onDecelerate } = this.props;
    const { playing } = this.state;
    this.unsetFrameTimer();
    /* 第一步 */
    this.setState(({ speed, tooltip }) => ({ speed: speed / 2, tooltip: { ...tooltip, content: `减速，当前${speed / 2}x` } }), () => {
      /* 第三步 */
      if (playing) {
        this.setFrameTimer();
      }
    });
    /* 第二步 */
    if (onDecelerate) {
      onDecelerate();
    }
  }

  /**
   * 连线
   */
  renderLine({ x: x1, y: y1 }={}, { x: x2, y: y2 }={}) {
    return (
      <div
        style={{
          position: 'absolute',
          left: x1 > x2 ? `${x2}%`: `${x1}%`,
          bottom: y1 > y2 ? `${y2}%`: `${y1}%`,
          width: Math.abs(x1 - x2) > 1 ? `${Math.abs(x1 - x2)}%` : 1,
          height: Math.abs(y1 - y2) > 1 ? `${Math.abs(y1 - y2)}%` : 1,
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><line x1="${x1 > x2 ? '100%' : 0}" y1="${y1 >= y2 ? 0 : '100%'}" x2="${x1 >= x2 ? 0 : '100%'}" y2="${y1 > y2 ? '100%' : 0}" stroke="green" stroke-width="1"/></svg>')`,
         }}
      />
    );
  }

  /**
   * 点击时间条
   * 说明：
   * 1.重置时间条
   * 2.重置点位
   * 3.根据是否在播放决定是否重置定时器
   * 4.若有onLocate传参则调用
   */
  handleLocate = (e) => {
    const { onLocate } = this.props;
    const { playing } = this.state;
    const currentTimeStamp = this.getCurrentTimeStamp(e);
    const currentIndex = this.getCurrentIndex(currentTimeStamp);
    this.unsetFrameTimer();
    /* 第一步，第二步 */
    this.setState({ currentTimeStamp, currentIndex }, () => {
      /* 第三步 */
      if (playing) {
        this.setFrameTimer();
      }
    });
    /* 第四步 */
    if (onLocate) {
      onLocate();
    }
  }

  /**
   * 渲染
   */
  render() {
    const {
      // 样式
      style,
      // 顶部样式
      topStyle,
      // 背景图地址
      src,
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
      // 点位点击事件
      onClick=(item)=>console.log(item),
      // 起始时间
      startTime,
      // 结束时间
      endTime,
    } = this.props;
    const { playing, currentTimeStamp, currentIndex, speed, tooltip: { visible, left: tooltipLeft, top: tooltipTop, content } } = this.state;
    // 获取当前点位位置
    const currentData = data[currentIndex];
    // 当前时间轴宽度
    const width = currentTimeStamp ? `${(currentTimeStamp - startTime) / (endTime - startTime) * 100}%` : 0;
    // 是否已经减速到最小速率
    const isMinSpeed = speed === minSpeed;
    // 是否已经加速大最大速率
    const isMaxSpeed = speed === maxSpeed;

    return (
      <div className={styles.container} style={style}>
        {/* canvas容器 */}
        <div className={styles.canvasWrapper} style={{ ...topStyle, backgroundImage: `url(${src})` }}>
          {data.map((item, index) => {
            const { x, y, time } = item;
            return (
              <Fragment key={time}>
                <div key={time} style={{ display: index === currentIndex ? 'none': undefined, position: 'absolute', left: `${x}%`, bottom: `${y}%`, /* width: 39, height: 13, border: '3px solid #0186D1', */width: 13, height: 13, backgroundColor: 'green', borderRadius: '50%', cursor: 'pointer', transform: 'translate(-50%, 50%)' }} onClick={() => {onClick(item);}} />
                {index < data.length - 1 && this.renderLine(item, data[index+1])}
              </Fragment>
            );
          })}
          {currentData && <div style={{ position: 'absolute', left: `${currentData.x}%`, bottom: `${currentData.y}%`, width: 39, height: 40, background: `url(${person}) no-repeat center center / 100% 100%`, cursor: 'pointer', transform: 'translate(-50%, 6px)' }} onClick={() => {onClick(currentData);}} />}
        </div>
        {/* 控件容器 */}
        <div className={styles.controlWrapper}>
          {/* 时间轴 */}
          <div className={styles.timeBar} onClick={this.handleLocate} onMouseMove={(e) => {this.changeTooltip(e);}} onMouseLeave={this.hideTooltip}>
            {/* 当前时间轴 */}
            <div className={styles.currentTimeBar} style={{ width }} /* ref={currentTimeBar => this.currentTimeBar = currentTimeBar} */ />
          </div>
          {/* 按钮栏 */}
          <div className={styles.buttonBar}>
            {/* 起始时间 */}
            <div className={styles.startTime}>{startTime && moment(startTime).format(timeFormat)}</div>
            {/* 结束时间 */}
            <div className={styles.endTime}>{endTime && moment(endTime).format(timeFormat)}</div>
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
                onMouseEnter={(e) => {this.showTooltip('暂停', e);}}
                onMouseLeave={this.hideTooltip}
              />
            ) : (
              <Icon
                type="caret-right"
                className={styles.button}
                onClick={this.handlePlay}
                onMouseEnter={(e) => {this.showTooltip('播放', e);}}
                onMouseLeave={this.hideTooltip}
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
