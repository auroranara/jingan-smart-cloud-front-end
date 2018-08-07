import React, { PureComponent } from 'react';
import { FormattedMessage, setLocale, getLocale } from 'umi/locale';
import { Spin, Tag, Menu, Icon, Dropdown, Avatar, Tooltip /*Button*/ } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import toUpper from 'lodash/toUpper';
import styles from './index.less';

export default class GlobalHeaderRight extends PureComponent {
  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }

  changLang = () => {
    const locale = getLocale();
    if (!locale || locale === 'zh-CN') {
      setLocale('en-US');
    } else {
      setLocale('zh-CN');
    }
    location.reload();
  };

  generateStyle = () => {
    const { currentUser } = this.props;
    const colors = ['#6666FF', '#66CCFF', '#9966FF', '#CC6666', '#FFCC66'];
    const number = currentUser.userName.charCodeAt(0) % 5;
    return { backgroundColor: colors[number], verticalAlign: 'middle' };
  };

  render() {
    const {
      currentUser,

      onMenuClick,

      theme,
    } = this.props;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="changePassword">
          <Icon type="lock" />
          <FormattedMessage
            id="menu.account.changePassword"
            defaultMessage="account changePassword"
          />
        </Menu.Item>
        <Menu.Item key="personalInfo">
          <Icon type="user" />
          <FormattedMessage id="menu.account.personalInfo" defaultMessage="account personalInfo" />
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
          退出登录
        </Menu.Item>
      </Menu>
    );
    // const noticeData = this.getNoticeData();
    const url = `/gsafe/console`;
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    return (
      <div className={className}>
        <Tooltip title="数据维护">
          <a
            target="_blank"
            href={url}
            rel="noopener noreferrer"
            className={styles.action}
            title="数据大屏"
          >
            <Icon type="hdd" />
          </a>
        </Tooltip>
        {currentUser.userName ? (
          <Dropdown overlay={menu}>
            <span className={`${styles.action} ${styles.account}`}>
              {/* <Avatar
                size="small"
                className={styles.avatar}
                src={currentUser.avatar}
                alt="avatar"
              /> */}
              <Avatar className={styles.avatar} style={this.generateStyle()} size="small">
                {toUpper(currentUser.userName.split('')[0])}
              </Avatar>
              <span className={styles.name}>{currentUser.userName}</span>
            </span>
          </Dropdown>
        ) : (
          <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
        )}
        {/*
        <Button
          size="small"
          ghost={theme === 'dark'}
          onClick={() => {
            this.changLang();
          }}
        >
          <FormattedMessage id="navbar.lang" />
        </Button>
      */}
      </div>
    );
  }
}
