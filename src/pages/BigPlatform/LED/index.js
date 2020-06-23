import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { stringify } from 'qs';
import WebsocketHeartbeatJs from '@/utils/heartbeat';

import Scroll  from '../../../components/Scroll';
import styles from './index.less';

const SocketOptions = {
  pingTimeout: 30000,
  pongTimeout: 10000,
  reconnectTimeout: 2000,
  pingMsg: 'heartbeat',
};

const DELAY = 60000 * 10;
const SWITCH_DELAY = 20000;
const YES_OR_NO = ['否', '是'];

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
      height: 0,
      scroll: false,
      displayIndex: 0,
    };
  }

  pollTimer = null;
  swithTimer = null;

  componentDidMount() {
    this.fetchCompanyMsg();
    this.fetchLedData();
    this.myTimer = setInterval(() => {
      this.setCurrentTime();
    }, 1000);
    this.initWebSocket();
    this.fetchSafetyPromise();
    this.pollTimer = setInterval(this.polling, DELAY);
    this.swithTimer = setInterval(this.switchDisplay, SWITCH_DELAY);
  }

  componentWillUnmount() {
    clearInterval(this.pollTimer);
    clearInterval(this.myTimer);
    clearInterval(this.swithTimer);
  }

  polling = () => {
    this.fetchSafetyPromise();
  };

  switchDisplay = () => {
    this.setState(({ displayIndex }) => ({ displayIndex: (displayIndex + 1) % 2 }));
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
        // console.log('e.data', data);
        this.setState({ personData: JSON.parse(data) });
      } catch (error) {
        console.log('error', error);
      }
    };

    ws.onreconnect = () => {
      console.log('reconnecting...');
    };
  };

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
  fetchSafetyPromise = (isInit) => {
    const {
      dispatch,
      match: {
        params: { companyId },
      },
    } = this.props;
    dispatch({
      type: 'bigPlatform/fetchLedPromise',
      payload: { companyId },
    });
  };

  onPromiseRef = dom => {
    // console.log(dom, dom.offsetHeight);
    const outerHeight = document.querySelector('#led-promise').offsetHeight;
    const height = dom.offsetHeight;
    this.setState({ height, scroll: height > outerHeight });
  };

  // 设置当前时间
  setCurrentTime = () => {
    this.setState({
      currentTime: moment().format('YYYY-MM-DD dddd HH:mm:ss'),
    });
  };

  render() {
    const {
      bigPlatform: {
        companyMessage: {
          companyMessage: { companyName },
        },
        ledPromise: { allContent, dutyPerson, createTime },
      },
    } = this.props;
    const { personData, currentTime, displayIndex } = this.state;
    const personList = Array.isArray(personData) ? personData.slice(1) : [];
    const [total, run, stop, checking, levelTwo, levelOne, specialWork, high, limitedSpace, ground, short, breaker, wall, electricity, other, pilot, driving, safe] =
      allContent ? allContent.split(',').map(s => s.trim()) : Array(18).fill(0);

    return (
      <div className={styles.content}>
        <div className={styles.nav}>
          <div className={styles.time}>{currentTime}</div>
          <div className={styles.label}>{companyName}</div>
        </div>
        <div className={styles.sectionsContainer}>
          <div className={styles.sections} style={{ left: `calc(-100% * ${displayIndex})` }}>
            <div className={styles.section}>
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
                <div className={styles.itemExtra}>{dutyPerson}</div>
                <div className={styles.itemExtra}>{moment().format('YYYY-MM-DD')}</div>
              </div>
            </div>
            <div className={styles.section1}>
              <table className={styles.table}>
                <tr>
                  <th colSpan="4">
                    企业状态
                  </th>
                </tr>
                <tr>
                  <td>生产装置{total}套</td>
                  <td>其中运行{run}套</td>
                  <td>停产{stop}套</td>
                  <td>检修{checking}套</td>
                </tr>
                <tr>
                  <td rowSpan="4">特殊作业</td>
                  <td>二级动火{levelTwo}处</td>
                  <td>一级动火{levelOne}处</td>
                  <td>特殊动火{specialWork}处</td>
                </tr>
                <tr>
                  <td>高处作业{high}处</td>
                  <td>受限空间作业{limitedSpace}处</td>
                  <td>动土作业{ground}处</td>
                </tr>
                <tr>
                  <td>短路作业{short}处</td>
                  <td>断路作业{breaker}处</td>
                  <td>盲板抽堵{wall}处</td>
                </tr>
                <tr>
                  <td>临时用电{electricity}处</td>
                  <td colSpan="2">其他作业{other}处</td>
                </tr>
                <tr>
                  <td colSpan="4">是否处于试生产状态：{YES_OR_NO[pilot]}</td>
                </tr>
                <tr>
                  <td colSpan="4">是否处于开车状态：{YES_OR_NO[driving]}</td>
                </tr>
                <tr>
                  <td colSpan="4">是否处于停车状态：{YES_OR_NO[+!+driving]}</td>
                </tr>
                <tr>
                  <td colSpan="4">罐区、仓库等重大危险源是否处于安全状态：{YES_OR_NO[safe]}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
