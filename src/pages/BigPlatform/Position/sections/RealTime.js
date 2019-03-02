import React, { PureComponent } from 'react';
import WebsocketHeartbeatJs from '@/utils/heartbeat';
import { stringify } from 'qs';
import moment from 'moment';
import { message, notification } from 'antd';

import styles from './RealTime.less';
import { AlarmHandle, AlarmMsg, MapInfo, PersonInfo, Tabs, VideoPlay } from '../components/Components';
import { AlarmDrawer, LeafletMap, LowPowerDrawer, PersonDrawer, SectionList } from './Components';
import { genTreeList, getAreaChangeMap, getAreaInfo, getPersonInfoItem, getAlarmItem, getUserName } from '../utils';

const options = {
  pingTimeout: 30000,
  pongTimeout: 10000,
  reconnectTimeout: 2000,
  pingMsg: 'heartbeat',
};

const SOS_TYPE = 1;

const LOCATION_MESSAGE_TYPE = "1";
const AREA_CHANGE_TYPE = "2";
const WARNING_TYPE = "3";
const AREA_STATUS_TYPE = "4";
const RE_WARNING_TYPE = "5";

export default class RealTime extends PureComponent {
  state = {
    alarmId: undefined, // 警报id
    areaId: undefined, // 地图选定的areaId
    beaconId: undefined, // 信标id
    cardId: undefined, // 选中的人员id
    mapBackgroundUrl:undefined,
    alarmMsgVisible: false, // 报警信息小弹框
    alarmHandleVisible: false, // 报警处理弹框
    personInfoVisible: false, // 人员信息小弹框
    videoVisible: false, // 视频弹框
    videoKeyId: '',
    alarmDrawerVisible: false, // 报警列表抽屉
    lowPowerDrawerVisible: false, // 低电量报警抽屉
    personDrawerVisible: false, // 人员列表抽屉
    useCardIdHandleAlarm: undefined, // 当sos存在时，又在报警列表找不到时，标记为sos对应的cardId，使用另外一个接口
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
          this.setState({ areaId: root.id, mapBackgroundUrl: root.mapPhoto.url });
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

  // 判定当前页面是否是目标追踪
  isTargetTrack = () => {
    // labelIndex 0 实时监控 1 目标追踪
    const { labelIndex } = this.props;
    return !!labelIndex;
  };

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
    const { selectedCardId } = this.props;
    const { messageType, data } = wbData;
    const isTrack = this.isTargetTrack();
    // console.log(isTrack, selectedCardId);
    switch(messageType) {
      case LOCATION_MESSAGE_TYPE:
        this.handlePositions(data);
        // 当处于目标跟踪标签且选定目标时
        if (isTrack && selectedCardId)
          this.handleAreaAutoChange(data);
        break;
      case AREA_CHANGE_TYPE:
        this.handleAreaChange(data);
        break;
      case WARNING_TYPE:
        this.handleAlarms(data);
        this.showNotifications(data);
        break;
      case AREA_STATUS_TYPE:
        this.handleAreaStatusChange(data);
        break;
      case RE_WARNING_TYPE:
        this.removeAlarms(data);
        data.forEach(({ warningId }) => notification.close(warningId));
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

  handleAreaAutoChange = data => {
    const { selectedCardId } = this.props;
    const changed = data.find(({ cardId }) => cardId === selectedCardId);
    // console.log(changed.areaId);
    if (changed)
      this.setAreaId(changed.areaId);
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
          this.setState({ alarmHandleVisible: false });
          notification.close(id);
        }
        else
          message.warn(msg);
      },
    });
  };

  // 警报列表中没有sos时，调用当前函数处理
  handleSOS = cardId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'personPosition/handleSOS',
      payload: cardId,
      callback(code, msg) {
        message[code === 200 ? 'success' : 'warn'](msg);
      },
    });
  };

  showNotifications = data => {
    data.forEach((alarm, i) => {
      setTimeout(() => {
        this.showNotification(alarm);
      }, i * 100);
    });
  };

  showNotification = alarm => {
    const { id, cardId, type, typeName, cardType, phoneNumber, visitorPhone, warningTime } = alarm;
    const name = getUserName(alarm);
    const phone = +cardType ? visitorPhone : phoneNumber;
    notification.warning({
      key: id,
      className: styles.note,
      placement: 'bottomLeft',
      message: `报警提示 ${typeName}`,
      description: (
        <span
          className={styles.desc}
          onClick={e => {
            this.showPersonInfoOrAlarmMsg(type, id, cardId);
            notification.close(id);
          }}
        >
          {`${moment(warningTime).format('HH:mm')} ${name}【${phone}】越界`}
        </span>
      ),
      duration: null,
    });
  };

  // 点击警报详情时判断是显示人员sos，还是其他报警信息
  showPersonInfoOrAlarmMsg = (type, alarmId, cardId) => {
    const isSOS = +type === SOS_TYPE;
    if (isSOS)
      this.handleShowPersonInfo(cardId);
    else
      this.handleShowAlarmMsg(alarmId);
  };

  handleOpen = prop => {
    this.setState({ [`${prop}Visible`]: true });
  };

  handleClose = prop => {
    this.setState({ [`${prop}Visible`]: false });
  };

  handleShowPersonInfo = cardId => {
    this.setState({ cardId, personInfoVisible: true });
  };

  handleShowAlarmMsg = alarmId => {
    this.setState({ alarmMsgVisible: true, alarmId });
  };

  handleShowAlarmHandle = (alarmId, cardId) => {
    // alarmId不存在时，使用cardId处理，针对的是sos存在于person，而报警列表中没有
    if (!alarmId)
      this.setState({ alarmHandleVisible: true, useCardIdHandleAlarm: cardId });
    else
      this.setState({ alarmHandleVisible: true, alarmId });
  };

  handleHideAlarmHandle = () => {
    this.setState({
      alarmId: undefined,
      useCardIdHandleAlarm: undefined,
      alarmMsgVisible: false,
      personInfoVisible: false,
      alarmHandleVisible: false,
    });
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

  handleTrack = cardId => {
    const { setSelectedCard, handleLabelClick } = this.props;
    setSelectedCard(cardId);
    handleLabelClick(1);
  };

  render() {
    const {
      labelIndex,
      companyId,
      selectedCardId,
      personPosition: { sectionTree, positionList, positionAggregation, alarms },
      handleLabelClick,
    } = this.props;
    const {
      alarmId,
      areaId,
      beaconId,
      cardId,
      mapBackgroundUrl,
      alarmMsgVisible,
      alarmHandleVisible,
      personInfoVisible,
      videoVisible,
      videoKeyId,
      alarmDrawerVisible,
      lowPowerDrawerVisible,
      personDrawerVisible,
      useCardIdHandleAlarm,
    } = this.state;

    // console.log(sectionTree);

    const isTrack = this.isTargetTrack();

    return (
      <div className={styles.container}>
        <div className={styles.left}>
          <Tabs value={labelIndex} handleLabelClick={handleLabelClick} />
          <div className={styles.leftSection}>
            {!labelIndex && <SectionList data={sectionTree} />}
            {!!labelIndex && 'Track'}
          </div>
        </div>
        <div className={styles.right}>
          <LeafletMap
            url={mapBackgroundUrl}
            isTrack={isTrack}
            selectedCardId={selectedCardId}
            areaId={areaId}
            areaInfo={this.areaInfo}
            sectionTree={sectionTree}
            positions={positionList}
            aggregation={positionAggregation}
            setAreaId={this.setAreaId}
            handleShowPersonInfo={this.handleShowPersonInfo}
            handleShowPersonDrawer={this.handleShowPersonDrawer}
          />
          <MapInfo
            alarms={alarms}
            sectionTree={sectionTree}
            positionList={positionList}
            showPersonInfoOrAlarmMsg={this.showPersonInfoOrAlarmMsg}
            handleShowAlarmDrawer={this.handleShowAlarmDrawer}
          />
          <PersonInfo
            visible={personInfoVisible}
            companyId={companyId}
            alarms={alarms}
            personItem={getPersonInfoItem(cardId, positionList)}
            handleTrack={this.handleTrack}
            handleShowAlarmHandle={this.handleShowAlarmHandle}
            handleClose={this.handleClose}
          />
          <AlarmMsg
            visible={alarmMsgVisible}
            data={getAlarmItem(alarmId, alarms)}
            handleShowAlarmHandle={this.handleShowAlarmHandle}
            handleClose={this.handleClose}
          />
          <AlarmHandle
            cardId={useCardIdHandleAlarm}
            alarmId={alarmId}
            alarms={alarms}
            visible={alarmHandleVisible}
            handleAlarm={this.handleAlarm}
            handleSOS={this.handleSOS}
            handleClose={this.handleHideAlarmHandle}
          />
        </div>
        <AlarmDrawer
          visible={alarmDrawerVisible}
          data={alarms}
          showPersonInfoOrAlarmMsg={this.showPersonInfoOrAlarmMsg}
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
