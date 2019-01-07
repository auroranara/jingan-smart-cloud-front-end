import React, { PureComponent } from 'react';
import { Drawer } from 'antd';
import styles from '../../Government.less';

class DangerCompanyDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillUnmount() {}

  handleClick = id => {
    const {
      dispatch,
      lastSection,
      month,
      checkUserId,
      gridId,
      handleParentChange,
      data: { status },
    } = this.props;
    const param = lastSection === 'checks' ? { date: month } : {};
    if (lastSection === 'checks') {
      dispatch({
        type: 'bigPlatform/fetchHiddenDangerListByDate',
        payload: {
          company_id: id,
          reportUserId: checkUserId,
          ...param,
          gridId,
          status,
        },
      });
    } else {
      dispatch({
        type: 'bigPlatform/fetchRiskDetail',
        payload: {
          company_id: id,
          gridId,
          status,
        },
      });
    }
    handleParentChange({ dangerInfo: true });
    if (document.querySelector('#hiddenDanger')) {
      document.querySelector('#hiddenDanger').scrollTop = 0;
    }
  };

  render() {
    const {
      visible,
      handleParentChange,
      data: { dangerCompany = [], dangerCount = 0 },
      goCompany,
      dangerCoTitle,
    } = this.props;
    return (
      <div>
        <Drawer
          width={500}
          closable={false}
          onClose={() => {
            handleParentChange({ dangerCoDrawer: false });
          }}
          visible={visible}
          style={{ padding: 0 }}
          className={styles.drawer}
          maskStyle={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
          zIndex={1222}
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
                    {dangerCoTitle}
                  </div>
                  <div
                    className={styles.backBtn}
                    onClick={() => {
                      handleParentChange({ dangerCoDrawer: false });
                    }}
                  />
                  <div className={styles.sectionMain}>
                    <div className={styles.sectionContent}>
                      <div className={styles.summaryWrapper}>
                        <div className={styles.summaryItem}>
                          <span className={styles.summaryIconCom} />
                          单位数量
                          <span className={styles.summaryNum}>{dangerCompany.length || 0}</span>
                        </div>
                        <div className={styles.summaryItem}>
                          <span className={styles.summaryIconHd} />
                          隐患数量
                          <span className={styles.summaryNum}>{dangerCount || 0}</span>
                        </div>
                      </div>

                      <div className={styles.scrollContainer}>
                        {dangerCompany.length > 0 ? (
                          <table className={styles.scrollTable}>
                            <thead>
                              <tr>
                                <th style={{ width: '40px' }} />
                                <th style={{ width: '74%' }}>单位</th>
                                <th>隐患数</th>
                              </tr>
                            </thead>
                            <tbody>
                              {dangerCompany.map(item => {
                                return (
                                  <tr key={item.id}>
                                    <td>
                                      {(+item.company_type === 1 || +item.company_type === 4) && (
                                        <span className={styles.keyComMark} />
                                      )}
                                    </td>
                                    <td>
                                      <span
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => {
                                          goCompany(item.id);
                                        }}
                                      >
                                        {item.name}
                                      </span>
                                    </td>
                                    <td>
                                      <span
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => {
                                          this.handleClick(item.id);
                                        }}
                                      >
                                        {item.total_danger}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        ) : (
                          <div
                            style={{
                              textAlign: 'center',
                              lineHeight: '100px',
                              position: 'absolute',
                              width: '100%',
                            }}
                          >
                            暂无数据
                          </div>
                        )}
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

export default DangerCompanyDrawer;
