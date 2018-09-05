import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import Section from '../Section/Section.js';

import styles from './FireAlarmSystem.less';

// 图片地址前缀
const prefix = 'http://data.jingan-china.cn/v2/big-platform/fire-control/com/';
// 火警背景图片地址
const fireUrl = `${prefix}circle-red.gif`;
// 故障背景图片地址
const faultUrl = `${prefix}circle-blue.gif`;
// 屏蔽背景图片地址
const shieldUrl = `${prefix}circle-green.gif`;
// 联动背景图片地址
const linkageUrl = `${prefix}circle-yel.gif`;
// 监管背景图片地址
const superviseUrl = `${prefix}circle-pur.gif`;
// 反馈背景图片地址
const feedbackUrl = `${prefix}circle-gray.gif`;

/**
 * 火灾报警系统
 */
export default class App extends PureComponent {
  render() {
    const {
      // 火警
      fire=0,
      // 故障
      fault=0,
      // 屏蔽
      shield=0,
      // 联动
      linkage=0,
      // 监管
      supervise=0,
      // 反馈
      feedback=0,
      onClick,
      fixedContent,
    } = this.props;

    return (
      <Section title="火灾报警系统" fixedContent={fixedContent}>
        <div style={{ height: '100%' }}>
          <Row style={{ height: '50%' }}>
            <Col span={8} style={{ height: '100%' }}>
              <div className={styles.item}>
                <div className={styles.itemValue} style={{ backgroundImage: `url(${fireUrl})`, color: '#F54F5D', cursor: fire ? 'pointer': undefined }} onClick={fire ? onClick : undefined}>{fire}</div>
                <div className={styles.itemName}>火警</div>
              </div>
            </Col>
            <Col span={8} style={{ height: '100%' }}>
              <div className={styles.item}>
                <div className={styles.itemValue} style={{ backgroundImage: `url(${faultUrl})`, color: '#00BAFF', cursor: fault ? 'pointer': undefined }} onClick={fault ? onClick : undefined}>{fault}</div>
                <div className={styles.itemName}>故障</div>
              </div>
            </Col>
            <Col span={8} style={{ height: '100%' }}>
              <div className={styles.item}>
                <div className={styles.itemValue} style={{ backgroundImage: `url(${linkageUrl})`, color: '#F6B54E', cursor: linkage ? 'pointer': undefined }} onClick={linkage ? onClick : undefined}>{linkage}</div>
                <div className={styles.itemName}>联动</div>
              </div>
            </Col>
          </Row>
          <Row style={{ height: '50%' }}>
            <Col span={8} style={{ height: '100%' }}>
              <div className={styles.item}>
                <div className={styles.itemValue} style={{ backgroundImage: `url(${superviseUrl})`, color: '#847BE6', cursor: supervise ? 'pointer': undefined }} onClick={supervise ? onClick : undefined}>{supervise}</div>
                <div className={styles.itemName}>监管</div>
              </div>
            </Col>
            <Col span={8} style={{ height: '100%' }}>
              <div className={styles.item}>
                <div className={styles.itemValue} style={{ backgroundImage: `url(${shieldUrl})`, color: '#01B0D1', cursor: shield ? 'pointer': undefined }} onClick={shield ? onClick : undefined}>{shield}</div>
                <div className={styles.itemName}>屏蔽</div>
              </div>
            </Col>
            <Col span={8} style={{ height: '100%' }}>
              <div className={styles.item}>
                <div className={styles.itemValue} style={{ backgroundImage: `url(${feedbackUrl})`, color: '#BBBBBC', cursor: feedback ? 'pointer': undefined }} onClick={feedback ? onClick : undefined}>{feedback}</div>
                <div className={styles.itemName}>反馈</div>
              </div>
            </Col>
          </Row>
        </div>
      </Section>
    );
  }
}
