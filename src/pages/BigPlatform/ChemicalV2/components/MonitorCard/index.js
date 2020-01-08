import { PureComponent } from 'react';
import { Row, Col, Tooltip } from 'antd';
import styles from './index.less';
import classNames from 'classnames';
import Wave from '@/jingan-components/Wave';

import cameraImg from '@/assets/icon-camera.png';
import iconList from '@/pages/BigPlatform/ChemicalV2/imgs/icon-list.png';
import iconChart from '@/pages/BigPlatform/ChemicalV2/imgs/icon-chart.png';

// 储罐监测图片
const iconEmptyTank = 'http://data.jingan-china.cn/v2/chem/chemScreen/icon-tank-empty.png';
// 可燃气体图片
const iconFlamGas = 'http://data.jingan-china.cn/v2/chem/chemScreen/gas.png';
// 有毒气体图片
const iconToxicGas = 'http://data.jingan-china.cn/v2/chem/chemScreen/poison.png';

class MonitorCard extends PureComponent {
  constructor(props) {
    super(props);
    this.container = null;
  }

  getPopupContainer = () => this.container

  renderLabel = ({ label, value, status = null, statusLabel }) => (
    <div className={styles.parameter}>
      <div className={styles.lightBlue}>{label}：</div>
      <span>{value}</span>
      {status === 1 && (<div>状态：<span className={styles.redText}>{statusLabel || '正常'}</span></div>)}
      {status === 0 && (<div>状态：<span className={styles.greenText}>{statusLabel || '报警'}</span></div>)}
    </div>
  )

  renderLabelWithTime = ({ value, label, time, status }) => (
    <div className={styles.labelWidthTime}>
      <div className={styles.parameter}>
        <div className={styles.lightBlue}>{label}：</div>
        <span>{value}</span>
        <div>状态：{status === 1 ? (<span className={styles.redText}>正常</span>) : (<span className={styles.greenText}>报警</span>)}</div>
      </div>
      <div className={styles.time}>更新时间：{time}</div>
    </div>
  )
}

export class StorageCard extends MonitorCard {

  render () {
    return (
      <div className={styles.cardContainer} ref={ref => { this.container = ref }}>
        <p>1号储罐</p>
        <Row className={styles.mb15}>
          <Col className={styles.location} span={12}>
            <span className={styles.label}>监测位置：</span>
            <Tooltip getPopupContainer={this.getPopupContainer} autoAdjustOverflow title={'监测设备的区域位置监测设备的区域位置'}>
              <span className={styles.value}>{'监测设备的区域位置监测设备的区域位置'}</span>
            </Tooltip>
          </Col>
          <Col span={12} className={styles.logoContainer}>
            <img className={styles.fl} src={cameraImg} alt="img" />
            <img className={styles.fr} src={iconChart} alt="img" />
            <img className={classNames(styles.fr, styles.mr10)} src={iconList} alt="img" />
          </Col>
        </Row>
        <div className={styles.content}>
          <div className={styles.imgContainer}>
            <div style={{ background: `url(${iconEmptyTank}) no-repeat center center / 100% 100%` }}>
              <Wave
                frontStyle={{ height: '31.25%', color: 'rgba(178, 237, 255, 0.8)' }}
                backStyle={{ height: '31.25%', color: 'rgba(178, 237, 255, 0.3)' }}
              />
              <div className={styles.number}>
                2号罐
              </div>
            </div>
          </div>
          <div className={styles.flexCenter}>
            <div className={styles.labelContainer}>
              {this.renderLabel({ label: '设计储量（t）', value: 16 })}
              {this.renderLabel({ label: '实时储量（t）', value: 5 })}
              {this.renderLabel({ label: '设计压力（MPa）', value: 0.02 })}
              {this.renderLabelWithTime({ label: '温度（℃）', value: '30', time: '2019-12-3 12:00:00', status: 1 })}
              {this.renderLabelWithTime({ label: '液位（㎝）', value: '23', time: '2019-12-3 12:00:00', status: 1 })}
              {this.renderLabelWithTime({ label: '压力（MPa）', value: '0.15', time: '2019-12-3 12:00:00', status: 0 })}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export class FlamCard extends MonitorCard {

  render () {
    return (
      <div className={styles.cardContainer} ref={ref => { this.container = ref }}>
        <Row className={styles.mb15}>
          <Col className={styles.location} span={12}>
            <span className={styles.label}>监测位置：</span>
            <Tooltip getPopupContainer={this.getPopupContainer} autoAdjustOverflow title={'监测设备的区域位置监测设备的区域位置'}>
              <span className={styles.value}>{'监测设备的区域位置监测设备的区域位置'}</span>
            </Tooltip>
          </Col>
          <Col span={12} className={styles.logoContainer}>
            <img className={styles.fl} src={cameraImg} alt="img" />
            <img className={styles.fr} src={iconChart} alt="img" />
            <img className={classNames(styles.fr, styles.mr10)} src={iconList} alt="img" />
          </Col>
        </Row>
        <div className={styles.content}>
          <div className={styles.bigImgContainer}>
            <div style={{ background: `url(${iconFlamGas}) no-repeat center center / 100% 100%` }}>
              <div className={styles.number}>
                LEL 24%
              </div>
            </div>
          </div>
          <div className={styles.flexCenter}>
            <div className={styles.labelContainer}>
              {this.renderLabel({ label: '编号', value: '004' })}
              {this.renderLabel({ label: '更新时间', value: '2019-12-13 12:00:00' })}
              {this.renderLabel({ label: '浓度（%LEL）', value: 24, status: 0, statusLabel: '预警（≥15）' })}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export class ToxicCard extends MonitorCard {

  render () {
    return (
      <div className={styles.cardContainer} ref={ref => { this.container = ref }}>
        <Row className={styles.mb15}>
          <Col className={styles.location} span={12}>
            <span className={styles.label}>监测位置：</span>
            <Tooltip getPopupContainer={this.getPopupContainer} autoAdjustOverflow title={'监测设备的区域位置监测设备的区域位置'}>
              <span className={styles.value}>{'监测设备的区域位置监测设备的区域位置'}</span>
            </Tooltip>
          </Col>
          <Col span={12} className={styles.logoContainer}>
            <img className={styles.fl} src={cameraImg} alt="img" />
            <img className={styles.fr} src={iconChart} alt="img" />
            <img className={classNames(styles.fr, styles.mr10)} src={iconList} alt="img" />
          </Col>
        </Row>
        <div className={styles.content}>
          <div className={styles.bigImgContainer}>
            <div style={{ background: `url(${iconToxicGas}) no-repeat center center / 100% 100%` }}>
              <div className={styles.number}>
                LEL 24%
              </div>
            </div>
          </div>
          <div className={styles.flexCenter}>
            <div className={styles.labelContainer}>
              {this.renderLabel({ label: '编号', value: '004' })}
              {this.renderLabel({ label: '更新时间', value: '2019-12-13 12:00:00' })}
              {this.renderLabel({ label: '浓度（%LEL）', value: 24, status: 0, statusLabel: '预警（≥15）' })}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
