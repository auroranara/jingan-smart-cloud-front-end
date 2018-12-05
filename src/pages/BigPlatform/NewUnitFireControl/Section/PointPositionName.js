import React, { PureComponent, Fragment } from 'react';
import { Col, Table } from 'antd';

import ImageCard from '@/components/ImageCard';

import styles from './PointPositionName.less';
import DrawerContainer from '../components/DrawerContainer';
import PointError from '../imgs/pointError.png';
import PointNormal from '../imgs/PointNormal.png';

const TYPE = 'point';

const columns = [
  {
    title: '巡查日期',
    dataIndex: 'check_date',
    key: 'check_date',
    align: 'center',
  },
  {
    title: '巡查人',
    dataIndex: 'user',
    key: 'user',
    align: 'center',
  },
  {
    title: '巡查状态',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
  },
  {
    title: '处理结果',
    dataIndex: 'result',
    key: 'result',
    align: 'center',
  },
];

export default class PointPositionName extends PureComponent {
  render() {
    const { visible, pointRecordLists, handleDrawerVisibleChange, ...restProps } = this.props;
    console.log('pointRecordLists', pointRecordLists);

    const list = [...Array(5)].map(item => ({
      pointTitle: '消防',
      user: '问问',
      time: '2018-12-11',
      pointStatus: '待检查',
      photoUrl: '',
    }));

    const cards = list.map(item => {
      const { pointTitle, user, time, pointStatus, photoUrl } = item;
      return (
        <ImageCard
          style={{ marginBottom: '1em' }}
          extraStyle={true}
          showRightIcon={true}
          showStatusLogo={true}
          isCardClick={true}
          onCardClick={() => {
            console.log('click');
          }}
          contentList={[
            { label: '点位名称', value: pointTitle },
            {
              label: '上次检查',
              value: (
                <Fragment>
                  {user}
                  <span style={{ marginLeft: '1em' }}>{time}</span>
                </Fragment>
              ),
            },
            {
              label: '点位状态',
              value: <Fragment>{pointStatus}</Fragment>,
            },
          ]}
          photo={photoUrl}
        />
      );
    });

    const left = (
      <div className={styles.container}>
        <div className={styles.circleContainer}>
          <Col span={12} className={styles.currentTitle}>
            <span>当前状态</span>
          </Col>
          <Col span={12} className={styles.statusIcon}>
            <div
              className={styles.icon}
              style={{
                backgroundImage: `url(${PointError})`,
              }}
            />
          </Col>
        </div>

        <div className={styles.cardsTitle}>
          <p className={styles.titleP}>
            当前隐患
            <span className={styles.titleSpan}>(2)</span>
          </p>
        </div>
        <div className={styles.cards}>
          <div className={styles.cardsMain}>
            {list.length ? (
              cards
            ) : (
              <div style={{ textAlign: 'center', color: '#fff' }}>{'暂无数据'}</div>
            )}
          </div>
        </div>

        <div className={styles.recordTitle}>
          <p className={styles.titleP}>
            巡查记录
            <span className={styles.titleSpan}>(共9次，异常2次)</span>
          </p>
        </div>
        <div className={styles.record}>
          <div className={styles.recordTable}>
            <Table rowKey="id" columns={columns} dataSource={pointRecordLists} pageSize="5" />
          </div>
        </div>
      </div>
    );

    return (
      <DrawerContainer
        title="点位名称"
        width={485}
        visible={visible}
        left={left}
        placement="right"
        onClose={() => handleDrawerVisibleChange(TYPE)}
        {...restProps}
      />
    );
  }
}
