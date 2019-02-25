import React, { PureComponent } from 'react';
import WebsocketHeartbeatJs from '@/utils/heartbeat';
import { stringify } from 'qs';
import moment from 'moment';
import { notification } from 'antd';

import styles from './RealTime.less';
import { alarmInfoIcon, sosIcon } from '../imgs/urls';
import { AlarmHandle, AlarmMsg, PersonInfo, Tabs, VideoPlay } from '../components/Components';
import { SectionList, LeafletMap } from './Components';
import { genTreeList } from '../utils';

const options = {
  pingTimeout: 30000,
  pongTimeout: 10000,
  reconnectTimeout: 2000,
  pingMsg: 'heartbeat',
};
// areaId 0 大区域 1 消控室
const VIDEO_KEY_IDS = ['250ch11', '250ch10'];

// const TYPES = [1, 2];
const TYPE_LABELS = {
  1: '越界',
  2: 'SOS求助',
};
const ALARM_DESC = {
  1: '越界，请及时处理！',
  2: '发起求救信号，请及时支援！',
};
const PHONE = '13270801232';

const LOCATION_MESSAGE_TYPE = "1";
const AREA_CHANGE_TYPE = "2";
const WARNING_TYPE = "3";
const AREA_STATUS_TYPE = "4";
const RE_WARNING_TYPE = "5";

export default class RealTime extends PureComponent {
  state = {
    areaId: undefined,

    positions: [],
    personInfoVisible: false,
    personInfoSOSVisible: false,
    sosHandleVisible: false,
    alarmMsgVisible: false,
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
        if (list.length)
          this.setState({ areaId: list[0].id });
      },
    });
    dispatch({
      type: 'personPosition/fetchInitialPositions',
      payload: { companyId },
      // callback: (data = []) => {
      //   this.setState({ positions: data });
      // },
    });
    dispatch({
      type: 'personPosition/fetchInitialAlarms',
      payload: { companyId, showStatus: 1 },
    });
    // 获取企业信息
    dispatch({
      type: 'user/fetchCurrent',
    });
  }

  // componentWillUnmount() {
  //   const ws = this.ws;
  //   ws && ws.close();
  // }

  ws = null;

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
    const ws = new WebsocketHeartbeatJs({ url, ...options });
    this.ws = ws;
    ws.onopen = () => {
      console.log('connect success');
      ws.send('heartbeat');
    };

    ws.onmessage = e => {
      // 判断是否是心跳
      if (!e.data || e.data.indexOf('heartbeat') > -1) return;
      try {
        const data = JSON.parse(e.data);
        console.log(data);
        this.handleWbData(data);
      } catch (error) {
        console.log('error', error);
      }

      // console.log(`onmessage: ${e.data}`);
    };
    ws.onreconnect = () => {
      console.log('reconnecting...');
    };
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
    const { dispatch, personPosition: { positions } } = this.props;
    const cardIds = data.map(({ cardId }) => cardId);
    const newPositions = positions.filter(({ cardId }) => !cardIds.includes(cardId)).concat(positions);
    dispatch({ type: 'personPosition/savePositions', payload: newPositions });
  };

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
    const newSectionTree = genTreeList(sectionTree, item => {
      const { id, count } = item;
      const target = data.find(({ areaId }) => areaId === id);
      if (target)
        return { ...item, count: +target.type === 1 ? count + 1 : count - 1 };
      return item;
    });
    dispatch({ type: 'personPosition/saveSectionTree', payload: newSectionTree });
  };

  handleAreaStatusChange = data => {
    const { dispatch, personPosition: { sectionTree } } = this.props;
    const newSectionTree = genTreeList(sectionTree, item => {
      const { id } = item;
      const target = data.find(({ id: areaId }) => areaId === id);
      if (target) {
        const { lackStatus, outstripStatus, overstepStatus, tlongStatus, waitLackStatus } = target;
        return { ...item, status: lackStatus || outstripStatus || overstepStatus || tlongStatus || waitLackStatus ? 0 : 1 };
      }
      return item;
    });
    dispatch({ type: 'personPosition/saveSectionTree', payload: newSectionTree });
  };

  showNotification = type => ({ cardId, uptime, userName, phone = PHONE }) => {
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

  handleClickPerson = cardId => {
    this.setState({ personInfoVisible: true, infoCardId: cardId });
  };

  handleShowAlarmMsg = cardId => {
    this.setState({ alarmMsgVisible: true, overstepCardId: cardId });
  };

  handleSOS = id => {
    const { dispatch } = this.props;
    dispatch({ type: 'personPosition/quitSOS', payload: id });
    this.setState({ personInfoVisible: false, sosHandleVisible: true, sosList: [] });
    notification.close(2);
  };

  handleAlarm = id => {
    const { dispatch } = this.props;
    dispatch({ type: 'personPosition/quitOverstep', payload: id });
    this.setState({ alarmMsgVisible: false, alarmHandleVisible: true, overstepList: [] });
    notification.close(1);
  };

  handleClose = prop => {
    this.setState({ [`${prop}Visible`]: false });
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
      personPosition: { sectionTree },
      handleLabelClick,
    } = this.props;
    const {
      areaId,
      positions,
      personInfoVisible,
      sosHandleVisible,
      alarmMsgVisible,
      alarmHandleVisible,
      videoVisible,
      videoKeyId,
    } = this.state;

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
          <LeafletMap areaId={areaId} />
          <PersonInfo
            visible={personInfoVisible}
            // data={getPersonInfoItem(infoCardId, positions)}
            companyId={companyId}
            handleSOS={this.handleSOS}
            handleClose={() => this.handleClose('personInfo')}
          />
          <AlarmMsg
            visible={alarmMsgVisible}
            // data={getOverstepItem(overstepCardId, overstepList)}
            handleAlarm={this.handleAlarm}
            handleClose={() => this.handleClose('alarmMsg')}
          />
          <AlarmHandle
            title="SOS报警处理"
            visible={sosHandleVisible}
            prefix={
              <span className={styles.sos} style={{ backgroundImage: `url(${sosIcon})` }} />
            }
            handleSubmit={() => this.handleClose('sosHandle')}
            handleClose={() => this.handleClose('sosHandle')}
          />
          <AlarmHandle
            type={1}
            title="报警处理"
            visible={alarmHandleVisible}
            prefix={
              <span
                className={styles.alarmInfo}
                style={{ backgroundImage: `url(${alarmInfoIcon})` }}
              />
            }
            handleSubmit={() => this.handleClose('alarmHandle')}
            handleClose={() => this.handleClose('alarmHandle')}
          />
        </div>
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
