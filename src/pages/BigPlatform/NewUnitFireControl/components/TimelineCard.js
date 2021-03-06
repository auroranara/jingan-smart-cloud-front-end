import React from 'react';
import moment from 'moment';
import { Timeline } from 'antd';

import styles from './TimelineCard.less';
import TimelineItem from './TimelineItem';
import ImgSlider from './ImgSlider';
import { vaguePhone } from '../utils';
// import flowImg from '../imgs/flow.png';

const flowImg = 'http://data.jingan-china.cn/v2/chem/screen/flow.png';
const STATUS = { 1: '误报火警', 2: '真实火警' };

const isVague = false;
function nameToVague(str) {
  let newStr = '';
  if (str && str.length === 1) return str;
  else if (str && str.length === 2) {
    newStr = str.substr(0, 1) + '*';
  } else if (str && str.length > 2) {
    newStr = str.substr(0, 1) + '*' + str.substr(-1);
  } else return str;
  return newStr;
}

function phoneToVague(str) {
  if (!str) return str;
  const newStr = str.substr(0, 3) + '****' + str.substr(-4);
  return newStr;
}

function Alarmed(props) {
  const {
    deviceCode,
    deviceAddress,
    position,
    type,
    safety,
    phone,
    companyName,
    phoneVisible,
  } = props;

  return (
    <div className={styles.card}>
      <p>{position}</p>
      <p>{type} 发生报警</p>
      {/* <p>
        消防主机：
        {deviceCode} {deviceAddress}
      </p> */}
      {/* <p>
        单位名称：
        {companyName}
      </p> */}
      <p>
        安全管理员：
        {isVague ? nameToVague(safety) : safety} {vaguePhone(phone, phoneVisible)}
      </p>
    </div>
  );
}

function Confirmed(props) {
  const { status, reporter, phone, companyName, phoneVisible } = props;
  const isTrueAlarm = Number(status) === 2;

  return (
    <div className={styles.card}>
      <p>
        确认该火警为：
        <span className={isTrueAlarm ? styles.true : undefined}>{STATUS[status]}</span>
      </p>
      <p>
        处理单位：
        {companyName}
      </p>
      <p>
        处理人员：
        {isVague ? nameToVague(reporter) : reporter} {vaguePhone(phone, phoneVisible)}
      </p>
    </div>
  );
}

function Handled(props) {
  const { reporter, phone, feedback, picture = [], companyName, phoneVisible } = props;

  return (
    <div className={styles.card}>
      {/* <p>火警处理完毕</p> */}
      <p>
        处理单位：
        {companyName}
      </p>
      <p>
        处理人员：
        {isVague ? nameToVague(reporter) : reporter} {vaguePhone(phone, phoneVisible)}
      </p>
      <p>
        结果反馈：
        {feedback}
      </p>
      {picture && !!picture.length && <ImgSlider picture={picture} />}
    </div>
  );
}

// type 0 -> 日期 1 -> 时间
function getTime(time, type = 0) {
  if (!time) return;

  const m = moment(time);
  return type ? m.format('HH:mm:ss') : m.format('YYYY-MM-DD');
}

const SPANS = [4, 20];
const NO_DATA = '暂无信息';

export default function TimelineCard(props) {
  const {
    startMap,
    handleMap,
    finshMap: finishMap,
    createCompanyName,
    finishCompanyName,
    startCompanyName,
    showHead = true,
    phoneVisible,
    ...restProps
  } = props;
  const [isStarted, isHandling, isFinished] = [startMap, handleMap, finishMap].map(
    m => (m ? !!Object.keys(m).length : false)
  );

  return (
    <div className={styles.container} {...restProps}>
      {showHead && (
        <div className={styles.head}>
          <div
            style={{
              background: `url(${flowImg}) no-repeat center center`,
              backgroundSize: '99% auto',
            }}
            className={styles.flow}
          />
        </div>
      )}
      <div className={styles.timeline}>
        <Timeline>
          <TimelineItem
            label="发生"
            spans={SPANS}
            day={getTime(isStarted && startMap.startTime)}
            hour={getTime(isStarted && startMap.startTime, 1)}
          >
            {isStarted && (
              <Alarmed
                deviceCode={startMap.deviceCode || NO_DATA}
                deviceAddress={startMap.deviceAddress}
                position={startMap.installAddress || NO_DATA}
                type={startMap.unitType || NO_DATA}
                safety={startMap.safetyMan || NO_DATA}
                phone={startMap.safetyPhone || NO_DATA}
                companyName={startMap.companyName || createCompanyName || NO_DATA}
                phoneVisible={phoneVisible}
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
                status={handleMap.fireType || 0}
                reporter={handleMap.reportMan || NO_DATA}
                phone={handleMap.reportPhone || NO_DATA}
                companyName={startCompanyName || NO_DATA}
                phoneVisible={phoneVisible}
              />
            )}
          </TimelineItem>
          <TimelineItem
            label="完成"
            spans={SPANS}
            day={getTime(isFinished && finishMap.endTime)}
            hour={getTime(isFinished && finishMap.endTime, 1)}
          >
            {isFinished && (
              <Handled
                reporter={finishMap.executMan || NO_DATA}
                phone={finishMap.executPhone || NO_DATA}
                companyName={finishCompanyName || NO_DATA}
                feedback={finishMap.disasterDesc || NO_DATA}
                picture={finishMap.picture || []}
                phoneVisible={phoneVisible}
              />
            )}
          </TimelineItem>
        </Timeline>
      </div>
    </div>
  );
}
