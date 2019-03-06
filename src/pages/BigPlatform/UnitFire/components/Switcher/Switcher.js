import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import styles from './Switcher.less';

/**
 * 分页按钮
 */
export function Pagination(props) {
  const { style={}, isFirst, isLast, onPrev, onNext } = props;
  return (
    <div className={styles.switcher} style={{ cursor: 'auto',  ...style }}>
      <div></div>
      <Icon
        type="caret-up"
        style={{
          fontSize: 12,
          color: isFirst ? '#00438a' : '#FFF',
          cursor: isFirst ? 'not-allowed' : 'pointer',
        }}
        onClick={() => {
          !isFirst && onPrev();
        }}
      />
      <Icon
        type="caret-down"
        style={{
          fontSize: 12,
          color: isLast ? '#00438a' : '#FFF',
          cursor: isLast ? 'not-allowed' : 'pointer',
        }}
        onClick={() => {
          !isLast && onNext();
        }}
      />
    </div>
  );
};

/**
 * 右侧按钮
 */
export default class App extends PureComponent {
  render() {
    const {
      isSelected=false,
      style={},
      onClick,
      content,
    } = this.props;

    return (
      <div className={styles.switcher} style={{ backgroundColor: isSelected?'#0967D3':'#173867', ...style }} onClick={onClick}>
        <div style={{ borderRightColor: isSelected?'#0967D3':'#173867' }}></div>
        <div style={{ borderRightColor: isSelected?'#0967D3':'#173867' }}></div>
        {content}
      </div>
    );
  }
}
