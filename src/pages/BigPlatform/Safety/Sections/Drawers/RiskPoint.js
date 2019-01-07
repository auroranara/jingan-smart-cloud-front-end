import React, { PureComponent } from 'react';
import { Row, Col, Tooltip, Drawer } from 'antd';
import styles from '../../Government.less';
import iconOverTime from '../../img/icon-overTime.png';

class RiskPoint extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const {
      visible,
      data: { total, abnormal, overTime, list },
      handleParentChange,
      dispatch,
    } = this.props;

    return (
      <div>
        <Drawer
          width={500}
          closable={false}
          onClose={() => {
            handleParentChange({ riskPoint: false });
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
                    风险点
                  </div>
                  <div
                    className={styles.backBtn}
                    onClick={() => {
                      handleParentChange({ riskPoint: false });
                    }}
                  />

                  <div className={styles.sectionMain}>
                    <div className={styles.sectionContent}>
                      <Row style={{ borderBottom: '2px solid #0967d3', padding: '6px 0' }}>
                        <Col span={8}>
                          <div className={styles.riskContent}>
                            <span className={styles.iconRisk} />
                            <div className={styles.riskWrapper}>
                              风险点
                              <div className={styles.riskNum}>{total}</div>
                            </div>
                          </div>
                        </Col>
                        <Col span={8}>
                          <div className={styles.riskContent}>
                            <span className={styles.iconDanger} />
                            <div className={styles.riskWrapper}>
                              异常
                              <div className={styles.riskNum}>{abnormal}</div>
                            </div>
                          </div>
                        </Col>
                        <Col span={8}>
                          <div className={styles.riskContent}>
                            <span
                              className={styles.iconCom}
                              style={{
                                background: `url(${iconOverTime}) no-repeat center center`,
                                backgroundSize: '100% 100%',
                              }}
                            />
                            <div className={styles.riskWrapper}>
                              超时
                              <div className={styles.riskNum}>{overTime}</div>
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <div className={styles.scrollContainer} style={{ borderTop: 'none' }}>
                        <table className={styles.scrollTable}>
                          <thead>
                            <tr>
                              <th style={{ width: '230px' }}>单位</th>
                              <th>风险点总数</th>
                              <th
                                style={{
                                  color: 'rgba(232, 103, 103, 0.8)',
                                }}
                              >
                                异常
                              </th>
                              <th
                                style={{
                                  color: 'rgba(232, 103, 103, 0.8)',
                                }}
                              >
                                超时
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {list.map((item, index) => {
                              return (
                                <tr key={item.company_id}>
                                  <td>
                                    <Tooltip placement="top" title={item.company_name}>
                                      <span
                                        style={{
                                          cursor: 'pointer',
                                          width: '210px',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          whiteSpace: 'nowrap',
                                          display: 'inline-block',
                                        }}
                                        onClick={() => {
                                          handleParentChange({
                                            riskPointCompany: true,
                                            riskComName: item.company_name,
                                          });
                                          // dispatch({
                                          //   type: 'bigPlatform/fetchSelfCheckPointDataByCompanyId',
                                          //   payload: {
                                          //     // company_id: 'Fj_1XoafSjKGo3WJDhHsDw',
                                          //     companyId: item.company_id,
                                          //   },
                                          // });
                                          dispatch({
                                            type: 'bigPlatform/fetchSelfCheckPointData',
                                            payload: {
                                              companyId: item.company_id,
                                              item_type: '2',
                                            },
                                            success: () => {},
                                          });
                                        }}
                                      >
                                        {item.company_name}
                                      </span>
                                    </Tooltip>
                                  </td>
                                  <td>{item.total}</td>
                                  <td
                                    style={{
                                      color: item.abnormal
                                        ? 'rgba(232, 103, 103, 0.8)'
                                        : 'rgba(255, 255, 255, 0.7)',
                                    }}
                                  >
                                    {item.abnormal}
                                  </td>
                                  <td
                                    style={{
                                      color: item.overTime
                                        ? 'rgba(232, 103, 103, 0.8)'
                                        : 'rgba(255, 255, 255, 0.7)',
                                    }}
                                  >
                                    {item.overTime}
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

export default RiskPoint;
