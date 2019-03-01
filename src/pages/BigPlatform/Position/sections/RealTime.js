import React, { PureComponent } from 'react';
import WebsocketHeartbeatJs from '@/utils/heartbeat';
import { stringify } from 'qs';
import moment from 'moment';
import { message, notification } from 'antd';

import styles from './RealTime.less';
// import { alarmInfoIcon, sosIcon } from '../imgs/urls';
import { AlarmHandle, MapInfo, PersonInfo, Tabs, VideoPlay } from '../components/Components';
import { AlarmDrawer, LeafletMap, LowPowerDrawer, PersonDrawer, SectionList } from './Components';
import { genTreeList, getAreaChangeMap, getAreaInfo, getPersonInfoItem } from '../utils';

const options = {
  pingTimeout: 30000,
  pongTimeout: 10000,
  reconnectTimeout: 2000,
  pingMsg: 'heartbeat',
};

const TYPE_LABELS = {
  1: '越界',
  2: 'SOS求助',
};
const ALARM_DESC = {
  1: '越界，请及时处理！',
  2: '发起求救信号，请及时支援！',
};

const LOCATION_MESSAGE_TYPE = "1";
const AREA_CHANGE_TYPE = "2";
const WARNING_TYPE = "3";
const AREA_STATUS_TYPE = "4";
const RE_WARNING_TYPE = "5";

export default class RealTime extends PureComponent {
  state = {
    mapBackgroundUrl:undefined,
    alarmId: undefined, // 警报id
    areaId: undefined, // 地图选定的areaId
    beaconId: undefined, // 信标id
    cardId: undefined, // 选中的人员id
    alarmDrawerVisible: false,
    lowPowerDrawerVisible: true,
    personDrawerVisible: false,
    personInfoVisible: false,
    sosHandleVisible: false,
    // alarmMsgVisible: false,
    alarmHandleVisible: false,
    videoVisible: false,
    videoKeyId: '',
  };

  componentDidMount() {
    const {
      dispatch,
      companyId,
    } = this.props;

    this.connectWebSocket();

    dispatch({
      type: 'personPosition/fetchSectionTree',
      payload: { companyId },
      callback: list => {
        this.areaInfo = getAreaInfo(list);
        // console.log(this.areaInfo);
        if (list.length) {
          const root = list[0];
          this.setState({ areaId: root.id, mapBackgroundUrl: JSON.parse(root.mapPhoto).url });
        }
      },
    });
    dispatch({
      type: 'personPosition/fetchInitialPositions',
      payload: { companyId },
    });
    dispatch({
      type: 'personPosition/fetchInitAlarms',
      payload: { companyId, showStatus: 1, pageSize: 0, pageNum: 1, executeStatus: 0 },
    });
    // 获取企业信息
    dispatch({
      type: 'user/fetchCurrent',
    });
  }

  componentWillUnmount() {
    const ws = this.ws;
    ws && ws.close();
  }

  ws = null;
  areaInfo = {};

  connectWebSocket = () => {
    const { companyId } = this.props;
    const { projectKey: env, webscoketHost } = global.PROJECT_CONFIG;
    const params = {
      companyId,
      env: 'dev',
      type: 2,
    };
    const url = `ws://${webscoketHost}/websocket?${stringify(params)}`;

    // 链接webscoket
    const ws = this.ws = new WebsocketHeartbeatJs({ url, ...options });

    ws.onopen = () => {
      console.log('connect success');
      ws.send('heartbeat');
    };

    ws.onmessage = e => {
      // 判断是否是心跳
      if (!e.data || e.data.indexOf('heartbeat') > -1) return;
      try {
        const data = JSON.parse(e.data);
        // console.log(data);
        this.handleWbData(data);
      } catch (error) {
        console.log('error', error);
      }
    };
    ws.onreconnect = () => {
      console.log('reconnecting...');
    };
  };

  setAreaId = areaId => {
    this.setState({ areaId });
  };

  handleWbData = wbData => {
    const { messageType, data } = wbData;
    switch(messageType) {
      case LOCATION_MESSAGE_TYPE:
        this.handlePositions(data);
        break;
      case AREA_CHANGE_TYPE:
        this.handleAreaChange(data);
        break;
      case WARNING_TYPE:
        this.handleAlarms(data);
        break;
      case AREA_STATUS_TYPE:
        this.handleAreaStatusChange(data);
        break;
      case RE_WARNING_TYPE:
        this.removeAlarms(data);
        break;
      default:
        console.log('no msg type');
    }
  };

