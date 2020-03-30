import React, { PureComponent } from 'react';
import { FormattedMessage, setLocale, getLocale } from 'umi/locale';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Spin, Tag, Menu, Dropdown, Avatar, Tooltip, message /*Button*/ } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import toUpper from 'lodash/toUpper';
import styles from './index.less';

const url = `/gsafe/console`;

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

  //  跳转到gsafe之前登录一下 获取cookie
  handleGoGsafe = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'login/loginGsafe',
      callback: () => {
        const winHandler = window.open('', '_blank');
        winHandler.location.href = url;
        winHandler.focus();
      },
    });
  };

  generateStyle = () => {
    const { currentUser } = this.props;
    const colors = ['#6666FF', '#66CCFF', '#9966FF', '#CC6666', '#FFCC66'];
    const number = currentUser.userName.charCodeAt(0) % 5;
    return { backgroundColor: colors[number], verticalAlign: 'middle' };
  };

  handleChangeUser = userId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'login/changerUser',
      payload: { id: userId },
      success: () => {
        // message.success('切换成功！');
        // setTimeout(() => {
        window.location.reload(true);
        // }, 500);
      },
      error: () => {
        message.error('切换失败！');
      },
    });
  };

  render() {
    const { currentUser, onMenuClick, theme } = this.props;
    // console.log('currentUser', currentUser.moreUser);

    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="changePassword">
          <LegacyIcon type="lock" />
          <FormattedMessage
            id="menu.account.changePassword"
            defaultMessage="account changePassword"
          />
        </Menu.Item>
        <Menu.Item key="personalInfo">
          <LegacyIcon type="user" />
          <FormattedMessage id="menu.account.personalInfo" defaultMessage="account personalInfo" />
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <LegacyIcon type="logout" />
          退出登录
        </Menu.Item>
      </Menu>
    );
    const users = (
      <Menu>
        {currentUser.moreUser &&
          currentUser.moreUser.length > 1 &&
          currentUser.moreUser.map(item => (
            <Menu.Item
              disabled={currentUser.id === item.userId}
              onClick={() => this.handleChangeUser(item.userId)}
              key={item.userId}
            >
              {item.unitName || '平台管理'}
            </Menu.Item>
          ))}
      </Menu>
    );
    // const noticeData = this.getNoticeData();
    let className = styles.right;
    // console.log('currentUser', currentUser.id);

    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    return (
      <div className={className}>
        {currentUser &&
          currentUser.isMoreUser &&
          currentUser.moreUser.length > 1 && (
            <Dropdown overlay={users}>
              <span className={styles.action}>
                <LegacyIcon type="swap" style={{ fontSize: '18px' }} />
                <span style={{ verticalAlign: 'middle' }}>切换单位</span>
              </span>
            </Dropdown>
          )}
        {/* {currentUser && currentUser.unitType === 3 && ( */}
        {true && (
          <Tooltip title="数据维护">
            <span
              target="_blank"
              rel="noopener noreferrer"
              className={styles.action}
              title="数据维护"
              onClick={this.handleGoGsafe}
            >
              <LegacyIcon type="hdd" />
              <span style={{ marginLeft: 8, marginRight: 8, verticalAlign: 'middle' }}>
                数据维护
              </span>
            </span>
          </Tooltip>
        )}
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
              <span style={{ verticalAlign: 'middle' }}>{currentUser.userName}</span>
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
