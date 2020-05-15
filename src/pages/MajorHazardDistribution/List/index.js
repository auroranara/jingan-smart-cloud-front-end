import React, { Component, Fragment } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { message, Spin, List, Card, Row, Col, notification, Empty, Carousel, Skeleton } from 'antd';
import Map from '@/jingan-components/Form/Map';
import JoySuchMap from '@/jingan-components/Form/JoySuchMap';
// import Radio from '@/jingan-components/Form/Radio';
import EmptyText from '@/jingan-components/View/EmptyText';
import TextAreaEllipsis from '@/jingan-components/View/TextAreaEllipsis';
import Ellipsis from '@/components/Ellipsis';
import Company from '@/templates/Company';
import Link from '@/jingan-components/View/Link';
import { connect } from 'dva';
import moment from 'moment';
import classNames from 'classnames';
import router from 'umi/router';
import { stringify } from 'qs';
import WebsocketHeartbeatJs from '@/utils/heartbeat';
import { GET_STATUS_NAME } from '@/pages/IoT/AlarmMessage';
import {
  BREADCRUMB_LIST_PREFIX,
  NAMESPACE,
  MAP_LIST_API,
  LIST_API,
  DETAIL_CODE,
  TYPES,
  LIST_GRID,
  COMBUSTIBLE_GAS_POINT_LIST_API,
  TOXIC_GAS_POINT_LIST_API,
  VIDEO_POINT_LIST_API,
  COLORS,
  LEVELS,
  ALARM_MESSAGE_PATH,
  WEBSOCKET_OPTIONS,
  FORMAT,
  UPDATE_LIST_API,
  SAVE_API,
  ALARM_MESSAGE_LIST_API,
  ALARM_MESSAGE_CODE,
} from '../config';
import iconVideo from '../assets/icon-video.png';
import iconToxicGas from '../assets/icon-toxic-gas.png';
import iconCombustibleGas from '../assets/icon-combustible-gas.png';
import iconLevel1 from '../assets/icon-level1.png';
import iconLevel2 from '../assets/icon-level2.png';
import iconLevel3 from '../assets/icon-level3.png';
import iconLevel4 from '../assets/icon-level4.png';
import iconVideoMarker from '../assets/icon-video-marker.png';
import iconCombustibleGasMarker from '../assets/icon-combustible-gas-marker.png';
import iconToxicGasMarker from '../assets/icon-toxic-gas-marker.png';
import iconAlarm from '../assets/icon-alarm.png';
import styles from './index.less';

const MAP_BUTTON_OPTIONS = [
  { label: '视频监控', icon: iconVideo },
  { label: '可燃气体', icon: iconCombustibleGas },
  { label: '有毒气体', icon: iconToxicGas },
];

const DEFAULT_STATE = {
  type: undefined,
  disabledMapButtonList: undefined,
  polygonMarkerList: undefined,
  imageMarkerList: undefined,
  combustibleGasPointList: undefined,
  toxicGasPointList: undefined,
  videoPointList: undefined,
  loadingMap: false,
  map: undefined,
  levelList: undefined,
  modelList: undefined,
  alarmList: undefined,
};

const URLS = [iconLevel1, iconLevel2, iconLevel3, iconLevel4];

