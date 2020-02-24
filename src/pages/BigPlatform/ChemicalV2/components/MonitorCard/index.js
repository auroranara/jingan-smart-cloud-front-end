import { PureComponent } from 'react';
import { Row, Col, Tooltip } from 'antd';
import styles from './index.less';
import classNames from 'classnames';
import Wave from '@/jingan-components/Wave';
import moment from 'moment';

import cameraImg from '@/assets/icon-camera.png';
import iconList from '@/pages/BigPlatform/ChemicalV2/imgs/icon-list.png';
import iconChart from '@/pages/BigPlatform/ChemicalV2/imgs/icon-chart.png';

// 储罐监测图片
const iconEmptyTank = 'http://data.jingan-china.cn/v2/chem/chemScreen/icon-tank-empty.png';
// 库房图片
const iconReservoir = 'http://data.jingan-china.cn/v2/chem/screen/warehouse.png';
// 可燃气体图片
// const iconFlamGas = 'http://data.jingan-china.cn/v2/chem/chemScreen/gas.png';
// 有毒气体图片
// const iconToxicGas = 'http://data.jingan-china.cn/v2/chem/chemScreen/poison.png';
const defaultFields = {
  code: 'code', // 编号
  location: 'areaLocation', // 位置
  imgUrl: 'equipmentTypeLogoWebUrl', // 图片地址
  capacity: 'capacity',
  monitorParams: 'monitorParams', // 实时监测的数据
  status: 'warnStatus', // 状态
};
// 无数据填充
const EMPTY_FILLING = '-';
const STATUS = ['正常', '预警', '告警'];

class MonitorCard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      videoVisible: false,
      videoKeyId: undefined,
    };
    this.container = null;
  }

  getPopupContainer = () => this.container

  /*
    status 0 绿色 1 红色；
    statusLabel优先使用；
  */
  renderLabel = ({ label, value, status = null, statusLabel, ...res }) => (
    <div {...res} className={styles.parameter}>
      <div className={styles.lightBlue}>{label}：</div>
      <span>{value}</span>
      {status === 0 && (<div>状态：<span className={styles.greenText}>{statusLabel || '正常'}</span></div>)}
      {+status > 0 && (<div>状态：<span className={styles.redText}>{statusLabel || '告警'}</span></div>)}
    </div>
  )

  renderLabelWithTime = ({ value, label, time, status, statusLabel, ...res }) => (
    <div {...res} className={styles.labelWidthTime}>
      <div className={styles.parameter}>
        <div className={styles.lightBlue}>{label}：</div>
        <span>{value}</span>
        {status === 0 && (<div>状态：<span className={styles.greenText}>{statusLabel || '正常'}</span></div>)}
        {+status > 0 && (<div>状态：<span className={styles.redText}>{statusLabel || '告警'}</span></div>)}
      </div>
      <div className={styles.time}>更新时间：{time}</div>
    </div>
  )

  generateFieldValue = (data, field) => typeof (field) === 'function' ? field(data) : data[field]

  /**
  * 跳转到工单详情
  **/
  jumpToAlarmWorkOrder = id => {
    window.open(`${window.publicPath}#/company-iot/alarm-work-order/detail/${id}`);
  }

  /**
   * 跳转到监测趋势
   **/
  jumpToMonitorTrend = id => {
    window.open(`${window.publicPath}#/company-iot/alarm-work-order/monitor-trend/${id}`);
  }

  /**
   * 渲染监测位置
   **/
  renderLocation = ({ location }) => {
    const {
      data: { videoList = [], meList = [] },
      onVideoClick,
    } = this.props;
    const { noFinishWarningProcessId, id } = meList[0] || {};
    return (
      <Row className={styles.mb10}>
        <Col className={styles.location} span={16}>
          <span className={styles.label}>监测位置：</span>
          <Tooltip getPopupContainer={this.getPopupContainer} autoAdjustOverflow title={location}>
            <span className={styles.value}>{location}</span>
          </Tooltip>
        </Col>
        <Col span={8} className={styles.logoContainer}>
          {videoList && videoList.length > 0 && (
            <img
              onClick={() => onVideoClick(videoList)}
              className={styles.fl}
              src={cameraImg}
              alt="img" />
          )}
          {id && (<img onClick={() => this.jumpToMonitorTrend(id)} className={styles.fr} src={iconChart} alt="img" />)}
          {noFinishWarningProcessId && (
            <img
              onClick={() => this.jumpToAlarmWorkOrder(noFinishWarningProcessId)}
              className={classNames(styles.fr, styles.mr10)}
              src={iconList}
              alt="img" />
          )}
        </Col>
      </Row>
    )
  }
}

