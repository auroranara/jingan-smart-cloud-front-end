import React, { useState, useEffect } from 'react';
import { Card, Table, Divider, Tooltip, message, Button, Menu, Dropdown } from 'antd';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import classNames from 'classnames';
import screenfull from 'screenfull';
import styles from './index.less';

const SHOW_TOTAL = total => `共 ${total} 条记录`;

// const PAGE_SIZE_OPTIONS = ['5', '10', '15', '20'];

const TableIndex = ({
  showCard = true,
  className,
  list: { list = [], pagination: { total = 0, pageNum = 1, pageSize = 20 } = {} } = {},
  pagination,
  rowSelection,
  scroll,
  operation,
  onReload,
  onExport,
  showPagination = true,
  showAddButton = true,
  showExportButton,
  hasAddAuthority,
  addPath,
  hasExportAuthority,
  banner,
  ...rest
}) => {
  const [isFullscreen, setIsFullscreen] = useState(screenfull.isFullscreen);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  useEffect(() => {
    const callback = () => {
      setIsFullscreen(screenfull.isFullscreen);
    };
    if (screenfull.isEnabled) {
      screenfull.on('change', callback);
    }
    return () => {
      if (screenfull.isEnabled) {
        screenfull.off('change', callback);
      }
    };
  }, []);
  const fullscreenCallback = () => {
    if (screenfull.isEnabled) {
      screenfull.toggle();
    } else {
      message.error('您的浏览器不支持全屏！');
    }
  };
  const table = (
    <Table
      className={classNames(styles.table, className)}
      rowKey="id"
      dataSource={list}
      scroll={{
        x: true,
        ...scroll,
      }}
      pagination={
        showPagination && {
          total,
          current: pageNum,
          pageSize,
          // pageSizeOptions: PAGE_SIZE_OPTIONS,
          showTotal: SHOW_TOTAL,
          showQuickJumper: true,
          showSizeChanger: true,
          ...pagination,
        }
      }
      rowSelection={
        rowSelection || showExportButton
        ? {
            ...rowSelection,
            ...(showExportButton && {
              selectedRowKeys,
              onChange(selectedRowKeys) {
                setSelectedRowKeys(selectedRowKeys);
              },
            }),
          }
        : undefined
      }
      {...rest}
    />
  );
  return showCard ? (
    <Card {...showCard}>
      <div className={styles.operationContainer}>
        {showAddButton && (
          <div className={styles.operationWrapper}>
            <Button type="primary" href={`#${addPath}`} disabled={!hasAddAuthority}>
              新增
            </Button>
          </div>
        )}
        {showExportButton && (
          <div className={styles.operationWrapper}>
            <Dropdown
              overlay={
                <Menu
                  onClick={({ key }) => {
                    onExport && onExport(key, selectedRowKeys);
                    setSelectedRowKeys([]);
                  }}
                >
                  <Menu.Item key="1" disabled={!selectedRowKeys.length}>
                    导出选中
                  </Menu.Item>
                  <Menu.Item key="2">导出搜索结果</Menu.Item>
                  <Menu.Item key="3">导出全部</Menu.Item>
                </Menu>
              }
              disabled={!(total && hasExportAuthority)}
            >
              <Button>
                导出 <LegacyIcon type="down" />
              </Button>
            </Dropdown>
          </div>
        )}
        {Array.isArray(operation) &&
          operation.map((item, index) => {
            return (
              <div key={index} className={styles.operationWrapper}>
                {item}
              </div>
            );
          })}
        {(showAddButton ||
          showExportButton ||
          (Array.isArray(operation) && operation.length > 0)) && <Divider type="vertical" />}
        <div className={styles.operationWrapper}>
          <div className={styles.actionContainer}>
            <div className={styles.actionWrapper}>
              {!isFullscreen ? (
                <Tooltip title="全屏">
                  <LegacyIcon
                    className={styles.action}
                    type="fullscreen"
                    onClick={fullscreenCallback}
                  />
                </Tooltip>
              ) : (
                <Tooltip title="退出全屏">
                  <LegacyIcon
                    className={styles.action}
                    type="fullscreen-exit"
                    onClick={fullscreenCallback}
                  />
                </Tooltip>
              )}
            </div>
            <div className={styles.actionWrapper}>
              <Tooltip title="刷新">
                <LegacyIcon className={styles.action} type="reload" onClick={onReload} />
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
      {banner}
      {table}
    </Card>
  ) : (
    table
  );
};

export default TableIndex;
