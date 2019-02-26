import React, { PureComponent } from 'react';
import { message, Spin } from 'antd';
import { connect } from 'dva';

import styles from './LeafletMap.less';
import ImageDraw from '@/components/ImageDraw';
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

  componentDidUpdate(prevProps, prevState) {
    const { areaId, sectionTree } = this.props;
    // this.handleMapData(areaId, sectionTree);
  }

  handleMapData = (areaId, sectionTree) => {
    const target = findInTree(areaId, sectionTree);
    const reference = parseImage(target);
    const [images, data] = target.children.reduce((prev, next) => {
      const { range } = next;
      prev[0].push(parseImage(next));
      prev[1].push(range ? JSON.parse(range) : []);
    }, [[reference], []]);
    this.setState({ data, images, reference });
  };

  getZoning = id => {
    const { dispatch } = this.props;
    // 获取区域信息
    dispatch({
      type: 'zoning/fetchZone',
      payload: { id },
      callback: (data) => {
        if (data) {
          const { areaInfo: { name, range }, companyMap: { id: id1, mapPhoto: image1 }={}, floorMap: { id: id2, mapPhoto: image2, jsonMap }={} } = data;
          const { url: url1 } = JSON.parse(image1 || '{}');
          const { url: url2 } = JSON.parse(image2 || '{}');
          const json = JSON.parse(jsonMap || null);
          const item = range ? [JSON.parse(range)] : [];
          if (url1 && url2 && json) {
            const image = {
              id: id2,
              url: url2,
              ...json,
            };
            this.setState({
              url: url1,
              images: [image],
              reference: image,
              // name,
              data: item,
            });
          }
          else if (url1) {
            const image = {
              id: id1,
              url: url1,
              latlngs: [
                { lat: 0, lng: 0 },
                { lat: 1, lng: 0 },
                { lat: 1, lng: 1 },
                { lat: 0, lng: 1 },
              ],
            };
            this.setState({
              url: url1,
              images: [image],
              reference: image,
              // name,
              data: item,
            });
          }
          else {
            message.error('数据异常，请联系维护人员或稍后重试！');
          }
        }
        else {
          message.error('获取数据失败，请稍后重试！');
        }
      },
    });
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
