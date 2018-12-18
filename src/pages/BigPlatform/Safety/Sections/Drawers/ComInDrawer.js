import React, { PureComponent } from 'react';
import { Drawer } from 'antd';
import styles from '../../Government.less';

class ComInDrawer extends PureComponent {
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
      searchAllCompany: { dataUnimportantCompany = [], dataImportant = [] },
    } = this.props;

    return (
      <div>
        <Drawer
          width={500}
          closable={false}
          onClose={() => {
            handleParentChange({ comInDrawer: false });
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
                    单位统计
                  </div>
                  <div
                    className={styles.backBtn}
                    onClick={() => {
                      handleParentChange({ comInDrawer: false });
                    }}
                  />
                  <div className={styles.sectionMain}>
                    <div className={styles.sectionContent} style={{ height: '50%' }}>
                      <div className={styles.tableTitleWrapper}>
                        <span className={styles.tableTitle}>
                          {' '}
                          重点单位（
                          {dataImportant.length}）
                        </span>
                      </div>
                      <div className={styles.scrollContainer}>
                        {dataImportant.map((item, index) => {
                          return (
                            <div
                              className={styles.scrollCol1}
                              key={item.id}
                              onClick={() => {
                                goCompany(item.id);
                              }}
                            >
                              <span className={styles.scrollOrder}>{index + 1}</span>
                              {item.name}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className={styles.sectionContent} style={{ height: '50%' }}>
                      <div className={styles.tableTitleWrapper}>
                        <span className={styles.tableTitle}>
                          {' '}
                          非重点单位（
                          {dataUnimportantCompany.length}）
                        </span>
                      </div>
                      <div className={styles.scrollContainer}>
                        {dataUnimportantCompany.map((item, index) => {
                          return (
                            <div
                              className={styles.scrollCol1}
                              key={item.id}
                              onClick={() => {
                                goCompany(item.id);
                              }}
                            >
                              <span className={styles.scrollOrder}>{index + 1}</span>
                              {item.name}
                            </div>
                          );
                        })}
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

export default ComInDrawer;
