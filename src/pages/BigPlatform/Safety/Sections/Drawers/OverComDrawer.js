import React, { PureComponent } from 'react';
import { Drawer } from 'antd';
import moment from 'moment';
import styles from '../../Government.less';

const checkCycleList = {
  every_day: '每日一次',
  every_week: '每周一次',
  every_month: '每月一次',
  every_quarter: '每季度一次',
  every_half_year: '每半年一次',
  every_year: '每年一次',
};
class OverComDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const { visible, listData = [], handleParentChange, goCompany } = this.props;

    return (
      <div>
        <Drawer
          width={500}
          closable={false}
          onClose={() => {
            handleParentChange({ overComDrawer: false });
          }}
          visible={visible}
          style={{ padding: 0 }}
          maskStyle={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
          zIndex={1333}
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
                    已超时单位（
                    {listData.length}）
                  </div>
                  <div
                    className={styles.backBtn}
                    onClick={() => {
                      handleParentChange({ overComDrawer: false });
                    }}
                  />
                  <div className={styles.sectionMain}>
                    <div className={styles.sectionContent}>
                      <div className={styles.scrollContainer}>
                        <table className={styles.scrollTable}>
                          <thead>
                            <tr>
                              <th style={{ width: '40px' }} />
                              <th style={{ width: '48%' }}>单位名称</th>
                              <th>检查周期</th>
                              <th>上次检查</th>
                            </tr>
                          </thead>
                          <tbody>
                            {listData.map((item, index) => {
                              const {
                                companyType,
                                companyId,
                                companyName,
                                checkCycleCode,
                                lastCheckDate,
                              } = item;
                              return (
                                checkCycleCode && (
                                  <tr key={index}>
                                    <td>
                                      {(+companyType === 1 || +companyType === 4) && (
                                        <span className={styles.keyComMark} />
                                      )}
                                    </td>
                                    <td>
                                      <span
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => {
                                          goCompany(companyId);
                                        }}
                                      >
                                        {companyName}
                                      </span>
                                    </td>
                                    <td>{checkCycleCode ? checkCycleList[checkCycleCode] : ''}</td>
                                    <td>
                                      {lastCheckDate
                                        ? moment(lastCheckDate).format('YYYY-MM-DD')
                                        : '- -'}
                                    </td>
                                  </tr>
                                )
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

export default OverComDrawer;
