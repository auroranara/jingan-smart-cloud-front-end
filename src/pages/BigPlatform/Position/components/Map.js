import React, { PureComponent } from 'react';

import PersonIcon from './PersonIcon';
import styles from './Map.less';
import bg from '../imgs/mapOuter.png';
import mapBg from '../imgs/map.png';
import cameraIcon from '../imgs/camera.png';

const SECTIONS = ['canteen', 'fire', 'play', 'lab'];
const SELECTED = 2;
const CAMERAS = [
  { id: 0, top: 3, right: 3 },
  { id: 1, top: '45%', right: 3 },
];

export default class Map extends PureComponent {
  render() {
    const { data=[], style, handleClickPerson, handleAlarmSectionClick, ...restProps } = this.props;
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
          {data.map(({ xarea=0, yarea=0, isSOS }, i) => (
            <PersonIcon
              key={i}
              isSOS={isSOS}
              x={`${xarea}%`}
              y={`${yarea}%`}
              onClick={e => handleClickPerson(i, isSOS)}
            />
          ))}
          <div className={styles.sections}>
            {SECTIONS.map((sec, i) => {
              const isAlarm = i === SELECTED;
              return (
                <div
                  key={sec}
                  className={styles[isAlarm ? `${sec}Alarm` : sec]}
                  onClick={isAlarm ? e => handleAlarmSectionClick() : null}
                />
              );
            })}
          </div>
          {CAMERAS.map(({ id, top, right }) => (
            <span
              key={id}
              className={styles.camera}
              style={{ backgroundImage: `url(${cameraIcon})`, top, right }}
            />
          ))}
        </div>
      </div>
    );
  }
}