@connect(
  (
    {
      user: {
        currentUser: { unitType, unitId: unitId1, permissionCodes },
      },
      common: { mapList },
      [NAMESPACE]: {
        list,
        combustibleGasPointList,
        toxicGasPointList,
        videoPointList,
        alarmMessageList,
      },
      loading: {
        effects: {
          [MAP_LIST_API]: loadingMapList,
          [LIST_API]: loadingList,
          [COMBUSTIBLE_GAS_POINT_LIST_API]: loadingCombustibleGasPointList,
          [TOXIC_GAS_POINT_LIST_API]: loadingToxicGasPointList,
          [VIDEO_POINT_LIST_API]: loadingVideoPointList,
          [UPDATE_LIST_API]: updating,
          [ALARM_MESSAGE_LIST_API]: loadingAlarmMessageList,
        },
      },
    },
    {
      match: {
        params: { unitId: unitId2 },
      },
      route: { path },
    }
  ) => {
    const isUnit = unitType === 4;
    const unitId = isUnit ? unitId1 : unitId2;
    const companyUrl = path.replace(new RegExp(':.*'), 'list');
    return {
      isUnit,
      unitId,
      breadcrumbList: BREADCRUMB_LIST_PREFIX.concat(
        [
          !isUnit && {
            title: '单位列表',
            name: '单位列表',
            href: companyUrl,
          },
          unitId && { title: '重大危险源分布', name: '重大危险源分布' },
        ].filter(v => v)
      ),
      mapList,
      loadingMapList,
      list,
      loadingList,
      updating,
      combustibleGasPointList,
      loadingCombustibleGasPointList,
      toxicGasPointList,
      loadingToxicGasPointList,
      videoPointList,
      loadingVideoPointList,
      alarmMessageList,
      loadingAlarmMessageList,
      hasDetailAuthority: permissionCodes.includes(DETAIL_CODE),
      hasAlarmMessageAuthority: permissionCodes.includes(ALARM_MESSAGE_CODE),
      goToCompany() {
        router.push(companyUrl);
      },
    };
  },
  null,
  (stateProps, { dispatch }, ownProps) => {
    const { unitId } = stateProps;
    const {
      location: { pathname },
      route: { path, name },
    } = ownProps;
    return {
      ...stateProps,
      ...ownProps,
      getMapList(payload, callback) {
        dispatch({
          type: MAP_LIST_API,
          payload: {
            companyId: unitId,
            ...payload,
          },
          callback(success, data) {
            if (!success) {
              message.error('获取地图数据失败，请稍后重试！');
            }
            callback && callback(success, data);
          },
        });
      },
      getList(payload, callback) {
        dispatch({
          type: LIST_API,
          payload: {
            pageNum: 1,
            pageSize: 0,
            companyId: unitId,
            ...payload,
          },
          callback(success, data) {
            if (!success) {
              message.error('获取列表数据失败，请稍后重试！');
            }
            callback && callback(success, data);
          },
        });
      },
      getCombustibleGasPointList(payload, callback) {
        dispatch({
          type: COMBUSTIBLE_GAS_POINT_LIST_API,
          payload: {
            pageNum: 1,
            pageSize: 0,
            companyId: unitId,
            equipmentType: 405,
            dangerSource: 1,
            ...payload,
          },
          callback(success, data) {
            if (!success) {
              message.error('获取可燃气体监测列表数据失败，请稍后重试！');
            }
            callback && callback(success, data);
          },
        });
      },
      getToxicGasPointList(payload, callback) {
        dispatch({
          type: TOXIC_GAS_POINT_LIST_API,
          payload: {
            pageNum: 1,
            pageSize: 0,
            companyId: unitId,
            equipmentType: 406,
            dangerSource: 1,
            ...payload,
          },
          callback(success, data) {
            if (!success) {
              message.error('获取有毒气体监测列表数据失败，请稍后重试！');
            }
            callback && callback(success, data);
          },
        });
      },
      getVideoPointList(payload, callback) {
        dispatch({
          type: VIDEO_POINT_LIST_API,
          payload: {
            companyId: unitId,
            status: 1,
            dangerSource: 1,
            ...payload,
          },
          callback(success, data) {
            if (!success) {
              message.error('获取视频监控列表数据失败，请稍后重试！');
            }
            callback && callback(success, data);
          },
        });
      },
      goToDetail(id) {
        router.push(pathname.replace(new RegExp(`${name}.*`), `detail/${id}`));
      },
      goToList(data) {
        router.push(path.replace(':unitId?', data.id || data));
      },
      updateList(payload, callback) {
        dispatch({
          type: UPDATE_LIST_API,
          payload: {
            pageNum: 1,
            pageSize: 1,
            companyId: unitId,
            ...payload,
          },
          callback(success, data) {
            if (!success) {
              message.error('更新列表数据失败，请稍后重试！');
            }
            callback && callback(success, data);
          },
        });
      },
      save(payload) {
        dispatch({
          type: SAVE_API,
          payload,
        });
      },
      getAlarmMessageList(payload, callback) {
        dispatch({
          type: ALARM_MESSAGE_LIST_API,
          payload: {
            companyId: unitId,
            overFlag: 0,
            dangerSource: 1,
            statusTypes: '-1,1',
            ...payload,
          },
          callback(success, data) {
            if (!success) {
              message.error('获取报警消息列表数据失败，请稍后重试！');
            }
            callback && callback(success, data);
          },
        });
      },
    };
  }
)
export default class MajorHazardDistributionList extends Component {
  state = {
    ...DEFAULT_STATE,
  };

  ws = null;

  myTimer = null;

  componentDidMount() {
    const { unitId } = this.props;
    if (unitId) {
      this.initialize();
    }
  }

