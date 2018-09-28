import React, { PureComponent } from 'react';
import { Icon } from 'antd'
import { isArray } from '@/utils/utils';
import styles from './index.less';


/**
 * 水平轮播组件，一页显示一个
 */
export default class App extends PureComponent {
  state = {
    index: 0,
  }

  componentDidUpdate({ visible: prevVisible }) {
    const { visible } = this.props;;
    if (!prevVisible && visible) {
      this.setState({
        index: 0,
      });
    }
  }

  render() {
    const {
      style,
      visible,
      onClose,
      children,
    } = this.props;
    const { index } = this.state;
    // children不存在，为空数组及有元素
    const length = isArray(children) ? children.length : (+!!children);
    const isFirst = index === 0;
    const isLast = index === length - 1;

    return visible && length > 0 ? (
      <div className={styles.container} style={style}>
        <div className={styles.closeButton} onClick={onClose}><Icon type="close" /></div>
        {/* 左移按钮 */
          !isFirst && (
            <div className={styles.leftButton} onClick={() => this.setState({ index: index - 1 })}><Icon type="left" style={{ verticalAlign: 'top' }} /></div>
          )
        }
        {/* 右移按钮 */
          !isLast && (
            <div className={styles.rightButton} onClick={() => this.setState({ index: index + 1 })}><Icon type="right" style={{ verticalAlign: 'top' }} /></div>
          )
        }
        {/* 分页按钮 */
          length > 1 && (
            <div className={styles.pagination}>
              {[...Array(length).keys()].map(item => {
                const isSelected = item === index;
                return (
                  <div
                    key={item}
                    className={styles.paginationItem}
                  >
                    <div
                      style={isSelected?{ backgroundColor: '#0866D3', cursor: 'auto' }:undefined}
                      onClick={isSelected?undefined:() => this.setState({ index: item })}
                    />
                  </div>
                );
              })}
            </div>
          )
        }
        <div className={styles.list} style={{ width: `${length * 100}%`, left: `${index * -100}%` }}>
          {children}
        </div>
      </div>
    ) : null;
  }
}
