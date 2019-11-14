import React, { PureComponent, Fragment } from 'react';
import { Row, Col } from 'antd';
import { Section2 as CustomSection } from '@/jingan-components/CustomSection';
// 引入样式文件
import styles from './CompanyInfo.less';

import companyImg from '../imgs/company.png';
import certificateImg from '../imgs/certificate-icon.png';
import engineerImg from '../imgs/engineer-icon.png';

const companyName = '无锡晶安智慧科技有限公司';
const safetyMan = '张丽';
const phone = '13852145201';
const safetyDay = 3650;
const online = 36;

export default class CompanyInfo extends PureComponent {
  state = {};

  render() {
    return (
      <CustomSection className={styles.container} title="公司介绍">
        <div className={styles.content}>
          <div
            className={styles.img}
            style={{ background: `url(${companyImg}) center center / auto 100% no-repeat` }}
          />
          <div className={styles.companyName}>{companyName}</div>
          <div className={styles.safetyMan}>
            安全管理员：
            {safetyMan} {phone}
          </div>
          <Row gutter={10}>
            <Col span={12} style={{ lineHeight: '40px' }}>
              <span
                className={styles.icon}
                style={{ background: `url(${engineerImg}) center center / 100% 100% no-repeat` }}
              />
              注册安全工程师：
              {10}
            </Col>
            <Col span={12} style={{ lineHeight: '40px' }}>
              <span
                className={styles.icon}
                style={{ background: `url(${certificateImg}) center center / 100% 100% no-repeat` }}
              />
              安全生产资格证：
              {20}
            </Col>
          </Row>
          <Row gutter={10} style={{ margin: '2px 0 5px', padding: '0 10px' }}>
            <Col span={12}>
              <div className={styles.wrapper}>
                安全运行(天)
                <div className={styles.numbers}>
                  {safetyDay
                    .toString()
                    .split('')
                    .map((item, index) => (
                      <span className={styles.number} key={index}>
                        {item}
                      </span>
                    ))}
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className={styles.wrapper}>
                在线人数(人)
                <div className={styles.numbers}>
                  {online
                    .toString()
                    .split('')
                    .map((item, index) => (
                      <span className={styles.number} key={index}>
                        {item}
                      </span>
                    ))}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </CustomSection>
    );
  }
}
