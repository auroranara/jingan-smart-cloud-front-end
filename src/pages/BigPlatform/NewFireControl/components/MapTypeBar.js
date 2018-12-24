import React, { Component } from 'react';
import classNames from 'classnames';
import styles from './MapTypeBar.less';
import satelliteIcon from '../img/satellite.png';
import roadIcon from '../img/road.png';

const typeList = [
  {
    id: 'satellite',
    name: '卫星',
    icon: 'iconSatellite',
    url: satelliteIcon,
  },
  {
    id: 'road',
    name: '路况',
    icon: 'iconRoad',
    url: roadIcon,
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
              <span className={styles[item.icon]} style={{ backgroundImage: `url(${item.url})` }} />
              <span className={styles.itemName}>{item.name}</span>
            </div>
          );
        })}
        {/* <div className={itemStyles} onClick={()=>{this.handleClick()}}>
          <span className={styles.iconSatellite} />
          <span className={styles.itemName}>卫星</span>
        </div>
        <div className={itemStyles} onClick={()=>{this.handleClick()}}>
          <span className={styles.iconRoad} />
          <span className={styles.itemName}>路况</span>
        </div> */}
      </div>
    );
  }
}

export default MapTypeBar;
