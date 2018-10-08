import React, { PureComponent } from 'react';
import { Tooltip } from 'antd';
import moment from 'moment';
import styles from '../Government.less';

class TopData extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const {
      goComponent,
      searchAllCompany: { dataUnimportantCompany = [], dataImportant = [] },
      fulltimeWorker = 0,
      overRectifyNum = 0,
      selectOvertimeItemNum = 0,
      checkedCompanyInfo,
      handleParentChange,
      fetchCheckMsgs,
    } = this.props;

    return (
      <section className={styles.sectionWrapper} style={{ height: 'auto' }}>
        <div className={styles.sectionWrapperIn}>
          <div className={styles.sectionMain} style={{ border: 'none' }}>
            <div className={styles.topData}>
              <div className={styles.topItem}>
                <Tooltip placement="bottom" title={'接入平台的单位总数'}>
                  <div
                    className={styles.itemActive}
                    onClick={() => {
                      goComponent('companyIn');
                    }}
                  >
                    <div className={styles.topName}>重点/所有单位</div>
                    <div className={styles.topNum} style={{ color: '#00baff' }}>
                      {dataImportant.length}/{dataImportant.length + dataUnimportantCompany.length}
                    </div>
                  </div>
                </Tooltip>
              </div>

              <div className={styles.topItem}>
                <Tooltip placement="bottom" title={'网格员、政府监管员'}>
                  <div
                    className={styles.itemActive}
                    onClick={() => {
                      goComponent('fullStaff');
                    }}
                  >
                    <div className={styles.topName}>专职人员</div>
                    <div className={styles.topNum} style={{ color: '#00baff' }}>
                      {fulltimeWorker}
                    </div>
                  </div>
                </Tooltip>
              </div>

              <div className={styles.topItem}>
                <Tooltip placement="bottom" title={'已超期隐患数量'}>
                  <div
                    className={styles.itemActive}
                    onClick={() => {
                      goComponent('overHd');
                    }}
                  >
                    <div className={styles.topName}>已超期隐患</div>
                    <div className={styles.topNum} style={{ color: '#e86767' }}>
                      {overRectifyNum}
                    </div>
                  </div>
                </Tooltip>
              </div>

              <div className={styles.topItem}>
                <Tooltip placement="bottom" title={'已超时风险点数量'}>
                  <div
                    className={styles.itemActive}
                    onClick={() => {
                      goComponent('riskOver');
                    }}
                  >
                    <div className={styles.topName}>已超时风险点</div>
                    <div className={styles.topNum} style={{ color: '#00baff' }}>
                      {selectOvertimeItemNum}
                    </div>
                  </div>
                </Tooltip>
              </div>

              <div className={styles.topItem}>
                <Tooltip placement="bottom" title={'本月监督检查的数量'}>
                  <div
                    className={styles.itemActive}
                    onClick={() => {
                      const thisMonth = moment().format('YYYY-MM');
                      handleParentChange({
                        checksMonth: thisMonth,
                      });
                      fetchCheckMsgs(thisMonth);
                      goComponent('checks');
                    }}
                  >
                    <div className={styles.topName}>本月监督检查</div>
                    <div className={styles.topNum} style={{ color: '#00baff' }}>
                      {checkedCompanyInfo}
                    </div>
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default TopData;
