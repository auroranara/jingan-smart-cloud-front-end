import React, { PureComponent } from 'react';
import WebsocketHeartbeatJs from '@/utils/heartbeat';
import AlarmView from './components/AlarmView';
import { stringify } from 'qs';
import moment from 'moment';
import { notification } from 'antd';
import { connect } from 'dva';

import BigPlatformLayout from '@/layouts/BigPlatformLayout';
import styles from './index.less';
import sosIcon from './imgs/sos.png';
import alarmInfoIcon from './imgs/alarmInfo.png';
import { AlarmHandle, AlarmMsg, Info, Map, PersonInfo, Tabs, VideoPlay } from './components/Components';
import { SectionList } from './sections/Components';
import {
  handlePositions,
  handlePosInfo,
  getAlarmList,
  getPersonInfoItem,
  getOverstepItem,
  getAlarmCards,
  getAreaId,
} from './utils';

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

@connect(({ personPosition, user }) => ({ personPosition, user }))
export default class WbTest extends PureComponent {
  state = {
    labelIndex: 0,

    positions: [], // 地图上的显示的所有点的集合
    posInfo: [], // Info组件中传入的值，记录区域变化
    sosCardId: '',
    overstepCardId: '',
    sosList: [],
    overstepList: [],
    personInfoVisible: false,
    personInfoSOSVisible: false,
    sosHandleVisible: false,
    alarmMsgVisible: false,
    alarmHandleVisible: false,
    videoVisible: false,
    videoKeyId: '',
  };

  componentDidMount() {
    const { projectKey: env, webscoketHost } = global.PROJECT_CONFIG;
    const {
      dispatch,
      match: {
        params: { companyId },
      },
    } = this.props;
    const params = {
      // companyId: COMPANY_ID,
      companyId,
      env,
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
        if (Array.isArray(data)) {
          this.setState(({ positions, posInfo, sosList, overstepList }) => ({
            positions: handlePositions(positions, data),
            posInfo: handlePosInfo(posInfo, data),
            sosList: getAlarmList(sosList, data, 'sos', this.showNotification(2)),
            overstepList: getAlarmList(overstepList, data, 'overstep', this.showNotification(1)),
          }));
          const areaId = getAreaId(data);
          if (areaId && areaId !== this.lastAreaId) this.handleShowVideo(VIDEO_KEY_IDS[areaId]);
          this.lastAreaId = areaId;
        }
      } catch (error) {
        console.log('error', error);
      }

      // console.log(`onmessage: ${e.data}`);
    };
    ws.onreconnect = () => {
      console.log('reconnecting...');
    };

    dispatch({
      type: 'personPosition/fetchInitialPositions',
      payload: { companyId },
      callback: (data = []) => {
        this.setState({ positions: data });
      },
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
  lastAreaId = ''; // 上次发生警报区域

  handleLabelClick = i => {
    this.setState({ labelIndex: i });
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
    // 注意这里额外引了一个model
    const {
      match: {
        params: { companyId },
      },
      user: {
        currentUser: { companyName },
      },
    } = this.props;
    const {
      labelIndex,

      positions,
      posInfo,
      infoCardId,
      overstepCardId,
      sosList,
      overstepList,
      personInfoVisible,
      sosHandleVisible,
      alarmMsgVisible,
      alarmHandleVisible,
      videoVisible,
      videoKeyId,
    } = this.state;

    const alarmCards = getAlarmCards([...sosList, ...overstepList]);

    const sectionInfo = [
      {
        id: 1,
        areaName: '演示区域',
        count: 1,
        status: alarmCards.length ? 2 : 1,
        indentLevel: 0,
        children: [
          {
            id: 2,
            areaName: '消控室',
            count: 1,
            status: overstepList.length ? 2 : 1,
            indentLevel: 1,
          },
          {
            id: 3,
            areaName: '活动室',
            count: 0,
            status: 1,
            indentLevel: 1,
          },
          {
            id: 4,
            areaName: '餐厅',
            count: 0,
            status: 1,
            indentLevel: 1,
          },
          {
            id: 5,
            areaName: '实验室',
            count: 0,
            status: 1,
            indentLevel: 1,
          },
        ],
      },
    ];

    return (
      <BigPlatformLayout
        title="晶安人员定位监控系统"
        extra={companyName}
        headerStyle={{ fontSize: 16 }}
        titleStyle={{ fontSize: 46 }}
      >
        <div className={styles.container}>
          <div className={styles.left}>
            <Tabs value={labelIndex} handleLabelClick={this.handleLabelClick} />
            <div className={styles.leftSection}>
              {!labelIndex && <SectionList data={sectionInfo} />}
              {labelIndex === 1 && 1}
              {labelIndex === 2 && 2}
              {labelIndex === 3 && 3}
            </div>
            {/* <AlarmView
              data={alarmCards}
              className={styles.leftBottom}
              onClick={this.handleAlarmCardClick}
              handleShowVideo={this.handleShowVideo}
            /> */}
          </div>
          <div className={styles.right}>
            <Map
              data={positions}
              overstepSections={overstepList.length ? [1] : []}
              quantity={{ sos: sosList.length, alarm: overstepList.length }}
              handleClickPerson={this.handleClickPerson}
              handleAlarmSectionClick={this.handleShowAlarmMsg}
              handleShowVideo={this.handleShowVideo}
            />
            <Info data={posInfo} />
            <PersonInfo
              visible={personInfoVisible}
              data={getPersonInfoItem(infoCardId, positions)}
              companyId={companyId}
              handleSOS={this.handleSOS}
              handleClose={() => this.handleClose('personInfo')}
            />
            <AlarmMsg
              visible={alarmMsgVisible}
              data={getOverstepItem(overstepCardId, overstepList)}
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
      </BigPlatformLayout>
    );
  }
}
