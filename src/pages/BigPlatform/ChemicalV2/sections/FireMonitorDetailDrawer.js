import React, { PureComponent, Fragment } from 'react';
import { Icon, Row, Col } from 'antd';
import moment from 'moment';
import DrawerContainer from '@/pages/BigPlatform/NewUnitFireControl/components/DrawerContainer';
import styles from './FireMonitorDetailDrawer.less';
import SignalAnime from '@/pages/BigPlatform/Monitor/components/SignalAnime';
import fireHost from '@/pages/BigPlatform/NewUnitFireControl/imgs/fire-host.png';
import iconVideo from '../imgs/icon-video.png';

const NO_DATA = '暂无数据';

const fireData = [
  { label: '火警点位(个)：', value: 'fire_state', color: '#D94245' },
  { label: '故障点位(个)：', value: 'fault_state', color: '#F2BC71' },
  { label: '联动点位(个)：', value: 'start_state', color: '#fff' },
  { label: '监管点位(个)：', value: 'supervise_state', color: '#fff' },
  { label: '屏蔽点位(个)：', value: 'shield_state', color: '#fff' },
  { label: '反馈点位(个)：', value: 'feedback_state', color: '#fff' },
];

export default class FireMonitorDetailDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { visible, onClose, fireDetail, handleShowVideo } = this.props;
    const { installLocation, deviceCode = '', pointCountMap = {}, videoList, id } = fireDetail;
    const pointCount = pointCountMap || {};

    return (
      <DrawerContainer
        title={<div className={styles.titleWrapper}>消防主机监测</div>}
        visible={visible}
        onClose={onClose}
        width={535}
        destroyOnClose={true}
        zIndex={1225}
        left={
          <div className={styles.container}>
            <div className={styles.item}>
              <div className={styles.wrapper}>
                <div className={styles.name}>
                  <span className={styles.label}>主机编号：</span>
                  {deviceCode.toString()}
                  <div className={styles.iconsWrapper}>
                    {videoList &&
                      videoList.length > 0 && (
                        <span
                          className={styles.icon}
                          style={{
                            background: `url(${iconVideo}) center center / 70% auto no-repeat`,
                          }}
                          onClick={() => handleShowVideo(videoList)}
                        />
                      )}
                  </div>
                </div>
                <div>
                  <span className={styles.locIcon} style={{ marginRight: '5px' }}>
                    <Icon type="environment" />
                  </span>
                  {installLocation || '暂无位置数据'}
                </div>
              </div>

              <div className={styles.wrapper}>
                <div className={styles.fireWrapper}>
                  <div
                    className={styles.fireHostImg}
                    style={{
                      background: `url(${fireHost}) center center / auto 75% no-repeat`,
                    }}
                  >
                    <div className={styles.anime}>
                      <SignalAnime />
                    </div>
                  </div>
                  <div className={styles.fireData}>
                    <Row gutter={5}>
                      {fireData.map((fire, index) => {
                        const { label, value, color } = fire;
                        return (
                          <Col key={index} span={12} className={styles.fireLine}>
                            <span className={styles.label}>{label}</span>
                            <span className={styles.fireIcon} style={{ color }}>
                              {pointCount[value] || 0}
                            </span>
                          </Col>
                        );
                      })}
                    </Row>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      />
    );
  }
}
