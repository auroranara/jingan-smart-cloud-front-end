import React, { Component } from 'react';
import classNames from 'classnames';
import styles from './MapTypeBar.less';

const typeList = [
  {
    id: 'satellite',
    name: '卫星',
    icon: 'iconSatellite',
  },
  {
    id: 'road',
    name: '路况',
    icon: 'iconRoad',
  },
];
class MapTypeBar extends Component {
  state = {
    active: {
      satellite: false,
      road: false,
    },
  };
  componentDidMount() {}

  componentWillUnmount() {}

  handleClick = id => {
    const { active } = this.state;
    const { __map__: map } = this.props;
    const layersArr = [new window.AMap.TileLayer.Satellite(), new window.AMap.TileLayer.RoadNet()];
    active[id] = !active[id];

    this.setState({
      active,
    });
    const layers = [new window.AMap.TileLayer()];
    typeList.forEach((item, index) => {
      if (active[item.id]) {
        layers.push(layersArr[index]);
      }
    });
    map.setLayers(layers);
  };

  render() {
    const { style = {}, ...restProps } = this.props;
    const { active } = this.state;
    return (
      <div className={styles.typeLsit} style={style} {...restProps}>
        {typeList.map(item => {
          const itemStyles = classNames(styles.typeItem, {
            [styles.active]: active[item.id],
          });
          return (
            <div
              key={item.id}
              className={itemStyles}
              onClick={() => {
                this.handleClick(item.id);
              }}
            >
              <span className={styles[item.icon]} />
              <span className={styles.itemName}>{item.name}</span>
            </div>
          );
        })}
      </div>
    );
  }
}

export default MapTypeBar;
