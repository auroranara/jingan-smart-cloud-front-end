import React, { PureComponent, Fragment } from 'react';
import { Timeline  } from 'antd';

import styles from './MaintenanceDrawer.less';
import DrawerContainer from '../components/DrawerContainer';
import TimelineItem from '../components/TimelineItem';
import ImgSlider from '../components/ImgSlider';
import flowImg from '../imgs/flow_m.png';

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
  const { man, phone, desc, company, imgs } = props;

  return (
    <div className={styles.card}>
      <p>{desc}</p>
      <p>指派人员：{man} {phone}</p>
      <p>维修单位：{company}</p>
    </div>
  );
}

function Received(props) {
  const { man, phone, desc, imgs } = props;

  return (
    <div className={styles.card}>
      <p>维保公司受理该维保工单</p>
      <p>维修人员：{man} {phone}</p>
      <p>问题描述：{desc}</p>
      <ImgSlider />
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
    </div>
  );
}

const SPANS = [5, 19];

export default class AlarmDynamicDrawer extends PureComponent {
  render() {
    const left = (
      <div className={styles.container}>
        <div className={styles.head}>
          <div style={{ backgroundImage: `url(${flowImg})` }} className={styles.flow} />
        </div>
        <div className={styles.timeline}>
          <Timeline>
            <TimelineItem spans={SPANS} label="故障发生" day="2019-1-1" hour="10:12:38">
              <Occured
                position="五号楼五层消防展示厅东侧"
                type="点型烟感探测器报警"
                safety="张三"
                phone="13212341234"
              />
            </TimelineItem>
            <TimelineItem spans={SPANS} label="指派维保" day="2019-1-1" hour="10:25:38">
              <Assigned
                man="张三"
                phone="13212341234"
                desc="维修难道较大，指派维保"
                company="南京消防维保有限公司"
              />
            </TimelineItem>
            <TimelineItem spans={SPANS} label="受理中">
              <Received
                man="李四"
                phone="13212341234"
                desc="维修难道较大，指派维保"
              />
            </TimelineItem>
            <TimelineItem spans={SPANS} label="处理完毕">
              <Handled
                time="2018-11-29 10:00:00"
                reporter="王五"
                phone="13212341234"
                feedback="现场已处理完毕"
              />
            </TimelineItem>
          </Timeline>
        </div>
      </div>
    );

    return (
      <DrawerContainer
        title="维保处理动态"
        width={535}
        left={left}
        {...this.props}
      />
    );
  }
}
