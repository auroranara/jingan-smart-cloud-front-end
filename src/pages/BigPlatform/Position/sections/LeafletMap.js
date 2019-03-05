import React, { PureComponent } from 'react';
import { Icon, Spin } from 'antd';
import { connect } from 'dva';

import styles from './LeafletMap.less';
import ImageDraw, { L } from '@/components/ImageDraw';
import { findInTree, parseImage, getUserName, getMapClickedType, getPersonAlarmTypes } from '../utils';

@connect(({ zoning, loading }) => ({
  zoning,
  loading: loading.models.zoning,
}))
export default class LeafletMap extends PureComponent {
  state = {
    data: [],
    images: undefined,
    reference: undefined,
  };

  currentTrueSection = {};
  currentShowSection = {};

  componentDidUpdate(prevProps, prevState) {
    const { areaId: prevAreaId, trueAreaId: prevTrueAreaId, sectionTree: prevSectionTree } = prevProps;
    const { areaId, trueAreaId, sectionTree } = this.props;

    if (areaId !== prevAreaId || trueAreaId !== prevTrueAreaId || sectionTree !== prevSectionTree)
      this.handleMapData(areaId, trueAreaId, sectionTree);
  }

  handleMapData = (areaId, trueAreaId, sectionTree) => {
    const { areaInfo } = this.props;
    const target = this.currentShowSection = findInTree(areaId, sectionTree);
    // 当trueAreaId为多层建筑时，地图上展示其父级areaId，即areaId是trueAreaId的父节点，当不是多层建筑时，两个值一致
    if (areaId !== trueAreaId)
      this.currentTrueSection = target.children.find(({ id }) => id === trueAreaId) || {};
    else
      this.currentTrueSection = target;
    // console.log('areaInfo', this.props.areaInfo, target);
    if (!target)
      return;

    const { children, mapId: fatherMapId, companyMap, range } = target;
    const sectionChildren = children || [];
    const currentRange = { ...range, options: { ...range.options, color: 'rgba(0, 0, 0, 0.5)' } };
    const reference = parseImage(target);
    // const [images, data] = sectionChildren.reduce((prev, next) => {
    //   const { range, mapId } = next;
    //   // 如果子区域用了父区域的地图，则不显示该地图
    //   if (mapId !== fatherMapId)
    //     prev[0].push(parseImage(next));
    //   if (range)
    //     prev[1].push(range);
    //   return prev;
    // }, [fatherMapId === companyMap ? [] : [reference], [currentRange]]);

    // data会变红，所以不能使用一开始存好的值，但是图片是固定的，所以可以用一开始处理好的值
    // 显示当前区域即其所有子区域
    // const data = sectionChildren.reduce((prev, { range }) => range ? [...prev, range] : prev, [currentRange]);
    // 由于返回时图层顺序会乱，所以当前区域有子区域时先不渲染当前区域，当前区域没有子区域时渲染当前区域
    const data = sectionChildren.length ? sectionChildren.reduce((prev, { range }) => range ? [...prev, range] : prev, []) : [currentRange];
    // console.log('range', data, images, reference);
    this.setState({ data, images: areaInfo[areaId].images, reference });
  };

  handleClick = e => {
    const origin = e.target.options.data; // 获取传入的原始数据
    const { id, name } = origin; // 若点击的是人，原始数据中有id及name，若点击区域，原始数据中无id，只有name
    const clickedType = getMapClickedType(id);
    // console.log(e, origin);

    // 0 区域 1 视频 2 人
    switch(clickedType) {
      case 0:
        this.handleClickSection(name, e);
        break;
      case 1:
        this.handleClickVideo(id);
        break;
      case 2:
        this.handleClickPerson(id);
        break;
      default:
        console.log('wrong clicked type');
    }
  }

  handleClickVideo = id => {
    const { handleShowVideo } = this.props;
    const keyId = id.split('_@@')[0];
    handleShowVideo(keyId);
  };

  handleClickPerson = beaconId => {
    const { aggregation, handleShowPersonInfo, handleShowPersonDrawer } = this.props;
    // 对应信标上只有一个人时，直接个人信息，多个人时，展示列表
    const ps = aggregation.find(item => item[0].beaconId === beaconId);
    if (ps.length === 1)
      handleShowPersonInfo(ps[0].cardId);
    else
      handleShowPersonDrawer(beaconId);
  }

