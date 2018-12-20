import React, { PureComponent } from 'react';
import { Row, Col, Tooltip, Drawer, Spin } from 'antd';
import { connect } from 'dva';
import classNames from 'classnames';
import styles from '../../Government.less';
import styleSelf from './RiskPointCompany.less';

// 根据风险等级获取风险点卡片上标签的颜色和背景
const switchColorAndBgColor = color => {
  switch (color) {
    case '红':
      return {
        color: '#fff',
        backgroundColor: '#FF4848',
      };
    case '橙':
      return {
        color: '#fff',
        backgroundColor: '#F17A0A',
      };
    case '黄':
      return {
        color: '#000',
        backgroundColor: '#FBF719',
      };
    case '蓝':
      return {
        color: '#fff',
        backgroundColor: '#1E60FF',
      };
    default:
      return {
        color: '#fff',
        backgroundColor: '#4F6793',
      };
  }
};

// 获取颜色和status
const switchCheckStatus = value => {
  switch (value) {
    case 1:
      return {
        color: '#fff',
        _color: '#00A181',
        content: '正常',
      };
    case 2:
      return {
        color: '#FF4848',
        _color: '#FF4848',
        content: '异常',
      };
    case 3:
      return {
        color: '#fff',
        _color: '#5EBEFF',
        content: '待检查',
      };
    case 4:
      return {
        color: '#FF4848',
        _color: '#FF4848',
        content: '已超时',
      };
    default:
      return {
        color: '#fff',
        _color: '#fff',
        content: '暂无状态',
      };
  }
};
const tabs = ['全部', '异常', '已超时', '待检查', '正常'];
const riskStatus = [0, 2, 4, 3, 1];
const riskColors = ['红', '橙', '黄', '蓝', '未评级'];
let riskNums = [0, 0, 0, 0, 0];

