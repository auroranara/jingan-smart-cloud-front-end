import React, { PureComponent } from 'react';
import { Icon, Spin, Switch } from 'antd';
import { connect } from 'dva';
import classNames from 'classnames';

import styles from './LeafletMap.less';
import ImageDraw, { L } from '@/components/ImageDraw';
import {
  findInTree,
  findBuildingId,
  parseImage,
  getUserName,
  getMapClickedType,
  getPersonAlarmTypes,
  getIconClassName,
  getAncestorId,
  OPTIONS_BLUE,
} from '../utils';

const ALARM = 2;

@connect(({ zoning, loading }) => ({
  zoning,
  loading: loading.models.zoning,
}))
export default class LeafletMap extends PureComponent {
  state = {
    data: [],
    images: undefined,
    reference: undefined,
    floorIcon: undefined,
    beaconOn: true, // 是否显示信标
  };

  currentSection = {};

  componentDidUpdate(prevProps, prevState) {
    const {
      areaId: prevAreaId,
      highlightedAreaId: prevHighlightedAreaId,
      sectionTree: prevSectionTree,
    } = prevProps;
    const { areaId, highlightedAreaId, sectionTree } = this.props;

    if (
      areaId !== prevAreaId ||
      sectionTree !== prevSectionTree ||
      highlightedAreaId !== prevHighlightedAreaId
    )
      this.handleMapData();
  }

  // 修正areaId，若areaId为null或''，则其在区域外，修正为最顶层节点的id
  fixAreaId = areaId => {
    const { sectionTree } = this.props;
    if (sectionTree.length && (areaId === null || areaId === ''))
      return sectionTree[0].id;
    return areaId;
  };

  handleMapData = () => {
    const { areaInfo, areaId, highlightedAreaId, sectionTree } = this.props;
    let current;
    // areaId === null 或 ''时，则为区域外，则默认重置为最顶层节点
    if (areaId === null || areaId === '')
      current = sectionTree[0];
    else
      current = findInTree(areaId, sectionTree);

    this.currentSection = current || {};
    // console.log(areaId, current);
    if (!current)
      return;

    const root = sectionTree[0];
    const rootId = root.id;
    const isRoot = areaId === rootId;
    const currentInfo = areaInfo[areaId];
    const { isBuilding, parentId } = currentInfo;

    const { children, range } = current;
    const sectionChildren = children || [];
    let currentRange;
    // 多层建筑时，需要点击当前的框，所以需要填充，透明度变为0，普通区域时，由于返回图层覆盖的问题，所以fill改为false
    if (isBuilding) currentRange = { ...range, options: { ...range.options, fillOpacity: 0 } };
    else currentRange = { ...range, options: { ...range.options, fill: false } };

    const reference = parseImage(current);

    // data会变红，所以不能使用一开始存好的值，但是图片是固定的，所以可以用一开始处理好的值
    let data;
    // 若当前区域为多层建筑或没有子区域，则只渲染当前区域
    if (isBuilding || !sectionChildren.length) data = [currentRange];
    // 当前区域不是多层建筑，若有子节点，则渲染所有子节点(高亮的变蓝，报警的变红，其余变透明)
    else
      data = sectionChildren.reduce((prev, { id, range, status }) => {
        if (range) {
          let newRange;
          if (id === highlightedAreaId)
            // 高亮的变蓝，包括已经变红的，高亮的时候也变蓝
            newRange = { ...range, options: { ...range.options, color: OPTIONS_BLUE } };
          else if (+status === ALARM)
            // 报警的本身已经改成红色了，保持不变
            newRange = range;
          // 不高亮及报警的都变成透明不可见，但可以点
          else newRange = { ...range, options: { ...range.options, color: 'transparent' } };
          prev.push(newRange);
        }
        return prev;
      }, parentId ? [currentRange] : []); // 最顶层的外框不显示

    // 当前区域为顶层节点，则子节点已加入data，当前节点不为顶层节点，则加入除当前节点所在的父节点的顶层节点的子节点，且子节点都隐藏，报警也不变红
    if (!isRoot) {
      const { children: rootChildren } = root;
      const currentAncestorId = getAncestorId(areaId, rootId, areaInfo);
      const rootRanges = rootChildren.reduce((prev, { id, range }) => {
        if (id !== currentAncestorId && range) {
          let newRange;
          if (id === highlightedAreaId)
            // 高亮的变蓝，不高亮的隐藏
            newRange = { ...range, options: { ...range.options, color: OPTIONS_BLUE } };
          else
            newRange = { ...range, options: { ...range.options, color: 'transparent' } };
          prev.push(newRange);
        }
        return prev;
      }, []);

      data.push(...rootRanges);
      data.forEach((r, i) => { if(!i) return; r.className=styles.svg; });
      // console.log(data);
    }

    const floorIcon = this.getFloorIcon(areaId, range);
    this.setState({ data, images: areaInfo[areaId].images, reference, floorIcon });
  };