  handleClickSection = (name, e) => {
    // console.log('section');
    const { areaInfo, setAreaId } = this.props;
    const target = this.currentShowSection.children.find(item => item.name === name);
    // console.log(target);

    if (!target)
      return;

    const { id, children } = target;
    if (areaInfo[id].isBuilding)
      children && children.length && e.target.bindPopup(this.genChoiceList(target.children)).openPopup();
    else
      setAreaId(id);
  }

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
    const { areaId, trueAreaId, areaInfo, setAreaId } = this.props;
    const { parentId } = areaInfo[trueAreaId];
    setAreaId(parentId);

    // const parent = areaInfo[parentId];
    // if (parent.isBuilding)
    //   setAreaId(parent.parentId);
    // else
    //   setAreaId(parentId);
  };

  positionsToIcons = () => {
    const { areaId, areaInfo, aggregation, isTrack, selectedCardId, positions } = this.props;
    if (!areaId || !Object.keys(areaInfo).length || !aggregation.length)
      return [];

    let targetAgg = [];
    const childAreas = areaInfo[areaId].childIds;
    const currentAreas = [areaId, ...childAreas]; // 当前及当前区域所有子区域的集合
    // console.log(areaId, currentAreas);

    // 如果处于目标追踪标签且选定了追踪目标，则只渲染当前追踪的目标
    if (isTrack && selectedCardId) {
      const target = positions.find(({ cardId }) => cardId === selectedCardId);
      targetAgg = target && currentAreas.includes(target.areaId) ? [[target]] : []; // 最后处理的是个聚合点，即二维数组
    }
    else
      targetAgg = aggregation.map(ps => ps.filter(p => currentAreas.includes(p.areaId))).filter(ps => ps.length);

    const points =  targetAgg.map(ps => {
      const first = ps[0];
      const length = ps.length;
      const { xarea, yarea, beaconId, cardType } = first;
      const isSingle = length === 1;
      const isVisitor = !!+cardType;

      // const isSOS = ps.some(({ sos }) => sos);
      // const isAlarm = ps.some(({ sos, overstep, tlong }) => sos || overstep || tlong);
      const alarmTypes = getPersonAlarmTypes(ps);
      const isAlarm = !!alarmTypes;
      const containerClassName = `${isSingle ? (isVisitor ? 'visitor' : 'person') : 'people'}${isAlarm ? 'Red' : ''}`;
      const firstName = getUserName(first);
      const name = ps.slice(0, 5).map(getUserName).join(',');
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
              <div class="${styles[isSingle ? 'personTitle' : (isAlarm ? 'nodisplay' : 'personNum')]}">${showName}</div>
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

    // console.log('agg', points);
    return points;
    // return [...points, ...videos];
  }

  render() {
    const { loading, url, areaId, trueAreaId, areaInfo } = this.props;
    const { data, images, reference } = this.state;
    const { count, inCardCount, outCardCount } = this.currentTrueSection || {};

    const currentTrueAreaInfo = trueAreaId && areaInfo[trueAreaId] || {};
    const { parentId, fullName }=  currentTrueAreaInfo;
    const icons = this.positionsToIcons();

    const imgDraw = (
      <Spin spinning={false} style={{ height: '100%' }}>
        <ImageDraw
          autoZoom
          url={url}
          data={data}
          images={images}
          reference={reference}
          divIcons={icons}
          className={styles.map}
          color='#00a8ff'
          style={{ height: '100%' }}
          onClick={this.handleClick}
        />
      </Spin>
    );

    return (
      <div className={styles.container}>
        {imgDraw}
        {parentId && <Icon type="rollback" onClick={this.handleBack} className={styles.back} />}
        <div className={styles.mapInfo}>
          <span className={styles.area}>当前区域: {fullName}</span>
          今日
          <span className={styles.enter}>进入: {inCardCount}人次</span>
          <span className={styles.exit}>出去: {outCardCount}人次</span>
          当前人数: {count}
        </div>
        <div className={styles.legends}>
          <div className={styles.visitorLgd}>访客</div>
          <div className={styles.generalLgd}>普通人员</div>
        </div>
      </div>
    );
  }
}
