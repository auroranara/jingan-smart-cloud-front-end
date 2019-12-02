import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
// 引入样式文件
import styles from './Tips.less';

const tips = [
  {
    type: '主要负责人承诺公告',
    content: '今天我公司人员密集场所环境处于正常状态，危险物品和特殊作业风险处于安全可控状态。',
    man: '刘军',
    date: 1572931992000,
  },
  {
    type: '从业人员承诺公告',
    content: '作为一名员工严格按照《安全生产法》等相关法律法规，履行安全生产职责。',
  },
];

export default class Remind extends PureComponent {
  state = {};

  num = 0;

  componentDidMount() {
    this.scrollLeft();
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  scrollLeft = () => {
    const speed = 30;
    const containerWidth = this.containerNode.offsetWidth;
    const scrollWidth = this.scrollNode.scrollWidth;
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
    return (
      <div className={styles.container} ref={ref => (this.containerNode = ref)}>
        <div className={styles.tips} ref={ref => (this.scrollNode = ref)}>
          {tips.map((item, index) => {
            const { type, content, man, date } = item;
            return (
              <div className={styles.tip} key={index}>
                {type}：{content}
                {man && <span>{man}</span>}
                {date && <span>{moment(date).format('YYYY年MM月DD日')}</span>}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
