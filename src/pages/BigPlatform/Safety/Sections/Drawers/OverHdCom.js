import React, { PureComponent } from 'react';
import { Drawer } from 'antd';
import styles from '../../Government.less';

class OverHdCom extends PureComponent {
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
      goCompany,
      dispatch,
      gridId,
      overRectifyNum,
      listData = [],
    } = this.props;

    return (
      <div>
        <Drawer
          width={500}
          closable={false}
          onClose={() => {
            handleParentChange({ overHdCom: false });
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
                    已超期隐患单位
                  </div>
                  <div
                    className={styles.backBtn}
                    onClick={() => {
                      handleParentChange({ overHdCom: false });
                    }}
                  />
                  <div className={styles.sectionMain}>
                    <div className={styles.sectionContent}>
                      <div className={styles.scrollContainer} style={{ borderTop: 'none' }}>
                        <table className={styles.scrollTable}>
                          <thead>
                            <tr>
                              <th style={{ width: '40px' }} />
                              <th style={{ width: '74%' }}>
                                隐患单位（
                                {listData.length}）
                              </th>
                              <th>
                                隐患数（
                                {overRectifyNum}）
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {listData.map((item, index) => {
                              return (
                                <tr key={item.companyId}>
                                  <td>
                                    {(+item.companyType === 1 || +item.companyType === 4) && (
                                      <span className={styles.keyComMark} />
                                    )}
                                  </td>
                                  <td>
                                    <span
                                      style={{ cursor: 'pointer' }}
                                      onClick={() => {
                                        goCompany(item.companyId);
                                      }}
                                    >
                                      {item.companyName}
                                    </span>
                                  </td>
                                  <td>
                                    <span
                                      style={{ cursor: 'pointer' }}
                                      onClick={() => {
                                        dispatch({
                                          type: 'bigPlatform/fetchRiskDetail',
                                          payload: {
                                            company_id: item.companyId,
                                            status: '7',
                                            gridId,
                                          },
                                        });
                                        // goComponent('hdOverDetail');
                                        handleParentChange({
                                          dangerInfo: true,
                                          dangerCompanyLast: '',
                                        });
                                        if (document.querySelector('#overRisk')) {
                                          document.querySelector('#overRisk').scrollTop = 0;
                                        }
                                      }}
                                    >
                                      {item.hiddenDangerCount}
                                    </span>
                                  </td>
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

export default OverHdCom;
