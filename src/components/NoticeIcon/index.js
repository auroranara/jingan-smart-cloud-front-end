import React, { PureComponent } from 'react';
import { Popover, Icon, Tabs, Badge, Spin } from 'antd';
import classNames from 'classnames';
import List from './NoticeList';
import styles from './index.less';

const { TabPane } = Tabs;

export default class NoticeIcon extends PureComponent {
  static Tab = TabPane;

  static defaultProps = {
    onItemClick: () => {},
    onPopupVisibleChange: () => {},
    onTabChange: () => {},
    onClear: () => {},
    loading: false,
    locale: {
      emptyText: '暂无数据',
      clear: '清空',
    },
    emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg',
  };
<<<<<<< HEAD

=======
  constructor(props) {
    super(props);
    this.state = {};
    if (props.children && props.children[0]) {
      this.state.tabType = props.children[0].props.title;
    }
  }
>>>>>>> init
  onItemClick = (item, tabProps) => {
    const { onItemClick } = this.props;
    onItemClick(item, tabProps);
  };
<<<<<<< HEAD

  onTabChange = tabType => {
    const { onTabChange } = this.props;
    onTabChange(tabType);
  };

  getNotificationBox() {
    const { children, loading, locale, onClear } = this.props;
=======
  onTabChange = tabType => {
    this.setState({ tabType });
    this.props.onTabChange(tabType);
  };
  getNotificationBox() {
    const { children, loading, locale } = this.props;
>>>>>>> init
    if (!children) {
      return null;
    }
    const panes = React.Children.map(children, child => {
      const title =
        child.props.list && child.props.list.length > 0
          ? `${child.props.title} (${child.props.list.length})`
          : child.props.title;
      return (
        <TabPane tab={title} key={child.props.title}>
          <List
            {...child.props}
            data={child.props.list}
            onClick={item => this.onItemClick(item, child.props)}
<<<<<<< HEAD
            onClear={() => onClear(child.props.title)}
=======
            onClear={() => this.props.onClear(child.props.title)}
>>>>>>> init
            title={child.props.title}
            locale={locale}
          />
        </TabPane>
      );
    });
    return (
      <Spin spinning={loading} delay={0}>
        <Tabs className={styles.tabs} onChange={this.onTabChange}>
          {panes}
        </Tabs>
      </Spin>
    );
  }
<<<<<<< HEAD

  render() {
    const { className, count, popupAlign, popupVisible, onPopupVisibleChange } = this.props;
=======
  render() {
    const { className, count, popupAlign, onPopupVisibleChange } = this.props;
>>>>>>> init
    const noticeButtonClass = classNames(className, styles.noticeButton);
    const notificationBox = this.getNotificationBox();
    const trigger = (
      <span className={noticeButtonClass}>
        <Badge count={count} style={{ boxShadow: 'none' }} className={styles.badge}>
          <Icon type="bell" className={styles.icon} />
        </Badge>
      </span>
    );
    if (!notificationBox) {
      return trigger;
    }
    const popoverProps = {};
    if ('popupVisible' in this.props) {
<<<<<<< HEAD
      popoverProps.visible = popupVisible;
=======
      popoverProps.visible = this.props.popupVisible;
>>>>>>> init
    }
    return (
      <Popover
        placement="bottomRight"
        content={notificationBox}
        popupClassName={styles.popover}
        trigger="click"
        arrowPointAtCenter
        popupAlign={popupAlign}
        onVisibleChange={onPopupVisibleChange}
        {...popoverProps}
      >
        {trigger}
      </Popover>
    );
  }
}
