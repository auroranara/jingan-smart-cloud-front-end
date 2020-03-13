import React, { Component } from 'react';
import { Input } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import EmptyText from '@/jingan-components/View/EmptyText';
import classNames from 'classnames';
import styles from './index.less';
const { Password } = Input;

export default class FormPassword extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.value !== this.props.value || nextProps.mode !== this.props.mode;
  }

  render() {
    const {
      className,
      value,
      mode = 'add',
      placeholder = '请输入',
      maxLength = 100,
      emtpy = <EmptyText />,
      ellipsis = true,
      ...restProps
    } = this.props;

    if (mode !== 'detail') {
      return (
        <Password
          className={classNames(styles.container, className)}
          placeholder={placeholder}
          value={value}
          maxLength={maxLength}
          {...restProps}
        />
      );
    } else {
      return value ? (
        ellipsis ? (
          <Ellipsis lines={1} tooltip {...ellipsis}>
            {value}
          </Ellipsis>
        ) : (
          <span>{value}</span>
        )
      ) : (
        emtpy
      );
    }
  }
}
