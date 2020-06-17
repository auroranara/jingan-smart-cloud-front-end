import React, { useState, useEffect } from 'react';
import { Skeleton, Empty, Badge, Table, Tooltip } from 'antd';
import Link from '@/jingan-components/View/Link';
import EmptyText from '@/jingan-components/View/EmptyText';
import Ellipsis from '@/components/Ellipsis';
import { connect } from 'dva';
import { stringify } from 'qs';
import { isEqual } from 'lodash';
import styles from './index.less';

const API = 'gasMonitor/getRank';

export default connect(
  ({
    gasMonitor: { rank },
    loading: {
      effects: { [API]: loading },
    },
  }) => ({
    rank,
    loading,
  }),
  (dispatch, { params }) => ({
    getRank(payload, callback) {
      dispatch({
        type: API,
        payload: {
          ...params,
          ...payload,
        },
        callback,
      });
    },
  }),
  (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
  }),
  {
    areStatesEqual: () => false,
    areOwnPropsEqual: () => false,
    areStatePropsEqual: () => false,
    areMergedPropsEqual: (props, nextProps) => {
      return (
        props.rank === nextProps.rank &&
        props.loading === nextProps.loading &&
        isEqual(props.params, nextProps.params) &&
        props.companyName === nextProps.companyName
      );
    },
  }
)(({ className, rank, loading, getRank, params, companyName }) => {
  const [prevParams, setPrevParams] = useState(undefined);
  const [sortType, setSortType] = useState(undefined);
  const [sorting, setSorting] = useState(false);
  useEffect(
    () => {
      if (!isEqual(params, prevParams)) {
        setPrevParams(params);
        // setSortType(undefined);
        getRank({
          sortType,
        });
      }
    },
    [params]
  );
  const list = (rank || []).slice(0, 6);
  const columns = [
    {
      title: '',
      dataIndex: '排名',
      width: 26,
      render: (value, data, index) => (
        <Badge
          className={styles.badge}
          count={index + 1}
          style={{ backgroundColor: index < 3 ? '#faad14' : '#d9d9d9' }}
        />
      ),
    },
    {
      title: '监测设备名称',
      dataIndex: 'equipmentName',
      render: value =>
        value ? (
          <Tooltip title={value}>
            <Link
              to={`/device-management/monitoring-device/list?${stringify({
                name: encodeURIComponent(value),
                equipmentType: params && params.equipmentTypes,
                companyName: companyName && encodeURIComponent(companyName),
              })}`}
              target="_blank"
            >
              {value.length > 6 ? `${value.slice(0, 6)}...` : value}
            </Link>
          </Tooltip>
        ) : (
          <EmptyText />
        ),
    },
    {
      title: '区域位置',
      dataIndex: 'areaLocation',
      render: value =>
        value ? (
          <Ellipsis className={styles.ellipsis} length={4} tooltip>
            {value}
          </Ellipsis>
        ) : (
          <EmptyText />
        ),
    },
    {
      title: '报警次数',
      dataIndex: 'warningCount',
      render: value =>
        value >= 0 ? (
          <Ellipsis className={styles.ellipsis} length={8} tooltip>{`${value}`}</Ellipsis>
        ) : (
          <EmptyText />
        ),
      sorter: true,
      sortOrder: { 1: 'descend', 2: 'ascend' }[sortType] || false,
    },
    {
      title: '误报次数',
      dataIndex: 'falseWarningCount',
      render: value =>
        value >= 0 ? (
          <Ellipsis className={styles.ellipsis} length={8} tooltip>{`${value}`}</Ellipsis>
        ) : (
          <EmptyText />
        ),
      sorter: true,
      sortOrder: { 3: 'descend', 4: 'ascend' }[sortType] || false,
    },
  ];
  return (
    <div className={className}>
      <div className={styles.title}>监测设备报警/误报排名</div>
      {!loading || sorting ? (
        list.length ? (
          <div style={{ height: 214 }}>
            <Table
              className={styles.table}
              columns={columns}
              dataSource={list}
              rowKey="id"
              pagination={false}
              onChange={(_, __, { field, order }) => {
                let sortType;
                if (field === 'warningCount') {
                  if (order === 'descend') {
                    sortType = '1';
                  } else if (order === 'ascend') {
                    sortType = '2';
                  }
                } else if (field === 'falseWarningCount') {
                  if (order === 'descend') {
                    sortType = '3';
                  } else if (order === 'ascend') {
                    sortType = '4';
                  }
                }
                setSortType(sortType);
                setSorting(true);
                getRank(
                  {
                    sortType,
                  },
                  () => {
                    setSorting(false);
                  }
                );
              }}
              loading={sorting}
            />
          </div>
        ) : (
          <div style={{ height: 214, overflow: 'hidden' }}>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        )
      ) : (
        <Skeleton active paragraph={{ rows: 5 }} />
      )}
    </div>
  );
});
