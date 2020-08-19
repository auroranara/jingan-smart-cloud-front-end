import React from 'react';
import { Button, Table, Input, Checkbox } from 'antd';
import classNames from 'classnames';
import styles from './index.less';

export default ({ value: unsafeValue = [], onChange, list = [], name, approved }) => {
  // 将value补充完整
  const value = [...Array(Math.max(unsafeValue.length, list.length))].map(
    (_, i) => unsafeValue[i] || {}
  );
  // 新增按钮点击事件
  const onAddButtonClick = () => {
    onChange && onChange(value.concat({}));
  };
  // 输入框change事件
  const onInputChange = (index, fieldName, inputValue) => {
    onChange &&
      onChange(
        value.map(
          (item, i) =>
            i === index
              ? {
                  ...item,
                  [fieldName]: inputValue && inputValue.trim(),
                }
              : item
        )
      );
  };
  // 多选框change事件
  const onCheckboxChange = (index, disabled) => {
    onChange &&
      onChange(
        value.map(
          (item, i) =>
            i === index
              ? {
                  ...item,
                  disabled,
                }
              : item
        )
      );
  };
  // 是否不是详情页面
  const isNotDetail = name !== 'detail';
  // 表格配置
  const columns = [
    {
      dataIndex: 'order',
      title: '序号',
      width: 61,
      align: 'center',
    },
    {
      dataIndex: 'safetyMeasure',
      title: '安全措施',
      align: 'left',
    },
    {
      dataIndex: 'confirmer',
      title: '确认人',
      align: 'center',
    },
    ...(isNotDetail && !approved
      ? [
          {
            dataIndex: 'operation',
            title: '操作',
            width: 61,
            align: 'center',
          },
        ]
      : []),
  ];
  let dataSource;
  if (isNotDetail) {
    dataSource = value.reduce((result, item, index) => {
      const arr = list[index];
      // 如果审批状态不为通过或者当前项未被取消勾选，则显示当前项
      if (!approved || !item.disabled) {
        result.push({
          key: result.length + 1,
          order: (
            <span className={item.disabled ? styles.disabled : undefined}>{result.length + 1}</span>
          ),
          safetyMeasure: (
            <div className={classNames(styles.wrapper, item.disabled && styles.disabled)}>
              {arr ? (
                arr[0]
                  .split('?')
                  .reduce(
                    (result, a, i) =>
                      result.concat(
                        a,
                        arr[i + 1] ? (
                          <Input
                            key={arr[i + 1]}
                            className={styles.numberInput}
                            value={item[arr[i + 1]]}
                            onChange={({ target: { value } }) =>
                              onInputChange(index, arr[i + 1], value)
                            }
                            disabled={item.disabled}
                          />
                        ) : (
                          []
                        )
                      ),
                    []
                  )
              ) : (
                <Input
                  value={item.safetyMeasure}
                  onChange={({ target: { value } }) => onInputChange(index, 'safetyMeasure', value)}
                  disabled={item.disabled}
                />
              )}
            </div>
          ),
          confirmer: (
            <Input
              className={styles.confirmerInput}
              value={item.confirmer}
              onChange={({ target: { value } }) => onInputChange(index, 'confirmer', value)}
              disabled={item.disabled}
            />
          ),
          operation: (
            <Checkbox
              checked={!item.disabled}
              onChange={({ target: { checked } }) => onCheckboxChange(index, !checked)}
            />
          ),
        });
      }
      return result;
    }, []);
  } else {
    dataSource = value.reduce((result, item, index) => {
      const arr = list[index];
      // 如果当前项未被取消勾选，则显示当前项
      if (!item.disabled) {
        result.push({
          key: result.length + 1,
          order: result.length + 1,
          safetyMeasure: arr
            ? arr.slice(1).reduce((result, a) => result.replace('?', item[a] || ''), arr[0])
            : item.safetyMeasure,
          confirmer: item.confirmer,
        });
      }
      return result;
    }, []);
  }

  return (
    <div>
      {isNotDetail && (
        <Button className={styles.addButton} type="primary" onClick={onAddButtonClick}>
          新增
        </Button>
      )}
      <Table dataSource={dataSource} columns={columns} bordered pagination={false} />
    </div>
  );
};
