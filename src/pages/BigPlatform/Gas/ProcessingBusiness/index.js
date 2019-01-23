import React, { PureComponent } from 'react';
// 引入样式文件
import styles from './index.less';
import redLine from '../imgs/red-line.png';
import yellowLine from '../imgs/yellow-line.png';

export default class ProcessingBusiness extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * 挂载后
   */
  componentDidMount() {}

  /**
   * 更新后
   */
  componentDidUpdate() {}

  /**
   * 销毁前
   */
  componentWillUnmount() {}

  /**
   * 渲染
   */
  render() {
    return (
      <div className={styles.section}>
        {[
          {
            icon: redLine,
            name: '未处理报警',
            value: 2,
          },
          {
            icon: yellowLine,
            name: '未处理故障',
            value: 12,
          },
        ].map(({ icon, name, value }) => (
          <div className={styles.item} key={name}>
            {+value > 99 && (
              <span
                className={styles.line}
                style={{ backgroundImage: `url(${icon})`, backgroundSize: '100% 100%' }}
              >
                {parseInt(value / 100, 0)}
              </span>
            )}
            <span
              className={styles.line}
              style={{ backgroundImage: `url(${icon})`, backgroundSize: '100% 100%' }}
            >
              {parseInt((value % 100) / 10, 0)}
            </span>
            <span
              className={styles.line}
              style={{ backgroundImage: `url(${icon})`, backgroundSize: '100% 100%' }}
            >
              {parseInt(value % 10, 0)}
            </span>
            <span className={styles.name}>{name}</span>
          </div>
        ))}
      </div>
    );
  }
}
