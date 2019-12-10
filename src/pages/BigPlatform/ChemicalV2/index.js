import React, { PureComponent } from 'react';
import { Row, Col, Icon, Badge, notification } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import BigPlatformLayout from '@/layouts/BigPlatformLayout';
import headerBg from '@/assets/new-header-bg.png';
import bgImg from '@/pages/BigPlatform/Chemical/imgs/bg.png';
import menuIcon from './imgs/menu-icon.png';
import styles from './index.less';
import { RiskPointDrawer } from '@/pages/BigPlatform/Safety/Company3/components';
import NewVideoPlay from '@/pages/BigPlatform/NewFireControl/section/NewVideoPlay';
import ImagePreview from '@/jingan-components/ImagePreview';
import { VideoList, MonitorList } from './utils';
import iconFire from '@/assets/icon-fire-msg.png';
import iconFault from '@/assets/icon-fault-msg.png';
import iconAlarm from '@/assets/icon-alarm.png';

import {
  Risk,
  KeyPoints,
  SafetyOfficerDrawer,
  Emergency,
  Remind,
  Tips,
  CompanyInfo,
  StorageAreaDrawer,
  MonitorDrawer,
  Map,
  DangerAreaDrawer,
  SpecialEquipmentDrawer,
  CurrentHiddenDanger,
  MonitorDetailDrawer,
  Messages,
} from './sections/Components';

const HEADER_STYLE = {
  top: 0,
  left: 0,
  width: '100%',
  fontSize: 16,
  zIndex: 99,
  backgroundImage: `url(${headerBg})`,
  backgroundSize: '100% 100%',
};

const CONTENT_STYLE = { position: 'relative', height: '90.37037%', zIndex: 0 };

const msgInfo = [
  {
    title: '火警提示',
    icon: iconFire,
    color: '#f83329',
    body: '发生报警，',
    bottom: '情况危急，请立即处理！',
    animation: styles.redShadow,
    types: [7, 38],
  },
  {
    title: '故障提示',
    icon: iconFault,
    color: '#f4710f',
    body: '发生故障，',
    bottom: '请及时维修！',
    animation: styles.orangeShadow,
    types: [9, 40],
  },
  {
    title: '报警提示',
    icon: iconAlarm,
    color: '#f83329',
    body: '发生报警，',
    bottom: '情况危急，请立即处理！',
    animation: styles.redShadow,
    types: [32, 36, 39],
  },
];
notification.config({
  placement: 'bottomRight',
  duration: 30,
  bottom: 6,
});

