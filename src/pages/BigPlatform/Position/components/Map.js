import React, { PureComponent } from 'react';

import PersonIcon from './PersonIcon';
import styles from './Map.less';
import bg from '../imgs/mapOuter.png';
import mapBg from '../imgs/map.png';
import cameraIcon from '../imgs/camera.png';

const SECTIONS = ['canteen', 'fire', 'play', 'lab'];
// const SELECTED = [0, 2];
// const SELECTED = [];
const CAMERAS = [
  { id: 0, top: 3, right: 3, videoKeyId: '250ch11' },
  { id: 1, top: '45%', right: 3, videoKeyId: '250ch10' },
];

export default class Map extends PureComponent {
  render() {
    const {
      data=[],
      quantity: { sos, alarm },
      overstepSections=[],
      style,
      handleClickPerson,
      handleAlarmSectionClick,
      handleShowVideo,
      ...restProps
    } = this.props;
    const newStyle = {
      backgroundImage: `url(${bg})`,
      ...style,
    };

    return (
      <div className={styles.outer} style={newStyle} {...restProps}>
        <p className={styles.desc}>
          全厂1人
          <span className={styles.alarm}>报警：{alarm}处</span>
          <span className={styles.red}>SOS求救：{sos}起</span>
        </p>
        <div className={styles.map} style={{ backgroundImage: `url(${mapBg})` }}>
          {data.map(({ xarea=0, yarea=0, sos, cardId }, i) => (
            <PersonIcon
              key={cardId}
              isSOS={sos}
              x={`${xarea}%`}
              y={`${yarea}%`}
              onClick={e => handleClickPerson(cardId)}
            />
          ))}
          <div className={styles.sections}>
            {SECTIONS.map((sec, i) => {
              const isAlarm = overstepSections.includes(i);
              return (
                <div
                  key={sec}
                  className={styles[isAlarm ? `${sec}Alarm` : sec]}
                  onClick={isAlarm ? e => handleAlarmSectionClick('1') : null}
                />
              );
            })}
          </div>
          {CAMERAS.map(({ id, top, right, videoKeyId }) => (
            <span
              key={id}
              className={styles.camera}
              style={{ backgroundImage: `url(${cameraIcon})`, top, right }}
              onClick={e => handleShowVideo(videoKeyId)}
            />
          ))}
        </div>
      </div>
    );
  }
}
