import React, { Fragment, PureComponent } from 'react';
import { Col } from 'antd';

import styles from './WaterSystemDrawer.less';
import { SearchBar } from '@/pages/BigPlatform/NewFireControl/components/Components';
// import VideoPlay from '@/pages/BigPlatform/NewFireControl/section/VideoPlay';
import { DrawerContainer } from '@/pages/BigPlatform/NewUnitFireControl/components/Components';
import { cameralogo, noMonitor } from '@/pages/BigPlatform/NewUnitFireControl/imgs/links';
import { LossCard, TotalInfo, WaterTank } from '../components/Components';

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

  // renderFireCards = list => {
  //   const { searchValue } = this.state;

  //   const filterFireList = list.filter(({ deviceName }) => deviceName.includes(searchValue));
  //   if (!filterFireList.filter(item => item.deviceDataList.length).length)
  //     return <Empty />;

  //   return filterFireList.map(item => {
  //     const { deviceDataList, videoList, status: devStatus } = item;
  //     const isMending = +devStatus === -1;
  //     const isNotIn = !deviceDataList.length;
  //     const { area, deviceId, location, deviceName } = item;
  //     const [
  //       {
  //         value,
  //         status,
  //         unit,
  //         deviceParamsInfo: { minValue, maxValue, normalUpper, normalLower },
  //       } = { deviceParamsInfo: {} },
  //     ] = deviceDataList;
  //     const normalRange = [normalLower, normalUpper];
  //     const isGray = isMending || isNotIn || (!isMending && +status < 0);
  //     return (
  //       <Col span={12} key={deviceId}>
  //         <div
  //           className={styles.card}
  //           key={deviceId}
  //           style={{
  //             border: isGray
  //               ? !isMending && +status < 0
  //                 ? '1px solid #9f9f9f'
  //                 : '1px solid #f83329'
  //               : '1px solid #04fdff',
  //           }}
  //         >
  //           Guage
  //         </div>
  //       </Col>
  //     );
  //   });
  // };

  renderCards = (list, waterTabItem) => {
    const { showWaterItemDrawer } = this.props;
    const { searchValue } = this.state;

    let cardList = searchValue ? list.filter(({ deviceName }) => deviceName.includes(searchValue)) : list;
    cardList = cardList.filter(item => item.deviceDataList && item.deviceDataList.length);

    if (!cardList.length)
      return <Empty />;
    return cardList.map(item => {
      const { deviceDataList, videoList } = item;
      const { area, deviceId, location, deviceName } = item;
      const [
        { value, status, unit, deviceParamsInfo: { normalUpper, normalLower, maxValue } } = {
          deviceParamsInfo: {},
        },
      ] = deviceDataList;
      const limits = [normalLower, normalUpper];
      const targetItem = deviceDataList[0];
      const sts = +status;
      let card = <LossCard data={item}/>
      if (sts !== -1) {
        let img = waterTabItem === 0 || waterTabItem === 1 ? (
          <div>guage</div>
        ) : (
          <WaterTank
            dy={30}
            status={+status}
            width={200}
            height={200}
            value={value}
            size={[100, 150]}
            limits={limits}
            range={maxValue}
            unit={unit}
            className={styles.tank}
            onClick={e => showWaterItemDrawer(targetItem)}
          />
        );
        card = (
          <Fragment>
            <div className={styles.tankContainer}>
              {img}
            </div>
            <p className={styles.name}>{deviceName}</p>
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

    const waterList = waterLists[waterTabItem];
    const alarmList = waterList.filter(item => {
      const { deviceDataList } = item;
      const [{ status } = {}] = deviceDataList;
      return +status > 0;
    });
    const normalList = waterList.filter(item => {
      const { deviceDataList } = item;
      const [{ status } = {}] = deviceDataList;
      return +status === 0;
    });
    const lostList = waterList.filter(item => {
      const { deviceDataList } = item;
      const [{ status } = {}] = deviceDataList;
      return +status < 0;
    });
    const totalInfo = [
      { name: '报警', value: alarmList.length, color: '#FF4848', list: alarmList },
      { name: '失联', value: lostList.length, color: '#9f9f9f', list: lostList },
      { name: '正常', value: normalList.length, color: '#00ffff', list: normalList },
    ];
    const newList = totalInfo[filterIndex] ? totalInfo[filterIndex].list : [];
    let cards = null;

    if (!newList || !newList.length)
      cards = <EmptyCard />;
    // else if (waterTabItem === 0 || waterTabItem === 1)
    //   cards = this.renderFireCards(newList);
    else
      cards = this.renderCards(newList, waterTabItem);

    console.log('drawer', waterTabItem, filterIndex);
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
          {cards}
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