  componentWillUnmount() {
    this.ws && this.ws.close();
    notification.destroy();
  }

  componentDidUpdate({ unitId: prevUnitId }) {
    const { unitId } = this.props;
    if (unitId) {
      if (unitId !== prevUnitId) {
        this.initialize();
      }
    }
  }

  initialize = () => {
    const {
      unitId,
      getMapList,
      getList,
      getCombustibleGasPointList,
      getToxicGasPointList,
      getVideoPointList,
      getAlarmMessageList,
    } = this.props;
    this.setState({
      ...DEFAULT_STATE,
      type: TYPES[0].key,
    });
    getMapList();
    getList(undefined, (success, data) => {
      if (success) {
        const { polygonMarkerList, levelList, modelList, alarmList } = data.reduce(
          (result, { id, dangerLevel, coordinateList, groupId, modelIds, warnStatus }) => {
            if (groupId) {
              if (coordinateList && coordinateList.length) {
                const points = coordinateList.map(({ x, y, z }) => ({ x: +x, y: +y, z: +z }));
                // const color = COLORS[dangerLevel - 1];
                const color = 'rgba(21, 113, 217, 0.6)';
                const polygonMarkerOptions = {
                  key: id,
                  groupId: +groupId,
                  alpha: 0.3,
                  color,
                  lineWidth: 0,
                  height: 1,
                  points,
                };
                result.polygonMarkerList.push(polygonMarkerOptions);
                if (dangerLevel) {
                  const { x, y } = coordinateList[0];
                  const levelOptions = {
                    key: `${id}_level`,
                    groupId: +groupId,
                    x: +x,
                    y: +y,
                    url: URLS[dangerLevel - 1],
                    size: 36,
                    height: 1,
                    callback(marker) {
                      marker.alwaysShow();
                    },
                  };
                  result.levelList.push(levelOptions);
                }
                if (modelIds) {
                  const modelIdList = modelIds.split(',');
                  result.modelList = result.modelList.concat(
                    modelIdList.map(key => ({
                      key,
                      groupId: +groupId,
                      alpha: 0.5,
                      color,
                    }))
                  );
                }
                if (+warnStatus === -1) {
                  const { x, y } = coordinateList[1];
                  const alarmOptions = {
                    key: `${id}_alarm`,
                    groupId: +groupId,
                    x: +x,
                    y: +y,
                    url: iconAlarm,
                    size: 36,
                    height: 1,
                    callback(marker) {
                      marker.alwaysShow();
                    },
                  };
                  result.alarmList.push(alarmOptions);
                }
              }
            }
            return result;
          },
          { polygonMarkerList: [], levelList: [], modelList: [], alarmList: [] }
        );
        this.setState(({ imageMarkerList = [] }) => ({
          polygonMarkerList,
          imageMarkerList: imageMarkerList.concat(levelList).concat(alarmList),
          levelList,
          modelList,
          alarmList,
        }));
      }
    });
    getVideoPointList(undefined, (success, data) => {
      if (success) {
        const videoPointList = data.reduce((result, { pointFixInfoList }) => {
          const { id, xnum, ynum, groupId, imgType, isShow } = (pointFixInfoList || [])[0] || {};
          if (groupId && +imgType === 5 && +isShow === 1) {
            const options = {
              key: id,
              groupId: +groupId,
              x: +xnum,
              y: +ynum,
              url: iconVideoMarker,
              size: 36,
              height: 1,
              callback(marker) {
                marker.alwaysShow();
              },
            };
            result.push(options);
          }
          return result;
        }, []);
        this.setState(({ disabledMapButtonList = [], imageMarkerList = [] }) => ({
          imageMarkerList: imageMarkerList.concat(
            disabledMapButtonList.includes(MAP_BUTTON_OPTIONS[0].label) ? [] : videoPointList
          ),
          videoPointList,
        }));
      }
    });
    getCombustibleGasPointList(undefined, (success, data) => {
      if (success) {
        const combustibleGasPointList = data.reduce((result, { pointFixInfoList }) => {
          const { id, xnum, ynum, groupId, imgType, isShow } = (pointFixInfoList || [])[0] || {};
          if (groupId && +imgType === 5 && +isShow === 1) {
            const options = {
              key: id,
              groupId: +groupId,
              x: +xnum,
              y: +ynum,
              url: iconCombustibleGasMarker,
              size: 36,
              height: 1,
              callback(marker) {
                marker.alwaysShow();
              },
            };
            result.push(options);
          }
          return result;
        }, []);
        this.setState(({ disabledMapButtonList = [], imageMarkerList = [] }) => ({
          imageMarkerList: imageMarkerList.concat(
            disabledMapButtonList.includes(MAP_BUTTON_OPTIONS[1].label)
              ? []
              : combustibleGasPointList
          ),
          combustibleGasPointList,
        }));
      }
    });
    getToxicGasPointList(undefined, (success, data) => {
      if (success) {
        const toxicGasPointList = data.reduce((result, { pointFixInfoList }) => {
          const { id, xnum, ynum, groupId, imgType, isShow } = (pointFixInfoList || [])[0] || {};
          if (groupId && +imgType === 5 && +isShow === 1) {
            const options = {
              key: id,
              groupId: +groupId,
              x: +xnum,
              y: +ynum,
              url: iconToxicGasMarker,
              size: 36,
              height: 1,
              callback(marker) {
                marker.alwaysShow();
              },
            };
            result.push(options);
          }
          return result;
        }, []);
        this.setState(({ disabledMapButtonList = [], imageMarkerList = [] }) => ({
          imageMarkerList: imageMarkerList.concat(
            disabledMapButtonList.includes(MAP_BUTTON_OPTIONS[2].label) ? [] : toxicGasPointList
          ),
          toxicGasPointList,
        }));
      }
    });
    getAlarmMessageList();

    this.ws && this.ws.close();
    const { projectKey: env, webscoketHost } = global.PROJECT_CONFIG;

    const params = {
      companyId: unitId,
      env,
      type: 12,
    };
    const url = `ws://${webscoketHost}/websocket?${stringify(params)}`;

    // 链接webscoket
    const ws = new WebsocketHeartbeatJs({ url, ...WEBSOCKET_OPTIONS });
    this.ws = ws;

    ws.onopen = () => {
      console.log('connect success');
      ws.send('heartbeat');
    };

    ws.onmessage = e => {
      // 判断是否是心跳
      if (!e.data || e.data.indexOf('heartbeat') > -1) return;
      try {
        const data = JSON.parse(e.data).data;
        const { dangerSourceId, dangerSourceWarnStatus, statusType } = data;
        console.log(data);
        // if (['405', '406'].includes(`${data.monitorEquipmentType}`)) {
        //   if (['1', '2'].includes(`${data.warnLevel}`)) {
        //     this.showNotification(data);
        //   }
        // }
        if ([-1, 1].includes(+statusType)) {
          const { getAlarmMessageList } = this.props;
          getAlarmMessageList();
        }
        if (dangerSourceId) {
          const { save, list } = this.props;
          const obj = list.find(item => item.id === dangerSourceId);
          if (obj && obj.warnStatus !== dangerSourceWarnStatus) {
            const id = `${dangerSourceId}_alarm`;
            save({
              list: list.map(
                item => (item === obj ? { ...item, warnStatus: dangerSourceWarnStatus } : item)
              ),
            });
            if (+dangerSourceWarnStatus !== -1) {
              this.setState(({ imageMarkerList, alarmList }) => {
                return {
                  imageMarkerList: imageMarkerList.filter(item => item.key !== id),
                  alarmList: alarmList.filter(item => item.key !== id),
                };
              });
            } else {
              const { groupId, coordinateList } = obj;
              if (groupId && coordinateList && coordinateList.length) {
                this.setState(({ imageMarkerList, alarmList }) => {
                  const { x, y } = coordinateList[1];
                  const options = {
                    key: id,
                    groupId: +groupId,
                    x: +x,
                    y: +y,
                    url: iconAlarm,
                    size: 36,
                    height: 1,
                    callback(marker) {
                      marker.alwaysShow();
                    },
                  };
                  return {
                    imageMarkerList: imageMarkerList.concat(options),
                    alarmList: alarmList.concat(options),
                  };
                });
              }
            }
          }
        }
      } catch (error) {
        console.log('error', error);
      }
    };

    ws.onreconnect = () => {
      console.log('reconnecting...');
    };
  };

