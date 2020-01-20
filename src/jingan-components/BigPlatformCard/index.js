import React, { PureComponent } from 'react';
import classNames from 'classnames';
// 引入样式文件
import styles from './index.less';

/**
 * 大屏卡片通用方法
 */
export default class BigPlatformCard extends PureComponent {
  static Container ({ className, style, children, onClick }) {
    return <section className={classNames(styles.container, className)} style={style} onClick={onClick}>{children}</section>
  }

  /**
   * 获取字段值
   */
  getFieldValue (arg) {
    const { data } = this.props;
    return typeof arg === 'function' ? arg(data) : data[arg];
  }

  /**
   * 获取所有字段值
   */
  getFieldsValue () {
    const { fieldNames } = this.props;
    return Object.entries({ ...this.FIELDNAMES, ...fieldNames }).reduce((obj, [key, value]) => {
      obj[key] = this.getFieldValue(value);
      return obj;
    }, {});
  }

  /**
   * 渲染字段
   */
  renderField ({ label, value, className, style, labelWrapperClassName, labelWrapperStyle, labelContainerClassName, labelContainerStyle, valueContainerClassName, valueContainerStyle }) {
    return (
      <div className={classNames(styles.row, className)} style={style} key={label}>
        <div className={classNames(styles.labelContainer, labelContainerClassName)} style={labelContainerStyle}><span className={classNames(styles.labelWrapper, labelWrapperClassName)} style={labelWrapperStyle}>{label}</span>：</div>
        <div className={classNames(styles.valueContainer, valueContainerClassName)} style={valueContainerStyle}>{value}</div>
      </div>
    );
  }

  /**
   * 渲染所有字段
   */
  renderFields (fieldsValue = this.getFieldsValue()) {
    const fields = this.props.fields || this.FIELDS;
    return fields.map(({ label, key, render, hidden, ...rest }) => !(hidden && hidden(fieldsValue)) && (this.renderField({ label: typeof label === 'function' ? label(fieldsValue) : label, value: render ? render(fieldsValue) : fieldsValue[key], ...rest })));
  }

  render () {
    return null;
  }
}
