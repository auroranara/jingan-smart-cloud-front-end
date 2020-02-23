import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
// 引入样式文件
import styles from './Tips.less';

const content =
  '今天我公司已进行安全风险研判，各项安全风险防控措施已落实到位，我承诺所有生产装置处于安全运行状态，罐区、仓库等重大危险源安全风险得到有效管控。';

export default class Remind extends PureComponent {
  state = {};
  timer = null;
  num = 0;

  componentDidMount() {
    this.scrollLeft();
  }

  componentDidUpdate(prevProps) {
    const { noticeList: prevNoticeList } = prevProps;
    const { noticeList } = this.props;
    if (JSON.stringify(prevNoticeList) !== JSON.stringify(noticeList)) {
      this.scrollLeft();
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  scrollLeft = () => {
    clearInterval(this.timer);
    const speed = 30;
    const containerWidth = this.containerNode.offsetWidth;
    const scrollWidth = this.scrollNode.scrollWidth;
    // console.log('scrollWidth', scrollWidth);
    this.scrollNode.style.marginLeft = `${containerWidth}px`;
    this.num = containerWidth;
    this.timer = setInterval(() => {
      if (this.num >= -scrollWidth) {
        this.num = this.num - 1;
        this.scrollNode.style.marginLeft = `${this.num}px`;
      } else {
        this.num = containerWidth;
        this.scrollNode.style.marginLeft = `${containerWidth}px`;
      }
    }, speed);
  };

  render() {
    const { noticeList } = this.props;
    return (
      <div className={styles.container} ref={ref => (this.containerNode = ref)}>
        <div className={styles.tips} ref={ref => (this.scrollNode = ref)}>
          {noticeList.slice(0, 10).map((item, index) => {
            const { allContent, createTime } = item;
            return (
              <div className={styles.tip} key={index}>
                {moment(createTime).format('YYYY年MM月DD日')}
                <span>{allContent.split(',')[11]}</span>
                <span>
                  安全承诺：
                  {content}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
