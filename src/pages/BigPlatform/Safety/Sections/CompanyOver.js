import React, { PureComponent } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import rotate from '../Animate.less';
import styles from '../Government.less';

const checkCycleList = {
  every_day: '每日一次',
  every_week: '每周一次',
  every_month: '每月一次',
  every_quarter: '每季度一次',
  every_half_year: '每半年一次',
  every_year: '每年一次',
};
class CompanyOver extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const { visible, listData = [], goBackToChecks, goCompany } = this.props;
    const stylesCompanyOver = classNames(styles.sectionWrapper, rotate.flip, {
      [rotate.in]: visible,
      [rotate.out]: !visible,
    });
    return (
      <section
        className={stylesCompanyOver}
        style={{ position: 'absolute', top: 0, left: '6px', width: 'calc(100% - 12px)' }}
      >
        <div className={styles.sectionWrapperIn}>
          <div className={styles.sectionTitle}>
            <span className={styles.titleBlock} />
            已超时单位（
            {listData.length}）
          </div>
          <div
            className={styles.backBtn}
            onClick={() => {
              goBackToChecks();
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
                        <tr key={index}>
                          <td>{companyType === '1' && <span className={styles.keyComMark} />}</td>
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
                            {lastCheckDate ? moment(lastCheckDate).format('YYYY-MM-DD') : '- -'}
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

export default CompanyOver;