  handlePositions = data => {
    const { dispatch, personPosition: { positionList } } = this.props;
    const cardIds = data.map(({ cardId }) => cardId);
    const newPositionList = positionList.filter(({ cardId }) => !cardIds.includes(cardId)).concat(data);
    dispatch({ type: 'personPosition/savePositions', payload: newPositionList });
  };

  // 根据websocket的推送改变model中的alarms
  handleAlarms = data => {
    const { dispatch, personPosition: { alarms } } = this.props;
    const newAlarms = alarms.concat(data);
    dispatch({ type: 'personPosition/saveAlarms', payload: newAlarms });
  };

  removeAlarms = data => {
    const { dispatch, personPosition: { alarms } } = this.props;
    const warningIds = data.map(({ warningId }) => warningId);
    const newAlarms = alarms.filter(({ id }) => !warningIds.includes(id));
    dispatch({ type: 'personPosition/saveAlarms', payload: newAlarms });
  };

  handleAreaChange = data => {
    const { dispatch, personPosition: { sectionTree } } = this.props;
    const areaChangeMap = getAreaChangeMap(data);
    // console.log(areaChangeMap);
    const newSectionTree = genTreeList(sectionTree, item => {
      const { id, count } = item;
      const delta = areaChangeMap[id];
      if (delta)
        return { ...item, count: count + delta };
      return item;
    });
    // console.log(newSectionTree);
    dispatch({ type: 'personPosition/saveSectionTree', payload: newSectionTree });
  };

  handleAreaStatusChange = data => {
    const { dispatch, personPosition: { sectionTree } } = this.props;
    const newSectionTree = genTreeList(sectionTree, item => {
      const { id } = item;
      const target = data.find(({ id: areaId }) => areaId === id);
      if (target) {
        const { lackStatus, outstripStatus, overstepStatus, tlongStatus, waitLackStatus } = target;
        return { ...item, status: lackStatus || outstripStatus || overstepStatus || tlongStatus || waitLackStatus ? 2 : 1 };
      }
      return item;
    });
    dispatch({ type: 'personPosition/saveSectionTree', payload: newSectionTree });
  };

  showNotification = type => ({ cardId, uptime, userName, phone }) => {
    notification.warning({
      key: type,
      className: styles.note,
      placement: 'bottomLeft',
      message: `报警提示 ${TYPE_LABELS[type]}`,
      description: (
        <span
          className={styles.desc}
          onClick={e => {
            this.handleAlarmCardClick(type, cardId);
            notification.close(type);
          }}
        >
          {`${moment(uptime).format('HH:mm:ss')} ${userName}【${phone}】${ALARM_DESC[type]}`}
        </span>
      ),
      duration: null,
    });
  };

  handleAlarmCardClick = (type, cardId) => {
    switch (type) {
      case 1:
        this.handleShowAlarmMsg(cardId);
        break;
      case 2:
        this.handleClickPerson(cardId, true);
        break;
      default:
        return;
    }
  };

  handleShowPersonInfo = cardId => {
    this.setState({ cardId, personInfoVisible: true });
  };

  // handleShowAlarmMsg = alarmId => {
  //   this.setState({ alarmMsgVisible: true, alarmId });
  // };

  // handleSOS = id => {
  //   const { dispatch } = this.props;
  //   dispatch({ type: 'personPosition/quitSOS', payload: id });
  //   this.setState({ personInfoVisible: false, sosHandleVisible: true});
  //   notification.close(2);
  // };

  handleShowAlarmHandle = alarmId => {
    this.setState({ alarmHandleVisible: true, alarmId });
  };

  // 处理报警
  handleAlarm = (id, executeStatus, executeDesc)=> {
    const { dispatch, personPosition: { alarms } } = this.props;
    dispatch({
      type: 'personPosition/handleAlarm',
      payload: { id, executeStatus, executeDesc },
      callback: (code, msg) => {
        if (code === 200) {
          message.success(msg);
          const newAlarms = alarms.filter(({ id: alarmId }) => alarmId !== id);
          dispatch({ type: 'personPosition/saveAlarms', payload: newAlarms });
        }
        else
          message.warn(msg);
      },
    });
    this.setState({ alarmHandleVisible: false });
    // notification.close(1);
  };

