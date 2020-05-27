import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { stringify } from 'qs';
import WebsocketHeartbeatJs from '@/utils/heartbeat';

import Scroll from '../../../components/Scroll';
import styles from './index.less';

const SocketOptions = {
  pingTimeout: 30000,
  pongTimeout: 10000,
  reconnectTimeout: 2000,
  pingMsg: 'heartbeat',
};

// const DELAY = 7200000;

@connect(({ loading, bigPlatform, twoInformManagement }) => ({
  twoInformManagement,
  bigPlatform,
}))
export default class Led extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: '0000-00-00 星期一 00:00:00',
      detailList: [],
      personData: [],
      createTime: '',
    };
  }

  componentDidMount() {
    this.fetchCompanyMsg();
    this.fetchLedData();
    this.myTimer = setInterval(() => {
      this.setCurrentTime();
    }, 1000);
    // 获取Socket
    this.initWebSocket();
    // this.fetchSafetyPromise();
    // 轮询
    // this.pollTimer = setInterval(this.polling, DELAY);
  }

  // 获取统计初始化数据
  fetchLedData = () => {
    const {
      dispatch,
      match: {
        params: { companyId },
      },
    } = this.props;
    dispatch({
      type: 'bigPlatform/fetchLedData',
      payload: {
        companyId,
      },
      callback: res => {
        this.setState({ personData: res });
      },
    });
  };

  initWebSocket = () => {
    const {
      match: {
        params: { companyId },
      },
    } = this.props;
    const { projectKey: env, webscoketHost } = global.PROJECT_CONFIG;
    const params = {
      companyId,
      env,
      type: 200,
    };
    const url = `ws://${webscoketHost}/websocket?${stringify(params)}`;

    // 链接webscoket
    const ws = new WebsocketHeartbeatJs({ url, ...SocketOptions });
    this.ws = ws;

    ws.onopen = () => {
      console.log('connect success');
      ws.send('heartbeat');
    };

    ws.onmessage = e => {
      // 判断是否是心跳
      if (!e.data || e.data.indexOf('heartbeat') > -1) return;
      try {
        const data = e.data;
        console.log('e.data', data);
        this.setState({ personData: JSON.parse(data) });
      } catch (error) {
        console.log('error', error);
      }
    };

    ws.onreconnect = () => {
      console.log('reconnecting...');
    };
  };

  // pollTimer = null;
  // polling = () => {
  //   this.fetchSafetyPromise();
  // };

  // 获取企业名字
  fetchCompanyMsg = () => {
    const {
      dispatch,
      match: {
        params: { companyId },
      },
    } = this.props;
    dispatch({
      type: 'bigPlatform/fetchCompanyMessage',
      payload: {
        company_id: companyId,
      },
    });
  };

  // 获取承诺公告
  fetchSafetyPromise = () => {
    const {
      dispatch,
      match: {
        params: { companyId },
      },
    } = this.props;
    dispatch({
      type: 'twoInformManagement/fetchSafetyPromiseList',
      payload: {
        companyId,
        pageSize: 10,
        pageNum: 1,
      },
      // callback: ({ list }) => {
      //   const [{ allContent, createTime }] = list;
      //   const arrayData = allContent.split(',');
      //   this.setState({
      //     detailList: arrayData,
      //     createTime: createTime,
      //   });
      // },
    });
  };

  // 设置当前时间
  setCurrentTime = () => {
    this.setState({
      currentTime: moment().format('YYYY-MM-DD dddd HH:mm:ss'),
    });
  };

  componentWillUnmount() {
    // clearInterval(this.pollTimer);
    clearInterval(this.myTimer);
  }

  render() {
    const {
      bigPlatform: {
        companyMessage: {
          companyMessage: { companyName },
        },
      },
    } = this.props;
    const { personData, currentTime, createTime } = this.state;

    const personList = Array.isArray(personData) ? personData.slice(1) : [];
    console.log('personList', personList);
    return (
      <div className={styles.content}>
        <div className={styles.nav}>
          <div className={styles.time}>{currentTime}</div>
          <div className={styles.label}>{companyName}</div>
        </div>
        <div className={styles.seaction}>
          <div className={styles.left}>
            <div className={styles.title}>{personData[0]}</div>
            <div className={styles.itemArea}>
              {personList.length ? (
                <Scroll autoScroll autoHide>
                  {personList.length > 0
                    ? personList.map((item, index) => (
                        <div className={styles.item} key={index}>
                          {item}
                        </div>
                      ))
                    : []}
                </Scroll>
              ) : null}
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.title}>安全承诺公告</div>
            <div className={styles.item}>
              今天我公司已经进行了安全风险研判，各项安全风险防控措施落实到位，我承诺所有生产装置处于安全运行状态，罐区、仓库等重大危险源安全风险得到有效控制。
            </div>
            <div className={styles.itemExtra}>负责人：周新</div>
            <div className={styles.itemExtra}>{moment().format('YYYY-MM-DD')}</div>
          </div>
        </div>
      </div>
    );
  }
}
