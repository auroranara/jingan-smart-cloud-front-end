import React from 'react';
import moment from 'moment';
import { Timeline } from 'antd';

import styles from './TimelineCard.less';
import TimelineItem from './TimelineItem';
import ImgSlider from './ImgSlider';
import flowImg from '../imgs/flow.png';

function Alarmed(props) {
  const { position, type, safety, phone } = props;

  return (
    <div className={styles.card}>
      <p>{position}</p>
      <p>{type}</p>
      <p>安全负责人：{safety} {phone}</p>
    </div>
  );
}

function Confirmed(props) {
  const { type, reporter, phone } = props;

  return (
    <div className={styles.card}>
      <p>确认该火警为：{type}</p>
      <p>上报人：{reporter} {phone}</p>
    </div>
  );
}

function Handled(props) {
  const { reporter, phone, feedback, picture=[] } = props;

  return (
    <div className={styles.card}>
      <p>火警处理完毕</p>
      <p>上报人：{reporter} {phone}</p>
      <p>结果反馈：{feedback}</p>
      {picture && !!picture.length && <ImgSlider picture={picture} />}
    </div>
  );
}

// type 0 -> 日期 1 -> 时间
function getTime(time, type=0) {
  if (!time)
    return;

  const m = moment(time);
  return type ? m.format('HH:mm:ss') : m.format('YYYY-MM-DD');
}

const SPANS = [4, 20];
const NO_DATA = '暂无信息';

export default function TimelineCard(props) {
  const { startMap, handleMap, finshMap: finishMap, ...restProps } = props;
  const [isStarted, isHandling, isFinished] = [startMap, handleMap, finishMap].map(m => m ? !!Object.keys(m).length : false);

  console.log(startMap.startTime);

  return (
    <div className={styles.container} {...restProps}>
      <div className={styles.head}>
        <div style={{ backgroundImage: `url(${flowImg})` }} className={styles.flow} />
      </div>
      <div className={styles.timeline}>
        <Timeline>
          <TimelineItem
            label="报警"
            spans={SPANS}
            day={getTime(isStarted && startMap.startTime)}
            hour={getTime(isStarted && startMap.startTime, 1)}
          >
            {isStarted && (
              <Alarmed
                position={startMap.installAddress || NO_DATA}
                type={startMap.unitType || NO_DATA}
                safety={startMap.safetyMan || NO_DATA}
                phone={startMap.safetyPhone || NO_DATA}
              />
            )}
          </TimelineItem>
          <TimelineItem
            label="确认"
            spans={SPANS}
            day={getTime(isHandling && handleMap.createTime)}
            hour={getTime(isHandling && handleMap.createTime, 1)}
          >
            {isHandling && (
              <Confirmed
                type={handleMap.fireType || 0}
                reporter={handleMap.reportMan || NO_DATA}
                phone={handleMap.reportPhone || NO_DATA}
              />
            )}
          </TimelineItem>
          <TimelineItem
            label="处理"
            spans={SPANS}
            day={getTime(isFinished && finishMap.endTime)}
            hour={getTime(isFinished && finishMap.endTime, 1)}
          >
            {isFinished && (
              <Handled
                reporter={finishMap.executMan || NO_DATA}
                phone={finishMap.executPhone || NO_DATA}
                feedback={finishMap.disasterDesc || NO_DATA}
                picture={finishMap.picture || []}
              />
            )}
          </TimelineItem>
        </Timeline>
      </div>
    </div>
  );
}
