import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';

import styles from './CheckingDrawer.less';

import CheckCard from '../components/CheckCard';
import DrawerContainer from '../components/DrawerContainer';
import CheckLabel from '../components/CheckLabel';

// const TYPE = 'check';

// 检查点状态
const waitCheck = 0; // 待检查
const lastCheck = 1; // 超时检查
const anormal = 2; // 正常
const error = 3; // 异常

@connect(({ newUnitFireControl }) => ({
  newUnitFireControl,
}))
export default class CheckingDrawer extends PureComponent {
  state = {
    status: '',
  };

  componentDidMount() {
    const { dispatch, companyId } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchCheckDetail',
      payload: {
        companyId,
        status: 3,
      },
    });
  }

  // 处理标签
  handleLabelOnClick = s => {
    const { dispatch, companyId } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchCheckDetail',
      payload: {
        companyId,
        status: s,
      },
    });
    this.setState({
      status: s,
    });
  };

  render() {
    const { status } = this.state;
    const {
      visible,
      checkCount,
      checkList: { checkLists },
      ...restProps
    } = this.props;
    const { all = 0, rectify = 0, overTime = 0, normal = 0, abnormal = 0 } = checkCount;

    const statusTotal = [rectify, overTime, normal, abnormal];
    const nums = [waitCheck, lastCheck, anormal, error].map((status, index) => [
      status,
      statusTotal[index],
    ]);

    const cards = checkLists.map(item => {
      const { object_title, user_name, check_date } = item;
      return (
        <CheckCard
          style={{ marginBottom: '1em' }}
          extraStyle={true}
          showRightIcon={true}
          showStatusLogo={true}
          isCardClick={true}
          onCardClick={() => {
            console.log('click');
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
          <div className={styles.circle}>
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
        title="检查点详情"
        width={485}
        visible={visible}
        left={left}
        placement="right"
        {...restProps}
      />
    );
  }
}
