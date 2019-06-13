import React, { PureComponent } from 'react';
import classNames from 'classnames';
import CustomDrawer from '@/jingan-components/CustomDrawer';
import CustomTabs from '@/jingan-components/CustomTabs';
// 引入样式文件
import styles from './index.less';

export default class TaskDrawer extends PureComponent {
  state = {
    activeKey: '1',
  }

  handleTabClick = (activeKey) => {
    this.setState({ activeKey });
  }

  render() {
    const {
      className,
      style,
      ...restProps
    } = this.props;
    const { activeKey } = this.state;
    const tabs = [
      {
        key: '1',
        value: `消防主机(${2})`,
      },
      {
        key: '2',
        value: `独立烟感(${1})`,
      },
      {
        key: '3',
        value: `报修(${2})`,
      },
    ];

    return (
      <CustomDrawer
        title="测试"
        className={classNames(styles.container, className)}
        style={style}
        {...restProps}
      >
        <CustomTabs
          activeKey={activeKey}
          data={tabs}
          onClick={this.handleTabClick}
        />
      </CustomDrawer>
    );
  }
}
