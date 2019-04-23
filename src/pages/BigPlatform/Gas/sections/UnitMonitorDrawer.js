import { PureComponent } from 'react';
import { connect } from 'dva';
import DrawerContainer from '../components/DrawerContainer';
import ReactEcharts from 'echarts-for-react';
import { Icon, Row, Col } from 'antd';
import iconAddress from '../imgs/icon-address.png';
import { OvSelect } from '@/pages/BigPlatform/NewFireControl/components/Components';
import Ellipsis from 'components/Ellipsis';
// 正常
import gasNormalImg from '../imgs/gas-normal.png';
// 报警
import gasAlarmImg from '../imgs/gas-alarm.png';
// 故障
import gasErrorImg from '../imgs/gas-error.png';
// 失联
import gasLossImg from '../imgs/gas-loss.png';
// 摄像头
import cameraImg from '../imgs/camera.png';
// 暂无监测数据
import noMonitorImg from '../imgs/no-monitor.png';
import styles from './UnitMonitorDrawer.less';
import VideoPlay from '@/pages/BigPlatform/NewFireControl/section/VideoPlay';

const OPTIONS = [
  { value: null, desc: '全部' },
  { value: 0, desc: '正常', img: gasNormalImg, color: '' },
  { value: 1, desc: '报警', img: gasAlarmImg, color: '#F83329' },
  { value: -3, desc: '故障', img: gasErrorImg, color: '#FFB400' },
  { value: -1, desc: '失联', img: gasLossImg, color: '#9F9F9F' },
];

const VIDEO_STYLE = {
  width: '90%',
  marginLeft: '-43%',
};

const DEFAULT = '暂无数据';

function parseDataNum(n) {
  const t = typeof n;
  if (t === 'number') return n;
  if (t === 'string') {
    const parsed = Number.parseFloat(n);
    return Object.is(parsed, NaN) ? DEFAULT : 0;
  }

  return DEFAULT;
}

/**
 * 单位监测弹窗
 * @export
 * @class UnitMonitorDrawer
 * @extends {PureComponent}
 */
@connect(({ gas }) => ({
  gas,
}))

export default class UnitMonitorDrawer extends PureComponent {
  state = {
    videoVisible: false,
    videoKeyId: '',
  };

  handleClickCamera = () => {
    const { cameraList = [] } = this.props;
    this.setState({
      videoVisible: true,
      videoKeyId: cameraList.length ? cameraList[0].key_id : '',
    });
  };

  handleVideoClose = () => {
    this.setState({ videoVisible: false, videoKeyId: '' });
  };

  // 生成卡片左侧图
  generateImg = status => {
    const item = OPTIONS.find(item => item.value === status);
    return item.img;
  };

  renderStatusButton = status => {
    if (!!!status) return null;
    const { color, desc } = OPTIONS.find(item => item.value === status);
    return (
      <span className={styles.statusButton} style={{ borderColor: color, color }}>
        {desc}
      </span>
    );
  };

  handleCLoseDrawer = () => {
    const { onClose } = this.props;
    this.setState({ videoVisible: false });
    onClose();
  };

  render() {
    const {
      visible,
      title,
      unitInfo,
      unitAbnormalTrend = [],
      handleChangeStatus,
      status,
      handleViewVideo,
      gas: { unitRealTimeMonitor },
      cameraList,
    } = this.props;
    const {
      companyName, // 企业名称
      address, // 地址
      principalName,
      principalPhone,
      normal,
      unnormal,
      faultNum,
      outContact,
    } = unitInfo;

    const { videoVisible, videoKeyId } = this.state;

    const option = {
      legend: {
        left: 60,
        bottom: 0,
        data: [
          { name: '报警次数', icon: 'circle', textStyle: { color: '#CCD6E9', fontSize: 15 } },
          { name: '故障次数', icon: 'circle', textStyle: { color: '#CCD6E9', fontSize: 15 } },
          { name: '失联次数', icon: 'circle', textStyle: { color: '#CCD6E9', fontSize: 15 } },
        ],
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
        },
        backgroundColor: '#161616',
        padding: 10,
      },
      dataset: {
        source: [['product', '报警次数', '故障次数', '失联次数'], ...unitAbnormalTrend],
      },
      xAxis: {
        type: 'category',
        axisLine: { lineStyle: { color: '#3F618D' } },
        axisTick: { show: false },
        axisLabel: {},
      },
      yAxis: {
        axisLine: { show: false },
        splitLine: { lineStyle: { color: '#3F618D' } },
      },
      series: [
        { type: 'bar', barMaxWidth: 14, barGap: '40%', itemStyle: { color: '#F83329' } },
        { type: 'bar', barMaxWidth: 14, barGap: '40%', itemStyle: { color: '#FFB400' } },
        { type: 'bar', barMaxWidth: 14, barGap: '40%', itemStyle: { color: '#9F9F9F' } },
      ],
      textStyle: {
        color: '#fff',
      },
    };