  getFloorIcon = (areaId, currentRange) => {
    const { areaInfo, sectionTree } = this.props;
    const [buildingId, floorId] = findBuildingId(areaId, areaInfo) || [];
    if (!buildingId)
      return;

    const building = findInTree(buildingId, sectionTree);
    const { children } = building;
    // let rng = range;
    // if (floorId)
    //   rng = children.find(({ id }) => id === floorId).range;
    const props = ['lng', 'lat'];
    const [x, y] = currentRange.latlngs.reduce((prev, next) => prev.map((n, i) => Math.max(n, next[props[i]])), [0, 0]);
    const length = children.length;
    const floors = children.reduce((prev, next, i) => {
      const { id, status } = next;
      return `${prev}<p class="${classNames(styles.floor, {
        [styles.red]: +status === 2,
        [styles.selectedFloor]: id === floorId,
      })}" data-floor="${id}">F${i + 1}</p>`;
    }, '');
    return {
      id: `${buildingId}_@@building`,
      name: buildingId,
      latlng: { lat: y, lng: x },
      iconProps: {
        iconSize: [40, 20 * length],
        iconAnchor: [-2, 2],
        className: styles.iconContainer,
        html: `<div class="${styles.floors}">${floors}</div>`,
      },
    };
  };

  handleClick = e => {
    const origin = e.target.options.data; // 获取传入的原始数据
    const { id } = origin; // 若点击的是人，原始数据中有id及name，若点击区域，原始数据中无id，只有name
    const clickedType = getMapClickedType(id);

    // console.log(e);
    // 0 区域 1 视频 2 人
    switch (clickedType) {
      case 0:
        this.handleClickSection(id, e);
        break;
      case 1:
        this.handleClickVideo(id);
        break;
      case 2:
        this.handleClickMovingPerson(id);
        break;
      case 3:
        break;
      case 4:
        this.handleClickFloor(id, e);
        break;
      case 5:
        this.handleClickPerson(id);
        break;
      default:
        console.log('wrong clicked type');
    }
  };

  handleClickSection = (id, e) => {
    const { areaInfo, areaId, setAreaId } = this.props;
    const aId = id.split('_@@')[0];
    const currentInfo = areaInfo[areaId];
    const { isBuilding } = currentInfo;

    const current = this.currentSection;
    const { children } = current;

    // 无子区域或为建筑则不做处理
    if (!children || isBuilding) return;

    // 有子区域
    // 如果当前所在区域为多层建筑，则跳出菜单选择楼层
    // if (isBuilding) e.target.bindPopup(this.genChoiceList(children)).openPopup();
    // 不是多层建筑，则进入该区域
    else setAreaId(aId);
  };

  handleClickVideo = id => {
    const { handleShowVideo } = this.props;
    const keyId = id.split('_@@')[0];
    handleShowVideo(keyId);
  };

  handleClickMovingPerson = id => {
    const { handleShowPersonInfo } = this.props;
    const cardId = id.split('_@@')[0];
    handleShowPersonInfo(cardId);
  };

  handleClickPerson = beaconId => {
    const { aggregation, handleShowPersonInfo, handleShowPersonDrawer } = this.props;
    // 对应信标上只有一个人时，直接个人信息，多个人时，展示列表
    const ps = aggregation.find(item => item[0].beaconId === beaconId);
    if (ps.length === 1) handleShowPersonInfo(ps[0].cardId);
    else handleShowPersonDrawer(beaconId);
  };

  handleClickFloor = (id, e) => {
    const { setAreaId } = this.props;
    // const buildingId = id.split('_@@')[0];
    // console.log(e);

    const floorId = e.originalEvent.srcElement.dataset.floor;
    setAreaId(floorId);
  };

  genChoiceList = children => {
    const { setAreaId } = this.props;
    const container = document.createElement('div');
    container.className = styles.popContainer;
    for (const { id, name, status } of children) {
      const isAlarm = status === 2;
      const p = document.createElement('p');
      p.innerHTML = `${name} ${isAlarm ? '报警' : '安全'}`;
      p.onclick = e => setAreaId(id);
      p.className = styles[isAlarm ? 'poppAlarm' : 'popp'];
      container.appendChild(p);
    }

    return container;
  };

