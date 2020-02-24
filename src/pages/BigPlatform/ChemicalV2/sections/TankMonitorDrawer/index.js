import React, { Component } from 'react';
import { message } from 'antd';
import CustomDrawer from '@/jingan-components/CustomDrawer';
import Wave from '@/jingan-components/Wave';
import NewVideoPlay from '@/pages/BigPlatform/NewFireControl/section/NewVideoPlay';
import classNames from 'classnames';
import moment from 'moment';
import { connect } from 'dva';
import styles from './index.less';

const API = 'xxx/getTankMonitor';
const NO_DATA = '暂无数据';
const DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const img = 'http://data.jingan-china.cn/v2/chem/chemScreen/icon-tank-empty.png';
const STATUS = ['正常', '预警', '告警'];
const transformCondition = condition => {
  if (condition === '>=') return '≥';
  else if (condition === '<=') return '≤';
  return condition;
};

// 请把xxx替换成对应model
@connect(
  ({ xxx, loading }) => ({
    xxx,
    loading: loading.effects[API],
  }),
  (dispatch, { id }) => ({
    getTankMonitor(payload, callback) {
      if (id) {
        dispatch({
          type: API,
          payload: {
            id,
            ...payload,
          },
          callback: (success, data) => {
            if (!success) {
              message.error('获取储罐监测数据失败，请稍后重试或联系管理人员！');
            }
            callback && callback(success, data);
          },
        });
      }
    },
  })
)
export default class TankMonitorDrawer extends Component {
  state = {
    videoVisible: false,
    videoKeyId: undefined,
  };

  componentDidMount() {
    this.props.getTankMonitor();
  }

  componentDidUpdate({ id: prevId }) {
    const { id } = this.props;
    if (prevId !== id) {
      this.props.getTankMonitor();
      this.scroll && this.scroll.scrollTop();
    }
  }

  setScrollReference = scroll => {
    this.scroll = (scroll && scroll.dom) || scroll;
  };

  hideVideo = () => {
    this.setState({
      videoVisible: false,
    });
  };

  handleWorkOrderIconClick = id => {
    // 工单id
    id && window.open(`${window.publicPath}#/company-iot/alarm-work-order/detail/${id}`);
  };

  handleMonitorTrendIconClick = id => {
    // 监测设备id
    id && window.open(`${window.publicPath}#/company-iot/alarm-work-order/monitor-trend/${id}`);
  };

  render() {
    const {
      className,
      style,
      visible,
      onClose,
      loading = false,
      tankDetail: {
        tankName,
        chineName,
        number,
        buildingName,
        floorName,
        areaName,
        designReserves,
        designReservesUnit,
        designPressure,
        emergencyMeasure,
        monitorParams = [],
        videoList = [],
        meList = [],
      },
      onVideoClick,
    } = this.props;
    const { videoVisible, videoKeyId } = this.state;
    const { noFinishWarningProcessId, id } = meList[0] || {};

    return (
      <CustomDrawer
        className={classNames(styles.container, className)}
        style={style}
        title="储罐监测"
        visible={visible}
        onClose={onClose}
        sectionProps={{
          scrollProps: { ref: this.setScrollReference },
          spinProps: { loading },
        }}
        zIndex={1566}
        width={535}
      >
        <div className={styles.top}>
          <div className={styles.line}>
            <div className={styles.label}>储罐名称：</div>
            <div className={styles.value}>
              {tankName}
              {videoList &&
                videoList.length > 0 && (
                  <span className={styles.video} onClick={() => onVideoClick(videoList)} />
                )}
              <div className={styles.jumperWrapper}>
                <span
                  onClick={() => this.handleWorkOrderIconClick(noFinishWarningProcessId)}
                  style={{ display: noFinishWarningProcessId ? 'inline-block' : 'none' }}
                />
                <span
                  onClick={() => this.handleMonitorTrendIconClick(id)}
                  style={{ display: id ? 'inline-block' : 'none' }}
                />
              </div>
            </div>
          </div>
          <div className={styles.line}>
            <div className={styles.label}>
              <span className={styles.number}>位号</span>：
            </div>
            <div className={styles.value}>{number}</div>
          </div>
          <div className={styles.line}>
            <div className={styles.label}>存储物质：</div>
            <div className={styles.value}>{chineName}</div>
          </div>
          <div className={styles.line}>
            <div className={styles.label}>区域位置：</div>
            <div className={styles.value}>
              {buildingName ? buildingName + (floorName || '') : areaName || '暂无'}
            </div>
          </div>
        </div>
        <div className={styles.middle}>
          <div
            className={styles.icon}
            style={{
              background: `url(${img}) center center / 100% auto no-repeat`,
            }}
          >
            <Wave
              frontStyle={{ height: '31.25%', color: 'rgba(178, 237, 255, 0.8)' }}
              backStyle={{ height: '31.25%', color: 'rgba(178, 237, 255, 0.3)' }}
            />
            <div className={styles.iconName}>{tankName}</div>
          </div>
          <div className={styles.infoWrapper}>
            <div className={styles.line}>
              <div className={styles.label}>
                设计储量（
                {designReservesUnit}
                ）：
              </div>
              <div className={styles.value}>{designReserves}</div>
            </div>
            <div className={styles.line}>
              <div className={styles.label}>设计压力（KPa）：</div>
              <div className={styles.value}>{designPressure}</div>
            </div>
            {monitorParams.map((param, index) => {
              const {
                paramDesc,
                paramUnit,
                realValue,
                status,
                dataUpdateTime,
                condition,
                limitValueStr,
              } = param;
              return (
                <div className={styles.paramsWrapper} key={index}>
                  <div className={styles.lineWrapper}>
                    <div className={styles.line}>
                      <div className={styles.label}>
                        {paramDesc}（{paramUnit}
                        ）：
                      </div>
                      <div className={styles.value}>
                        {realValue || realValue === 0 ? realValue : NO_DATA}
                      </div>
                    </div>
                    <div className={styles.line}>
                      <div className={styles.label}>状态：</div>
                      <div
                        className={styles.value}
                        style={{ color: +status > 0 ? '#ff4848' : '#11B409' }}
                      >
                        {/* {`${STATUS[status]}${
                          condition && limitValueStr
                            ? `（${transformCondition(condition)}${limitValueStr}）`
                            : ''
                        }`} */}
                        {`${STATUS[+status]}`}
                      </div>
                    </div>
                  </div>
                  <div className={styles.updateTime}>
                    更新时间：
                    {dataUpdateTime ? moment(dataUpdateTime).format(DEFAULT_FORMAT) : '暂无'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.bottomTitle}>
            <div className={styles.bottomTitleLabel}>应急处置措施</div>
          </div>
          <div className={styles.bottomContent}>{emergencyMeasure}</div>
        </div>
        {videoVisible && (
          <NewVideoPlay
            style={{ zIndex: 9999 }}
            videoList={videoList}
            visible={videoVisible}
            showList={true}
            keyId={videoKeyId}
            handleVideoClose={this.hideVideo}
          />
        )}
      </CustomDrawer>
    );
  }
}
