import React, { PureComponent } from 'react';
import { Icon } from 'antd';

import styles from './MsgRead.less';
import avatar from '@/assets/icon-avatar.png';

export default class MsgRead extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      active: 0,
      isMore: false, // 是否展开更多
    };
  }
  renderUsers = () => {
    const { read = [], unread = [] } = this.props;
    const { active, isMore } = this.state;
    const allList = [read, unread][active];
    const list = isMore ? allList : allList.slice(0, 7)
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
        <div className={styles.shwoMore} onClick={() => this.setState({ isMore: !isMore })}>
          更多
          <div style={{ transform: isMore ? 'rotate(-90deg)' : 'rotate(90deg)' }}><Icon type="double-right" /></div>
        </div>
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
                  this.setState({ active: index, isMore: false });
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