  handleBack = e => {
    const { areaId, areaInfo, setAreaId } = this.props;
    const { parentId } = areaInfo[areaId];
    setAreaId(parentId);
  };

  handleHome = e => {
    const { sectionTree, setAreaId } = this.props;
    setAreaId(sectionTree[0].id);
  };

  handleBeaconStateChange = checked => {
    this.setState({ beaconOn: checked });
  };

  beaconListToIcons = (aggregation) => {
    let { beaconList, areaId } = this.props;
    const { beaconOn } = this.state;
    if (!beaconOn)
      return [];

    areaId = this.fixAreaId(areaId);
    const aggBeacons = aggregation.map(ps => ps[0].beaconId);
    // 只显示当前区域且上面没有人的信标
    return beaconList.filter(({ id, areaId: beaconAreaId }) => !aggBeacons.includes(id) && beaconAreaId === areaId).map(({ id, beaconCode, xarea, yarea, status }) => ({
      id: `${id}_@@beacon`,
      name: beaconCode,
      latlng: { lat: yarea, lng: xarea },
      iconProps: {
        iconSize: [15, 15],
        // iconAnchor: [10, 10],
        className: styles.beaconContainer,
        html: `
          <div class="${styles[+status ? 'beacon' : 'beaconOff']}">
            <div class="${styles.personTitle}">${beaconCode}</div>
          </div>`,
      },
    }));
  };

  movingCardsToIcons = () => {
    const { movingCards, areaId, areaInfo, isTrack, selectedCardId } = this.props;
    if (!areaId || !Object.keys(areaInfo).length || !movingCards.length) return [];

    let cards = [];
    const childAreas = areaInfo[areaId].childIds;
    const currentAreas = [areaId, ...childAreas]; // 当前及当前区域所有子区域的集合

    if (isTrack && selectedCardId) {
      const target = movingCards.find(({ cardId }) => cardId === selectedCardId);
      cards = target && currentAreas.includes(target.areaId) ? [target] : []; // 最后处理的是个聚合点，即二维数组
    } else cards = movingCards.filter(p => currentAreas.includes(p.areaId));

    const icons = cards.map(p => {
      const { cardId, xarea, yarea, beaconId, cardType, onlineStatus } = p;
      const name = getUserName(p);
      const alarmTypes = getPersonAlarmTypes([p]);
      const isAlarm = !!alarmTypes;
      const isVisitor = !!+cardType;
      const isOnline = !!+onlineStatus;
      const containerClassName = getIconClassName(true, isVisitor, isOnline, isAlarm);
      return {
        id: `${cardId}_@@moving`,
        name,
        latlng: { lat: yarea, lng: xarea },
        iconProps: {
          iconSize: [38, 40],
          iconAnchor: [19, 40],
          className: styles.personContainer,
          html: `
            <div class="${styles[containerClassName]}">
              <div class="${styles.personTitle}">${name}</div>
              <div class="${styles[isAlarm ? 'alarms' : 'nodisplay']}">${alarmTypes}</div>
            </div>`,
        },
      };
    });

    return icons;
  };

