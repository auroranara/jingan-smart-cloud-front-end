import React, { PureComponent } from 'react';
import { Icon, Spin } from 'antd';
import { connect } from 'dva';

import styles from './LeafletMap.less';
import ImageDraw, { L } from '@/components/ImageDraw';
import { findInTree, parseImage, getUserName } from '../utils';

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

  currentSection = null;

  componentDidUpdate(prevProps, prevState) {
    const { areaId: prevAreaId, sectionTree: prevSectionTree } = prevProps;
    const { areaId, sectionTree } = this.props;

    if (areaId !== prevAreaId || sectionTree !== prevSectionTree)
      this.handleMapData(areaId, sectionTree);
  }

  handleMapData = (areaId, sectionTree) => {
    const { areaInfo } = this.props;
    const target = findInTree(areaId, sectionTree);
    this.currentSection = target;
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
    const data = sectionChildren.reduce((prev, { range }) => range ? [...prev, range] : prev, [currentRange]);
    // console.log('range', data, images, reference);
    this.setState({ data, images: areaInfo[areaId].images, reference });
  };

  handleClick = e => {
    // console.log(e);
    const origin = e.target.options.data; // 获取传入的原始数据
    const { id, name } = origin; // 若点击的是人，原始数据中有id及name，若点击区域，原始数据中无id，只有name
    const isPerson = !!id;

    // console.log(e, origin);
    if (isPerson)
      this.handleClickPerson(id);
    else
      this.handleClickSection(name, e);
  }

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
    const target = this.currentSection.children.find(item => item.name === name);
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
    for (const { id, name } of children) {
      const p = document.createElement('p');
      p.innerHTML = name;
      p.onclick = e => setAreaId(id);
      p.className = styles.popp;
      container.appendChild(p);
    }

    return container;
  };

  handleBack = e => {
    const { areaId, areaInfo, setAreaId } = this.props;
    const { parentId } = areaInfo[areaId];
    const parent = areaInfo[parentId];
    if (parent.isBuilding)
      setAreaId(parent.parentId);
    else
      setAreaId(parentId);
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
      const isSingle = length === 1;
      const { xarea, yarea, beaconId } = first;

      const isAlarm = ps.some(({ sos, overstep, tlong }) => sos || overstep || tlong);
      const containerClassName = `${isSingle ? 'person' : 'people'}${isAlarm ? 'Red' : ''}`;
      const firstName = getUserName(first);
      const name = ps.slice(0, 5).map(getUserName).join(',');
      const showName = isSingle ? firstName : length;
      return {
        id: beaconId,
        name: length > 5 ? `${name}...` : name, // 若name为数字则会报错
        latlng: { lat: yarea, lng: xarea },
        iconProps: {
          iconSize: [38, 40],
          // iconAnchor: [],
          className: styles.personContainer,
          html: `<div class="${styles[containerClassName]}"><div class="${isSingle ? styles.personTitle : styles.personNum}">${showName}</div></div>`,
        },
      };
    });

    // console.log('agg', points);
    return points;
  }

  render() {
    const { loading, url, areaId, areaInfo } = this.props;
    const { data, images, reference } = this.state;

    // console.log(icons);

    const parentId = areaId ? areaInfo[areaId].parentId : undefined;
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
      </div>
    );
  }
}
