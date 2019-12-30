import React, { PureComponent } from 'react';
import Section from '@/components/Section';
import HiddenDanger from '../HiddenDanger';
// import noHiddenDanger from '../../img/noHiddenDanger.png';
import styles from './index.less';

/**
 * description: 当前隐患
 * author: sunkai
 * date: 2018年12月12日
 */

const noHiddenDanger = 'http://data.jingan-china.cn/v2/chem/screen/noHiddenDanger.png';
export default class CurrentHiddenDanger extends PureComponent {
  render() {
    const {
      closable=true,
      onClose,
      model: {
        hiddenDangerList: { ycq = [], wcq = [], dfc = [] },
      },
    } = this.props;

    return (
      <Section
        title="当前隐患"
        closable={closable}
        isScroll
        onClose={onClose}
        contentStyle={{ position: 'relative' }}
        fixedContent={(
          <div className={styles.countList}>
            <div className={styles.countItem}>
              <div>{ycq.length}</div>
              <div style={{ color: '#ff4848' }}>已超期</div>
            </div>
            <div className={styles.countItem}>
              <div>{wcq.length}</div>
              <div>未超期</div>
            </div>
            <div className={styles.countItem}>
              <div>{dfc.length}</div>
              <div>待复查</div>
            </div>
          </div>
        )}
      >
        {/* 隐患缺省图 */
          (ycq.length+wcq.length+dfc.length) === 0 && (
            <div className={styles.noHiddenDanger} style={{ backgroundImage: `url(${noHiddenDanger})` }}></div>
          )
        }
        {/* 已超期列表 */
          ycq.map(item => {
            const { id } = item;
            return (
              <HiddenDanger key={id} data={item} isSourceShow />
            );
          })
        }
        {/* 未超期列表 */
          wcq.map(item => {
            const { id } = item;
            return (
              <HiddenDanger key={id} data={item} isSourceShow />
            );
          })
        }
        {/* 待复查列表 */
          dfc.map(item => {
            const { id } = item;
            return (
              <HiddenDanger key={id} data={item} isSourceShow />
            );
          })
        }
      </Section>
    );
  }
}
