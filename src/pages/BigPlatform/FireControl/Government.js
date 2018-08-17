import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Col, Row } from 'antd';

import styles from './Government.less';
import FcModule from './FcModule';
import FcSection from './FcSection';
import OverviewSection from './OverviewSection';
import AlarmSection from './AlarmSection';
import SystemSection from './SystemSection';
import bg from './bg.png';

import UnitLookUp from './UnitLookUp';
import UintLookUpBack from './UintLookUpBack';

const HEIGHT_PERCNET = { height: '100%' };
const LOOKING_UP = 'lookingUp';
const OFF_GUARD = 'offGuardWarning';

@connect(({ bigFireControl }) => ({ bigFireControl }))
export default class FireControlBigPlatform extends PureComponent {
  state = {
    isLookUpRotated: false,
    lookUpShow: LOOKING_UP,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'bigFireControl/fetchOvAlarmCounts' });
    dispatch({ type: 'bigFireControl/fetchOvDangerCounts' });
    dispatch({ type: 'bigFireControl/fetchSys' });
    dispatch({ type: 'bigFireControl/fetchAlarm' });
  }

  handleClickLookUp = () => {
    this.setState({ lookUpShow: LOOKING_UP, isLookUpRotated: true });
  };

  handleClickOffGuard = () => {
    this.setState({ lookUpShow: OFF_GUARD, isLookUpRotated: true });
  };

  handleUnitLookUpRotateBack = () => {
    this.setState({ isLookUpRotated: false });
  };

  render() {
    const {
      bigFireControl: { overview, alarm, sys },
      dispatch,
    } = this.props;

    const { isLookUpRotated, lookUpShow } = this.state;

    const handleRotateMethods = {
      handleClickLookUp: this.handleClickLookUp,
      handleClickOffGuard: this.handleClickOffGuard,
    };

    return (
      <Row
        style={{
          height: '100%',
          marginLeft: 0,
          marginRight: 0,
          background: `url(${bg}) center center`,
        }}
        gutter={{ xs: 4, sm: 8, md: 12, lg: 16 }}
      >
        <Col span={6} style={HEIGHT_PERCNET}>
          <FcModule className={styles.overview}>
            <OverviewSection ovData={overview} />
            <FcSection title="辖区概况反面" isBack />
          </FcModule>
          <div className={styles.gutter1} />
          <FcModule className={styles.alarmInfo}>
            <AlarmSection alarmData={alarm} dispatch={dispatch} />
            <FcSection title="警情信息反面" isBack />
          </FcModule>
        </Col>
        <Col span={12} style={HEIGHT_PERCNET}>
          <FcModule className={styles.map}>
            <FcSection title="Map" />
            <FcSection title="Map Reverse" isBack />
          </FcModule>
          <div className={styles.gutter2} />
          <Row className={styles.center}>
            <Col span={12} className={styles.centerLeft}>
              <FcModule style={{ height: '100%' }}>
                <FcSection title="火警趋势" />
                <FcSection title="火警趋势反面" isBack />
              </FcModule>
            </Col>
            <Col span={12} className={styles.centerRight}>
              <FcModule style={{ height: '100%' }}>
                <FcSection title="网格隐患巡查" />
                <FcSection title="网格隐患巡查反面" isBack />
              </FcModule>
            </Col>
          </Row>
        </Col>
        <Col span={6} style={HEIGHT_PERCNET}>
          <FcModule className={styles.inspect} isRotated={isLookUpRotated}>
            <UnitLookUp handleRotateMethods={handleRotateMethods} />
            <UintLookUpBack
              handleRotateBack={this.handleUnitLookUpRotateBack}
              lookUpShow={lookUpShow}
            />
          </FcModule>
          <div className={styles.gutter3} />
          <FcModule className={styles.system}>
            <SystemSection sysData={sys} />
            <FcSection title="系统接入情况反面" isBack />
          </FcModule>
        </Col>
      </Row>
    );
  }
}
