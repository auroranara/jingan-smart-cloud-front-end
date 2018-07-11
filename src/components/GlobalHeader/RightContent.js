import React, { PureComponent } from 'react';
import { FormattedMessage, setLocale, getLocale } from 'umi/locale';
import { Spin, Tag, Menu, Icon, Dropdown, Avatar, Tooltip, Button } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import NoticeIcon from '../NoticeIcon';
// import HeaderSearch from '../HeaderSearch';
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
      // transform id to item key
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

  render() {
    const {
      currentUser,
      fetchingNotices,
      onNoticeVisibleChange,
      onMenuClick,
      onNoticeClear,
      theme,
    } = this.props;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="userCenter">
          <Icon type="user" />
          <FormattedMessage id="menu.account.center" defaultMessage="account center" />
        </Menu.Item>
        <Menu.Item key="userinfo">
          <Icon type="setting" />
          <FormattedMessage id="menu.account.settings" defaultMessage="account settings" />
        </Menu.Item>
        <Menu.Item key="triggerError">
          <Icon type="close-circle" />
          <FormattedMessage id="menu.account.trigger" defaultMessage="Trigger Error" />
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />退出登录
        </Menu.Item>
      </Menu>
    );
    const noticeData = this.getNoticeData();
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    return (
      <div className={className}>
        <Tooltip title="数据大屏">
          <a
            target="_blank"
            href="/acloud_new/v2/hdf/fireIndex.htm"
            rel="noopener noreferrer"
            className={styles.action}
            title="数据大屏"
          >
            <Icon type="line-chart" />
          </a>
        </Tooltip>
        <NoticeIcon
          className={styles.action}
          count={currentUser ? currentUser.notifyCount : 0}
          onItemClick={(item, tabProps) => {
            console.log(item, tabProps); // eslint-disable-line
          }}
          onClear={onNoticeClear}
          onPopupVisibleChange={onNoticeVisibleChange}
          loading={fetchingNotices}
          popupAlign={{ offset: [20, -16] }}
        >
          <NoticeIcon.Tab
            list={noticeData['通知']}
            title="通知"
            emptyText="你已查看所有通知"
            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
          />
          <NoticeIcon.Tab
            list={noticeData['消息']}
            title="消息"
            emptyText="您已读完所有消息"
            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
          />
          <NoticeIcon.Tab
            list={noticeData['待办']}
            title="待办"
            emptyText="你已完成所有待办"
            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg"
          />
        </NoticeIcon>
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
                {currentUser.userName.split('')[0]}
              </Avatar>
              <span className={styles.name}>{currentUser.userName}</span>
            </span>
          </Dropdown>
        ) : (
          <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
        )}
        <Button
          size="small"
          onClick={() => {
            this.changLang();
          }}
        >
          <FormattedMessage id="navbar.lang" />
        </Button>
      </div>
    );
  }
}
