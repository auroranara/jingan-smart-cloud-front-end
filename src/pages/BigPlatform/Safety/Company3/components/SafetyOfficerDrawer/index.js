import React, { PureComponent } from 'react';
import { Row, Col } from 'antd'
import SectionDrawer from '../SectionDrawer';
// 引入样式文件
import styles from './index.less';

/**
 * 安全人员抽屉
 */
export default class SafetyOfficerDrawer extends PureComponent {
  componentDidUpdate({ visible: prevVisible }) {
    const { visible } = this.props;
    if (!prevVisible && visible) {
      this.scroll.dom.scrollTop();
    }
  }

  refScroll = (scroll) => {
    this.scroll = scroll;
  }

  render()  {
    let {
      // 抽屉是否可见
      visible,
      // 数据
      model: {
        safetyOfficer: {
          legalNum = 0,
          safeChargerNum = 0,
          safeManagerNum = 0,
          saferNum = 0,
          legalList = [],
          safeChargerList = [],
          safeManagerList = [],
          saferList = [],
        },
      },
      // 抽屉关闭事件
      onClose,
    } = this.props;
    legalList = legalList || [];
    safeChargerList = safeChargerList || [];
    safeManagerList = safeManagerList || [];
    saferList = saferList || [];
    return (
      <SectionDrawer
        drawerProps={{
          title: '安全人员',
          visible,
          onClose: () => {onClose('safetyOfficer');},
        }}
        sectionProps={{
          refScroll: this.refScroll,
          contentStyle: { paddingBottom: 16 },
          scrollProps: { className: styles.scrollContainer },
          fixedContent: (
            <Row className={styles.personWrapper}>
              <Col span={12} className={styles.person}>
                <div className={styles.personName}>单位法人</div>
                <div className={styles.personValue}>{legalNum}</div>
              </Col>

              <Col span={12} className={styles.person}>
                <div className={styles.personName}>安全负责人</div>
                <div className={styles.personValue}>{safeChargerNum}</div>
              </Col>

              <Col span={12} className={styles.person}>
                <div className={styles.personName}>安全管理员</div>
                <div className={styles.personValue}>{safeManagerNum}</div>
              </Col>

              <Col span={12} className={styles.person}>
                <div className={styles.personName}>安全员</div>
                <div className={styles.personValue}>{saferNum}</div>
              </Col>
            </Row>
          ),
        }}
      >
        <div className={styles.container}>
          {legalList.length !== 0 && (
              <div className={styles.personList} style={{ borderColor: '#FF4848' }}>
                <div className={styles.personLabel}>单位法人</div>
                {legalList.map(({ user_id: id, user_name: name, mobile: phone }) => (
                  <div className={styles.personItem} key={id}>
                    <div className={styles.personItemName}>{name}</div>
                    <div className={styles.personItemPhone}>{phone}</div>
                  </div>
                ))}
              </div>
            )}
          {safeChargerList.length !== 0 && (
            <div className={styles.personList} style={{ borderColor: '#C6C181' }}>
              <div className={styles.personLabel}>安全负责人</div>
              {safeChargerList.map(({ user_id: id, user_name: name, mobile: phone }) => (
                <div className={styles.personItem} key={id}>
                  <div className={styles.personItemName}>{name}</div>
                  <div className={styles.personItemPhone}>{phone}</div>
                </div>
              ))}
            </div>
          )}
          {safeManagerList.length !== 0 && (
            <div className={styles.personList} style={{ borderColor: '#00A8FF' }}>
              <div className={styles.personLabel}>安全管理员</div>
              {safeManagerList.map(({ user_id: id, user_name: name, mobile: phone }) => (
                <div className={styles.personItem} key={id}>
                  <div className={styles.personItemName}>{name}</div>
                  <div className={styles.personItemPhone}>{phone}</div>
                </div>
              ))}
            </div>
          )}
          {saferList.length !== 0 && (
            <div className={styles.personList} style={{ borderColor: '#0967D3' }}>
              <div className={styles.personLabel}>安全员</div>
              {saferList.map(({ user_id: id, user_name: name, mobile: phone }) => (
                <div className={styles.personItem} key={id}>
                  <div className={styles.personItemName}>{name}</div>
                  <div className={styles.personItemPhone}>{phone}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SectionDrawer>
    );
  }
}
