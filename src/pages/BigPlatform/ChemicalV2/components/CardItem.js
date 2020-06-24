import React, { PureComponent, Fragment } from 'react';
import styles from './CardItem.less';

const NO_DATA = '暂无数据';

export default class CardItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      data = {},
      fields,
      onClick,
      style = {},
      extraBtn,
      iconStyle = {},
      labelStyle = {},
      fieldsStyle = {},
      onSecurityClick,
    } = this.props;
    const { icon } = data;
    return (
      <div
        className={styles.container}
        onClick={onClick}
        style={{
          cursor: onClick ? 'pointer' : 'default',
          // background: icon ? `url(${icon}) 20px center / 80px auto no-repeat` : 'none',
          // paddingLeft: icon ? 120 : 15,
          paddingLeft: 15,
          ...style,
        }}
      >
        {icon && (
          <div className={styles.icon} style={{ ...iconStyle }}>
            {typeof icon === 'function' ? icon(data) : icon}
          </div>
        )}
        <div className={styles.infoWrapper} style={{ ...fieldsStyle }}>
          {fields.map((item, index) => {
            const { label, value, render, extra, valueStyle } = item;
            return (
              <div className={styles.field} key={index}>
                {label && (
                  <span className={styles.label} style={{ ...labelStyle }}>
                    {label}：
                  </span>
                )}
                <span className={styles.value} style={valueStyle}>
                  {render ? render(data[value], data) : data[value] || NO_DATA}
                </span>
                {(typeof extra === 'function' ? extra(data, onSecurityClick) : extra) || null}
              </div>
            );
          })}
          {extraBtn || null}
        </div>
      </div>
    );
  }
}
