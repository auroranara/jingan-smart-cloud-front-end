import React, { PureComponent } from 'react';
import { Row, Col, Icon } from 'antd';
import Section from '../Section';
import DescriptionList from 'components/DescriptionList';
import styles from './index.less';

/**
 * description: 点位巡查统计
 * author: sunkai
 * date: 2018年12月03日
 */
const { Description } = DescriptionList;
export default class App extends PureComponent {
  renderMsg = () => {
    return (
      <div className={styles.msgItem}>
        <a className={styles.detailBtn}>详情<Icon type="double-right" /></a>
        <div className={styles.msgTime}>11-28 09:30:21</div>
        <div className={styles.msgType}>【发生火警】</div>
        <div className={styles.msgBody}>王强上报一条隐患：厂区二车间有人未带安全帽</div>
        <div className={styles.msgBody}>王强上报一条隐患：厂区二车间有人未带安全帽</div>
      </div>
    );
  };

  render() {
    const { model } = this.props;

    return (
      <Section title="实时消息" style={{ height: 'auto' }}>
        <div className={styles.messages}>
          {Array(8).fill(true).map(()=>{
            return  this.renderMsg();
          })}
        </div>
      </Section>
    );
  }
}
