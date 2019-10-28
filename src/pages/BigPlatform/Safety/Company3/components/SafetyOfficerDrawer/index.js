import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import SectionDrawer from '../SectionDrawer';
// 引入样式文件
import styles from './index.less';

const borderColorList = ['#FF4848', '#C6C181', '#00A8FF', '#0967D3'];

/**
 * 安全人员抽屉
 */
@connect(({ unitSafety }) => ({
  unitSafety,
}))
export default class SafetyOfficerDrawer extends PureComponent {
  componentDidUpdate({ visible: prevVisible }) {
    const { visible } = this.props;
    if (!prevVisible && visible) {
      this.scroll && this.scroll.scrollTop();
    }
  }

  refScroll = scroll => {
    this.scroll = scroll && scroll.dom || scroll;
  };

  render() {
    let {
      // 抽屉是否可见
      visible,
      // 数据
      unitSafety: { safetyOfficer: { keyList = [], valueList = [] } = {}, phoneVisible },
      // 抽屉关闭事件
      onClose,
    } = this.props;

    return (
      <SectionDrawer
        drawerProps={{
          title: '安全人员',
          visible,
          onClose,
        }}
        sectionProps={{
          refScroll: this.refScroll,
        }}
      >
        <Row className={styles.personWrapper}>
          {keyList &&
            keyList.map((key, index) => (
              <Col span={12} className={styles.person} key={key}>
                <div className={styles.personName}>{key}</div>
                <div className={styles.personValue}>{valueList[index].length}</div>
              </Col>
            ))}
        </Row>
        <div className={styles.container}>
          {valueList &&
            valueList.map((value, index) => (
              <div
                className={styles.personList}
                style={{ borderColor: borderColorList[index % 4] }}
                key={keyList[index]}
              >
                <div className={styles.personLabel}>{keyList[index]}</div>
                {value.map(({ id, user_name: name, phone_number: phone }) => (
                  <div className={styles.personItem} key={id}>
                    <div className={styles.personItemName}>{name}</div>
                    <div className={styles.personItemPhone}>
                      {phoneVisible || !phone
                        ? phone
                        : `${phone}`.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}
                    </div>
                  </div>
                ))}
              </div>
            ))}
        </div>
      </SectionDrawer>
    );
  }
}
