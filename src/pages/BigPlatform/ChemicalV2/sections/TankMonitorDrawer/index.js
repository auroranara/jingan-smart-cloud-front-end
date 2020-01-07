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
const DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm:ss';

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

  handleWorkOrderIconClick = () => {
    const { tankDetail: { id = 1 } = {} } = this.props;
    window.open(`${window.publicPath}#/company-iot/alarm-work-order/detail/${id}`);
  };

  handleMonitorTrendIconClick = () => {
    const { tankDetail: { id = 1 } = {} } = this.props;
    window.open(`${window.publicPath}#/company-iot/alarm-work-order/monitor-trend/${id}`);
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
      },
      onVideoClick,
    } = this.props;
    const { videoVisible, videoKeyId } = this.state;
    const lastTimeItem = monitorParams.sort((a, b) => b.dataUpdateTime - a.dataUpdateTime)[0] || {};
    const updateTime = lastTimeItem.dataUpdateTime;

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
                <span onClick={this.handleWorkOrderIconClick} />
                <span onClick={this.handleMonitorTrendIconClick} />
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
          <div className={styles.icon}>
            <Wave
              frontStyle={{ height: '31.25%', color: 'rgba(178, 237, 255, 0.8)' }}
              backStyle={{ height: '31.25%', color: 'rgba(178, 237, 255, 0.3)' }}
            />
            <div className={styles.iconName}>{tankName}</div>
          </div>
          <div className={styles.infoWrapper}>
            <div className={styles.line}>
              <div className={styles.label}>更新时间：</div>
              <div className={styles.value}>
                {updateTime ? moment(updateTime).format(DEFAULT_FORMAT) : '暂无'}
              </div>
            </div>
            <div className={styles.line}>
              <div className={styles.label}>设计压力（KPa）：</div>
              <div className={styles.value}>{designPressure}</div>
            </div>
            <div className={styles.line}>
              <div className={styles.label}>
                设计储量（
                {designReservesUnit}
                ）：
              </div>
              <div className={styles.value}>{designReserves}</div>
            </div>
            {monitorParams.map((param, index) => {
              const { paramDesc, paramUnit, realValue, status } = param;
              return (
                <div className={styles.lineWrapper} key={index}>
                  <div className={styles.line}>
                    <div className={styles.label}>
                      {paramDesc}（{paramUnit}
                      ）：
                    </div>
                    <div className={styles.value}>{realValue}</div>
                  </div>
                  <div className={styles.line}>
                    <div className={styles.label}>状态：</div>
                    <div
                      className={styles.value}
                      style={{ color: +status > 0 ? '#ff4848' : '#0ff' }}
                    >
                      {+status > 0 ? '报警' : '正常'}
                    </div>
                  </div>
                </div>
              );
            })}
            {/* <div className={styles.lineWrapper}>
              <div className={styles.line}>
                <div className={styles.label}>实时储量（t）：</div>
                <div className={styles.value}>{realTimeStore}</div>
              </div>
              <div className={styles.line}>
                <div className={styles.label}>状态：</div>
                <div
                  className={styles.value}
                  style={{ color: realTimeStoreStatus > 0 ? '#ff4848' : '#0ff' }}
                >
                  {realTimeStoreStatus > 0 ? '报警' : '正常'}
                </div>
              </div>
            </div> */}
          </div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.bottomTitle}>
            {/* <div className={styles.bottomTitleIcon} /> */}
            <div className={styles.bottomTitleLabel}>应急处置措施</div>
          </div>
          <div className={styles.bottomContent}>{emergencyMeasure}</div>
        </div>
        <NewVideoPlay
          style={{ zIndex: 9999 }}
          videoList={videoList}
          visible={videoVisible}
          showList={true}
          keyId={videoKeyId}
          handleVideoClose={this.hideVideo}
        />
      </CustomDrawer>
    );
  }
}