  handleOpen = prop => {
    this.setState({ [`${prop}Visible`]: true });
  };

  handleClose = prop => {
    this.setState({ [`${prop}Visible`]: false });
  };

  handleShowPersonDrawer = beaconId => {
    this.setState({ beaconId, personDrawerVisible: true });
  };

  handleShowAlarmDrawer = () => {
    this.setState({ alarmDrawerVisible: true });
  };

  handleShowVideo = keyId => {
    if (!keyId) return;
    this.setState({ videoVisible: true, videoKeyId: keyId });
  };

  handleHideVideo = () => {
    this.setState({
      videoVisible: false,
      videoKeyId: '',
    });
  };

  render() {
    const {
      labelIndex,
      companyId,
      personPosition: { sectionTree, positionList, positionAggregation, alarms },
      handleLabelClick,
    } = this.props;
    const {
      alarmId,
      areaId,
      beaconId,
      cardId,
      mapBackgroundUrl,
      alarmDrawerVisible,
      lowPowerDrawerVisible,
      personDrawerVisible,
      personInfoVisible,
      // alarmMsgVisible,
      // sosHandleVisible,
      alarmHandleVisible,
      videoVisible,
      videoKeyId,
    } = this.state;

    // console.log(sectionTree);

    return (
      <div className={styles.container}>
        <div className={styles.left}>
          <Tabs value={labelIndex} handleLabelClick={handleLabelClick} />
          <div className={styles.leftSection}>
            <SectionList data={sectionTree} />
          </div>
          {/* <AlarmView
            data={alarmCards}
            className={styles.leftBottom}
            onClick={this.handleAlarmCardClick}
            handleShowVideo={this.handleShowVideo}
          /> */}
        </div>
        <div className={styles.right}>
          <LeafletMap
            url={mapBackgroundUrl}
            areaId={areaId}
            areaInfo={this.areaInfo}
            sectionTree={sectionTree}
            aggregation={positionAggregation}
            setAreaId={this.setAreaId}
            handleShowPersonInfo={this.handleShowPersonInfo}
            handleShowPersonDrawer={this.handleShowPersonDrawer}
          />
          <MapInfo
            alarms={alarms}
            positionList={positionList}
            handleShowAlarmHandle={this.handleShowAlarmHandle}
            handleShowAlarmDrawer={this.handleShowAlarmDrawer}
          />
          <PersonInfo
            visible={personInfoVisible}
            companyId={companyId}
            alarms={alarms}
            personItem={getPersonInfoItem(cardId, positionList)}
            handleShowAlarmHandle={this.handleShowAlarmHandle}
            handleClose={this.handleClose}
          />
          {/* <AlarmMsg
            visible={alarmMsgVisible}
            // data={getOverstepItem(overstepCardId, overstepList)}
            handleAlarm={this.handleAlarm}
            handleClose={() => this.handleClose('alarmMsg')}
          /> */}
          {/* <AlarmHandle
            title="SOS报警处理"
            visible={sosHandleVisible}
            prefix={
              <span className={styles.sos} style={{ backgroundImage: `url(${sosIcon})` }} />
            }
            handleSubmit={() => this.handleClose('sosHandle')}
            handleClose={() => this.handleClose('sosHandle')}
          /> */}
          <AlarmHandle
            alarmId={alarmId}
            alarms={alarms}
            visible={alarmHandleVisible}
            handleAlarm={this.handleAlarm}
            handleClose={this.handleClose}
          />
        </div>
        <AlarmDrawer
          visible={alarmDrawerVisible}
          data={alarms}
          handleShowAlarmHandle={this.handleShowAlarmHandle}
          handleClose={this.handleClose}
        />
        <LowPowerDrawer
          visible={lowPowerDrawerVisible}
          positionList={positionList}
          handleShowPersonInfo={this.handleShowPersonInfo}
          handleClose={this.handleClose}
        />
        <PersonDrawer
          visible={personDrawerVisible}
          beaconId={beaconId}
          aggregation={positionAggregation}
          handleShowPersonInfo={this.handleShowPersonInfo}
          handleClose={this.handleClose}
        />
        <VideoPlay
          visible={videoVisible}
          showList={false}
          videoList={[]}
          keyId={videoKeyId}
          handleVideoClose={this.handleHideVideo}
        />
      </div>
    );
  }
}
