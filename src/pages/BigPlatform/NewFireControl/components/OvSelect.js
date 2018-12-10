import React, { PureComponent } from 'react';
import { Select } from 'antd';

import styles from './OvSelect.less';

const { Option } = Select;

const CLASSNAME = ['zero', 'one', 'two'];

export default class OvSelect extends PureComponent {
  render() {
    const { options, cssType=0 } = this.props;

    return (
      <div className={styles[CLASSNAME[cssType]]}>
        <Select
          dropdownClassName={styles.dropdown}
          defaultValue={0}
        >
          {options.map(({ value, desc }) => <Option value={value} key={value}>{desc}</Option>)}
        </Select>
      </div>
    );
  }
}
