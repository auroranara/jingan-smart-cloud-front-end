import React from 'react';
import moment from 'moment';
import { Timeline } from 'antd';

import styles from './MaintenanceCard.less';
import TimelineItem from './TimelineItem';
import ImgSlider from './ImgSlider';
import flowImg from '../imgs/flow_m.png';
import flowAlarm from '../imgs/flow_alarm.png';

const ID = 'maintenance-drawer';

function switchType(type) {
  let config = {};
  switch (type) {
    case 'alarm':
      config = {
        name: '报警',
        img: flowAlarm,
      };
      break;
    case 'fault':
      config = {
        name: '故障',
        img: flowImg,
      };
      break;
    default:
      break;
  }
  return config;
}

function getContainer() {
  return document.querySelector(`#${ID}`);
}

function Occured(props) {
  const { position, type, safety, phone, model } = props;

  return (
    <div className={styles.card}>
      <p>{position}</p>
      <p>{model} 发生报警！</p>
      <p>
        安全负责人：
        {safety} {phone}
      </p>
    </div>
  );
}

function Received(props) {
  const { man, phone, companyName } = props;

  return (
    <div className={styles.card}>
      <p>
        维修单位：
        {companyName}
      </p>
      <p>
        维修人员：
        {man} {phone}
      </p>
      {/* {desc && <p>问题描述：{desc}</p>}
      {imgs && !!imgs.length && <ImgSlider picture={imgs} />} */}
    </div>
  );
}

function Handled(props) {
  const { man, phone, feedback, imgs, companyName } = props;

  return (
    <div className={styles.card}>
      <p>报警已处理完毕！</p>
      <p>
        维修单位：
        {companyName}
      </p>
      <p>
        维修人员：
        {man} {phone}
      </p>
      <p>
        结果反馈：
        {feedback}
      </p>
      {/* {imgs && !!imgs.length && <ImgSlider picture={imgs} getContainer={getContainer} />} */}
      {imgs && !!imgs.length && <ImgSlider picture={imgs} />}
    </div>
  );
}

/* step 获取第几步: -> 1-4
 * faultType 故障类型: 0 -> 主机报障(显示4步)  1 -> 一键报修(显示三步);
 * nstatus 是否进行了维保: undefined 只显示第一步，存在的话，根据status进行判断
 * status 进行到那一步: 2 -> 第二步 0 -> 第三步 1 -> 第四步
 */
function isStepShow(step, faultType, status) {
  switch (step) {
    case 1:
      // 一键报修，不显示第一步，其他情况第一步都要显示
      if (faultType) return false;
      return true;
    case 2:
      // status不存在，只显示第一步
      if (!status) return false;
      else return status === '2' || status === '0' || status === '1';
    case 3:
      if (!status) return false;
      else return status === '0' || status === '1';
    case 4:
      if (!status) return false;
      else return status === '1';
    default:
      return false;
  }
}

// type 0 -> 日期 1 -> 时间
function getTime(time, type = 0) {
  if (!time) return;

  const m = moment(time);
  return type ? m.format('HH:mm:ss') : m.format('YYYY-MM-DD');
}

const SPANS = [5, 19];
const NO_DATA = '暂无信息';
const HOST_FAULT_DESC = '维修难度较大，指派维保';

export default function MaintenanceCard(props) {
  // type 1 已完成(处理完毕)   2 待处理(看status)   7 已超期(看status)
  const { type, data, isMaintenance, ...restProps } = props;
  const {
    nstatus, // undefined -> 第一步 '2' -> 待处理  '0' -> 处理中  '1' -> 已处理
    reportPhotos,
    sitePhotos,
    type: maintenanceType, // (1误报警；2真实报警；3自处理；4指派处理)
    // 一键报修
    report_type, // '2' 一键报修
    systemTypeValue,
    device_name,
    device_address,
    report_desc,
    // 主机报障
    label,
    install_address,
    realtime,
    area,
    location,
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
    end_date,
    startByName,
    startByPhone,
    startCompanyName,
    finishByName,
    finishByPhone,
    finishCompanyName,
    model_desc,
  } = data;

  const isOneKey = report_type === '2' ? 1 : 0; // 0 -> 主机报障  1 -> 一键报修
  const typeConfig = switchType(type);
  return (
    <div className={styles.container} {...restProps}>
      <div className={styles.head}>
        <div
          style={{
            background: `url(${typeConfig.img}) no-repeat center center`,
            backgroundSize: '100% auto',
          }}
          className={styles.flow}
        />
      </div>
      <div className={styles.timeline}>
        <Timeline>
          <TimelineItem
            spans={SPANS}
            label={`${typeConfig.name}发生`}
            day={getTime(realtime)}
            hour={getTime(realtime, 1)}
          >
            <Occured
              position={area + location || NO_DATA}
              safety={safetyPerson || NO_DATA}
              phone={safetyPhone || NO_DATA}
              model={model_desc}
            />
          </TimelineItem>

          <TimelineItem
            spans={SPANS}
            label="开始处理"
            day={getTime(start_date)}
            hour={getTime(start_date, 1)}
          >
            {/* {isMaintenance && (type === 1 || status === '0') && ( */}
            {isStepShow(3, isOneKey, nstatus) && (
              <Received
                man={startByName || NO_DATA}
                phone={startByPhone || NO_DATA}
                companyName={startCompanyName || NO_DATA}
              />
            )}
          </TimelineItem>

          <TimelineItem
            spans={SPANS}
            label="处理完毕"
            day={getTime(end_date)}
            hour={getTime(end_date, 1)}
          >
            {/* {isMaintenance && type === 1 && ( */}
            {isStepShow(4, isOneKey, nstatus) && (
              <Handled
                man={finishByName || NO_DATA}
                phone={finishByPhone || NO_DATA}
                feedback={disaster_desc || NO_DATA}
                imgs={sitePhotos}
                companyName={finishCompanyName || NO_DATA}
              />
            )}
          </TimelineItem>
        </Timeline>
      </div>
    </div>
  );
}
