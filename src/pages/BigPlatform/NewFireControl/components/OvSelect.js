import React, { PureComponent } from 'react';
import { Select } from 'antd';

import styles from './OvSelect.less';

const { Option } = Select;

const CLASSNAME = ['zero', 'one', 'two'];

export default class OvSelect extends PureComponent {
  render() {
    const { options, cssType=0, value, handleChange, ...restProps } = this.props;

    return (
      <div className={styles[CLASSNAME[cssType]]} {...restProps}>
        <Select
          dropdownClassName={styles.dropdown}
          value={value}
          // defaultValue={0}
          onChange={handleChange}
        >
          {options.map(({ value, desc }) => <Option value={value} key={value}>{desc}</Option>)}
        </Select>
      </div>
    );
  }
}
