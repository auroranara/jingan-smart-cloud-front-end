import { PureComponent } from 'react';
import classNames from 'classnames';
import { notification } from 'antd';
import alarmIcon from '@/assets/alarm-icon.png';
import styles from './index.less';

const DEFAULT_OPTION = {
  className: styles.notification,
  placement: 'bottomLeft',
  duration: 30,
  icon: alarmIcon,
};
const THEME_DICT = {
  alarm: styles.alarm,
  fault: styles.fault,
};

// 自定义通知框
export default class CustomNotification extends PureComponent {
  componentDidMount() {
    const { option } = this.props;
    if (option) {
      this.showNotification();
    }
  }

  componentDidUpdate({ option: prevOption }) {
    const { option } = this.props;
    if (prevOption !== option) {
      this.showNotification();
    }
  }

  showNotification() {
    const {
      option: {
        className,
        style,
        icon,
        message,
        description,
        theme,
        ...option
      },
    } = this.props;
    notification.open({
      ...DEFAULT_OPTION,
      ...option,
      className: classNames(DEFAULT_OPTION.className, className),
      style: {
        width: (screen.availWidth - 40) / 5 - 8,
        ...DEFAULT_OPTION.style,
        ...style,
      },
      icon: undefined,
      message: undefined,
      description: (
        <div className={classNames(styles.wrapper, THEME_DICT[theme] || THEME_DICT.alarm)}>
          {message && (
            <div className={styles.titleWrapper}>
              {icon !== null && <div className={styles.icon} style={{ backgroundImage: `url(${icon || DEFAULT_OPTION.icon})` }} />}
              <div className={styles.title}>{message}</div>
            </div>
          )}
          <div className={styles.content}>{description}</div>
        </div>
      ),
    });
  }

  render() {
    return null;
  }
}
