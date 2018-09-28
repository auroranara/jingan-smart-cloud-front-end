import React, { PureComponent } from 'react';
import classNames from 'classnames';
import rotate from '../Animate.less';
import styles from '../Government.less';

class RiskDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const { visible, goBack, listData, goCompany, riskOverNum } = this.props;
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
            单位超时未查
          </div>
          <div
            className={styles.backBtn}
            onClick={() => {
              goBack();
            }}
          />
          <div className={styles.sectionMain}>
            <div className={styles.sectionContent}>
              <div className={styles.scrollContainer} style={{ borderTop: 'none' }}>
                <table className={styles.scrollTable}>
                  <thead>
                    <tr>
                      <th style={{ width: '45%' }}>
                        超时单位（
                        {listData.length}）
                      </th>
                      <th style={{ width: '35%' }}>所属网格</th>
                      <th>
                        超时风险点（
                        {riskOverNum}）
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {listData.map(item => {
                      const { company_id, company_name, grid_name, total } = item;
                      return (
                        <tr key={company_id}>
                          <td>
                            <span
                              style={{ cursor: 'pointer' }}
                              onClick={() => {
                                goCompany(company_id);
                              }}
                            >
                              {company_name}
                            </span>
                          </td>
                          <td>{grid_name}</td>
                          <td>{total}</td>
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

export default RiskDetail;
