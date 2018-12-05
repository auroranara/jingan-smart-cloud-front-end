import React, { PureComponent, Fragment } from 'react';
import { Col, Table } from 'antd';
import moment from 'moment';
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
    render: time => {
      return moment(time).format('YYYY-MM-DD');
    },
  },
  {
    title: '巡查人',
    dataIndex: 'user_name',
    key: 'user_name',
    align: 'center',
  },
  {
    title: '巡查状态',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    render: val => {
      return +val === 1 ? '正常' : '异常';
    },
  },
  {
    title: '处理结果',
    dataIndex: 'data',
    key: 'data',
    align: 'center',
  },
];

export default class PointPositionName extends PureComponent {
  render() {
    const { visible, pointRecordLists, handleDrawerVisibleChange, ...restProps } = this.props;

    const list = [];

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
