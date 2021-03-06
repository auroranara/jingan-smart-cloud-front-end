import React, { PureComponent } from 'react';
import { Col } from 'antd';
import Ellipsis from 'components/Ellipsis';

import { OvProgress, SearchBar } from '@/pages/BigPlatform/NewFireControl/components/Components';
import DrawerContainer from '../components/DrawerContainer';
import ChartGauge from '../components/ChartGauge';
import TotalInfo from '../components/TotalInfo';
import VideoPlay from '@/pages/BigPlatform/NewFireControl/section/VideoPlay';

import styles from './WaterSystemDrawer.less';

import fireError from '../imgs/fireError.png';
import fireNormal from '../imgs/fireNormal.png';
import autoError from '../imgs/autoError.png';
import autoNormal from '../imgs/autoNormal.png';
import pondAbnormal from '../imgs/pond-abnormal.png';
import pondLoss from '../imgs/pond-loss.png';
import pondNormal from '../imgs/pond-normal.png';
import cameralogo from '../imgs/cameralogo.png';
// import noMonitorImg from '../imgs/no-monitor.png';

const noMonitorImg = 'http://data.jingan-china.cn/v2/chem/screen/no-monitor.png';

function title(i) {
  switch (i) {
    case 0:
      return '消火栓';
    case 1:
      return '喷淋';
    case 2:
      return '水池/水箱';
    default:
      return;
  }
}

function getImageError(i) {
  switch (i) {
    case 0:
      return fireError;
    case 1:
      return autoError;
    case 2:
      return pondAbnormal;
    default:
      return;
  }
}

function getImageNormal(i) {
  switch (i) {
    case 0:
      return fireNormal;
    case 1:
      return autoNormal;
    case 2:
      return pondNormal;
    default:
      return;
  }
}

function rangeStr(range = [], unit, str) {
  console.log(range);
  console.log(unit);
  console.log(str);

  let newStr = '';
  if (typeof range[0] === 'number' && typeof range[1] === 'number') {
    newStr = range.join(str) + unit;
  } else if (typeof range[0] === 'number') {
    newStr = '>' + range[0] + unit;
  } else if (typeof range[1] === 'number') {
    newStr = '<' + range[1] + unit;
  } else {
    newStr = '---';
  }
  return newStr;
}

export default class WaterSystemDrawer extends PureComponent {
  state = {
    visible: true, // 抽屉是否可见
    videoVisible: false, // 视频弹框是否可见
    searchValue: '',
    videoKeyId: '',
    videoList: [],
  };

  componentDidMount() {}

  handleSearch = v => {
    this.setState({ searchValue: v });
  };

  handleClickCamera = videoList => {
    this.setState({
      videoVisible: true,
      videoList,
      videoKeyId: videoList.length ? videoList[0].key_id : '',
    });
  };

  handleVideoClose = () => {
    this.setState({ videoVisible: false, videoKeyId: '' });
  };

  renderFireCards = list => {
    const { searchValue } = this.state;

    const filterFireList = list.filter(({ deviceName }) => deviceName.includes(searchValue));
    if (!filterFireList.filter(item => item.deviceDataList.length).length) {
      return (
        <div
          style={{
            width: '100%',
            height: '135px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#4f678d',
          }}
        >
          暂无相关监测数据
        </div>
      );
    }

    return filterFireList.map(item => {
      const { deviceDataList, videoList, status: devStatus } = item;
      const isMending = +devStatus === -1;
      const isNotIn = !deviceDataList.length;
      const { area, deviceId, location, deviceName } = item;
      const [
        {
          value,
          status,
          unit,
          deviceParamsInfo: { minValue, maxValue, normalUpper, normalLower },
        } = { deviceParamsInfo: {} },
      ] = deviceDataList;
      const normalRange = [normalLower, normalUpper];
      const isGray = isMending || isNotIn || (!isMending && +status < 0);
      return (
        <Col span={12} key={deviceId}>
          <div
            className={styles.card}
            key={deviceId}
            style={{
              border: isGray
                ? !isMending && +status < 0
                  ? '1px solid #9f9f9f'
                  : '1px solid #f83329'
                : '1px solid #04fdff',
            }}
          >
            {isMending && <div className={styles.status}>检修中</div>}
            {isNotIn && <div className={styles.status}>未接入</div>}
            {!isMending && !isNotIn && +status > 0 && <div className={styles.status}>报警</div>}
            {!isMending &&
              !isNotIn &&
              +status === -1 && (
                <div className={styles.status} style={{ backgroundColor: '#9f9f9f' }}>
                  失联
                </div>
              )}
            <div className={styles.picArea}>
              <ChartGauge
                showName
                radius="95%"
                isLost={+status < 0}
                value={value}
                status={+status}
                range={[minValue || 0, maxValue || (value ? 2 * value : 5)]}
                normalRange={[normalLower, normalUpper]}
                unit={unit}
                isMending={isMending}
                isNotIn={isNotIn}
              />
            </div>
            <div className={styles.itemContainer}>
              <Ellipsis
                className={styles.line}
                lines={1}
                tooltip
                style={{ color: isGray ? '#838383' : '' }}
              >
                {deviceName}
              </Ellipsis>
              <Ellipsis
                className={styles.line}
                lines={1}
                tooltip
                style={{ color: isGray ? '#838383' : '' }}
              >
                位置：
                {area}
                {location}
              </Ellipsis>
              <Ellipsis className={styles.line} lines={1} tooltip>
                {isGray ? (
                  <span style={{ color: isGray ? '#838383' : '' }}>
                    当前压力：---
                    {/* {!value && value !== 0 ? '---' : <span>{value + unit}</span>} */}
                  </span>
                ) : (
                  <span>
                    当前压力：
                    {!value && value !== 0 ? (
                      '---'
                    ) : (
                      <span style={{ color: +status !== 0 ? '#f83329' : '' }}>{value + unit}</span>
                    )}
                  </span>
                )}
              </Ellipsis>
              <Ellipsis
                className={styles.line}
                lines={1}
                tooltip
                style={{ color: isGray ? '#838383' : '' }}
              >
                参考范围：
                {isNotIn ? '---' : <span>{rangeStr(normalRange, unit, '~')}</span>}
              </Ellipsis>
              {videoList &&
                videoList.length > 0 && (
                  <div className={styles.lastLine}>
                    <div
                      className={styles.camera}
                      onClick={e => this.handleClickCamera(videoList)}
                      style={{
                        background: `url(${cameralogo}) no-repeat center center`,
                        backgroundSize: '100% 100%',
                      }}
                    />
                  </div>
                )}
            </div>
          </div>
        </Col>
      );
    });
  };

