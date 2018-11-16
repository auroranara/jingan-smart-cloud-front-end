import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import classNames from 'classnames';
import rotate from '../Animate.less';
import styles from '../Government.less';
import iconNormal from '../img/icon-normal.png';

const iconNormalStyles = {
  display: 'inline-block',
  position: 'relative',
  marginRight: '8px',
  height: '40px',
  width: '40px',
  background: `url(${iconNormal}) no-repeat center center`,
  backgroundSize: '100% 100%',
};
class RiskColors extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    // const {} = this.state;
    const {
      visible,
      goBack,
      goCompany,
      riskColorSummary: { riskColorTitle, company, risk, abnormal, componentSubType },
      listData,
    } = this.props;
    const stylesVisible = classNames(styles.sectionWrapper, rotate.flip, {
      [rotate.in]: visible,
      [rotate.out]: !visible,
    });
    const normalRisk = componentSubType !== 'pie' || riskColorTitle === '异常风险点';
    let riskTotal = 0;
    listData.forEach(item => {
      riskTotal += item.fxd;
    });
    return (
      <section
        className={stylesVisible}
        style={{ position: 'absolute', top: 0, left: '6px', width: 'calc(100% - 12px)' }}
      >
        <div className={styles.sectionWrapperIn}>
          <div className={styles.sectionTitle}>
            <span className={styles.titleBlock} />
            {riskColorTitle}
          </div>
          <div
            className={styles.backBtn}
            onClick={() => {
              goBack();
            }}
          />
          <div className={styles.sectionMain}>
            <div className={styles.sectionContent}>
              <Row style={{ borderBottom: '2px solid #0967d3', padding: '6px 0' }}>
                <Col span={8}>
                  <div className={styles.riskContent}>
                    <span className={styles.iconCom} />
                    <div className={styles.riskWrapper}>
                      单位数量
                      <div className={styles.riskNum}>{company}</div>
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div className={styles.riskContent}>
                    <span className={styles.iconRisk} />
                    <div className={styles.riskWrapper}>
                      风险点
                      <div className={styles.riskNum}>{riskTotal}</div>
                    </div>
                  </div>
                </Col>
                {normalRisk && (
                  <Col span={8}>
                    <div className={styles.riskContent}>
                      <span className={styles.iconDanger} />
                      <div className={styles.riskWrapper}>
                        异常
                        <div className={styles.riskNum}>{abnormal}</div>
                      </div>
                    </div>
                  </Col>
                )}
                {riskColorTitle === '正常风险点' && (
                  <Col span={8}>
                    <div className={styles.riskContent}>
                      <span style={{ ...iconNormalStyles }} />
                      <div className={styles.riskWrapper}>
                        正常
                        <div className={styles.riskNum}>{abnormal}</div>
                      </div>
                    </div>
                  </Col>
                )}
              </Row>
              <div className={styles.scrollContainer} style={{ borderTop: 'none' }}>
                <table className={styles.scrollTable}>
                  <thead>
                    <tr>
                      <th style={{ width: '70%' }}>单位</th>
                      <th style={{ width: '18%' }}>风险点</th>
                      <th
                        style={{
                          color: normalRisk ? 'rgba(232, 103, 103, 0.8)' : '#00baff',
                        }}
                      >
                        {normalRisk ? '异常' : '正常'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {listData.map((item, index) => {
                      return (
                        <tr key={item.company_id}>
                          <td>
                            <span
                              style={{ cursor: 'pointer' }}
                              onClick={() => {
                                goCompany(item.company_id);
                              }}
                            >
                              {item.company_name}
                            </span>
                          </td>
                          <td>{item.fxd}</td>
                          <td
                            style={{
                              color:
                                item.ycd && normalRisk
                                  ? 'rgba(232, 103, 103, 0.8)'
                                  : 'rgba(255, 255, 255, 0.7)',
                            }}
                          >
                            {item.ycd}
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
    );
  }
}

export default RiskColors;
