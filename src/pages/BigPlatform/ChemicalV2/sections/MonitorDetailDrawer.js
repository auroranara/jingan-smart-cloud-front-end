import React, { PureComponent, Fragment } from 'react';
import { Row, Col, Icon } from 'antd';
import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import SectionDrawer from '@/pages/BigPlatform/Safety/Company3/components/SectionDrawer';
import moment from 'moment';
import { Gauge } from '../components/Components';
// 引入样式文件
import styles from './MonitorDetailDrawer.less';
import iconAlarm from '@/assets/icon-alarm.png';
import cameraImg from '@/pages/BigPlatform/Operation/imgs/camera.png';
import iconList from '../imgs/icon-list.png';
import iconChart from '../imgs/icon-chart.png';
import { MonitorTitles, MonitorDetailFields } from '../utils';

export default class MonitorDetailDrawer extends PureComponent {
  state = {};

  render() {
    const { visible, onClose, monitorData, handleShowVideo, type } = this.props;
    const { title, location, number, isDanger, status, monitors = [] } = monitorData;
    return (
      <SectionDrawer
        drawerProps={{
          title: `${MonitorTitles[type]}监测`,
          visible,
          onClose,
          width: 535,
          zIndex: 1777,
        }}
      >
        <div className={styles.top}>
          {MonitorDetailFields[type].map((item, index) => {
            const { label, value, render } = item;
            return (
              <div key={index}>
                <span className={styles.label}>{label}：</span>
                {render ? render(monitorData[value]) : monitorData[value]}
              </div>
            );
          })}
          {status === 1 && (
            <div
              className={styles.alarm}
              style={{
                background: `url(${iconAlarm}) center center / 100% 100% no-repeat`,
                top: type === 6 && '3px',
              }}
            />
          )}
        </div>

        <div className={styles.monitor}>
          <div className={styles.title}>
            监测位置1
            <span
              className={styles.video}
              style={{
                background: `url(${cameraImg}) center center / 100% 100% no-repeat`,
              }}
              onClick={handleShowVideo}
            />
            <span className={styles.extra}>
              <span
                className={styles.icon}
                style={{
                  background: `url(${iconList}) center center / 100% 100% no-repeat`,
                }}
              />
              <span
                className={styles.icon}
                style={{
                  background: `url(${iconChart}) center center / 100% 100% no-repeat`,
                }}
              />
            </span>
          </div>
          <Row>
            {monitors.map((item, index) => {
              const { gaugeData = {}, extra } = item;
              return (
                <Col key={index} span={12}>
                  {/* <Gauge data={{ value: 68, title: '可燃气体浓度', unit: 'mg/m³' }} extra={extra} /> */}
                  <Gauge data={gaugeData} extra={extra} />
                </Col>
              );
            })}
          </Row>
        </div>

        <div className={styles.monitor}>
          <div className={styles.title}>
            监测位置2
            <span
              className={styles.video}
              style={{
                background: `url(${cameraImg}) center center / 100% 100% no-repeat`,
              }}
              onClick={handleShowVideo}
            />
            <span className={styles.extra}>
              <span
                className={styles.icon}
                style={{
                  background: `url(${iconList}) center center / 100% 100% no-repeat`,
                }}
              />
              <span
                className={styles.icon}
                style={{
                  background: `url(${iconChart}) center center / 100% 100% no-repeat`,
                }}
              />
            </span>
          </div>
          <Row>
            {monitors.map((item, index) => {
              const { gaugeData = {}, extra } = item;
              return (
                <Col key={index} span={12}>
                  {/* <Gauge data={{ value: 68, title: '可燃气体浓度', unit: 'mg/m³' }} extra={extra} /> */}
                  <Gauge data={gaugeData} extra={extra} />
                </Col>
              );
            })}
          </Row>
        </div>
      </SectionDrawer>
    );
  }
}
