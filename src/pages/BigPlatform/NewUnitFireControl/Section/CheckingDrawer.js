import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';

import styles from './CheckingDrawer.less';

import CheckCard from '../components/CheckCard';
import DrawerContainer from '../components/DrawerContainer';
import CheckLabel from '../components/CheckLabel';

// 检查点状态
const normal = 2; // 正常
const abnormal = 1; // 异常
const rectify = 4; // 待检查
const overTime = 3; // 超时检查

@connect(({ newUnitFireControl }) => ({
  newUnitFireControl,
}))
export default class CheckingDrawer extends PureComponent {
  state = {
    status: '',
    isSelected: true,
    visible: true,
  };

  componentDidMount() {
    const { dispatch, companyId } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchCheckCount',
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
    this.setState({
      status: undefined,
      isSelected: true,
    });
  };

  // 处理标签
  handleLabelOnClick = s => {
    const { dispatch, companyId } = this.props;
    const { status } = this.state;
    dispatch({
      type: 'newUnitFireControl/fetchCheckDetail',
      payload: {
        companyId,
        status: status !== s ? s : undefined,
        item_type: 2,
      },
    });
    this.setState({
      status: status !== s ? s : undefined,
      isSelected: false,
    });
  };
  handleCheckDrawer = () => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    // 获取检查点列表
    dispatch({
      type: 'newUnitFireControl/fetchCheckDetail',
      payload: {
        companyId,
        item_type: 2,
      },
    });
    // 获取当前隐患列表
    dispatch({
      type: 'newUnitFireControl/fetchCurrentHiddenDanger',
      payload: {
        company_id: companyId,
        businessType: 2,
      },
    });
    this.setState({ checkDrawerVisible: true });
  };
  render() {
    const { status, isSelected } = this.state;
    // console.log('isSelected', isSelected);
    const {
      visible,
      checkCount,
      checkList: { checkLists },
      handlePointDrawer,
      ...restProps
    } = this.props;
    const {
      all = 0,
      normal: anormal = 0,
      abnormal: error = 0,
      rectify: waitTime = 0,
      overTime: lastTime = 0,
    } = checkCount;

    const statusTotal = [error, anormal, lastTime, waitTime];
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
            handlePointDrawer(item);
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
          <div
            className={isSelected ? styles.totalSelectd : styles.circle}
            onClick={this.handleALlData}
          >
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
      </div>
    );

    return (
      <DrawerContainer
        style={{ overflow: 'hidden' }}
        title="检查点"
        width={485}
        visible={visible}
        left={left}
        placement="right"
        {...restProps}
        onClose={() => {
          this.props.onClose();
          this.setState({
            visible: false,
            status: undefined,
            isSelected: true,
          });
        }}
      />
    );
  }
}
