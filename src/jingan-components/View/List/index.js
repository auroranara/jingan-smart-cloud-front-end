import React, { useState, useEffect } from 'react';
import { Spin, List } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import styles from './index.less';

const GRID = { gutter: 24, column: 3, lg: 3, md: 2, sm: 1, xs: 1 };

export default ({
  className,
  list: { list = [], pagination: { total, pageNum, pageSize } = {} } = {},
  getList,
  loading = false,
  reloading = false,
  grid = GRID,
  renderItem,
}) => {
  const [initializing, setInitializing] = useState(true);
  useEffect(() => {
    getList(
      {
        pageNum: 1,
      },
      () => {
        setInitializing(false);
      }
    );
  }, []);
  const hasMore = pageNum * pageSize < total;

  return (
    <InfiniteScroll
      initialLoad={false}
      loadMore={() => !loading && getList({ pageNum: pageNum + 1 })}
      hasMore={hasMore}
    >
      <List
        className={className}
        grid={grid}
        loading={
          (reloading && {
            tip: '加载中...',
          }) ||
          (initializing && {
            wrapperClassName: styles.spinContainer,
            tip: '加载中...',
          })
        }
        dataSource={list}
        footer={
          hasMore || initializing ? (
            <div className={styles.spinWrapper}>
              <Spin tip="加载中..." />
            </div>
          ) : (
            total > 0 && <div className={styles.noMore}>没有更多了</div>
          )
        }
        renderItem={item => <List.Item>{renderItem && renderItem(item)}</List.Item>}
      />
    </InfiniteScroll>
  );
};
