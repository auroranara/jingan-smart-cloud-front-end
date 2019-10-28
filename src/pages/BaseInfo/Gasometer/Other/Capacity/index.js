import React, { Component } from 'react';
import InputOrSpan from '@/jingan-components/InputOrSpan';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import styles from './index.less';

const LIST = [
  {
    key: 'mL',
    value: 'mL',
  },
  {
    key: 'L',
    value: 'L',
  },
];

export default class Capacity extends Component {
  handleInputChange = ({ target: { value: inputValue } }) => {
    const { onChange, value } = this.props;
    onChange && onChange([inputValue, value && value[1]]);
  }

  handleSelectChange = (selectValue) => {
    const { onChange, value } = this.props;
    onChange && onChange([value && value[0], selectValue]);
  }

  render() {
    const {
      value,
      onChange,
      type,
      ...restProps
    } = this.props;
    const [inputValue, selectValue] = value || [];

    return type !== 'span' ? (
      <InputOrSpan
        value={inputValue}
        onChange={this.handleInputChange}
        addonAfter={(
          <SelectOrSpan className={styles.select} value={selectValue} onChange={this.handleSelectChange} list={LIST} />
        )}
        {...restProps}
      />
    ) : <span>{inputValue && value.join('')}</span>;
  }
}
