import React, { PureComponent } from 'react';
// import pathToRegexp from 'path-to-regexp';
import BigPlatformLayout from '@/layouts/BigPlatformLayout';
import WebsocketHeartbeatJs from '@/utils/heartbeat';
import RealTimeMonitor from './components/RealTimeMonitor';
import AlarmView from './components/AlarmView';
import { stringify } from 'qs';
import moment from 'moment';
import { notification } from 'antd';

import styles from './RealTime.less';
import sosIcon from './imgs/sos.png';
import alarmInfoIcon from './imgs/alarmInfo.png';
import { Map, Info, PersonInfo, AlarmMsg, AlarmHandle, VideoPlay } from './components/Components';

const options = {
  pingTimeout: 30000,
  pongTimeout: 10000,
  reconnectTimeout: 2000,
  pingMsg: 'heartbeat',
};

export default class WbTest extends PureComponent {
  state = {
    isSOS: false,
    personInfoVisible: false,
    sosHandleVisible: false,
    alarmMsgVisible: false,
    alarmHandleVisible: false,
    videoVisible: false,
  };

  componentDidMount() {
    const { projectKey: env, webscoketHost } = global.PROJECT_CONFIG;
    const params = {
      companyId: 'DccBRhlrSiu9gMV7fmvizw',
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
        this.setState({ x: data[0].xarea, y: data[0].yarea });
      } catch (error) {
        console.log('error', error);
      }

      // console.log(`onmessage: ${e.data}`);
    };
    ws.onreconnect = () => {
      console.log('reconnecting...');
    };

    notification.warning({
      // key: id,
      className: styles.note,
      placement: 'bottomLeft',
      message: '报警提示 SOS求助',
      description: (
        <span
          className={styles.desc}
          onClick={e => {
            this.handleClickPerson(0, true);
            // notification.close(id);
          }}
        >
          {`${moment().format('HH:mm:ss')} 张三【13025142568】发起求救信号，请及时支援！`}
        </span>
      ),
      duration: null,
    });
  }

  handleClickPerson = (i, isSOS) => {
    this.setState({ personInfoVisible: true, isSOS });
  };

  handleSOS = () => {
    this.setState({ personInfoVisible: false, sosHandleVisible: true });
  };

  handleAlarm = () => {
    this.setState({ alarmMsgVisible: false, alarmHandleVisible: true });
  };

  handleClose = prop => {
    this.setState({ [`${prop}Visible`]: false });
  };

  render() {
    const {
      isSOS,
      personInfoVisible,
      sosHandleVisible,
      alarmMsgVisible,
      alarmHandleVisible,
      videoVisible,
    } = this.state;

    const positions = [
      { xarea: '20%', yarea: '60%', isSOS: true },
      { xarea: '20%', yarea: '30%', isSOS: false },
    ]

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
            <AlarmView className={styles.leftBottom} />
          </div>
          <div className={styles.right}>
            <Map
              data={positions}
              handleClickPerson={this.handleClickPerson}
            />
            <Info />
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
          <VideoPlay visible={videoVisible} showList={false} />
        </div>
      </BigPlatformLayout>
    );
  }
}
