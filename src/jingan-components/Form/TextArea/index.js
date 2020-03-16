import React, { Component } from 'react';
import { Input } from 'antd';
// import Ellipsis from '@/components/Ellipsis';
import EmptyText from '@/jingan-components/View/EmptyText';
import TextAreaEllipsis from '@/jingan-components/View/TextAreaEllipsis';
import classNames from 'classnames';
import styles from './index.less';
const { TextArea } = Input;

export default class FormTextArea extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.value !== this.props.value || nextProps.mode !== this.props.mode;
  }

  render() {
    const {
      className,
      value,
      mode = 'add',
      placeholder = '请输入',
      maxLength = 500,
      autoSize = {
        minRows: 3,
      },
      emtpy = <EmptyText />,
      ellipsis = true,
      ...restProps
    } = this.props;

    if (mode !== 'detail') {
      return (
        <TextArea
          className={classNames(styles.container, className)}
          placeholder={placeholder}
          value={value}
          maxLength={maxLength}
          autoSize={autoSize}
          {...restProps}
        />
      );
    } else {
      return value ? (
        ellipsis ? (
          // <Ellipsis lines={1} tooltip {...ellipsis}>
          //   {value}
          // </Ellipsis>
          <TextAreaEllipsis value={value} />
        ) : (
          <span>{value}</span>
        )
      ) : (
        emtpy
      );
    }
  }
}
