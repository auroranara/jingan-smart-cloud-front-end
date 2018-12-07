import React, { Fragment } from 'react';
import moment from 'moment';
import { Timeline } from 'antd';

import styles from './FaultMessageDrawer.less';
import DrawerContainer from '../components/DrawerContainer';
import TimelineItem from '../components/TimelineItem';
import flowImg from '../imgs/flow_m.png';

function Occured(props) {
  const {
    position,
    type,
    model: {
      companyMessage: {
        companyMessage: { headOfSecurity = '', headOfSecurityPhone = '' },
      },
    },
  } = props;

  return (
    <div className={styles.card}>
      <p>{position}</p>
      <p>{type} 发生故障</p>
      <p>
        安全负责人：
        {headOfSecurity} {headOfSecurityPhone}
      </p>
    </div>
  );
}

function Assigned(props) {
  const { systemType, loopNumber, partNumber, position } = props;

  return (
    <div className={styles.card}>
      <p>
        部件类型：
        {systemType}
      </p>
      <p>
        详细位置：
        {position}
      </p>
      {loopNumber &&
        partNumber && (
          <p>
            回路故障号：
            {loopNumber}
            回路
            {partNumber}号
          </p>
        )}
    </div>
  );
}

// type 0 -> 日期 1 -> 时间
function getTime(time, type = 0) {
  if (!time) return;

  const m = moment(time);
  return type ? m.format('HH:mm:ss') : m.format('YYYY-MM-DD');
}

const SPANS = [5, 19];
const NO_DATA = '暂无信息';

export default function FaultMessageDrawer(props) {
  const { data, model, ...restProps } = props;

  // status "2" -> 指派维保   "0" -> 受理中
  const { faultType = 0, addTime, installAddress, loopNumber, partNumber, componentType } = data;

  const isOneKey = faultType ? 1 : 0; // 是否为一键报修

  const left = (
    <div className={styles.container} {...restProps}>
      <div className={styles.head}>
        <div style={{ backgroundImage: `url(${flowImg})` }} className={styles.flow} />
      </div>
      <div className={styles.timeline} style={{ borderTop: 'none' }}>
        <Timeline>
          {/* 主机故障时才会显示这个，一键报修时不显示 */}
          {!isOneKey && (
            <TimelineItem
              spans={SPANS}
              label="故障发生"
              day={getTime(addTime)}
              hour={getTime(addTime, 1)}
            >
              <Occured
                position={installAddress || NO_DATA}
                type={componentType || NO_DATA}
                model={model}
              />
            </TimelineItem>
          )}
          <TimelineItem
            spans={SPANS}
            label={isOneKey ? '故障报修' : '指派维保'}
            day={getTime(addTime)}
            hour={getTime(addTime, 1)}
          >
            {isOneKey && (
              <Assigned
                systemType={componentType}
                loopNumber={loopNumber}
                partNumber={partNumber}
                position={installAddress}
              />
            )}
          </TimelineItem>
          <TimelineItem spans={SPANS} label="受理中" />
          <TimelineItem spans={SPANS} label="处理完毕" />
        </Timeline>
      </div>
    </div>
  );

  return <DrawerContainer title="故障处理动态" width={535} left={left} {...restProps} />;
}