@connect(({ unitSafety, bigPlatform }) => ({ unitSafety, bigPlatform }))
export default class Chemical extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      riskPointDrawerVisible: false,
      riskPointType: {},
      dangerAreaDrawerVisible: false,
      storageAreaDrawerVisible: false,
      safetyOfficerDrawerVisible: false,
      specialEquipmentDrawerVisible: false,
      videoVisible: false,
      images: null,
      videoList: [],
      currentHiddenDangerDrawerVisible: false,
      monitorDrawerVisible: false,
      monitorType: 0,
      monitorDetailDrawerVisible: false,
      monitorData: {},
      msgVisible: false,
    };
  }

  componentDidMount() {
    this.fetchPoints();
    this.fetchHiddenDangerList();
  }

  fetchPoints = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'unitSafety/fetchPoints', payload: { companyId: 'DccBRhlrSiu9gMV7fmvizw' } });
  };

  fetchHiddenDangerList = pageNum => {
    const { dispatch } = this.props;
    dispatch({
      type: 'bigPlatform/fetchHiddenDangerListForPage',
      payload: {
        company_id: 'DccBRhlrSiu9gMV7fmvizw',
        // businessType: 2,
        // status: hdStatus,
        pageNum,
        pageSize: 10,
      },
    });
  };

  handleDrawerVisibleChange = (name, rest) => {
    const stateName = `${name}DrawerVisible`;
    this.setState(state => ({
      [stateName]: !state[stateName],
      ...rest,
    }));
  };

  handleParentChange = newState => {
    this.setState({ ...newState });
  };

  handleClickMenu = () => {
    router.push('/company-workbench/view');
  };

  /**
   * 设置抽屉是否显示
   * @param {string} drawerName 抽屉名称
   * @param {object} props 其他参数
   */
  setDrawerVisible = (drawerName, props, callback) => {
    const fullName = `${drawerName}DrawerVisible`;
    this.setState(({ [fullName]: visible }) => ({ [fullName]: !visible, ...props }));
    callback && callback(this.props);
  };

  handleShowImg = images => {
    this.setState({ images });
  };

  handleCloseImg = () => {
    this.setState({ images: null });
  };

  handleShowVideo = () => {
    this.setState({ videoList: VideoList, videoVisible: true });
  };

  handleParentChange = newState => {
    this.setState({ ...newState });
  };

  handleClickNotification = () => {
    const style = {
      boxShadow: `0px 0px 20px #f83329`,
    };
    const styleAnimation = {
      ...style,
      animation: `${styles.redShadow} 2s linear 0s infinite alternate`,
    };
    const options = {
      key: 'messageId',
      className: styles.notification,
      message: this.renderNotificationTitle(),
      description: this.renderNotificationMsg(),
      style: { ...style, width: screen.availWidth / 5 },
      // style: { ...style, width: '24%' },
    };
    notification.open({
      ...options,
    });

    setTimeout(() => {
      // 解决加入animation覆盖notification自身显示动效时长问题
      notification.open({
        ...options,
        style: { ...styleAnimation, width: screen.availWidth / 5 },
        onClose: () => {
          notification.open({
            ...options,
          });
          setTimeout(() => {
            notification.close('messageId');
          }, 200);
        },
      });
    }, 800);
  };

  renderNotificationTitle = item => {
    const msgItem = msgInfo[2];
    return (
      <div className={styles.notificationTitle} style={{ color: msgItem.color }}>
        <span className={styles.iconFire}>
          <img src={msgItem.icon} alt="fire" />
        </span>
        {msgItem.title}
      </div>
    );
  };

  renderNotificationMsg = () => {
    return (
      <div
        className={styles.notificationBody}
        onClick={() =>
          this.setDrawerVisible('monitorDetail', { monitorType: 2, monitorData: MonitorList[2][0] })
        }
      >
        <div>
          <span className={styles.time}>刚刚</span>{' '}
          {/* <span className={styles.time}>{moment(addTime).format('YYYY-MM-DD HH:mm')}</span>{' '} */}
          {/* <span className={styles.time}>{addTimeStr}</span>{' '} */}
          <span className={styles.address}>{'储罐监测发生报警'}</span>
        </div>
        <div style={{ color: '#f83329' }}>温度为68℃，超过预警值8℃</div>
        <div>监测设备：储罐监测设备</div>
        <div>区域位置：储罐监测点A</div>
      </div>
    );
  };

  /**
   * 渲染
   */
  render() {
    const {
      unitSafety: { points },
      bigPlatform: { hiddenDangerList },
    } = this.props;
    const {
      riskPointDrawerVisible,
      riskPointType,
      dangerAreaDrawerVisible,
      storageAreaDrawerVisible,
      safetyOfficerDrawerVisible,
      specialEquipmentDrawerVisible,
      videoVisible,
      videoList,
      images,
      currentHiddenDangerDrawerVisible,
      monitorDrawerVisible,
      monitorType,
      monitorDetailDrawerVisible,
      monitorData,
      msgVisible,
    } = this.state;
    return (
      <BigPlatformLayout
        title="五位一体信息化管理平台"
        extra={'无锡市'}
        style={{
          background: `url(${bgImg}) no-repeat center`,
          backgroundSize: '100% 100%',
        }}
        headerStyle={HEADER_STYLE}
        titleStyle={{ fontSize: 46 }}
        contentStyle={CONTENT_STYLE}
        other={
          <div
            className={styles.menuBtn}
            style={{ background: `url(${menuIcon}) center center / 100% 100% no-repeat` }}
            onClick={this.handleClickMenu}
          />
        }
      >
        <Tips />
        <div className={styles.container}>
          <Row gutter={15} className={styles.height100}>
            <Col span={6} className={styles.height100}>
              <div className={styles.leftTop}>
                <CompanyInfo handleClickCount={this.setDrawerVisible} />
              </div>

              <div className={styles.leftMiddle}>
                <Remind />
              </div>

              <div className={styles.leftBottom}>
                <KeyPoints setDrawerVisible={this.setDrawerVisible} />
              </div>
            </Col>

            <Col span={18} className={styles.height100}>
              <div className={styles.right}>
                <Map setDrawerVisible={this.setDrawerVisible} showVideo={this.handleShowVideo} />

                {msgVisible ? (
                  <Messages
                    setDrawerVisible={this.setDrawerVisible}
                    handleParentChange={this.handleParentChange}
                  />
                ) : (
                  <div className={styles.msgContainer}>
                    {/* <Badge count={3}> */}
                    <Icon
                      type="message"
                      className={styles.msgIcon}
                      onClick={() => this.setState({ msgVisible: true })}
                    />
                    {/* </Badge> */}
                  </div>
                )}

                <div className={styles.fadeBtn} onClick={this.handleClickNotification} />
              </div>
            </Col>
          </Row>
        </div>

        {/* 风险点抽屉 */}
        <RiskPointDrawer
          visible={riskPointDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('riskPoint');
          }}
          data={points}
          riskPointType={riskPointType}
          zIndex={1066}
        />

        {/* 当前隐患抽屉 */}
        <CurrentHiddenDanger
          visible={currentHiddenDangerDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('currentHiddenDanger');
          }}
          hiddenDangerList={hiddenDangerList}
        />

        <DangerAreaDrawer
          visible={dangerAreaDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('dangerArea');
          }}
          setDrawerVisible={this.setDrawerVisible}
          handleShowImg={this.handleShowImg}
          handleShowVideo={this.handleShowVideo}
        />

        <StorageAreaDrawer
          visible={storageAreaDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('storageArea');
          }}
        />

        {/* 安全人员抽屉 */}
        <SafetyOfficerDrawer
          visible={safetyOfficerDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('safetyOfficer');
          }}
        />

        {/* 特种设备抽屉 */}
        <SpecialEquipmentDrawer
          visible={specialEquipmentDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('specialEquipment');
          }}
        />

        <NewVideoPlay
          showList={false}
          videoList={videoList}
          visible={videoVisible}
          keyId={videoList.length > 0 ? videoList[0].key_id : undefined} // keyId
          handleVideoClose={() => this.setState({ videoVisible: false })}
          isTree={false}
        />

        <MonitorDrawer
          visible={monitorDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('monitor');
          }}
          type={monitorType}
          setDrawerVisible={this.setDrawerVisible}
        />

        <MonitorDetailDrawer
          visible={monitorDetailDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('monitorDetail');
          }}
          type={monitorType}
          monitorData={monitorData}
          handleShowVideo={this.handleShowVideo}
        />

        <ImagePreview images={images} onClose={this.handleCloseImg} />
      </BigPlatformLayout>
    );
  }
}
