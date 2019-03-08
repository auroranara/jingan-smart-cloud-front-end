import React, { PureComponent } from 'react';
import ImageDraw from '@/components/ImageDraw';

const shapes = ['circlemarker'];
const color = '#00a8ff';
export default class BeaconCoordinate extends PureComponent {
  state = {
    drawProps: {},
  };

  componentDidUpdate({ image: prevImage, value: prevValue }) {
    const { image, value } = this.props;
    if (prevImage !== image) {
      this.resetDrawProps();
    }
    if (value !== prevValue) {
      this.resetData();
    }
  }

  resetData = () => {
    const { value } = this.props;
    let data;
    if (value) {
      const { xarea: lng, yarea: lat } = value;
      data = [{ type: 'circlemarker', id: lng, latlng: { lat, lng }, options: { color } }];
    }
    this.setState(({ drawProps }) => ({
      drawProps: {
        ...drawProps,
        data,
      },
    }));
  };

  resetDrawProps = () => {
    const { image } = this.props;
    if (image) {
      const { mapHierarchy, mapPhoto, companyMapUrl, jsonMap, id } = image;
      const floorUrl = JSON.parse(mapPhoto).url;
      let companyUrl, range;
      if (+mapHierarchy === 1) {
        companyUrl = floorUrl;
        range = {
          latlngs: [{ lat: 0, lng: 0 }, { lat: 1, lng: 0 }, { lat: 1, lng: 1 }, { lat: 0, lng: 1 }],
        };
      } else {
        companyUrl = JSON.parse(companyMapUrl).url;
        range = JSON.parse(jsonMap);
      }
      const item = {
        id,
        url: floorUrl,
        ...range,
      };
      this.setState({
        drawProps: {
          url: companyUrl,
          images: [item],
          reference: item,
        },
      });
    } else {
      this.setState({ drawProps: {} });
    }
  };

  handleUpdate = ([item]) => {
    const { onChange } = this.props;
    if (onChange) {
      if (item) {
        const {
          latlng: { lat: yarea, lng: xarea },
        } = item;
        const {
          image: { floorNumber: zarea },
        } = this.props;
        onChange({ yarea, xarea, zarea });
      } else {
        onChange(undefined);
      }
    }
  };

  render() {
    const { image } = this.props;
    const { drawProps } = this.state;
    return (
      <div style={{ height: image ? 'auto' : 32, overflow: 'hidden' }}>
        {!image && <div>请先选择所属地图</div>}
        <ImageDraw
          style={{ backgroundColor: '#ccc', height: 400 }}
          onUpdate={this.handleUpdate}
          limit={1}
          hideBackground
          drawable
          shapes={shapes}
          maxBoundsRatio={1.2}
          color={color}
          autoZoom
          {...drawProps}
        />
      </div>
    );
  }
}
