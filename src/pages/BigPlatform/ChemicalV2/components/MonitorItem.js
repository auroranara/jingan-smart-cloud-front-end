import React, { PureComponent, Fragment } from 'react';
import { Col, Spin } from 'antd';
import moment from 'moment';
import DrawerContainer from '@/pages/BigPlatform/NewUnitFireControl/components/DrawerContainer';
import styles from './MonitorItem.less';
import { DataList } from '../utils';
import iconAlarm from '@/assets/icon-alarm.png';

export default class MonitorItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { data, fields, styles = {} } = this.props;
    const { title, status } = data;
    return (
      <div className={styles.container} style={{ ...styles }}>
        <div className={styles.title}>{title}</div>
        {status === 1 && (
          <div
            className={styles.icon}
            style={{
              background: `url(${iconAlarm}) center center / 100% auto no-repeat`,
            }}
          />
        )}
        {fields.map(item => {
          const { label, value, render } = item;
          return (
            <div className={styles.field}>
              <span className={styles.label}>{label}</span>
              <span className={styles.value}>{render ? render(data[value]) : data[value]}</span>
            </div>
          );
        })}
      </div>
    );
  }
}
