import React, { PureComponent } from 'react';
import { Icon } from 'antd'
import moment from 'moment';
import classNames from 'classnames';
import ImageDraw from '@/components/ImageDraw';
// 引入样式文件
import styles from './index.less';

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
// 注意：暂时先不考虑areaId为null的情况
// 只有currentTimeStamp变化时，修改divIcons
// currentIndex变化时，修改drawProps

// 默认地图参数
const DEFAULT_MAP_PROPS = {
  boxZoom: false,
  doubleClickZoom: false,
  dragging: false,
  scrollWheelZoom: false,
};
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
 * description: 历史轨迹播放
 */
export default class HistoryPlay extends PureComponent {
  // 组件内仓库
  state = {
    ...defaultState,
    // 绘图组件参数
    drawProps: {},
  }

  // requestAnimationFrame
  frameTimer = null;

  // 点击播放时的精确时间戳
  frameStart = null;

  // 点击播放时的时间戳
  playingStart = null;

  // tree是否发生变化
  treeUpdated = false;

  // tree变化后data是否发生变化
  dataUpdated = false;

  /**
   * 更新后
   */
  componentDidUpdate({ data: prevData, tree: prevTree }) {
    const { data, tree, startTime } = this.props;
    // 判断源数据是否发生变化
    if (data !== prevData) {
      // 获取初始时间节点
      const currentIndex = this.getCurrentIndex(startTime);
      this.setState(({ speed, drawProps }) => {
        return {
          // 重置播放设置
          ...defaultState,
          // 保留播放播放速率
          speed,
          // 设置初始时间节点
          currentIndex,
          drawProps: this.treeUpdated ? {
            // 根据树是否发生变化决定是否保留参数
            ...drawProps,
            ...this.getDrawProps(currentIndex, startTime, true),
            circleMarkers: data,
          } : undefined,
        };
      });
      this.dataUpdated = true;
    }
    if (tree !== prevTree) {
      this.setState({
        drawProps: {
          url: tree.url,
        },
      }, () => {
        if (this.dataUpdated) {
          this.setState(({ drawProps, currentIndex }) => ({
            drawProps: {
              ...drawProps,
              ...this.getDrawProps(currentIndex, startTime, true),
              circleMarkers: data,
            },
          }));
        }
      });
      this.treeUpdated = true;
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
    const { currentTimeStamp, currentIndex, speed, drawProps } = this.state;
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
      const nextIndex = this.getCurrentIndex(endTime, currentIndex);
      this.setState({
        playing: false,
        currentTimeStamp: endTime,
        currentIndex: nextIndex,
        drawProps: { ...drawProps, ...this.getDrawProps(nextIndex, endTime, currentIndex !== nextIndex) },
      });
    }
    else {
      const nextIndex = this.getCurrentIndex(nextCurrentTimeStamp, currentIndex);
      this.setFrameTimer();
      this.setState({
        currentTimeStamp: nextCurrentTimeStamp,
        currentIndex: nextIndex,
        drawProps: { ...drawProps, ...this.getDrawProps(nextIndex, nextCurrentTimeStamp, currentIndex !== nextIndex) },
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
   * 获取绘图组件参数（images, divIcons, arrows, data, reference)
   * @param {number} currentIndex 当前时间节点
   * @param {number} currentTimeStamp 当前时间戳
   * @param {boolean} currentIndexChanged 当前时间节点是否发生变化
   * @return {object} 需要改变的组件参数对象
   */
  getDrawProps = (currentIndex, currentTimeStamp, currentIndexChanged) => {
    const divIcons = this.getDivIcons(currentIndex, currentTimeStamp);
    // 如果当前时间节点发生变化，修改drawProps的所有参数
    if (currentIndexChanged) {
      return {
        // 楼层
        images: this.getImages(currentIndex), // 注意必须显示声明为undefined
        // 区域
        data: this.getAreas(currentIndex),
        // 人员
        divIcons,
        // 箭头
        arrows: this.getArrows(currentIndex),
        // 居中
        reference: this.getReference(currentIndex),
      };
    }
    return { divIcons };
  }

  /**
   * 获取楼层图片数组
   * @param {object} currentIndex 当前时间节点
   * @return {array} 从当前时间节点往上遍历得到的不同楼层图片数组
   */
  getImages = (currentIndex) => {
    const { tree, data } = this.props;
    const currentData = data[currentIndex];
    // 如果对应数据不存在，则不做任何操作
    if (currentData && currentData.areaId) {
      // 根据当前时间节点所在的区域id获取到区域对象
      let image = tree[currentData.areaId];
      const images = [];
      // 循环获取父区域直到最顶层，通过比较父子区域的图片，将不同的图片插入数组
      while (image) {
        const { parentId, mapId, companyMap } = image;
        const parent = tree[parentId];
        if ((parent && mapId !== parent.mapId) || (!parent && mapId !== companyMap)) {
          images.unshift(image);
        }
        image = parent;
      }
      return images;
    }
  }

  /**
   * 获取当前时间节点和下个时间节点间的指向性箭头
   * @param {number} currentIndex 当前时间节点
   * @return {array} 箭头图片数组
   */
  getArrows(currentIndex) {
    const { data=[] } = this.props;
    // 确保两个时间节点都存在，这样箭头才存在
    if (data[currentIndex] && data[currentIndex+1]) {
      const { latlng: { lat: y1, lng: x1 }, id } = data[currentIndex];
      const { latlng: { lat: y2, lng: x2 }, options: { color='#00a8ff' }={} } = data[currentIndex+1];
      const tX1 = x1 + (x2 - x1) * 0.2;
      const tY1 = y1 + (y2 - y1) * 0.2;
      const tX2 = x2 + (x1 - x2) * 0.2;
      const tY2 = y2 + (y1 - y2) * 0.2;
      // 计算起点和终点坐标
      const lng1 = Math.min(x1, x2) - 0.01; // 左下角的横坐标
      const lat1 = Math.min(y1, y2) - 0.01; // 左下角的纵坐标
      const lng2 = Math.max(x1, x2) + 0.01; // 右上角的横坐标
      const lat2 = Math.max(y1, y2) + 0.01; // 右上角的纵坐标
      const pX1 = `${(tX1 - lng1) / (lng2 - lng1) * 100}%`; // x1在图上转换以后的坐标
      const pY1 = `${(1 - (tY1 - lat1) / (lat2 - lat1)) * 100}%`; // y1在图上转换以后的坐标
      const pX2 = `${(tX2 - lng1) / (lng2 - lng1) * 100}%`; // x2在图上转换以后的坐标
      const pY2 = `${(1- (tY2 - lat1) / (lat2 - lat1)) * 100}%`; // y2在图上转换以后的坐标
      return [{
        id,
        url: encodeURI(`data:image/svg+xml;charset=utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'><defs><marker id='arrow' markerWidth='9' markerHeight='6' refX='0' refY='3' orient='auto' markerUnits='strokeWidth'><path d='M0,0 L0,6 L9,3 z' fill='${color}' /></marker></defs><line x1='${pX1}' y1='${pY1}' x2='${pX2}' y2='${pY2}' stroke='${color}' stroke-width='1' marker-end='url(#arrow)' /></svg>`),
        latlngs: [
          { lat: lat1, lng: lng1 },
          { lat: lat2, lng: lng1 },
          { lat: lat2, lng: lng2 },
          { lat: lat1, lng: lng2 },
        ],
      }];
    }
  }

  /**
   * 获取区域数组
   * @param {number} currentIndex 当前时间节点
   * @return {array} 当前时间节点所在区域及其非楼层子区域组成的区域数组
   */
  getAreas = (currentIndex) => {
    const { tree, data } = this.props;
    const currentData = data[currentIndex];
    if (currentData && currentData.areaId) {
      // 没办法根据区域有没有图片来判断它是不是楼层
      // 关键在于判断当前区域是否为建筑？？？
      // 当前区域肯定要渲染，关键是渲染成黑（即作为当前选中区域）还是蓝（即作为子区域）的
      const currentArea = tree[currentData.areaId];
      // 暂时先根据children都有图片来判断它是建筑，即list的长度为0
      const list = currentArea.children.reduce((arr, id) => {
        const item = tree[id];
        if (item.mapId === currentArea.mapId) {
          arr.push(item);
        }
        return arr;
      }, []);
      return [{
        ...currentArea,
        options: { color: '#666' },
      }].concat(list);
    }
  }

  /**
   * 获取人员数组
   * @param {number} currentIndex 当前时间节点
   * @return {array} 人员数据
   */
  getDivIcons = (currentIndex, currentTimeStamp) => {
    const { data } = this.props;
    const currentData = data[currentIndex];
    if (currentData) {
      // 获取位置
      const latlng = this.getCurrentPosition(currentIndex, currentTimeStamp);
      const { id, isAlarm, isVistor, locationStatusHistoryList } = currentData;
      const alarm = isAlarm && locationStatusHistoryList.reduce((result, { status }) => {
        const label = alarmStatusDict[status];
        label && result.push(label);
        return result;
      }, []).join('，');
      return [{
        id,
        latlng,
        iconProps: {
          iconSize: [37, 37],
          iconAnchor: isVistor ? [18.5, 32] : [18.5, 37],
          className: styles.personContainer,
          html: `
            <div class="${styles[isVistor?(isAlarm?'redVistor':'blueVistor'):(isAlarm?'redPerson':'bluePerson')]}">
              ${isAlarm ? `<div class="${styles.alarm}">${alarm}</div>` : ''}
            </div>
          `,
        },
      }];
    }
  }

  /**
   * 获取人员当前位置（不显示，在时间节点上，在两个时间节点之间）
   * @param {number} currentIndex 当前时间节点
   * @param {number} currentTimeStamp 当期时间戳
   * @return {object} { lat: 垂直方向百分比, lng: 水平方向百分比 }
   */
  getCurrentPosition = (currentIndex, currentTimeStamp) => {
    const { data } = this.props;
    const currentData = data[currentIndex];
    const nextData = data[currentIndex + 1];
    // 如果当前时间节点对应的数据不存在，则不返回位置，从而不显示人员
    if (!currentData) {
      return;
    }
    // 如果下个时间节点对应的数据不存在（即当前为最后一个时间节点），
    // 或者当前时间戳小于当前时间节点的离开时间（即人员还没有从当前时间节点离开），
    // 则返回当前时间节点的位置，从而使人员显示在当前时间节点的位置
    const { latlng: { lat: y1, lng: x1 }, uptime: out1 } = currentData;
    if (!nextData || currentTimeStamp < out1) {
      return { lat: y1, lng: x1 };
    }
    // 如果下个时间节点对应的数据存在，
    // 并且当前时间戳大于当前时间节点的离开时间（即人员已经离开当前时间节点，在去往下个时间节点的路上），
    // 则假设人员的移动速度是固定的，从而计算出当前位置
    else {
      const { latlng: { lat: y2, lng: x2 }, intime: in2 } = nextData;
      const percent = (currentTimeStamp - out1) / (in2 - out1);
      return {
        lat: y1 + (y2-y1)*percent,
        lng: x1 + (x2-x1)*percent,
      };
    }
  }

  /**
   * 获取reference
   * @param {number} currentIndex 当前时间节点
   * @return {object} reference
   */
  getReference = (currentIndex) => {
    const { data, tree } = this.props;
    const currentData = data[currentIndex];
    if (currentData) {
      return tree[currentData.areaId];
    }
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
   * 播放按钮点击事件
   */
  handlePlay = () => {
    const { onPlay, startTime, endTime } = this.props;
    if (startTime && endTime) {
      const { currentTimeStamp, drawProps } = this.state;
      let extra;
      // 如果当前时间戳已经是结束时间，则重新开始播放
      if (currentTimeStamp === endTime) {
        const currentIndex = this.getCurrentIndex(startTime);
        extra = {
          currentTimeStamp: startTime,
          currentIndex,
          drawProps: { ...drawProps, ...this.getDrawProps(currentIndex, startTime, true) },
        };
      }
      this.setState({
        // 显示暂停按钮
        playing: true,
        ...extra,
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
    const { playing, currentIndex, drawProps } = this.state;
    const currentTimeStamp = e.currentTimeStamp || this.getCurrentTimeStamp(e);
    const nextIndex = this.getCurrentIndex(currentTimeStamp);
    // 清除变量以方便重新计算
    this.unsetFrameTimer();
    this.setState({
      // 重置当前时间戳（即重置时间轴进度）
      currentTimeStamp,
      // 重置当前时间节点（即重置人员位置）
      currentIndex: nextIndex,
      // 重置绘图参数
      drawProps: { ...drawProps, ...this.getDrawProps(nextIndex, currentTimeStamp, currentIndex !== nextIndex) },
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
   * 点击
   */
  handleClick = (e) => {
    const { target: { options: { data: { intime }={} }={} } } = e;
    if (intime) {
      this.handleLocate({ currentTimeStamp: intime });
    }
  }

  /**
   * 渲染
   */
  render() {
    const {
      // 起始时间
      startTime,
      // 结束时间
      endTime,
    } = this.props;
    const { playing, currentTimeStamp, speed, tooltip: { visible, left, top, content }, drawProps } = this.state;
    // 当前时间轴宽度
    const width = currentTimeStamp ? `${(currentTimeStamp - startTime) / (endTime - startTime) * 100}%` : 0;
    // 播放按钮类名
    const playButtonClassName = classNames(styles.playButton, startTime && endTime ? undefined : styles.disabledPlayButton);
    // // 是否已经减速到最小速率
    // const isMinSpeed = speed === MIN_SPEED;
    // // 是否已经加速大最大速率
    // const isMaxSpeed = speed === MAX_SPEED;
    // console.log(drawProps);

    return (
      <div className={styles.container}>
        {/* 内容容器 */}
        <div className={styles.contentWrapper}>
          <ImageDraw
            style={{ height: '100%', padding: '1em' }}
            zoomControl={false}
            mapProps={DEFAULT_MAP_PROPS}
            autoZoom
            onClick={this.handleClick}
            {...drawProps}
          />
        </div>
        {/* 控件容器 */}
        <div className={styles.controlWrapper}>
          {/* 时间轴 */}
          <div className={styles.timeBar} onClick={this.handleLocate} onMouseMove={this.showTooltip} onMouseLeave={this.hideTooltip}>
            {/* 当前时间轴 */}
            <div className={styles.currentTimeBar} style={{ width }} />
          </div>
          {/* 按钮栏 */}
          <div className={styles.buttonBar}>
            {/* 起始时间 */}
            <div className={styles.startTime}>{startTime && moment(startTime).format(DEFAULT_TIME_FORMAT)}</div>
            {/* 结束时间 */}
            <div className={styles.endTime}>{endTime && moment(endTime).format(DEFAULT_TIME_FORMAT)}</div>
            <div className={styles.playButtonWrapper}>
              {/* 正在播放时显示暂停按钮，否则显示播放按钮 */}
              {playing ? (
                <Icon
                  type="pause-circle"
                  theme="filled"
                  className={playButtonClassName}
                  onClick={this.handlePause}
                />
              ) : (
                <Icon
                  type="play-circle"
                  theme="filled"
                  className={playButtonClassName}
                  onClick={this.handlePlay}
                />
              )}
            </div>
            {/* 减速按钮 */}
            {/* <Icon
              type="step-backward"
              className={styles.button}
              style={isMinSpeed ? { color: '#999', cursor: 'not-allowed' } : undefined}
              onClick={isMinSpeed ? undefined: this.handleDecelerate}
              onMouseEnter={(e) => {this.showTooltip(`减速，当前${speed}x`, e);}}
              onMouseLeave={this.hideTooltip}
            /> */}
            {/* 加速按钮 */}
            {/* <Icon
              type="step-forward"
              className={styles.button}
              style={isMaxSpeed ? { color: '#999', cursor: 'not-allowed' } : undefined}
              onClick={isMaxSpeed ? undefined: this.handleAccelerate}
              onMouseEnter={(e) => {this.showTooltip(`加速，当前${speed}x`, e);}}
              onMouseLeave={this.hideTooltip}
            /> */}
          </div>
        </div>
        {/* tooltip */}
        {visible && <div className={styles.tooltip} style={{ left, top }}>{content}</div>}
      </div>
    );
  }
}
