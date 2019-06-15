import React, { PureComponent } from 'react';
import { Col, Row } from 'antd';

import styles from './MsgRead.less';
import avatar from '../imgs/icon-avatar.png';

export default class MsgRead extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      active: 0,
    };
  }
  renderUsers = () => {
    const { read = [], unread = [] } = this.props;
    const { active } = this.state;
    const list = [read, unread][active];
    return (
      <div className={styles.users}>
        {list.map((item, index) => {
          const { name } = item;
          return (
            <div className={styles.userWrapper} key={index}>
              <div
                className={styles.userIcon}
                style={{
                  background: `url(${avatar}) center center / 100% 100% no-repeat`,
                }}
              />
              {name}
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    const { read = [], unread = [], ...restProps } = this.props;
    const { active } = this.state;
    const tabs = [{ name: '已读', list: read }, { name: '未读', list: unread }];

    return (
      <div className={styles.container}>
        <div className={styles.tabs}>
          {tabs.map((item, index) => {
            const { name, list } = item;
            return (
              <div
                className={active === index ? styles.active : styles.tab}
                key={index}
                onClick={() => {
                  this.setState({ active: index });
                }}
              >
                {name} {list.length}
              </div>
            );
          })}
        </div>
        {this.renderUsers()}
      </div>
    );
  }
}
