import React, { PureComponent } from 'react';
import { Row, Col, Select, Drawer } from 'antd';
import moment from 'moment';
import styles from '../../Government.less';
import styles2 from './CheckDrawer.less';
import noChecks from '../../img/noChecks.png';

const { Option } = Select;
const currentMonth = moment().get('month');
const months = [...Array(currentMonth + 1).keys()].map(month => ({
  value: moment({ month: currentMonth - month }).format('YYYY-MM'),
}));
class CheckDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { selectedMonth: months[0].value };
  }

  componentDidMount() {}

  componentWillUnmount() {}

  handleMonthSelect = value => {
    const { fetchCheckMsgs, handleParentChange } = this.props;
    handleParentChange({
      checksMonth: value,
    });
    fetchCheckMsgs(value);
  };

  handleGoDangerCompany = userId => {
    const { dispatch, handleParentChange, checksMonth, gridId } = this.props;
    dispatch({
      type: 'bigPlatform/fetchHiddenDangerCompany',
      payload: {
        date: checksMonth,
        userId: userId || '',
        gridId,
      },
      success: res => {
        handleParentChange({
          dangerCompanyData: res,
          dangerCompanyLast: 'checks',
          dangerCoDrawer: true,
        });
      },
    });
  };

  render() {
    const {
      visible,
      handleParentChange,
      checksMonth,
      listData = [],
      checkedCompanyInfo: { companyNum: companyCheckAll = 0, fireCheckCompanyCount = 0 },
      dangerCompany: { dangerCompanyNum = 0 },
      dangerCompanyOver = [],
    } = this.props;
    const thisMonth = moment().format('YYYY-MM');

    return (
      <div>
        <Drawer
          width={500}
          closable={false}
          onClose={() => {
            handleParentChange({ checkDrawer: false });
          }}
          visible={visible}
          style={{ padding: 0 }}
          maskStyle={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
          zIndex={1111}
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
                    安全检查
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      top: '14px',
                      left: '130px',
                      paddingLeft: '18px',
                      borderLeft: '1px solid #00A9FF',
                    }}
                  >
                    <Select
                      size="small"
                      value={checksMonth}
                      onSelect={this.handleMonthSelect}
                      className={styles2.monthSelect}
                      dropdownClassName={styles2.monthDropDown}
                      style={{ position: 'relative', top: '1px', width: '105px' }}
                    >
                      {months.map(({ value }) => {
                        const isSelected = checksMonth === value;
                        return (
                          <Option
                            key={value}
                            value={value}
                            style={{
                              backgroundColor: isSelected && '#00A9FF',
                              color: isSelected && '#fff',
                            }}
                          >
                            {value === moment().format('YYYY-MM') ? `本月` : value}
                          </Option>
                        );
                      })}
                    </Select>
                  </div>
                  <div
                    className={styles.backBtn}
                    onClick={() => {
                      handleParentChange({ checkDrawer: false });
                    }}
                  />
                  <div className={styles.sectionMain}>
                    <div className={styles.sectionContent}>
                      <Row style={{ borderBottom: '2px solid #0967d3', padding: '6px 0' }}>
                        <Col span={12}>
                          <div className={styles.checksContent}>
                            <span className={styles.iconCom1} />
                            <div className={styles.checksWrapper}>
                              已检查单位
                              <div className={styles.checksNum}>{fireCheckCompanyCount}</div>
                            </div>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div
                            className={styles.checksContentActive}
                            onClick={() => {
                              handleParentChange({
                                checkUserId: '',
                                dangerCoDrawer: true,
                              });
                              this.handleGoDangerCompany();
                            }}
                          >
                            <span className={styles.iconCom2} />
                            <div className={styles.checksWrapper}>
                              隐患单位
                              <span style={{ opacity: 0 }}>啊</span>
                              <div className={styles.checksNum}>{dangerCompanyNum}</div>
                            </div>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div className={styles.checksContent}>
                            <span className={styles.iconCom3} />
                            <div className={styles.checksWrapper}>
                              未检查单位
                              <div className={styles.checksNum}>
                                {companyCheckAll - fireCheckCompanyCount}
                              </div>
                            </div>
                          </div>
                        </Col>
                        <Col
                          span={12}
                          style={{ display: checksMonth === thisMonth ? 'block' : 'none' }}
                        >
                          <div
                            className={styles.checksContentActive}
                            onClick={() => {
                              handleParentChange({ overComDrawer: true });
                            }}
                          >
                            <span className={styles.iconCom4} />
                            <div className={styles.checksWrapper}>
                              已超时单位
                              <div className={styles.checksNum}>{dangerCompanyOver.length}</div>
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <div className={styles.tableTitleWrapper}>
                        <span className={styles.tableTitle}>
                          {' '}
                          监管人员检查（
                          {listData.length}）
                        </span>
                      </div>
                      <div className={styles.scrollContainer} style={{ borderTop: 'none' }}>
                        {listData && listData.length ? (
                          <table className={styles.scrollTable}>
                            <thead>
                              <tr>
                                <th style={{ width: '25%' }}>姓名</th>
                                <th style={{ width: '25%' }}>监管单位</th>
                                <th style={{ width: '25%' }}>已巡查单位</th>
                                <th style={{ width: '25%' }}>隐患单位</th>
                              </tr>
                            </thead>
                            <tbody>
                              {listData.map((item, index) => {
                                return (
                                  <tr key={item.id}>
                                    <td>{item.user_name}</td>
                                    <td>{item.companyNum}</td>
                                    <td>{item.fireCheckCompanyCount}</td>
                                    <td
                                      style={{
                                        color: item.hiddenCompanyNum
                                          ? 'rgba(232, 103, 103, 0.8)'
                                          : 'rgba(255, 255, 255, 0.7)',
                                        cursor: item.hiddenCompanyNum ? 'pointer' : 'text',
                                      }}
                                      onClick={() => {
                                        if (!item.hiddenCompanyNum) return;
                                        handleParentChange({
                                          checkUserId: item.id,
                                        });
                                        this.handleGoDangerCompany(item.id);
                                      }}
                                    >
                                      {item.hiddenCompanyNum}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        ) : (
                          <div
                            className={styles.noChecks}
                            style={{
                              background: `url(${noChecks})`,
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: 'center center',
                              backgroundSize: '45% auto',
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
          {/* <RiskPointCompany
            riskPointVisible={riskPointVisible}
            visible={riskPointVisible}
            dispatch={dispatch}
            goCompany={goCompany}
            goComponent={this.goComponent}
            // listData={listData}
            riskColorSummary={riskColorSummary}
            handleParentChange={handleParentChange}
            closeAllDrawers={closeAllDrawers}
            companyName={companyName}
          /> */}
        </Drawer>
      </div>
    );
  }
}

export default CheckDrawer;
