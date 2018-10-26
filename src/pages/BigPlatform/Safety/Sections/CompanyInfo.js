import React, { PureComponent } from 'react';
import { Row, Col, Icon } from 'antd';
import classNames from 'classnames';
import rotate from '../Animate.less';
import styles from '../Government.less';
import CompanyRisk from '../Components/CompanyRisk';
import importantIcon from '../img/importantCompany.png';

class CompanyInfo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      riskDetailFull: false,
    };
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const {
      visible,
      goBack,
      goCompany,
      companyId,
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
    } = this.props;
    const stylesVisible = classNames(styles.sectionWrapper, rotate.flip, {
      [rotate.in]: visible,
      [rotate.out]: !visible,
    });
    const { riskDetailFull } = this.state;

    const companyInfoStyles = riskDetailFull ? { opacity: 0 } : {};
    const riskDetailStyles = riskDetailFull ? { position: 'absolute' } : {};
    return (
      <section
        className={stylesVisible}
        style={{ position: 'absolute', top: 0, left: '6px', width: 'calc(100% - 12px)' }}
      >
        <div className={styles.sectionWrapperIn}>
          <div className={styles.sectionTitle}>
            <span className={styles.titleBlock} />
            单位概况
          </div>
          <div
            className={styles.backBtn}
            onClick={() => {
              goBack();
            }}
          />
          <div className={styles.sectionMain}>
            <div className={styles.sectionContent}>
              <div style={{ display: 'flex', flexDirection: 'column', ...companyInfoStyles }}>
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
    );
  }
}

export default CompanyInfo;