  showNotification = ({
    id,
    happenTime,
    statusType,
    fixType,
    warnLevel,
    monitorEquipmentTypeName,
    paramDesc,
    paramUnit,
    monitorValue,
    limitValue,
    monitorEquipmentAreaLocation,
    monitorEquipmentName,
    faultTypeName,
  }) => {
    const typeName = GET_STATUS_NAME({ statusType, warnLevel, fixType });
    notification.open({
      key: id,
      icon: (
        <span
          className={classNames(
            styles.notificationIcon,
            statusType < 0 ? styles.error : styles.success
          )}
        />
      ),
      message: `${monitorEquipmentTypeName}${
        [-1, -2, -3].includes(+statusType) ? '发生' : ''
      }${typeName}`,
      description: (
        <Fragment>
          <div>{`发生时间：${happenTime ? moment(happenTime).format(FORMAT) : ''}`}</div>
          {![-2, -3].includes(+statusType) && (
            <div>{`监测数值：当前${paramDesc}为${monitorValue}${paramUnit || ''}${
              ['预警', '告警'].includes(typeName)
                ? `，超过${typeName}值${Math.abs(monitorValue - limitValue)}${paramUnit || ''}`
                : ''
            }`}</div>
          )}
          {[-3, 3].includes(+statusType) && <div>{`故障类型：${faultTypeName || ''}`}</div>}
          <div>{`监测设备：${monitorEquipmentName || ''}`}</div>
          <div>{`区域位置：${monitorEquipmentAreaLocation || ''}`}</div>
        </Fragment>
      ),
      btn: (
        <Link to={ALARM_MESSAGE_PATH} target="_blank">
          查看更多
        </Link>
      ),
      duration: 30,
    });
  };

