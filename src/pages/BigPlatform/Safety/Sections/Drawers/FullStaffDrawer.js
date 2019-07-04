import React, { PureComponent } from 'react';
import { Drawer, Row, Col } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import styles from '../../Government.less';

const borderColorList = ['#FF4848', '#C6C181', '#00A8FF', '#0967D3'];

class FullStaffDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const {
      visible,
      handleParentChange,
      govSafetyOfficer: { keyList = [], valueList = [] } = {},
      phoneVisible,
    } = this.props;
    return (
      <div>
        <Drawer
          width={500}
          closable={false}
          onClose={() => {
            handleParentChange({ fullStaffDrawer: false });
          }}
          visible={visible}
          style={{ padding: 0 }}
          maskStyle={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
          className={styles.drawer}
        >
          <div className={styles.main} style={{ padding: 0 }}>
            <div
              className={styles.mainBody}
              style={{ margin: 0, height: '100%', overflow: 'hidden' }}
            >
              <section className={styles.sectionWrapper}>
                <div className={styles.sectionWrapperIn}>
                  <div className={styles.sectionTitle}>
                    <span className={styles.titleBlock} />
                    监管人员
                  </div>
                  <div
                    className={styles.backBtn}
                    onClick={() => {
                      handleParentChange({ fullStaffDrawer: false });
                    }}
                  />

                  <div className={styles.sectionContentMain}>
                    <Row className={styles.personWrapper}>
                      {keyList &&
                        keyList.map((key, index) => (
                          <Col span={12} className={styles.person} key={key}>
                            <div className={styles.personName}>{key}</div>
                            <div className={styles.personValue}>{valueList[index].length}</div>
                          </Col>
                        ))}
                    </Row>
                    {valueList.length > 0 ? (
                      valueList.map((value, index) => (
                        <div
                          className={styles.personList}
                          style={{ borderColor: borderColorList[index % 4] }}
                          key={keyList[index]}
                        >
                          <div className={styles.personLabel}>{keyList[index]}</div>
                          {value.map(({ id, user_name: name, phone_number: phone, gridName }) => (
                            <div className={styles.personItem} key={id}>
                              <div className={styles.personItemName}>
                                <Ellipsis tooltip length={6} style={{ overflow: 'visible' }}>
                                  {name}
                                </Ellipsis>
                              </div>

                              <div className={styles.personItemPhone}>
                                {phoneVisible || !phone
                                  ? phone
                                  : `${phone}`.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}
                              </div>
                              <div className={styles.gridName}>
                                <Ellipsis tooltip length={8} style={{ overflow: 'visible' }}>
                                  {gridName}
                                </Ellipsis>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))
                    ) : (
                      <div style={{ textAlign: 'center' }}>暂无数据</div>
                    )}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default FullStaffDrawer;
