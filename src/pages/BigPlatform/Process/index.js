import React, { PureComponent } from 'react';
import { connect } from 'dva';
import WebsocketHeartbeatJs from '@/utils/heartbeat';
import { stringify } from 'qs';

import ProcessHead from './components/ProcessHead';
import ProcessBody from './components/ProcessBody';
import styles from './index.less';
import { PROCESSES, VALVES } from './utils';
const SOCKET_OPTIONS = {
  pingTimeout: 30000,
  pongTimeout: 10000,
  reconnectTimeout: 2000,
  pingMsg: 'heartbeat',
};

@connect(({ process, user, loading }) => ({
  process,
  user,
  loading: loading.models.process,
}))
export default class Process extends PureComponent {
  monitorList = [];

  componentDidMount() {
    const {
      dispatch,
      match: { params: { companyId } },
    } = this.props;
    dispatch({
      type: 'process/fetchProcessList',
      payload: { companyId, pageNum: 1, pageSize: 0 },
      callback: list => {
        if (!list.length) return;

        const processId = list[0].id;
        this.getProcessDetail(processId);
        this.getLiveData(processId, list => {
          this.monitorList = list; // 缓存monitorList
          this.initWebSocket(processId);
        });
      },
    });
  }

  getProcessDetail = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'process/fetchProcessDetail',
      payload: { id },
    });
  };

  initWebSocket = (processId) => {
    const {
      match: {
        params: { companyId },
      },
    } = this.props;
    const { projectKey: env, webscoketHost } = global.PROJECT_CONFIG;
    const params = {
      companyId,
      env,
      type: 100,
    };
    const url = `ws://${webscoketHost}/websocket?${stringify(params)}`;

    const ws = new WebsocketHeartbeatJs({ url, ...SOCKET_OPTIONS });
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
        console.log('e.data', data);
        const { beMonitorTargetId } = data;
        if(this.isInMonitorList(beMonitorTargetId))
          this.getLiveData(processId);
      } catch (error) {
        console.log('error', error);
      }
    };

    ws.onreconnect = () => {
      console.log('reconnecting...');
    };
  };

  isInMonitorList = beMonitorTargetId => {
    if (beMonitorTargetId && this.monitorList.some(({ id }) => id === beMonitorTargetId))
      return true;
    return false;
  };

  getLiveData = (processId, callback) => {
    const {
      dispatch,
      match: { params: { companyId } },
    } = this.props;
    dispatch({
      type: 'process/fetchMonitorList',
      payload: { pageNum: 1, pageSize: 0, types: '302,311', companyId, technologyId: processId },
      callback,
    });
  };

  render() {
    const {
      process: { list, detail, monitorList },
    } = this.props;

    return (
      <div className={styles.container}>
        <ProcessHead
          title="重点监管危险化工工艺"
          list={list}
          data={detail}
        />
        <ProcessBody
          processes={PROCESSES}
          valves={VALVES}
          monitorList={monitorList}
        />
      </div>
    );
  }
}
