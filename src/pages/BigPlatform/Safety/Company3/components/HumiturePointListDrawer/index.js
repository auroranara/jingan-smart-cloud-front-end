import React, { Component } from 'react';
import CustomDrawer from '@/jingan-components/CustomDrawer';
import CustomTabs from '@/jingan-components/CustomTabs';
import LoadMore from '@/jingan-components/LoadMore';
import HumiturePointCard from '@/jingan-components/HumiturePointCard';
// import emptyData from '@/assets/empty_data.png';
import { connect } from 'dva';
import styles from './index.less';

const emptyData = 'http://data.jingan-china.cn/v2/chem/assets/empty_data.png';
const STATUS_MAPPER = {
  '正常': 0,
  '报警': 2,
  '失联': -1,
};
const FIELDNAMES = {
  name: 'deviceName', // 点位名称
  temperatureId: 'tDeviceId',
  temperature: 'temperature', // 当前温度
  minTemperature: 'tLower', // 最小温度
  maxTemperature: 'tUpper', // 最大温度
  humidityId: 'hDeviceId',
  humidity: 'humidity', // 当前湿度
  minHumidity: 'hLower', // 最小湿度
  maxHumidity: 'hUpper', // 最大湿度
  area: 'area', // 所在区域
  location: 'location', // 所在位置
  status: 'status', // 状态
  videoList: 'cameraMessage', // 视频列表
};

// 温湿度监测点列表抽屉
@connect(({ unitSafety, loading }) => ({
  unitSafety,
  loadingList: loading.effects['unitSafety/fetchHumiturePointList'],
  loadingCount: loading.effects['unitSafety/fetchHumiturePointCount'],
}))
export default class HumiturePointListDrawer extends Component {
  state = {
    activeKey: '全部',
  }

  componentDidUpdate({ visible: prevVisible }) {
    const { visible } = this.props;
    if (!prevVisible && visible) {
      this.handleTabClick('全部');
      this.getHumiturePointCount();
    }
  }

  getHumiturePointList = (activeKey) => {
    const {
      dispatch,
      unitSafety: {
        humiturePointList: {
          pagination: {
            pageNum,
          }={},
        },
      },
      companyId,
    } = this.props;
    const { activeKey: prevActiveKey } = this.state;
    dispatch({
      type: 'unitSafety/fetchHumiturePointList',
      payload: {
        companyId,
        pageSize: 10,
        pageNum: activeKey ? 1 : pageNum + 1,
        status: STATUS_MAPPER[activeKey || prevActiveKey],
      },
    });
  }

  getHumiturePointCount = () => {
    const { dispatch, companyId } = this.props;
    dispatch({
      type: 'unitSafety/fetchHumiturePointCount',
      payload: {
        companyId,
        pageSize: 1,
        pageNum: 1,
      },
    });
  }

  setScrollReference = scroll => {
    this.scroll = scroll && scroll.dom || scroll;
  }

  handleTabClick = (activeKey) => {
    this.getHumiturePointList(activeKey);
    this.setState({
      activeKey,
    });
    this.scroll && this.scroll.scrollTop();
  }

  handleLoadMore = () => {
    this.getHumiturePointList();
  }

  handleClick = ({ deviceId }) => {
    const { onClick } = this.props;
    onClick && onClick(deviceId);
  }

  handleVideoClick = (videoList) => {
    const { onVideoClick } = this.props;
    const [{ key_id }] = videoList;
    onVideoClick && onVideoClick(key_id, videoList);
  }

  render() {
    const {
      unitSafety: {
        humiturePointList: {
          list=[],
          pagination: {
            total,
            pageNum,
            pageSize,
          }={},
        },
        humiturePointCount: {
          all=0,
          normal=0,
          alarm=0,
          loss=0,
        },
      },
      visible,
      onClose,
      loadingList,
      loadingCount,
    } = this.props;
    const { activeKey } = this.state;

    const tabs = [
      {
        key: '全部',
        value: <span>全部<span className={styles.allCount}>（{all}）</span></span>,
      },
      {
        key: '正常',
        value: <span>正常<span className={styles.normalCount}>（{normal}）</span></span>,
      },
      {
        key: '报警',
        value: <span>报警<span className={styles.alarmCount}>（{alarm}）</span></span>,
      },
      {
        key: '失联',
        value: <span>失联<span className={styles.lossCount}>（{loss}）</span></span>,
      },
    ];

    return (
      <CustomDrawer
        title="监测点列表"
        visible={visible}
        onClose={onClose}
        sectionProps={{
          fixedContent: (
            <CustomTabs
              className={styles.tabs}
              data={tabs}
              activeKey={activeKey}
              onClick={this.handleTabClick}
            />
          ),
          scrollProps: {
            ref: this.setScrollReference,
          },
          spinProps: {
            loading: loadingList || loadingCount || false,
            wrapperClassName: styles.spin,
          },
        }}
      >
        <div className={styles.container}>
          {Array.isArray(list) && list.length > 0 ? (
            list.map((item) => (
              <HumiturePointCard
                key={item.deviceId}
                className={styles.card}
                data={item}
                fieldNames={FIELDNAMES}
                onClick={this.handleClick}
                onVideoClick={this.handleVideoClick}
              />
            ))
          ) : (
            <div className={styles.emptyData}>
              <img src={emptyData} alt="空数据" />
              <div>暂无数据</div>
            </div>
          )}
          {total > pageNum * pageSize && (
            <LoadMore onClick={this.handleLoadMore} />
          )}
        </div>
      </CustomDrawer>
    );
  }
}
