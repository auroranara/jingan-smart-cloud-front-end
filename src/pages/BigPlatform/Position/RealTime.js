import React, { PureComponent } from 'react';
// import pathToRegexp from 'path-to-regexp';
import BigPlatformLayout from '@/layouts/BigPlatformLayout';
import WebsocketHeartbeatJs from '@/utils/heartbeat';
import RealTimeMonitor from './components/RealTimeMonitor';
import AlarmView from './components/AlarmView';
import { stringify } from 'qs';

import styles from './RealTime.less';

const options = {
  pingTimeout: 30000,
  pongTimeout: 10000,
  reconnectTimeout: 2000,
  pingMsg: 'heartbeat',
};

export default class WbTest extends PureComponent {
  state = { x: 200, y: 400 };

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
  }

  render() {
    const { x, y } = this.state;

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
            <div className={styles.outer}>
              <div className={styles.inner}></div>
              <div className={styles.dot} style={{ left: Number.parseFloat(x), bottom: Number.parseFloat(y) }}></div>
            </div>
          </div>
        </div>
      </BigPlatformLayout>
    );
  }
}
