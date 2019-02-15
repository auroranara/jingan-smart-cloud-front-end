import React, { PureComponent } from 'react';
import classNames from 'classnames';
import rotate from '../Animate.less';
import styles from '../Government.less';

class HdOverCompany extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const {
      visible,
      dispatch,
      goBack,
      goCompany,
      listData,
      overRectifyNum,
      goComponent,
      gridId,
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
            已超期隐患单位
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
                      <th style={{ width: '38px' }} />
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
                          <td style={{ textAlign: 'left', paddingLeft: '10px' }}>{index + 1}</td>
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
                                goComponent('hdOverDetail');
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
    );
  }
}

export default HdOverCompany;
