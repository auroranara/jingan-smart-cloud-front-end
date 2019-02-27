import React, { PureComponent } from 'react';
import { Icon, Spin } from 'antd';
import { connect } from 'dva';

import styles from './LeafletMap.less';
import ImageDraw, { L } from '@/components/ImageDraw';
import { findInTree, parseImage } from '../utils';

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
    const target = findInTree(areaId, sectionTree);
    this.currentSection = target;
    // console.log(areaId, sectionTree, target);
    if (!target)
      return;

    const { children, mapId: fatherMapId, companyMap } = target;
    const reference = parseImage(target);
    const [images, data] = children.reduce((prev, next) => {
      const { range, mapId } = next;
      // 如果子区域用了父区域的地图，则不显示该地图
      if (mapId !== fatherMapId)
        prev[0].push(parseImage(next));
      prev[1].push(range ? JSON.parse(range) : []);
      return prev;
    }, [fatherMapId === companyMap ? [] : [reference], []]);
    console.log(target, fatherMapId === companyMap, data, images, reference);
    this.setState({ data, images, reference });
  };

  handleClick = e => {
    // console.log(e);
    const { areaInfo, setAreaId } = this.props;
    const name = e.target.options.data.name;
    const target = this.currentSection.children.find(item => item.name === name);
    // console.log(target);

    if (!target || !target.children || !target.children.length)
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
  }

  render() {
    const { loading, url, icons, areaId, areaInfo, setAreaId } = this.props;
    const { data, images, reference } = this.state;

    // console.log(icons);

    const parentId = areaId ? areaInfo[areaId].parentId : undefined;

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
