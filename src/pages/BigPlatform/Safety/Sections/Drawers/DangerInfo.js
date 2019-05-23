import React, { PureComponent } from 'react';
import { Drawer, Spin } from 'antd';
import CompanyRisk from '../../Components/CompanyRisk';
import LoadMoreButton from '../../Company3/components/LoadMoreButton';
import styles from '../../Government.less';

class DangerInfo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillUnmount() {}

  handleLoadMore = pageNum => {
    const { handleLoadHiddenList } = this.props;
    handleLoadHiddenList(pageNum + 1);
  };

  render() {
    const {
      visible,
      handleParentChange,
      lastSection,
      hiddenDangerListByDate,
      riskDetailList,
      loading,
    } = this.props;
    let dataList = {
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
      list: [],
    };
    if (lastSection === 'checks') dataList = hiddenDangerListByDate;
    else dataList = riskDetailList;
    const {
      pagination: { total, pageNum, pageSize },
      list,
    } = dataList;
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
          className={styles.drawer}
          maskStyle={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
          zIndex={1666}
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
                        <Spin spinning={loading} wrapperClassName={styles.spin}>
                          <CompanyRisk hiddenDangerListByDate={list} />
                          {pageNum * pageSize < total && (
                            <div className={styles.loadMoreWrapper}>
                              <LoadMoreButton
                                onClick={() => {
                                  this.handleLoadMore(pageNum);
                                }}
                              />
                            </div>
                          )}
                        </Spin>
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
