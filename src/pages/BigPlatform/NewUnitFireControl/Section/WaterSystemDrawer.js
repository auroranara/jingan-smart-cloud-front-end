import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import Ellipsis from 'components/Ellipsis';

import styles from './WaterSystemDrawer.less';
import DrawerContainer from '../components/DrawerContainer';

@connect(({ newUnitFireControl }) => ({
  newUnitFireControl,
}))
export default class WaterSystemDrawer extends PureComponent {
  state = {
    status: '',
    isSelected: true,
    visible: true,
  };

  componentDidMount() {}

  render() {
    const { visible, waterTabItem } = this.props;

    const list = [];
    const left = (
      <div className={styles.content}>
        {/* 统计数据 */}
        <div className={styles.totalInfo}>
          <div className={styles.title}>
            <span>消火栓统计数据</span>
          </div>
          <div className={styles.divider} />
        </div>
        {/* 实时监测数据 */}
        <div className={styles.realTimeMonitor}>
          <div className={styles.titleLine}>
            <div className={styles.title}>
              <span>实时监测数据</span>
            </div>
            {/* <OvSelect
              cssType={1}
              options={OPTIONS}
              value={status}
              handleChange={handleChangeStatus} /> */}
          </div>
          {list && list.length > 0 ? (
            <div className={styles.listContainer}>
              {list.map(({ area, location, realtimeData, status, normal_upper, unit }, i) => (
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
                      {realtimeData && unit ? (
                        <span style={{ color: +status === 1 ? '#F83329' : 'inherit' }}>
                          {realtimeData + unit}
                        </span>
                      ) : (
                        '暂无数据'
                      )}
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
                          // background: `url(${cameraImg}) no-repeat center center`,
                          backgroundSize: '100% 100%',
                        }}
                      />
                      {this.renderStatusButton(+status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className={styles.emptyContainer}
              style={{
                // background: `url(${noMonitorImg}) no-repeat center center`,
                backgroundSize: '35% 80%',
              }}
            />
          )}
        </div>
        {/* <VideoPlay
          showList={true}
          videoList={cameraList}
          visible={videoVisible}
          keyId={videoKeyId}
          // style={VIDEO_STYLE}
          handleVideoClose={this.handleVideoClose}
        /> */}
      </div>
    );
    return (
      <DrawerContainer
        style={{ overflow: 'hidden' }}
        destroyOnClose={true}
        title={
          waterTabItem === 0 ? '消火栓系统' : waterTabItem === 1 ? '自动喷淋系统' : '水池/水箱'
        }
        width={700}
        visible={visible}
        left={left}
        placement="right"
        onClose={() => {
          this.props.onClose();
          this.setState({
            visible: false,
          });
        }}
      />
    );
  }
}
