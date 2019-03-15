import React, { PureComponent } from 'react';
import { Icon, Tooltip } from 'antd';
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
 * 5.鼠标移到时间轴上显示鼠标所在的时间戳
 * 6.鼠标点击时间轴跳转到鼠标所在的时间戳
 * 7.点击左侧列表中的时间节点将时间轴跳转到对应的时间节点
 */
// 当ids发生变化，或者当ids的长度为1并且索引发生变化时重置区域等参数

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
  speed: MIN_SPEED,
  // 是否是最小速率
  isMinSpeed: true,
  // 是否是最大速率
  isMaxSpeed: false,
  // 是否为第一条数据
  isFirst: true,
  // 是否为最后一条数据
  isLast: true,
  // 提示框
  tooltip: {},
  // 当前的时间节点
  currentIndexes: [],
  // 是否空数据
  isEmpty: true,
};
// 报警状态字典
const alarmStatusDict = {
  1: 'SOS',
  2: '越界',
  3: '长时间逗留',
};

/**
 * description: 历史轨迹播放
 */
export default class MultipleHistoryPlay extends PureComponent {
  // 组件内仓库
  state = {
    ...defaultState,
    // 绘图组件参数
    drawProps: {},
  };

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
  componentDidUpdate({ ids: prevIds, idMap: prevIdMap, tree: prevTree }) {
    const { ids, idMap, tree, startTime, endTime } = this.props;
    // 当源数据发生变化时，重置各种播放参数
    if (idMap !== prevIdMap || ids !== prevIds) {
      console.log(ids);
      console.log(idMap);
      console.log(startTime);
      console.log(endTime);
      this.unsetFrameTimer();
      const currentTimeStamp = startTime;
      // 获取初始时间节点
      const currentIndexes = this.getCurrentIndexes(currentTimeStamp);
      this.setState(({ speed, isMinSpeed, isMaxSpeed, drawProps }) => {
        return {
          // 重置播放设置
          ...defaultState,
          // 保留播放播放速率
          speed,
          isMinSpeed,
          isMaxSpeed,
          // 设置初始时间戳
          currentTimeStamp,
          // 设置初始时间节点
          currentIndexes,
          // 设置绘图参数
          drawProps: this.treeUpdated ? {
            ...drawProps,
            ...this.getDrawProps({ currentIndexes, currentTimeStamp }),
          } : undefined,
          // 设置跳转状态
          ...this.getStepStatus(currentIndexes),
          // 设置是否为空数据
          isEmpty: ids.some((id) => !idMap[id] || idMap[id].length === 0),
        };
      });
      this.dataUpdated = true;
    }
    // 当区域树发生变化时，修改单位图地址
    if (tree !== prevTree) {
      this.setState({
        drawProps: {
          url: tree.url,
        },
      }, () => {
        if (this.dataUpdated) {
          this.setState(({ drawProps, currentIndexes }) => ({
            drawProps: {
              ...drawProps,
              ...this.getDrawProps({ currentIndexes, currentTimeStamp: startTime }),
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
  };

  /**
   * 清除请求动画帧函数定时器
   */
  unsetFrameTimer = () => {
    window.cancelAnimationFrame(this.frameTimer);
    this.frameStart = null;
    this.playingStart = null;
  };

  /**
   * 请求动画帧函数回调
   * 说明：
   * 1.重置时间条
   * 2.重置点位
   * 3.当前时间大于等于结束时间时，停止移动
   * 4.当前时间为undefined时，默认为起始时间
   */
  frameCallback = timestamp => {
    const { startTime, endTime, ids } = this.props;
    const { currentTimeStamp: prevTimeStamp, currentIndexes: prevIndexes, speed, drawProps } = this.state;
    if (!this.frameStart) {
      this.frameStart = timestamp;
      this.playingStart = prevTimeStamp || startTime;
      this.setFrameTimer();
      return;
    }
    // 获取当前时间戳
    let currentTimeStamp = this.playingStart + (timestamp - this.frameStart) * speed;
    if (currentTimeStamp >= endTime) {
      this.unsetFrameTimer();
      currentTimeStamp = endTime;
      const currentIndexes = this.getCurrentIndexes(currentTimeStamp, prevIndexes);
      this.setState({
        playing: false,
        currentTimeStamp,
        currentIndexes,
        // 设置跳转状态
        ...this.getStepStatus(currentIndexes),
        drawProps: { ...drawProps, ...this.getDrawProps({ currentIndexes, currentTimeStamp, reset: ids.length === 1 && prevIndexes[0] !== currentIndexes[0] }) },
      });
    }
    else {
      const currentIndexes = this.getCurrentIndexes(currentTimeStamp, prevIndexes);
      this.setState({
        currentTimeStamp,
        currentIndexes,
        // 设置跳转状态
        ...this.getStepStatus(currentIndexes),
        drawProps: { ...drawProps, ...this.getDrawProps({ currentIndexes, currentTimeStamp, reset: ids.length === 1 && prevIndexes[0] !== currentIndexes[0] }) },
      });
      this.setFrameTimer();
    }
  };

  /**
   * 显示提示框
   * @param {event} e 鼠标事件对象
   */
  showTooltip = (e) => {
    // 根据鼠标在时间轴上的位置获取对应的时间戳
    const currentTime = moment(this.getCurrentTimeStamp(e)).format(DEFAULT_TIME_FORMAT);
    this.setState({
      tooltip: {
        visible: true,
        content: currentTime,
        left: e.clientX,
        top: e.clientY,
      },
    });
  };

  /**
   * 隐藏提示框
   */
  hideTooltip = () => {
    this.setState({
      tooltip: {},
    });
  };

  /**
   * 获取绘图组件参数
   * @param {number} currentIndexes 当前时间节点
   * @param {number} currentTimeStamp 当前时间戳
   * @param {number} reset 是否重置所有参数
   * @return {object} 需要改变的组件参数对象
   */
  getDrawProps = ({ currentIndexes, currentTimeStamp, reset=true }) => {
    // 不管当前区域是否发生变化，人员位置始终改变
    const divIcons = this.getDivIcons(currentIndexes, currentTimeStamp);
    // 重置所有参数
    if (reset) {
      const currentIndex = currentIndexes[0];
      return {
        // 楼层
        images: this.getImages(currentIndex),
        // 区域
        data: this.getAreas(currentIndex),
        // 居中
        reference: this.getReference(currentIndex),
        // 人员
        divIcons,
        // 信标点
        // circleMarkers: this.getCircleMarkers(currentIndex),
        // 箭头
        // arrows: this.getArrows(currentIndex),
      };
    }
    // 修改人员位置
    return { divIcons };
  }

  /**
   * 获取人员数组
   * @param {number} currentIndexes 当前时间节点
   * @param {number} currentTimeStamp 当前时间戳
   * @return {array} 人员数据
   */
  getDivIcons = (currentIndexes, currentTimeStamp) => {
    const { ids=[], idMap={} } = this.props;
    // 获取位置
    const obj = ids.reduce((result, id, index) => {
      const list = idMap[id] || [];
      const currentIndex = currentIndexes[index];
      const currentData = list[currentIndex];
      if (currentData) {
        const nextData = list[currentIndex + 1];
        const {
          id,
          latlng: { lat: y1, lng: x1 },
          uptime: out1,
          isAlarm,
          isVistor,
          userName,
          vistorName,
          locationStatusHistoryList,
        } = currentData;
        let latlng;
        // 如果下个时间节点对应的数据不存在（即当前为最后一个时间节点），
        // 或者当前时间戳小于当前时间节点的离开时间（即人员还没有从当前时间节点离开），
        // 则返回当前时间节点的位置，从而使人员显示在当前时间节点的位置
        if (!nextData || currentTimeStamp <= out1) {
          latlng = { lat: y1, lng: x1 };
        }
        // 如果下个时间节点对应的数据存在，
        // 并且当前时间戳大于当前时间节点的离开时间（即人员已经离开当前时间节点，在去往下个时间节点的路上），
        // 则假设人员的移动速度是固定的，从而计算出当前位置
        else {
          const {
            latlng: { lat: y2, lng: x2 },
            intime: in2,
          } = nextData;
          const percent = (currentTimeStamp - out1) / (in2 - out1);
          latlng = {
            lat: y1 + (y2 - y1) * percent,
            lng: x1 + (x2 - x1) * percent,
          };
        }
        const key = `${latlng.lat},${latlng.lng}`;
        // 如果已经存在相同位置的数据，则进行聚合操作
        const { count=0, alarm=[] } = result[key] || {};
        result[key] = {
          id,
          count: count+1,
          latlng,
          alarm: isAlarm ? locationStatusHistoryList.reduce((result, { status }) => {
            const label = alarmStatusDict[status];
            if (!result.includes(label)) {
              result.push(label);
            }
            return result;
          }, alarm) : alarm,
          isVistor,
          userName,
          vistorName,
        };
      }
      return result;
    }, {});
    return Object.values(obj).map(({ id, count, latlng, alarm, isVistor, userName, vistorName }) => {
      const isAlarm = alarm.length > 0;
      let className;
      let personTitle;
      if (count === 1) {
        if (isVistor) {
          if (isAlarm) {
            className = styles.redVistor;
          }
          else {
            className = styles.blueVistor;
          }
        }
        else {
          if (isAlarm) {
            className = styles.redPerson;
          }
          else {
            className = styles.bluePerson;
          }
        }
        personTitle = `<div class="${styles.personName}">${isVistor?vistorName||'访客':userName||'未领'}</div>`;
      }
      else {
        if (isAlarm) {
          className = styles.redPeople;
        }
        else {
          className = styles.bluePeople;
        }
        personTitle = `<div class="${styles.personCount}" style="background-color: ${isAlarm ? '#ff0019' : '#04FDFF'};">${count}</div>`;
      }
      return {
        id,
        latlng,
        iconProps: {
          iconSize: [37, 37],
          iconAnchor: count === 1 && isVistor ? [18.5, 32] : [18.5, 37],
          className: styles.personContainer,
          html: `<div class="${className}">${personTitle}${isAlarm ? `<div class="${styles.alarm}">${alarm.join('，')}</div>` : ''}</div>`,
        },
      };
    });
  };

  /**
   * 获取楼层图片数组
   * @param {number} currentIndex 当前时间节点
   * @return {array} 从当前时间节点往上遍历得到的不同楼层图片数组，不包括单位图
   */
  getImages = (currentIndex) => {
    const { tree={}, idMap={}, ids=[] } = this.props;
    const data = idMap[ids[0]] || [];
    // 当前时间节点对应的数据
    const currentData = data[currentIndex];
    // 当前区域存在时，才进行遍历操作
    if (currentData && currentData.areaId && tree[currentData.areaId]) {
      // 根据当前时间节点所在的区域id获取到区域对象
      let image = tree[currentData.areaId];
      const images = [];
      // 循环获取父区域直到最顶层，通过比较父子区域的图片，将不同的图片插入数组
      while (image) {
        const { parentId, mapId, companyMap } = image;
        const parent = tree[parentId];
        // 父区域存在，则和父区域比较图片是否相等，父区域不存在，则和单位图比较图片是否相等，不相等则插入数组
        if ((parent && mapId !== parent.mapId) || (!parent && mapId !== companyMap)) {
          images.unshift(image);
        }
        image = parent;
      }
      return images;
    }
  };

  /**
   * 获取区域数组
   * @param {number} currentIndex 当前时间节点
   * @return {array} 当前时间节点所在区域及其非楼层子区域组成的区域数组
   */
  getAreas = (currentIndex) => {
    const { tree={}, idMap={}, ids=[], originalTree=[] } = this.props;
    const data = idMap[ids[0]] || [];
    // 当前时间节点对应的数据
    const currentData = data[currentIndex];
    // 当前区域存在时，则返回当前区域及其非楼层子区域组成的区域数组
    if (currentData && currentData.areaId && tree[currentData.areaId]) {
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
      return [
        {
          ...currentArea,
          options: { color: '#666' },
        },
      ].concat(list);
    }
    // 否则返回单位图直属的区域
    return originalTree.map(({ id }) => tree[id]);
  }

  /**
   * 获取reference
   * @param {number} currentIndex 当前时间节点
   * @return {object} reference
   */
  getReference = currentIndex => {
    const { tree={}, idMap={}, ids=[] } = this.props;
    const data = idMap[ids[0]] || [];
    const currentData = data[currentIndex];
    if (currentData) {
      return tree[currentData.areaId];
    }
  };

  /**
   * 获取信标点
   * @param {number} currentIndex 当前时间节点
   * @return {array} 当前时间节点所属区域中的信标数组
   */
  getCircleMarkers = (currentIndex) => {
    const { tree={}, idMap={}, ids=[] } = this.props;
    const data = idMap[ids[0]] || [];
    // 当前时间节点对应的数据
    const currentData = data[currentIndex];
    // 当前区域存在时，返回当前区域中的信标
    if (currentData && currentData.areaId && tree[currentData.areaId]) {
      return data.filter(({ areaId }) => areaId === currentData.areaId);
    }
    // 否则返回单位图所属信标
    return data.filter(({ areaId }) => !tree[areaId]);
  }

  /**
   * 获取当前时间节点和下个时间节点间的指向性箭头
   * @param {number} currentIndex 当前时间节点
   * @return {array} 箭头图片数组
   */
  getArrows(currentIndex) {
    const { idMap={}, ids=[] } = this.props;
    const data = idMap[ids[0]] || [];
    // 确保两个时间节点都存在，这样箭头才存在
    if (data[currentIndex] && data[currentIndex + 1]) {
      const {
        latlng: { lat: y1, lng: x1 },
        id,
      } = data[currentIndex];
      const {
        latlng: { lat: y2, lng: x2 },
        options: { color = '#00a8ff' } = {},
      } = data[currentIndex + 1];
      const tX1 = x1 + (x2 - x1) * 0.2;
      const tY1 = y1 + (y2 - y1) * 0.2;
      const tX2 = x2 + (x1 - x2) * 0.2;
      const tY2 = y2 + (y1 - y2) * 0.2;
      // 计算起点和终点坐标
      const lng1 = Math.min(x1, x2) - 0.01; // 左下角的横坐标
      const lat1 = Math.min(y1, y2) - 0.01; // 左下角的纵坐标
      const lng2 = Math.max(x1, x2) + 0.01; // 右上角的横坐标
      const lat2 = Math.max(y1, y2) + 0.01; // 右上角的纵坐标
      const pX1 = `${((tX1 - lng1) / (lng2 - lng1)) * 100}%`; // x1在图上转换以后的坐标
      const pY1 = `${(1 - (tY1 - lat1) / (lat2 - lat1)) * 100}%`; // y1在图上转换以后的坐标
      const pX2 = `${((tX2 - lng1) / (lng2 - lng1)) * 100}%`; // x2在图上转换以后的坐标
      const pY2 = `${(1 - (tY2 - lat1) / (lat2 - lat1)) * 100}%`; // y2在图上转换以后的坐标
      return [
        {
          id,
          url: encodeURI(
            `data:image/svg+xml;charset=utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'><defs><marker id='arrow' markerWidth='9' markerHeight='6' refX='0' refY='3' orient='auto' markerUnits='strokeWidth'><path d='M0,0 L0,6 L9,3 z' fill='${color}' /></marker></defs><line x1='${pX1}' y1='${pY1}' x2='${pX2}' y2='${pY2}' stroke='${color}' stroke-width='1' marker-end='url(#arrow)' /></svg>`
          ),
          latlngs: [
            { lat: lat1, lng: lng1 },
            { lat: lat2, lng: lng1 },
            { lat: lat2, lng: lng2 },
            { lat: lat1, lng: lng2 },
          ],
        },
      ];
    }
  }

  /**
   * 获取鼠标所在位置对应的时间戳
   * @param {event} e 鼠标事件对象
   * @return {number} 时间戳
   */
  getCurrentTimeStamp = e => {
    const { startTime, endTime } = this.props;
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const rate = (e.clientX - left) / width;
    return startTime + rate * (endTime - startTime);
  };

  /**
   * 获取当前时间节点
   * @param {number} currentTimeStamp 当期时间戳
   * @param {number} prevIndexes 之前计算的时间节点
   * @return {number} 根据当前时间戳计算得到的时间节点
   */
  getCurrentIndexes = (currentTimeStamp, prevIndexes = []) => {
    const { ids=[], idMap={} } = this.props;
    return ids.map((id, index) => {
      // 获取当前人员的数据列表
      const list = idMap[id] || [];
      // 获取初始时间节点
      let currentIndex = prevIndexes[index] === undefined ? -1 : prevIndexes[index];
      // 循环数组找出已经经过的进入时间离当前时间戳最近的时间节点
      for (let i = currentIndex + 1; i < list.length; i++) {
        if (list[i].intime > currentTimeStamp) {
          break;
        }
        currentIndex = i;
      }
      if (
        // 如果当前时间节点为最后一个时间节点，
        currentIndex === list.length - 1 &&
        // 并且最后一个时间节点存在（即list的长度大于0），
        list[currentIndex] &&
        // 并且最后一个时间节点的离开时间小于当前时间戳（即人员已经离开最后一个时间节点），
        list[currentIndex].uptime < currentTimeStamp
        // // 保证人员在最后一个时间节点至少1秒
        // && list[currentIndex].intime <= currentTimeStamp - 1000
      ) {
        // 则将当前时间节点设置为list.length（即不显示人员）
        currentIndex = list.length;
      }
      return currentIndex;
    });
  };

  /**
   * 获取跳转状态
   * @param {number} currentIndexes 当前时间节点
   * @return {object}
   */
  getStepStatus = (currentIndexes) => {
    const { ids=[], idMap={} } = this.props;
    return ids.reduce((result, id, index) => {
      // 获取当前人员的数据列表
      const list = idMap[id] || [];
      // 获取初始时间节点
      let currentIndex = currentIndexes[index];
      if (list.length > 0) {
        if (currentIndex > 0) {
          result.isFirst = false;
        }
        if (!(currentIndex >= list.length - 1)) {
          result.isLast = false;
        }
      }
      return result;
    }, { isFirst: true, isLast: true });
  }

  /**
   * 播放按钮点击事件
   */
  handlePlay = () => {
    const { onPlay, startTime, endTime, ids=[] } = this.props;
    const { currentTimeStamp: prevTimeStamp, currentIndexes: prevIndexes, drawProps } = this.state;
    let extra;
    // 如果当前时间戳已经是结束时间，则重新开始播放
    if (prevTimeStamp === endTime) {
      const currentTimeStamp = startTime;
      const currentIndexes = this.getCurrentIndexes(currentTimeStamp);
      extra = {
        currentTimeStamp,
        currentIndexes,
        // 设置跳转状态
        ...this.getStepStatus(currentIndexes),
        drawProps: { ...drawProps, ...this.getDrawProps({ currentIndexes, currentTimeStamp, reset: ids.length === 1 && prevIndexes[0] !== currentIndexes[0] }) },
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
  };

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
  };

  /**
   * 加速按钮点击事件
   */
  handleAccelerate = () => {
    const { onAccelerate } = this.props;
    // 清除变量以方便按照新的速率重新计算
    this.unsetFrameTimer();
    this.setState(
      ({ speed: prevSpeed }) => {
        const speed = prevSpeed * 2;
        return {
          // 重置播放速率
          speed,
          isMinSpeed: speed === MIN_SPEED,
          isMaxSpeed: speed === MAX_SPEED,
        };
      },
      () => {
        // 根据是否在播放决定是否重置定时器
        if (this.state.playing) {
          this.setFrameTimer();
        }
      }
    );
    // 若有onAccelerate传参则调用
    if (onAccelerate) {
      onAccelerate();
    }
  };

  /**
   * 减速按钮点击事件
   */
  handleDecelerate = () => {
    const { onDecelerate } = this.props;
    // 清除变量以方便按照新的速率重新计算
    this.unsetFrameTimer();
    this.setState(
      ({ speed: prevSpeed }) => {
        const speed = prevSpeed / 2;
        return {
          // 重置播放速率
          speed,
          isMinSpeed: speed === MIN_SPEED,
          isMaxSpeed: speed === MAX_SPEED,
        };
      },
      () => {
        // 根据是否在播放决定是否重置定时器
        if (this.state.playing) {
          this.setFrameTimer();
        }
      }
    );
    // 若有onDecelerate传参则调用
    if (onDecelerate) {
      onDecelerate();
    }
  };

  /**
   * 点击时间轴快速跳转
   * @param {event} e 鼠标事件对象
   */
  handleLocate = e => {
    const { onLocate, ids } = this.props;
    const { playing, currentIndexes: prevIndexes, drawProps } = this.state;
    const currentTimeStamp = e.currentTimeStamp || this.getCurrentTimeStamp(e);
    const currentIndexes = this.getCurrentIndexes(currentTimeStamp);
    // 清除变量以方便重新计算
    this.unsetFrameTimer();
    this.setState({
      // 重置当前时间戳（即重置时间轴进度）
      currentTimeStamp,
      // 重置当前时间节点（即重置人员位置）
      currentIndexes,
      // 设置跳转状态
      ...this.getStepStatus(currentIndexes),
      // 重置绘图参数
      drawProps: { ...drawProps, ...this.getDrawProps({ currentIndexes, currentTimeStamp, reset: ids.length === 1 && prevIndexes[0] !== currentIndexes[0] }) },
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
  };

  /**
   * 跳转到上一个点
   */
  handlePrev = () => {
    const { ids=[], idMap={} } = this.props;
    const { currentIndexes=[], currentTimeStamp: prevTimeStamp } = this.state;
    // 遍历当前时间节点获取离当前时间戳最近的进入时间
    const { currentTimeStamp } = ids.reduce((result, id, index) => {
      const { currentTimeStamp, max } = result;
      // 获取当前人员的数据列表
      const list = idMap[id] || [];
      // 获取当前时间节点
      const currentIndex = Math.min(currentIndexes[index], list.length - 1);
      // 获取当前时间节点对应的数据
      const currentData = list[currentIndex];
      if (currentData) {
        if (currentData.intime === prevTimeStamp) {
          const prevData = list[currentIndex - 1];
          if (prevData) {
            if (!max) {
              result.max = currentData.intime;
            }
            else if (currentData.intime > max) {
              result.max = currentData.intime;
              result.currentTimeStamp = max;
            }
            if (!result.currentTimeStamp || prevData.intime > result.currentTimeStamp) {
              result.currentTimeStamp = prevData.intime;
            }
          }
        }
        else {
          if (!max) {
            result.max = currentData.intime;
          }
          else if (currentData.intime > max){
            result.max = currentData.intime;
            result.currentTimeStamp = max;
          }
          else if (currentData.intime < max && (!currentTimeStamp || currentData.intime > currentTimeStamp)) {
            result.currentTimeStamp = currentData.intime;
          }
        }
      }
      return result;
    }, { currentTimeStamp: undefined, max: undefined });
    if (currentTimeStamp) {
      this.handleLocate({ currentTimeStamp });
    }
  }

  /**
   * 跳转到下一个点
   */
  handleNext = () => {
    const { ids=[], idMap={} } = this.props;
    const { currentIndexes=[] } = this.state;
    // 遍历下个时间节点获取离当前时间戳最近的进入时间
    const currentTimeStamp = ids.reduce((currentTimeStamp, id, index) => {
      // 获取当前人员对应的数据列表
      const list = idMap[id] || [];
      // 获取下个时间节点
      const nextIndex = currentIndexes[index] + 1;
      // 获取下个时间节点对应的数据
      const nextData = list[nextIndex];
      // 这里不需要判断intime是否大于prevTimeStamp
      if (nextData && (!currentTimeStamp || nextData.intime < currentTimeStamp)) {
        return nextData.intime;
      }
      return currentTimeStamp;
    }, undefined);
    if (currentTimeStamp) {
      this.handleLocate({ currentTimeStamp });
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
    const {
      playing,
      currentTimeStamp,
      speed,
      isMinSpeed,
      isMaxSpeed,
      isFirst,
      isLast,
      tooltip: { visible, left, top, content },
      drawProps,
      isEmpty,
    } = this.state;
    // 当前时间轴宽度
    const width = currentTimeStamp
      ? `${((currentTimeStamp - startTime) / (endTime - startTime)) * 100}%`
      : 0;
    // 播放按钮类名
    const playButtonClassName = classNames(
      styles.playButton,
      isEmpty ? styles.disabled : undefined,
    );

    // console.log(drawProps);
    // console.log(idMap);
    // console.log(ids);
    console.log(this.state.currentIndexes);

    return (
      <div className={styles.container}>
        {/* 内容容器 */}
        <div className={styles.contentWrapper}>
          <ImageDraw
            style={{ height: '100%', padding: '1em' }}
            zoomControl={false}
            mapProps={DEFAULT_MAP_PROPS}
            autoZoom
            {...drawProps}
          />
        </div>
        {/* 控件容器 */}
        <div className={styles.controlWrapper}>
          {/* 时间轴 */}
          <div
            className={styles.timeBar}
            onClick={isEmpty?undefined:this.handleLocate}
            onMouseMove={isEmpty?undefined:this.showTooltip}
            onMouseLeave={isEmpty?undefined:this.hideTooltip}
          >
            {/* 当前时间轴 */}
            <div className={styles.currentTimeBar} style={{ width }} />
          </div>
          {/* 按钮栏 */}
          <div className={styles.buttonBar}>
            {/* 起始时间 */}
            <div className={styles.startTime}>
              {startTime && moment(startTime).format(DEFAULT_TIME_FORMAT)}
            </div>
            {/* 结束时间 */}
            <div className={styles.endTime}>
              {endTime && moment(endTime).format(DEFAULT_TIME_FORMAT)}
            </div>
            {/* 下个点跳转按钮 */}
            <Tooltip title="后退">
              <Icon
                type="step-backward"
                className={classNames(styles.button, isFirst?styles.disabled:undefined)}
                onClick={isFirst ? undefined: this.handlePrev}
              />
            </Tooltip>
            {/* 减速按钮 */}
            <Tooltip title={`减速，当前${speed}x`}>
              <Icon
                type="backward"
                className={classNames(styles.button, isMinSpeed?styles.disabled:undefined)}
                onClick={isMinSpeed ? undefined: this.handleDecelerate}
              />
            </Tooltip>
            <div className={styles.playButtonWrapper}>
              {/* 正在播放时显示暂停按钮，否则显示播放按钮 */}
              {playing ? (
                <Icon
                  type="pause-circle"
                  theme="filled"
                  className={playButtonClassName}
                  onClick={isEmpty?undefined:this.handlePause}
                />
              ) : (
                <Icon
                  type="play-circle"
                  theme="filled"
                  className={playButtonClassName}
                  onClick={isEmpty?undefined:this.handlePlay}
                />
              )}
            </div>
            {/* 加速按钮 */}
            <Tooltip title={`加速，当前${speed}x`}>
              <Icon
                type="forward"
                className={classNames(styles.button, isMaxSpeed?styles.disabled:undefined)}
                onClick={isMaxSpeed ? undefined: this.handleAccelerate}
              />
            </Tooltip>
            {/* 下个点跳转按钮 */}
            <Tooltip title="前进">
              <Icon
                type="step-forward"
                className={classNames(styles.button, isLast?styles.disabled:undefined)}
                onClick={isLast ? undefined: this.handleNext}
              />
            </Tooltip>
          </div>
        </div>
        {/* tooltip */}
        {visible && (
          <div className={styles.tooltip} style={{ left, top }}>
            {content}
          </div>
        )}
      </div>
    );
  }
}
