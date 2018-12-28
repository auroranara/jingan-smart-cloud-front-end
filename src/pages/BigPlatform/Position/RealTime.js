import React, { PureComponent } from 'react';
// import pathToRegexp from 'path-to-regexp';
import BigPlatformLayout from '@/layouts/BigPlatformLayout';
import WebsocketHeartbeatJs from '@/utils/heartbeat';
import RealTimeMonitor from './components/RealTimeMonitor';
import AlarmView from './components/AlarmView';
import { stringify } from 'qs';
import moment from 'moment';
import { notification } from 'antd';
import { connect } from 'dva';

import styles from './RealTime.less';
import sosIcon from './imgs/sos.png';
import alarmInfoIcon from './imgs/alarmInfo.png';
import { Map, Info, PersonInfo, AlarmMsg, AlarmHandle, VideoPlay } from './components/Components';
import { handlePositions, handleInitialInfo, handlePosInfo, getAlarmList, getSOSItem, getOverstepItem } from './utils';

const options = {
  pingTimeout: 30000,
  pongTimeout: 10000,
  reconnectTimeout: 2000,
  pingMsg: 'heartbeat',
};
const COMPANY_ID = 'DccBRhlrSiu9gMV7fmvizw';

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

const INFO_DATA = {
  cardId: '1',
  userName: "波波安",
  phone: "13270801232",
  cardCode: "276",
  department: "管理部",
  areaName: "大区域",
};

// const ALARM_MSG = {
//   cardId: '1',
//   section: "消控室",
//   type: "越界",
//   time: "2018-12-22 10:30:00",
// };

@connect(({ personPosition }) => ({ personPosition }))
export default class WbTest extends PureComponent {
  state = {
    isSOS: false,
    positions: [],
    posInfo: [],
    sosCardId: '',
    overstepCardId: '',
    sosList: [],
    overstepList: [],
    personInfoVisible: false,
    sosHandleVisible: false,
    alarmMsgVisible: false,
    alarmHandleVisible: false,
    videoVisible: false,
  };

  componentDidMount() {
    // const { projectKey: env, webscoketHost } = global.PROJECT_CONFIG;
    const { dispatch } = this.props;
    const params = {
      companyId: COMPANY_ID,
      env: 'dev',
      type: 2,
    };
    // const url = `ws://${webscoketHost}/websocket?${stringify(params)}`;
    const url = `ws://192.168.10.19:10028/websocket?${stringify(params)}`;

    // 链接webscoket
    const ws = new WebsocketHeartbeatJs({ url, ...options });
    this.ws = ws;
    ws.onopen = () => {
      console.log('connect success');
      ws.send('heartbeat');
    };

    // console.log(ws);
    if (!ws) return;
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
          // this.sosList = getAlarmList(this.sosList, data, 'sos', this.showNotification(2));
          // this.overstepList = getAlarmList(this.overstepList, data, 'overstep', this.showNotification(1));
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
      payload: { companyId: COMPANY_ID },
      callback: (data=[]) => {
        this.setState({ positions: data, posInfo: handleInitialInfo(data) });
      },
    });

    // TYPES.forEach((t, i) => {
    //   setTimeout(() => notification.warning({
    //     // key: id,
    //     className: styles.note,
    //     placement: 'bottomLeft',
    //     message: `报警提示 ${TYPE_LABELS[t]}`,
    //     description: (
    //       <span
    //         className={styles.desc}
    //         onClick={e => {
    //           this.handleAlarmCardClick(t);
    //           // notification.close(id);
    //         }}
    //       >
    //         {`${moment().format('HH:mm:ss')} 张三【13025142568】发起求救信号，请及时支援！`}
    //       </span>
    //     ),
    //     duration: null,
    //   }), i * 500);
    // });
  }

  // componentWillUnmount() {
  //   const ws = this.ws;
  //   ws && ws.close();
  // }

  ws = null;
  // sosList = [];
  // overstepList = [];

  showNotification = type => ({ cardId, uptime, userName, phone=PHONE }) => {
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
    })
  };

  handleAlarmCardClick = (type, cardId) => {
    switch(type) {
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

  handleClickPerson = (cardId, isSOS) => {
    this.setState({ personInfoVisible: true, sosCardId: cardId, isSOS });
  };

  handleShowAlarmMsg = cardId => {
    this.setState({ alarmMsgVisible: true, overstepCardId: cardId });
  };

  handleSOS = (id) => {
    const { dispatch } = this.props;
    dispatch({ type: 'personPosition/quitSOS', payload: id });
    this.setState({ personInfoVisible: false, sosHandleVisible: true, sosList: [] });
    notification.close(2);
    // this.sosList = [];
  };

  handleAlarm = (id) => {
    const { dispatch } = this.props;
    dispatch({ type: 'personPosition/quitOverstep', payload: id });
    this.setState({ alarmMsgVisible: false, alarmHandleVisible: true, overstepList: [] });
    notification.close(1);
    // this.overstepList = [];
  };

  handleClose = prop => {
    this.setState({ [`${prop}Visible`]: false });
  };

  handleShowVideo = keyId => {
    this.setState({ videoVisible: true });
  };

  handleHideVideo = () => {
    this.setState({
      videoVisible: false,
      // videoKeyId: undefined,
    });
  };

  render() {
    const {
      isSOS,
      positions,
      posInfo,
      sosCardId,
      overstepCardId,
      sosList,
      overstepList,
      personInfoVisible,
      sosHandleVisible,
      alarmMsgVisible,
      alarmHandleVisible,
      videoVisible,
    } = this.state;

    // const positions = [
    //   { xarea: '20%', yarea: '60%', isSOS: true },
    //   { xarea: '30%', yarea: '60%', isSOS: false },
    // ]

    return (
      <BigPlatformLayout
        title="晶安人员定位监控系统"
        extra="无锡晶安科技有限公司"
        headerStyle={{ fontSize: 16 }}
        titleStyle={{ fontSize: 46 }}
        style={{
          backgroundImage:
            'url(http://data.jingan-china.cn/v2/big-platform/fire-control/com/new/bg2.png)',
        }}
      >
        <div className={styles.container}>
          <div className={styles.left}>
            {/* 实时监控 */}
            <RealTimeMonitor className={styles.leftTop} />
            {/* 报警查看 */}
            <AlarmView
              className={styles.leftBottom}
              onClick={this.handleAlarmCardClick}
              handleShowVideo={this.handleShowVideo}
            />
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
              isSOS={isSOS}
              visible={personInfoVisible}
              // data={getSOSItem(sosCardId, this.sosList)}
              data={INFO_DATA}
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
              prefix={<span className={styles.sos} style={{ backgroundImage: `url(${sosIcon})` }} />}
              handleSubmit={() => this.handleClose('sosHandle')}
              handleClose={() => this.handleClose('sosHandle')}
            />
            <AlarmHandle
              type={1}
              title="报警处理"
              visible={alarmHandleVisible}
              prefix={<span className={styles.alarmInfo} style={{ backgroundImage: `url(${alarmInfoIcon})` }} />}
              handleSubmit={() => this.handleClose('alarmHandle')}
              handleClose={() => this.handleClose('alarmHandle')}
            />
          </div>
          <VideoPlay
            visible={videoVisible}
            showList={false}
            videoList={[]}
            keyId=""
            handleVideoClose={this.handleHideVideo}
          />
        </div>
      </BigPlatformLayout>
    );
  }
}