  renderPondCards = list => {
    const { searchValue } = this.state;

    const filterPondList = searchValue
      ? list.filter(({ deviceName }) => deviceName.includes(searchValue))
      : list;

    const filterFireList = list.filter(({ deviceName }) => deviceName.includes(searchValue));
    if (!filterFireList.filter(item => item.deviceDataList.length).length) {
      return (
        <div
          style={{
            width: '100%',
            height: '135px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#4f678d',
          }}
        >
          暂无相关监测数据
        </div>
      );
    }

    return filterPondList.map(item => {
      const { deviceDataList, videoList, status: devStatus } = item;
      const isMending = +devStatus === -1;
      const isNotIn = !deviceDataList.length;
      const { area, deviceId, location, deviceName } = item;
      const [
        { value, status, unit, deviceParamsInfo: { normalUpper, normalLower } } = {
          deviceParamsInfo: {},
        },
      ] = deviceDataList;
      const normalRange = [normalLower, normalUpper];
      const isGray = isMending || isNotIn || (!isMending && +status < 0);
      return (
        <div>
          <Col span={12} key={deviceId}>
            <div
              className={styles.card}
              key={deviceId}
              style={{
                border: isGray
                  ? !isMending && +status < 0
                    ? '1px solid #9f9f9f'
                    : '1px solid #f83329'
                  : '1px solid #04fdff',
              }}
            >
              {isMending && <div className={styles.status}>检修</div>}
              {isNotIn && <div className={styles.status}>未接入</div>}
              {!isMending && !isNotIn && +status > 0 && <div className={styles.status}>报警</div>}
              {!isMending &&
                !isNotIn &&
                +status === -1 && (
                  <div className={styles.status} style={{ backgroundColor: '#9f9f9f' }}>
                    失联
                  </div>
                )}
              <div className={styles.picAreaPond}>
                <img
                  className={styles.pondBg}
                  // src={+status === 0 ? pondNormal : +status === -1 ? pondLoss : pondAbnormal}
                  src={isGray ? pondLoss : !isMending && +status === 0 ? pondNormal : pondAbnormal}
                  alt="pond"
                />
              </div>
              <div className={styles.itemContainer}>
                <Ellipsis
                  className={styles.line}
                  lines={1}
                  tooltip
                  style={{ color: isGray ? '#838383' : '' }}
                >
                  {deviceName}
                </Ellipsis>
                <Ellipsis
                  className={styles.line}
                  lines={1}
                  tooltip
                  style={{ color: isGray ? '#838383' : '' }}
                >
                  位置：
                  {area}
                  {location}
                </Ellipsis>
                <p style={{ marginBottom: 0 }}>
                  {isGray ? (
                    <span style={{ color: '#838383' }}>
                      当前水位：---
                      {/* <span> {!value && value !== 0 ? '---' : <span>{value + unit}</span>}</span> */}
                    </span>
                  ) : (
                    <span>
                      当前水位：
                      <span>
                        {' '}
                        {!value && value !== 0 ? (
                          '---'
                        ) : (
                          <span style={{ color: +status !== 0 ? '#f83329' : '' }}>
                            {value + unit}
                          </span>
                        )}
                      </span>
                    </span>
                  )}
                </p>
                <p style={{ marginBottom: 0 }}>
                  {/* {isGray ? (
                    <span style={{ color: '#838383' }}>
                      参考范围：---
                      {(!normalRange[0] && normalRange[0] !== 0) ||
                      (!normalRange[1] && normalRange[1] !== 0) ? (
                        '暂无'
                      ) : (
                        <span>
                          {normalRange[0]}~{normalRange[1]}
                          {unit}
                        </span>
                      )}
                    </span>
                  ) : ( */}
                  <span style={{ color: isGray ? '#838383' : '#fff' }}>
                    参考范围：
                    {isNotIn ? '---' : <span>{rangeStr(normalRange, unit, '~')}</span>}
                  </span>
                  {/* )} */}
                </p>
                <div className={styles.lastLine}>
                  {videoList &&
                    videoList.length > 0 && (
                      <div
                        className={styles.camera}
                        onClick={e => this.handleClickCamera(videoList)}
                        style={{
                          background: `url(${cameralogo}) no-repeat center center`,
                          backgroundSize: '100% 100%',
                        }}
                      />
                    )}
                </div>
              </div>
            </div>
          </Col>
        </div>
      );
    });
  };

