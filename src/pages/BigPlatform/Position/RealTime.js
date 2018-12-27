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
import { handlePositions, handleInitialInfo, handlePosInfo } from './utils';

const options = {
  pingTimeout: 30000,
  pongTimeout: 10000,
  reconnectTimeout: 2000,
  pingMsg: 'heartbeat',
};
const COMPANY_ID = 'DccBRhlrSiu9gMV7fmvizw';

const TYPES = [1, 2];
const TYPE_LABELS = {
  1: '越界',
  2: 'SOS求助',
};

@connect(({ personPosition }) => ({ personPosition }))
export default class WbTest extends PureComponent {
  state = {
    positions: [],
    posInfo: [],
    isSOS: false,
    personInfoVisible: false,
    sosHandleVisible: false,
    alarmMsgVisible: false,
    alarmHandleVisible: false,
    videoVisible: false,
  };

  componentDidMount() {
    const { projectKey: env, webscoketHost } = global.PROJECT_CONFIG;
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
        if (Array.isArray(data))
          this.setState(({ positions, posInfo }) => ({
            positions: handlePositions(positions, data),
            posInfo: handlePosInfo(posInfo, data),
          }));
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

    TYPES.forEach((t, i) => {
      setTimeout(() => notification.warning({
        // key: id,
        className: styles.note,
        placement: 'bottomLeft',
        message: `报警提示 ${TYPE_LABELS[t]}`,
        description: (
          <span
            className={styles.desc}
            onClick={e => {
              this.handleAlarmCardClick(t);
              // notification.close(id);
            }}
          >
            {`${moment().format('HH:mm:ss')} 张三【13025142568】发起求救信号，请及时支援！`}
          </span>
        ),
        duration: null,
      }), i * 500);
    });
  }

  handleAlarmCardClick = (type, data) => {
    switch(type) {
      case 1:
        this.handleShowAlarmMsg();
        break;
      case 2:
        this.handleClickPerson(0, true);
        break;
      default:
        return;
    }
  };

  handleClickPerson = (i, isSOS) => {
    this.setState({ personInfoVisible: true, isSOS });
  };

  handleShowAlarmMsg = () => {
    this.setState({ alarmMsgVisible: true });
  };

  handleSOS = (id) => {
    const { dispatch } = this.props;
    dispatch({ type: 'personPosition/quitSOS', payload: id });
    this.setState({ personInfoVisible: false, sosHandleVisible: true });
  };

  handleAlarm = () => {
    this.setState({ alarmMsgVisible: false, alarmHandleVisible: true });
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
      positions,
      posInfo,
      isSOS,
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
              handleClickPerson={this.handleClickPerson}
              handleAlarmSectionClick={this.handleShowAlarmMsg}
              handleShowVideo={this.handleShowVideo}
            />
            <Info data={posInfo} />
            <PersonInfo
              isSOS={isSOS}
              visible={personInfoVisible}
              name="张三丰"
              phone="13288888888"
              code="0001"
              department="管理部"
              section="5号楼3层办公区"
              handleSOS={() => this.handleSOS()}
              handleClose={() => this.handleClose('personInfo')}
            />
            <AlarmMsg
              visible={alarmMsgVisible}
              section="五号楼3层实验室"
              type="越界"
              time="2018-12-22 10:30:00"
              handleAlarm={() => this.handleAlarm()}
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
