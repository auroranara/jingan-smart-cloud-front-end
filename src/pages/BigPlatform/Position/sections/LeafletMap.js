import React, { PureComponent } from 'react';
import { message, Spin } from 'antd';
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

    const reference = parseImage(target);
    const [images, data] = target.children.reduce((prev, next) => {
      const { range } = next;
      prev[0].push(parseImage(next));
      prev[1].push(range ? JSON.parse(range) : []);
      return prev;
    }, [[reference], []]);
    // console.log(data, images, reference);
    this.setState({ data, images, reference });
  };

  handleClick = e => {
    // console.log(e);
    const name = e.target.options.data.name;
    const target = this.currentSection.children.find(item => item.areaName === name);
    // console.log(target);
    if (target.children && target.children.length) {
      const div = this.genDivList(target.children);
      e.target.bindPopup(div).openPopup();
    }
  }

  genDivList = children => {
    const { setAreaId } = this.props;
    const container = document.createElement('div');
    container.className = styles.popContainer;
    for (const { id, areaName } of children) {
      const p = document.createElement('p');
      p.innerHTML = areaName;
      p.onclick = e => setAreaId(id);
      p.className = styles.popp;
      container.appendChild(p);
    }

    return container;
  };

  render() {
    const { loading, url, icons } = this.props;
    const { data, images, reference } = this.state;

    console.log(icons);

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
      </div>
    );
  }
}
