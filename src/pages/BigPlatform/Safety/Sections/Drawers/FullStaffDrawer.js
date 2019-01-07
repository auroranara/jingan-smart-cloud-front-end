import React, { PureComponent } from 'react';
import { Drawer } from 'antd';
import styles from '../../Government.less';

class FullStaffDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const { visible, handleParentChange, fulltimeWorker, listData = [] } = this.props;

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
                  <div className={styles.sectionMain}>
                    <div className={styles.sectionContent}>
                      <div className={styles.tableTitleWrapper}>
                        <span className={styles.tableTitle}>
                          {' '}
                          监管人员（
                          {fulltimeWorker}）
                        </span>
                      </div>
                      <div className={styles.scrollContainer}>
                        <table className={styles.scrollTable}>
                          <thead>
                            <tr>
                              <th />
                              <th style={{ width: '26%' }}>姓名</th>
                              <th style={{ width: '35%' }}>电话</th>
                              <th>管辖社区</th>
                            </tr>
                          </thead>
                          <tbody>
                            {listData.map((item, index) => {
                              return (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{item.user_name}</td>
                                  <td>{item.phone_number}</td>
                                  <td>{item.gridName ? item.gridName.split(',').join('/') : ''}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
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