  render() {
    const {
      visible,
      waterTabItem,
      videoKeyId,
      waterDrawer,
      filterIndex,
      onClick,
      handleParentChange,
    } = this.props;

    const { videoVisible, videoList } = this.state;

    const alarmList = waterDrawer.filter(item => {
      const { deviceDataList } = item;
      const [{ status } = { deviceParamsInfo: {} }] = deviceDataList;
      return +status > 0;
    });
    const normalList = waterDrawer.filter(item => {
      const { deviceDataList } = item;
      const [{ status } = { deviceParamsInfo: {} }] = deviceDataList;
      return +status === 0;
    });
    const lostList = waterDrawer.filter(item => {
      const { deviceDataList } = item;
      const [{ status } = { deviceParamsInfo: {} }] = deviceDataList;
      return +status < 0;
    });
    const totalInfo = [
      { name: '报警', value: alarmList.length, color: '#FF4848', list: alarmList },
      { name: '失联', value: lostList.length, color: '#9f9f9f', list: lostList },
      { name: '正常', value: normalList.length, color: '#00ffff', list: normalList },
    ].map((item, index) => {
      return {
        ...item,
        onClick: () => {
          // onClick(index);
          handleParentChange({ filterIndex: index });
        },
      };
    });
    const newList = totalInfo[filterIndex] ? totalInfo[filterIndex].list : [];

    const left = (
      <div className={styles.content}>
        {/* 统计数据 */}
        {/* <div className={styles.totalInfo}>
          <div className={styles.title}>{title(waterTabItem) + '统计数据'}</div>
          <div className={styles.progress}>
            <Col span={16}>
              <OvProgress
                title="异常"
                percent={normal + abnormal > 0 ? (abnormal / (normal + abnormal)) * 100 : 0}
                quantity={abnormal}
                strokeColor="rgb(255,72,72)"
                iconStyle={{
                  backgroundImage: `url(${getImageError(waterTabItem)})`,
                  width: 55,
                  height: 55,
                }}
              />
              <OvProgress
                title="正常"
                percent={normal + abnormal > 0 ? (normal / (normal + abnormal)) * 100 : 0}
                quantity={normal}
                strokeColor="rgb(0,251,252)"
                // style={{ cursor: 'pointer' }}
                iconStyle={{
                  backgroundImage: `url(${getImageNormal(waterTabItem)})`,
                  width: 55,
                  height: 55,
                }}
              />
            </Col>
          </div>
        </div> */}
        <TotalInfo data={totalInfo} active={filterIndex} />

        {/* 实时监测数据 */}
        <div className={styles.realTimeMonitor}>
          <div className={styles.titleLine}>
            <div className={styles.title}>
              <span>实时监测数据</span>
            </div>
            <SearchBar placeholder="搜索点位名称" onSearch={this.handleSearch} />
          </div>
          {newList && newList.length > 0 ? (
            <div className={styles.listContainer}>
              {waterTabItem === 0 && this.renderFireCards(newList)}
              {waterTabItem === 1 && this.renderFireCards(newList)}
              {waterTabItem === 2 && this.renderPondCards(newList)}
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
        <VideoPlay
          showList={true}
          videoList={videoList}
          visible={videoVisible}
          keyId={videoKeyId}
          handleVideoClose={this.handleVideoClose}
        />
      </div>
    );

    return (
      <DrawerContainer
        style={{ overflow: 'hidden' }}
        destroyOnClose={true}
        title={title(waterTabItem) + '系统'}
        width={700}
        visible={visible}
        left={left}
        placement="right"
        onClose={() => {
          this.props.onClose();
          this.setState({
            visible: false,
            videoVisible: false,
            searchValue: '',
          });
        }}
      />
    );
  }
}
