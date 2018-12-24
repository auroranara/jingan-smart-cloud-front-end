import React, { PureComponent } from 'react';
import Section from '../components/Section/Section.js';
import SignalAnime from '../../Monitor/Components/SignalAnime';
import logoFireHost from '../images/fire-host.png';
import dashedArrow from '../images/dashed-arrow.png';
import styles from './FireHostMonitoring.less';

export default class FireHostMonitoring extends PureComponent {

  render() {
    const {
      fixedContent,
      onClick,
      data: {
        fire_state = 0,   // 火警
        fault_state = 0,  // 故障
        start_state = 0,  //  联动
        supervise_state = 0, // 监管
        shield_state = 0,    // 屏蔽
        feedback_state = 0, // 反馈
      },
    } = this.props
    return (
      <Section title="消防主机监测" fixedContent={fixedContent}>
        <div className={styles.fireHostMonitoring}>
          <div className={styles.logoContainer}>
            <div className={styles.hostLogo}
              style={{
                backgroundImage: `url(${logoFireHost})`,
                backgroundRepeat: 'no-repeat',
                groundPosition: 'center center',
                backgroundSize: '100% 100%',
              }}></div>
            <div className={styles.animate}>
              <SignalAnime />
            </div>
          </div>
          <div className={styles.mainContainer}>
            <div className={styles.innerContent}
              style={{
                backgroundImage: `url(${dashedArrow})`,
                backgroundRepeat: 'no-repeat',
                groundPosition: 'center center',
                backgroundSize: '100% 100%',
              }}>
              <div className={styles.middleItem} style={{ left: 'calc(20% - 15px)', top: '40%' }} onClick={() => onClick('火警')}>
                <span style={{ color: '#F64747' }}>{fire_state}</span>
                <div><span>火警</span></div>
              </div>
              <div className={styles.middleItem} style={{ left: 'calc(80% - 15px)', top: '40%' }} onClick={() => onClick('故障')}>
                <span style={{ color: '#01A8FF' }}>{fault_state}</span>
                <div><span>故障</span></div>
              </div>
              <div className={styles.bottomItem} style={{ left: 'calc(2% - 13px)', top: '100%' }} onClick={() => onClick('联动')}>
                <span style={{ color: '#00AAC5' }}>{start_state}</span>
                <div><span>联动</span></div>
              </div>
              <div className={styles.bottomItem} style={{ left: 'calc(34% - 13px)', top: '100%' }} onClick={() => onClick('监管')}>
                <span style={{ color: '#F6B547' }}>{supervise_state}</span>
                <div><span>监管</span></div>
              </div>
              <div className={styles.bottomItem} style={{ left: 'calc(66% - 13px)', top: '100%' }} onClick={() => onClick('屏蔽')}>
                <span style={{ color: '#837CE5' }}>{shield_state}</span>
                <div><span>屏蔽</span></div>
              </div>
              <div className={styles.bottomItem} style={{ left: 'calc(98% - 13px)', top: '100%' }} onClick={() => onClick('反馈')}>
                <span style={{ color: '#BCBCBB' }}>{feedback_state}</span>
                <div><span>反馈</span></div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    )
  }
}
