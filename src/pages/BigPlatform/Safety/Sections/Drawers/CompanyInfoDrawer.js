import React, { PureComponent } from 'react';
import { Drawer, Row, Col, Icon } from 'antd';
import styles from '../../Government.less';
import importantIcon from '../../img/importantCompany.png';
import CompanyRisk from '../../Components/CompanyRisk';

class CompanyInfoDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      riskDetailFull: false,
    };
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const { riskDetailFull } = this.state;
    const {
      visible,
      handleParentChange,
      goCompany,
      dispatch,
      companyMessage: {
        companyMessage: {
          // 企业名称
          companyName,
          // 安全负责人
          headOfSecurity,
          // 联系电话
          headOfSecurityPhone,
          // 风险点总数
          countCheckItem,
        },
        isImportant,
        total: hiddenDangerOver,
      },
      specialEquipment,
      hiddenDangerListByDate,
      hiddenDangerListByDate: { ycq = [], wcq = [], dfc = [] },
      companyId,
    } = this.props;
    const companyInfoStyles = riskDetailFull ? { opacity: 0 } : {};
    const riskDetailStyles = riskDetailFull ? { position: 'absolute' } : {};

    return (
      <div>
        <Drawer
          width={500}
          closable={false}
          onClose={() => {
            handleParentChange({ companyInfoDrawer: false });
          }}
          visible={visible}
          style={{ padding: 0 }}
          maskStyle={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
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
                    单位概况
                  </div>
                  <div
                    className={styles.backBtn}
                    onClick={() => {
                      handleParentChange({ companyInfoDrawer: false });
                    }}
                  />
                  <div className={styles.sectionMain}>
                    <div className={styles.sectionContent}>
                      <div
                        style={{ display: 'flex', flexDirection: 'column', ...companyInfoStyles }}
                      >
                        <div className={styles.companyMain}>
                          <div className={styles.companyIcon} />
                          <div className={styles.companyInfo}>
                            <div
                              className={styles.companyName}
                              style={{ cursor: 'pointer' }}
                              onClick={() => {
                                goCompany(companyId);
                              }}
                            >
                              {companyName}
                            </div>
                            <div className={styles.companyCharger}>
                              <span className={styles.fieldName}>安全负责人：</span>
                              {headOfSecurity}
                            </div>
                            <div className={styles.companyPhone}>
                              <span className={styles.fieldName}>联系方式：</span>
                              {headOfSecurityPhone}
                            </div>
                            {isImportant && (
                              <div className={styles.importantUnit}>
                                <img src={importantIcon} alt="重点单位" />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className={styles.summaryBottom} style={{ borderBottom: 0 }}>
                          <Row gutter={6}>
                            <Col span={12} className={styles.summaryHalf}>
                              <div className={styles.summaryRisk} />
                              <div className={styles.summaryText}>
                                <span className={styles.fieldName}>风险点</span>
                              </div>
                              <div className={styles.summaryNum}>{countCheckItem}</div>
                            </Col>

                            <Col span={12} className={styles.summaryHalf}>
                              <div className={styles.summarySpecial} />
                              <div className={styles.summaryText}>
                                <span className={styles.fieldName}>特种设备</span>
                              </div>
                              <div className={styles.summaryNum}>{specialEquipment}</div>
                            </Col>

                            <Col span={12} className={styles.summaryHalf}>
                              <div className={styles.summaryOver} />
                              <div className={styles.summaryText}>
                                <span className={styles.fieldName}>已超期隐患</span>
                              </div>
                              <div className={styles.summaryNum}>{hiddenDangerOver}</div>
                            </Col>
                          </Row>
                        </div>
                      </div>

                      <div className={styles.riskDetailWrapper} style={{ ...riskDetailStyles }}>
                        <div
                          className={styles.riskDetailBtns}
                          onClick={() => {
                            this.setState({ riskDetailFull: !riskDetailFull });
                          }}
                        >
                          {riskDetailFull ? (
                            <Icon type="down" theme="outlined" />
                          ) : (
                            <Icon type="up" theme="outlined" />
                          )}
                        </div>
                        <div
                          className={styles.tableTitleWrapper}
                          style={{ borderBottom: 'none', borderTop: '1px solid #0967d3' }}
                        >
                          <span className={styles.tableTitle}>
                            风险点隐患（
                            {ycq.length + wcq.length + dfc.length}）
                          </span>
                        </div>

                        <div className={styles.scrollContainer} id="companyRisk">
                          <CompanyRisk hiddenDangerListByDate={hiddenDangerListByDate} />
                        </div>
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

export default CompanyInfoDrawer;
