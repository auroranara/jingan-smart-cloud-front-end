import React, { PureComponent } from 'react';
import { Drawer } from 'antd';
import CompanyRisk from '../../Components/CompanyRisk';
import styles from '../../Government.less';

class DangerInfo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const {} = this.state;
    const {
      visible,
      handleParentChange,
      lastSection,
      hiddenDangerListByDate,
      riskDetailList,
    } = this.props;
    let dataList = { ycq: [], wcq: [], dfc: [] };
    if (lastSection === 'checks') dataList = hiddenDangerListByDate;
    else dataList = riskDetailList;
    return (
      <div>
        <Drawer
          width={500}
          closable={false}
          onClose={() => {
            handleParentChange({ dangerInfo: false });
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
                    隐患详情
                  </div>
                  <div
                    className={styles.backBtn}
                    onClick={() => {
                      handleParentChange({ dangerInfo: false });
                    }}
                  />
                  <div className={styles.sectionMain}>
                    <div className={styles.sectionContent}>
                      <div className={styles.scrollContainer} id="hiddenDanger">
                        <CompanyRisk hiddenDangerListByDate={dataList} />
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

export default DangerInfo;
