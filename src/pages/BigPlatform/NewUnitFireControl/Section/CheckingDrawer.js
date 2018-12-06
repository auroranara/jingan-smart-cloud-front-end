import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';

import styles from './CheckingDrawer.less';

import CheckCard from '../components/CheckCard';
import DrawerContainer from '../components/DrawerContainer';
import CheckLabel from '../components/CheckLabel';
import PointPositionName from './PointPositionName';

// const TYPE = 'check';

// 检查点状态
const normal = 1; // 正常
const abnormal = 2; // 异常
const rectify = 3; // 待检查
const overTime = 4; // 超时检查

@connect(({ newUnitFireControl }) => ({
  newUnitFireControl,
}))
export default class CheckingDrawer extends PureComponent {
  state = {
    status: '',
    checkStatus: '',
    itemId: '',
    pointDrawerVisible: false, // 点位名称弹框
  };

  componentDidMount() {
    const { dispatch, companyId } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchCheckDetail',
      payload: {
        companyId,
        item_type: 2,
      },
    });
  }

  // 点击总计标签获取全部数据
  handleALlData = () => {
    const { dispatch, companyId } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchCheckDetail',
      payload: {
        companyId,
        item_type: 2,
      },
    });
  };

  // 处理标签
  handleLabelOnClick = s => {
    const { dispatch, companyId } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchCheckDetail',
      payload: {
        companyId,
        status: s,
        item_type: 2,
      },
    });
    this.setState({
      status: s,
    });
  };

  // 打开点位名称抽屉
  handlePointDrawer = (id, checkStatus) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchPointRecord',
      payload: {
        itemId: id,
        item_type: 2,
      },
    });
    this.setState({
      pointDrawerVisible: true,
      checkStatus: checkStatus,
      itemId: id,
    });
  };

  render() {
    const { status, pointDrawerVisible, checkStatus, itemId } = this.state;
    const {
      visible,
      checkCount,
      checkList: { checkLists },
      pointRecordList: { pointRecordLists, abnormal: checkAbnormal, count },
      newUnitFireControl: { currentHiddenDanger },
      ...restProps
    } = this.props;
    const {
      all = 0,
      normal: anormal = 0,
      abnormal: error = 0,
      rectify: waitTime = 0,
      overTime: lastTime = 0,
    } = checkCount;

    const statusTotal = [anormal, error, waitTime, lastTime];
    const nums = [normal, abnormal, rectify, overTime].map((status, index) => [
      status,
      statusTotal[index],
    ]);

    const cards = checkLists.map(item => {
      const { item_id, object_title, user_name, check_date, status: checkStatus } = item;
      return (
        <CheckCard
          key={item_id}
          extraStyle={true}
          status={checkStatus}
          showRightIcon={true}
          showStatusLogo={true}
          isCardClick={true}
          onCardClick={() => {
            this.handlePointDrawer(item_id, checkStatus);
          }}
          contentList={[
            { label: '点位名称', value: object_title },
            {
              label: '上次巡查人',
              value: <Fragment>{user_name}</Fragment>,
            },
            {
              label: '上次巡查日期',
              value: <Fragment>{check_date}</Fragment>,
            },
          ]}
        />
      );
    });

    const left = (
      <div className={styles.container}>
        <div className={styles.circleContainer}>
          <div className={styles.circle} onClick={this.handleALlData}>
            <p className={styles.num}>{all}</p>
            <p className={styles.total}>总计</p>
          </div>
        </div>
        <div className={styles.checkBtn}>
          {nums.map(([s, n]) => (
            <CheckLabel
              key={s}
              num={n}
              status={s}
              selected={+status === s}
              onClick={() => this.handleLabelOnClick(s)}
            />
          ))}
        </div>
        <div className={styles.cards}>
          {checkLists.length ? (
            cards
          ) : (
            <div style={{ textAlign: 'center', color: '#fff' }}>{'暂无数据'}</div>
          )}
        </div>
        <PointPositionName
          visible={pointDrawerVisible}
          pointRecordLists={pointRecordLists}
          checkAbnormal={checkAbnormal}
          currentHiddenDanger={currentHiddenDanger}
          handleDangerCards={this.handleDangerCards}
          checkStatus={checkStatus}
          itemId={itemId}
          count={count}
          onClose={() => {
            this.setState({
              pointDrawerVisible: false,
            });
          }}
        />
      </div>
    );

    return (
      <DrawerContainer
        title="检查点"
        width={485}
        visible={visible}
        left={left}
        placement="right"
        {...restProps}
      />
    );
  }
}
