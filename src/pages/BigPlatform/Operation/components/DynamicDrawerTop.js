import { Component } from 'react';
import styles from './DynamicDrawerTop.less'

import bakFlag from '@/assets/bac-flag.png'
import bakFlagFill from '@/assets/bac-flag-fill.png'

export default class DynamicDrawerTop extends Component {

  state = {
    showRepeatDesc: false,
  }
  render() {
    const { showRepeatDesc } = this.state
    return (
      <div className={styles.dynamicDrawerTop}>
        <div className={styles.companyInfoContainer}>
          <div className={styles.title}>无锡晶安智慧科技有限公司</div>
          <div className={styles.line}>详细位置：5号楼五楼</div>
          <div className={styles.line}>回路号：100000</div>
          <div className={styles.line} style={{ marginBottom: 0 }}>部件号：100000</div>
          <div className={styles.logoContainer} style={{ top: 0, right: '24px' }}>
            <div
              className={styles.logo}
              style={{
                backgroundImage: `url(${showRepeatDesc ? bakFlagFill : bakFlag}) center center no-repeat`,
              }}
              onMouseEnter={() => this.setState({ showRepeatDesc: true })}
              onMouseLeave={() => this.setState({ showRepeatDesc: false })}>
              {/* <FlagLogo width={43} height={44} isStroke={!showRepeatDesc} isFill={showRepeatDesc} /> */}

              <div>5</div>
            </div>
            <div className={styles.desc}>重复上报次数</div>
          </div>
          <div className={styles.repeatDesc} style={{ bottom: '16px', right: '22px', visibility: showRepeatDesc ? 'visible' : 'hidden' }}>
            <div>首次发生事件：2019-02-22 23：22：23</div>
            <div>最近发生事件：2019-02-22 23：22：23</div>
          </div>
        </div>
        <div className={styles.messageSendingContainer}>
          <div className={styles.topLine}>
            <span>报警消息已发送成功！</span>
            <span>共发送 12 人</span>
          </div>

        </div>
      </div>
    )
  }
}