    const left = (
      <div className={styles.unitMonitorContent}>
        {/* 单位监测信息 */}
        <div className={styles.companyInfo}>
          <div className={styles.companyTitle}>{companyName}</div>
          <div className={styles.companyLine}>
            <div
              className={styles.icon}
              style={{
                background: `url(${iconAddress}) no-repeat center center`,
                backgroundSize: '100% 100%',
              }}
            />
            {address}
          </div>
          <div className={styles.companyLine}>
            <Icon className={styles.icon} type="user" />
            {principalName}
            <span className={styles.ml10}>{principalPhone}</span>
          </div>
          <div className={styles.statistics}>
            <div className={styles.item}>
              <span className={styles.iconCircle} style={{ background: '#37a460' }} />
              <span>正常 {normal}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.iconCircle} style={{ background: '#f83329' }} />
              <span>报警 {unnormal || 0}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.iconCircle} style={{ background: '#ffb400' }} />
              <span>故障 {faultNum}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.iconCircle} style={{ background: '#9f9f9f' }} />
              <span>失联 {outContact}</span>
            </div>
          </div>
          <div className={styles.divider} />
        </div>
        {/* 实时监测数据 */}
        <div className={styles.realTimeMonitor}>
          <div className={styles.titleLine}>
            <div className={styles.title}>
              <span>实时监测数据</span>
            </div>
            <OvSelect
              cssType={1}
              options={OPTIONS}
              value={status}
              handleChange={handleChangeStatus}
            />
          </div>
          {unitRealTimeMonitor && unitRealTimeMonitor.length > 0 ? (
            <div className={styles.listContainer}>
              {unitRealTimeMonitor.map(
                ({ area, location, realtimeData, status, normal_upper, unit }, i) => (
                  <div className={styles.card} key={i} style={{ marginTop: i < 2 ? '0' : '10px' }}>
                    <div
                      className={styles.imgContainer}
                      style={{
                        background: `url(${this.generateImg(+status)}) no-repeat center center`,
                        backgroundSize: '45% 40%',
                      }}
                    />
                    <div className={styles.contentContainer}>
                      <Ellipsis className={styles.line} lines={1} tooltip>
                        {area
                          ? location
                            ? `${area}：${location}`
                            : area
                          : location || '暂无位置数据'}
                      </Ellipsis>
                      <Ellipsis className={styles.line} lines={1} tooltip>
                        LEL值：
                        <span style={{ color: +status === 1 ? '#F83329' : 'inherit' }}>
                          {parseDataNum(realtimeData)}
                          {parseDataNum(realtimeData) > 0 || parseDataNum(realtimeData) === 0 ? (
                            <span>{unit}</span>
                          ) : (
                              ''
                            )}
                        </span>
                      </Ellipsis>
                      <Ellipsis className={styles.line} lines={1} tooltip>
                        参考值范围：
                        {normal_upper && unit ? `0${unit}~${normal_upper}${unit}` : '暂无数据'}
                      </Ellipsis>
                      <div className={styles.lastLine}>
                        <div
                          className={styles.camera}
                          onClick={this.handleClickCamera}
                          style={{
                            background: `url(${cameraImg}) no-repeat center center`,
                            backgroundSize: '100% 100%',
                          }}
                        />
                        {this.renderStatusButton(+status)}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
              <div
                className={styles.emptyContainer}
                style={{
                  background: `url(${noMonitorImg}) no-repeat center center`,
                  backgroundSize: '35% 80%',
                }}
              />
            )}
        </div>
        {/* 异常趋势图 */}
        <div className={styles.abnormalTrend}>
          <div className={styles.titleLine}>
            <div>
              异常趋势图
              <span>（最近12个月）</span>
            </div>
          </div>
          <ReactEcharts className={styles.chartContainer} option={option} />
        </div>
        <VideoPlay
          showList={true}
          videoList={cameraList}
          visible={videoVisible}
          keyId={videoKeyId}
          // style={VIDEO_STYLE}
          handleVideoClose={this.handleVideoClose}
        />
      </div>
    );
    return (
      <DrawerContainer
        id="unitMonitorDrawer"
        title={title}
        zIndex={2000}
        width={700}
        left={left}
        visible={visible}
        placement="right"
        onClose={() => {
          this.handleCLoseDrawer();
          this.handleVideoClose();
        }}
      />
    );
  }
}
