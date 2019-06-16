import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { Select } from 'antd';
// 引入样式文件
import styles from './index.less';

const { Option } = Select;

export default class CustomSelect extends PureComponent {
  FIELDNAMES = {
    key: 'key',
    value: 'value',
  }

  render() {
    const {
      className,
      dropdownClassName,
      data,
      fieldNames,
      ...restProps
    } = this.props;
    const { key, value } = { ...this.FIELDNAMES, fieldNames };

    return Array.isArray(data) && (
      <Select
        className={classNames(styles.select, className)}
        dropdownClassName={classNames(styles.dropdown, dropdownClassName)}
        dropdownMatchSelectWidth={false}
        {...restProps}
      >
        {data.map(({ [key]: k, [value]: v }) => (
          <Option
            key={k}
            value={k}
          >
            {v}
          </Option>
        ))}
      </Select>
    );
  }
};
