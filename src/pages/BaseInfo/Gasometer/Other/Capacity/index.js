import React, { Component } from 'react';
import { Input } from 'antd';
import classNames from 'classnames';
import InputOrSpan from '@/jingan-components/InputOrSpan';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import styles from './index.less';

// const LIST = [
//   {
//     key: 'cm³',
//     value: 'cm³',
//   },
//   {
//     key: 'dm³',
//     value: 'dm³',
//   },
//   {
//     key: 'm³',
//     value: 'm³',
//   },
// ];

export default class Capacity extends Component {
  handleInputChange = ({ target: { value: inputValue } }) => {
    const { onChange, value } = this.props;
    onChange && onChange([inputValue, value && value[1]]);
  }

  handleSelectChange = ({ target: { value: selectValue } }) => {
    const { onChange, value } = this.props;
    onChange && onChange([value && value[0], selectValue]);
  }

  // handleSelectChange = (selectValue) => {
  //   const { onChange, value } = this.props;
  //   onChange && onChange([value && value[0], selectValue]);
  // }

  render() {
    const {
      className,
      value,
      onChange,
      type,
      ...restProps
    } = this.props;
    const [inputValue, selectValue] = value || [];

    return type !== 'span' ? (
      <Input.Group className={classNames(styles.container, className)} compact>
        <Input className={styles.input1} value={inputValue} onChange={this.handleInputChange} {...restProps} />
        <Input className={styles.input2} value={selectValue} onChange={this.handleSelectChange} placeholder="单位" />
      </Input.Group>
    ) : <span>{inputValue && value.join('')}</span>;
  }
}
