import React, { Fragment, PureComponent } from 'react';
import { Col } from 'antd';

import styles from './WaterSystemDrawer.less';
import Ellipsis from '@/components/Ellipsis';
import { SearchBar } from '@/pages/BigPlatform/NewFireControl/components/Components';
// import VideoPlay from '@/pages/BigPlatform/NewFireControl/section/VideoPlay';
import { DrawerContainer } from '@/pages/BigPlatform/NewUnitFireControl/components/Components';
import { cameralogo, noMonitor } from '@/pages/BigPlatform/NewUnitFireControl/imgs/links';
import { Gauge, LossCard, TotalInfo, WaterTank } from '../components/Components';
import { isGauge } from '../utils';

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

function Empty(props) {
  return <div className={styles.empty}>暂无相关监测数据</div>;
}

function EmptyCard(props) {
  return <div className={styles.emptyContainer} style={{ backgroundImage: `url(${noMonitor})` }} />;
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

  renderCards = (list, waterTabItem) => {
    const { showWaterItemDrawer } = this.props;

    if (!list.length)
      return <Empty />;
    return list.map(item => {
      const { area, deviceId, location, deviceName, deviceDataList, videoList } = item;
      const dataItem = deviceDataList[0];
      const { status } = dataItem;
      const sts = +status;
      const handleClick = e => showWaterItemDrawer(item);
      let card = <LossCard data={item} iconIndex={waterTabItem}/>
      if (sts !== -1) {
        const img = isGauge(waterTabItem) ? (
          <Gauge
            data={dataItem}
            onClick={handleClick}
          />
        ) : (
          <WaterTank
            data={dataItem}
            onClick={handleClick}
            tankClassName={styles.tank}
          />
        );
        card = (
          <Fragment>
            <div className={styles.tankContainer}>
              {img}
            </div>
            <p className={styles.name}>
              {deviceName && deviceName.length > 20 ? <Ellipsis lines={1} tooltip>{deviceName}</Ellipsis> : deviceName}
            </p>
            <p className={styles.location}>
              <span className={styles.locationIcon} />
              {area}{location}
            </p>
          </Fragment>
        );
      }


      return (
        <Col
          span={12}
          key={deviceId}
          className={styles.col}
        >
          {card}
      </Col>
      );
    });
  };

  handleIndexChange = index => {
    const { handleParentChange } = this.props;
    handleParentChange({ filterIndex: index });
  };

  render() {
    const {
      visible,
      waterTabItem,
      // videoKeyId,
      waterLists,
      filterIndex,
    } = this.props;

    // const { videoVisible, videoList } = this.state;
    const { searchValue } = this.state;

    const waterList = waterLists[waterTabItem];
    const [alarmList, normalList, lostList] = waterList.reduce((prev, next) => {
      if (next.deviceDataList && next.deviceDataList.length) {
        const { deviceDataList: [{ status }] } = next;
        const sts = +status;
        if (sts > 0)
          prev[0].push(next);
        else if (sts === 0)
          prev[1].push(next);
        else if (sts === -1)
          prev[2].push(next);
      }
      return prev;
    }, [[], [], []]);

    const totalInfo = [
      { name: '报警', value: alarmList.length, color: '#FF4848', list: alarmList },
      { name: '失联', value: lostList.length, color: '#9f9f9f', list: lostList },
      { name: '正常', value: normalList.length, color: '#00ffff', list: normalList },
    ];
    const newList = totalInfo[filterIndex] ? totalInfo[filterIndex].list : [];
    const cardList = searchValue ? newList.filter(({ deviceName }) => deviceName.includes(searchValue)) : newList;

    let cards = null;
    if (!cardList.length)
      cards = <EmptyCard />;
    else
      cards = this.renderCards(cardList, waterTabItem);

    const left = (
      <div className={styles.content}>
        <TotalInfo data={totalInfo} titleIndex={waterTabItem} handleClick={this.handleIndexChange} index={filterIndex} />

        {/* 实时监测数据 */}
        <div className={styles.realTimeMonitor}>
          <div className={styles.titleLine}>
            <div className={styles.title}>
              <span>实时监测数据</span>
            </div>
            <SearchBar placeholder="搜索点位名称" onSearch={this.handleSearch} />
          </div>
          <div className={styles.cardsContainer}>
            {cards}
          </div>
        </div>
        {/* <VideoPlay
          showList={true}
          videoList={videoList}
          visible={videoVisible}
          keyId={videoKeyId}
          handleVideoClose={this.handleVideoClose}
        /> */}
      </div>
    );

    return (
      <DrawerContainer
        style={{ overflow: 'hidden' }}
        destroyOnClose={false}
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
