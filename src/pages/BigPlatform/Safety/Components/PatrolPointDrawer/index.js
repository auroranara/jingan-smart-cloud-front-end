import React, { PureComponent } from 'react';
import { Drawer } from 'antd';
import Section from '@/components/Section';
import HiddenDanger from '../HiddenDanger';
import RiskCard from '../RiskCard';

import styles from './index.less';

/**
 * description: 巡查点抽屉
 * author: sunkai
 * date: 2018年11月29日
 */
export default class App extends PureComponent {

  render() {
    const {
      // 抽屉组件可以设置的属性对象
      drawerProps,
      // 数据源
      data: {
        hiddenDangerList=[],
        riskCardList=[{id:1}],
      }={},
    } = this.props;
    const { onClose } = drawerProps;

    return (
      <Drawer
        width="500px"
        closable={false}
        style={{ padding: 0, height: '100%', background: 'url(http://data.jingan-china.cn/v2/big-platform/safety/com/company-bg.png) no-repeat right center / auto 100%' }}
        {...drawerProps}
      >
        <Section
          isScroll
          closable
          style={{ color: '#fff' }}
          title="巡查点位详情"
          onClose={onClose}
        >
          <div className={styles.list}>
            <div className={styles.title}>风险点详情</div>
            <div className={styles.content}>
              {riskCardList.map(item => (
                <RiskCard
                  key={item.id}
                  data={item}
                />
              ))}
            </div>
          </div>
          <div className={styles.list}>
            <div className={styles.title}>隐患详情 ({hiddenDangerList.length})</div>
            <div className={styles.content}>
              {hiddenDangerList.map(item => (
                <HiddenDanger
                  key={item.id}
                  data={item}
                  isSourceShow
                />
              ))}
            </div>
          </div>
        </Section>
      </Drawer>
    );
  }
}
