import React, { Component } from 'react';
import { message } from 'antd';
import CustomDrawer from '@/jingan-components/CustomDrawer';
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

  showVideo = () => {
    const { xxx: { videoList } = {} } = this.props;
    this.setState({
      videoVisible: true,
      videoKeyId: videoList[0].key_id,
    });
  };

  hideVideo = () => {
    this.setState({
      videoVisible: false,
    });
  };

  handleWorkOrderIconClick = () => {
    const { xxx: { id = 1 } = {} } = this.props;
    window.open(`${window.publicPath}#/company-iot/alarm-work-order/detail/${id}`);
  };

  handleMonitorTrendIconClick = () => {
    const { xxx: { id = 1 } = {} } = this.props;
    window.open(`${window.publicPath}#/company-iot/alarm-work-order/monitor-trend/${id}`);
  };

  render() {
    const {
      className,
      style,
      visible,
      onClose,
      loading = false,
      xxx: {
        name = '1号罐',
        upateTime = +new Date(),
        designPressure = 0.02,
        designStore = 16,
        realTimeStore = 5,
        temperature = 30,
        temperatureStatus = 0,
        liquidLevel = 2.3,
        liquidLevelStatus = 0,
        pressure = 0.03,
        pressureStatus = 0,
        videoList,
      } = {},
    } = this.props;
    const { videoVisible, videoKeyId } = this.state;

    return (
      <CustomDrawer
        className={classNames(styles.container, className)}
        style={style}
        width="30em"
        title="储罐监测"
        visible={visible}
        onClose={onClose}
        sectionProps={{
          scrollProps: { ref: this.setScrollReference },
          spinProps: { loading },
        }}
      >
        <div className={styles.top}>
          <div className={styles.line}>
            <div className={styles.label}>储罐名称：</div>
            <div className={styles.value}>
              1号罐
              {videoList &&
                videoList.length > 0 && <span className={styles.video} onClick={this.showVideo} />}
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
            <div className={styles.value}>4305A</div>
          </div>
          <div className={styles.line}>
            <div className={styles.label}>存储物质：</div>
            <div className={styles.value}>无水乙醇</div>
          </div>
          <div className={styles.line}>
            <div className={styles.label}>区域位置：</div>
            <div className={styles.value}>东厂区1号楼危险品液体原料储罐区</div>
          </div>
        </div>
        <div className={styles.middle}>
          <div className={styles.icon}>{name}</div>
          <div className={styles.infoWrapper}>
            <div className={styles.line}>
              <div className={styles.label}>更新时间：</div>
              <div className={styles.value}>
                {upateTime && moment(upateTime).format(DEFAULT_FORMAT)}
              </div>
            </div>
            <div className={styles.line}>
              <div className={styles.label}>设计压力（MPa）：</div>
              <div className={styles.value}>{designPressure}</div>
            </div>
            <div className={styles.line}>
              <div className={styles.label}>设计储量（t）：</div>
              <div className={styles.value}>{designStore}</div>
            </div>
            <div className={styles.line}>
              <div className={styles.label}>实时储量（t）：</div>
              <div className={styles.value}>{realTimeStore}</div>
            </div>
            <div className={styles.lineWrapper}>
              <div className={styles.line}>
                <div className={styles.label}>温度（℃）：</div>
                <div className={styles.value}>{temperature}</div>
              </div>
              <div className={styles.line}>
                <div className={styles.label}>状态：</div>
                <div
                  className={styles.value}
                  style={{ color: temperatureStatus > 0 ? '#ff4848' : '#0ff' }}
                >
                  {temperatureStatus > 0 ? '报警' : '正常'}
                </div>
              </div>
            </div>
            <div className={styles.lineWrapper}>
              <div className={styles.line}>
                <div className={styles.label}>液位（cm）：</div>
                <div className={styles.value}>{liquidLevel}</div>
              </div>
              <div className={styles.line}>
                <div className={styles.label}>状态：</div>
                <div
                  className={styles.value}
                  style={{ color: liquidLevelStatus > 0 ? '#ff4848' : '#0ff' }}
                >
                  {liquidLevelStatus > 0 ? '报警' : '正常'}
                </div>
              </div>
            </div>
            <div className={styles.lineWrapper}>
              <div className={styles.line}>
                <div className={styles.label}>压力（MPa）：</div>
                <div className={styles.value}>{pressure}</div>
              </div>
              <div className={styles.line}>
                <div className={styles.label}>状态：</div>
                <div
                  className={styles.value}
                  style={{ color: pressureStatus > 0 ? '#ff4848' : '#0ff' }}
                >
                  {pressureStatus > 0 ? '报警' : '正常'}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.bottomTitle}>
            <div className={styles.bottomTitleIcon} />
            <div className={styles.bottomTitleLabel}>应急处置措施</div>
          </div>
          <div className={styles.bottomContent}>
            迅速撤离泄漏污染区人员至安全区，并进行隔离，严格限制出入。切断火源。建议应急处理人员戴自给正压式呼吸器，穿防静电工作服。尽可能切断泄漏源。防止流入下水道、排洪沟等限制性空间。小量泄漏：用砂土或者是其它具有阻燃性能的材料进行吸附或吸收。也可以用大量水冲洗，利用水将泄露的无水乙醇进行稀释，然后将稀释后的污水排进废水系统。大量泄漏：构筑围堤或者挖坑收容。用泡沫覆盖，降低蒸汽造成的灾害。用防爆泵将其转移到槽车或者是专用的收集器内，回收或运至废物处理场所进行处置。
          </div>
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
