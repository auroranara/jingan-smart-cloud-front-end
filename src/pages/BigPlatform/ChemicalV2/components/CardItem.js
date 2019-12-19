import React, { PureComponent, Fragment } from 'react';
import styles from './CardItem.less';

export default class CardItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { data, fields, onClick, style = {}, extraBtn } = this.props;
    const { icon, name } = data;
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
        {icon && <div className={styles.icon}>{icon}{name}</div>}
        <div className={styles.infoWrapper}>
          {fields.map((item, index) => {
            const { label, value, render, extra } = item;
            return (
              <div className={styles.field} key={index}>
                {label && <span className={styles.label}>{label}：</span>}
                <span className={styles.value}>
                  {render ? render(data[value], data) : data[value]}
                </span>
                {extra || null}
              </div>
            );
          })}
          {extraBtn || null}
        </div>
      </div>
    );
  }
}
