import React from 'react';
import moment from 'moment';
import { Timeline  } from 'antd';

import styles from './MaintenanceCard.less';
import TimelineItem from './TimelineItem';
import ImgSlider from './ImgSlider';
import flowImg from '../imgs/flow_m.png';

const ID = 'maintenance-drawer';

function getContainer() {
  return document.querySelector(`#${ID}`);
}

function Occured(props) {
  const { position, type, safety, phone } = props;

  return (
    <div className={styles.card}>
      <p>{position}</p>
      <p>{type} 发生故障</p>
      <p>安全负责人：{safety} {phone}</p>
    </div>
  );
}

function Assigned(props) {
  const { man, phone, desc, systemType, deviceName, position, company, imgs } = props;

  return (
    <div className={styles.card}>
      {desc && <p>{desc}</p>}
      {systemType && <p>系统类型：{systemType}</p>}
      {deviceName && <p>设备名称：{deviceName}</p>}
      {position && <p>详细位置：{position}</p>}
      <p>指派人员：{man} {phone}</p>
      <p>维修单位：{company}</p>
      {/* {imgs && !!imgs.length && <ImgSlider picture={imgs} getContainer={getContainer} />} */}
      {imgs && !!imgs.length && <ImgSlider picture={imgs} />}
    </div>
  );
}

function Received(props) {
  const { man, phone, desc, imgs } = props;

  return (
    <div className={styles.card}>
      <p>维保公司受理该维保工单</p>
      <p>维修人员：{man} {phone}</p>
      {/* {desc && <p>问题描述：{desc}</p>}
      {imgs && !!imgs.length && <ImgSlider picture={imgs} />} */}
    </div>
  );
}

function Handled(props) {
  const { man, phone, feedback, imgs } = props;

  return (
    <div className={styles.card}>
      <p>维保公司已处理完毕</p>
      <p>维修人员：{man} {phone}</p>
      <p>结果反馈：{feedback}</p>
      {/* {imgs && !!imgs.length && <ImgSlider picture={imgs} getContainer={getContainer} />} */}
      {imgs && !!imgs.length && <ImgSlider picture={imgs} />}
    </div>
  );
}

// type 0 -> 日期 1 -> 时间
function getTime(time, type=0) {
  if (!time)
    return;

  const m = moment(time);
  return type ? m.format('HH:MM:SS') : m.format('YYYY-MM-DD');
}


const SPANS = [5, 19];
const NO_DATA = '暂无信息';

export default function MaintenanceCard(props) {
  // type 1 已完成(处理完毕)   2 待处理(看status)   7 已超期(看status)
  const { type, data, showFlow, ...restProps } = props;
  // status "2" -> 指派维保   "0" -> 受理中
  const {
    status, // '2' -> 待处理  '0' -> 处理中
    reportPhotos,
    sitePhotos,
    // 一键报修
    report_type, // '2' 一键报修
    systemTypeValue,
    device_name,
    device_address,
    report_desc,
    // 主机报障
    label,
    install_address,
    // 相同部分
    safetyPerson,
    safetyPhone,
    createByName,
    createByPhone,
    executor_name,
    phone,
    unit_name,
    disaster_desc,
    //时间
    save_time,
    create_date,
    start_date,
    update_date,
  } = data;

  const isOneKey = report_type === '2'; // 是否为一键报修

  return (
    <div className={styles.container} {...restProps}>
      {showFlow && (
        <div className={styles.head}>
          <div style={{ backgroundImage: `url(${flowImg})` }} className={styles.flow} />
        </div>
      )}
      <div className={styles.timeline} style={showFlow ? null : { borderTop: 'none' }}>
        <Timeline>
          {/* 主机故障时才会显示这个，一键报修时不显示 */}
          {!isOneKey && (
            <TimelineItem
              spans={SPANS}
              label="故障发生"
              day={getTime(save_time)}
              hour={getTime(save_time, 1)}
            >
              <Occured
                position={install_address || NO_DATA}
                type={label || NO_DATA}
                safety={safetyPerson || NO_DATA}
                phone={safetyPhone || NO_DATA}
              />
            </TimelineItem>
          )}
          <TimelineItem
            spans={SPANS}
            label={isOneKey ? '故障报修' : '指派维保'}
            day={getTime(create_date)}
            hour={getTime(create_date, 1)}
          >
            {(type === 1 || status === '2' || status === '0') && (
              <Assigned
                man={createByName || NO_DATA}
                phone={createByPhone || NO_DATA}
                desc={isOneKey ? (report_desc || NO_DATA) : null}
                company={unit_name || NO_DATA}
                imgs={reportPhotos}
                // 一键报修时，比主机故障多显示以下信息
                systemType={systemTypeValue}
                deviceName={device_name}
                position={device_address}
              />
            )}
          </TimelineItem>
          <TimelineItem
            spans={SPANS}
            label="受理中"
            day={getTime(start_date)}
            hour={getTime(start_date, 1)}
          >
            {(type === 1 || status === '0') && (
              <Received
                man={executor_name || NO_DATA}
                phone={phone || NO_DATA}
              />
            )}
          </TimelineItem>
          <TimelineItem
            spans={SPANS}
            label="处理完毕"
            day={getTime(update_date)}
            hour={getTime(update_date, 1)}
          >
            {type === 1 && (
              <Handled
                man={executor_name || NO_DATA}
                phone={phone || NO_DATA}
                feedback={disaster_desc || NO_DATA}
                imgs={sitePhotos}
              />
            )}
          </TimelineItem>
        </Timeline>
      </div>
    </div>
  );
}
