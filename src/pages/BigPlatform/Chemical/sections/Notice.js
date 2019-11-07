import React, { PureComponent, Fragment } from 'react';
import { Row, Col } from 'antd';
import moment from 'moment';
import { Section2 as CustomSection } from '@/jingan-components/CustomSection';
// 引入样式文件
import styles from './Notice.less';

const data = [
  { title: '安全承诺制度公告', time: 1572931992000, status: 1 },
  { title: '公司化工工艺变更调整公告', time: 1572931992000, status: 0 },
  { title: '新系统上线试用公告', time: 1572931992000, status: 0 },
];

export default class Notice extends PureComponent {
  state = {};

  render() {
    return (
      <CustomSection className={styles.container} title="最新公告">
        <div className={styles.content}>
          {data.map((item, index) => {
            const { title, time, status } = item;
            return (
              <div key={index} className={styles.wrapper}>
                <div className={styles.title}>{title}</div>
                <div className={styles.time}>{moment(time).format('YYYY-MM-DD')}</div>
                <div className={styles.status} style={{ color: status === 0 ? '#ba172a' : '#0ff' }}>
                  {status === 0 ? '未读' : '已读'}
                </div>
              </div>
            );
          })}
        </div>
      </CustomSection>
    );
  }
}