  handleTypeChange = type => {
    this.setState({
      type,
    });
  };

  handleItemClick = ({
    currentTarget: {
      dataset: { id },
    },
  }) => {
    const { goToDetail } = this.props;
    goToDetail(id);
  };

  handleMapButtonClick = ({
    currentTarget: {
      dataset: { label },
    },
  }) => {
    this.setState(
      ({
        disabledMapButtonList = [],
        videoPointList = [],
        combustibleGasPointList = [],
        toxicGasPointList = [],
        levelList = [],
        alarmList = [],
      }) => {
        const nextDisabledMapButtonList = disabledMapButtonList.includes(label)
          ? disabledMapButtonList.filter(item => item !== label)
          : disabledMapButtonList.concat(label);

        return {
          disabledMapButtonList: nextDisabledMapButtonList,
          imageMarkerList: levelList
            .concat(alarmList)
            .concat(
              nextDisabledMapButtonList.includes(MAP_BUTTON_OPTIONS[0].label) ? [] : videoPointList
            )
            .concat(
              nextDisabledMapButtonList.includes(MAP_BUTTON_OPTIONS[1].label)
                ? []
                : combustibleGasPointList
            )
            .concat(
              nextDisabledMapButtonList.includes(MAP_BUTTON_OPTIONS[2].label)
                ? []
                : toxicGasPointList
            ),
        };
      }
    );
  };

  handleMapLoadStart = () => {
    this.setState({
      loadingMap: true,
    });
  };

  handleMapLoadEnd = map => {
    this.setState({
      loadingMap: false,
      map,
    });
  };

  handleAlertAfterClose = () => {
    this.setState({
      alertVisible: false,
    });
  };

  renderMap() {
    const { mapList: [options = {}] = [] } = this.props;
    const {
      disabledMapButtonList = [],
      imageMarkerList,
      polygonMarkerList,
      modelList,
      videoPointList = [],
      combustibleGasPointList = [],
      toxicGasPointList = [],
    } = this.state;
    const mapper = {
      [MAP_BUTTON_OPTIONS[0].label]: videoPointList,
      [MAP_BUTTON_OPTIONS[1].label]: combustibleGasPointList,
      [MAP_BUTTON_OPTIONS[2].label]: toxicGasPointList,
    };
    const { remarks } = options;
    const btns = (
      <div className={styles.mapButtonContainer}>
        {MAP_BUTTON_OPTIONS.map(({ label, icon }) => {
          if (mapper[label].length) {
            const disabled = disabledMapButtonList.includes(label);
            return (
              <div
                className={styles.mapButton}
                key={label}
                data-label={label}
                onClick={this.handleMapButtonClick}
              >
                <img
                  src={icon}
                  alt=""
                  style={{ filter: disabled ? 'grayscale(100%)' : undefined }}
                />
                <span style={disabled ? { color: 'gray' } : undefined}>{label}</span>
              </div>
            );
          }
          return null;
        })}
      </div>
    );
    const ThreeDMap = +remarks === 1 ? Map : JoySuchMap;

    return (
      <ThreeDMap
        options={options}
        imageMarkerList={imageMarkerList}
        polygonMarkerList={polygonMarkerList}
        modelList={modelList}
        onLoadStart={this.handleMapLoadStart}
        onLoadEnd={this.handleMapLoadEnd}
      >
        {btns}
      </ThreeDMap>
    );
  }

