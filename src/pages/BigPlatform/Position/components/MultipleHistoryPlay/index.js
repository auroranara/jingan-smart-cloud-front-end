import React, { PureComponent, Fragment } from 'react';
import { Icon, Tooltip } from 'antd';
import moment from 'moment';
import classNames from 'classnames';
import ImageDraw, { L } from '@/components/ImageDraw';
// 引入样式文件
import styles from './index.less';

/**
 * 能够改变当前时间戳的几种方式：
 * 1.源数据重置
 * 2.播放回调函数
 * 3.时间轴点击跳转
 * 4.播放完毕重新播放
 */
/**
 * 注意：
 * 1.初始化时必须保证currentTimeStamp和currentAreaId有值
 * 2.确保区域树必须存在
 */

// 默认区域选项
const DEFAULT_AREA_OPTIONS = {
  color: '#00ffff',
  weight: 3,
  fill: false,
  fillOpacity: 0,
};
// 默认地图参数
const DEFAULT_MAP_PROPS = {
  boxZoom: false,
  doubleClickZoom: false,
  // dragging: false,
  scrollWheelZoom: false,
};
// 默认时间格式
const DEFAULT_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
// 最小速度
const MIN_SPEED = 1;
// 最大速度
const MAX_SPEED = 16;
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
    // 是否正在播放
    playing: false,
    // 当前时间戳
    currentTimeStamp: undefined,
    // 当前位置索引数组
    currentIndexes: [],
    // 当前区域id
    currentAreaId: undefined,
    // 播放速度
    speed: MIN_SPEED,
    // 是否为最小速度
    isMinSpeed: true,
    // 是否为最大速度
    isMaxSpeed: false,
    // 是否有数据
    enable: false,
    // 提示框
    tooltip: {},
    // 绘图组件参数
    drawProps: {},
  };

  // 动画帧定时器
  frameTimer = null;

  // 点击播放时的短时间戳
  frameStart = null;

  // 点击播放时的时间戳
  playingStart = null;

  isAlarmMap = {};

  currentIds = [];

  componentDidMount() {
    const { top } = this.props;
    if (top) {
      this.setState({ drawProps: { url: JSON.parse(top.companyMapPhoto).url } });
    }
  }

  /**
   * 更新后
   */
  componentDidUpdate({ ids: prevIds, idMap: prevIdMap }) {
    const { ids, idMap, startTime, top, selectedTableRow, tree } = this.props;
    // console.log(idMap);
    // console.log(ids);
    // 如果源数据发生变化，则重置所有参数，保留播放速度相关参数
    if (idMap !== prevIdMap) {
      // 移除播放定时器
      this.unsetFrameTimer();
      // 获取当前时间戳
      const currentTimeStamp = startTime;
      // 获取当前位置索引数组
      const currentIndexes = this.getCurrentIndexes({ currentTimeStamp });
      // 如果只有一个人，则区域跟着人变化
      let currentAreaId = top.id;
      if (selectedTableRow !== 'all') {
        const currentData = idMap[ids[0]][currentIndexes[0]];
        if (currentData) {
          currentAreaId = currentData.areaId || top.id; // 如果在厂内，则取当前区域id，不在厂内，则取最顶层区域id
        }
      }
      // console.log(tree);
      // 重置参数
      this.setState(({ speed, isMinSpeed, isMaxSpeed }) => ({
        // 重置播放状态
        playing: false,
        // 保留播放速度相关参数
        speed,
        isMinSpeed,
        isMaxSpeed,
        // 重置当前时间戳
        currentTimeStamp,
        // 重置当前位置索引
        currentIndexes,
        // 重置当前区域id
        currentAreaId,
        // 重置绘图参数
        drawProps: {
          url: JSON.parse(top.companyMapPhoto).url, // 取最顶层区域的单位图作为背景
          ...this.getDrawProps({ currentAreaId, currentIndexes, currentTimeStamp, reset: true }),
        },
        // 重置是否有数据(只要有一条数据就认为有数据)
        enable: ids.some(id => idMap[id] && idMap[id].length > 0),
        // 重置提示框
        tooltip: {},
      }));
    }
    // 如果人员发生变化
    else if (ids !== prevIds) {
      // 移除播放定时器
      this.unsetFrameTimer();
      this.setState(({ currentTimeStamp, currentAreaId: prevAreaId, drawProps }) => {
        // 获取当前位置索引数组
        const currentIndexes = this.getCurrentIndexes({ currentTimeStamp });
        // 如果只有一个人，则区域跟着人变化
        let currentAreaId = prevAreaId;
        if (selectedTableRow !== 'all') {
          const currentData = idMap[ids[0]][currentIndexes[0]];
          if (currentData) {
            currentAreaId = currentData.areaId || top.id; // 如果在厂内，则取当前区域id，不在厂内，则取最顶层区域id
          }
        }
        return {
          currentAreaId,
          currentIndexes,
          drawProps: {
            ...drawProps,
            ...this.getDrawProps({ currentAreaId, currentIndexes, currentTimeStamp, reset: true/* currentAreaId !== prevAreaId */ }),
          },
        };
      }, () => {
        if (this.state.playing) {
          this.setFrameTimer();
        }
      });
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
   * 1.重置时间轴
   * 2.重置点位
   * 3.当前时间大于等于结束时间时，停止移动
   * 4.当前时间为undefined时，默认为起始时间
   */
  frameCallback = timestamp => {
    const { startTime, endTime, ids, idMap, top, selectedTableRow } = this.props;
    const { currentTimeStamp: prevTimeStamp, currentIndexes: prevIndexes, speed, drawProps, currentAreaId: prevAreaId } = this.state;
    if (!this.frameStart) {
      this.frameStart = timestamp;
      this.playingStart = prevTimeStamp || startTime;
      this.setFrameTimer();
      return;
    }
    // 获取当前时间戳
    const currentTimeStamp = Math.min(this.playingStart + (timestamp - this.frameStart) * speed, endTime);
    // 获取当前位置索引数组
    const currentIndexes = this.getCurrentIndexes(ids.length === prevIndexes.length ? { currentTimeStamp, prevTimeStamp, prevIndexes } : { currentTimeStamp });
    // 获取当前区域id
    let currentAreaId = prevAreaId;
    // 如果只有一个人，则区域跟着人变化
    if (selectedTableRow !== 'all') {
      const currentData = idMap[ids[0]][currentIndexes[0]];
      if (currentData) {
        currentAreaId = currentData.areaId || top.id; // 如果在厂内，则取当前区域id，不在厂内，则取最顶层区域id
      }
    }
    // 如果当前时间戳已经大于等于结束时间，则停止播放
    if (currentTimeStamp === endTime) {
      this.unsetFrameTimer();
      this.setState({
        playing: false,
        currentTimeStamp,
        currentIndexes,
        currentAreaId,
        drawProps: { ...drawProps, ...this.getDrawProps({ currentAreaId, currentIndexes, currentTimeStamp, reset: currentAreaId !== prevAreaId }) },
      });
    }
    // 如果当前时间戳小于结束时间，则继续播放
    else {
      this.setState({
        currentTimeStamp,
        currentIndexes,
        currentAreaId,
        drawProps: { ...drawProps, ...this.getDrawProps({ currentAreaId, currentIndexes, currentTimeStamp, reset: currentAreaId !== prevAreaId }) },
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
   * @param {string} currentAreaId 当前区域id
   * @param {number} currentIndexes 当前位置索引数组
   * @param {number} currentTimeStamp 当前时间戳
   * @param {number} reset 是否重置组件的所有参数
   * @return {object} 需要改变的组件参数对象
   */
  getDrawProps = ({ currentAreaId, currentIndexes, currentTimeStamp, reset }) => {
    const { tree={}, onChange } = this.props;
    const currentArea = tree[currentAreaId];
    if (!currentArea) {
      return;
    }
    // 不管当前区域是否发生变化，人员位置始终改变
    const { locationMap, isAlarmMap, currentDataList } = this.getLocationMap({ currentArea, currentIndexes, currentTimeStamp });
    onChange(currentDataList);
    const divIcons = this.getDivIcons(locationMap);
    let drawProps;
    // 如果区域发生了变化
    if (reset) {
      drawProps = {
        // 楼层
        images: this.getImages(currentArea),
        // 区域
        data: this.getAreas(currentArea, isAlarmMap),
        // 居中
        reference: currentArea,
        // 人员
        divIcons,
        // 菜单
        menu: this.getMenu(currentArea, isAlarmMap),
        // 信标点
        // circleMarkers: this.getCircleMarkers(currentIndex),
        // 箭头
        // arrows: this.getArrows(currentIndex),
      };
    }
    // 如果区域没有发生变化但是状态发生了变化
    else if (isAlarmMap[currentAreaId] !== this.isAlarmMap[currentAreaId] || currentArea.children.some((childId) => isAlarmMap[childId] !== this.isAlarmMap[childId])) {
      drawProps = { divIcons, data: this.getAreas(currentArea, isAlarmMap), menu: this.getMenu(currentArea, isAlarmMap) };
    }
    // 如果区域和状态都没有发生变化
    else {
      drawProps = { divIcons };
    }
    this.isAlarmMap = isAlarmMap;
    return drawProps;
  }

  /**
   * 获取人员位置数组
   * @param {object} currentArea 当前区域
   * @param {number} currentIndexes 当前位置索引数组
   * @param {number} currentTimeStamp 当前时间戳
   * @return {array} 人员位置数组
   * 说明：
   * 1.排除不在当前区域的人员
   * 2.当前区域的楼层子区域不显示
   * 3.当前区域的非楼层子区域显示人员统计
   * 4.当前区域的直属人员才独立显示并有动画
   * 5.只有当前区域或子区域有报警，就认为当前区域有报警
   */
  getLocationMap = ({ currentArea, currentIndexes, currentTimeStamp }) => {
    const { ids, idMap, tree, top } = this.props;
    const { id: currentAreaId } = currentArea;
    // 遍历人员列表获取在当前区域内的人员的位置
    return ids.reduce((result, userId, index) => {
      const { locationMap, isAlarmMap, currentDataList } = result;
      // 获取人员对应的数据列表
      const list = idMap[userId] || [];
      // 获取人员的当前位置索引
      const currentIndex = currentIndexes[index];
      // 获取人员的当前数据
      const currentData = list[currentIndex];
      // 当前数据存在时才显示
      if (currentData) {
        const nextData = list[currentIndex + 1];
        const {
          id,
          latlng: { lat: y1, lng: x1 },
          uptime: out1,
          isAlarm,
          isVistor,
          userName,
          visitorName,
          locationStatusHistoryList,
        } = currentData;
        // 获取人员所属区域id
        const areaId = currentData.areaId || top.id;
        // 获取人员所属区域
        const area = tree[areaId];
        // 当前区域在人员所在区域的父区域列表中的索引
        const currentAreaIndex = area.parentIds.indexOf(currentAreaId);
        // 如果人员在当前区域内
        if (area === currentArea) {
          let latlng;
          // 如果下个位置索引对应的数据不存在（即当前为最后一个位置索引），
          // 或者当前时间戳小于当前位置索引的离开时间（即人员还没有从当前位置索引离开），
          // 则返回当前位置索引的位置，从而使人员显示在当前位置索引的位置
          if (!nextData || currentTimeStamp <= out1) {
            latlng = { lat: y1, lng: x1 };
          }
          // 如果下个位置索引对应的数据存在，
          // 并且当前时间戳大于当前位置索引的离开时间（即人员已经离开当前位置索引，在去往下个位置索引的路上），
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
          const key = `${latlng.lat.toFixed(2)},${latlng.lng.toFixed(2)}`;
          // 如果已经存在相同位置的数据，则进行聚合操作
          const { count=0, alarm=[] } = locationMap[key] || {};
          locationMap[key] = {
            id,
            count: count+1,
            latlng,
            alarm: isAlarm ? locationStatusHistoryList.reduce((alarm, { status }) => {
              const label = alarmStatusDict[status];
              if (!alarm.includes(label)) {
                alarm.push(label);
              }
              return alarm;
            }, alarm) : alarm,
            isVistor,
            userName,
            visitorName,
          };
          if (isAlarm && !isAlarmMap[currentAreaId]) {
            isAlarmMap[currentAreaId] = true;
          }
          currentDataList.push(currentData);
        }
        // 如果人员在当前区域子区域内
        else if (currentAreaIndex > -1) {
          // 获取人员所属区域树中离当前区域最近的区域id
          const key = area.parentIds[currentAreaIndex + 1] || areaId;
          // 最近区域如果不是楼层才显示
          if (!tree[key].isFloor) {
            const { count=0, alarm=[], latlng } = locationMap[key] || {};
            locationMap[key] = {
              id: key,
              count: count+1,
              latlng: latlng || this.getAreaCenter(tree[key]),
              alarm: isAlarm ? locationStatusHistoryList.reduce((alarm, { status }) => {
                const label = alarmStatusDict[status];
                if (!alarm.includes(label)) {
                  alarm.push(label);
                }
                return alarm;
              }, alarm) : alarm,
              isVistor,
              userName,
              visitorName,
            };
          }
          if (isAlarm) {
            if (!isAlarmMap[currentAreaId]) {
              isAlarmMap[currentAreaId] = true;
            }
            if (!isAlarmMap[key]) {
              isAlarmMap[key] = true;
            }
          }
          currentDataList.push(currentData);
        }
        // 如果当前区域为楼层，则也统计同建筑楼层是否报警
        else if (currentArea.isFloor){
          const index = area.parentIds.indexOf(currentArea.parentId);
          if (index > -1) {
            const key = area.parentIds[index + 1] || areaId;
            if (isAlarm && !isAlarmMap[key]) {
              isAlarmMap[key] = true;
            }
          }
        }
        // 否则不显示
      }
      return result;
    }, { locationMap: {}, isAlarmMap: {}, currentDataList: [] });
  };

  /**
   * 获取区域中心点
   */
  getAreaCenter = ({ latlng, latlngs, radius }) => {
    let center;
    if (radius) {
      center = latlng;
    }
    else {
      center = L.latLngBounds(latlngs).getCenter();
    }
    return center;
  }

  /**
   * 获取区域右上角
   */
  getAreaRightTop = ({ latlng, latlngs, radius }) => {
    let bounds;
    if (radius) {
      bounds = L.circle(latlng, radius).getBounds();
    }
    else {
      bounds = L.latLngBounds(latlngs);
    }
    return bounds.getNorthEast();
  }

  /**
   * 获取楼层切换菜单
   * @param {object} currentArea 当前区域
   * @param {boolean} isAlarmMap 报警区域对象
   * @return {object} 菜单对象
   */
  getMenu = (currentArea, isAlarmMap, selectedArea) => {
    const { tree, selectedTableRow } = this.props;
    const { id, isBuilding, isFloor, children, parentId } = currentArea;
    // 如果当前区域为建筑，则获取楼层子区域生成菜单对象
    if (isBuilding) {
      const floors = children.reduce((floors, id, index) => {
        const area = tree[id];
        const { isFloor, name } = area;
        if (isFloor) {
          floors.push(`<div class="${classNames({
            [styles.floor]: true,
            [styles.hoverableFloor]: selectedTableRow === 'all',
            [styles.alarmFloor]: isAlarmMap[id],
            [styles.selectedFloor]: selectedArea && selectedArea.id === id,
          })}" data-id="${id}">F${index+1}</div>`);
        }
        return floors;
      }, []);
      return {
        id,
        latlng: this.getAreaRightTop(selectedArea || currentArea),
        icon: L.divIcon({
          iconSize: ['auto', 'auto'],
          iconAnchor: [-3, 3],
          className: styles.menuContainer,
          html: `<div class="${styles.menu}">${floors.join('')}</div>`,
        }),
        category: 'menu',
      };
    }
    // 如果当前区域为楼层，则以父区域作为建筑获取楼层子区域生成菜单
    else if (isFloor) {
      return this.getMenu(tree[parentId], isAlarmMap, currentArea);
    }
    // 否则不显示菜单
  }

  /**
   * 获取人员数组
   * @param {array} locationMap 人员位置对象
   */
  getDivIcons = (locationMap) => {
    // 遍历人员位置
    return Object.values(locationMap).map(({ id, count, latlng, alarm, isVistor, userName, visitorName }) => {
      // 是否为报警状态
      const isAlarm = alarm.length > 0;
      // 人员元素类名
      let className;
      // 人员名称
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
        personTitle = `<div class="${styles.personName}">${isVistor?visitorName||'访客':userName||'未领'}</div>`;
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
        category: 'person',
      };
    });
  }

  /**
   * 获取楼层图片数组
   * @param {object} currentArea 当前区域
   * @return {array} 从当前位置索引往上遍历得到的不同楼层图片数组，不包括单位图
   */
  getImages = (currentArea) => {
    const { tree={} } = this.props;
    // 根据当前位置索引所在的区域id获取到区域对象
    let image = currentArea;
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
  };

  /**
   * 获取区域数组
   * @param {object} currentArea 当前区域
   * @param {boolean} isAlarmMap 报警区域对象
   * @return {array} 如果当前所在区域为顶层区域，则只显示报警的直属子区域，否则显示当前区域的边框，并显示报警的直属子区域
   */
  getAreas = (currentArea, isAlarmMap) => {
    const { tree, selectedTableRow } = this.props;
    // 获取非楼层的直属子区域
    const list = currentArea.children.reduce((arr, id) => {
      const item = tree[id];
      const isAlarm = isAlarmMap[id];
      if (!item.isFloor) {
        arr.push({
          ...item,
          id: `${id}${Math.random()}`,
          areaId: id,
          className: selectedTableRow === 'all' ? styles.hoverable : undefined,
          options: { ...DEFAULT_AREA_OPTIONS, color: isAlarm ? '#ff4848' : 'transparent', fill: true },
          category: 'area',
        });
      }
      return arr;
    }, []);
    return [{
      ...currentArea,
      id: `${currentArea.id}${Math.random()}`,
      areaId: currentArea.id,
      options: { ...DEFAULT_AREA_OPTIONS, color: tree[currentArea.parentId] ? (isAlarmMap[currentArea.id] ? '#ff4848' : '#00ffff') : 'transparent' },
      category: 'area',
    }].concat(list);
  }

  // /**
  //  * 获取信标点
  //  * @param {number} currentIndex 当前位置索引
  //  * @return {array} 当前位置索引所属区域中的信标数组
  //  */
  // getCircleMarkers = (currentIndex) => {
  //   const { tree={}, idMap={}, ids=[] } = this.props;
  //   const data = idMap[ids[0]] || [];
  //   // 当前位置索引对应的数据
  //   const currentData = data[currentIndex];
  //   // 当前区域存在时，返回当前区域中的信标
  //   if (currentData && currentData.areaId && tree[currentData.areaId]) {
  //     return data.filter(({ areaId }) => areaId === currentData.areaId);
  //   }
  //   // 否则返回单位图所属信标
  //   return data.filter(({ areaId }) => !tree[areaId]);
  // }

  // /**
  //  * 获取当前位置索引和下个位置索引间的指向性箭头
  //  * @param {number} currentIndex 当前位置索引
  //  * @return {array} 箭头图片数组
  //  */
  // getArrows(currentIndex) {
  //   const { idMap={}, ids=[] } = this.props;
  //   const data = idMap[ids[0]] || [];
  //   // 确保两个位置索引都存在，这样箭头才存在
  //   if (data[currentIndex] && data[currentIndex + 1]) {
  //     const {
  //       latlng: { lat: y1, lng: x1 },
  //       id,
  //     } = data[currentIndex];
  //     const {
  //       latlng: { lat: y2, lng: x2 },
  //       options: { color = '#00ffff' } = {},
  //     } = data[currentIndex + 1];
  //     const tX1 = x1 + (x2 - x1) * 0.2;
  //     const tY1 = y1 + (y2 - y1) * 0.2;
  //     const tX2 = x2 + (x1 - x2) * 0.2;
  //     const tY2 = y2 + (y1 - y2) * 0.2;
  //     // 计算起点和终点坐标
  //     const lng1 = Math.min(x1, x2) - 0.01; // 左下角的横坐标
  //     const lat1 = Math.min(y1, y2) - 0.01; // 左下角的纵坐标
  //     const lng2 = Math.max(x1, x2) + 0.01; // 右上角的横坐标
  //     const lat2 = Math.max(y1, y2) + 0.01; // 右上角的纵坐标
  //     const pX1 = `${((tX1 - lng1) / (lng2 - lng1)) * 100}%`; // x1在图上转换以后的坐标
  //     const pY1 = `${(1 - (tY1 - lat1) / (lat2 - lat1)) * 100}%`; // y1在图上转换以后的坐标
  //     const pX2 = `${((tX2 - lng1) / (lng2 - lng1)) * 100}%`; // x2在图上转换以后的坐标
  //     const pY2 = `${(1 - (tY2 - lat1) / (lat2 - lat1)) * 100}%`; // y2在图上转换以后的坐标
  //     return [
  //       {
  //         id,
  //         url: encodeURI(
  //           `data:image/svg+xml;charset=utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'><defs><marker id='arrow' markerWidth='9' markerHeight='6' refX='0' refY='3' orient='auto' markerUnits='strokeWidth'><path d='M0,0 L0,6 L9,3 z' fill='${color}' /></marker></defs><line x1='${pX1}' y1='${pY1}' x2='${pX2}' y2='${pY2}' stroke='${color}' stroke-width='1' marker-end='url(#arrow)' /></svg>`
  //         ),
  //         latlngs: [
  //           { lat: lat1, lng: lng1 },
  //           { lat: lat2, lng: lng1 },
  //           { lat: lat2, lng: lng2 },
  //           { lat: lat1, lng: lng2 },
  //         ],
  //       },
  //     ];
  //   }
  // }

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
   * 获取当前位置索引数组（根据当前时间戳和之前时间戳、开始时间、结束时间的关系优化遍历方式）
   * @param {number} currentTimeStamp 当期时间戳
   * @param {number} prevTimeStamp 之前时间戳
   * @param {array} prevIndexes 之前位置索引数组
   * @return {number} 当前时间戳对应的位置索引数组
   */
  getCurrentIndexes = ({ currentTimeStamp, prevTimeStamp, prevIndexes = [] }) => {
    const { ids=[], idMap={}, startTime, endTime } = this.props;
    // 遍历人员列表，获取人员在当前时间戳的位置索引
    return ids.map((id, index) => {
      // 获取当前人员的数据列表
      const list = idMap[id] || [];
      // 获取初始位置索引（当正常播放和跳转才有值）
      let currentIndex = prevIndexes[index] === undefined ? -1 : prevIndexes[index];
      // 如果当前时间戳在之前时间戳和结束时间之间
      if (currentTimeStamp > prevTimeStamp) {
        // 如果当前时间戳离结束时间更近
        if ((currentTimeStamp - prevTimeStamp) > (endTime - currentTimeStamp)) {
          // 从最后一个往前找，如果找不到，就取之前的
          for (let i = list.length - 1; i > currentIndex; i--) {
            if (list[i].intime <= currentTimeStamp) {
              currentIndex = i;
              break;
            }
          }
        }
        // 如果当前时间戳离之前时间戳更近
        else {
          // 从之前的后一个往后找，如果找不到，就取之前的
          for (let i = currentIndex + 1; i < list.length; i++) {
            if (list[i].intime > currentTimeStamp) {
              break;
            }
            currentIndex = i;
          }
        }
      }
      // 如果当前时间戳在开始时间和之前时间戳之间
      else {
        // 如果当前时间戳离之前时间戳更近
        if ((prevTimeStamp - currentTimeStamp) < (currentTimeStamp - startTime)) {
          // 从之前的往前找，如果找不到，就取-1
          for (let i = currentIndex; i >= 0; i--) {
            if (list[i] && list[i].intime <= currentTimeStamp) {
              currentIndex = i;
              break;
            }
            currentIndex = -1;
          }
        }
        // 如果当前时间戳离之前时间戳更近
        else {
          currentIndex = -1;
          // 从第一个往后找，如果找不到，就取-1
          for (let i = 0; i < list.length; i++) {
            if (list[i].intime > currentTimeStamp) {
              break;
            }
            currentIndex = i;
          }
        }
      }
      if (
        // 如果当前位置索引为最后一个位置索引，
        currentIndex === list.length - 1 &&
        // 并且最后一个位置索引存在（即list的长度大于0），
        list[currentIndex] &&
        // 并且最后一个位置索引的离开时间小于当前时间戳（即人员已经离开最后一个位置索引），
        list[currentIndex].uptime < currentTimeStamp
        // // 保证人员在最后一个位置索引至少1秒
        // && list[currentIndex].intime <= currentTimeStamp - 1000
      ) {
        // 则将当前位置索引设置为list.length（即不显示人员）
        currentIndex = list.length;
      }
      return currentIndex;
    });
  };

  // /**
  //  * 获取跳转状态
  //  * @param {number} currentIndexes 当前位置索引
  //  * @return {object}
  //  */
  // getStepStatus = (currentIndexes) => {
  //   const { ids=[], idMap={} } = this.props;
  //   return ids.reduce((result, id, index) => {
  //     // 获取当前人员的数据列表
  //     const list = idMap[id] || [];
  //     // 获取初始位置索引
  //     let currentIndex = currentIndexes[index];
  //     if (list.length > 0) {
  //       if (currentIndex > 0) {
  //         result.isFirst = false;
  //       }
  //       if (!(currentIndex >= list.length - 1)) {
  //         result.isLast = false;
  //       }
  //     }
  //     return result;
  //   }, { isFirst: true, isLast: true });
  // }

  /**
   * 播放按钮点击事件
   */
  handlePlay = () => {
    const { startTime, endTime, ids, idMap, top, selectedTableRow } = this.props;
    const { currentTimeStamp: prevTimeStamp, drawProps, currentAreaId: prevAreaId } = this.state;
    let extra;
    // 如果当前时间戳已经是结束时间，则重新开始播放
    if (prevTimeStamp === endTime) {
      const currentTimeStamp = startTime;
      const currentIndexes = this.getCurrentIndexes({ currentTimeStamp });
      // 如果只有一个人，则区域跟着人变化
      let currentAreaId = prevAreaId;
      if (selectedTableRow !== 'all') {
        const currentData = idMap[ids[0]][currentIndexes[0]];
        if (currentData) {
          currentAreaId = currentData.areaId || top.id; // 如果在厂内，则取当前区域id，不在厂内，则取最顶层区域id
        }
      }
      extra = {
        currentTimeStamp,
        currentIndexes,
        currentAreaId,
        drawProps: { ...drawProps, ...this.getDrawProps({ currentAreaId, currentIndexes, currentTimeStamp, reset: currentAreaId !== prevAreaId }) },
      };
    }
    this.setState({
      // 显示暂停按钮
      playing: true,
      ...extra,
    });
    // 继续之前的播放
    this.setFrameTimer();
  };

  /**
   * 暂停按钮点击事件
   */
  handlePause = () => {
    // 暂停播放
    this.unsetFrameTimer();
    // 显示播放按钮
    this.setState({ playing: false });
  };

  /**
   * 加速按钮点击事件
   */
  handleAccelerate = () => {
    // 清除变量以方便按照新的速度重新计算
    this.unsetFrameTimer();
    this.setState(
      ({ speed: prevSpeed }) => {
        const speed = prevSpeed * 2;
        return {
          // 重置播放速度
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
  };

  /**
   * 减速按钮点击事件
   */
  handleDecelerate = () => {
    // 清除变量以方便按照新的速度重新计算
    this.unsetFrameTimer();
    this.setState(
      ({ speed: prevSpeed }) => {
        const speed = prevSpeed / 2;
        return {
          // 重置播放速度
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
  };

  /**
   * 点击时间轴快速跳转
   * @param {event} e 鼠标事件对象
   */
  handleLocate = e => {
    const { ids, idMap, top, selectedTableRow } = this.props;
    const { playing, currentIndexes: prevIndexes, currentTimeStamp: prevTimeStamp, drawProps, currentAreaId: prevAreaId } = this.state;
    const currentTimeStamp = e.currentTimeStamp || this.getCurrentTimeStamp(e);
    // 如果时间戳没有发生变化，则不做任何操作
    if (currentTimeStamp === prevTimeStamp) {
      return;
    }
    // 清除变量以方便重新计算
    this.unsetFrameTimer();
    const currentIndexes = this.getCurrentIndexes({ currentTimeStamp, prevTimeStamp, prevIndexes });
    // 如果只有一个人，则区域跟着人变化
    let currentAreaId = prevAreaId;
    if (selectedTableRow !== 'all') {
      const currentData = idMap[ids[0]][currentIndexes[0]];
      if (currentData) {
        currentAreaId = currentData.areaId || top.id; // 如果在厂内，则取当前区域id，不在厂内，则取最顶层区域id
      }
    }
    this.setState({
      // 重置当前时间戳（即重置时间轴进度）
      currentTimeStamp,
      // 重置当前位置索引（即重置人员位置）
      currentIndexes,
      // 重置当前区域id
      currentAreaId,
      // 重置绘图参数
      drawProps: { ...drawProps, ...this.getDrawProps({ currentAreaId, currentIndexes, currentTimeStamp, reset: currentAreaId !== prevAreaId }) },
    }, () => {
      // 根据是否在播放决定是否重置定时器
      if (playing) {
        this.setFrameTimer();
      }
    });
  };

  /**
   * 跳转到上一个点
   */
  handlePrev = () => {
    const { ids=[], idMap={} } = this.props;
    const { currentIndexes=[], currentTimeStamp: prevTimeStamp } = this.state;
    // 遍历当前位置索引获取离当前时间戳最近的进入时间
    const { currentTimeStamp } = ids.reduce((result, id, index) => {
      const { currentTimeStamp, max } = result;
      // 获取当前人员的数据列表
      const list = idMap[id] || [];
      // 获取当前位置索引
      const currentIndex = Math.min(currentIndexes[index], list.length - 1);
      // 获取当前位置索引对应的数据
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
    // 遍历下个位置索引获取离当前时间戳最近的进入时间
    const currentTimeStamp = ids.reduce((currentTimeStamp, id, index) => {
      // 获取当前人员对应的数据列表
      const list = idMap[id] || [];
      // 获取下个位置索引
      const nextIndex = currentIndexes[index] + 1;
      // 获取下个位置索引对应的数据
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
   * 点击图形
   */
  handleClick = ({ target: { options: { data: { areaId, category }={} } }, originalEvent }) => {
    const { selectedTableRow } = this.props;
    // 如果当前在追踪某个人员，则不能点击区域和菜单
    if (selectedTableRow !== 'all') {
      return;
    }
    const { playing, currentAreaId: prevAreaId } = this.state;
    let currentAreaId;
    if (category === 'area' && prevAreaId !== areaId) {
      currentAreaId = areaId;
    }
    else if (category === 'menu' && prevAreaId !== originalEvent.srcElement.dataset.id) {
      currentAreaId = originalEvent.srcElement.dataset.id;
    }
    if (currentAreaId) {
      // 清除变量以方便按照新的速度重新计算
      this.unsetFrameTimer();
      this.setState(({ drawProps, currentTimeStamp, currentIndexes }) => ({
        currentAreaId,
        drawProps: {
          ...drawProps,
          ...this.getDrawProps({ currentAreaId, currentTimeStamp, currentIndexes, reset: true }),
        },
      }), () => {
        // 根据是否在播放决定是否重置定时器
        if (playing) {
          this.setFrameTimer();
        }
      });
    }
  }

  /**
   * 点击回到最顶层
   */
  handleClickHome = () => {
    const { top } = this.props;
    this.handleClick({ target: { options: { data: { areaId: top.id, category: 'area' } } } });
  }

  /**
   * 点击回到上一层
   */
  handleClickBack = () => {
    const { tree } = this.props;
    const { currentAreaId } = this.state;
    this.handleClick({ target: { options: { data: { areaId: tree[currentAreaId].parentId, category: 'area' } } } });
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
      top: topLevelArea,
      selectedTableRow,
    } = this.props;
    const {
      playing,
      currentAreaId,
      currentTimeStamp,
      speed,
      isMinSpeed,
      isMaxSpeed,
      tooltip: { visible, left, top, content },
      drawProps,
      enable,
    } = this.state;
    // 当前时间轴宽度
    const width = currentTimeStamp
      ? `${((currentTimeStamp - startTime) / (endTime - startTime)) * 100}%`
      : 0;
    // 播放按钮类名
    const playButtonClassName = classNames(
      styles.playButton,
      enable ? undefined : styles.disabled,
    );
    // 时间轴事件
    const timeBarEvents = enable ? {
      onClick: this.handleLocate,
      onMouseMove: this.showTooltip,
      onMouseLeave: this.hideTooltip,
    } : undefined;
    // console.log(currentAreaId);

    // console.log(drawProps);
    // console.log(idMap);
    // console.log(ids);
    // console.log(this.state.currentIndexes);

    return (
      <div className={styles.container}>
        {/* 内容容器 */}
        <div className={styles.contentWrapper}>
          <ImageDraw
            style={{ height: '100%', padding: '1em' }}
            mapProps={DEFAULT_MAP_PROPS}
            autoZoom
            onClick={this.handleClick}
            {...drawProps}
          />
          {selectedTableRow === 'all' && topLevelArea && currentAreaId && topLevelArea.id !== currentAreaId && (
            <Fragment>
              <Icon type="home" className={styles.homeButton} onClick={this.handleClickHome} />
              <Icon type="rollback" className={styles.backButton} onClick={this.handleClickBack} />
            </Fragment>
          )}
        </div>
        {/* 控件容器 */}
        <div className={styles.controlWrapper}>
          {/* 时间轴 */}
          <div
            className={styles.timeBar}
            {...timeBarEvents}
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
            {/* <Tooltip title="后退">
              <Icon
                type="step-backward"
                className={classNames(styles.button, isFirst?styles.disabled:undefined)}
                onClick={isFirst ? undefined: this.handlePrev}
              />
            </Tooltip> */}
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
                  onClick={enable?this.handlePause:undefined}
                />
              ) : (
                <Icon
                  type="play-circle"
                  theme="filled"
                  className={playButtonClassName}
                  onClick={enable?this.handlePlay:undefined}
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
            {/* <Tooltip title="前进">
              <Icon
                type="step-forward"
                className={classNames(styles.button, isLast?styles.disabled:undefined)}
                onClick={isLast ? undefined: this.handleNext}
              />
            </Tooltip> */}
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
