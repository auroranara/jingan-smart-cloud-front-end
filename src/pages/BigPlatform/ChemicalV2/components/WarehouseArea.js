import React, { PureComponent, Fragment } from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Warehouse, MonitorBtns, FlameAndToxic, NoData } from './Components';
import { connect } from 'dva';
import { MonitorConfig } from '../utils';
import styles from './WarehouseArea.less';

const MonitorType = '303';
const NO_DATA = '暂无数据';

@connect(({ chemical }) => ({ chemical }))
export default class WarehouseArea extends PureComponent {
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

  handleClickSecurity = ({ unitId, targetId }) => {
    window.open(`${window.publicPath}#/security/${unitId}/detail/${targetId}`);
  };

  render() {
    const {
      data = {},
      handleShowVideo,
      chemical: { monitoringDevice },
      onSecurityClick,
    } = this.props;

    const { name, position, warehouseInfos = [], videoList = [], id, companyId } = data;
    const meList = monitoringDevice[id] || [];

    // 存储物质并去重
    let hash = {};
    const materialList = warehouseInfos.reduce((res, cur) => {
      const { unitChemiclaNumDetail } = cur;
      unitChemiclaNumDetail.every(item => {
        const { materialId, chineName } = item;
        if (!hash[materialId]) {
          hash[materialId] = true;
          res.push(chineName);
        }
        return chineName;
      });
      return res;
    }, []);

    return (
      <div className={styles.container}>
        <div className={styles.basic}>
          <div className={styles.name}>
            {name}
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
            {materialList && materialList.length ? materialList.join('、') : NO_DATA}

            {materialList &&
              materialList.length > 0 && (
                <div
                  className={styles.extra}
                  // onClick={() => this.handleClickSecurity({ unitId: companyId, targetId: id })}
                  style={{ top: 0, bottom: 'auto' }}
                  onClick={() =>
                    onSecurityClick(
                      (warehouseInfos || []).reduce((result, item) => {
                        if (item.materialsName && item.materialsName.startsWith('[')) {
                          const list = JSON.parse(item.materialsName);
                          result = result.concat(
                            list.map(item => ({
                              key: item.materialId,
                              value: item.chineName,
                            }))
                          );
                        }
                        return result;
                      }, [])
                    )
                  }
                >
                  安防措施>>
                </div>
              )}
          </div>
          <div>
            <LegacyIcon type="environment" style={{ color: '#8198b4', marginRight: 5 }} />
            {position}
            <div className={styles.extra} onClick={() => this.handleClickMonitorDetail(id)}>
              详情>>
            </div>
          </div>
        </div>

        {warehouseInfos.length > 0 && (
          <div className={styles.wrapper} style={{ borderTop: '1px solid #1C5D90' }}>
            <div className={styles.wrapperTitle}>库房 ({warehouseInfos.length})</div>
            {warehouseInfos.length > 0 ? (
              warehouseInfos.map((item, index) => (
                <Warehouse
                  key={index}
                  data={item}
                  handleShowVideo={handleShowVideo}
                  outBorder
                  onSecurityClick={onSecurityClick}
                />
              ))
            ) : (
              <NoData
                msg="暂未绑定库房"
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

        <FlameAndToxic handleShowVideo={handleShowVideo} meList={meList} />
      </div>
    );
  }
}
