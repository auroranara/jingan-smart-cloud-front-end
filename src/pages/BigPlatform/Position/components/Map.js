import React, { PureComponent } from 'react';

import styles from './Map.less';
import bg from '../imgs/mapOuter.png';
import mapBg from '../imgs/map.png';
import PersonIcon from './PersonIcon';

export default class Map extends PureComponent {
  render() {
    const { data=[], style, handleClickPerson, ...restProps } = this.props;
    const newStyle = {
      backgroundImage: `url(${bg})`,
      ...style,
    };

    return (
      <div className={styles.outer} style={newStyle} {...restProps}>
        <p className={styles.desc}>
          全厂108人
          <span className={styles.alarm}>报警：1处</span>
          <span className={styles.red}>SOS求救：1起</span>
        </p>
        <div className={styles.map} style={{ backgroundImage: `url(${mapBg})` }}>
          {data.map(({ xarea, yarea, isSOS }, i) => (
            <PersonIcon
              key={i}
              isSOS={isSOS}
              x={xarea}
              y={yarea}
              onClick={e => handleClickPerson(i, isSOS)}
            />
          ))}
          <div className={styles.sections}>
            <div className={styles.canteen} />
            <div className={styles.fire} />
            <div className={styles.play} />
            <div className={styles.lab} />
          </div>
        </div>
      </div>
    );
  }
}
