import React, { PureComponent, Fragment } from 'react';
import { Timeline  } from 'antd';

import styles from './AlarmDynamicDrawer.less';
import DrawerContainer from '../components/DrawerContainer';
import TimelineItem from '../components/TimelineItem';
import ImgSlider from '../components/ImgSlider';
import flowImg from '../imgs/flow.png';

function Alarmed(props) {
  const { time, position, type, safety, phone } = props;

  return (
    <div className={styles.card}>
      <p>{time} {position}</p>
      <p>{type}</p>
      <p>安全负责人：{safety} {phone}</p>
    </div>
  );
}

function Confirmed(props) {
  const { time, type, reporter, phone, desc, imgs } = props;

  return (
    <div className={styles.card}>
      <p>{time}</p>
      <p>确认该火警为：{type}</p>
      <p>上报人：{reporter} {phone}</p>
      <p>火情描述：{desc}</p>
      <ImgSlider />
    </div>
  );
}

function Handled(props) {
  const { time, reporter, phone, feedback, imgs } = props;

  return (
    <div className={styles.card}>
      <p>{time}</p>
      <p>火警处理完毕</p>
      <p>上报人：{reporter} {phone}</p>
      <p>结果反馈：{feedback}</p>
    </div>
  );
}

export default class AlarmDynamicDrawer extends PureComponent {
  render() {
    const left = (
      <div className={styles.container}>
        <div className={styles.head}>
          <div style={{ backgroundImage: `url(${flowImg})` }} className={styles.flow} />
        </div>
        <div className={styles.timeline}>
          <Timeline>
            <TimelineItem label="报警">
              <Alarmed
                time="2018-11-29 10:00:00"
                position="五号楼五层消防展示厅东侧"
                type="点型烟感探测器报警"
                safety="张三"
                phone="13212341234"
              />
            </TimelineItem>
            <TimelineItem label="确认">
              <Confirmed
                time="2018-11-29 10:00:00"
                type="真实火警"
                reporter="张三"
                phone="13212341234"
                desc="现场大量浓烟，无人员伤亡"
              />
            </TimelineItem>
            <TimelineItem label="处理" />
            {/* <TimelineItem label="处理">
              <Handled
                time="2018-11-29 10:00:00"
                reporter="张三"
                phone="13212341234"
                feedback="现场已处理完毕"
              />
            </TimelineItem> */}
          </Timeline>
        </div>
      </div>
    );

    return (
      <DrawerContainer
        title="火警动态"
        width={535}
        left={left}
        {...this.props}
      />
    );
  }
}
