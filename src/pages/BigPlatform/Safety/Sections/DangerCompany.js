import React, { PureComponent } from 'react';
import classNames from 'classnames';
import rotate from '../Animate.less';
import styles from '../Government.less';

class DangerCompany extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillUnmount() {}

  handleClick = id => {
    const { dispatch, lastSection, month, checkUserId } = this.props;
    const param = lastSection === 'checks' ? { date: month } : {};
    console.log(lastSection);
    if (lastSection === 'checks') {
      dispatch({
        type: 'bigPlatform/fetchHiddenDangerListByDate',
        payload: {
          company_id: id,
          reportUserId: checkUserId,
          ...param,
        },
      });
    } else {
      dispatch({
        type: 'bigPlatform/fetchRiskDetail',
        payload: {
          company_id: id,
        },
      });
    }
    this.props.goComponent('hiddenDanger');
    if (document.querySelector('#hiddenDanger')) {
      document.querySelector('#hiddenDanger').scrollTop = 0;
    }
  };

  render() {
    const {
      visible,
      data: { dangerCompanyNum = 0, dangerCompany = [], dangerCount = 0 },
      goBack,
      lastSection,
      goCompany,
    } = this.props;
    const stylesVisible = classNames(styles.sectionWrapper, rotate.flip, {
      [rotate.in]: visible,
      [rotate.out]: !visible,
    });
    return (
      <section
        className={stylesVisible}
        style={{ position: 'absolute', top: 0, left: '6px', width: 'calc(100% - 12px)' }}
      >
        <div className={styles.sectionWrapperIn}>
          <div className={styles.sectionTitle}>
            <span className={styles.titleBlock} />
            隐患单位统计
          </div>
          <div
            className={styles.backBtn}
            onClick={() => {
              goBack(lastSection);
            }}
          />
          <div className={styles.sectionMain}>
            <div className={styles.sectionContent}>
              <div className={styles.summaryWrapper}>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryIconCom} />
                  单位数量
                  <span className={styles.summaryNum}>{dangerCompanyNum || 0}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryIconHd} />
                  隐患数量
                  <span className={styles.summaryNum}>{dangerCount || 0}</span>
                </div>
              </div>

              <div className={styles.scrollContainer}>
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
                            {item.company_type === '1' && <span className={styles.keyComMark} />}
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
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default DangerCompany;