const removeSame = list => {
  const ids = [...new Set(list.map(data => data.item_id))];
  const newList = [];
  ids.forEach(id => {
    newList.push(list.filter(data => data.item_id === id)[0]);
  });
  return newList;
};
@connect(({ bigPlatform, loading }) => ({
  bigPlatform,
  loading: loading.effects['bigPlatform/fetchSelfCheckPointData'],
}))
class RiskPointCompany extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      listData: [],
      active: 0,
    };
  }

  componentDidMount() {
    const {
      bigPlatform: {
        selfCheckPointData: { list },
      },
    } = this.props;
    const newList = removeSame(list);
    riskNums = riskStatus.map(data => {
      if (data === 0) return newList.length;
      return newList.filter(d => +d.status === data).length;
    });
    this.setState({ listData: newList });
    // this.setState({ listData: list });
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    return (
      JSON.stringify(this.props.bigPlatform.selfCheckPointData) !==
      JSON.stringify(prevProps.bigPlatform.selfCheckPointData)
    );
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      bigPlatform: {
        selfCheckPointData: { list },
      },
    } = this.props;
    if (snapshot) {
      const newList = removeSame(list);
      riskNums = riskStatus.map(data => {
        if (data === 0) return newList.length;
        return newList.filter(d => +d.status === data).length;
      });
      this.setState({ listData: newList });
      // this.setState({ listData: list });
    }
  }

  componentWillUnmount() {}

  renderRisk = (item, colors) => {
    const { item_id, object_title, user_name, check_date, status } = item;
    const { content, color } = switchCheckStatus(+status);
    return (
      <div className={styleSelf.riskPointItem} key={item_id}>
        <div className={styleSelf.riskPointItemLabel} style={switchColorAndBgColor(colors)}>
          {colors}
        </div>
        <div className={styleSelf.riskPointItemNameWrapper}>
          <div className={styleSelf.riskPointItemName}>风险点</div>
          <div className={styleSelf.riskPointItemValue}>{object_title}</div>
        </div>
        <div className={styleSelf.riskPointItemNameWrapper}>
          <div className={styleSelf.riskPointItemName}>检查人</div>
          <div className={styleSelf.riskPointItemValue}>{user_name || '暂无数据'}</div>
        </div>
        <div className={styleSelf.riskPointItemNameWrapper}>
          <div className={styleSelf.riskPointItemName}>检查时间</div>
          <div className={styleSelf.riskPointItemValue}>{check_date || '暂无数据'}</div>
        </div>
        {status && (
          <div className={styleSelf.riskPointItemNameWrapper}>
            <div className={styleSelf.riskPointItemName}>状态</div>
            <div className={styleSelf.riskPointItemValue} style={{ color }}>
              {content}
            </div>
          </div>
        )}
      </div>
    );
  };

  renderTabs = () => {
    const { active } = this.state;
    const {
      bigPlatform: {
        selfCheckPointData: { list },
      },
    } = this.props;
    return tabs.map((item, index) => {
      const tabStyles = classNames(styleSelf.tab, { [styleSelf.active]: index === active });
      return (
        <span
          className={tabStyles}
          onClick={() => {
            if (active === index) return;
            const newList = removeSame(list);
            const filterData = newList.filter(
              data => !riskStatus[index] || (data.status && +data.status === riskStatus[index])
            );
            this.setState({ active: index, listData: filterData });
          }}
          key={index}
        >
          {item}({riskNums[index]})
        </span>
      );
    });
  };

  handleClose = () => {
    const {
      handleParentChange,
      bigPlatform: {
        selfCheckPointData: { list },
      },
    } = this.props;
    const newList = removeSame(list);
    handleParentChange({ riskPointCompany: false });
    setTimeout(() => {
      this.setState({ active: 0, listData: newList });
    }, 300);
  };

  render() {
    const { visible, closeAllDrawers, loading, companyName } = this.props;
    const { listData } = this.state;
    return (
      <div>
        <Drawer
          width={500}
          closable={false}
          onClose={() => {
            this.handleClose();
          }}
          visible={visible}
          style={{ padding: 0 }}
          maskStyle={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
          zIndex={1333}
        >
          <div className={styles.main} style={{ padding: 0 }}>
            <div
              className={styles.mainBody}
              style={{ margin: 0, height: '100%', overflow: 'hidden' }}
            >
              <section className={styles.sectionWrapper}>
                <div className={styles.sectionWrapperIn}>
                  {/* <Tooltip placement="bottomLeft" title={`风险点-${companyName}`}> */}
                  <div
                    className={styles.sectionTitle}
                    style={{
                      width: '85%',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    <span className={styles.titleBlock} />
                    风险点-
                    {companyName}
                  </div>
                  {/* </Tooltip> */}
                  <div
                    className={styles.backBtn}
                    onClick={() => {
                      this.handleClose();
                    }}
                  />
                  {/* <div
                    className={styles.backBtn}
                    onClick={() => {
                      closeAllDrawers();
                    }}
                    style={{
                      background: 'none',
                      right: '52px',
                      fontSize: '26px',
                      lineHeight: '32px',
                      textAlign: 'center',
                    }}
                  >
                    <Icon type="close" />
                  </div> */}
                  <div className={styles.sectionMain}>
                    <div className={styles.sectionContent}>
                      <Row style={{ padding: '6px 0', paddingBottom: '12px' }}>
                        <Col span={24}>{this.renderTabs()}</Col>
                      </Row>
                      <div className={styles.scrollContainer} style={{ borderTop: 'none' }}>
                        <Spin spinning={loading} style={{ height: '100%', overflow: 'hidden' }}>
                          {listData.length > 0 ? (
                            listData.map(item => {
                              const riskLvl = item.risk_level ? +item.risk_level - 1 : 4;
                              return this.renderRisk(item, riskColors[riskLvl]);
                            })
                          ) : (
                            <div style={{ textAlign: 'center', lineHeight: '100px' }}>暂无数据</div>
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

export default RiskPointCompany;
