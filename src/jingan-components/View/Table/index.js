import React, { useState, useEffect } from 'react';
import { Card, Table, Divider, Tooltip, message, Button } from 'antd';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import classNames from 'classnames';
import screenfull from 'screenfull';
import styles from './index.less';

const SHOW_TOTAL = total => `共 ${total} 条记录`;

const PAGE_SIZE_OPTIONS = ['5', '10', '15', '20'];

const TableIndex = ({
  showCard = true,
  className,
  list: { list = [], pagination: { total = 0, pageNum = 1, pageSize = 20 } = {} } = {},
  pagination,
  scroll,
  operation,
  onReload,
  showPagination = true,
  showAddButton = true,
  showExportButton,
  hasAddAuthority,
  addPath,
  hasExportAuthority,
  ...rest
}) => {
  const [isFullscreen, setIsFullscreen] = useState(screenfull.isFullscreen);
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
      }}
      pagination={
        showPagination && {
          total,
          current: pageNum,
          pageSize,
          pageSizeOptions: PAGE_SIZE_OPTIONS,
          showTotal: SHOW_TOTAL,
          showQuickJumper: true,
          showSizeChanger: true,
          ...pagination,
        }
      }
      {...rest}
    />
  );
  return showCard ? (
    <Card>
      {operation && (
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
              <Button
                onClick={() => {
                  console.log('导出');
                }}
                disabled={!hasExportAuthority}
              >
                导出
              </Button>
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
      )}
      {table}
    </Card>
  ) : (
    table
  );
};

export default TableIndex;