  renderList() {
    const { list, hasDetailAuthority } = this.props;

    return list && list.length ? (
      <List
        grid={LIST_GRID}
        dataSource={list}
        renderItem={item => (
          <List.Item>
            <Card
              hoverable={hasDetailAuthority}
              onClick={hasDetailAuthority ? this.handleItemClick : undefined}
              data-id={item.id}
            >
              <div className={styles.fieldContainer}>
                {+item.warnStatus === -1 && (
                  <img className={styles.fieldAlert} src={iconAlarm} alt="" />
                )}
                <Row gutter={24}>
                  {[
                    {
                      key: '重大危险源名称',
                      value: item.name,
                    },
                    {
                      key: '统一编码',
                      value: item.code,
                    },
                    {
                      key: '重大危险源等级',
                      value: LEVELS[item.dangerLevel - 1],
                    },
                    {
                      key: '区域位置',
                      value: item.location,
                    },
                    {
                      key: '备案时间',
                      value: item.recordDate && moment(item.recordDate).format('YYYY.MM.DD'),
                    },
                    {
                      key: '责任人',
                      value: item.dutyPerson && (
                        <TextAreaEllipsis
                          length={9}
                          value={item.dutyPerson
                            .split(',')
                            .join(' ')
                            .split(';')
                            .join('\n')}
                        />
                      ),
                      reserved: true,
                    },
                  ].map(({ key, value, reserved }) => (
                    <Col span={12} key={key}>
                      <div className={styles.fieldWrapper}>
                        <div className={styles.fieldName}>{key}：</div>
                        <div className={styles.fieldValue}>
                          {value ? (
                            reserved ? (
                              value
                            ) : (
                              <Ellipsis lines={1} tooltip>
                                {value}
                              </Ellipsis>
                            )
                          ) : (
                            <EmptyText />
                          )}
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </Card>
          </List.Item>
        )}
      />
    ) : (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    );
  }

  render() {
    const {
      unitId,
      breadcrumbList,
      route,
      location,
      match,
      goToList,
      alarmMessageList,
      loadingMapList = false,
      loadingList = false,
      loadingCombustibleGasPointList = false,
      loadingToxicGasPointList = false,
      loadingVideoPointList = false,
      updating = false,
      loadingAlarmMessageList = false,
      hasAlarmMessageAuthority,
    } = this.props;
    const { type, loadingMap } = this.state;

    return unitId ? (
      <PageHeaderLayout
        className={styles.layout}
        breadcrumbList={breadcrumbList}
        title={breadcrumbList[breadcrumbList.length - 1].title}
        // action={
        //   <Radio list={TYPES} value={type} onChange={this.handleTypeChange} buttonStyle="solid" />
        // }
        content={
          loadingAlarmMessageList ? (
            <Skeleton active />
          ) : (
            alarmMessageList &&
            alarmMessageList.length > 0 && (
              <div className={styles.carouselWrapper}>
                <div>
                  <Carousel
                    className={styles.carousel}
                    autoplay
                    autoplaySpeed={5000}
                    dotPosition="right"
                    dots={false}
                  >
                    {alarmMessageList.map(({ id, happenTime, messageContent }) => {
                      return (
                        <div className={styles.alarmMessageItem} key={id}>
                          <TextAreaEllipsis
                            value={`${moment(happenTime).format(FORMAT)}\n${messageContent}`}
                            length={null}
                          />
                        </div>
                      );
                    })}
                  </Carousel>
                </div>
                <div>
                  <Link
                    disabled={!hasAlarmMessageAuthority}
                    to={ALARM_MESSAGE_PATH}
                    target="_blank"
                  >
                    查看更多
                  </Link>
                </div>
              </div>
            )
          )
        }
        tabList={TYPES}
        tabActiveKey={type}
        onTabChange={this.handleTypeChange}
      >
        <Spin
          tip="加载中..."
          spinning={
            loadingMap ||
            loadingMapList ||
            loadingList ||
            loadingCombustibleGasPointList ||
            loadingToxicGasPointList ||
            loadingVideoPointList ||
            updating
          }
        >
          {type === TYPES[0].key && this.renderList()}
          {type === TYPES[1].key && this.renderMap()}
        </Spin>
      </PageHeaderLayout>
    ) : (
      <Company
        breadcrumbList={breadcrumbList}
        route={route}
        location={location}
        match={match}
        onClick={goToList}
      />
    );
  }
}
