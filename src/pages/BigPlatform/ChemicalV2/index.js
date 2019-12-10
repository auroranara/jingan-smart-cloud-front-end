import React, { PureComponent } from 'react';
import { Row, Col, Icon, Badge } from 'antd';
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
import { VideoList } from './utils';

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
