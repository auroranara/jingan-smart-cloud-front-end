import React, { PureComponent, Fragment } from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { CardItem, MonitorBtns, FlameAndToxic, NoData } from './Components';
import { connect } from 'dva';
import { MonitorConfig } from '../utils';
import styles from './WarehouseArea.less';

const MonitorType = '301';
const NO_DATA = '暂无数据';
const Border = '1px solid #1C5D90';

@connect(({ chemical }) => ({ chemical }))
export default class TankArea extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.fetchBindedMonitoringDevice();
  }

  componentDidUpdate(prevProps) {
    const { data: prevData } = prevProps;
    const { data } = this.props;
    if (JSON.stringify(prevData) !== JSON.stringify(data)) this.fetchBindedMonitoringDevice();
  }

  fetchBindedMonitoringDevice = () => {
    const {
      dispatch,
      data: { companyId, id },
    } = this.props;
    dispatch({
      type: 'chemical/fetchMonitoringDevice',
      payload: {
        pageNum: 1,
        pageSize: 0,
        companyId,
        selfTargetId: id,
      },
    });
  };

  handleClickMonitorDetail = id => {
    const { detailUrl } = MonitorConfig[MonitorType] || {};
    detailUrl && id && window.open(`${window.publicPath}#/${detailUrl}/${id}`);
  };

  handleClickTankDetail = id => {
    const { detailUrl } = MonitorConfig['302'] || {};
    detailUrl && id && window.open(`${window.publicPath}#/${detailUrl}/${id}`);
  };

  handleClickSecurity = ({ unitId, targetId }) => {
    window.open(`${window.publicPath}#/security/${unitId}/detail/${targetId}`);
  };

  render() {
    const {
      data = {},
      handleShowVideo,
      chemical: { monitoringDevice },
      bordered,
    } = this.props;
    const { areaName, location, tmList = [], videoList = [], id, chineNameList, companyId } = data;
    const meList = monitoringDevice[id] || [];

    return (
      <div
        className={styles.container}
        style={{
          border: bordered ? Border : undefined,
          padding: bordered ? '10px 15px' : undefined,
        }}
      >
        <div className={styles.basic}>
          <div className={styles.name}>
            {areaName}
            <MonitorBtns
              videoList={videoList}
              onVideoClick={handleShowVideo}
              style={{
                position: 'relative',
                display: 'inline-block',
                marginLeft: 20,
                top: 7,
                left: 0,
              }}
            />
          </div>
          <div style={{ paddingRight: '6em' }}>
            <span className={styles.label}>存储物质：</span>
            {chineNameList ? chineNameList.join('、') : NO_DATA}

            {chineNameList &&
              chineNameList.length > 0 && (
                <div
                  className={styles.extra}
                  onClick={() => this.handleClickSecurity({ unitId: companyId, targetId: id })}
                  style={{ top: 0, bottom: 'auto' }}
                >
                  安防措施>>
                </div>
              )}
          </div>
          <div>
            <LegacyIcon type="environment" style={{ color: '#8198b4', marginRight: 5 }} />
            {location}
            <div className={styles.extra} onClick={() => this.handleClickMonitorDetail(id)}>
              详情>>
            </div>
          </div>
        </div>

        {tmList.length > 0 && (
          <div
            className={bordered ? styles.wrapper2 : styles.wrapper}
            style={{ borderTop: Border }}
          >
            <div className={styles.wrapperTitle}>储罐 ({tmList.length})</div>
            {tmList.length > 0 ? (
              tmList.map((item, index) => {
                const { fields, icon, iconStyle, labelStyle, btnStyles, moreStyle } =
                  MonitorConfig['302'] || {};
                const { videoList, meList, tankName, id } = item;
                const monitorParams = meList.reduce((res, cur) => {
                  const { allMonitorParam } = cur;
                  res = [...res, ...allMonitorParam];
                  return res;
                }, []);
                const newItem = {
                  ...item,
                  monitorParams,
                  icon: typeof icon === 'function' ? icon({ ...item, monitorParams }) : icon,
                };
                const { id: monitorEquipmentId } = meList[0] || {};
                const noFinishWarningProcessId = !meList.every(item => {
                  const { noFinishWarningProcessId } = item;
                  return !noFinishWarningProcessId;
                });

                return (
                  <CardItem
                    key={index}
                    data={newItem}
                    fields={fields}
                    iconStyle={iconStyle}
                    labelStyle={{ color: '#8198b4', ...labelStyle }}
                    fieldsStyle={{ lineHeight: '32px' }}
                    style={{
                      border: bordered ? 'none' : Border,
                      borderTop: bordered && index > 0 ? Border : bordered ? 'none' : Border,
                      marginTop: bordered ? 0 : undefined,
                    }}
                    extraBtn={
                      <Fragment>
                        <MonitorBtns
                          videoList={videoList}
                          onVideoClick={handleShowVideo}
                          noFinishWarningProcessId={noFinishWarningProcessId}
                          monitorEquipmentId={monitorEquipmentId}
                          style={{ top: 15, ...btnStyles }}
                          targetId={id}
                          targetType={'302'}
                          targetName={tankName}
                        />
                        {/* <div className={styles.detail} onClick={() => handleClickMonitorDetail(item)}> */}
                        <div
                          className={styles.detail}
                          onClick={() => this.handleClickTankDetail(item.id)}
                          style={{ ...moreStyle }}
                        >
                          详情>>
                        </div>
                      </Fragment>
                    }
                  />
                );
              })
            ) : (
              <NoData
                msg="暂未绑定储罐"
                style={{
                  height: '400px',
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'center',
                  color: '#4f6793',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                }}
              />
            )}
          </div>
        )}

        <FlameAndToxic
          handleShowVideo={handleShowVideo}
          meList={meList}
          noBorder={bordered}
          borderFull={bordered}
        />
      </div>
    );
  }
}
