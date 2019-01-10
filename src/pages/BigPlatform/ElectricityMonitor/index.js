import React, { PureComponent } from 'react';
import { Input, notification, Icon } from 'antd';
import { connect } from 'dva';
import { Map, Marker } from 'react-amap';
import { stringify } from 'qs';
import moment from 'moment';
import BigPlatformLayout from '@/layouts/BigPlatformLayout';
import NewSection from '@/components/NewSection';
import WebsocketHeartbeatJs from '@/utils/heartbeat';
import headerBg from '@/assets/new-header-bg.png';
// 告警信息
import WarningMessage from './WarningMessage';
// 引入样式文件
import styles from './index.less';

const { Search } = Input

// websocket配置
const options = {
  pingTimeout: 30000,
  pongTimeout: 10000,
  reconnectTimeout: 2000,
  pingMsg: 'heartbeat',
};

/**
 * description: 用电监测
 * author:
 * date: 2019年01月08日
 */
@connect(({ electricityMonitor }) => ({
  electricityMonitor,
}))
export default class ElectricityMonitor extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  /**
   * 挂载后
   */
  componentDidMount() {
    const { projectKey: env, webscoketHost } = global.PROJECT_CONFIG;
    const {
      dispatch,
    } = this.props;
    // 获取告警信息列表
    dispatch({
      type: 'electricityMonitor/fetchMessages',
      callback: () => {
        this.showWarningNotification();
      },
    });

    // 获取网格点id
    dispatch({
      type: 'electricityMonitor/fetchCompanyId',
      callback: (companyId) => {
        if (!companyId) {
          return;
        }
        const params = {
          companyId,
          env: 'dev',
          type: 3,
        };
        // const url = `ws://${webscoketHost}/websocket?${stringify(params)}`;
        const url = `ws://192.168.10.19:10036/websocket?${stringify(params)}`;

        // 链接webscoket
        const ws = new WebsocketHeartbeatJs({ url, ...options });

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

          } catch (error) {
            console.log('error', error);
          }
        };

        ws.onreconnect = () => {
          console.log('reconnecting...');
        };
      },
    });
    // 显示提醒框
    this.showWarningNotification({
      addTime: 1547023558026,
      companyName: "无锡晶安智慧科技有限公司",
      location: "2#配电柜",
    });
  }

  /**
   * 更新后
   */
  componentDidUpdate() {

  }

  /**
   * 销毁前
   */
  componentWillUnmount() {

  }

  /**
   * 显示告警通知提醒框
   */
  showWarningNotification = data => {
    const {
      addTime,
      companyName,
      location,
    } = data;
    const options = {
      key: 1,
      duration: null,
      placement: 'bottomLeft',
      className: styles.notification,
      message: (
        <div className={styles.notificationTitle}>
          <Icon type="warning" theme="filled" className={styles.notificationIcon} />
          警情提示
        </div>
      ),
      description: (
        <div className={styles.notificationContent}>
          <div className={styles.notificationText}>
            <div className={styles.notificationTextFirst}>{moment(addTime).format('HH:mm:ss')}</div>
            <div className={styles.notificationTextSecond}>{companyName}</div>
          </div>
          <div className={styles.notificationText}>
            <div className={styles.notificationTextFirst}>{location}</div>
            <div className={styles.notificationTextSecond}>发生报警！</div>
          </div>
        </div>
      ),
    };
    notification.open(options);
    // const { type, messageId } = item;
    // if (type === 5 || type === 6) {
    //   // 5 火警， 6 故障
    //   const msgItem = msgInfo[type.toString()];
    //   const style = {
    //     boxShadow: `0px 0px 20px ${msgItem.color}`,
    //   };
    //   const styleAnimation = {
    //     ...style,
    //     animation: `${msgItem.animation} 2s linear 0s infinite alternate`,
    //   };
    //   const options = {
    //     key: messageId,
    //     className: styles.notification,
    //     message: this.renderNotificationTitle(item),
    //     description: this.renderNotificationMsg(item),
    //     style: this.fireNode ? { ...style, width: this.fireNode.clientWidth - 8 } : { ...style },
    //   };
    //   notification.open({
    //     ...options,
    //   });

    //   setTimeout(() => {
    //     // 解决加入animation覆盖notification自身显示动效时长问题
    //     notification.open({
    //       ...options,
    //       style: this.fireNode
    //         ? { ...styleAnimation, width: this.fireNode.clientWidth - 8 }
    //         : { ...styleAnimation },
    //       onClose: () => {
    //         notification.open({
    //           ...options,
    //         });
    //         setTimeout(() => {
    //           notification.close(messageId);
    //         }, 200);
    //       },
    //     });
    //   }, 800);
    // }
  };

  /**
   * 点击设置按钮
   */
  handleClickSetButton = () => {
    console.log(1);
  }

  /**
   * 渲染
   */
  render() {
    const { electricityMonitor: { messages } } = this.props;

    return (
      <BigPlatformLayout
        title="晶安智慧用电监测平台"
        extra="无锡市"
        style={{ backgroundImage: 'none' }}
        headerStyle={{ position: 'absolute', top: 0, left: 0, width: '100%', fontSize: 16, zIndex: 99, backgroundImage: `url(${headerBg})`, backgroundSize: '100% 100%' }}
        titleStyle={{ fontSize: 46 }}
        contentStyle={{ position: 'relative', height: '100%', zIndex: 0 }}
        settable
        onSet={this.handleClickSetButton}
      >
        {/* 地图 */}
        <Map
          amapkey="665bd904a802559d49a33335f1e4aa0d"
          plugins={['Scale', { name: 'ToolBar', options: { locate: false } }]}
          // center={'无锡'}
          useAMapUI
        >
        </Map>
        {/* 搜索框 */}
        <Search placeholder="单位名称" enterButton="搜索" className={styles.left} style={{ top: 'calc(9.62963% + 24px)' }} />
        {/* 接入单位统计 */}
        <NewSection title="接入单位统计" className={styles.left} style={{ top: 'calc(9.62963% + 68px)', height: '13.611111%' }}>
        123
        </NewSection>
        {/* 实时报警统计 */}
        <NewSection title="实时报警统计" className={styles.left} style={{ top: 'calc(23.24% + 80px)', height: '21.944444%' }}>
        123
        </NewSection>
        {/* 近半年内告警统计 */}
        <NewSection title="近半年内告警统计" className={styles.left} style={{ top: 'calc(45.184444% + 92px)', height: '27.5926%' }}>
        123
        </NewSection>
        {/* 告警信息 */}
        <WarningMessage data={messages} className={styles.right} />
      </BigPlatformLayout>
    );
  }
}