/**
 * 罐区卡片
 **/
export class TankCard extends MonitorCard {

  render () {
    const {
      data, // 数据源
      // 别名
      fields = defaultFields,
    } = this.props;
    const name = this.generateFieldValue(data, fields.name) || EMPTY_FILLING;// 名称
    const location = this.generateFieldValue(data, fields.location) || EMPTY_FILLING;// 位置
    const capacity = this.generateFieldValue(data, fields.capacity) || EMPTY_FILLING;// 设计储量
    const capacityUnit = this.generateFieldValue(data, fields.capacityUnit) || EMPTY_FILLING;// 设计储量单位
    const pressure = this.generateFieldValue(data, fields.pressure) || EMPTY_FILLING;// 设计压力
    const monitorParams = this.generateFieldValue(data, fields.monitorParams) || [];// 监测参数

    return (
      <div className={styles.cardContainer} ref={ref => { this.container = ref }}>
        <p>{name}</p>
        {this.renderLocation({ location })}
        <div className={styles.content}>
          <div className={styles.imgContainer} style={{ background: `url(${iconEmptyTank}) no-repeat center center / 100% 100%` }}>
            <Wave
              frontStyle={{ height: '31.25%', color: 'rgba(178, 237, 255, 0.8)' }}
              backStyle={{ height: '31.25%', color: 'rgba(178, 237, 255, 0.3)' }}
            />
            <div className={styles.text}>
              {name}
            </div>
          </div>
          <div className={styles.flexCenter}>
            <div className={styles.labelContainer}>
              {this.renderLabel({ label: `设计储量${capacityUnit ? `（${capacityUnit}）` : ''}`, value: capacity })}
              {this.renderLabel({ label: '设计压力（MPa）', value: pressure })}
              {monitorParams.map(({ paramDesc, paramUnit, realValue, status, condition, limitValueStr, dataUpdateTime, linkStatus }, index) => (
                this.renderLabelWithTime({
                  label: `${paramDesc}${paramUnit ? `（${paramUnit}）` : ''}`,
                  value: realValue,
                  time: dataUpdateTime ? moment(dataUpdateTime).format('YYYY-MM-DD HH:mm:ss') : EMPTY_FILLING,
                  status: +linkStatus === -1 ? 0 : status,
                  statusLabel: +linkStatus === -1 ? '正常' : `${STATUS[status]}${condition && limitValueStr ? `（${condition}${limitValueStr}）` : ''}`,
                  key: index,
                })
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

/**
 * 库区卡片
 **/
export class ReservoirAreaCard extends MonitorCard {
  render () {
    const {
      data, // 数据源
      // 别名
      fields = defaultFields,
    } = this.props;
    const name = this.generateFieldValue(data, fields.name) || EMPTY_FILLING;// 名称
    const location = this.generateFieldValue(data, fields.location) || EMPTY_FILLING;// 位置
    const capacity = this.generateFieldValue(data, fields.capacity) || EMPTY_FILLING;// 设计储量
    const monitorParams = this.generateFieldValue(data, fields.monitorParams) || [];// 监测参数
    return (
      <div className={styles.cardContainer} ref={ref => { this.container = ref }}>
        <p>{name}</p>
        {this.renderLocation({ location })}
        <div className={styles.content}>
          <div className={styles.gasImgContainer} style={{ background: `url(${iconReservoir}) no-repeat center center / 100% 100%` }}></div>
          <div className={styles.flexCenter}>
            <div className={styles.labelContainer}>
              {this.renderLabel({ label: '设计储量（t）', value: capacity || EMPTY_FILLING })}
              {monitorParams.map(({ paramDesc, paramUnit, realValue, status, condition, limitValueStr, dataUpdateTime, linkStatus }, index) => (
                this.renderLabelWithTime({
                  label: `${paramDesc}${paramUnit ? `（${paramUnit}）` : ''}`,
                  value: realValue,
                  time: dataUpdateTime ? moment(dataUpdateTime).format('YYYY-MM-DD HH:mm:ss') : EMPTY_FILLING,
                  status: +linkStatus === -1 ? 0 : status,
                  statusLabel: +linkStatus === -1 ? '正常' : `${STATUS[status]}${condition && limitValueStr ? `（${condition}${limitValueStr}）` : ''}`,
                  key: index,
                })
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

/**
 * 气体卡片
 **/
export class GasCard extends MonitorCard {

  render () {
    const {
      data, // 数据源
      // 别名
      fields = defaultFields,
    } = this.props;
    const code = this.generateFieldValue(data, fields.code) || EMPTY_FILLING;// 编号
    const location = this.generateFieldValue(data, fields.location) || EMPTY_FILLING; // 位置
    const imgUrl = this.generateFieldValue(data, fields.imgUrl);// 图片地址
    const monitorParams = this.generateFieldValue(data, fields.monitorParams) || []; // 监测的参数
    // const status = this.generateFieldValue(data, fields.status); // 状态 0 报警 1 正常
    const { dataUpdateTime, paramDesc, paramUnit, realValue, status, condition, limitValueStr, linkStatus } = monitorParams && monitorParams.length ? monitorParams[0] : {};
    // 状态：先判断linkStatus，0正常 -1失联，当正常时再判断status 参照STATUS
    return (
      <div className={styles.cardContainer} ref={ref => { this.container = ref }}>
        {this.renderLocation({ location })}
        <div className={styles.content}>
          <div className={styles.gasImgContainer} style={{ background: `url(${imgUrl}) no-repeat center center / 100% 100%` }}>
            <div className={styles.text}>
              <div>{paramDesc}</div>
              <div>{realValue ? `${realValue}${paramUnit || ''}` : EMPTY_FILLING}</div>
            </div>
          </div>
          <div className={styles.flexCenter}>
            <div className={styles.labelContainer}>
              {this.renderLabel({ label: '编号', value: code })}
              {/* {monitorParams.map(({ dataUpdateTime, paramDesc, paramUnit, realValue, status, condition, limitValueStr }, index) => (
                <Fragment key={index}>
                  {this.renderLabel({ label: '更新时间', value: dataUpdateTime ? moment(dataUpdateTime).format('YYYY-MM-DD HH:mm:ss') : EMPTY_FILLING })}
                  {this.renderLabel({
                    label: `${paramDesc}${paramUnit ? `（${paramUnit}）` : ''}`,
                    value: realValue || EMPTY_FILLING,
                    status,
                    statusLabel: `${STATUS[status]}${condition && limitValueStr ? `（${condition}${limitValueStr}）` : ''}`,
                  })}
                </Fragment>
              ))} */}
              {this.renderLabel({ label: '更新时间', value: dataUpdateTime ? moment(dataUpdateTime).format('YYYY-MM-DD HH:mm:ss') : EMPTY_FILLING })}
              {this.renderLabel({
                label: `${paramDesc}${paramUnit ? `（${paramUnit}）` : ''}`,
                value: realValue,
                status: +linkStatus === -1 ? 0 : status,
                statusLabel: +linkStatus === -1 ? '正常' : `${STATUS[status]}${condition && limitValueStr ? `（${condition}${limitValueStr}）` : ''}`,
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