  positionsToIcons = () => {
    let {
      areaId,
      areaInfo,
      aggregation,
      isTrack,
      selectedCardId,
      positions,
      movingCards,
    } = this.props;
    // console.log(areaId, areaInfo, aggregation);
    if (areaId === undefined || !Object.keys(areaInfo).length || !aggregation.length) return this.beaconListToIcons([]);

    areaId = this.fixAreaId(areaId);
    let targetAgg = [];
    const childAreas = areaInfo[areaId].childIds;
    const currentAreas = [areaId, ...childAreas]; // 当前及当前区域所有子区域的集合
    // console.log(areaId, currentAreas);
    const movingCardIds = movingCards.map(({ cardId }) => cardId);

    // 如果处于目标追踪标签且选定了追踪目标，则只渲染当前追踪的目标
    if (isTrack && selectedCardId) {
      const target = positions.find(({ cardId }) => cardId === selectedCardId);
      targetAgg =
        target && !movingCardIds.includes(selectedCardId) && currentAreas.includes(target.areaId)
          ? [[target]]
          : []; // 最后处理的是个聚合点，即二维数组
    } else
      targetAgg = aggregation
        .map(ps =>
          ps.filter(p => currentAreas.includes(p.areaId) && !movingCardIds.includes(p.cardId))
        )
        .filter(ps => ps.length);

    const points = targetAgg.map(ps => {
      const first = ps[0];
      const length = ps.length;
      const { xarea, yarea, beaconId, cardType, onlineStatus } = first;
      const isSingle = length === 1;
      const isVisitor = !!+cardType;
      const isOnline = !!+onlineStatus;

      // const isSOS = ps.some(({ sos }) => sos);
      // const isAlarm = ps.some(({ sos, overstep, tlong }) => sos || overstep || tlong);
      const alarmTypes = getPersonAlarmTypes(ps);
      const isAlarm = !!alarmTypes;
      const containerClassName = getIconClassName(isSingle, isVisitor, isOnline, isAlarm);
      const firstName = getUserName(first);
      const name = ps
        .slice(0, 5)
        .map(getUserName)
        .join(',');
      const showName = isSingle ? firstName : length;
      return {
        id: beaconId,
        name: length > 5 ? `${name}...` : name, // 若name为数字则会报错
        latlng: { lat: yarea, lng: xarea },
        iconProps: {
          iconSize: [38, 40],
          iconAnchor: [19, 40],
          className: styles.personContainer,
          html: `
            <div class="${styles[containerClassName]}">
              <div class="${
                styles[isSingle ? 'personTitle' : isAlarm ? 'nodisplay' : 'personNum']
              }">${showName}</div>
              <div class="${styles[isAlarm ? 'alarms' : 'nodisplay']}">${alarmTypes}</div>
            </div>`,
        },
      };
    });

    // 摄像头位置，暂时先不显示
    // const videos = targetAgg.reduce((prev, next) => {
    //   const vIds = prev.map(({ vId }) => vId);
    //   const vList = next.reduce((p, n) => Array.isArray(n.videoList) ? p.concat(n.videoList) : p, []);
    //   const vs = vList.filter(({ id }) => !vIds.includes(id)).map(({ id, keyId, name, xNum, yNum }) => ({
    //     id: `${keyId}_@@video${Math.random()}`, // id中加入video来区别是否是视频点
    //     vId: id,
    //     name,
    //     latlng: { lat: xNum, lng: yNum },
    //     iconProps: {
    //       iconSize: [32, 32],
    //       iconAnchor: [16, 32],
    //       className: styles.cameraContainer,
    //       html: `<div class="${styles.camera}"></div>`,
    //     },
    //   }));

    //   return vs.length ? [...prev, ...vs] : prev;
    // }, []);

    const beaconIcons = this.beaconListToIcons(targetAgg);
    const movingIcons = this.movingCardsToIcons();

    // return points;
    // console.log('points', points, beaconIcons);
    return [...points, ...movingIcons, ...beaconIcons];
  };

  render() {
    const { url, areaId, areaInfo, showBoard } = this.props;
    const { data, images, reference, beaconOn, floorIcon } = this.state;
    // const { count, inCardCount, outCardCount } = this.currentTrueSection || {};

    const currentAreaInfo = (areaId && areaInfo[areaId]) || {};
    const { parentId, fullName } = currentAreaInfo;
    const icons = this.positionsToIcons().concat(floorIcon || []);
    // console.log('render icons', Date(), icons);

    const imgDraw = (
      <Spin spinning={false} style={{ height: '100%' }}>
        <ImageDraw
          maxBoundsRatio={1.5}
          autoZoom
          boxZoom={false}
          doubleClickZoom={false}
          mapProps={{ scrollWheelZoom: false }}
          url={url}
          data={data}
          images={images}
          reference={reference}
          divIcons={icons}
          className={styles.map}
          color="#00a8ff"
          style={{ height: '100%' }}
          onClick={this.handleClick}
        />
      </Spin>
    );

    return (
      <div className={styles.container}>
        {imgDraw}
        <Icon type="arrows-alt" onClick={showBoard} className={styles.board} />
        <Icon type="home" onClick={this.handleHome} className={styles.home} />
        {parentId && <Icon type="rollback" onClick={this.handleBack} className={styles.back} />}
        {/* <div className={styles.mapInfo}>
          <span className={styles.area}>当前区域: {fullName || '暂无'}</span>
          今日
          <span className={styles.enter}>
            进入: {inCardCount || 0}
            人次
          </span>
          <span className={styles.exit}>
            出去: {outCardCount || 0}
            人次
          </span>
          当前人数: {count || 0}
        </div> */}
        <div className={styles.legends}>
          <div className={styles.visitorLgd}>访客</div>
          <div className={styles.generalLgd}>普通人员</div>
        </div>
        <div className={styles.beaconSwitch}>
          <span className={styles.beaconLabel}>信标</span>
          <Switch size="small" checked={beaconOn} onChange={this.handleBeaconStateChange} />
        </div>
      </div>
    );
  }
}
