import React, { PureComponent } from 'react';
import Section from '@/components/Section';
import HiddenDanger from '../HiddenDanger';
import RiskCard from '../../Components/RiskCard';

import styles from './index.less';

/**
 * description: 巡查点位详情
 * author: sunkai
 * date: 2018年12月13日
 */
export default class InspectionPoint extends PureComponent {
  render() {
    const {
      onClose,
      data: {
        riskCardList=[{ id: 1 }],
        hiddenDangerList=[],
      }={},
    } = this.props;
    console.log(hiddenDangerList);

    return (
      <Section
        isScroll
        closable
        title="巡查点位详情"
        titleStyle={{ marginBottom: 0 }}
        onClose={onClose}
      >
          <div className={styles.list}>
            <div className={styles.title}>风险点详情</div>
            {riskCardList.length > 0 ? (
              <div className={styles.content}>
                {riskCardList.map(item => (
                  <RiskCard
                    key={item.id}
                    data={item}
                  />
                ))}
              </div>
            ) : <div style={{ textAlign: 'center' }}>暂无风险点</div>}
          </div>
          <div className={styles.list}>
            <div className={styles.title}>隐患详情 ({hiddenDangerList.length})</div>
            {hiddenDangerList.length > 0 ? (
              <div className={styles.content}>
                {hiddenDangerList.map(item => (
                  <HiddenDanger
                    key={item.id}
                    data={item}
                    isSourceShow
                  />
                ))}
              </div>
            ) : <div style={{ textAlign: 'center' }}>暂无隐患</div>}
          </div>
      </Section>
    );
  }
}
