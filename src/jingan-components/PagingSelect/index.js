import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Select, Spin } from 'antd';
import styles from './index.less';

/**
 * 基于antd的Select组件封装
 * 1.可能会有到达底部但未获取下一页的情况，等碰到再说
 */
export default ({
  options,
  loading,
  onSearch: handleSearch,
  hasMore,
  loadMore,
  dropdownRender: deprecatedDropdownRender,
  onPopupScroll: deprecatedOnPopupScroll,
  ...rest
}) => {
  // 是否正在获取下一页的数据
  const [appending, setAppending] = useState(false);
  // hack写法，也许会有问题
  useEffect(
    () => {
      if (!loading && appending) {
        setAppending(false);
      }
    },
    [loading]
  );
  // 下拉内容渲染
  const dropdownRender = useCallback(
    children => (
      <div className={styles.spinContainer}>
        {children}
        {appending && <Spin className={styles.spin} />}
      </div>
    ),
    [appending]
  );
  // 查询事件
  const onSearch = useMemo(() => {
    let timer = null;
    return value => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        handleSearch(value && value.trim());
      }, 300);
    };
  }, []);
  // 滚动事件
  const onPopupScroll = useCallback(({ target: { scrollTop, offsetHeight, scrollHeight } }) => {
    if (scrollTop + offsetHeight === scrollHeight) {
      setAppending(true);
      loadMore();
    }
  }, []);

  return (
    <Select
      placeholder="请选择"
      options={!loading || appending ? options : undefined}
      labelInValue
      notFoundContent={loading ? <Spin size="small" /> : undefined}
      optionFilterProp="children"
      filterOption={false}
      showSearch
      onSearch={onSearch}
      dropdownRender={dropdownRender}
      onPopupScroll={hasMore && !appending ? onPopupScroll : undefined}
      {...rest}
    />
  );
};
